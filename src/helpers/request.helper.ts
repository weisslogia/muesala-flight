import { RawAxiosRequestHeaders } from "axios";
import { ResponseError } from "../types/Error";
import { NavigateFunction } from "react-router-dom";
import { ROUTES } from "../routes";
import { refreshToken } from "../services/login";

interface Config {
  is_image?: boolean;
}

export const BuildHeaders = ({
  is_image,
}: Config = {}): Partial<RawAxiosRequestHeaders> => {
  const headers: Partial<RawAxiosRequestHeaders> = {};
  const token = localStorage.getItem("token");
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  if (is_image) {
    headers["Content-Type"] = "multipart/form-data";
  }
  return headers;
};

export const handleRequestErrors = async (
  error_data: ResponseError,
  router: NavigateFunction,
  allow_redirect: boolean = true
) => {
  switch (error_data.code) {
    case 103:
      await refreshToken();
      return { refresh: true };
      case 102:
        const error = {code: error_data.code, message: error_data.message, type: error_data.type}
        if(allow_redirect) {
          return router(ROUTES.ERRORPAGE, {state: error})
        } else {
          return {
            ...error,
            allow_redirect
          }
        }
  }
};
