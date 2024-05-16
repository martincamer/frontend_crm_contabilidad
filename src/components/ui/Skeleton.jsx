export const Skeleton = () => {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-4 w-full">
        <div className="skeleton bg-gray-300 h-10 rounded-none w-full"></div>
      </div>
      <div className="mx-3">
        <div className="skeleton bg-gray-300 py-6 px-5 rounded-none max-w-md"></div>
      </div>
      <div className="mx-3">
        <div className="skeleton bg-gray-300 rounded-none w-full h-[60vh]">
          {" "}
          <div className="skeleton bg-gray-400 py-3 px-5 rounded-none w-full h-10"></div>
        </div>
      </div>
    </div>
  );
};
