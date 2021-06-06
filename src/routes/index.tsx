import React, { lazy } from "react";
import { Navigate } from "react-router";
import LayoutApps from "../layouts/apps";
import LayoutAuth from "../layouts/auth";
import LayoutGuest from "../layouts/guest";

//eslint-disable-next-line
const Home = lazy(() => import("../pages/Home"));
const Logout = lazy(() => import("../pages/Logout"));
const NotFound = lazy(() => import("../pages/NotFound"));

const Unsubscribe = lazy(() => import("../pages/a/Unsubscribe"));

const Login = lazy(() => import("../pages/auth/Login"));
const Register = lazy(() => import("../pages/auth/Register"));
const ForgotPassword = lazy(() => import("../pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("../pages/auth/ResetPassword"));

const Dashboard = lazy(() => import("../pages/apps/dashboard"));
const Profile = lazy(() => import("../pages/apps/profile"));

const EmailCampaignList = lazy(
  () => import("../pages/apps/campaign/email-campaign")
);
const EmailCampaignForm = lazy(
  () => import("../pages/apps/campaign/email-campaign/Form")
);
const EmailTemplateList = lazy(
  () => import("../pages/apps/campaign/email-template")
);
const EmailTemplateForm = lazy(
  () => import("../pages/apps/campaign/email-template/Form")
);

const AnalyticEmailList = lazy(() => import("../pages/apps/analytic/email"));
const AnalyticEmailDetail = lazy(
  () => import("../pages/apps/analytic/email/Detail")
);

const Audience = lazy(() => import("../pages/apps/audience"));
const ContactForm = lazy(() => import("../pages/apps/audience/contact/Form"));
const GroupForm = lazy(() => import("../pages/apps/audience/group/Form"));

const PreferenceList = lazy(() => import("../pages/apps/preference"));
const OrganizationForm = lazy(
  () => import("../pages/apps/preference/organization/Form")
);
const RoleList = lazy(() => import("../pages/apps/preference/role"));
const RoleForm = lazy(() => import("../pages/apps/preference/role/Form"));
const UserList = lazy(() => import("../pages/apps/preference/user"));
const UserForm = lazy(() => import("../pages/apps/preference/user/Form"));
const GateSettingList = lazy(
  () => import("../pages/apps/preference/gate-setting")
);
const GateSettingForm = lazy(
  () => import("../pages/apps/preference/gate-setting/Form")
);

export const routes = [
  { path: "/", element: <Home /> },
  // { path: "/", element: <Navigate to={"/apps/dashboard"} /> },
  { path: "/logout", element: <Logout /> },
  {
    path: "a",
    element: <LayoutGuest />,
    children: [{ path: "u/:ref", element: <Unsubscribe /> }],
  },
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
      { path: "profile", element: <Profile /> },

      { path: "audience", element: <Audience /> },
      { path: "audience/contact/create", element: <ContactForm /> },
      { path: "audience/contact/:id/edit", element: <ContactForm /> },
      { path: "audience/group/create", element: <GroupForm /> },
      { path: "audience/group/:id/edit", element: <GroupForm /> },

      {
        path: "campaign",
        element: <Navigate to={"/apps/campaign/email-campaign"} />,
      },
      { path: "campaign/email-campaign", element: <EmailCampaignList /> },
      {
        path: "campaign/email-campaign/create",
        element: <EmailCampaignForm />,
      },
      {
        path: "campaign/email-campaign/:id/edit",
        element: <EmailCampaignForm />,
      },
      { path: "campaign/email-template", element: <EmailTemplateList /> },
      {
        path: "campaign/email-template/create",
        element: <EmailTemplateForm />,
      },
      {
        path: "campaign/email-template/:id/edit",
        element: <EmailTemplateForm />,
      },
      { path: "analytic", element: <Navigate to={"/apps/analytic/email"} /> },
      { path: "analytic/email", element: <AnalyticEmailList /> },
      { path: "analytic/email/:id", element: <AnalyticEmailDetail /> },

      { path: "preference", element: <PreferenceList /> },
      { path: "preference/role", element: <RoleList /> },
      { path: "preference/organization", element: <OrganizationForm /> },
      { path: "preference/role/create", element: <RoleForm /> },
      { path: "preference/role/:id/edit", element: <RoleForm /> },
      { path: "preference/user", element: <UserList /> },
      { path: "preference/user/create", element: <UserForm /> },
      { path: "preference/user/:id/edit", element: <UserForm /> },
      { path: "preference/gate-setting", element: <GateSettingList /> },
      { path: "preference/gate-setting/create", element: <GateSettingForm /> },
      {
        path: "preference/gate-setting/:id/edit",
        element: <GateSettingForm />,
      },
    ],
  },
  { path: "*", element: <NotFound /> },
];
