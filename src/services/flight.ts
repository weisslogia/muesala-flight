import axios from "axios";
import { Flight, FlightResponse } from "../types/Flight";
import { Config } from "../config";
import { ResponseError } from "../types/Error";
import { BuildHeaders } from "../helpers/request.helper";

export const getFlights = async (
  page: number = 1,
  size: number = 10,
  query: string = ""
): Promise<FlightResponse | ResponseError> => {
  try {
    const response = await axios.get(`${Config.API_URL}/flights`, {
      params:
        query.trim() === ""
          ? {
              page,
              size,
            }
          : {
              page,
              size,
              code: query,
            },
      headers: BuildHeaders(),
    });
    return response.data;
  } catch (e: any) {
    return { ...e.response.data, errors: true };
  }
};

export const createFlight = async (
  data: any
): Promise<FlightResponse | ResponseError> => {
  try {
    const response = await axios.post(`${Config.API_URL}/flights`, data, {
      headers: BuildHeaders(),
    });
    return response.data;
  } catch (e: any) {
    return { ...e.response.data, errors: true };
  }
};

export const createImageFlight = async (
  data: any
): Promise<FlightResponse | ResponseError> => {
  try {
    var formData = new FormData();
    formData.append("photo", data.photo);
    formData.append("code", data.code);
    formData.append("capacity", data.capacity);
    formData.append("departureDate", data.departureDate);

    const response = await axios.post(
      `${Config.API_URL}/flights/withPhoto`,
      formData,
      {
        headers: BuildHeaders({ is_image: true }),
      }
    );
    return response.data;
  } catch (e: any) {
    return { ...e.response.data, errors: true };
  }
};

export const getFlight = async (
  id: string
): Promise<Flight | ResponseError> => {
  try {
    const response = await axios.get(
      `${Config.API_URL}/flights/${id}/details`,
      { headers: BuildHeaders() }
    );
    return response.data;
  } catch (e: any) {
    return { ...e.response.data, errors: true };
  }
};

export const updateFlight = async (
  id: string,
  data: any
): Promise<Flight | ResponseError> => {
  try {
    const response = await axios.put(`${Config.API_URL}/flights/${id}`, data, {
      headers: BuildHeaders(),
    });
    console.log(response.data)
    return response.data;
  } catch (e: any) {
    return { ...e.response.data, errors: true };
  }
};

export const updateImageFlight = async (
  id: string,
  data: any
): Promise<Flight | ResponseError> => {
  try {
    var formData = new FormData();
    formData.append("photo", data.photo);
    formData.append("code", data.code);
    formData.append("capacity", data.capacity);
    formData.append("departureDate", data.departureDate);

    const response = await axios.put(`${Config.API_URL}/flights/${id}/withPhoto`, formData, {
      headers: BuildHeaders({is_image: true}),
    });
    return response.data;
  } catch (e: any) {
    return { ...e.response.data, errors: true };
  }
};

export const deleteFlight = async (
  id: string
): Promise<null | ResponseError> => {
  try {
    const response = await axios.delete(`${Config.API_URL}/flights/${id}`, {
      headers: BuildHeaders(),
    });
    return null;
  } catch (e: any) {
    return { ...e.response.data, errors: true };
  }
};

export const existCode = async (
  query: string = "",
  id: string| undefined
): Promise<{exists: boolean} | ResponseError> => {
  try {
    const response = await axios.get<FlightResponse>(`${Config.API_URL}/flights`, {
      params: {
        page: 1,
        size: 10,
        code: query,
      },
      headers: BuildHeaders(),
    });
    if(id !== undefined) {
      return {exists: response.data.resources.filter(el => el.id !== id).length > 0}
    }
    return {exists: response.data.count > 0};
  } catch (e: any) {
    return { ...e.response.data, errors: true };
  }
};
