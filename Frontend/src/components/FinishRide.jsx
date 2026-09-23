import axios from "axios";
import cat from "../assets/CatFace.avif";
import { Link, useNavigate } from "react-router-dom";


const FinishRide = (props) => {
  const navigate = useNavigate();
  
  async function endRide() {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/endRide`,
        { rideId: props.ride?._id },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );
      if (response.status === 200) {
        props.setFinishRidePanel(false);
        navigate("/captain-home");
      }
    } catch (error) {
      console.error(
        "Error ending ride:",
        error.response?.data || error.message,
      );
    }
  }

  return (
    <div>
      <h5
        className="p-1 text-center w-[93%] absolute top-0"
        onClick={() => {
          props.setFinishRidePanel(false);
        }}
      >
        <i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i>
      </h5>
      <h3 className="text-2xl font-semibold mb-5">Finish this Ride</h3>
      <div className="flex items-center justify-between p-4 border-2 border-yellow-400 rounded-lg mt-4">
        <div className="flex items-center gap-3 ">
          <img
            className="h-12 rounded-full object-cover w-12"
            src={cat}
            alt=""
          />
          <h2 className="text-lg font-medium capitalize">
            {props.ride?.user?.fullname
              ? `${props.ride.user.fullname.firstname} ${props.ride.user.fullname.lastname || ""}`
              : "Passenger"}
          </h2>
        </div>
        <h5 className="text-lg font-semibold">
          {props.ride?.distance ? `${props.ride.distance} KM` : "--"}
        </h5>
      </div>
      <div className="flex gap-2 justify-between flex-col items-center">
        <div className="w-full mt-5">
          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="ri-map-pin-user-fill"></i>
            <div>
              <h3 className="text-lg font-medium">562/11-A</h3>
              <p className="text-sm -mt-1 text-gray-600">
                {props.ride?.pickup ?? "Pickup unavailable"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="text-lg ri-map-pin-2-fill"></i>
            <div>
              <h3 className="text-lg font-medium">562/11-A</h3>
              <p className="text-sm -mt-1 text-gray-600">
                {props.ride?.destination ?? "Destination unavailable"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3">
            <i className="ri-currency-line"></i>
            <div>
              <h3 className="text-lg font-medium">
                ₹{props.ride?.fare ?? "--"}
              </h3>
              <p className="text-sm -mt-1 text-gray-600">Cash Cash</p>
            </div>
          </div>
        </div>

        <div className="mt-10 w-[90%] gap-2 flex flex-col">
          <button
            type="button"
            onClick={endRide}
            className="w-full flex  text-lg justify-center bg-green-600 text-white font-semibold p-3 rounded-lg"
          >
            Finish Ride
          </button>
          <p className="p-2 text-sm text-red-500 ">
            click on finish button if you are already completed the payment yet
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default FinishRide;
