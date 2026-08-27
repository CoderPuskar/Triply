import React from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserDataContext } from "../context/UserContext";

const UserProtectedWrapper = ({ children }) => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  // if not user loged in navigate to login page
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);
  // else if user exist then return to him in home page
  return <>{children}</>;
};

export default UserProtectedWrapper;

// but when you refresh the page the user will automaticaly loged out so then we sould not depend on user indtead of we need to rely on token
// look at the user login page
