import { Outlet } from "react-router";
import Navbar from "./components/layouts/Navbar";
import { Footer } from "./components/layouts/Footer";

export const App = () => {
  return (
    <div className="container mx-auto min-h-screen flex flex-col">
      <Navbar />
      <div className="grow-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};
