import { useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../UserContext";

function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [redirect, setRedirect] = useState(false);
	const { setUser } = useContext(UserContext);
	async function handleLogin(ev) {
		ev.preventDefault();
		try {
			const { data } = await axios.post(
				"/login",
				{ email, password },
				{ withCredentials: true }
			);
			// console.log(data);
			setUser(data);
			// alert("Login successful");
			setRedirect(true);
		} catch (err) {
			alert(err.response.data.alert);
		}
	}
	if (redirect) {
		return <Navigate to={"/"} />;
	}
	return (
		<div className="mt-4 grow flex items-center justify-around font-semibold">
			<div className="mb-64">
				<h1 className="text-4xl text-center mb-4">Login</h1>
				<form action="" className="max-w-md mx-auto" onSubmit={handleLogin}>
					<input
						type="email"
						placeholder="mike@email.com"
						onChange={(ev) => setEmail(ev.target.value)}
					/>
					<input
						type="password"
						placeholder="password"
						onChange={(ev) => setPassword(ev.target.value)}
					/>
					<button className="primary">Login</button>
					<div className="text-center py-2 text-gray-500">
						<div>
							Don&apos;t have an account yet?{" "}
							<Link className="hover:underline text-black" to="/signup">
								Sign up
							</Link>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
}

export default LoginPage;
