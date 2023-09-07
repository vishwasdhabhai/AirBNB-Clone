import { useContext, useEffect, useState } from "react";
import { differenceInCalendarDays } from "date-fns";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "./UserContext";

function BookingWidget({ place }) {
	const [checkIn, setCheckIn] = useState("");
	const [checkOut, setCheckOut] = useState("");
	const [numberOfGuests, setNumberOfGuests] = useState("");
	const [name, setName] = useState("");
	const [phone, setPhone] = useState("");
	const [redirect, setRedirect] = useState("");
	const { user } = useContext(UserContext);
	useEffect(() => {
		if (user) {
			setName(user.name);
		}
	}, [user]);
	async function bookThisPlace() {
		const response = await axios.post("/bookings", {
			place: place._id,
			checkIn,
			checkOut,
			name,
			numberOfGuests,
			phone,
			amount,
		});
		const bookingId = response.data._id;
		setRedirect(`/account/bookings/${bookingId}`);
	}

	let numberOfNights = 0;
	let amount = 0;
	if (checkIn && checkOut) {
		numberOfNights = differenceInCalendarDays(
			new Date(checkOut),
			new Date(checkIn)
		);
		amount = numberOfNights * place.price;
	}

	if (redirect) {
		return <Navigate to={redirect} />;
	}

	return (
		<div className="bg-white shadow p-4 rounded-2xl">
			<div className="text-2xl text-center">
				Price: &#8360;. {place.price} /night
			</div>
			<div className="border rounded-2xl mt-4">
				<div className="flex justify-around">
					<div className="py-3 px-4 border-r">
						<label className=" mr-2 text-left">Check-In:</label>
						<input
							className="mx-2 py-2 rounded-2xl"
							value={checkIn}
							onChange={(ev) => setCheckIn(ev.target.value)}
							type="date"
						/>
					</div>
					<div className="py-3 px-4 border-l">
						<label className="mr-2 text-left">Check-Out:</label>
						<input
							className="mx-2 py-2 rounded-2xl"
							value={checkOut}
							onChange={(ev) => setCheckOut(ev.target.value)}
							type="date"
						/>
					</div>
				</div>
				<div className="py-3 border-t px-4">
					<label>No. of Guest</label>
					<input
						type="text"
						pattern="[0-9]*"
						inputMode="numeric"
						placeholder={`Max Guest: ${place.maxGuest}`}
						value={numberOfGuests}
						onChange={(ev) => setNumberOfGuests(ev.target.value)}
					/>
				</div>
				{numberOfNights > 0 && (
					<div className="py-3 px-4 border-t">
						<label>Your Name:</label>
						<input
							type="text"
							value={name}
							onChange={(ev) => setName(ev.target.value)}
						/>
						<label>phone:</label>
						<input
							type="tel"
							value={phone}
							onChange={(ev) => setPhone(ev.target.value)}
						/>
					</div>
				)}
			</div>
			<button onClick={bookThisPlace} className="primary mt-4">
				Book this Place!
				{numberOfNights > 0 && (
					<span className="font-semibold"> &#8360; {amount}</span>
				)}
			</button>
		</div>
	);
}

export default BookingWidget;
