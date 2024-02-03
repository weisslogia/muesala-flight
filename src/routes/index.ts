import { createBrowserRouter } from "react-router-dom";
import { Home } from "../views/Home";
import { Login } from "../views/Login";
import { Register } from "../views/Register";
import { Dashboard } from "../layouts/Dashboard";
import { CreateFlight } from "../views/flight/CreateFlight";
import { EditFlight } from "../views/flight/EditFlight";
import { ViewFlight } from "../views/flight/ViewFlight";
import { Error } from "../views/Error";

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/signup",
  FLIGHT: "/flight",
  ERRORPAGE: "/error",
};

export const routes = createBrowserRouter([
  {
    path: ROUTES.LOGIN,
    Component: Login,
  },
  {
    path: ROUTES.REGISTER,
    Component: Register,
  },
  {
    path: ROUTES.HOME,
    Component: Dashboard,
    children: [
      {
        path: '',
        Component: Home,
      },
      {
        path: ROUTES.ERRORPAGE,
        Component: Error
      },
      {
        path: ROUTES.FLIGHT,
        children: [
          {
            path: '',
            Component: CreateFlight,
          },
          {
            path: ':id',
            Component: EditFlight,
          },
          {
            path: ':id/display',
            Component: ViewFlight,
          },
        ],
      },
    ],
  },
]);
