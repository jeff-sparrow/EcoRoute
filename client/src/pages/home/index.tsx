import { Box, Button, CircularProgress, Stack, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Snackbar, Alert } from "@mui/material";
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
import { useEffect, useMemo, useState } from "react";
import { useUserLocation } from "../../hooks/useUserLocation";
import { useStore } from "../../store";
import { selectSelectedLocation } from "../../store/selectors/mapLocationSelector";
import { RecenterMap } from "../../components/RecenterMap";
import { useQuery } from "@tanstack/react-query";
import { getRoute, saveUserTrip } from "../../utils/api-services/location";
import orsInstance from "../../utils/api-services/orsInstance";
import { axios } from "../../utils/api-services";
import DirectionsIcon from "@mui/icons-material/Directions";
import { RouteSidebar } from "./RouteSidebar";
import type { IRouteResponse } from "../../models/location";

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
  const { location, loading, usedFallback } = useUserLocation(FALLBACK_LOCATION);
  const [fallbackSnackbarOpen, setFallbackSnackbarOpen] = useState(true);
  const selectedLocation = useStore(selectSelectedLocation);
  const greenPreference = useStore((state) => state.greenPreference);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isWarningDialogOpen, setIsWarningDialogOpen] = useState(false);

  const { data, refetch, isFetching } = useQuery<IRouteResponse>({
    queryKey: ["route", location, selectedLocation],
    queryFn: async () => {
      if (!selectedLocation) throw new Error("Selected location required");

      const response = await getRoute({
        api: orsInstance,
        data: {
          start: {
            lat: location[0],
            lon: location[1],
            name: "My Location",
          },
          end: {
            lat: selectedLocation.lat,
            lon: selectedLocation.lng,
            name: selectedLocation.label || "Destination",
          },
          greenPreference: greenPreference,
        },
      });

      return response.data;
    },
    enabled: false,
  });

  const lowestScoreRoute = useMemo(() => {
    if (!data || data.routes.length === 0) return null;

    return data.routes.reduce((prev, current) =>
      current.rankingScore < prev.rankingScore ? current : prev,
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

    return data.routes.find((route) => route.mode === vehicleMode) ?? null;
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

  const proceedWithNavigation = async () => {
    setIsNavigating(true);
    const user = useStore.getState().user;
    if (user && activeRoute) {
      try {
        await saveUserTrip({
          api: axios,
          data: {
            userId: user.userId,
            payload: {
              mode: activeRoute.mode,
              distanceKm: activeRoute.distanceKm,
              routeCo2Grams: activeRoute.carbonGrams,
              baselineMode: 'car',
            }
          }
        });
        console.log("Trip saved to database successfully.");
      } catch (e) {
        console.error("Failed to save user trip:", e);
      }
    }
  };

  const handleGoNavigation = async () => {
    if (activeRoute && (activeRoute.mode === "walk" || activeRoute.mode === "bike") && data?.weather?.warnings?.length) {
      setIsWarningDialogOpen(true);
      return;
    }
    await proceedWithNavigation();
  };

  const handleOnCloseRouteSidebar = () => {
    setIsSideBarOpen(false);
    clearSelectedLocation();
  };
  return (
    <Stack direction={{ xs: "column-reverse", md: "row" }} height="100%">
      {data && (
        <Box
          sx={{
            width: { xs: "100%", md: 350 },
            flexShrink: 0,
            height: { xs: "40%", md: "100%" },
            overflowY: "auto",
            zIndex: 1000,
            backgroundColor: "white",
          }}
        >
          <RouteSidebar
            routes={data.routes}
            onClose={handleOnCloseRouteSidebar}
            startLabel="My Location"
            endLabel={selectedLocation?.label || ""}
            isNavigating={isNavigating}
          />
        </Box>
      )}
      <Box
        sx={{
          height: "100%",
          width: "100%",
          inset: 0,
          flex: 1,
          position: "relative",
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
        {selectedLocation && (
          <Box
            sx={{
              position: "absolute",
              bottom: 20,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 2000,
            }}
          >
            {route.length === 0 ? (
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
            ) : (
              <Button
                variant="contained"
                color={isNavigating ? "error" : "success"}
                size="large"
                onClick={() => isNavigating ? setIsNavigating(false) : handleGoNavigation()}
                sx={{ borderRadius: "50px", px: 4, py: 1.5, fontSize: "1.2rem", fontWeight: "bold" }}
              >
                {isNavigating ? "Stop" : "Go"}
              </Button>
            )}
          </Box>
        )}
      </Box>
      <Dialog
        open={isWarningDialogOpen}
        onClose={() => setIsWarningDialogOpen(false)}
      >
        <DialogTitle>Weather Warning</DialogTitle>
        <DialogContent>
          <DialogContentText color="error">
            {data?.weather?.warnings?.map((w, i) => (
              <Box key={i} component="span" display="block">
                • {w}
              </Box>
            ))}
          </DialogContentText>
          <DialogContentText mt={2}>
            Are you sure you want to proceed?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsWarningDialogOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={() => {
              setIsWarningDialogOpen(false);
              proceedWithNavigation();
            }}
            color="error"
            autoFocus
          >
            Proceed anyway
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={usedFallback && fallbackSnackbarOpen}
        autoHideDuration={8000}
        onClose={() => setFallbackSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setFallbackSnackbarOpen(false)}
          severity="warning"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Could not access your location. Defaulting to Eugene, OR.
        </Alert>
      </Snackbar>
    </Stack>
  );
};

export default Home;
