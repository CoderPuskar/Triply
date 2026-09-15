import React from "react";
import white_car from "../assets/white car.png";

const ConfirmRide = (props) => {
  return (
    <div>
      <div className="bg-red-700"></div>
      <h1
        className="flex justify-center items-center text-gray-400 text-3xl mx-auto p-5 w-[50%] "
        onClick={() => {
          props.setConfirmRidePanel(false);
          props.setVehiclePanelOpen(false);
        }}
      >
        <i className="ri-arrow-down-wide-line "></i>
      </h1>
      <h3 className="text-2xl font-semibold pt-4  pl-10 ">Confirm your Ride</h3>

      <div className="flex gap-5 justify-between flex-col items-center">
        {/* car image  */}
        <img className="h-[25vh] mt-2" src={white_car} alt="car image " />
        {/* details  */}
        <div className="w-full flex flex-col gap-2">
          {/*customer location */}
          <div className="flex px-8 gap-2 items-center  py-2 border-b-2 border-gray-100 mx-10">
            <i className="ri-map-pin-user-fill"></i>
            <div>
              <h3>562/11-A</h3>
              <p>123 Main Street</p>
            </div>
          </div>
          {/* car location */}
          <div className="flex px-8 gap-2 items-center py-2 border-b-2 border-gray-100 mx-10">
            <i className="ri-map-pin-3-fill"></i>
            <div>
              <h3>562/11-A</h3>
              <p>123 Main Street</p>
            </div>
          </div>
          {/* cash */}
          <div className="flex px-8 gap-2 items-center py-2  mx-10">
            <i className="ri-money-rupee-circle-fill"></i>
            <div>
              <h3>₹193.20</h3>
              <p>Cash</p>
            </div>
          </div>
        </div>
        {/* confirmbutton  */}
        <button className=" flex justify-center items-center  bg-green-600 text-white rounded-lg font-semibold cursor-pointer mb-5  w-[80%] py-2"
        onClick={() => {
          props.setConfirmRidePanel(false);
          props.setvehicleFound(true);
        }}
        >
          Confirm Ride
        </button>
      </div>
    </div>
  );
};

export default ConfirmRide;
