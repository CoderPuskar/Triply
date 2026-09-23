import { useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import map from "../assets/map_img.png";
import pilot from "../assets/pilot.png";
import FinishRide from "../components/FinishRide";

const CaptainRiding = () => {
  const { state } = useLocation();
  const ride = state?.ride;
  const [finishRidePanel, setFinishRidePanel] = useState(false);
  const finishRidePanelRef = useRef(null);

  useGSAP(
    function () {
      if (finishRidePanel) {
        gsap.to(finishRidePanelRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(finishRidePanelRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [finishRidePanel],
  );

  return (
    <div className="h-screen">
      <div className="fixed p-6  top-0 flex items-center justify-between w-screen">
        {/* Logo and Title */}
        <div className="max-w-full mt-0 flex items-center">
          <div className="flex flex-col items-center">
            <img src={pilot} alt="Triply Captain logo" className="h-15" />
            <h1 className="text-black text-sm -translate-3 pl-5">Pilot</h1>
          </div>

          <h1 className="Home-heading text-black text-4xl font-poppins font-medium ml-2 ">
            Triply
          </h1>
        </div>

        <Link
          to="/captain-home"
          className=" h-10 w-10 bg-white flex items-center justify-center rounded-full"
        >
          <i className="text-lg font-medium ri-logout-box-r-line "></i>
        </Link>
      </div>

      {/* Map */}
      <div className="h-4/5">
        <img className="h-full w-full object-cover" src={map} alt="" />
      </div>

      {/* button panel */}
      <div
        className="h-1/5 p-6 bg-yellow-400 flex items-center justify-between relative"
        onClick={() => {
          setFinishRidePanel(true);
        }}
      >
        <h5 className=" text-center w-full left-0 flex top-0 absolute justify-center items-center p-2 rounded-lg text-black font-semibold">
          <i className="text-3xl ri-arrow-up-wide-line "></i>
        </h5>
        <div>
          <h4 className="text-xl font-semibold">
            {ride?.distance ? `${ride.distance} KM away` : "Ride in progress"}
          </h4>
          <p className="text-sm text-gray-700 capitalize">
            {ride?.user?.fullname
              ? `${ride.user.fullname.firstname} ${ride.user.fullname.lastname || ""}`
              : "Passenger"}
          </p>
        </div>
        <button
          type="button"
          className="bg-green-600 rounded-lg text-white font-semibold px-10 p-3"
          onClick={() => setFinishRidePanel(true)}
        >
          Complete Ride
        </button>
      </div>
      <div
        ref={finishRidePanelRef}
        className="fixed w-full z-10 bottom-0 translate-y-full bg-white pt-12"
      >
        <FinishRide ride={ride} setFinishRidePanel={setFinishRidePanel} />
      </div>
    </div>
  );
};

export default CaptainRiding;
