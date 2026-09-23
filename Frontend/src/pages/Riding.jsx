import { lazy, Suspense, useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import white_car from "../assets/white car.png";
import { SocketContext } from "../context/SocketContext";
import { UserDataContext } from "../context/UserContext";

const LazyMap = lazy(() => import("../components/Map"));

const Riding = () => {
  const { state } = useLocation();
  let ride = state?.ride;
  const { receiveMessage } = useContext(SocketContext);
  const { sendMessage } = useContext(SocketContext);
  const { user } = useContext(UserDataContext);
  const navigate = useNavigate();
  const [userLocation, setUserLocation] = useState(null);
  const [captainLocation, setCaptainLocation] = useState(null);
  const [pickupLocation, setPickupLocation] = useState(null);
  const [destinationLocation, setDestinationLocation] = useState(null);
  const [tripRoute, setTripRoute] = useState([]);
  const [captainRoute, setCaptainRoute] = useState([]);

  if (!ride) {
    try {
      ride = JSON.parse(localStorage.getItem("activeRide"));
    } catch {
      ride = null;
    }
  }

  useEffect(() => {
    return receiveMessage("rideEnded", (endedRide) => {
      if (endedRide._id === ride?._id) {
        localStorage.removeItem("activeRide");
        navigate("/home");
      }
    });
  }, [navigate, receiveMessage, ride?._id]);

  useEffect(() => {
    if (!user?._id || !navigator.geolocation) return undefined;

    sendMessage("join", { userType: "user", userId: user._id });
    const watchId = navigator.geolocation.watchPosition(
      ({ coords }) => {
        const currentLocation = { latitude: coords.latitude, longitude: coords.longitude };
        setUserLocation(currentLocation);
        sendMessage("update_location_user", {
          userId: user._id,
          location: currentLocation,
        });
      },
      (error) => console.warn("Unable to share rider location:", error.message),
      { enableHighAccuracy: true, maximumAge: 0, timeout: 20_000 },
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [sendMessage, user?._id]);

  useEffect(() => receiveMessage("captain_live_location", ({ rideId, location }) => {
    if (rideId === String(ride?._id)) {
      setCaptainLocation(location);
    }
  }), [receiveMessage, ride?._id]);

  useEffect(() => {
    if (!ride?.pickup || !ride?.destination) return;

    const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };
    Promise.all([
      axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-coordinates`, {
        params: { address: ride.pickup }, headers,
      }),
      axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-coordinates`, {
        params: { address: ride.destination }, headers,
      }),
    ]).then(async ([pickup, destination]) => {
      setPickupLocation(pickup.data);
      setDestinationLocation(destination.data);
      const { data } = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/user/route`, {
        params: {
          originLatitude: pickup.data.latitude,
          originLongitude: pickup.data.longitude,
          destinationLatitude: destination.data.latitude,
          destinationLongitude: destination.data.longitude,
        },
        headers,
      });
      setTripRoute(data.route);
    }).catch((error) => {
      console.error("Unable to load trip route:", error.response?.data || error.message);
    });
  }, [ride?.destination, ride?.pickup]);

  useEffect(() => {
    if (!captainLocation || !userLocation || !ride?._id) return;

    axios.get(`${import.meta.env.VITE_BASE_URL}/maps/user/route`, {
      params: {
        originLatitude: captainLocation.latitude,
        originLongitude: captainLocation.longitude,
        destinationLatitude: userLocation.latitude,
        destinationLongitude: userLocation.longitude,
      },
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }).then(({ data }) => setCaptainRoute(data.route))
      .catch((error) => console.error("Unable to load captain route:", error.response?.data || error.message));
  }, [captainLocation, ride?._id, userLocation]);

  useEffect(() => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "auto",
    });
  }, []);

  return (
    <div className="h-screen">
      {/* home button */}
      <Link
        to="/home"
        className="fixed right-2 top-2 h-10 w-10 bg-white flex items-center justify-center rounded-full"
      >
        <i className="text-lg font-medium ri-home-5-line"></i>
      </Link>
      {/* map */}
      <div className="h-1/2">
        <Suspense fallback={<div className="h-full w-full bg-gray-200" />}>
          <LazyMap
            liveLocation={userLocation}
            liveLocationLabel="Your live location (blue)"
            captainLocation={captainLocation}
            pickupLocation={pickupLocation}
            destinationLocation={destinationLocation}
            routeCoordinates={tripRoute}
            secondaryRouteCoordinates={captainRoute}
          />
        </Suspense>
      </div>
      {/* details */}
      <div className="h-1/2 p-5 flex flex-col">
        <div className="flex items-center justify-between">
          <img className="h-30" src={white_car} alt="" />
          {/* car details */}
          <div className="text-right">
            <h2 className="text-lg font-medium capitalize">
              {ride?.captain?.fullname?.firstname ?? "Driver"}
            </h2>
            <h4 className="text-xl font-semibold -mt-1 -mb-1">
              {ride?.captain?.vehicle?.numberplate ?? "Plate unavailable"}
            </h4>
            <p className="text-sm text-gray-600 capitalize">
              {ride?.captain?.vehicle?.vehicalType ?? "Vehicle unavailable"}
            </p>
          </div>
        </div>
        {/* payment details */}
        <div className="flex gap-2 justify-between flex-col items-center">
          <div className="w-full bg-gray-100 rounded-lg py-7 px-5 mt-5">
            <div className="flex items-center gap-5 p-3 border-b-2">
              <i className="text-lg ri-map-pin-2-fill"></i>
              <div>
                <h3 className="text-lg font-medium">Pickup</h3>
                <p className="text-sm -mt-1 text-gray-600">
                  {ride?.pickup ?? "Pickup unavailable"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-5 p-3 border-b-2">
              <i className="text-lg ri-map-pin-2-fill"></i>
              <div>
                <h3 className="text-lg font-medium">Destination</h3>
                <p className="text-sm -mt-1 text-gray-600">
                  {ride?.destination ?? "Destination unavailable"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-5 p-3">
              <i className="ri-currency-line"></i>
              <div>
                <h3 className="text-lg font-medium">₹{ride?.fare ?? "--"}</h3>
                <p className="text-sm -mt-1 text-gray-600">Cash Cash</p>
              </div>
            </div>
          </div>
        </div>
        {/* payment button */}
        <div className="mt-5">
          <button className="w-full mt-auto mb-1 flex justify-center bg-green-600 text-white font-semibold p-2 rounded-lg hover:bg-green-700 transition-colors duration-300">
            Make a Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default Riding;
