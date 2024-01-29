import { useUserContext } from "@/context/AuthContext";
import { Models } from "appwrite";
import { Link } from "react-router-dom";
import PostStats from "./PostStats";

type GridPostListProps = {
	posts: Models.Document[];
	showUser?: boolean;
	showStats?: boolean;
};

function GridPostList({ posts, showUser = true, showStats = true }: GridPostListProps) {
	const { user } = useUserContext();

	console.log(posts);

	return (
		<ul className="grid-container">
			{posts.map((post: Models.Document) => (
				<li key={post.$id} className="w-full h-80 relative">
					<Link to={`/posts/${post.$id}`} className="grid-post_link">
						<img src={post.imageUrl} alt="post" className="h-full w-full object-cover object-top" />
					</Link>

					<div className="grid-post_user">
						{showUser && (
							<Link
								to={`/profile/${post.creator.$id}`}
								className="flex items-center justify-start gap-2 flex-1">
								<img
									src={post.creator?.imageUrl || "/assets/icons/profile-placeholder.svg"}
									alt="Creator"
									className="h-8 w-8 rounded-full"
								/>
								<p className="line-clamp-1">{post.creator.name}</p>
							</Link>
						)}

						{showStats && <PostStats post={post} userId={user.id} />}
					</div>
				</li>
			))}
		</ul>
	);
}
export default GridPostList;
