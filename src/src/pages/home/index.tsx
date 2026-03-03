import { Box, Button, CircularProgress, Stack } from "@mui/material";
import {
  MapContainer,
  TileLayer,
  Marker,
  ZoomControl,
  Polyline,
  useMap,
} from "react-leaflet";
import type { LatLngTuple } from "leaflet";
import { latLngBounds } from "leaflet";
import { useEffect, useMemo } from "react";
import { useUserLocation } from "../../hooks/useUserLocation";
import { useStore } from "../../store";
import { selectSelectedLocation } from "../../store/selectors/mapLocationSelector";
import { RecenterMap } from "../../components/RecenterMap";
import { useQuery } from "@tanstack/react-query";
import { getRoute } from "../../utils/api-services/location";
import orsInstance from "../../utils/api-services/orsInstance";
import DirectionsIcon from "@mui/icons-material/Directions";
import { RouteSidebar } from "./RouteSidebar";
import type { IRouteData } from "../../models/location";

const FALLBACK_LOCATION: LatLngTuple = [44.0444197, -123.0717603];

const FitBounds = ({ route }: { route: LatLngTuple[] }) => {
  const map = useMap();

  useEffect(() => {
    if (route.length > 0) {
      const bounds = latLngBounds(route);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [route, map]);

  return null;
};

const ResizeMap = ({ trigger }: { trigger: any }) => {
  const map = useMap();

  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 200);
  }, [trigger, map]);

  return null;
};

export const Home = () => {
  const setIsSideBarOpen = useStore((state) => state.setIsSidebarOpen);
  const clearSelectedLocation = useStore(
    (state) => state.clearSelectedLocation,
  );
  const { location, loading } = useUserLocation(FALLBACK_LOCATION);
  const selectedLocation = useStore(selectSelectedLocation);
  const greenPreference = useStore((state) => state.greenPreference);

  const { data, refetch, isFetching } = useQuery<IRouteData[]>({
    queryKey: ["route", location, selectedLocation],
    queryFn: async () => {
      if (!selectedLocation) throw new Error("Selected location required");

      const response = await getRoute({
        api: orsInstance,
        data: {
          start: [location[1], location[0]] as [number, number],
          end: [selectedLocation.lng, selectedLocation.lat],
          greenPreference: greenPreference,
        },
      });

      return response.data;
    },
    enabled: false,
  });

  const lowestScoreRoute = useMemo(() => {
    if (!data || data.length === 0) return null;

    return data.reduce((prev, current) =>
      current.score < prev.score ? current : prev,
    );
  }, [data]);
  const setVehicleMode = useStore((state) => state.setVehicleMode);

  useEffect(() => {
    if (lowestScoreRoute) {
      setVehicleMode(lowestScoreRoute.mode);
    }
  }, [lowestScoreRoute, setVehicleMode]);

  const vehicleMode = useStore((state) => state.vehicleMode);
  const activeRoute = useMemo(() => {
    if (!data || !vehicleMode) return null;

    return data.find((route) => route.mode === vehicleMode) ?? null;
  }, [data, vehicleMode]);

  const route: LatLngTuple[] = useMemo(() => {
    if (!activeRoute?.coordinates) return [];

    return activeRoute.coordinates.map(
      ([lng, lat]: [number, number]) => [lat, lng] as LatLngTuple,
    );
  }, [activeRoute]);

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
        <CircularProgress size="3rem" />
      </Box>
    );
  }

  const mapCenter: LatLngTuple = selectedLocation
    ? [selectedLocation.lat, selectedLocation.lng]
    : location;

  const handleRouteDestination = () => {
    refetch();
    setIsSideBarOpen(true);
  };
  const handleOnCloseRouteSidebar = () => {
    setIsSideBarOpen(false);
    clearSelectedLocation();
  };
  return (
    <Stack direction="row" height="100%">
      {data && (
        <Box
          sx={{
            width: 350,
            flexShrink: 0,
            height: "100%",
          }}
        >
          <RouteSidebar
            routes={data}
            onClose={handleOnCloseRouteSidebar}
            startLabel="My Location"
            endLabel={selectedLocation?.label || ""}
          />
        </Box>
      )}
      <Box
        sx={{
          height: "100%",
          width: "100%",
          inset: 0,
          flex: 1,
        }}
      >
        <MapContainer
          center={mapCenter}
          zoom={13}
          zoomControl={false}
          style={{
            height: "100%",
            width: "100%",
          }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={location} />
          {selectedLocation && (
            <>
              <Marker position={mapCenter} />
              <RecenterMap position={mapCenter} />
            </>
          )}
          {route.length > 0 && (
            <>
              <Polyline positions={route} />
              <FitBounds route={route} />
            </>
          )}
          <ZoomControl position="bottomright" />
          <ResizeMap trigger={data} />
        </MapContainer>
        {selectedLocation && route.length === 0 && (
          <Box
            sx={{
              position: "fixed",
              bottom: 20,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 2000,
            }}
          >
            <Button
              variant="contained"
              color="success"
              size="large"
              onClick={handleRouteDestination}
              disabled={isFetching}
              startIcon={<DirectionsIcon />}
            >
              {isFetching ? "Getting Directions, please wait..." : "Directions"}
            </Button>
          </Box>
        )}
      </Box>
    </Stack>
  );
};

export default Home;
