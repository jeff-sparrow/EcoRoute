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
  score: number;
  coordinates: [number, number][];
  distance_km: number;
  duration_min: number;
  carbon_kg: number;
  carbon_saved_kg: number;
  segments: ISegment[];
}
