import { lazy, Suspense, useCallback, useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import CaptainDetails from "../components/CaptainDetails";
import RidePopUp from "../components/RidePopUp";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ConfirmRidePopUp from "../components/ConfirmRidePopUp";
import pilot from "../assets/pilot.png";
import { SocketContext } from "../context/SocketContext";
import { CaptainDataContext } from "../context/CaptainContext";

const LazyMap = lazy(() => import("../components/Map"));

const CaptainHome = () => {
  const { sendMessage, receiveMessage } = useContext(SocketContext);
  const { captain } = useContext(CaptainDataContext);
  const [captainLocation, setCaptainLocation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [pickupLocation, setPickupLocation] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);

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
      const location = {
        latitude: coords.latitude,
        longitude: coords.longitude,
      };
      setCaptainLocation(location);
      sendMessage("update_location_captain", {
        userId: captainId,
        location,
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
      { enableHighAccuracy: false, maximumAge: 60_000, timeout: 30_000 },
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [sendMessage, captain?._id]);

  // this is for ride request popup for captain to accept or ignore the ride request
  const [ridePopupPanel, setRidePopupPanel] = useState(false);
  // this is for confirm ride popup for captain to confirm the ride after accepting the ride request
  const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false);

  // this is for the ride details
  const ridePopupPanelRef = useRef(null);
  const confirmRidePopupPanelRef = useRef(null);
  const [ride, setRide] = useState(null);

  const loadPickupAndRoute = useCallback(async (activeRide, origin) => {
    if (!activeRide?.pickup) return;

    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };
      const pickupResponse = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/maps/captain/get-coordinates`,
        { params: { address: activeRide.pickup }, headers },
      );
      const pickup = pickupResponse.data;
      setPickupLocation(pickup);
      setUserLocation((current) => current || pickup);

      if (origin) {
        const routeResponse = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/maps/captain/route`,
          {
            params: {
              originLatitude: origin.latitude,
              originLongitude: origin.longitude,
              destinationLatitude: pickup.latitude,
              destinationLongitude: pickup.longitude,
            },
            headers,
          },
        );
        setRouteCoordinates(routeResponse.data.route);
      }
    } catch (error) {
      console.error("Unable to load the pickup route:", error.response?.data || error.message);
    }
  }, []);

  useEffect(() => {
    if (ride?.status === "accepted") {
      const timer = window.setTimeout(() => {
        loadPickupAndRoute(ride, captainLocation);
      }, 0);
      return () => window.clearTimeout(timer);
    }
  }, [captainLocation, loadPickupAndRoute, ride]);

  useEffect(() => {
    return receiveMessage("newRide", (newRide) => {
      console.log("Received new ride request:", newRide);
      console.log("User details:", newRide.user);
      setRide(newRide);
      setRidePopupPanel(true);
    });
  }, [receiveMessage]);

  useEffect(() => {
    return receiveMessage("user_live_location", ({ rideId, location }) => {
      if (rideId !== String(ride?._id)) return;
      setUserLocation(location);
    });
  }, [receiveMessage, ride?._id]);

  async function confirmRide() {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/rides/confirm`,
      {
        rideId: ride._id,
        captainId: captain._id,
        captain,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );

    setRide(response.data);
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
    <div className="relative isolate h-dvh min-h-dvh overflow-hidden bg-gray-100">
      <div className="fixed inset-x-0 top-0 z-20 flex items-center justify-between p-4 sm:p-6">
        {/* Logo and Title */}
        <div className="max-w-full mt-0 flex items-center">
          <div className="flex flex-col items-center">
            <img src={pilot} alt="Triply Captain logo" className="h-15" />
            <h1 className="text-black text-sm -translate-3 pl-5">Pilot</h1>
          </div>

          <h1 className="Home-heading ml-2 text-2xl font-medium text-black sm:text-4xl">
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
      <div className="absolute inset-0 z-0">
        <Suspense fallback={<div className="h-full w-full bg-gray-200" />}>
          <LazyMap
            liveLocation={captainLocation}
            liveLocationLabel="Captain live location (blue)"
            pickupLocation={userLocation || pickupLocation}
            pickupLocationLabel={userLocation ?  "Pickup address (green)" : "Pickup location (green)"}
            routeCoordinates={routeCoordinates}
          />
        </Suspense>
      </div>

      {/* Captain Details */}
      <div className={`fixed inset-x-0 bottom-0 z-10 px-4 pb-4 transition-opacity sm:px-6 ${ridePopupPanel || confirmRidePopupPanel ? "pointer-events-none opacity-0" : "opacity-100"}`}>
        <div className="mx-auto max-w-2xl rounded-t-3xl bg-white/95 p-4 shadow-xl backdrop-blur sm:p-6">
          <CaptainDetails />
        </div>
      </div>

      {/* Ride Popup */}
      <div
        ref={ridePopupPanelRef}
        aria-hidden={!ridePopupPanel}
        className={`fixed inset-x-0 bottom-0 z-30 max-h-[88dvh] overflow-y-auto overscroll-contain rounded-t-3xl bg-white px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-10 shadow-2xl sm:px-6 ${ridePopupPanel ? "visible" : "invisible pointer-events-none"}`}
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
        aria-hidden={!confirmRidePopupPanel}
        className={`fixed inset-x-0 bottom-0 z-40 h-dvh overflow-y-auto overscroll-contain bg-white px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-12 sm:px-6 ${confirmRidePopupPanel ? "visible" : "invisible pointer-events-none"}`}
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
