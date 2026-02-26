import { AxiosError, type AxiosResponse } from "axios";
import type { IRequestParamsOptions } from "./types";

const DAILY_NOTE_URL = {
  SEARCH_LOCATION: `/search`,
};

export async function searchLocation<R = any, D = any>(
  requestParamsOptions: IRequestParamsOptions<D>
): Promise<AxiosResponse<R>> {
  const { api, url, data } = requestParamsOptions;

  if (!url) {
    return Promise.reject(
      new Error("Missing url parameter for createQuickNotes")
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