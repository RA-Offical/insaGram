import { Outlet, Navigate } from "react-router-dom";
function AuthLayout() {
	const isAuthenticated = false;

	return (
		<>
			{isAuthenticated ? (
				<Navigate to={"/"} />
			) : (
				<>
					<section className="flex flex-auto justify-center items-center flex-col py-10">
						<Outlet />
					</section>

					<img
						src="/assets/images/side-img.svg"
						alt="logo"
						className="hidden xl:block sticky xl:top-0 w-[1/2] h-screen object-cover"
					/>
				</>
			)}
		</>
	);
}
export default AuthLayout;
