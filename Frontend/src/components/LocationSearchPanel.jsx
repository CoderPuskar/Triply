import React from "react";

const LocationSearchPanel = ({ setPanelOpen, setVehiclePanel }) => {
  // Sample location suggestions array
  const sampleLocations = [
    {
      id: 1,
      title: "Cyber Hub, DLF Cyber City",
      subtitle: "DLF Phase 2, Sector 24, Gurugram, Haryana",
      icon: "ri-building-2-fill",
    },

    {
      id: 2,
      title: "Terminal 3, IGI International Airport",
      subtitle: "Indira Gandhi International Airport, New Delhi",
      icon: "ri-flight-takeoff-line",
    },
    {
      id: 3,
      title: "Connaught Place, Inner Circle",
      subtitle: "Near Rajiv Chowk Metro Station, Central Delhi",
      icon: "ri-map-pin-2-fill",
    },
    {
      id: 4,
      title: "24B, Near Kapoor's Cafe & Bakery",
      subtitle: "Sheryians Coding School Road, Arera Colony, Bhopal",
      icon: "ri-store-2-fill",
    },
    {
      id: 5,
      title: "New Delhi Railway Station (NDLS)",
      subtitle: "Bhavbhuti Marg, Ratan Lal Market, Kamla Market, Delhi",
      icon: "ri-train-line",
    },
    {
      id: 6,
      title: "Select Citywalk Mall, Saket",
      subtitle: "A-3, District Centre, Saket, New Delhi",
      icon: "ri-shopping-bag-3-fill",
    },
    {
      id: 7,
      title: "Sector 29 Market & Food Street",
      subtitle: "Near Leisure Valley Park, Sector 29, Gurugram",
      icon: "ri-restaurant-2-fill",
    },
  ];

  const handleLocationSelect = () => {
    setVehiclePanel(true); //vehicle panel opens
    setPanelOpen(false); //locatin panel close
  };

  return (
    <div className="h-full w-full overflow-y-auto pl-6 pr-6 pt-0">
      <div className="flex items-center justify-between pb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
        <span>Suggested Locations</span>
        <span className="text-gray-500">Recent</span>
      </div>

      <div className="space-y-2">
        {sampleLocations.map((location) => (
          <div
            key={location.id}
            onClick={handleLocationSelect}
            className="group flex cursor-pointer items-center justify-start gap-4 rounded-2xl border-2 border-transparent p-3 transition-all duration-200 hover:border-gray-200 hover:bg-gray-50 active:border-black active:bg-gray-100"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#eee] text-gray-700 transition-colors group-hover:bg-black group-hover:text-white">
              <i
                className={`${location.icon || "ri-map-pin-fill"} text-xl`}
              ></i>
            </div>

            <div className="min-w-0 flex-1">
              <h4 className="truncate text-base font-semibold text-gray-900">
                {location.title}
              </h4>
              <p className="truncate text-xs text-gray-500 mt-0.5">
                {location.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LocationSearchPanel;
