import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import { useGetCurrentUser } from "@/lib/react-query/queriesAndMutations";
import { Models } from "appwrite";

const Saved = () => {
	const { data: currentUser, isPending: isFetchingCurrentUser } = useGetCurrentUser();

	const savedPosts = currentUser?.save.map((savedPost: Models.Document) => ({
		...savedPost.post,
		creator: { imageUrl: currentUser.imageUrl, name: currentUser.name },
	}));

	return (
		<div className="flex flex-col items-center p-5 md:p-8 lg:p-12">
			<div className="flex items-center gap-2 max-5xl">
				<img src="/assets/icons/save.svg" alt="" className="h-9 w-9" />
				<h2 className="h3-bold md:h2-bold text-left w-full">Saved Posts</h2>
			</div>

			{isFetchingCurrentUser && !currentUser ? <Loader /> : <GridPostList posts={savedPosts} />}
		</div>
	);
};
export default Saved;
