export interface LocationOption {
  id: number;
  label: string;
  lat: number;
  lng: number;
}

export interface IStep {
  distance: number;
  duration: number;
  type: number;
  instruction: string;
  name: string;
  way_points: [number, number];
}

export interface ISegment {
  distance: number;
  duration: number;
  steps: IStep[];
}

export interface IRouteData {
  mode: string;
  rankingScore: number;
  coordinates: [number, number][];
  distanceKm: number;
  durationMinutes: number;
  carbonGrams: number;
  carbonSavedVsCarGrams: number;
  segments: ISegment[];
}

export interface IWeatherContext {
  source: string;
  summary: string;
  canBikeOrWalk: boolean;
  severity: "low" | "medium" | "high" | "unknown";
  warnings: string[];
}

export interface IRouteResponse {
  query: any;
  weather: IWeatherContext;
  routes: IRouteData[];
}
