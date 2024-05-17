export function Button({ onClick, children }) {
  return (
    <button
      className="text-white px-6 hover:bg-orange-500 transition-all text-sm text-center hover:shadow-md py-2 rounded-full bg-blue-500 font-bold flex gap-2 items-center"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
