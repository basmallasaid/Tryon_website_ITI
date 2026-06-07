import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";

export default function Layout() {
  return (
    <div className="w-[100%] max-w-[1920px] mx-auto">
      <Navbar />

      <Outlet />

      <Footer />
    </div>
  );
}
