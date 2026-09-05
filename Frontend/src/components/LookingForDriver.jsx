import React from "react";
import white_car from "../assets/white car.png";

const LookingForDriver = (props) => {
  return (
    <div className="h-full w-full overflow-y-auto pl-6 pr-6 pt-0 mb-5">
      
      
      <h3 className="text-2xl font-semibold pt-4  pl-10 ">
        Looking for a Driver
        
 <div className="loader mt-2 justify-center flex mr-10 "></div>


      </h3>

      <div className="flex gap-5 justify-between flex-col items-center">
        {/* car image  */}
        <img className="h-[25vh] mt-2" src={white_car} alt="car image " />
        {/* details  */}
        <div className="w-full flex flex-col gap-2">
          {/*customer location */}
          <div className="flex px-8 gap-2 items-center  py-2 border-b-2 border-gray-100 mx-10">
            <i class="ri-map-pin-user-fill"></i>
            <div>
              <h3>562/11-A</h3>
              <p>123 Main Street</p>
            </div>
          </div>
          {/* car location */}
          <div className="flex px-8 gap-2 items-center py-2 border-b-2 border-gray-100 mx-10">
            <i class="ri-map-pin-3-fill"></i>
            <div>
              <h3>562/11-A</h3>
              <p>123 Main Street</p>
            </div>
          </div>
          {/* cash */}
          <div className="flex px-8 gap-2 items-center py-2  mx-10">
            <i class="ri-money-rupee-circle-fill"></i>
            <div>
              <h3>₹193.20</h3>
              <p>Cash</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LookingForDriver;
