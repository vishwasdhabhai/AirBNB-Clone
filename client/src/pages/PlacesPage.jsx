import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AccountNav from "../AccountNav";
import axios from "axios";
import PlaceImg from "../PlaceImg";

function PlacesPage() {
	const [places, setPlaces] = useState([]);
	useEffect(() => {
		axios.get("/user-places").then(({ data }) => {
			setPlaces(data);
		});
	}, []);
	return (
		<div>
			<AccountNav />
			<div className="text-center">
				<Link
					className="inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full"
					to={"/account/places/new"}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="currentColor"
						className="w-6 h-6"
					>
						<path
							fillRule="evenodd"
							d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z"
							clipRule="evenodd"
						/>
					</svg>
					Add new place
				</Link>
			</div>
			<div className="mt-4">
				{places.length > 0 &&
					places.map((place, index) => (
						<Link to={'/account/places/'+place._id} className="bg-gray-100 gap-4 cursor-pointer flex p-4 mb-3 rounded-2xl" key={index}>
							<div className="flex w-32 h-32 grow shrink-0">
								<PlaceImg place={place}  />
							</div>
							<div className="grow-0 shrink">
								<h2 className="text-xl font-semibold">{place.title}</h2>
								<p className="text-sm mt-2">{place.description}</p>
							</div>
						</Link>
					))}
			</div>
		</div>
	);
}

export default PlacesPage;
