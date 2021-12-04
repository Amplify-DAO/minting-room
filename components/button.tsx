interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}
export default function Button({
  children,
  onClick,
  isLoading,
  ...rest
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className="bg-chapel-purple-500 flex items-center justify-center px-5 py-2 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed w-full"
      {...rest}
    >
      {isLoading && (
        <svg
          className="animate-spin h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      <div className="ml-2 flex">{children}</div>
    </button>
  );
}
