import { Box, CircularProgress } from "@mui/material";
import { MapContainer, TileLayer, Marker, ZoomControl } from "react-leaflet";
import type { LatLngTuple } from "leaflet";
import { useUserLocation } from "../../hooks/useUserLocation";
import { useStore } from "../../store";
import { selectSelectedLocation } from "../../store/selectors/mapLocationSelector";
import { RecenterMap } from "../../components/RecenterMap";

const FALLBACK_LOCATION: LatLngTuple = [23.7806, 90.4074];

export const Home = () => {
  const { location, loading } = useUserLocation(FALLBACK_LOCATION);
  const selectedLocation = useStore(selectSelectedLocation);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress enableTrackSlot size="3rem" />
      </Box>
    );
  }

  const mapCenter: LatLngTuple = selectedLocation
    ? [selectedLocation.lat, selectedLocation.lng]
    : location;

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        position: "absolute",
        inset: 0,
      }}
    >
      <MapContainer
        center={mapCenter}
        zoom={13}
        zoomControl={false}
        style={{
          height: "100vh",
          width: "100%",
          zIndex: 1,
        }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={location} />
        <ZoomControl position="bottomright" />
        {selectedLocation && (
          <>
            <Marker position={mapCenter} />
            <RecenterMap position={mapCenter} />
          </>
        )}
      </MapContainer>
    </Box>
  );
};

export default Home;
