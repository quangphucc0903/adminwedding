import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import SignUp from "./auth/sign-up/SignUp";
import SignIn from "./auth/sign-in/SignIn";
import DashboardLayout from "./dashboard/Dashboard";
import MainGrid from "./dashboard/components/MainGrid";
import PrivateRoute from "./service/PrivateRoute";
import CreateTemplate from "./dashboard/CreateTemplate";
import TemplateManagement from "./dashboard/Template";
import DashboardLayoutv2 from "./dashboard/Dashboardv2";
import ViewTemplate from "./dashboard/ViewTemplate";
import SubscriptionPlans from "./dashboard/SubscriptionPlans";
import EditTemplate from "./dashboard/EditTemplate";
import CreateInvitation from "./dashboard/CreateInvitation";
import ViewInvitation from "./dashboard/ViewInvitation";
import Order from "./dashboard/Order";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route
          path="/dashboard"
          element={
            <DashboardLayout>
              <PrivateRoute>
                {" "}
                <MainGrid />
              </PrivateRoute>
            </DashboardLayout>
          }
        />
        <Route
          path="/template"
          element={
            <DashboardLayout>
              <PrivateRoute>
                <TemplateManagement />
              </PrivateRoute>
            </DashboardLayout>
          }
        />
        <Route
          path="/create-template"
          element={
            <DashboardLayoutv2>
              <PrivateRoute>
                <CreateTemplate />
              </PrivateRoute>
            </DashboardLayoutv2>
          }
        />
        <Route
          path="/view-template/:templateId"
          element={
            <DashboardLayoutv2>
              <PrivateRoute>
                <ViewTemplate />
              </PrivateRoute>
            </DashboardLayoutv2>
          }
        />
        <Route
          path="/subscription_plans"
          element={
            <DashboardLayoutv2>
              <PrivateRoute>
                <SubscriptionPlans />
              </PrivateRoute>
            </DashboardLayoutv2>
          }
        />
        <Route
          path="/order"
          element={
            <DashboardLayoutv2>
              <PrivateRoute>
                <Order />
              </PrivateRoute>
            </DashboardLayoutv2>
          }
        />
        <Route
          path="/edit-template/:id"
          element={
            <DashboardLayoutv2>
              <PrivateRoute>
                <EditTemplate />
              </PrivateRoute>
            </DashboardLayoutv2>
          }
        />
        <Route
          path="/create-letter/:id"
          element={
            <DashboardLayoutv2>
              <PrivateRoute>
                <CreateInvitation />
              </PrivateRoute>
            </DashboardLayoutv2>
          }
        />
        <Route
          path="/preview-invitation/:id"
          element={
            <DashboardLayoutv2>
              <PrivateRoute>
                <ViewInvitation />
              </PrivateRoute>
            </DashboardLayoutv2>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
