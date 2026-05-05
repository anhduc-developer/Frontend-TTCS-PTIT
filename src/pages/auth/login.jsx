import React, { useContext, useState } from "react";
import {
  Form,
  Input,
  Button,
  Checkbox,
  Card,
  Typography,
  Divider,
  notification,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  LoginOutlined,
  GoogleOutlined,
} from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../components/context/auth.context";
import { callLogin } from "../../services/api.service";
import { useTranslation } from "react-i18next";

const { Title, Text } = Typography;

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { setUser, setIsAuthenticated } = useContext(AuthContext);
  const onFinish = async (values) => {
    setLoading(true);
    const res = await callLogin(values);

    if (res?.data) {
      // 1. Lưu token
      localStorage.setItem("access_token", res.data.access_token);

      // 2. Cập nhật Context - QUAN TRỌNG: Cấu trúc phải khớp với AppHeader
      setUser(res.data.user);
      setIsAuthenticated(true); // Header sẽ thấy cái này và render lại ngay
      setLoading(false);

      notification.success({
        message: t("auth.loginSuccess"),
        description: `${t("auth.welcomeBack")} ${res.data.user.name}!`,
      });

      navigate("/");
    } else {
      setLoading(false);
      notification.error({
        message: t("auth.loginFailed"),
        description: res?.message || t("auth.invalidEmailPassword"),
      });
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        padding: "20px",
      }}
    >
      <Card
        hoverable
        style={{
          width: "100%",
          maxWidth: 400,
          borderRadius: 16,
          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
          border: "none",
        }}
        bodyStyle={{ padding: "40px 30px" }}
      >
        {/* HEADER LOGO/TITLE */}
        <div style={{ textAlign: "center", marginBottom: 30 }}>
          <div
            style={{
              width: 60,
              height: 60,
              background: "#1890ff",
              borderRadius: "12px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 15,
              boxShadow: "0 4px 12px rgba(24, 144, 255, 0.3)",
            }}
          >
            <UserOutlined style={{ fontSize: 30, color: "#fff" }} />
          </div>
          <Title level={2} style={{ marginBottom: 5 }}>
            {t("header.login")}
          </Title>
        </div>

        {/* LOGIN FORM */}
        <Form
          name="login_form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: t("auth.pleaseEnterEmail") }]}
          >
            <Input
              prefix={<UserOutlined style={{ color: "#bfbfbf" }} />}
              placeholder={t("auth.emailOrUsername")}
              style={{ borderRadius: 8 }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: t("auth.pleaseEnterPassword") }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: "#bfbfbf" }} />}
              placeholder={t("auth.enterPassword")}
              style={{ borderRadius: 8 }}
            />
          </Form.Item>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 24,
            }}
          >
            <Link to="/" style={{ color: "#1890ff" }}>
              {t("auth.home")}
            </Link>
          </div>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              style={{
                height: 45,
                borderRadius: 8,
                fontSize: 16,
                fontWeight: 600,
                background: "linear-gradient(to right, #1890ff, #40a9ff)",
                border: "none",
              }}
            >
              {t("auth.loginButton")}
            </Button>
          </Form.Item>
        </Form>
        <div style={{ textAlign: "center", marginTop: 25 }}>
          <Text type="secondary">{t("auth.noAccount")} </Text>
          <Link to="/register" style={{ fontWeight: 600 }}>
            {t("auth.registerNow")}
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Login;
