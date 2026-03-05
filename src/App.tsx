import { Outlet } from "react-router";
import Navbar from "./components/layouts/Navbar";
import { Footer } from "./components/layouts/Footer";
import ScrollToTop from "./utils/ScrollToTop";
import ScrollToTopButton from "./utils/ScrollToTopButton";

export const App = () => {
  return (
    <div className="min-h-screen flex flex-col font-lato">
      <Navbar />
      <ScrollToTop />
      <div className="container max-w-7xl mx-auto">
        <Outlet />
      </div>
      <ScrollToTopButton />
      <Footer />
    </div>
  );
};
