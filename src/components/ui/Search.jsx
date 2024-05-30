export const Search = ({ placeholder, onChange, value }) => {
  return (
    <div className="mx-3 bg-white w-1/4 py-2 px-2 font-semibold text-sm  outline-none transition-all ease-linear duration-500 border border-blue-500">
      <input
        onChange={onChange}
        value={value}
        placeholder={placeholder}
        className=" text-gray-500 placeholder:text-gray-300 outline-none w-full"
      />
    </div>
  );
};
