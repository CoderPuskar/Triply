import { useContext, useState } from "react";

import "./App.css";
import { Routes, Route } from "react-router-dom"; //noted
import Home from "./pages/Home";
import UserLogin from "./pages/UserLogin";
import UserSignup from "./pages/UserSignup";
import CaptainSignup from "./pages/CaptainSignup";
import CaptainLogin from "./pages/CaptainLogin"
import { UserDataContext } from "./context/UserContext";


function App() {
  // const ans= useContext(UserDataContext)
  // console.log(ans)
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/signup" element={<UserSignup />} />
        <Route path="/captain-login" element={<CaptainLogin />} />
        <Route path="/captain-signup" element={<CaptainSignup />} />
       

      </Routes>
    </div>
  );
}

export default App;
