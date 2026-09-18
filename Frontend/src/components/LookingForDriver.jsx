import React from "react";
import white_car from "../assets/white car.png";
import auto from "../assets/auto.png";
import bike from "../assets/bike.png";

const vehicleImages = {
  car: white_car,
  moto: bike,
  auto,
};

const LookingForDriver = (props) => {
  const currentVehicleType =
    props.ride?.vehicleType || props.vehicleType || "car";
  const pickupText = props.ride?.pickup || props.pickup || "";
  const destinationText = props.ride?.destination || props.destination || "";

  const pickupMain = pickupText.split(",")[0]?.trim() || "Pickup Location";
  const pickupSub =
    pickupText.split(",").slice(1).join(",").trim() || pickupText;

  const destMain =
    destinationText.split(",")[0]?.trim() || "Destination Location";
  const destSub =
    destinationText.split(",").slice(1).join(",").trim() || destinationText;

  const fareAmount =
    props.ride?.fare ??
    props.fare?.fare?.[currentVehicleType] ??
    props.fare?.[currentVehicleType] ??
    "--";

  return (
    <div className="relative h-full w-full overflow-y-auto pl-6 pr-6 pt-0 mb-5">
      <h5
        className="p-1 text-center w-[93%] absolute top-0 cursor-pointer"
        onClick={() => {
          if (props.setvehicleFound) props.setvehicleFound(false);
        }}
      >
        <i className="text-3xl text-gray-300 ri-arrow-down-wide-line"></i>
      </h5>

      <h3 className="text-2xl font-semibold pt-4 pl-10">
        Looking for a Driver
        <div className="loader mt-2 justify-center flex mr-10"></div>
      </h3>

      <div className="flex gap-5 justify-between flex-col items-center">
        {/* selected vehicle image */}
        <img
          className="h-[25vh] mt-2 object-contain"
          src={vehicleImages[currentVehicleType] || white_car}
          alt={`${currentVehicleType} vehicle`}
        />
        {/* details */}
        <div className="w-full flex flex-col gap-2">
          {/* customer location */}
          <div className="flex px-8 gap-2 items-center py-2 border-b-2 border-gray-100 mx-10">
            <i className="ri-map-pin-user-fill text-lg text-gray-700"></i>
            <div>
              <h3 className="text-base font-semibold text-gray-900">
                {pickupMain}
              </h3>
              <p className="text-xs text-gray-500">{pickupSub}</p>
            </div>
          </div>
          {/* car location */}
          <div className="flex px-8 gap-2 items-center py-2 border-b-2 border-gray-100 mx-10">
            <i className="ri-map-pin-3-fill text-lg text-gray-700"></i>
            <div>
              <h3 className="text-base font-semibold text-gray-900">
                {destMain}
              </h3>
              <p className="text-xs text-gray-500">{destSub}</p>
            </div>
          </div>
          {/* cash */}
          <div className="flex px-8 gap-2 items-center py-2 mx-10">
            <i className="ri-money-rupee-circle-fill text-lg text-gray-700"></i>
            <div>
              <h3 className="text-base font-semibold text-gray-900">
                ₹{fareAmount}
              </h3>
              <p className="text-xs text-gray-500">Cash Payment</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LookingForDriver;
