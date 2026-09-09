import trafficLight from "../assets/Traffic_light.jpg";
import { Link } from "react-router-dom";

const Start = () => {
  return (
    <div>
      <div className="h-screen w-full relative flex flex-col">
        {/* Taxi image */}
        <img
          src={trafficLight}
          alt="trafficLight"
          className="-translate-y-20 absolute inset-0 w-full h-full object-cover   "
        />

        {/* Heading image over taxi */}
        <h1 className="Home-heading bg-blend-hard-light z-0 text-5xl m-5 text-white text-shadow-sm opacity-95 font-semibold">
          Triply
        </h1>

        {/* Bottom section */}
        <div className="Home-bottom relative z-10 mt-auto justify-center ">
          <h2 className="text-2xl p-3 justify-center flex">
            Get started with Triply
          </h2>
          <Link
            to={"/login"}
            className="p-3 flex justify-center  text-2xl w-[90%] sm:w-[80%] md:w-[60%] bg-black text-white rounded-lg mx-auto   "
          >
            Continue
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Start;
