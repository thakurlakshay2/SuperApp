function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export const Button = ({ className, variant = "default", ...props }) => {
  return (
    <button
      className={cn(
        "px-4 py-2 rounded-lg font-semibold transition",
        variant === "default" ? "bg-blue-500 text-white hover:bg-blue-600" : "",
        variant === "ghost"
          ? "bg-transparent text-gray-700 hover:bg-gray-100"
          : "",
        className
      )}
      {...props}
    />
  );
};
