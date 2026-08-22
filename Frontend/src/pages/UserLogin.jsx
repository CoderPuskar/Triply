import React, { useState } from "react";
import { Link } from "react-router-dom";

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userData, setUserData] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();
    setUserData({
      email: email,
      password: password,
    });
    // console.log(userData);
    //to clear the form below code
    setEmail("");
    setPassword("");
  };
  return (
    <div className=" flex flex-col justify-between">
      <div className=" max-w-full bg-mauve-900 mt-0">
        <h1 className="Home-heading text-white text-4xl p-3  font-semibold">
          Triply
        </h1>
      </div>
      <div className="p-7 login-mobile">
        <form
          onSubmit={(e) => {
            submitHandler(e);
          }}
          className="Userlogin-form"
          action=""
        >
          <h3 className="text-xl mb-2">What's your email</h3>
          <input
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            type="email"
            placeholder="email@example.com"
            className="bg-[#f3f3f3] rounded  border w-full px-4 py-2 text-lg placeholder:text-base mb-5"
          />

          <h3 className="text-xl mb-2">Enter Password</h3>
          <input
            required
            value={password}
            onChange={(p) => {
              setPassword(p.target.value);
            }}
            type="password"
            placeholder="password"
            className="bg-[#f3f3f3] rounded  border w-full px-4 py-2 text-lg placeholder:text-base mb-7"
          />

          <button className="p-3 flex justify-center mt-2 text-2xl w-full bg-black text-white rounded-lg  font-semibold">
            Login
          </button>
          <div className="flex justify-center">
            <h4>New here?</h4>
            <Link to={'/signup'} className="justify-center flex mx-1 text-blue-600">
              Create new account
            </Link>
          </div>

          <Link to={"/captain-login"} className="justify-center flex p-3 w-full  rounded-lg bg-green-500 mb-2 mt-15">
            Sign in as a Captain
          </Link>
        </form>
      </div>
    </div>
  );
};

export default UserLogin;
