import { useContext, useState } from "react";
import { UserContext } from "../UserContext";
import { Navigate, useParams } from "react-router-dom";
import axios from "axios";
import PlacesPage from "./PlacesPage";
import AccountNav from "../AccountNav";

function ProfilePage() {
	const { ready, setUser, user } = useContext(UserContext);
	const [reditect, setReditect] = useState(null);

	// eslint-disable-next-line react-hooks/rules-of-hooks
	let { subpage } = useParams();
	if (subpage == undefined) {
		subpage = "profile";
	}

	async function logout() {
		const data = await axios.post("/logout");
		setReditect("/");
		setUser(null);
		// alert(data.data.message);
	}
	if (!ready) {
		return "Loading...";
	}

	if (ready && !user && !reditect) {
		return <Navigate to={"/login"} />;
	}

	if (reditect) {
		return <Navigate to={reditect} />;
	}


	return (
		<div>
			<AccountNav/>
			{subpage === "profile" && (
				<div className="text-center max-w-lg mx-auto">
					Logged in as {user.name} ({user.email}) <br />
					<button onClick={logout} className="primary max-w-sm mt-2">
						Logout
					</button>
				</div>
			)}
			{subpage === "places" && (
				<div>
					<PlacesPage />
				</div>
			)}
		</div>
	);
}

export default ProfilePage;
