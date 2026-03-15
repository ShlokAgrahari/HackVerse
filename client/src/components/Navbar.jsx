import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiHome, FiBookmark, FiUsers, FiLogOut } from "react-icons/fi";
import useAuthStore from "../store/authStore";

function Navbar() {

 const navigate = useNavigate();
 const location = useLocation();
 const logout = useAuthStore((state) => state.logout);

 const handleLogout = () => {
  logout();
  navigate("/login");
 };

 const navLink = (path) =>
  `flex items-center gap-2 px-3 py-1.5 rounded-md transition ${
   location.pathname === path
    ? "bg-gray-800 text-purple-400"
    : "text-gray-300 hover:text-white hover:bg-gray-800"
  }`;

 return (

  <nav className="sticky top-0 z-50 backdrop-blur bg-gray-950/80 border-b border-gray-800 shadow-lg">

   <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">

    {/* Logo */}
    <Link to="/dashboard" className="flex items-center gap-3">

     <div className="w-10 h-10 flex items-center justify-center">
      <img
       src="/HackVerse logo.png"
       alt="HackVerse Logo"
       className="w-full h-full object-contain"
      />
     </div>

     <span className="text-xl font-bold tracking-wide bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
      HackVerse
     </span>

    </Link>

    {/* Navigation Links */}
    <div className="flex items-center gap-4 text-sm font-medium">

     <Link to="/dashboard" className={navLink("/dashboard")}>
      <FiHome />
      Dashboard
     </Link>

     <Link to="/saved" className={navLink("/saved")}>
      <FiBookmark />
      Saved
     </Link>

     <Link to="/community" className={navLink("/community")}>
      <FiUsers />
      Community
     </Link>

     {/* Logout */}
     <button
      onClick={handleLogout}
      className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 px-4 py-1.5 rounded-md hover:opacity-90 transition shadow-md"
     >
      <FiLogOut />
      Logout
     </button>

    </div>

   </div>

  </nav>

 );

}

export default Navbar;