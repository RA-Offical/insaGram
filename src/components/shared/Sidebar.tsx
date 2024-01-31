import { useGetUsers } from "@/lib/react-query/queriesAndMutations";
import UserCard from "./UserCard";
import UserCardSkeleton from "@/components/skeletons/UserCardSkeleton.tsx";

function Sidebar() {
  const { data: users, isPending: isFetchingUser } = useGetUsers(10);

  return (
    <div className="home-creators">
      <h2 className="h3-bold text-light-1">Top Creators</h2>

      <div className="grid 2xl:grid-cols-2 gap-6 mt-4">
        {isFetchingUser && !users ? (
          <UserCardSkeleton />
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
