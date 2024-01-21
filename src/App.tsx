import { Routes, Route } from "react-router-dom";
import { SigninForm, SignupForm } from "./_auth/forms";
import { Home } from "./_root/pages";
import AuthLayout from "./_auth/AuthLayout";
import RootLayout from "./_root/RootLayout";

function App() {
	return (
		<main className="flex">
			<Routes>
				{/* public routes */}
				<Route element={<AuthLayout />}>
					<Route path="/sign-in" element={<SigninForm />} />
					<Route path="/sign-up" element={<SignupForm />} />
				</Route>

				{/* private routes */}
				<Route element={<RootLayout />}>
					<Route index element={<Home />} />
				</Route>
			</Routes>
		</main>
	);
}
export default App;
