import React, { useContext } from "react";
import {
  Layout,
  Menu,
  Space,
  Avatar,
  Dropdown,
  Typography,
  message,
  Button,
} from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  DownOutlined,
  BankOutlined,
  SolutionOutlined,
  GithubOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../../../styles/global.css";
import logo from "../../../assets/react.svg";
import { AuthContext } from "../../context/auth.context";

const { Header } = Layout;
const { Text } = Typography;

const AppHeader = ({ isHome }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const { user, isAuthenticated, setUser, setIsAuthenticated } =
    useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setUser({
      email: "",
      fullName: "",
      role: { id: "", name: "" }, // Khởi tạo object để tránh lỗi .name
      id: "",
      age: "",
      address: "",
    });
    setIsAuthenticated(false);
    message.success("Đăng xuất thành công");
    navigate("/");
  };

  const menuItems = [
    {
      key: "/",
      icon: <GithubOutlined />,
      label: <Link to="/">Trang Chủ</Link>,
    },
    {
      key: "/company",
      icon: <BankOutlined />,
      label: <Link to="/company">Tất cả công ty</Link>,
    },
    {
      key: "/job",
      icon: <SolutionOutlined />,
      label: <Link to="/job">Tất cả Job</Link>,
    },
  ];

  // Cấu trúc dropdown menu - Đưa vào trong để tính toán lại mỗi khi user thay đổi
  const items = [
    {
      key: "profile",
      label: "Thông tin tài khoản",
      icon: <UserOutlined />,
      onClick: () => navigate("/profile"),
    },
    { type: "divider" },
    // Dùng Optional Chaining ?. để không bao giờ bị null pointer exception
    ...(user?.role?.name === "ADMIN" || user?.role?.name === "HR"
      ? [
          {
            key: "admin",
            label: <Link to="/admin">Trang quản trị</Link>,
            icon: <DashboardOutlined />,
          },
        ]
      : []),
    {
      key: "logout",
      label: "Đăng xuất",
      icon: <LogoutOutlined />,
      danger: true,
      onClick: handleLogout,
    },
  ];

  return (
    <Header
      style={{
        display: "flex",
        alignItems: "center",
        background: "black",
        padding: "0 20px",
      }}
    >
      <Space
        style={{ marginRight: 24, cursor: "pointer" }}
        onClick={() => navigate("/")}
      >
        <img src={logo} className="logo-react-spin" alt="logo" />
      </Space>

      <Menu
        theme="dark"
        mode="horizontal"
        selectedKeys={[currentPath]}
        items={menuItems}
        style={{ flex: 1, minWidth: 0, background: "transparent" }}
      />

      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        {/* Quan trọng: Dùng biến isAuthenticated để quyết định render */}
        {isAuthenticated === true ? (
          <Space size="middle">
            <Text style={{ color: "rgba(255, 255, 255, 0.85)" }}>
              Welcome, {user?.fullName || user?.name || "Thành viên"}
            </Text>
            <Dropdown
              menu={{ items }} // Truyền biến items vừa tính ở trên
              placement="bottomRight"
              arrow
            >
              <Space style={{ cursor: "pointer" }}>
                <Avatar
                  size="small"
                  style={{ backgroundColor: "#1890ff" }}
                  icon={<UserOutlined />}
                  src={
                    user?.avatar
                      ? `${import.meta.env.VITE_BACKEND_URL}/storage/avatars/${user.avatar}`
                      : null
                  }
                />
                <Text strong style={{ color: "white" }}>
                  {/* Check tồn tại trước khi split */}
                  {user?.name ? user.name.split(" ").pop() : "User"}
                </Text>
                <DownOutlined
                  style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.65)" }}
                />
              </Space>
            </Dropdown>
          </Space>
        ) : (
          <Space>
            <Button
              type="text"
              style={{ color: "white" }}
              onClick={() => navigate("/login")}
            >
              Đăng nhập
            </Button>
            <Button type="primary" onClick={() => navigate("/register")}>
              Đăng ký
            </Button>
          </Space>
        )}
      </div>
    </Header>
  );
};

export default AppHeader;
