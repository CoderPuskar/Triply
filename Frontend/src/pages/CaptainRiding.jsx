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
      { enableHighAccuracy: false, maximumAge: 60_000, timeout: 30_000 },
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
            pickupLocationLabel={userLocation ? "Passenger live location (green)" : "Pickup address (green)"}
            destinationLocation={destinationLocation}
            routeCoordinates={routeCoordinates}
          />
        </Suspense>
      </div>

      {/* button panel */}
      <div
        className="fixed inset-x-0 bottom-0 z-10 flex min-h-28 items-center justify-between gap-3 bg-yellow-400 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:p-6"
        onClick={() => {
          setFinishRidePanel(true);
        }}
      >
        <h5 className=" text-center w-full left-0 flex top-0 absolute justify-center items-center p-2 rounded-lg text-black font-semibold">
          <i className="text-2xl ri-arrow-up-wide-line sm:text-3xl"></i>
        </h5>
        <div>
          <h4 className="text-base font-semibold sm:text-xl">
            {ride?.distance ? `${ride.distance} KM away` : "Ride in progress"}
          </h4>
          <p className="max-w-[45vw] truncate text-xs text-gray-700 capitalize sm:text-sm">
            {ride?.user?.fullname
              ? `${ride.user.fullname.firstname} ${ride.user.fullname.lastname || ""}`
              : "Passenger"}
          </p>
        </div>
        <button
          type="button"
          className="shrink-0 rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white sm:px-10 sm:text-base"
          onClick={() => setFinishRidePanel(true)}
        >
          Complete Ride
        </button>
      </div>
      <div
        ref={finishRidePanelRef}
        aria-hidden={!finishRidePanel}
        className={`fixed inset-x-0 bottom-0 z-30 max-h-[92dvh] overflow-y-auto overscroll-contain rounded-t-3xl bg-white px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-12 shadow-2xl sm:px-6 ${finishRidePanel ? "visible" : "invisible pointer-events-none"}`}
      >
        <FinishRide ride={ride} setFinishRidePanel={setFinishRidePanel} />
      </div>
    </div>
  );
};

export default CaptainRiding;
