import React from "react";
import { TabsProps } from "./typings";
import Link from "next/link";

export const Tabs: React.FC<TabsProps> = ({
  tabList,
  onChange,
  selected,
  variant = "outlined",
}) => {
  const getTabStyles = (isSelected: boolean) => {
    const baseStyles = `
      inline-block py-3 px-4 md:py-4 md:px-6 
      font-medium 
      transition-all duration-300 ease-in-out
      w-full
      whitespace-nowrap
      relative
      overflow-hidden
      transform
    `;

    if (variant === "outlined") {
      return `
        ${baseStyles}
        ${
          isSelected
            ? "font-semibold text-blue-600 border-b-2 border-blue-600 bg-blue-50 md:bg-transparent md:border-b-2 scale-100"
            : "text-gray-500 hover:text-gray-800 border-b-2 border-transparent hover:border-gray-300 scale-95 hover:scale-100"
        }
        rounded-t-lg
      `;
    }

    return `
      ${baseStyles}
      ${
        isSelected
          ? "font-semibold text-white bg-blue-600 scale-100 shadow-md"
          : "text-gray-600 bg-gray-100 hover:bg-gray-200 scale-95 hover:scale-100"
      }
      rounded-lg
      ${!isSelected && "hover:text-gray-900"}
    `;
  };

  return (
    <div className="tabs">
      <div className="block">
        <ul
          className={`
          flex space-x-3 transition-all duration-300 ease-in-out
          ${
            variant === "outlined"
              ? "border-b border-gray-200"
              : "p-2 bg-gray-50 rounded-lg"
          }
        `}
        >
          {tabList.map(({ id, value, redirection }) => {
            const isSelected = selected === id;
            return (
              <li
                className="w-1/2 md:w-fit text-center md:text-left"
                key={`tabs-${id}`}
              >
                <Link
                  data-tab={`tabs-${id}`}
                  role="tab"
                  href={redirection}
                  className={getTabStyles(isSelected)}
                >
                  <span className="relative z-10 transition-transform duration-200 ease-out">
                    {value}
                  </span>
                  {variant === "filled" && isSelected && (
                    <div
                      className="absolute inset-0 bg-blue-600 transform transition-transform duration-300 ease-out"
                      style={{
                        transformOrigin: "left",
                      }}
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
