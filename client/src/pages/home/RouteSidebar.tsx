import {
  Box,
  Typography,
  IconButton,
  Stack,
  Paper,
  Button,
  Modal,
} from "@mui/material";
import TurnLeftIcon from "@mui/icons-material/TurnLeft";
import TurnRightIcon from "@mui/icons-material/TurnRight";
import NorthIcon from "@mui/icons-material/North";
import NorthEastIcon from "@mui/icons-material/NorthEast";
import AdjustIcon from "@mui/icons-material/Adjust";
import PlaceIcon from "@mui/icons-material/Place";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

import LocationOnIcon from "@mui/icons-material/LocationOn";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import DirectionsBikeIcon from "@mui/icons-material/DirectionsBike";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import ecorouteLogo from "../../assets/ecorouteLogo.png";
import MenuIcon from "@mui/icons-material/Menu";
import { useStore } from "../../store";
import type { IRouteData } from "../../models/location";
import { useEffect, useRef, useState } from "react";
import {
  RhfAutocomplete,
  RhfTextField,
} from "../../components/React-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../constants";
import type { AxiosError, AxiosResponse } from "axios";
import { saveTrip, searchLocation } from "../../utils/api-services/location";
import { axios } from "../../utils/api-services";
import { mapSearchLocationOptions } from "../../helper/locations";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useDebounce } from "../../hooks";
import orsInstance from "../../utils/api-services/orsInstance";
import backendInstance from "../../utils/api-services/backendInstance";

const vehicleIconMap: Record<string, React.ReactNode> = {
  car: <DirectionsCarIcon fontSize="large" />,
  bike: <DirectionsBikeIcon fontSize="large" />,
  walk: <DirectionsWalkIcon fontSize="large" />,
};

const vehicleIconMapBottom: Record<string, React.ReactNode> = {
  car: <DirectionsCarIcon fontSize="large" />,
  bike: <DirectionsBikeIcon fontSize="large" sx={{ color: "black" }} />,
  walk: <DirectionsWalkIcon fontSize="large" sx={{ color: "black" }} />,
};

interface RouteSidebarProps {
  routes: IRouteData[];
  onClose: () => void;
  startLabel: string;
  endLabel: string;
}

const formatDistance = (meters: number) =>
  meters < 1000 ? `${meters.toFixed(0)} m` : `${(meters / 1000).toFixed(2)} km`;

const getStepIcon = (type: number) => {
  switch (type) {
    case 0:
      return <TurnLeftIcon />;

    case 1:
      return <TurnRightIcon />;

    case 5:
      return <NorthEastIcon />;

    case 6:
      return <NorthIcon />;

    case 10:
      return <PlaceIcon />;

    case 11:
      return <NorthIcon />;

    default:
      return <AdjustIcon />;
  }
};

const getVehicleIcon = (mode: string) => {
  return vehicleIconMap[mode] ?? <HelpOutlineIcon fontSize="small" />;
};

const getVehicleIconBottom = (mode: string) => {
  return vehicleIconMapBottom[mode] ?? <HelpOutlineIcon fontSize="small" />;
};

type SearchFormInputs = {
  searchName: string;
};

const defaultLoginFormValues: SearchFormInputs = {
  searchName: "",
};

export const RouteSidebar = ({
  routes,
  onClose,
  startLabel,
  endLabel,
}: RouteSidebarProps) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [editingStart, setEditingStart] = useState(false);
  const startLocation = useStore((state) => state.startLocation);
  const selectedLocation = useStore((state) => state.selectedLocation);
  const setStartLocation = useStore((state) => state.setStartLocation);
  const vehicleMode = useStore((state) => state.vehicleMode);
  const setVehicleMode = useStore((state) => state.setVehicleMode);
  const userId = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user") as string).id
    : null;
  console.log("USER ID:", userId);

  const activeRoute = routes.find((r) => r.mode === vehicleMode);
  const steps = activeRoute?.segments?.[0]?.steps ?? [];

  const { control, watch } = useForm<SearchFormInputs>({
    defaultValues: defaultLoginFormValues,
    mode: "onChange",
  });

  const {
    control: tripControl,
    handleSubmit,
    reset,
  } = useForm<ITripForm>({
    defaultValues: {
      trip_name: "",
      start_name: "",
      end_name: "",
    },
  });

  const query = watch("searchName") ?? "";
  const debouncedQuery = useDebounce(query, 400);

  const lastSelectedRef = useRef<string | null>(null);

  const { data: searchLocationData } = useQuery({
    queryKey: [QUERY_KEYS.SEARCH_LOCATION, debouncedQuery],
    queryFn: async () => {
      const response: AxiosResponse = await searchLocation({
        api: axios,
        url: "/search",
        data: {
          q: debouncedQuery,
          format: "json",
          addressdetails: 1,
          limit: 5,
        },
      });
      return response.data;
    },
    enabled: !!debouncedQuery && debouncedQuery.length >= 3,
    gcTime: Infinity,
    staleTime: Infinity,
  });

  const searchedLocationOptions = mapSearchLocationOptions(searchLocationData);

  useEffect(() => {
    if (!query) return;
    const matchedOption = searchedLocationOptions.find(
      (opt: any) => opt.value === query,
    );

    if (!matchedOption) return;
    if (lastSelectedRef.current === query) return;

    lastSelectedRef.current = query;
    setStartLocation({
      id: matchedOption.id,
      label: matchedOption.label,
      lat: matchedOption.lat,
      lng: matchedOption.lng,
    });
  }, [query, searchedLocationOptions, setStartLocation]);

  const getRouteMeta = (route: IRouteData) => {
    const sorted = [...routes].sort((a, b) => a.score - b.score);
    const index = sorted.findIndex((r) => r.mode === route.mode);

    if (index === 0) {
      return {
        containerSx: {
          backgroundColor: "#059669",
        },
        primaryTextColor: "white",
        secondaryTextColor: "white",
        labelColor: "white",
      };
    }

    if (index === sorted.length - 1) {
      return {
        containerSx: {
          backgroundColor: "#F59E0B",
        },
        primaryTextColor: "black",
        secondaryTextColor: "red",
        labelColor: "black",
      };
    }

    return {
      containerSx: {
        backgroundColor: "white",
      },
      primaryTextColor: "black",
      secondaryTextColor: "black",
      labelColor: "black",
    };
  };

  const { mutate: saveTripMutation, isPending: isSavingTrip } = useMutation({
    mutationFn: (data: any): Promise<AxiosResponse> =>
      saveTrip({
        api: backendInstance,
        url: `${userId}`,
        data: {
          ...data,
        },
      }),
    onSuccess: () => {
      console.log("Trip saved successfully");
      reset();
    },
    onError: (error: AxiosError) => {
      console.error(
        "Error saving trip:",
        error.response?.data || error.message,
      );
    },
  });

  const onSubmit = (data: any) => {
    const payload = {
      user_id: userId,

      ...data,

      start: startLocation
        ? [startLocation.lat, startLocation.lng]
        : (routes[0]?.coordinates?.[0] ?? [0, 0]),
      end: selectedLocation
        ? [selectedLocation.lng, selectedLocation.lat]
        : (routes[0]?.coordinates?.[routes[0].coordinates.length - 1] ?? [
            0, 0,
          ]),
      mode: activeRoute?.mode ?? "unknown",
      distance_km: activeRoute?.distance_km ?? 0,
      duration_minutes: activeRoute?.duration_min ?? 0,
      route_co2_kg: activeRoute?.carbon_kg ?? 0,
      carbon_saved_kg: activeRoute?.carbon_saved_kg ?? 0,
      // coordinates: activeRoute?.coordinates ?? [],
      // segments: activeRoute?.segments ?? [],
    };

    saveTripMutation(payload);
    handleClose();
  };

  const handleSave = async () => {
    await handleSubmit(onSubmit)();
  };

  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        width: 350,
        height: "100%",
        backgroundColor: "#0FB37A",
        color: "white",
        zIndex: 1500,
        display: "flex",
        flexDirection: "column",
        boxShadow: 3,
      }}
    >
      <Box
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Box component={"img"} src={ecorouteLogo} width={60} />
          <Stack>
            <Typography sx={{ fontWeight: 700, fontSize: 32, color: "white" }}>
              EcoRoute
            </Typography>
            <Typography sx={{ fontWeight: 400, fontSize: 12, color: "white" }}>
              Personalized low-impact commute planner
            </Typography>
          </Stack>
        </Box>
        <IconButton
          onClick={onClose}
          sx={{ color: "white", alignSelf: "flex-start" }}
        >
          <MenuIcon sx={{ color: "#fff" }} fontSize="large" />
        </IconButton>
      </Box>

      <Stack spacing={2} mx={2}>
        <Paper
          elevation={2}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            px: 2,
            py: 1.5,
            borderRadius: "10px",
            backgroundColor: "white",
            zIndex: 1500,
          }}
        >
          <LocationOnOutlinedIcon fontSize="large" sx={{ color: "#0FB37A" }} />

          {editingStart ? (
            <Box width="100%">
              <RhfAutocomplete
                control={control}
                freeSolo
                name="searchName"
                label="Where To?"
                options={searchedLocationOptions}
              />
            </Box>
          ) : (
            <>
              <Typography
                sx={{
                  flex: 1,
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {startLocation?.label || startLabel}
              </Typography>

              <Typography
                sx={{
                  fontSize: 12,
                  color: "#0FB37A",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
                onClick={() => setEditingStart(true)}
              >
                Change
              </Typography>
            </>
          )}
        </Paper>
        <Paper
          elevation={2}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            px: 2,
            py: 1.5,

            borderRadius: "10px",
            backgroundColor: "white",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
            }}
          >
            <LocationOnIcon fontSize="large" sx={{ color: "#0FB37A" }} />
          </Box>
          {/* Text */}
          <Typography
            variant="body1"
            sx={{
              fontWeight: 500,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {endLabel}
          </Typography>
        </Paper>
      </Stack>

      <Box
        sx={{
          px: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          py: 1,
          mt: 2,
        }}
      >
        <Stack>
          {vehicleMode && getVehicleIcon(vehicleMode)}
          <Typography sx={{ fontWeight: 700, fontSize: 15, color: "white" }}>
            {`${activeRoute?.distance_km.toFixed(2) ?? "0.00"} km`}
          </Typography>
          <Typography sx={{ fontWeight: 400, fontSize: 15, color: "white" }}>
            {formatDuration(activeRoute?.duration_min ?? 0)}
          </Typography>
        </Stack>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Box component={"img"} src={ecorouteLogo} width={30} />
          <Stack>
            <Typography sx={{ fontWeight: 700, fontSize: 15, color: "white" }}>
              EcoRoute
            </Typography>
            <Typography sx={{ fontWeight: 400, fontSize: 15, color: "white" }}>
              {activeRoute?.carbon_kg.toFixed(2)} kg CO₂
            </Typography>
          </Stack>
        </Box>
      </Box>

      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          px: 2,
          mt: 2,
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;

          return (
            <Box key={index} sx={{ display: "flex", alignItems: "flex-start" }}>
              {/* LEFT SIDE - NODE + LINE */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  mr: 2,
                }}
              >
                {/* Top line (not for first item) */}
                {index !== 0 && (
                  <Box
                    sx={{
                      width: 2,
                      height: 12,
                      backgroundColor: "rgba(255,255,255,0.6)",
                    }}
                  />
                )}

                {/* Circle node */}
                <Box
                  sx={{
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    backgroundColor: "white",
                  }}
                />

                {/* Bottom line (not for last item) */}
                {!isLast && (
                  <Box
                    sx={{
                      width: 2,
                      flex: 1,
                      minHeight: 40,
                      backgroundColor: "rgba(255,255,255,0.6)",
                    }}
                  />
                )}
              </Box>

              {/* RIGHT SIDE - TEXT */}
              <Stack direction="column" sx={{ pb: 3, width: "100%" }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 1,
                    width: "100%",
                  }}
                >
                  <Typography fontSize={14} fontWeight={500}>
                    {step.instruction}
                  </Typography>
                  <Typography fontSize={14} fontWeight={500}>
                    {getStepIcon(step.type)}
                  </Typography>
                </Box>

                {step.distance > 0 && (
                  <Typography fontSize={12} sx={{ opacity: 0.8 }}>
                    {formatDistance(step.distance)}
                  </Typography>
                )}
              </Stack>
            </Box>
          );
        })}
      </Box>

      <Box sx={{ px: 2, py: 2 }}>
        <Stack direction="column">
          {routes
            .filter((route) => route.mode !== vehicleMode)
            .map((route) => {
              const meta = getRouteMeta(route);
              return (
                <Box
                  key={route.mode}
                  onClick={() => setVehicleMode(route.mode)}
                  sx={{
                    cursor: "pointer",
                    px: 2,
                    py: 1,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    transition: "0.2s",
                    ...meta.containerSx,
                  }}
                >
                  <Stack>
                    {getVehicleIconBottom(route.mode)}

                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: 15,
                        color: meta.primaryTextColor,
                      }}
                    >
                      {formatDistance(route.distance_km * 1000)}
                    </Typography>

                    <Typography
                      sx={{
                        fontWeight: 400,
                        fontSize: 14,
                        color: meta.secondaryTextColor,
                      }}
                    >
                      {formatDuration(route.duration_min)}
                    </Typography>
                  </Stack>

                  <Stack alignItems="flex-end">
                    <Typography
                      sx={{
                        fontWeight: 400,
                        fontSize: 13,
                        color: meta.secondaryTextColor,
                      }}
                    >
                      {route.carbon_kg.toFixed(2)} kg CO₂
                    </Typography>
                  </Stack>
                </Box>
              );
            })}
        </Stack>
      </Box>

      <Button color="success" variant="contained" onClick={handleOpen}>
        Save Trip
      </Button>

      <Modal
        open={open}
        onClose={handleClose}
        sx={{
          zIndex: 2000,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            width: 400,
            bgcolor: "background.paper",
            p: 3,
            borderRadius: 2,
            mx: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <RhfTextField
            name="trip_name"
            control={tripControl}
            label="Trip Name"
            fullWidth
            required
            margin="normal"
          />

          <RhfTextField
            name="start_name"
            control={tripControl}
            label="Start Name"
            fullWidth
            required
            margin="normal"
          />

          <RhfTextField
            name="end_name"
            control={tripControl}
            label="End Name"
            fullWidth
            required
            margin="normal"
          />

          <Button onClick={handleSave}>Save Trip</Button>
        </Box>
      </Modal>
    </Box>
  );
};

const formatDuration = (minutes: number): string => {
  if (!minutes || minutes <= 0) return "0 min";

  const hrs = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);

  if (hrs === 0) {
    return `${mins} min`;
  }

  if (mins === 0) {
    return `${hrs} hr`;
  }

  return `${hrs} hr ${mins} min`;
};

export interface ITripForm {
  trip_name: string;
  start_name: string;
  end_name: string;
}
