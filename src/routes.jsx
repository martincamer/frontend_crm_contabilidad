import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./context/authContext";
import { SideBar } from "./components/uiElements/Sidebar";
// import { RotatingLines } from "react-loader-spinner";

export const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  // if (loading)
  //   return (
  //     <div className="h-screen w-full justify-center flex">
  //       <RotatingLines
  //         visible={true}
  //         height="80"
  //         width="80"
  //         color="grey"
  //         strokeWidth="5"
  //         animationDuration="0.75"
  //         ariaLabel="rotating-lines-loading"
  //         wrapperStyle={{}}
  //         wrapperClass=""
  //         strokeColor="#0287e0"
  //       />
  //     </div>
  //   );

  if (!isAuthenticated) return <Navigate to="/" replace />;

  return (
    <main className="flex w-full h-full">
      <div className="w-auto">
        <SideBar />
      </div>
      <div className="w-full">
        <Outlet />
      </div>
    </main>
  );
};
