import { sidebarLinks } from "@/constants";
import { useUserContext } from "@/context/AuthContext";
import { INavLink } from "@/types";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import { useSignOutAccount } from "@/lib/react-query/queriesAndMutations";

function LeftSidebar() {
	const { user } = useUserContext();
	const { pathname } = useLocation();
	const { mutate: signOut } = useSignOutAccount();

	return (
		<nav className="leftsidebar h-screen">
			<div className="flex flex-col gap-11 overflow-hidden">
				{/* logo */}
				<Link to="/">
					<img src="/assets/images/logo.svg" alt="logo" width={130} height={325} />
				</Link>

				{/* Account profile */}
				<Link to={`/profile/${user.id}`} className="flex gap-3 items-center">
					<img
						src={`${user.imageUrl || "/assets/images/profile-placeholder.svg"}`}
						alt="profile"
						className="h-14 w-14 rounded-full"
					/>

					<div className="flex flex-col">
						<p className="body-bold">{user.name}</p>

						<p className="small-regular">@{user.username}</p>
					</div>
				</Link>
				{/* Links */}
				<ul className="flex flex-1 flex-col gap-5 overflow-auto custom-scrollbar">
					{sidebarLinks.map((link: INavLink) => {
						const isActive = pathname === link.route;
						return (
							<li
								key={link.label}
								className={`leftsidebar-link group ${isActive && "bg-primary-500"}`}>
								<NavLink to={link.route} className="flex items-center gap-4 p-4">
									<img
										src={link.imgURL}
										alt={link.label}
										className={`group-hover:invert-white ${isActive && "invert-white"}`}
									/>
									{link.label}
								</NavLink>
							</li>
						);
					})}
				</ul>
			</div>

			<Button variant="ghost" onClick={() => signOut()} className="shad-button_ghost mt-4">
				<img src="/assets/icons/logout.svg" />
				<p className="small-medium lg:base-medium">Logout</p>
			</Button>
		</nav>
	);
}
export default LeftSidebar;
