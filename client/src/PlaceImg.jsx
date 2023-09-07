
function PlaceImg({ place ,index=0,className=null}) {
	// if (!place.photos?.length) {
	// 	return "";
	// }
    if(!className){
        className="object-cover rounded-full"
    }

	return (
		<img
			className={className}
			src={"http://localhost:3000/uploads/" + place.photos[index]}
			alt={place.photos[index]}
		/>
	);
}

export default PlaceImg;
