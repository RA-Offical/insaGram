import { useSkeletonThemeContext } from "@/context/SkeletonThemeContext.tsx";
import classNames from "classnames";

type SkeletonProps = {
  className?: string;
  count?: number;
  circle?: boolean;
  style?: {
    [key: string]: any;
  };
};

function Skeleton({ className, count = 1, circle, style }: SkeletonProps) {
  const { baseColor } = useSkeletonThemeContext();
  const spanCount = Math.floor(count);
  const hasHalfSpanCount = count % 1 !== 0;
  const halfWidth = hasHalfSpanCount ? (count % 1) * 100 : 100;

  return (
    <>
      {Array.from({ length: spanCount }).map((_, index: number) => {
        return (
          <span
            style={style}
            key={`skeleton-${index}`}
            className={classNames(
              "w-full rounded-xl block animate-pulse",
              className,
              baseColor,
              {
                "!rounded-full": circle,
              },
            )}
          >
            &zwnj;
          </span>
        );
      })}
      {hasHalfSpanCount && (
        <Skeleton
          className={classNames(className)}
          circle={circle}
          style={{ width: `${halfWidth}%` }}
        />
      )}
    </>
  );
}

export default Skeleton;
