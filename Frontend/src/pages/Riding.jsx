import React from "react";
import { useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import white_car from "../assets/white car.png";
import map from "../assets/map_img.png";

const Riding = () => {
  return (
    <div className="h-screen">
      <Link
        to="/home"
        className="fixed right-2 top-2 h-10 w-10 bg-white flex items-center justify-center rounded-full"
      >
        <i className="text-lg font-medium ri-home-5-line"></i>
      </Link>

      <div className="h-1/2">
        <img className="h-full w-full object-cover" src={map} alt="" />
      </div>

      <div className="h-1/2 p-4 flex flex-col">
        <div className="flex items-center justify-between">
          <img className="h-30" src={white_car} alt="" />
          <div className="text-right">
            <h2 className="text-lg font-medium capitalize">John Doe</h2>
            <h4 className="text-xl font-semibold -mt-1 -mb-1">DL1C1234</h4>
            <p className="text-sm text-gray-600">Maruti Suzuki Alto</p>
          </div>
        </div>

        <div className="flex gap-2 justify-between flex-col items-center">
          <div className="w-full bg-gray-100 rounded-lg">
            <div className="flex items-center gap-5 p-3 border-b-2">
              <i className="text-lg ri-map-pin-2-fill"></i>
              <div>
                <h3 className="text-lg font-medium">562/11-A</h3>
                <p className="text-sm -mt-1 text-gray-600">123 Main Street</p>
              </div>
            </div>
            <div className="flex items-center gap-5 p-3">
              <i className="ri-currency-line"></i>
              <div>
                <h3 className="text-lg font-medium">₹192.20 </h3>
                <p className="text-sm -mt-1 text-gray-600">Cash Cash</p>
              </div>
            </div>
          </div>
        </div>
        <button className="w-full mt-auto mb-1 flex justify-center bg-green-600 text-white font-semibold p-2 rounded-lg hover:bg-green-700 transition-colors duration-300">
          Make a Payment
        </button>
      </div>
    </div>
  );
};

export default Riding;
