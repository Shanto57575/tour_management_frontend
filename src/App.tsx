import { Outlet } from "react-router";
import Navbar from "./components/layouts/Navbar";
import { Footer } from "./components/layouts/Footer";
import ScrollToTop from "./utils/ScrollToTop";
import ScrollToTopButton from "./utils/ScrollToTopButton";

export const App = () => {
  return (
    <div className="min-h-screen flex flex-col font-merriweather">
      <Navbar />
      <ScrollToTop />
      <div>
        <Outlet />
      </div>
      <ScrollToTopButton />
      <Footer />
    </div>
  );
};
