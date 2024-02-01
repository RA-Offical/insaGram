import PostSkeleton from "@/components/skeletons/PostSkeleton.tsx";

type GridPostSkeleton = {
  showStats?: boolean;
  showUser?: boolean;
};

function GridPostSkeleton({
  showStats = true,
  showUser = true,
}: GridPostSkeleton) {
  return (
    <div className={"grid-container"}>
      {Array.from({ length: 9 }).map((_, index: number) => (
        <PostSkeleton
          key={`post-skeleton-${index}`}
          showStats={showStats}
          showUser={showUser}
        />
      ))}
    </div>
  );
}

export default GridPostSkeleton;
