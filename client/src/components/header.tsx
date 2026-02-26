import {
  Box,
  Button,
  IconButton,
  Paper,
  Slider,
  Stack,
  Typography,
} from "@mui/material";
import { RhfAutocomplete } from "./React-hook-form";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../constants";
import type { AxiosResponse } from "axios";
import { searchLocation } from "../utils/api-services/location";
import { axios } from "../utils/api-services";
import { useDebounce } from "../hooks";
import { useStore } from "../store";
import { useEffect, useRef } from "react";
import { mapSearchLocationOptions } from "../helper/locations";
import ecorouteLogo from "../assets/ecorouteLogo.png";
import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from "@mui/icons-material/Person";

type SearchFormInputs = {
  searchName: string;
};

const defaultLoginFormValues: SearchFormInputs = {
  searchName: "",
};

export const Header = () => {
  const setSelectedLocation = useStore((state) => state.setSelectedLocation);
  const { control, watch } = useForm<SearchFormInputs>({
    defaultValues: defaultLoginFormValues,
    mode: "onChange",
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
    setSelectedLocation({
      id: matchedOption.id,
      label: matchedOption.label,
      lat: matchedOption.lat,
      lng: matchedOption.lng,
    });
  }, [query, searchedLocationOptions, setSelectedLocation]);

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
          }}
        >
          <Box minWidth={400}>
            <RhfAutocomplete
              control={control}
              freeSolo
              name="searchName"
              label="Where To"
              options={searchedLocationOptions}
            />
          </Box>
          <Box width={220}>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="caption">Faster</Typography>
              <Typography variant="caption">Greener</Typography>
            </Box>
            <Slider
              defaultValue={50}
              size="small"
              sx={{
                color: "#004d40",
              }}
            />
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <IconButton>
            <MenuIcon sx={{ color: "#fff" }} fontSize="large" />
          </IconButton>
          <Button
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
        </Box>
      </Box>
    </Paper>
  );
};

export default Header;
