import { useEffect, useRef, useState } from "react";
import {
  CircleMarker,
  MapContainer,
  Popup,
  Polyline,
  TileLayer,
  Tooltip,
  useMap,
  useMapEvents,
  ZoomControl,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

const DEFAULT_LOCATION = [22.5726, 88.3639];

const FollowUser = ({ position }) => {
  const map = useMap();
  const hasSetInitialView = useRef(false);

  useEffect(() => {
    if (position && !hasSetInitialView.current) {
      map.setView(position, Math.max(map.getZoom(), 16), { animate: false });
      hasSetInitialView.current = true;
    }
  }, [map, position]);

  return null;
};

const MapClickHandler = ({ onLocationSelect }) => {
  useMapEvents({
    click: ({ latlng }) => {
      onLocationSelect?.({
        latitude: latlng.lat,
        longitude: latlng.lng,
      });
    },
  });

  return null;
};

const Map = ({
  destinationLocation,
  captainLocation,
  liveLocation,
  liveLocationLabel = "Your live location",
  onLocationSelect,
  onUserLocationChange,
  pickupLocation,
  pickupLocationLabel = "Passenger pickup",
  routeCoordinates,
  secondaryRouteCoordinates,
}) => {
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      console.warn("Geolocation is not supported by this browser.");
      return undefined;
    }

    const watchId = navigator.geolocation.watchPosition(
      ({ coords }) => {
        const location = [coords.latitude, coords.longitude];
        setUserLocation(location);
        onUserLocationChange?.({
          latitude: coords.latitude,
          longitude: coords.longitude,
        });
      },
      (error) => {
        console.warn("Unable to get the user's live location:", error.message);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 20_000,
      },
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [onUserLocationChange]);

  const displayedLiveLocation = liveLocation
    ? [liveLocation.latitude, liveLocation.longitude]
    : userLocation;

  const handleMapClick = (location) => {
    onLocationSelect?.(location);
  };

  return (
    <MapContainer
      center={DEFAULT_LOCATION}
      zoom={13}
      zoomControl={false}
      style={{ height: "100%", width: "100%" }}
    >
      <ZoomControl position="topright" />
      <TileLayer
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
      />

      <FollowUser position={displayedLiveLocation} />
      <MapClickHandler onLocationSelect={handleMapClick} />

      {displayedLiveLocation && (
        <CircleMarker
          center={displayedLiveLocation}
          radius={10}
          pathOptions={{ color: "#ffffff", fillColor: "#2563eb", fillOpacity: 1, weight: 3 }}
        >
          <Popup>{liveLocationLabel}</Popup>
          <Tooltip permanent direction="top" offset={[0, -10]}>
            {liveLocationLabel}
          </Tooltip>
        </CircleMarker>
      )}

      {pickupLocation && (
        <CircleMarker
          center={[pickupLocation.latitude, pickupLocation.longitude]}
          radius={9}
          pathOptions={{ color: "#ffffff", fillColor: "#16a34a", fillOpacity: 1, weight: 3 }}
        >
          <Popup>{pickupLocationLabel}</Popup>
          <Tooltip permanent direction="top" offset={[0, -10]}>
            {pickupLocationLabel}
          </Tooltip>
        </CircleMarker>
      )}

      {captainLocation && (
        <CircleMarker
          center={[captainLocation.latitude, captainLocation.longitude]}
          radius={10}
          pathOptions={{ color: "#ffffff", fillColor: "#f59e0b", fillOpacity: 1, weight: 3 }}
        >
          <Popup>Captain's live location</Popup>
          <Tooltip permanent direction="top" offset={[0, -10]}>
            Captain's live location
          </Tooltip>
        </CircleMarker>
      )}

      {destinationLocation && (
        <CircleMarker
          center={[destinationLocation.latitude, destinationLocation.longitude]}
          radius={9}
          pathOptions={{ color: "#ffffff", fillColor: "#dc2626", fillOpacity: 1, weight: 3 }}
        >
          <Popup>Destination</Popup>
        </CircleMarker>
      )}

      {routeCoordinates?.length > 1 && (
        <Polyline positions={routeCoordinates} pathOptions={{ color: "#2563eb", weight: 5 }} />
      )}
      {secondaryRouteCoordinates?.length > 1 && (
        <Polyline
          positions={secondaryRouteCoordinates}
          pathOptions={{ color: "#f59e0b", weight: 4, dashArray: "8 10" }}
        />
      )}
    </MapContainer>
  );
};

export default Map;
