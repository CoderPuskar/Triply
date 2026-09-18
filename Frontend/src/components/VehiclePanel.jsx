import React from "react";
import car from "../assets/car.png";
import auto from "../assets/auto.png";
import bike from "../assets/bike.png";

const VehiclePanel = ({
  vehiclePanelRef,
  vehiclePanelOpen,
  setVehiclePanelOpen,
  selectedVehicle,
  setSelectedVehicle,
  setConfirmRidePanel,
  fare,
  fareLoading,
}) => {
  return (
    <div>
      <div
        ref={vehiclePanelRef}
        className={`fixed bottom-0 left-0 right-0 z-10 w-full bg-white transition-transform duration-500 ${vehiclePanelOpen ? "translate-y-0" : "translate-y-full"}`}
      >
        <h1
          className="flex justify-center items-center text-gray-400 text-3xl mx-auto p-5 w-[50%] "
          onClick={() => {
            setVehiclePanelOpen(false);
          }}
        >
          <i className="ri-arrow-down-wide-line "></i>
        </h1>
        <h3 className="text-2xl font-semibold pt-4  pl-6 ">Choose a vehicle</h3>

        {/* Vehicle rows */}
        <div className="flex flex-col p-5 gap-2">
          {/* 1st row -car*/}
          <div
            onClick={() => {
              setSelectedVehicle("car");
              setConfirmRidePanel(true);
            }}
            className={`grid bg-gray-100 w-full grid-cols-[7rem_minmax(0,1fr)_auto] items-center gap-4 rounded-xl border-2 pr-2 ${selectedVehicle === "car" ? "border-black" : "border-gray-200"}`}
          >
            <div className="flex justify-center">
              <img className="h-[10vh] w-auto p-2" src={car} alt="Car" />
            </div>

            <div className="min-w-0 flex-1">
              <h4 className="flex items-center gap-2 text-lg font-semibold">
                <span>Caro</span>

                <span className="flex items-center gap-1 text-sm font-medium">
                  <i className="ri-user-fill"></i>4
                </span>
              </h4>

              <h5 className="text-sm font-medium min-h-5">
                {fareLoading ? "Loading..." : `${fare?.duration ?? "--"} mins away`}
              </h5>

              <p className="text-xs font-normal text-gray-600">
                Comfortable rides for everyday travel
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold min-w-20">
                {fareLoading ? "Loading..." : `₹ ${fare?.fare?.car ?? "--"}`}
              </h2>
            </div>
          </div>

          {/* 2nd row-moto */}
          <div
            onClick={() => {
              setSelectedVehicle("moto");
              setConfirmRidePanel(true);
            }}
            className={`grid  bg-gray-100  w-full grid-cols-[7rem_minmax(0,1fr)_auto] items-center gap-4 rounded-xl border-2 pr-2 ${selectedVehicle === "moto" ? "border-black" : "border-gray-200"}`}
          >
            <div className="flex justify-center">
              <img className="h-[10vh] w-auto p-2" src={bike} alt="Motorbike" />
            </div>

            <div className="min-w-0 flex-1">
              <h4 className="flex items-center gap-2 text-lg font-semibold">
                <span>Moto</span>

                <span className="flex items-center gap-1 text-sm font-medium">
                  <i className="ri-user-fill"></i>1
                </span>
              </h4>

              <h5 className="text-sm font-medium min-h-5">
                {fareLoading ? "Loading..." : `${fare?.duration ?? "--"} mins away`}
              </h5>

              <p className="text-xs font-normal text-gray-600">
                Quick and economical rides
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold min-w-20">
                {fareLoading ? "Loading..." : `₹ ${fare?.fare?.moto ?? "--"}`}
              </h2>
            </div>
          </div>

          {/* 3rd row -auto*/}
          <div
            onClick={() => {
              setSelectedVehicle("auto");
              setConfirmRidePanel(true);
            }}
            className={`grid  bg-gray-100  w-full grid-cols-[7rem_minmax(0,1fr)_auto] items-center gap-4 rounded-xl border-2 pr-2 ${selectedVehicle === "auto" ? "border-black" : "border-gray-200"}`}
          >
            <div className="flex justify-center">
              <img className="h-[10vh] w-auto p-2" src={auto} alt="auto" />
            </div>

            <div className="min-w-0 flex-1">
              <h4 className="flex items-center gap-2 text-lg font-semibold">
                <span>Auto</span>

                <span className="flex items-center gap-1 text-sm font-medium">
                  <i className="ri-user-fill"></i>3
                </span>
              </h4>

              <h5 className="text-sm font-medium min-h-5">
                {fareLoading ? "Loading..." : `${fare?.duration ?? "--"} mins away`}
              </h5>

              <p className="text-xs font-normal text-gray-600">
                Affordable rides for short trips
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold min-w-20">
                {fareLoading ? "Loading..." : `₹ ${fare?.fare?.auto ?? "--"}`}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehiclePanel;
