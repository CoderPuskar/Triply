import { useEffect, useContext } from "react";
import { CaptainDataContext } from "../context/CaptainContext";
import profilePic from "../assets/ProfilePic.jpg";

const CaptainDetails = ({ stats }) => {
  const { captain } = useContext(CaptainDataContext);

  useEffect(() => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "auto",
    });
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-start gap-3">
          <img
            className="h-20 w-20 rounded-full object-cover"
            src={profilePic}
            alt="Profile"
          />
          <div>
            <h4 className="text-lg font-medium capitalize">
              {captain?.fullname?.firstname} {captain?.fullname?.lastname}
            </h4>
            <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
              <span
                className={`h-2 w-2 rounded-full ${stats?.isOnline ? "bg-green-500" : "bg-gray-400"}`}
              />
              {stats?.isOnline ? "Online now · live stats" : "Offline · today’s totals"}
            </p>
          </div>
        </div>
        <div>
          <h4 className="text-xl font-semibold">
            ₹{Number(stats?.earnings || 0).toFixed(2)}
          </h4>
          <p className="text-sm text-gray-600">Earned today</p>
        </div>
      </div>
      {/* Stats  */}
      <div className="grid grid-cols-3 p-3 bg-gray-100 rounded-xl justify-items-center gap-2 items-center mt-5">
        <div className="text-center">
          <i className="text-3xl mb-2 font-thin ri-timer-2-line"></i>
          <h5 className="text-lg font-medium">
            {formatOnlineTime(stats?.onlineSeconds || 0)}
          </h5>
          <p className="text-sm text-gray-600">Online today</p>
        </div>
        <div className="text-center">
          <i className="text-3xl mb-2 font-thin ri-speed-up-line"></i>
          <h5 className="text-lg font-medium">{Number(stats?.distanceKm || 0).toFixed(1)} km</h5>
          <p className="text-sm text-gray-600">Ridden today</p>
        </div>
        <div className="text-center">
          <i className="text-3xl mb-2 font-thin ri-booklet-line"></i>
          <h5 className="text-lg font-medium">{stats?.rides || 0}</h5>
          <p className="text-sm text-gray-600">Rides today</p>
        </div>
      </div>
    </div>
  );
};

const formatOnlineTime = (seconds) => {
  const totalMinutes = Math.floor(seconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes}m`;
};

export default CaptainDetails;
