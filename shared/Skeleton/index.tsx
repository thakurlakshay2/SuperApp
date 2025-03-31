import React from "react";
import clsx from "clsx";

interface SkeletonComponentProps {
  isLoading: boolean;
  children?: React.ReactNode;
  width?: string;
  height?: string;
  type?: "circle" | "chart" | "bar";
}

const Skeleton: React.FC<SkeletonComponentProps> = ({
  isLoading,
  children,
  width = "w-4",
  height = "h-4",
  type = "bar",
}) => {
  if (isLoading) {
    switch (type) {
      case "circle":
        return (
          <p
            className={`flex justify-center items-center bg-gray-300 rounded-full ${width} ${height} animate-pulse`}
          />
        );
      case "chart":
        return (
          <div
            className={clsx(
              "relative",
              width,
              height,
              "overflow-hidden",
              "animate-pulse"
            )}
          >
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 100 50"
              preserveAspectRatio="none"
              className="absolute top-0 left-0"
            >
              {/* Single, smooth line for the chart animation */}
              <polyline
                fill="none"
                stroke="rgb(209 213 219)" /* gray-300 */
                strokeWidth="2"
                points="0,25 10,20 20,30 30,20 40,30 50,25 60,30 70,20 80,30 90,25 100,30"
                className="line-animation"
              />
            </svg>

            <style jsx>{`
              .line-animation {
                stroke-dasharray: 200;
                stroke-dashoffset: 200;
                animation: draw 2s linear infinite;
              }

              @keyframes draw {
                0% {
                  stroke-dashoffset: 400;
                }
                50% {
                  stroke-dashoffset: 200;
                }
                100% {
                  stroke-dashoffset: 0;
                }
              }
            `}</style>
          </div>
        );
      default:
        return (
          <p
            className={`${height} bg-gray-300 ${width} animate-pulse rounded-full`}
          />
        );
    }
  } else {
    return <>{children}</>;
  }
};

export default Skeleton;
