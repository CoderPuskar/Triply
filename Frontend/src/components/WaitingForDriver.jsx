import React from "react";

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
          src="https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg"
          alt="Maruti Suzuki Alto"
        />
        <div className="text-right">
          <h2 className="text-lg font-medium">Rahul Sharma</h2>
          <h4 className="text-xl font-semibold">DL 01 AB 1234</h4>
          <p className="text-sm text-gray-600">Maruti Suzuki Alto</p>
          <p className="text-sm font-semibold">
            4.8 <i className="ri-star-fill text-yellow-500"></i>
          </p>
        </div>
      </div>

      <div className="mt-4 w-full">
        <div className="flex items-center gap-4 border-b border-gray-100 py-3">
          <i className="ri-map-pin-user-fill text-lg text-gray-600"></i>
          <div>
            <h3 className="text-lg font-medium">562/11-A</h3>
            <p className="text-sm text-gray-600">Koramangala, Bengaluru</p>
          </div>
        </div>
        <div className="flex items-center gap-4 border-b border-gray-100 py-3">
          <i className="ri-map-pin-2-fill text-lg text-gray-600"></i>
          <div>
            <h3 className="text-lg font-medium">100 Feet Road</h3>
            <p className="text-sm text-gray-600">Indiranagar, Bengaluru</p>
          </div>
        </div>
        <div className="flex items-center gap-4 py-3">
          <i className="ri-currency-line text-lg text-gray-600"></i>
          <div>
            <h3 className="text-lg font-medium">₹193.20</h3>
            <p className="text-sm text-gray-600">Cash</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitingForDriver;