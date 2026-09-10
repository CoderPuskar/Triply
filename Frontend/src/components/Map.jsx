import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { ZoomControl } from "react-leaflet";
const Map = () => {
  return (
    <MapContainer
      center={[22.5726, 88.3639]}
      zoom={13}
      zoomControl={false}
      style={{ height: "100%", width: "100%" }}
    >
      <ZoomControl position="topright" />
      <TileLayer
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
      />

      <Marker position={[22.5726, 88.3639]}>
        <Popup>Triply pickup location</Popup>
      </Marker>
    </MapContainer>
  );
};

export default Map;
