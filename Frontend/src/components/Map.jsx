import { useEffect, useState } from "react";
import {
  CircleMarker,
  MapContainer,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
  ZoomControl,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

const DEFAULT_LOCATION = [22.5726, 88.3639];

const FollowUser = ({ position }) => {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.setView(position, Math.max(map.getZoom(), 16), { animate: true });
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
  onLocationSelect,
  onUserLocationChange,
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
        maximumAge: 10_000,
        timeout: 20_000,
      },
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [onUserLocationChange]);

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

      <FollowUser position={userLocation} />
      <MapClickHandler onLocationSelect={handleMapClick} />

      {userLocation && (
        <CircleMarker
          center={userLocation}
          radius={10}
          pathOptions={{ color: "#ffffff", fillColor: "#2563eb", fillOpacity: 1, weight: 3 }}
        >
          <Popup>Your live location</Popup>
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
    </MapContainer>
  );
};

export default Map;
