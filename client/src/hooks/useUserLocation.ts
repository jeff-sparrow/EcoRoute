import { useEffect, useState } from "react";
import type { LatLngTuple } from "leaflet";

export function useUserLocation(defaultLocation: LatLngTuple) {
  const [location, setLocation] = useState<LatLngTuple>(defaultLocation);
  const [loading, setLoading] = useState<boolean>(!!navigator.geolocation);
  const [usedFallback, setUsedFallback] = useState<boolean>(false);

  useEffect(() => {
    if (!navigator.geolocation) {
      setUsedFallback(true);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation([position.coords.latitude, position.coords.longitude]);
        setLoading(false);
      },
      () => {
        // permission denied / error — keep default (Eugene) and flag it
        setUsedFallback(true);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      },
    );
  }, []);

  return { location, loading, usedFallback };
}
