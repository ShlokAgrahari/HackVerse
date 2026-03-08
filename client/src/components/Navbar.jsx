import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

function Navbar() {

 const navigate = useNavigate();
 const logout = useAuthStore((state) => state.logout);

 const handleLogout = () => {
  logout();
  navigate("/login");
 };

 return (

  <nav className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white shadow-lg border-b border-gray-800">

   <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-2">

    <Link to="/dashboard" className="flex items-center gap-3">

  <div className="w-12 h-12 p-0.5 my-2 flex items-center justify-center">
    <img
      src="/HackVerse logo.png"
      alt="HackVerse Logo"
      className="w-full h-full object-contain scale-250"
    />
  </div>

  <span className="text-xl font-bold tracking-wide bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
    HackVerse
  </span>

</Link>


    {/* Navigation Links */}
    <div className="flex items-center gap-8 text-sm font-medium">

     <Link
      to="/dashboard"
      className="hover:text-purple-400 transition duration-200"
     >
      Dashboard
     </Link>

     <Link
      to="/community"
      className="hover:text-purple-400 transition duration-200"
     >
      Community
     </Link>

     <button
      onClick={handleLogout}
      className="bg-gradient-to-r from-purple-500 to-blue-500 px-4 py-1.5 rounded-lg hover:opacity-90 transition"
     >
      Logout
     </button>

    </div>

   </div>

  </nav>

 );
}

export default Navbar;