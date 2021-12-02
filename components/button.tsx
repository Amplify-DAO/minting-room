interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  disabled: boolean;
}
export default function Button({ children, onClick, ...rest }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className="bg-indigo-700 px-5 py-2 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed"
      {...rest}
    >
      {children}
    </button>
  );
}
