import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  Row,
  Col,
  Divider,
  notification,
  message,
  Select,
  InputNumber,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  HomeOutlined,
  ArrowLeftOutlined,
  NumberOutlined,
} from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import { callResgister } from "../../services/api.service";

const { Title, Text } = Typography;
const { Option } = Select;

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    // values lúc này sẽ chứa: email, name, age, address, gender, password
    setLoading(true);
    const res = await callResgister(values);

    if (res && res.data) {
      message.success("Đăng ký tài khoản thành công!");
      navigate("/login");
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        description:
          res.message && Array.isArray(res.message)
            ? res.message[0]
            : res.message,
        duration: 5,
      });
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        padding: "40px 20px",
      }}
    >
      <Card
        hoverable
        style={{
          width: "100%",
          maxWidth: 600, // Tăng nhẹ chiều rộng để form cân đối
          borderRadius: 16,
          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
          border: "none",
        }}
        bodyStyle={{ padding: "40px 30px" }}
      >
        <div style={{ textAlign: "center", marginBottom: 30 }}>
          <Title level={2} style={{ marginBottom: 5 }}>
            Tạo Tài Khoản
          </Title>
          <Text type="secondary">
            Cung cấp thông tin để bắt đầu hành trình của bạn
          </Text>
        </div>

        <Form
          name="register_form"
          onFinish={onFinish}
          layout="vertical"
          size="large"
          initialValues={{ gender: "MALE" }} // Giá trị mặc định cho giới tính
        >
          <Row gutter={16}>
            {/* NAME */}
            <Col span={24}>
              <Form.Item
                label="Họ và tên"
                name="name"
                rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
              >
                <Input prefix={<UserOutlined />} placeholder="Nguyễn Văn A" />
              </Form.Item>
            </Col>

            {/* EMAIL */}
            <Col span={24}>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Vui lòng nhập Email!" },
                  { type: "email", message: "Email không đúng định dạng!" },
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="example@gmail.com"
                />
              </Form.Item>
            </Col>

            {/* AGE & GENDER */}
            <Col span={12} xs={24} md={12}>
              <Form.Item
                label="Tuổi"
                name="age"
                rules={[{ required: true, message: "Nhập tuổi!" }]}
              >
                <InputNumber
                  prefix={<NumberOutlined />}
                  min={1}
                  max={120}
                  style={{ width: "100%" }}
                  placeholder="20"
                />
              </Form.Item>
            </Col>

            <Col span={12} xs={24} md={12}>
              <Form.Item
                label="Giới tính"
                name="gender"
                rules={[{ required: true, message: "Chọn giới tính!" }]}
              >
                <Select placeholder="Chọn giới tính">
                  <Option value="MALE">Nam</Option>
                  <Option value="FEMALE">Nữ</Option>
                  <Option value="OTHER">Khác</Option>
                </Select>
              </Form.Item>
            </Col>

            {/* ADDRESS */}
            <Col span={24}>
              <Form.Item
                label="Địa chỉ"
                name="address"
                rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
              >
                <Input
                  prefix={<HomeOutlined />}
                  placeholder="Hà Nội, Việt Nam"
                />
              </Form.Item>
            </Col>

            {/* PASSWORD */}
            <Col span={12} xs={24} md={12}>
              <Form.Item
                label="Mật khẩu"
                name="password"
                rules={[{ required: true, message: "Nhập mật khẩu!" }]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="******"
                />
              </Form.Item>
            </Col>

            <Col span={12} xs={24} md={12}>
              <Form.Item
                label="Xác nhận"
                name="confirmPassword"
                dependencies={["password"]}
                rules={[
                  { required: true, message: "Xác nhận mật khẩu!" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value)
                        return Promise.resolve();
                      return Promise.reject(new Error("Mật khẩu không khớp!"));
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="******"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item style={{ marginTop: 20 }}>
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
                background: "linear-gradient(to right, #1d3ede, #0155ff)",
                border: "none",
              }}
            >
              ĐĂNG KÝ
            </Button>
          </Form.Item>
        </Form>

        <Divider plain style={{ color: "#bfbfbf", fontSize: 12 }}>
          Hoặc
        </Divider>

        <div style={{ textAlign: "center" }}>
          <Text type="secondary">Đã có tài khoản? </Text>
          <Link to="/login" style={{ fontWeight: 600 }}>
            Đăng nhập
          </Link>
        </div>

        <div style={{ textAlign: "center", marginTop: 15 }}>
          <Link to="/" style={{ color: "#8c8c8c" }}>
            <ArrowLeftOutlined /> Trang chủ
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Register;
