import React, { use, useState } from "react";
import { Link } from "react-router-dom";

const UserSignup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [showTerms, setShowTerms] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [userData, setUserdata] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();
    // store data
    setUserdata({
      fullname: {
        firstname: firstname,
        lastname: lastname,
      },
      password: password,
      email: email,
    });
    console.log(userData);
    setEmail("");
    setFirstname("");
    setLastname("");
    setPassword("");
    setShowTerms(false);
    setTermsAccepted(false);
  };

  return (
    <div className="flex flex-col justify-between">
      <div className="max-w-full bg-mauve-900 mt-0">
        <h1 className="Home-heading text-white text-4xl p-3 font-semibold">
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
          <h3 className="text-xl mb-2">What's your name</h3>

          <div className="flex gap-2">
            <input
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
          <div className="pt-50">
            <button
              type="submit"
              className="p-3 flex justify-center mt-2 text-2xl w-full bg-black text-white rounded-lg font-semibold"
            >
              Sign up
            </button>
          </div>

          <div className="flex justify-center">
            <h4>Already have account?</h4>

            <Link
              to={"/login"}
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
                Terms and Conditions
              </h2>

              <p className="mb-3">
                By creating an account and using <strong>Triply</strong>, you
                agree to the following Terms and Conditions:
              </p>

              <ol className="list-decimal pl-5 space-y-3">
                <li>
                  <strong>Account Information</strong>
                  <br />
                  You agree to provide accurate and complete information during
                  registration and keep your account details up to date.
                </li>

                <li>
                  <strong>Account Security</strong>
                  <br />
                  You are responsible for keeping your login credentials
                  confidential and for all activities performed through your
                  account.
                </li>

                <li>
                  <strong>Acceptable Use</strong>
                  <br />
                  You agree not to use Triply for any illegal, harmful,
                  fraudulent, or unauthorized activities.
                </li>

                <li>
                  <strong>User Responsibility</strong>
                  <br />
                  You are responsible for the information you provide and your
                  interactions with other users on the platform.
                </li>

                <li>
                  <strong>Privacy</strong>
                  <br />
                  Your personal information will be handled according to our
                  Privacy Policy.
                </li>

                <li>
                  <strong>Service Availability</strong>
                  <br />
                  Triply may modify, suspend, or discontinue any part of the
                  service at any time without prior notice.
                </li>

                <li>
                  <strong>Account Suspension</strong>
                  <br />
                  We reserve the right to suspend or terminate accounts that
                  violate these Terms and Conditions.
                </li>

                <li>
                  <strong>Changes to Terms</strong>
                  <br />
                  These Terms and Conditions may be updated from time to time.
                  Continued use of Triply after changes means you accept the
                  updated terms.
                </li>
              </ol>

              <p className="mt-4">
                By clicking <strong>"Sign Up"</strong> or creating an account,
                you confirm that you have read, understood, and agreed to these
                Terms and Conditions.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowTerms(false)}
              className="mt-5 bg-black text-white px-5 py-2 rounded-lg"
              required
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserSignup;
