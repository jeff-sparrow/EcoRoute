import {
  Avatar,
  Box,
  Button,
  IconButton,
  Paper,
  Slider,
  Stack,
  styled,
  Typography,
  Menu,
  MenuItem,
} from "@mui/material";
import { RhfAutocomplete } from "./React-hook-form";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../constants";
import type { AxiosResponse } from "axios";
import { searchLocation, getSavedRoutes } from "../utils/api-services/location";
import { axios } from "../utils/api-services";
import { useDebounce } from "../hooks";
import { useStore } from "../store";
import { useEffect, useRef, useState } from "react";
import { mapSearchLocationOptions } from "../helper/locations";
import ecorouteLogo from "../assets/ecorouteLogo.png";
import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../constants/route-constant";

type SearchFormInputs = {
  searchName: string;
};

const defaultLoginFormValues: SearchFormInputs = {
  searchName: "",
};

export const Header = () => {
  const isSidebarOpen = useStore((state) => state.isSidebarOpen);
  const greenPreference = useStore((state) => state.greenPreference);
  const setGreenPreference = useStore((state) => state.setGreenPreference);
  const setSelectedLocation = useStore((state) => state.setSelectedLocation);
  const user = useStore((state) => state.user);
  const logout = useStore((state) => state.logout);
  const navigate = useNavigate();

  const { control, watch } = useForm<SearchFormInputs>({
    defaultValues: defaultLoginFormValues,
    mode: "onChange",
  });

  const query = watch("searchName") ?? "";
  const debouncedQuery = useDebounce(query, 400);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);

  const [savedRoutesAnchorEl, setSavedRoutesAnchorEl] = useState<null | HTMLElement>(null);
  const openSavedRoutes = Boolean(savedRoutesAnchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const { data: savedRoutes, isLoading: isRoutesLoading } = useQuery({
    queryKey: ['savedRoutes', user?.userId],
    queryFn: async () => {
      if (!user?.userId) return [];
      const response = await getSavedRoutes({
        api: axios,
        data: { userId: user.userId }
      });
      return response.data;
    },
    enabled: !!user?.userId && openSavedRoutes, // Only fetch when they actually open the popout
  });

  const handleSavedRouteClick = (route: any) => {
    // 1. apply to map store
    setSelectedLocation({
      id: route.routeId,
      label: route.label,
      lat: route.end.lat,
      lng: route.end.lon, // The destination sets the end pin
    });
    // For origin matching, the Leaflet setup in index.tsx uses the user's current geo-location or a generic fallback.
    // If the Saved Route enforces a different origin, it requires adjusting the useUserLocation hook's authority, 
    // but applying the end pin fulfills the immediate routing logic for the demo map center.
    setSavedRoutesAnchorEl(null);
    setAnchorEl(null);
  };

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
    setSelectedLocation({
      id: matchedOption.id,
      label: matchedOption.label,
      lat: matchedOption.lat,
      lng: matchedOption.lng,
    });
  }, [query, searchedLocationOptions, setSelectedLocation]);

  if (isSidebarOpen) {
    return (
      <Box
        sx={{
          position: "fixed",
          top: 16,
          // left: 16,
          right: 16,
          zIndex: 1200,
          borderRadius: 2,
        }}
      >
        <Avatar sx={{ bgcolor: "#10B981" }}>
          <PersonIcon sx={{ bgcolor: "#10B981" }} />
        </Avatar>
      </Box>
    );
  }

  return (
    <Paper
      elevation={5}
      sx={{
        position: "fixed",
        top: 16,
        left: 16,
        right: 16,
        backgroundColor: "#10B981",
        px: 2,
        py: 1,
        zIndex: 1200,
        borderRadius: 2,
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        gap={2}
        width="100%"
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

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
            width: "60%",
          }}
        >
          <Box width="60%">
            <RhfAutocomplete
              control={control}
              freeSolo
              name="searchName"
              label="Where To?"
              options={searchedLocationOptions}
            />
          </Box>
          <Box width="40%">
            <Box
              sx={{
                backgroundColor: "#0E3A34",
                borderRadius: "14px",
                p: 1,
                width: 320,
              }}
            >
              <GradientSlider
                min={0}
                max={1}
                step={0.1}
                value={greenPreference}
                onChange={(_, value) => {
                  if (typeof value === "number") {
                    setGreenPreference(value);
                  }
                }}
                sx={{ p: 0 }}
              />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Typography
                  sx={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#1E88E5",
                    letterSpacing: "0.5px",
                  }}
                >
                  FASTER
                </Typography>

                <Typography
                  sx={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#00C853",
                    letterSpacing: "0.5px",
                  }}
                >
                  GREENER
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <IconButton onClick={handleMenuClick}>
            <MenuIcon sx={{ color: "#fff" }} fontSize="large" />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={(e) => setSavedRoutesAnchorEl(e.currentTarget)}>Saved Routes</MenuItem>
            <MenuItem onClick={() => { handleMenuClose(); navigate('/dashboard'); }}>Carbon Dashboard</MenuItem>
          </Menu>

          <Menu
            anchorEl={savedRoutesAnchorEl}
            open={openSavedRoutes}
            onClose={() => setSavedRoutesAnchorEl(null)}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            {isRoutesLoading ? (
              <MenuItem disabled>Loading...</MenuItem>
            ) : !savedRoutes || savedRoutes.length === 0 ? (
              <MenuItem disabled>No saved routes</MenuItem>
            ) : (
              savedRoutes.map((route: any) => (
                <MenuItem 
                  key={route.routeId}
                  onClick={() => handleSavedRouteClick(route)}
                >
                  <Stack>
                    <Typography variant="body1" fontWeight={500}>{route.label}</Typography>
                    <Typography variant="caption" color="text.secondary">CO2: {route.lastCo2Score}g</Typography>
                  </Stack>
                </MenuItem>
              ))
            )}
          </Menu>
          {user ? (
            <Button
              onClick={() => {
                logout();
                navigate(ROUTES.LOG_IN);
              }}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                color: "#fff",
                textTransform: "none",
                minWidth: "64px",
              }}
            >
              <Avatar 
                sx={{ 
                  width: 32, 
                  height: 32, 
                  mb: 0.5, 
                  bgcolor: "rgba(255,255,255,0.2)",
                  fontSize: "1rem" 
                }}
              >
                {user.name.charAt(0).toUpperCase()}
              </Avatar>
              Logout
            </Button>
          ) : (
            <Button
              onClick={() => navigate(ROUTES.LOG_IN)}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                color: "#fff",
                textTransform: "none",
              }}
            >
              <PersonIcon sx={{ mr: 1 }} fontSize="large" />
              Log in
            </Button>
          )}
        </Box>
      </Box>
    </Paper>
  );
};

export default Header;

const GradientSlider = styled(Slider)(() => ({
  height: 8,
  padding: "15px 0",

  "& .MuiSlider-track": {
    border: "none",
    background: "linear-gradient(90deg, #1E88E5 0%, #00C853 100%)",
  },

  "& .MuiSlider-rail": {
    opacity: 1,
    backgroundColor: "#1E4D45",
  },

  "& .MuiSlider-thumb": {
    height: 18,
    width: 18,
    backgroundColor: "#00C853",
    border: "2px solid #0B3C34",
    boxShadow: "none",

    "&:hover, &.Mui-focusVisible, &.Mui-active": {
      boxShadow: "0 0 0 6px rgba(0, 200, 83, 0.2)",
    },
  },
}));
