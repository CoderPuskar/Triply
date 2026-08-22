import { useState } from "react";
import { Link } from "react-router-dom";
import pilot from "../assets/pilot.png";

const CaptainLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();
    setEmail("");
    setPassword("");
  };

  return (
    <div className="flex flex-col justify-between">
      {/* Header */}
      <div className="max-w-full  bg-black mt-0 flex items-center">
        <div className="flex flex-col items-center">
          <img src={pilot} alt="Triply Captain logo" className="h-15" />
          <h1 className="text-white text-sm -translate-3 pl-5">Pilot</h1>
        </div>

        <h1 className="Home-heading text-white text-4xl font-semibold ml-3">
          Triply
        </h1>
      </div>

      {/* Login Form */}
      <div className="p-7 login-mobile">
        <form onSubmit={submitHandler} className="Userlogin-form">
          <h3 className="text-xl mb-2">What's your email</h3>

          <input
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            type="email"
            placeholder="email@example.com"
            className="bg-[#f3f3f3] rounded border w-full px-4 py-2 text-lg placeholder:text-base mb-5"
          />

          <h3 className="text-xl mb-2">Enter Password</h3>

          <input
            required
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            type="password"
            placeholder="password"
            className="bg-[#f3f3f3] rounded border w-full px-4 py-2 text-lg placeholder:text-base mb-7"
          />

          <button className="p-3 flex justify-center mt-2 text-2xl w-full bg-black text-white rounded-lg font-semibold">
            Login
          </button>

          <div className="flex justify-center">
            <h4>Want to join as Pilot?</h4>

            <Link
              to="/captain-signup"
              className="justify-center flex mx-1 text-blue-600"
            >
              Register here
            </Link>
          </div>

          <Link
            to="/login"
            className="justify-center flex p-3 w-full rounded-lg bg-amber-500 mb-2 mt-15"
          >
            Sign in as a User
          </Link>
        </form>
      </div>
    </div>
  );
};

export default CaptainLogin;
