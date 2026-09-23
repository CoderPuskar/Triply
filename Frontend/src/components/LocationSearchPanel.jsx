import { useEffect, useState } from "react";
import axios from "axios";

const LocationSearchPanel = ({
  setPanelOpen,
  setVehiclePanel,
  input,
  activeInput,
  setPickup,
  setDestination,
  onLocationSelect,
}) => {
  // This will contain suggestions received from your backend
  const [locations, setLocations] = useState([]);

  const [loading, setLoading] = useState(false);
  const query = input?.trim() || "";

  // Call backend whenever the user types
  useEffect(() => {
    if (query.length < 3) {
      const resetTimer = setTimeout(() => {
        setLocations([]);
        setLoading(false);
      }, 0);

      return () => clearTimeout(resetTimer);
    }

    let cancelled = false;

    // Debounce requests so every keystroke does not call the backend.
    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`,
          {
            params: { input: query },
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );

        if (!cancelled) {
          setLocations(Array.isArray(response.data) ? response.data : []);
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Error fetching location suggestions:", error);
          setLocations([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }, 400);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [input]);

  const handleLocationSelect = (location) => {
    const locationName =
      location.display_name || location.displayName || location.name;

    if (activeInput === "pickup") {
      setPickup(locationName);
    } else {
      setDestination(locationName);
      onLocationSelect?.(location, "destination");
    }

    // setPanelOpen(false);
  };

  return (
    <div className="h-full w-full overflow-y-auto pl-6 pr-6 pt-0">
      <div className="flex items-center justify-between pb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
        <span>Suggested Locations</span>
        <span className="text-gray-500">Recent</span>
      </div>

      {loading && (
        <p className="py-4 text-center text-sm text-gray-500">Searching...</p>
      )}

      {!loading && query.length >= 3 && locations.length === 0 && (
        <p className="py-4 text-center text-sm text-gray-500">
          No locations found
        </p>
      )}

      <div className="space-y-2">
        {locations.map((location) => (
          <div
            key={location.place_id}
            onClick={() => handleLocationSelect(location)}
            className="group flex cursor-pointer items-center justify-start gap-4 rounded-2xl border-2 border-transparent p-3 transition-all duration-200 hover:border-gray-200 hover:bg-gray-50 active:border-black active:bg-gray-100"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#eee] text-gray-700 transition-colors group-hover:bg-black group-hover:text-white">
              <i className="ri-map-pin-fill text-xl"></i>
            </div>

            <div className="min-w-0 flex-1">
              <h4 className="truncate text-base font-semibold text-gray-900">
                {location.name || location.displayName || location.display_name}
              </h4>
              <p className="mt-0.5 truncate text-xs text-gray-500">
                {location.displayName || location.display_name || location.name}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LocationSearchPanel;
