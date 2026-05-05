import React, { useState, useContext } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  UserOutlined,
  BankOutlined,
  ScheduleOutlined,
  FileTextOutlined,
  SafetyOutlined,
  SolutionOutlined,
  BugOutlined,
  ToolOutlined,
  LogoutOutlined,
  HomeOutlined,
  DownOutlined,
} from "@ant-design/icons";
import {
  Button,
  Layout,
  Menu,
  theme,
  Dropdown,
  Space,
  Avatar,
  Typography,
  message,
} from "antd";
import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../../components/context/auth.context";
import LanguageSwitcher from "../LanguageSwitcher";

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const AdminLayout = () => {
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useState(false);
  const { user, setUser, setIsAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // 1. Lấy thông tin quyền từ Context
  const userPermissions = user?.role?.permissions || [];
  console.log(">>> ceck user", userPermissions);
  const isAdmin = user?.role?.name === "ADMIN";
  console.log(">> check", user);
  // 2. Hàm xử lý Logout
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setUser({ email: "", fullName: "", role: { id: "", name: "" }, id: "" });
    setIsAuthenticated(false);
    message.success(t("message.logoutSuccess"));
    navigate("/login");
  };

  // 3. Cấu trúc Menu cho Avatar Dropdown
  const userMenuItems = [
    {
      key: "home",
      label: <Link to="/">{t("header.home")}</Link>,
      icon: <HomeOutlined />,
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      label: t("header.logout"),
      icon: <LogoutOutlined />,
      danger: true,
      onClick: handleLogout,
    },
  ];

  // 4. Danh sách các Menu tiềm năng (Module phải khớp với Database)
  const menuConfig = [
    {
      key: "/admin",
      icon: <DashboardOutlined />,
      label: t("header.dashboard"),
      module: "DASHBOARDS",
    },
    {
      key: "/admin/user",
      icon: <UserOutlined />,
      label: t("header.user"),
      module: "USERS",
    },
    {
      key: "/admin/company",
      icon: <BankOutlined />,
      label: t("header.company"),
      module: "COMPANIES",
    },
    {
      key: "/admin/job",
      icon: <ScheduleOutlined />,
      label: t("header.job"),
      module: "JOBS",
    },
    {
      key: "/admin/skill",
      icon: <ToolOutlined />,
      label: t("header.skill"),
      module: "SKILLS",
    },
    {
      key: "/admin/resume",
      icon: <FileTextOutlined />,
      label: t("header.resume"),
      module: "RESUMES",
    },
    {
      key: "/admin/permission",
      icon: <SafetyOutlined />,
      label: t("header.permission"),
      module: "PERMISSIONS",
    },
    {
      key: "/admin/role",
      icon: <SolutionOutlined />,
      label: t("header.role"),
      module: "ROLES",
    },
  ];

  // 5. Logic lọc Menu dựa trên quyền thực tế
  // 5. Logic lọc Menu dựa trên quyền thực tế
  const authorizedMenuItems = menuConfig.filter((item) => {
    // Nếu là ADMIN tối cao, cho phép xem tất cả menu
    if (isAdmin) return true;

    // ĐỐI VỚI DASHBOARD:
    // Nên kiểm tra linh hoạt cả "DASHBOARD" và "DASHBOARDS" để tránh lỗi typo DB
    if (item.module === "DASHBOARDS" || item.module === "DASHBOARD") {
      // Thay đổi dòng check Dashboard trong filter:
      return userPermissions.some(
        (p) =>
          (p.module === "DASHBOARDS" || p.module === "DASHBOARD") &&
          p.method === "GET",
      );
    }

    // VỚI CÁC MODULE KHÁC
    return userPermissions.some(
      (p) => p.module === item.module && p.method === "GET",
    );
  });
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={250}
        theme="light"
        style={{
          boxShadow: "2px 0 8px rgba(0,0,0,0.05)",
          position: "sticky",
          top: 0,
          left: 0,
          height: "100vh",
        }}
      >
        <div
          style={{
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: collapsed ? "0" : "0 20px",
            borderBottom: "1px solid #f0f0f0",
          }}
        >
          <BugOutlined style={{ fontSize: 24, color: "#1890ff" }} />
          {!collapsed && (
            <span
              style={{
                marginLeft: 10,
                fontSize: 16,
                fontWeight: "bold",
                textTransform: "uppercase",
                color: "#1890ff",
              }}
            >
              {user?.role?.name || "GUEST"}
            </span>
          )}
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          onClick={({ key }) => navigate(key)}
          items={authorizedMenuItems}
          style={{ borderRight: "none", marginTop: 10 }}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            padding: "0 24px",
            background: colorBgContainer,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 1px 4px rgba(0,21,41,.08)",
            zIndex: 10,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: "16px", width: 64, height: 64 }}
          />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginLeft: "auto",
            }}
          >
            <LanguageSwitcher />
            <Dropdown
              menu={{ items: userMenuItems }}
              placement="bottomRight"
              arrow
            >
              <Space style={{ cursor: "pointer", padding: "0 8px" }}>
                <Avatar
                  style={{ backgroundColor: "#1890ff" }}
                  icon={<UserOutlined />}
                />
                <Text strong>{user?.name || "Account"}</Text>
                <DownOutlined style={{ fontSize: 10, color: "#8c8c8c" }} />
              </Space>
            </Dropdown>
          </div>
        </Header>

        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            overflow: "auto",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
