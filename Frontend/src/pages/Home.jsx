import React, { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import map_img from "../assets/map_img.png";
import "remixicon/fonts/remixicon.css";
import LocationSearchPanel from "../components/LocationSearchPanel";
import VehiclePanel from "../components/VehiclePanel";
import ConfirmRide from "../components/ConfirmRide";
import LookingForDriver from "../components/LookingForDriver";
import WaitingForDriver from "../components/WaitingForDriver";

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

  const panelCloseRef = useRef(null);
  const panelRef = useRef(null);
  const vehiclePanelRef = useRef(null);
  const confirmRidePanelRef = useRef(null);
  const vehicleFoundRef = useRef(null);
  const waitingForDriverRef = useRef(null);

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
    const handleOutsideClick = (e) => {
      if (
        vehiclePanelRef.current &&
        !vehiclePanelRef.current.contains(e.target)
      ) {
        setVehiclePanelOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  // clicking outside the confirm ride box the box will disapear
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        confirmRidePanelRef.current &&
        !confirmRidePanelRef.current.contains(e.target)
      ) {
        setconfirmRidePanel(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div className="relative h-screen overflow-hidden bg-gray-100">
      {!panelOpen && (
        <h1 className="absolute left-5 top-5 z-10 font-poppins text-5xl font-semibold">
          Triply
        </h1>
      )}

      <div className="h-full w-full">
        <img src={map_img} alt="map" className="h-full w-full object-cover" />
      </div>

      {/* Find a trip form */}
      <div className="absolute inset-0  flex flex-col  justify-end ">
        <div className="relative h-[40%] rounded-t-3xl bg-white p-10  ">
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
              onFocus={() => setPanelOpen(true)}
              onChange={(e) => setPickup(e.target.value)}
              className="w-full rounded-lg bg-[#eee] px-12 py-2 text-lg"
              placeholder="Add a pick-up location"
            />

            {/* Destination input */}
            <input
              type="text"
              value={destination}
              onFocus={() => setPanelOpen(true)}
              onChange={(e) => setDestination(e.target.value)}
              className="mt-3 w-full rounded-lg bg-[#eee] px-12 py-2 text-lg"
              placeholder="Enter your destination"
            />
          </form>
        </div>

        {/* Bottom panel */}
        <div ref={panelRef} className="h-screen bg-white ">
          {/* vehicle panel search sugestions  */}
          <LocationSearchPanel
            setPanelOpen={setPanelOpen}
            setVehiclePanel={setVehiclePanelOpen}
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
      />

      <div
        ref={confirmRidePanelRef}
        className="fixed bottom-0 left-0 right-0 z-20 w-full translate-y-full bg-white"
      >
        <ConfirmRide
          setConfirmRidePanel={setconfirmRidePanel}
          setVehiclePanelOpen={setVehiclePanelOpen}
          setvehicleFound={setvehicleFound}
        />
      </div>

      <div
        ref={vehicleFoundRef}
        className="fixed bottom-0 left-0 right-0 z-20 w-full translate-y-full bg-white"
      >
        <LookingForDriver
          setConfirmRidePanel={setconfirmRidePanel}
          setvehicleFound={setvehicleFound}
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
