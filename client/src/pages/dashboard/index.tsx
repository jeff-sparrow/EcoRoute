import { Box, Typography, Stack, CircularProgress, Paper, IconButton } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../store";
import { getUserTrips } from "../../utils/api-services/location";
import { axios } from "../../utils/api-services";
import ForestIcon from '@mui/icons-material/Forest';
import RouteIcon from '@mui/icons-material/Route';

export const Dashboard = () => {
  const user = useStore((state) => state.user);
  const navigate = useNavigate();

  const { data: trips, isLoading } = useQuery({
    queryKey: ['userTrips', user?.userId],
    queryFn: async () => {
      if (!user?.userId) return [];
      const response = await getUserTrips({
        api: axios,
        data: { userId: user.userId }
      });
      return response.data;
    },
    enabled: !!user?.userId,
  });

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress size="4rem" sx={{ color: "#10B981" }} />
      </Box>
    );
  }

  const totalDistanceKm = trips?.reduce(
    (sum: number, trip: any) => sum + Number(trip.distanceKm || 0),
    0
  ).toFixed(2) || "0.00";

  const totalCarbonSavedGrams = trips?.reduce(
    (sum: number, trip: any) => sum + Number(trip.carbonSavedGrams || 0),
    0
  );

  const totalCarbonSavedKg = (totalCarbonSavedGrams / 1000).toFixed(2);

  return (
    <Box sx={{ p: 4, height: "100%", backgroundColor: "#f5f7f6", overflowY: "auto" }}>
      <Stack spacing={4}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <IconButton 
            onClick={() => navigate("/")} 
            sx={{ backgroundColor: "white", boxShadow: 1, '&:hover': { backgroundColor: "#e0e0e0" } }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <Typography variant="h3" fontWeight={700} color="#0B3C34" gutterBottom>
              Carbon Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Track your sustainable commuting impact over time.
            </Typography>
          </Box>
        </Stack>

        <Box sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column', md: 'row' } }}>
          <Box sx={{ flex: 1 }}>
            <Paper
              elevation={3}
              sx={{
                p: 4,
                borderRadius: 4,
                background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                color: "white",
                position: "relative",
                overflow: "hidden"
              }}
            >
              <Box sx={{ position: "absolute", right: -20, bottom: -20, opacity: 0.2 }}>
                <RouteIcon sx={{ fontSize: 200 }} />
              </Box>
              <Typography variant="h6" fontWeight={600} gutterBottom sx={{ opacity: 0.9 }}>
                Total Distance Traveled
              </Typography>
              <Stack direction="row" alignItems="baseline" spacing={1}>
                <Typography variant="h2" fontWeight={800}>
                  {totalDistanceKm}
                </Typography>
                <Typography variant="h6">km</Typography>
              </Stack>
            </Paper>
          </Box>

          <Box sx={{ flex: 1 }}>
            <Paper
              elevation={3}
              sx={{
                p: 4,
                borderRadius: 4,
                background: "linear-gradient(135deg, #1E88E5 0%, #1565C0 100%)",
                color: "white",
                position: "relative",
                overflow: "hidden"
              }}
            >
              <Box sx={{ position: "absolute", right: -20, bottom: -20, opacity: 0.2 }}>
                <ForestIcon sx={{ fontSize: 200 }} />
              </Box>
              <Typography variant="h6" fontWeight={600} gutterBottom sx={{ opacity: 0.9 }}>
                Total Carbon Saved
              </Typography>
              <Stack direction="row" alignItems="baseline" spacing={1}>
                <Typography variant="h2" fontWeight={800}>
                  {totalCarbonSavedKg}
                </Typography>
                <Typography variant="h6">kg CO₂</Typography>
              </Stack>
            </Paper>
          </Box>
        </Box>
      </Stack>
    </Box>
  );
};

export default Dashboard;
