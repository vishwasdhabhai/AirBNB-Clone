import { useEffect, useState } from "react";
import Perks from "../Perks";
import PhotosUploader from "../PhotosUploader";
import axios from "axios";
import AccountNav from "../AccountNav";
import { Navigate, useParams } from "react-router-dom";

function PlacesFormPage() {
	const {id} =useParams();
	const [title, setTitle] = useState("");
	const [address, setAddress] = useState("");
	const [addedPhotos, setAddedPhotos] = useState([]);
	const [description, setDescription] = useState("");
	const [perks, setPerks] = useState([]);
	const [extraInfo, setExtraInfo] = useState("");
	const [checkIn, setCheckIn] = useState("");
	const [checkOut, setCheckOut] = useState("");
	const [maxGuest, setMaxGuest] = useState(1);
	const [redirect, setRedirect] = useState(false);
	const [price,SetPrice]=useState(1000)

	useEffect(()=>{
		if(!id){
			return;
		}
		axios.get('/places/'+id).then(response =>{
			const {data}=response;
			setTitle(data.title);
			setAddress(data.address);
			setAddedPhotos(data.photos);
			setDescription(data.description);
			setPerks(data.perks);
			setExtraInfo(data.extraInfo);
			setCheckIn(data.checkIn);
			setCheckOut(data.checkOut);
			setMaxGuest(data.maxGuest);
			SetPrice(data.price);
		})
	},[id])

	function inputHeader(text) {
		return <h2 className="text-2xl mt-4">{text}</h2>;
	}
	function inputDescription(text) {
		return <p className="text-gray-500 text-sm">{text}</p>;
	}
	function preInput(header, description) {
		return (
			<>
				{inputHeader(header)}
				{inputDescription(description)}
			</>
		);
	}
	async function savePlace(ev) {
		ev.preventDefault();
		const placeData={
			title,address,addedPhotos,description,perks,extraInfo,checkIn,checkOut,maxGuest,price
		};
		if(id){
			await axios.put("/places", {
				id,...placeData
			});
			setRedirect(true);
		}
		else{
			await axios.post("/places", placeData);
			setRedirect(true);
		}
	}
	if (redirect) {
		return <Navigate to="/account/places" />;
	}

	return (
		<div>
        <AccountNav/>
			<form onSubmit={savePlace} action="">
				{preInput(
					"Title",
					"title for your place. should be short and catchy as in advertisement"
				)}
				<input
					type="text"
					value={title}
					onChange={(ev) => setTitle(ev.target.value)}
					placeholder="tilte, for example: my lovely apt"
				/>
				{preInput("Address", "address of your place")}
				<input
					type="text"
					value={address}
					onChange={(ev) => setAddress(ev.target.value)}
					placeholder="address"
				/>
				{preInput("Photos", "more=better")}
				<PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} />
				{preInput("Description", "Description of the place")}
				<textarea
					value={description}
					onChange={(ev) => setDescription(ev.target.value)}
				/>
				{preInput("Perks", "select all the perks of your place")}
				<div className="grid mt-2 gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
					<Perks selected={perks} onChange={setPerks} />
				</div>
				{preInput("Extra info", "house rules, etc")}
				<textarea
					value={extraInfo}
					onChange={(ev) => setExtraInfo(ev.target.value)}
				/>
				{preInput(
					"check in&apos;out times",
					"add check in and out times, remember to have some time window for cleaning the room between guests"
				)}
				<div className="grid gap-2 sm:grid-cols-2 md:grid-cols-4">
					<div>
						<h3 className="mt-2 -mb-1">Check in time</h3>
						<input
							type="text"
							value={checkIn}
							onChange={(ev) => setCheckIn(ev.target.value)}
							placeholder="11:00"
						/>
					</div>
					<div>
						<h3 className="mt-2 -mb-1">Check in time</h3>
						<input
							type="text"
							value={checkOut}
							onChange={(ev) => setCheckOut(ev.target.value)}
							placeholder="18:00"
						/>
					</div>
					<div>
						<h3 className="mt-2 -mb-1">Max number of guests</h3>
						<input
							type="text"
							pattern="[0-9]*"
							inputMode="numeric"
							value={maxGuest}
							onChange={(ev) => setMaxGuest(ev.target.value)}
							placeholder="3"
						/>
					</div>
					<div>
						<h3 className="mt-2 -mb-1">Price Per night</h3>
						<input
							type="text"
							pattern="[0-9]*"
							inputMode="numeric"
							value={price}
							onChange={(ev) => SetPrice(ev.target.value)}
							placeholder="3"
						/>
					</div>
				</div>
				<button className="primary my-4">Save</button>
			</form>
		</div>
	);
}

export default PlacesFormPage;
