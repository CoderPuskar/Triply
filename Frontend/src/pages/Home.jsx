import { useRef, useState, useEffect, useContext } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { lazy, Suspense } from "react";
import axios from "axios";
import "remixicon/fonts/remixicon.css";
import LocationSearchPanel from "../components/LocationSearchPanel";
import VehiclePanel from "../components/VehiclePanel";
import ConfirmRide from "../components/ConfirmRide";
import LookingForDriver from "../components/LookingForDriver";
import WaitingForDriver from "../components/WaitingForDriver";
import { SocketContext } from "../context/SocketContext";
import { UserDataContext } from "../context/UserContext";

const LazyMap = lazy(() => import("../components/Map"));

const Home = () => {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [vehiclePanelOpen, setVehiclePanelOpen] = useState(false);
  const [confirmRidePanel, setconfirmRidePanel] = useState(false);
  const [vehicleFound, setvehicleFound] = useState(false);
  const [waitingForDriver, setWaitingForDriver] = useState(false);
  const [ride, setRide] = useState(null);
  const [fare, setFare] = useState(null);
  const [fareLoading, setFareLoading] = useState(false);
  const [activeInput, setActiveInput] = useState("pickup");

  const panelCloseRef = useRef(null);
  const panelRef = useRef(null);
  const vehiclePanelRef = useRef(null);
  const confirmRidePanelRef = useRef(null);
  const vehicleFoundRef = useRef(null);
  const waitingForDriverRef = useRef(null);

  const { sendMessage, receiveMessage } = useContext(SocketContext);
  const { user } = useContext(UserDataContext);

  useEffect(() => {
    // console.log(user)
    if (user?._id) {
      sendMessage("join", { userType: "user", userId: user._id });
    }
  }, [sendMessage, user]);

  useEffect(() => {
    return receiveMessage("rideStarted", (startedRide) => {
      setRide(startedRide);
      setvehicleFound(false);
      setWaitingForDriver(true);
    });
  }, [receiveMessage]);

  const submitHandler = (e) => {
    e.preventDefault();
  };

  // GSAP animation for opening and closing the panel of location search
  useGSAP(
    function () {
      if (panelOpen) {
        // Animate the panel to open
        gsap.to(panelRef.current, {
          height: "70%",
          padding: "8px 20px 20px",
          opacity: 1,
        });

        gsap.to(panelCloseRef.current, {
          // Animate the close button to appear
          opacity: 1,
        });
      } else {
        gsap.to(panelRef.current, {
          height: "0%",
          opacity: 0,
          padding: "0px 20px 0px",
        });

        gsap.to(panelCloseRef.current, {
          // Animate the close button to disappear
          opacity: 0,
        });
      }
    },
    [panelOpen], // Dependency array to trigger the animation when panelOpen changes
  );

  // GSAP animation for opening and closing the ride confirmation panel
  useGSAP(
    function () {
      if (confirmRidePanel) {
        gsap.to(confirmRidePanelRef.current, {
          transform: "translateY(0%)",
        });
      } else {
        gsap.to(confirmRidePanelRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [confirmRidePanel],
  );

  // GSAP animation for opening and closing the looking for driver panel
  useGSAP(
    function () {
      if (vehicleFound) {
        gsap.to(vehicleFoundRef.current, {
          transform: "translateY(0%)",
        });
      } else {
        gsap.to(vehicleFoundRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [vehicleFound],
  );

  // GSAP animation for opening and closing the waiting for driver panel
  useGSAP(
    function () {
      if (waitingForDriver) {
        gsap.to(waitingForDriverRef.current, {
          transform: "translateY(0%)",
        });
      } else {
        gsap.to(waitingForDriverRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [waitingForDriver],
  );

  // clicking outside the vehicle box the box will disapear
  useEffect(() => {
    if (!vehiclePanelOpen) return;

    const handleOutsideClick = (e) => {
      if (
        vehiclePanelRef.current &&
        !vehiclePanelRef.current.contains(e.target)
      ) {
        setVehiclePanelOpen(false);
      }
    };

    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handleOutsideClick);
    }, 100);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [vehiclePanelOpen]);

  // clicking outside the confirm ride box the box will disapear
  useEffect(() => {
    if (!confirmRidePanel) return;

    const handleOutsideClick = (e) => {
      if (
        confirmRidePanelRef.current &&
        !confirmRidePanelRef.current.contains(e.target)
      ) {
        setconfirmRidePanel(false);
      }
    };

    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handleOutsideClick);
    }, 100);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [confirmRidePanel]);

  async function find_a_trip() {
    if (!pickup?.trim() || !destination?.trim()) {
      return;
    }
    setVehiclePanelOpen(true);
    setPanelOpen(false);
    // Fetch fare from the backend
    setFareLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/rides/fare`,
        {
          params: {
            pickup,
            destination,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      setFare(response.data);
      console.log("Fare data:", response.data);
    } catch (error) {
      console.error("Error fetching fare:", error);
    } finally {
      setFareLoading(false);
    }
  }

  async function createRide(selectedVehicle) {
    // Create a ride with the selected vehicle type
    const response = await axios
      .post(
        `${import.meta.env.VITE_BASE_URL}/rides/create`,
        {
          pickup,
          destination,
          vehicleType: selectedVehicle,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      )
      .catch((error) => {
        console.error("Error creating ride:", error);
      });

    if (response && response.data) {
      setRide(response.data);
      console.log("Ride created:", response.data);
      return response.data;
    }

    console.log("Ride creation response:", response);
    return null;
  }

  return (
    <div className="relative h-screen overflow-hidden bg-gray-100">
      {!panelOpen && (
        <h1 className="absolute left-5 top-5 z-10 font-poppins text-5xl font-semibold">
          Triply
        </h1>
      )}

      {/* this is the map */}
      <div className="absolute inset-0 z-0">
        {/* <img src={map_img} alt="map" className="h-full w-full object-cover" /> */}
        <Suspense fallback={<div className="h-full w-full bg-gray-300"></div>}>
          <LazyMap />
        </Suspense>
      </div>

      {/* Find a trip form */}
      <div className="pointer-events-none absolute inset-0 flex flex-col justify-end">
        <div className="pointer-events-auto relative h-[40%] rounded-t-3xl bg-white p-10">
          {/*down Arrow */}
          <h1
            onClick={() => {
              setPanelOpen(false);
            }}
            ref={panelCloseRef}
            className="absolute right-10 flex items-center gap-2 text-4xl font-bold cursor-pointer"
          >
            <i className="ri-arrow-down-double-line"></i>
          </h1>

          <h4 className="py-5 text-2xl font-semibold">Find a trip</h4>

          <form
            className="relative"
            onSubmit={(e) => {
              submitHandler(e);
            }}
          >
            {/* Connecting line */}
            <div className="absolute left-5 top-1/2 h-16 w-1 -translate-y-1/2 rounded-full bg-gray-700"></div>

            {/* Pickup input */}
            <input
              type="text"
              value={pickup}
              onFocus={() => {
                setActiveInput("pickup");
                setPanelOpen(true);
              }}
              onChange={(e) => setPickup(e.target.value)}
              className="w-full rounded-lg bg-[#eee] px-12 py-2 text-lg"
              placeholder="Add a pick-up location"
            />

            {/* Destination input */}
            <input
              type="text"
              value={destination}
              onFocus={() => {
                setActiveInput("destination");
                setPanelOpen(true);
              }}
              onChange={(e) => setDestination(e.target.value)}
              className="mt-3 w-full rounded-lg bg-[#eee] px-12 py-2 text-lg"
              placeholder="Enter your destination"
            />
          </form>
          <button
            onClick={() => {
              find_a_trip();
            }}
            className="mt-5 w-full rounded-xl bg-black px-6 py-3 text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-gray-800 hover:shadow-xl active:translate-y-0"
          >
            Find a trip
          </button>
        </div>

        {/* Bottom panel */}
        <div ref={panelRef} className="pointer-events-auto h-screen bg-white">
          {/* vehicle panel search sugestions  */}
          <LocationSearchPanel
            setPanelOpen={setPanelOpen}
            setVehiclePanel={setVehiclePanelOpen}
            input={activeInput === "pickup" ? pickup : destination}
            activeInput={activeInput}
            setPickup={setPickup}
            setDestination={setDestination}
          />
        </div>
      </div>

      {/* car choose section */}
      <VehiclePanel
        vehiclePanelRef={vehiclePanelRef}
        vehiclePanelOpen={vehiclePanelOpen}
        setVehiclePanelOpen={setVehiclePanelOpen}
        selectedVehicle={selectedVehicle}
        setSelectedVehicle={setSelectedVehicle}
        setConfirmRidePanel={setconfirmRidePanel}
        confirmRidePanel={confirmRidePanel}
        fare={fare}
        fareLoading={fareLoading}
      />

      <div
        ref={confirmRidePanelRef}
        className="fixed bottom-0 left-0 right-0 z-20 w-full translate-y-full bg-white"
      >
        <ConfirmRide
          setConfirmRidePanel={setconfirmRidePanel}
          setVehiclePanelOpen={setVehiclePanelOpen}
          setvehicleFound={setvehicleFound}
          createRide={createRide}
          pickup={pickup}
          destination={destination}
          fare={fare}
          vehicleType={selectedVehicle} //edited
        />
      </div>

      <div
        ref={vehicleFoundRef}
        className="fixed bottom-0 left-0 right-0 z-20 w-full translate-y-full bg-white"
      >
        <LookingForDriver
          ride={ride}
          setConfirmRidePanel={setconfirmRidePanel}
          setvehicleFound={setvehicleFound}
          pickup={pickup}
          destination={destination}
          fare={fare}
          vehicleType={selectedVehicle}
        />
      </div>

      <div
        ref={waitingForDriverRef}
        className="fixed bottom-0 left-0 right-0 z-20 w-full translate-y-full overflow-hidden rounded-t-3xl"
      >
        <WaitingForDriver
          ride={ride}
          setWaitingForDriver={setWaitingForDriver}
        />
      </div>
    </div>
  );
};
export default Home;
