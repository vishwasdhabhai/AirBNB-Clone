import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function IndexPage() {
	const [places, setPlaces] = useState([]);
	useEffect(() => {
		axios.get("/places").then((response) => {
			// setPlaces([...response.data,...response.data]);
			setPlaces(response.data);
		});
	}, []);
	return (
		<>
			<div className="mt-8 grid gap-x-6 gap-y-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
				{places.length > 0 &&
					places.map((place, index) => (
						<Link to={"/place/" + place._id} key={index}>
							<div className="bg-gray-500 mb-2 rounded-2xl flex">
								{place.photos?.[0] && (
									<img
										className="rounded-2xl object-cover aspect-square "
										src={"http://localhost:3000/uploads/" + place.photos?.[0]}
										alt={place.photos?.[0]}
									/>
								)}
							</div>
							<h2 className="font-bold">{place.address}</h2>
							<h3 className="text-sm text-gray-700">{place.title}</h3>
							<div className="mt-1">
								<span className="font-bold">&#8360;. {place.price} /night</span>
							</div>
						</Link>
					))}
			</div>
		</>
	);
}

export default IndexPage;
