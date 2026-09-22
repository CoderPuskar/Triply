import React from "react";
import white_car from "../assets/white car.png";
const WaitingForDriver = (props) => {
  return (
    <div className="max-h-[80vh] overflow-y-auto rounded-t-3xl bg-white px-5 pb-6 pt-2 sm:px-8">
      <button
        type="button"
        aria-label="Close driver details"
        className="mx-auto block p-2 text-3xl leading-none text-gray-400"
        onClick={() => props.setWaitingForDriver(false)}
      >
        <i className="ri-arrow-down-wide-line"></i>
      </button>

      <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <img
          className="h-20 w-28 rounded-lg object-cover"
          src={white_car}
          alt="Maruti Suzuki Alto"
        />
        <div className="flex-1"></div>
        <div className="text-right">
          <h2 className="text-lg font-medium">
            {props.ride?.captain?.fullname
              ? `${props.ride.captain.fullname.firstname} ${props.ride.captain.fullname.lastname || ""}`
              : "Captain assigned"}
          </h2>
          <h4 className="text-xl font-semibold">
            {props.ride?.captain?.vehicle?.numberplate || "Vehicle assigned"}
          </h4>
          <p className="text-sm text-gray-600">
            {props.ride?.captain?.vehicle?.vehicleType || "Vehicle"}
          </p>
          <p className="text-sm font-semibold">
            4.8 <i className="ri-star-fill text-yellow-500"></i>
          </p>
          <h1 className="text-lg  font-bold">OTP: {props.ride?.otp}</h1>
        </div>
      </div>

      <div className="mt-4 w-full">
        <div className="flex items-center gap-4 border-b border-gray-100 py-3">
          <i className="ri-map-pin-user-fill text-lg text-gray-600"></i>
          <div>
            <h3 className="text-lg font-medium">Pickup</h3>
            <p className="text-sm text-gray-600">{props.ride?.pickup}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 border-b border-gray-100 py-3">
          <i className="ri-map-pin-2-fill text-lg text-gray-600"></i>
          <div>
            <h3 className="text-lg font-medium">Destination</h3>
            <p className="text-sm text-gray-600">{props.ride?.destination}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 py-3">
          <i className="ri-currency-line text-lg text-gray-600"></i>
          <div>
            <h3 className="text-lg font-medium">₹{props.ride?.fare ?? "-"}</h3>
            <p className="text-sm text-gray-600">Cash</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitingForDriver;