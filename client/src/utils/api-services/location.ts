import { AxiosError, type AxiosResponse } from "axios";
import type { IRequestParamsOptions } from "./types";

interface IRouteRequestBody {
  start: { lat: number; lon: number; name?: string };
  end: { lat: number; lon: number; name?: string };
  greenPreference: number;
}

const DAILY_NOTE_URL = {
  SEARCH_LOCATION: `/search`,
};

export async function searchLocation<R = any, D = any>(
  requestParamsOptions: IRequestParamsOptions<D>,
): Promise<AxiosResponse<R>> {
  const { api, url, data } = requestParamsOptions;

  if (!url) {
    return Promise.reject(
      new Error("Missing url parameter for createQuickNotes"),
    );
  }

  try {
    const requestUrl = url || DAILY_NOTE_URL.SEARCH_LOCATION;
    const response = await api.get(requestUrl, { params: data });
    return response;
  } catch (error) {
    if (error instanceof AxiosError) {
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
}

export async function getRoute<R = any>(
  requestParamsOptions: IRequestParamsOptions<IRouteRequestBody>,
): Promise<AxiosResponse<R>> {
  const { api, data } = requestParamsOptions;

  if (!data) {
    return Promise.reject(new Error("Missing data parameter for getRoute"));
  }

  const baseUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

  try {
    const response = await api.post(
      `${baseUrl}/api/routes`,
      {
        start: data.start,
        end: data.end,
        greenToleranceMinutes: data.greenPreference,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    return response;
  } catch (error) {
    if (error instanceof AxiosError) {
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
}

export async function saveUserRoute<R = any>(
  requestParamsOptions: IRequestParamsOptions<{ 
    userId: string;
    payload: { 
      label: string; 
      start: { lat: number; lon: number; name?: string; }; 
      end: { lat: number; lon: number; name?: string; }; 
      lastCo2Score: number; 
    }
  }>,
): Promise<AxiosResponse<R>> {
  const { api, data } = requestParamsOptions;

  if (!data) {
    return Promise.reject(new Error("Missing data parameter for saveUserRoute"));
  }

  const baseUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

  try {
    const response = await api.post(
      `${baseUrl}/api/users/${data.userId}/saved-routes`,
      data.payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    return response;
  } catch (error) {
    if (error instanceof AxiosError) {
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
}

export async function saveUserTrip<R = any>(
  requestParamsOptions: IRequestParamsOptions<{
    userId: string;
    payload: {
      mode: string;
      distanceKm: number;
      routeCo2Grams: number;
      baselineMode?: string;
    }
  }>,
): Promise<AxiosResponse<R>> {
  const { api, data } = requestParamsOptions;

  if (!data) {
    return Promise.reject(new Error("Missing data parameter for saveUserTrip"));
  }

  const baseUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

  try {
    const response = await api.post(
      `${baseUrl}/api/users/${data.userId}/trips`,
      data.payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    return response;
  } catch (error) {
    if (error instanceof AxiosError) {
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
}

export async function getSavedRoutes<R = any>(
  requestParamsOptions: IRequestParamsOptions<{
    userId: string;
  }>,
): Promise<AxiosResponse<R>> {
  const { api, data } = requestParamsOptions;

  if (!data) {
    return Promise.reject(new Error("Missing data parameter for getSavedRoutes"));
  }

  const baseUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

  try {
    const response = await api.get(
      `${baseUrl}/api/users/${data.userId}/saved-routes`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    return response;
  } catch (error) {
    if (error instanceof AxiosError) {
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
}

export async function getUserTrips<R = any>(
  requestParamsOptions: IRequestParamsOptions<{
    userId: string;
  }>,
): Promise<AxiosResponse<R>> {
  const { api, data } = requestParamsOptions;

  if (!data) {
    return Promise.reject(new Error("Missing data parameter for getUserTrips"));
  }

  const baseUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

  try {
    const response = await api.get(
      `${baseUrl}/api/users/${data.userId}/trips`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    return response;
  } catch (error) {
    if (error instanceof AxiosError) {
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
}
