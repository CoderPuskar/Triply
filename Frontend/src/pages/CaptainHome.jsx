import { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import CaptainDetails from "../components/CaptainDetails";
import RidePopUp from "../components/RidePopUp";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ConfirmRidePopUp from "../components/ConfirmRidePopUp";
import map from "../assets/map_img.png";
import pilot from "../assets/pilot.png";
import { SocketContext } from "../context/SocketContext";
import { CaptainDataContext } from "../context/CaptainContext";

const CaptainHome = () => {
  const { sendMessage, receiveMessage } = useContext(SocketContext);
  const { captain } = useContext(CaptainDataContext);


  useEffect(() => {
    const captainId = captain?._id;

    if (!captainId) {
      return;
    }

    sendMessage("join", { userType: "captain", userId: captainId });

    if (!navigator.geolocation) {
      return;
    }

    const handlePosition = ({ coords }) => {
      sendMessage("update_location_captain", {
        userId: captainId,
        location: {
          latitude: coords.latitude,
          longitude: coords.longitude,
        },
      });
    };

    const handlePositionError = (error) => {
      const messages = {
        1: "Location permission was denied.",
        2: "Your location is unavailable.",
        3: "Location lookup timed out; will keep trying.",
      };
      console.warn(messages[error.code] || "Unable to get captain location.");
    };

    const watchId = navigator.geolocation.watchPosition(
      handlePosition,
      handlePositionError,
      { enableHighAccuracy: false, maximumAge: 30000, timeout: 20000 },
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [sendMessage, captain?._id]);

  // this is for ride request popup for captain to accept or ignore the ride request
  const [ridePopupPanel, setRidePopupPanel] = useState(false); 
  // this is for confirm ride popup for captain to confirm the ride after accepting the ride request
  const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(null);

  // this is for the ride details
  const ridePopupPanelRef = useRef(null);
  const confirmRidePopupPanelRef = useRef(null);
  const [ride, setRide] = useState(null);

  useEffect(() => {
    return receiveMessage("newRide", (newRide) => {
      console.log("Received new ride request:", newRide);
      setRide(newRide);
      setRidePopupPanel(true);
    });
  }, [receiveMessage]);

  function confirmRide() {
    setRidePopupPanel(false);
    setConfirmRidePopupPanel(true);
  }

  useGSAP(
    function () {
      if (ridePopupPanel) {
        gsap.to(ridePopupPanelRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(ridePopupPanelRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [ridePopupPanel],
  );

  useGSAP(
    function () {
      if (confirmRidePopupPanel) {
        gsap.to(confirmRidePopupPanelRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(confirmRidePopupPanelRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [confirmRidePopupPanel],
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
      <div className="h-3/5">
        <img className="h-full w-full object-cover" src={map} alt="" />
      </div>

      {/* Captain Details */}
      <div className="h-2/5 p-6">
        <CaptainDetails />
      </div>

      {/* Ride Popup */}
      <div
        ref={ridePopupPanelRef}
        className="fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12"
      >
        {/* Ride Popup */}
        <RidePopUp
          ride={ride}
          setRidePopupPanel={setRidePopupPanel}
          setConfirmRidePopupPanel={setConfirmRidePopupPanel}
          confirmRide={confirmRide}
        />
      </div>
      <div
        ref={confirmRidePopupPanelRef}
        className="fixed w-full h-screen z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12"
      >
        <ConfirmRidePopUp
          ride={ride}
          setConfirmRidePopupPanel={setConfirmRidePopupPanel}
          setRidePopupPanel={setRidePopupPanel}
        />
      </div>
    </div>
  );
};

export default CaptainHome;
