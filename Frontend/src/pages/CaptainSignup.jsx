import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import pilot from "../assets/pilot.png";
import { CaptainDataContext } from "../context/CaptainContext";
import axios from "axios";

const CaptainSignup = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [showTerms, setShowTerms] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [vehicleColor, setVehicleColor] = useState("");
  const [vehiclePlate, setVehiclePlate] = useState("");
  const [vehicleCapacity, setVehicleCapacity] = useState("");
  const [vehicleType, setVehicleType] = useState("");

  const { captain, setCaptain } = React.useContext(CaptainDataContext);

  const submitHandler = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    // store data
    const captainData = {
      fullname: {
        firstname: firstname,
        lastname: lastname,
      },
      password: password,
      email: email,
      vehicle: {
        color: vehicleColor,
        numberplate: vehiclePlate,
        capacity: Number(vehicleCapacity),
        vehicalType: vehicleType,
      },
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/captains/register`,
        captainData,
      );
      if (response.status === 201) {
        const data = response.data;
        setCaptain(data.captain);
        localStorage.setItem("token", data.token);
        navigate("/captain-home");
      }

      setEmail("");
      setFirstname("");
      setLastname("");
      setPassword("");
      setShowTerms(false);
      setTermsAccepted(false);
      setVehicleColor("");
      setVehiclePlate("");
      setVehicleCapacity("");
      setVehicleType("");
    } catch (error) {
      console.error("Signup error:", error);
      const msg =
        error.response?.data?.message ||
        error.response?.data?.errors?.[0]?.msg ||
        "Registration failed. Please check your information and try again.";
      setErrorMessage(msg);
    }
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

      <div className="p-7 login-mobile">
        <form
          onSubmit={(e) => {
            submitHandler(e);
          }}
          className="Userlogin-form"
        >
          {/* name */}
          <h3 className="text-xl mb-2">What's our Pilot's name</h3>

          <div className="flex gap-2">
            <input
              required
              minLength={3}
              type="text"
              placeholder="First name"
              value={firstname}
              onChange={(e) => {
                setFirstname(e.target.value);
              }}
              className="bg-[#f3f3f3] rounded w-1/2 px-4 py-2 text-base placeholder:text-base mb-5"
            />

            <input
              type="text"
              placeholder="Last name"
              value={lastname}
              onChange={(e) => {
                setLastname(e.target.value);
              }}
              className="bg-[#f3f3f3] rounded w-1/2 px-4 py-2 text-base placeholder:text-base mb-5"
            />
          </div>

          {/* email */}
          <h3 className="text-xl mb-2">What's your email</h3>

          <input
            required
            type="email"
            placeholder="email@gmail.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            className="bg-[#f3f3f3] rounded w-full px-4 py-2 text-base placeholder:text-base mb-5"
          />

          {/* password */}
          <h3 className="text-xl mb-2">Enter Password</h3>

          <input
            required
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            className="bg-[#f3f3f3] rounded w-full px-4 py-2 text-base placeholder:text-base mb-7"
          />
          {/* vehicle */}
          <h3 className="text-lg font-medium mb-2">Vehicle Information</h3>
          <div className="flex gap-4 mb-7">
            <input
              required
              className="bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base"
              type="text"
              placeholder="Vehicle Color"
              value={vehicleColor}
              onChange={(e) => {
                setVehicleColor(e.target.value);
              }}
            />
            <input
              required
              className="bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base"
              type="text"
              placeholder="Vehicle Plate"
              value={vehiclePlate}
              onChange={(e) => {
                setVehiclePlate(e.target.value);
              }}
            />
          </div>
          <div className="flex gap-4 mb-7">
            <input
              required
              className="bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base"
              type="number"
              placeholder="Vehicle Capacity"
              value={vehicleCapacity}
              onChange={(e) => {
                setVehicleCapacity(e.target.value);
              }}
            />
            <select
              required
              className="bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base"
              value={vehicleType}
              onChange={(e) => {
                setVehicleType(e.target.value);
              }}
            >
              <option value="" disabled>
                Select Vehicle Type
              </option>
              <option value="car">Car</option>
              <option value="auto">Auto</option>
              <option value="bike">Bike</option>
            </select>
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-start gap-2 mt-4">
            <input
              type="checkbox"
              id="terms"
              checked={termsAccepted}
              onChange={(e) => {
                setTermsAccepted(e.target.checked);
              }}
              required
              className="mt-1 cursor-pointer"
            />

            <label htmlFor="terms" className="text-sm text-gray-600">
              I agree to{" "}
              <button
                type="button"
                onClick={() => setShowTerms(true)}
                className="text-blue-600 hover:underline"
              >
                Terms & Conditions
              </button>{" "}
              and{" "}
              <span className="text-blue-600 hover:underline cursor-pointer">
                Privacy Policy
              </span>
              .
            </label>
          </div>

          {/* Sign up button */}
          <div className="pt-20">
            {errorMessage && (
              <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
            )}
            <button
              type="submit"
              className="p-3 flex justify-center mt-2 text-2xl w-full bg-black text-white rounded-lg font-semibold cursor-pointer"
            >
              Sign up as Pilot
            </button>
          </div>

          <div className="flex justify-center">
            <h4>Already registered?</h4>

            <Link
              to={"/captain-login"}
              className="justify-center flex mx-1 text-blue-600"
            >
              Login here
            </Link>
          </div>
        </form>
      </div>

      {/* Terms Popup */}
      {showTerms && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-md shadow-lg">
            <div className="text-gray-600 text-sm leading-6 max-h-80 overflow-y-auto">
              <h2 className="text-2xl font-semibold text-black mb-4">
                Captain Terms and Conditions
              </h2>

              <p className="mb-3">
                By creating a Captain account on <strong>Triply</strong>, you
                agree to the following Terms and Conditions:
              </p>

              <ol className="list-decimal pl-5 space-y-3">
                <li>
                  <strong>Accurate Information</strong>
                  <br />
                  You agree to provide accurate personal, vehicle, and
                  driving-license information during registration.
                </li>

                <li>
                  <strong>Driver Eligibility</strong>
                  <br />
                  You confirm that you have a valid driving license and all
                  legally required documents to operate your vehicle.
                </li>

                <li>
                  <strong>Vehicle Responsibility</strong>
                  <br />
                  You are responsible for keeping your vehicle safe, roadworthy,
                  and properly maintained.
                </li>

                <li>
                  <strong>Passenger Safety</strong>
                  <br />
                  You agree to follow traffic laws and prioritize the safety of
                  passengers during every trip.
                </li>

                <li>
                  <strong>Professional Conduct</strong>
                  <br />
                  You must treat passengers respectfully and must not engage in
                  abusive, discriminatory, fraudulent, or inappropriate
                  behavior.
                </li>

                <li>
                  <strong>Trip Acceptance</strong>
                  <br />
                  You agree to accept and complete trips responsibly and avoid
                  fraudulent activities or misuse of the platform.
                </li>

                <li>
                  <strong>Account Suspension</strong>
                  <br />
                  Triply may suspend or terminate your Captain account if you
                  violate these Terms or engage in unsafe or fraudulent
                  activities.
                </li>

                <li>
                  <strong>Changes to Terms</strong>
                  <br />
                  These Terms and Conditions may be updated from time to time.
                  Continued use of Triply means you accept the updated terms.
                </li>
              </ol>

              <p className="mt-4">
                By clicking <strong>"Sign Up"</strong>, you confirm that you
                have read, understood, and agreed to these Captain Terms and
                Conditions.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowTerms(false)}
              className="mt-5 bg-black text-white px-5 py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaptainSignup;
