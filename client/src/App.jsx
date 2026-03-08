import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Community from "./pages/Community";
import PostPage from "./pages/PostPage";
import ProtectedRoute from "./routes/protectedRoute";

function App(){

 return(

  <BrowserRouter>

   <Routes>

    <Route path="/login" element={<Login/>}/>
    <Route path="/signup" element={<Signup/>}/>
    <Route
 path="/community"
 element={
  <ProtectedRoute>
   <Community/>
  </ProtectedRoute>
 }
/>

<Route
 path="/post/:id"
 element={
  <ProtectedRoute>
   <PostPage/>
  </ProtectedRoute>
 }
/>
    <Route
     path="/dashboard"
     element={
      <ProtectedRoute>
       <Dashboard/>
      </ProtectedRoute>
     }
    />

   </Routes>

  </BrowserRouter>

 );

}

export default App;