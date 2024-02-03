import { toast } from "react-toastify";
import { MessageOpts, TypeOptions } from "../types/Toast";
const baseMessageOpts: Pick<
  MessageOpts,
  | "type"
  | "position"
  | "autoClose"
  | "hideProgressBar"
  | "closeOnClick"
  | "pauseOnHover"
  | "draggable"
  | "theme"
> = {
  type: "success",
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: "light",
};

const typesOfNotifications: {
  error: string;
  success: string;
  info: string;
  warning: string;
  default: string;
  [key: string]: string;
} = {
  error: "error",
  success: "success",
  info: "info",
  warning: "warning",
  default: "default",
};

export const showMsg = (message: string, options: MessageOpts = {}) => {
  const msgOpts: MessageOpts = {
    ...baseMessageOpts,
    ...options,
    type:
      (options.type &&
        typesOfNotifications[options.type] &&
        (typesOfNotifications[options.type] as TypeOptions)) ||
      "success",
  };

  toast(message, msgOpts);
};
