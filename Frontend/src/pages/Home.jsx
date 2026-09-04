import React, { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import map_img from "../assets/map_img.png";
import "remixicon/fonts/remixicon.css";
import LocationSearchPanel from "../components/LocationSearchPanel";
import VehiclePanel from "../components/VehiclePanel";

const Home = () => {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [vehiclePanelOpen, setVehiclePanelOpen] = useState(false);
  const [vehiclePaneClose, setVehiclePaneClose] = useState(false);

  const panelCloseRef = useRef(null);
  const panelRef = useRef(null);
  const vehiclePanelRef = useRef(null);

  const submitHandler = (e) => {
    e.preventDefault();
  };

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

      />
      
    </div>
  );
};

export default Home;
