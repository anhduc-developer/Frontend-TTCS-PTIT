import { createBrowserRouter, RouterProvider } from "react-router-dom";
import UserAdmin from "./pages/admin/user";
import AdminLayout from "./components/admin/layout.admin";
import Company from "./pages/admin/company";
import Job from "./pages/admin/job";
import Resume from "./pages/admin/resume";
import Permission from "./pages/admin/permission";
import Role from "./pages/admin/role";
import Dashboard from "./pages/admin/dashboard";
import Skill from "./pages/admin/skill";
import HomePage from "./pages/client/homepage";
import ClientLayout from "./components/client/layout/layout.client";
import CompanyPage from "./components/client/company/CompanyPage";
import JobPage from "./components/client/job/JobPage";
import JobDetailPage from "./components/client/job/Job.Detail";
import CompanyDetail from "./components/client/company/Company.Detail";
import Login from "./pages/auth/login";
import ProtectedRoute from "./components/context/ProtectedRoute";
import { useContext, useEffect } from "react";
import { AuthContext } from "./components/context/auth.context";
import { callGetAccount } from "./services/api.service";
import { Spin } from "antd";
import Register from "./pages/auth/register";
import Profile from "./components/client/homes/Profile";
import NotFound from "./services/helper/notfound";
function App() {
  const { setUser, setIsAuthenticated, isAppLoading, setIsAppLoading } =
    useContext(AuthContext);

  useEffect(() => {
    const fetchAccount = async () => {
      if (
        window.location.pathname === "/login" ||
        window.location.pathname === "/register"
      ) {
        setIsAppLoading(false);
        return;
      }

      const res = await callGetAccount();
      if (res && res.data && res.data.user) {
        // Gán toàn bộ object user từ API trả về (bao gồm age, gender, address, role...)
        setUser(res.data.user);
        setIsAuthenticated(true);
      }
      setIsAppLoading(false);
    };
    fetchAccount();
  }, []);
  const router = createBrowserRouter([
    {
      path: "/",
      element: <ClientLayout />,
      children: [
        {
          element: <HomePage />,
          index: true,
        },
        {
          path: "company",
          element: <CompanyPage />,
        },
        { path: "company/:id", element: <CompanyDetail /> },
        { path: "job", element: <JobPage /> },
        { path: "job/:id", element: <JobDetailPage /> },
        { path: "login", element: <Login /> },
        { path: "register", element: <Register /> },
        {
          path: "/profile",
          element: (
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          ),
        },
        { path: "*", element: <NotFound /> },
      ],
    },
    {
      path: "/admin",
      element: (
        <ProtectedRoute>
          <AdminLayout />
        </ProtectedRoute>
      ),
      children: [
        {
          element: <Dashboard />,
          index: true,
        },
        {
          path: "user",
          element: <UserAdmin />,
        },
        {
          path: "company",
          element: <Company />,
        },
        {
          path: "job",
          element: <Job />,
        },
        {
          path: "skill",
          element: <Skill />,
        },
        { path: "resume", element: <Resume /> },
        {
          path: "permission",
          element: <Permission />,
        },
        {
          path: "role",
          element: <Role />,
        },
        { path: "*", element: <NotFound /> },
      ],
    },
  ]);
  if (isAppLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" tip="Đang khởi tạo ứng dụng..." />
      </div>
    );
  }

  return <RouterProvider router={router} />;
}

export default App;
