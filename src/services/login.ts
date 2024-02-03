import { Config } from "../config";
import { BuildHeaders } from "../helpers/request.helper";
import { ResponseError } from "../types/Error";
import { RefreshToken } from "../types/Login";
import { Signup, SignupResponse } from "../types/Signup";
import axios from "axios";

export const signup = async (data: Signup): Promise<SignupResponse | ResponseError> => {
  try {
    const response = await axios.post<SignupResponse | ResponseError>(
      `${Config.API_URL}/auth/register`,
      data
    );
    const response_data = response.data as SignupResponse;
    localStorage.setItem("token", response_data.token);
    localStorage.setItem("refreshToken", response_data.refreshToken);
    localStorage.setItem(
      "user",
      JSON.stringify({
        name: response_data.name,
        email: response_data.email,
        id: response_data.id,
      })
    );
    return { ...response.data, errors: false };
  } catch (e: any) {
    return { ...e.response.data, errors: true };
  }
};

export const login = async (data: Signup) => {
  try {
    const response = await axios.post<SignupResponse | ResponseError>(
      `${Config.API_URL}/auth/login`,
      data
    );
    const response_data = response.data as SignupResponse;
    localStorage.setItem("token", response_data.token);
    localStorage.setItem("refreshToken", response_data.refreshToken);
    localStorage.setItem(
      "user",
      JSON.stringify({
        name: response_data.name,
        email: response_data.email,
        id: response_data.id,
      })
    );
    return { ...response.data, errors: false };
  } catch (e: any) {
    return { ...e.response.data, errors: true };
  }
};

export const refreshToken = async() => {
  const refreshToken = localStorage.getItem("refreshToken")
  const response = await axios.post<RefreshToken>(`${Config.API_URL}/auth/refresh`, {refreshToken}, {headers: BuildHeaders()})
  localStorage.setItem('token', response.data.token)
  localStorage.setItem('refreshToken', response.data.refreshToken)
}
