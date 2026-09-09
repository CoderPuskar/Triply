import React from "react";
import cat from "../assets/CatFace.avif";

// this is fr ride request popup for captain to accept or ignore the ride request

const RidePopUp = (props) => {
  return (
    <div className="rounded-t-2xl p-3 bg-white w-full">
      <h5
        className="p-2  text-center w-[93%] absolute top-0 flex justify-center items-center"
        onClick={() => {
          props.setRidePopupPanel(false);
        }}
      >
        <i className="text-3xl text-gray-300 ri-arrow-down-wide-line "></i>
      </h5>
      <h3 className="text-2xl font-semibold mb-5 pt-2 m-2">
        New Ride Available!
      </h3>

      {/* details */}
      <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg mt-4">
        {/* first row- image and name  */}
        <div className="flex items-center gap-3 ">
          <img
            className="h-12 rounded-full object-cover w-12"
            src={cat}
            alt=""
          />
          <h2 className="text-lg font-medium">Sakshi Singh</h2>
        </div>
        {/* distance */}
        <h5 className="text-lg font-semibold">2.2 KM</h5>
      </div>

      {/* details */}
      <div className="flex gap-2 justify-between flex-col items-center">
        <div className="w-full mt-5">
          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="ri-map-pin-user-fill"></i>
            <div>
              <h3 className="text-lg font-medium">562/11-A</h3>
              <p className="text-sm -mt-1 text-gray-600">
                {props.ride?.pickup}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="text-lg ri-map-pin-2-fill"></i>
            <div>
              <h3 className="text-lg font-medium">562/11-A</h3>
              <p className="text-sm -mt-1 text-gray-600">
                {props.ride?.destination}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3">
            <i className="ri-currency-line"></i>
            <div>
              <h3 className="text-lg font-medium">₹195.20 </h3>
              <p className="text-sm -mt-1 text-gray-600">Cash Cash</p>
            </div>
          </div>
        </div>

        <div className="mt-5 w-full flex items-center justify-between ">
          {/* accept Button */}
          <button
            onClick={() => {
              props.setConfirmRidePopupPanel(true);
              props.confirmRide();
            }}
            className=" bg-green-600 text-white font-semibold p-3 px-10 rounded-lg"
          >
            Accept
          </button>
          {/* ignore Button */}
          <button
            onClick={() => {
              props.setRidePopupPanel(false);
            }}
            className=" bg-gray-300 text-gray-700 font-semibold p-3 px-10 rounded-lg"
          >
            Ignore
          </button>
        </div>

      </div>
    </div>
  );
};

export default RidePopUp;
