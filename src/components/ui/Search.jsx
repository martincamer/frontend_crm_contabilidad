export const Search = ({ placeholder, onChange, value }) => {
  return (
    <input
      onChange={onChange}
      value={value}
      placeholder={placeholder}
      className="bg-white border-t border-gray-300 w-full py-2 px-2 text-gray-500 placeholder:text-gray-300 font-semibold text-sm fixed bottom-0 outline-none transition-all ease-linear duration-500"
    />
  );
};
