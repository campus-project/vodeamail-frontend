import React, { lazy } from "react";
import { Navigate } from "react-router";
import LayoutAuth from "../layouts/auth";
import LayoutApps from "../layouts/apps";

//eslint-disable-next-line
const Home = lazy(() => import("../pages/Home"));
const Logout = lazy(() => import("../pages/Logout"));
const NotFound = lazy(() => import("../pages/NotFound"));

const Login = lazy(() => import("../pages/auth/Login"));
const Register = lazy(() => import("../pages/auth/Register"));
const ForgotPassword = lazy(() => import("../pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("../pages/auth/ResetPassword"));

const Dashboard = lazy(() => import("../pages/apps/Dashboard"));
const Audience = lazy(() => import("../pages/apps/audience"));
const ContactForm = lazy(() => import("../pages/apps/audience/contact/Form"));
const GroupForm = lazy(() => import("../pages/apps/audience/group/Form"));

export const routes = [
  // { path: "/", element: <Home /> },
  { path: "/", element: <Navigate to={"/apps/dashboard"} /> },
  { path: "/logout", element: <Logout /> },
  {
    path: "auth",
    element: <LayoutAuth />,
    children: [
      { path: "/", element: <Navigate to={"/auth/login"} /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "reset-password", element: <ResetPassword /> },
    ],
  },
  {
    path: "apps",
    element: <LayoutApps />,
    children: [
      { path: "/", element: <Navigate to={"/apps/dashboard"} /> },
      { path: "dashboard", element: <Dashboard /> },

      { path: "audience", element: <Audience /> },
      { path: "audience/contact/create", element: <ContactForm /> },
      { path: "audience/contact/:id/edit", element: <ContactForm /> },
      { path: "audience/group/create", element: <GroupForm /> },
      { path: "audience/group/:id/edit", element: <GroupForm /> },
    ],
  },
  { path: "*", element: <NotFound /> },
];
