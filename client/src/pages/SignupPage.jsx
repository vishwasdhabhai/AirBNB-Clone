import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function SignupPage() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	async function SignupUser(ev) {
		ev.preventDefault();
		try{
			await axios.post("http://localhost:3000/signup", {
				name,
				email,
				password,
			});
			alert("User created successfully, Please Login");
		}
		catch(err){
			alert(err.response.data.alert);
		}
	}
	return (
		<div className="mt-4 grow flex items-center justify-around font-semibold">
			<div className="mb-64">
				<h1 className="text-4xl text-center mb-4">Sign up</h1>
				<form action="" className="max-w-md mx-auto" onSubmit={SignupUser}>
					<input
						type="text"
						value={name}
						placeholder="John young"
						onChange={(ev) => setName(ev.target.value)}
					/>
					<input
						type="email"
						value={email}
						placeholder="mike@email.com"
						onChange={(ev) => setEmail(ev.target.value)}
					/>
					<input
						type="password"
						value={password}
						placeholder="password"
						onChange={(ev) => setPassword(ev.target.value)}
					/>
					<button className="primary">Sign up</button>
					<div className="text-center py-2 text-gray-500">
						<div>
							Already have an account?{" "}
							<Link className="hover:underline text-black" to="/login">
								Login
							</Link>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
}

export default SignupPage;
