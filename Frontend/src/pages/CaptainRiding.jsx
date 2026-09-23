import { lazy, Suspense, useCallback, useContext, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import pilot from "../assets/pilot.png";
import FinishRide from "../components/FinishRide";
import { SocketContext } from "../context/SocketContext";
import { CaptainDataContext } from "../context/CaptainContext";

const LazyMap = lazy(() => import("../components/Map"));

const CaptainRiding = () => {
  const { state } = useLocation();
  const ride = state?.ride;
  const pickupAddress = ride?.pickup;
  const destinationAddress = ride?.destination;
  const { sendMessage, receiveMessage } = useContext(SocketContext);
  const { captain } = useContext(CaptainDataContext);
  const [captainLocation, setCaptainLocation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [pickupLocation, setPickupLocation] = useState(null);
  const [destinationLocation, setDestinationLocation] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [finishRidePanel, setFinishRidePanel] = useState(false);
  const finishRidePanelRef = useRef(null);

  useEffect(() => {
    if (!captain?._id || !navigator.geolocation) return undefined;

    sendMessage("join", { userType: "captain", userId: captain._id });
    const watchId = navigator.geolocation.watchPosition(
      ({ coords }) => {
        const location = { latitude: coords.latitude, longitude: coords.longitude };
        setCaptainLocation(location);
        sendMessage("update_location_captain", { userId: captain._id, location });
      },
      (error) => console.warn("Unable to share captain location:", error.message),
      { enableHighAccuracy: true, maximumAge: 0, timeout: 20_000 },
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [captain?._id, sendMessage]);

  useEffect(() => receiveMessage("user_live_location", ({ rideId, location }) => {
    if (rideId !== String(ride?._id)) return;
    setUserLocation(location);
  }), [receiveMessage, ride?._id]);

  const loadRideLocations = useCallback(async () => {
    if (!pickupAddress || !destinationAddress) return;
    const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };
    try {
      const [pickup, destination] = await Promise.all([
        axios.get(`${import.meta.env.VITE_BASE_URL}/maps/captain/get-coordinates`, { params: { address: pickupAddress }, headers }),
        axios.get(`${import.meta.env.VITE_BASE_URL}/maps/captain/get-coordinates`, { params: { address: destinationAddress }, headers }),
      ]);
      setPickupLocation(pickup.data);
      setDestinationLocation(destination.data);
      setUserLocation((current) => current || pickup.data);
    } catch (error) {
      console.error("Unable to load ride locations:", error.response?.data || error.message);
    }
  }, [destinationAddress, pickupAddress]);

  useEffect(() => {
    const timer = window.setTimeout(loadRideLocations, 0);
    return () => window.clearTimeout(timer);
  }, [loadRideLocations]);

  useEffect(() => {
    const routeDestination = destinationLocation;
    if (!captainLocation || !routeDestination) return;
    const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };
    axios.get(`${import.meta.env.VITE_BASE_URL}/maps/captain/route`, {
      params: {
        originLatitude: captainLocation.latitude,
        originLongitude: captainLocation.longitude,
        destinationLatitude: routeDestination.latitude,
        destinationLongitude: routeDestination.longitude,
      },
      headers,
    }).then(({ data }) => setRouteCoordinates(data.route))
      .catch((error) => console.error("Unable to load destination route:", error.response?.data || error.message));
  }, [captainLocation, destinationLocation]);

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
        <Suspense fallback={<div className="h-full w-full bg-gray-200" />}>
          <LazyMap
            liveLocation={captainLocation}
            liveLocationLabel="Captain live location (blue)"
            pickupLocation={userLocation || pickupLocation}
            pickupLocationLabel="Passenger live location (green)"
            destinationLocation={destinationLocation}
            routeCoordinates={routeCoordinates}
          />
        </Suspense>
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
