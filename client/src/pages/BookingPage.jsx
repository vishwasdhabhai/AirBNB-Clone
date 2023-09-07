import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AddressLink from "../AddressLink";
import PlaceGallery from "../PlaceGallery";
import BookingDates from "../BookingDates";

function BookingPage() {
	const { id } = useParams();
	const [booking, setBooking] = useState(null);
	useEffect(() => {
		axios.get("/bookings").then((response) => {
			const findBooking = response.data.find(({ _id }) => _id === id);
			if (findBooking) {
				setBooking(findBooking);
			}
		});
	}, []);
	if (!booking) {
		return "";
	}
	return (
		<div className="my-8">
			<h1 className="text-3xl">{booking.place.title}</h1>
			<AddressLink className="my-2 block">{booking.place.address}</AddressLink>
			<div className="bg-gray-200 p-6 my-6 rounded-2xl flex items-center justify-between">
				<div>
					<h2 className="text-2xl mb-4 ">Your booking Info:</h2>
					<BookingDates booking={booking} />
				</div>
				<div className="bg-primary p-6 text-white rounded-2xl">
					<div>Amount :</div>
					<div className="text-3xl">&#8360; {booking.price}</div>
				</div>
			</div>
			<PlaceGallery place={booking.place} />
		</div>
	);
}

export default BookingPage;