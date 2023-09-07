const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const imageDownloader = require("image-downloader");
const multer = require("multer");
const fs = require("fs");
const cookieParser = require("cookie-parser");
const User = require("./models/User");
const Place = require("./models/Place");
const BookingModel = require("./models/Booking");

require("dotenv").config();

const app = express();
const jwtSecret = process.env.JWT_SECRET;
const bcryptSalt = bcrypt.genSaltSync(10);
app.use(express.json());
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(cookieParser());
app.use(
	cors({
		credentials: true,
		origin: "http://localhost:5173",
	})
);

mongoose.connect(process.env.MONGO_URL);

app.get("/test", (req, res) => {
	res.json("test ok");
});

app.post("/login", async (req, res) => {
	const { email, password } = req.body;
	const foundUser = await User.findOne({ email });
	if (foundUser) {
		const passok = bcrypt.compareSync(password, foundUser.password);
		if (passok) {
			jwt.sign(
				{ email: foundUser.email, id: foundUser._id },
				jwtSecret,
				{},
				(err, token) => {
					if (err) throw err;
					res.cookie("token", token).json(foundUser);
				}
			);
		} else {
			res.status(422).json({ alert: "Invalid password" });
		}
	} else {
		res.status(404).json({ alert: "User not found" });
	}
});

app.post("/logout", (req, res) => {
	res.clearCookie("token").json({ message: "Logout Successful" });
});

app.post("/signup", async (req, res) => {
	const { name, email, password } = req.body;

	try {
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res
				.status(400)
				.json({ alert: "Email already taken, Please Login" });
		}
		const newUser = await User.create({
			name,
			email,
			password: bcrypt.hashSync(password, bcryptSalt),
		});
		res.json({ message: "User created successfully, Please Login" });
	} catch (err) {
		res.status(500).json({ alert: "Something went wrong" });
	}
});

app.get("/profile", (req, res) => {
	const { token } = req.cookies;
	if (token) {
		jwt.verify(token, jwtSecret, {}, async (err, userData) => {
			if (err) throw err;
			const { name, email, _id } = await User.findById(userData.id);
			res.json({ name, email, _id });
		});
	} else {
		res.json(null);
	}
});

app.post("/upload-by-link", async (req, res) => {
	const { link } = req.body;
	const newName = "photo" + Date.now() + ".jpg";
	await imageDownloader.image({
		url: link,
		dest: __dirname + "/uploads/" + newName,
	});
	res.json(newName);
});

const photosMiddleware = multer({ dest: __dirname + "/uploads/" });
app.post("/upload", photosMiddleware.array("photos", 100), async (req, res) => {
	const uploadedFiles = [];
	for (let i = 0; i < req.files.length; i++) {
		const { path, originalname } = req.files[i];
		const parts = originalname.split(".");
		const ext = parts[parts.length - 1];
		const newPath = path + "." + ext;
		fs.renameSync(path, newPath); // rename file
		uploadedFiles.push(newPath.split("\\")[newPath.split("\\").length - 1]);
	}
	res.json(uploadedFiles);
});

app.get("/user-places", (req, res) => {
	const { token } = req.cookies;
	jwt.verify(token, jwtSecret, {}, async (err, userData) => {
		const { id } = userData;
		res.json(await Place.find({ owner: id }));
	});
});

app.post("/places", (req, res) => {
	const { token } = req.cookies;
	const {
		title,
		address,
		addedPhotos,
		description,
		perks,
		extraInfo,
		checkIn,
		checkOut,
		maxGuest,
		price,
	} = req.body;
	jwt.verify(token, jwtSecret, {}, async (err, userData) => {
		if (err) throw err;
		const placeDoc = await Place.create({
			owner: userData.id,
			title,
			address,
			photos: addedPhotos,
			description,
			perks,
			extraInfo,
			checkIn,
			checkOut,
			maxGuest,
			price,
		});
		res.json(placeDoc);
	});
});

app.get("/places/:id", async (req, res) => {
	const { id } = req.params;
	res.json(await Place.findById(id));
});

app.put("/places", async (req, res) => {
	const { token } = req.cookies;
	const {
		id,
		title,
		address,
		addedPhotos,
		description,
		perks,
		extraInfo,
		checkIn,
		checkOut,
		maxGuest,
		price,
	} = req.body;
	jwt.verify(token, jwtSecret, {}, async (err, userData) => {
		if (err) throw err;
		const placeDoc = await Place.findById(id);
		if (placeDoc.owner.toString() === userData.id) {
			placeDoc.set({
				title,
				address,
				photos: addedPhotos,
				description,
				perks,
				extraInfo,
				checkIn,
				checkOut,
				maxGuest,
				price,
			});
			await placeDoc.save();
			res.json("done");
		}
	});
});

function getUserDataFromReq(req) {
	return new Promise((resolve, reject) => {
		jwt.verify(req.cookies.token, jwtSecret, {}, async (err, userData) => {
			if (err) throw err;
			resolve( userData);
		});
	});
}

app.get("/bookings", async (req, res) => {
	const userData = await getUserDataFromReq(req);  
	res.json(await BookingModel.find({user:userData.id}).populate("place"));
});

app.post("/bookings", async (req, res) => {
	const userData = await getUserDataFromReq(req);
	const { place, checkIn,checkOut, name, numberOfGuests, phone, amount } = req.body;
	// console.log({ place, checkIn,checkOut, name, numberOfGuests, phone, amount});
	BookingModel.create({
		place,
		user: userData.id,
		checkIn,
		checkOut,
		name,
		numberOfGuests,
		phone,
		price:amount,
	})
		.then((doc) => {
			res.json(doc);
		})
		.catch((err) => {
			throw err;
		});
});

app.get("/places", async (req, res) => {
	res.json(await Place.find());
});

app.listen(3000, () => {
	console.log("server is listening on port 3000");
});
