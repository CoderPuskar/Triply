import React, { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import map_img from "../assets/map_img.png";

const Home = () => {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);

  const panelRef = useRef(null);

  const submitHandler = (e) => {
    e.preventDefault();
  };

  useGSAP(() => {
    gsap.to(panelRef.current, {
      height: panelOpen ? "70vh" : "0vh",
      duration: 0.45,
      ease: "power2.inOut",
    });
  }, [panelOpen]);

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
      {/* Find a trip form  */}
      <div className="absolute inset-0 flex  flex-col  mt-0 justify-end">
        <div className="h-[30%] rounded-t-3xl bg-white p-5   relative">
          <h4 className="text-2xl py-5 font-semibold">Find a trip</h4>

          <form
            className="relative"
            onSubmit={(e) => {
              submitHandler(e);
            }}
          >
            {/* connecting line  */}
            <div className="absolute left-5 top-1/2 h-16 w-1 -translate-y-1/2 rounded-full bg-gray-700"></div>
            {/* inputs  */}
            <input
              type="text"
              value={pickup}
              onFocus={() => setPanelOpen(true)}
              onChange={(e) => setPickup(e.target.value)}
              className="w-full rounded-lg bg-[#eee] px-12 py-2 text-lg"
              placeholder="Add a pick-up location"
            />

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

        <div ref={panelRef} className="h-screen bg-red-700"></div>
      </div>
    </div>
  );
};

export default Home;
