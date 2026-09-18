import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserDataContext } from "../context/UserContext";
import axios from "axios";

const UserProtectedWrapper = ({ children }) => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const { user, setUser } = useContext(UserDataContext);
  const [loading, setLoading] = useState(true);
  // if not user loged in navigate to login page
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setUser(response.data);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.log(error);
        localStorage.removeItem("token");
        navigate("/login");
      });
  }, [token, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  // else if user exist then return to him in home page
  return <>{children}</>;
};

export default UserProtectedWrapper;

// but when you refresh the page 
// the user will automaticaly loged out
//  so then we sould not depend on user indtead of we need to rely on token
// look at the user login page
