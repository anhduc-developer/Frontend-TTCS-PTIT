import { useContext } from "react";
import { AuthContext } from "./auth.context";
import { Navigate } from "react-router-dom";
import { Result, Button } from "antd";

const ProtectedRoute = (props) => {
  const { isAuthenticated, user } = useContext(AuthContext);

  // 1. Kiểm tra đăng nhập
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 2. Kiểm tra quyền Admin (Nếu route yêu cầu admin)
  const isAdminRoute = window.location.pathname.startsWith("/admin");
  console.log(">>> user", user);
  if (isAdminRoute && user.role.name !== "ADMIN" && user.role.name != "HR") {
    return (
      <Result
        status="403"
        title="403"
        subTitle="Xin lỗi, bạn không có quyền truy cập trang này."
        extra={
          <Button type="primary" onClick={() => (window.location.href = "/")}>
            Quay lại trang chủ
          </Button>
        }
      />
    );
  }

  return props.children;
};

export default ProtectedRoute;
