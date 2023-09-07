import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import BookingWidget from "../BookingWidget";
import { UserContext } from "../UserContext";
import PlaceGallery from "../PlaceGallery";
import AddressLink from "../AddressLink";

function PlacePage() {
	const { id } = useParams();
	const [place, setPlace] = useState(null);
	const { user } = useContext(UserContext);
	useEffect(() => {
		if (!id) {
			return;
		}
		axios.get(`/places/${id}`).then((response) => {
			setPlace(response.data);
		});
	}, [id]);
	if (!place) {
		return "";
	}

	return (
		<div className="mt-4 pt-8 bg-gray-100 -mx-8 px-8">
			<h1 className="text-3xl">{place.title}</h1>
			<AddressLink >{place.address}</AddressLink>
			<PlaceGallery place={place} />
			<div className="mt-8 mb-8 grid gap-8 grid-cols-1 md:grid-cols-[2fr_1fr]">
				<div className="font-semibold">
					<div className="my-4">
						<h2 className="font-bold text-2xl">Description</h2>
						{place.description}
					</div>
					<label className=" font-normal"> Owner:</label> {user?.name}
					<br />
					<label className=" font-normal"> Check-In:</label> {place.checkIn}
					<br />
					<label className=" font-normal"> Check-Out:</label> {place.checkOut}
					<br />
					<label className=" font-normal"> Max Guests:</label> {place.maxGuest}
				</div>
				<div className="">
					<BookingWidget place={place} />
				</div>
			</div>
			<div className="bg-white -mx-8 px-8 py-8 border-t">
				<div>
					<h2 className="font-bold text-2xl">Extra Info</h2>
				</div>
				<div className="my-4 mt-2 text-gray-700 leading-5 font-semibold text-md">
					{place.extraInfo}
				</div>
			</div>
		</div>
	);
}

export default PlacePage;
