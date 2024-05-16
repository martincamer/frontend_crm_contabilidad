export const Submit = ({ children }) => {
  return (
    <div className="">
      <button
        type="submit"
        className="bg-blue-500 py-3 px-8 text-sm rounded-full font-semibold text-white mt-3 hover:bg-orange-500 transition-all cursor-pointer"
      >
        {children}
      </button>
    </div>
  );
};
