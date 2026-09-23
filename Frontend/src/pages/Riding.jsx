import { useContext, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import white_car from "../assets/white car.png";
import map from "../assets/map_img.png";
import { SocketContext } from "../context/SocketContext";


const Riding = () => {
  const { state } = useLocation();
  let ride = state?.ride;
  const { receiveMessage } = useContext(SocketContext);
  const navigate = useNavigate();

  if (!ride) {
    try {
      ride = JSON.parse(localStorage.getItem("activeRide"));
    } catch {
      ride = null;
    }
  }

  useEffect(() => {
    return receiveMessage("rideEnded", (endedRide) => {
      if (endedRide._id === ride?._id) {
        localStorage.removeItem("activeRide");
        navigate("/home");
      }
    });
  }, [navigate, receiveMessage, ride?._id]);

  useEffect(() => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "auto",
    });
  }, []);

  return (
    <div className="h-screen">
      {/* home button */}
      <Link
        to="/home"
        className="fixed right-2 top-2 h-10 w-10 bg-white flex items-center justify-center rounded-full"
      >
        <i className="text-lg font-medium ri-home-5-line"></i>
      </Link>
      {/* map */}
      <div className="h-1/2">
        <img className="h-full w-full object-cover" src={map} alt="" />
      </div>
      {/* details */}
      <div className="h-1/2 p-5 flex flex-col">
        <div className="flex items-center justify-between">
          <img className="h-30" src={white_car} alt="" />
          {/* car details */}
          <div className="text-right">
            <h2 className="text-lg font-medium capitalize">
              {ride?.captain?.fullname?.firstname ?? "Driver"}
            </h2>
            <h4 className="text-xl font-semibold -mt-1 -mb-1">
              {ride?.captain?.vehicle?.numberplate ?? "Plate unavailable"}
            </h4>
            <p className="text-sm text-gray-600 capitalize">
              {ride?.captain?.vehicle?.vehicalType ?? "Vehicle unavailable"}
            </p>
          </div>
        </div>
        {/* payment details */}
        <div className="flex gap-2 justify-between flex-col items-center">
          <div className="w-full bg-gray-100 rounded-lg py-7 px-5 mt-5">
            <div className="flex items-center gap-5 p-3 border-b-2">
              <i className="text-lg ri-map-pin-2-fill"></i>
              <div>
                <h3 className="text-lg font-medium">Pickup</h3>
                <p className="text-sm -mt-1 text-gray-600">
                  {ride?.pickup ?? "Pickup unavailable"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-5 p-3 border-b-2">
              <i className="text-lg ri-map-pin-2-fill"></i>
              <div>
                <h3 className="text-lg font-medium">Destination</h3>
                <p className="text-sm -mt-1 text-gray-600">
                  {ride?.destination ?? "Destination unavailable"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-5 p-3">
              <i className="ri-currency-line"></i>
              <div>
                <h3 className="text-lg font-medium">₹{ride?.fare ?? "--"}</h3>
                <p className="text-sm -mt-1 text-gray-600">Cash Cash</p>
              </div>
            </div>
          </div>
        </div>
        {/* payment button */}
        <div className="mt-5">
          <button className="w-full mt-auto mb-1 flex justify-center bg-green-600 text-white font-semibold p-2 rounded-lg hover:bg-green-700 transition-colors duration-300">
            Make a Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default Riding;
