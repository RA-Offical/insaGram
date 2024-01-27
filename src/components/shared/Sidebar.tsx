import { useGetUsers } from "@/lib/react-query/queriesAndMutations";
import Loader from "./Loader";
import UserCard from "./UserCard";

function Sidebar() {
	const { data: users, isPending: isFetchingUser } = useGetUsers(10);

	return (
		<div className="home-creators">
			<h2 className="h3-bold text-light-1">Top Creators</h2>

			<div className="grid 2xl:grid-cols-2 gap-6 mt-8">
				{isFetchingUser && !users ? (
					<Loader />
				) : (
					<>
						{users?.documents.map((user) => (
							<UserCard key={user.$id} user={user} />
						))}
					</>
				)}
			</div>
		</div>
	);
}
export default Sidebar;
