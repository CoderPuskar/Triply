import { useEffect, useContext } from "react";
import { CaptainDataContext } from "../context/CaptainContext";
import profilePic from "../assets/ProfilePic.jpg";

const CaptainDetails = () => {
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
          <h4 className="text-lg font-medium capitalize">{captain.fullname.firstname+ " " + captain.fullname.lastname}</h4>
        </div>
        <div>
          <h4 className="text-xl font-semibold">₹295.20</h4>
          <p className="text-sm text-gray-600">Earned</p>
        </div>
      </div>
      {/* Stats  */}
      <div className="flex p-3  bg-gray-100 rounded-xl justify-center gap-5 items-center mt-15">
        <div className="text-center">
          <i className="text-3xl mb-2 font-thin ri-timer-2-line"></i>
          <h5 className="text-lg font-medium">10.2</h5>
          <p className="text-sm text-gray-600">Hours Online</p>
        </div>
        <div className="text-center">
          <i className="text-3xl mb-2 font-thin ri-speed-up-line"></i>
          <h5 className="text-lg font-medium">10.2</h5>
          <p className="text-sm text-gray-600">Hours Online</p>
        </div>
        <div className="text-center">
          <i className="text-3xl mb-2 font-thin ri-booklet-line"></i>
          <h5 className="text-lg font-medium">10.2</h5>
          <p className="text-sm text-gray-600">Hours Online</p>
        </div>
      </div>
    </div>
  );
};

export default CaptainDetails;
