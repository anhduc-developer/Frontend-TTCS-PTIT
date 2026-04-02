import React, { useContext, useState, useEffect } from "react";
import {
  Card,
  Col,
  Row,
  Typography,
  Avatar,
  Tag,
  Table,
  Button,
  Form,
  Input,
  Divider,
  Space,
  Modal,
  InputNumber,
  Select,
  message,
  notification,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  HistoryOutlined,
  SafetyCertificateOutlined,
  ArrowRightOutlined,
  MailOutlined,
  HomeOutlined,
  ManOutlined,
  WomanOutlined,
  CalendarOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { AuthContext } from "../../context/auth.context";
import {
  callFetchResumeByUser,
  callUpdateUserInfo,
  callChangePassword,
} from "../../../services/api.service";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;
const { Option } = Select;

const Profile = () => {
  const { user, setUser, setIsAuthenticated } = useContext(AuthContext);
  const [currentMenu, setCurrentMenu] = useState("info");
  const [listResume, setListResume] = useState([]);
  const navigate = useNavigate();
  // States điều khiển
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const [formPassword] = Form.useForm();
  const [formInfo] = Form.useForm();
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  // Tự động fetch Resume khi chuyển sang tab lịch sử
  const fetchResumes = async () => {
    const res = await callFetchResumeByUser();
    if (res && res.data) {
      // Kết quả trả về từ ResultPaginationDTO (thường là res.data.result)
      setListResume(res.data.result || []);
    }
  };
  useEffect(() => {
    if (currentMenu === "history") {
      fetchResumes();
    }
  }, [currentMenu]);

  // Hàm xử lý đổi mật khẩu
  const handleChangePassword = async (values) => {
    const { oldPassword, newPassword } = values;
    const res = await callChangePassword(oldPassword, newPassword);

    // Kiểm tra statusCode 200 từ RestResponse của Backend
    if (res && (res.statusCode === 200 || res.data?.statusCode === 200)) {
      message.success("Đổi mật khẩu thành công! Vui lòng đăng nhập lại.");

      // --- LOGIC ĐĂNG XUẤT ---
      // 1. Xóa token khỏi localStorage
      localStorage.removeItem("access_token");

      // 2. Reset lại Context (Quan trọng để các component khác như Header cập nhật)
      setUser({
        id: "",
        email: "",
        name: "",
        role: { id: "", name: "" },
        address: "",
        age: "",
        gender: "",
        permissions: [],
      });
      setIsAuthenticated(false);

      // 3. Đẩy người dùng về trang Login
      navigate("/login");
    } else {
      notification.error({
        message: "Đổi mật khẩu thất bại",
        description: res.message || "Mật khẩu cũ không chính xác",
      });
    }
  };

  // Hàm xử lý cập nhật thông tin cá nhân
  const handleUpdateInfo = async (values) => {
    setIsUpdating(true);
    const data = {
      id: user.id,
      name: values.name,
      age: values.age,
      gender: values.gender,
      address: values.address,
    };
    const res = await callUpdateUserInfo(data);

    if (res && res.data) {
      message.success("Cập nhật thông tin thành công!");
      setUser({
        ...user,
        name: values.name,
        age: values.age,
        gender: values.gender,
        address: values.address,
      });
      setIsModalOpen(false);
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        description: res.message,
      });
    }
    setIsUpdating(false);
  };

  const showModal = () => {
    setIsModalOpen(true);
    formInfo.setFieldsValue({
      name: user?.name,
      age: user?.age,
      gender: user?.gender,
      address: user?.address,
    });
  };
  const onChangePagination = (page, size) => {
    setCurrent(page);
    setPageSize(size);
  };
  const renderGender = (gender) => {
    if (gender === "MALE")
      return (
        <Tag color="blue" icon={<ManOutlined />}>
          Nam
        </Tag>
      );
    if (gender === "FEMALE")
      return (
        <Tag color="pink" icon={<WomanOutlined />}>
          Nữ
        </Tag>
      );
    return <Tag color="default">Khác</Tag>;
  };

  const menuItems = [
    { id: "info", label: "Thông tin cá nhân", icon: <UserOutlined /> },
    { id: "history", label: "Lịch sử ứng tuyển", icon: <HistoryOutlined /> },
    { id: "password", label: "Đổi mật khẩu", icon: <LockOutlined /> },
  ];

  return (
    <div
      style={{
        background: "#f6f0ff",
        minHeight: "100vh",
        padding: "40px 20px",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "auto" }}>
        {/* Banner */}
        <div
          style={{
            height: 220,
            borderRadius: 24,
            background: "linear-gradient(135deg, #efdbff 0%, #b37feb 100%)",
            position: "relative",
            marginBottom: 80,
            boxShadow: "0 10px 20px rgba(0,0,0,0.05)",
          }}
        >
          <div
            style={{
              position: "absolute",
              bottom: -60,
              left: 40,
              display: "flex",
              alignItems: "flex-end",
              gap: 24,
            }}
          >
            <Avatar
              size={140}
              icon={<UserOutlined />}
              style={{
                border: "6px solid #fff",
                backgroundColor: "#d9d9d9",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            />
            <div style={{ marginBottom: 15 }}>
              <Title level={2} style={{ margin: 0 }}>
                {user?.name || "Chưa cập nhật"}
              </Title>
              <Text type="secondary" style={{ fontSize: 16 }}>
                {user?.email}
              </Text>
            </div>
          </div>
        </div>

        <Row gutter={[24, 24]}>
          {/* Sidebar Menu */}
          <Col xs={24} md={7}>
            <Card
              style={{
                borderRadius: 20,
                border: "none",
                boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
              }}
            >
              {menuItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setCurrentMenu(item.id)}
                  style={{
                    padding: "14px 20px",
                    borderRadius: 14,
                    marginBottom: 10,
                    cursor: "pointer",
                    transition: "all 0.3s",
                    background:
                      currentMenu === item.id
                        ? "linear-gradient(90deg,#722ed1,#b37feb)"
                        : "transparent",
                    color: currentMenu === item.id ? "#fff" : "#595959",
                    display: "flex",
                    gap: 12,
                    alignItems: "center",
                    fontWeight: currentMenu === item.id ? 600 : 400,
                  }}
                >
                  {item.icon} {item.label}
                </div>
              ))}
            </Card>
          </Col>

          {/* Main Content */}
          <Col xs={24} md={17}>
            <Card
              style={{
                borderRadius: 20,
                border: "none",
                minHeight: 450,
                boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
              }}
            >
              {currentMenu === "info" && (
                <div style={{ padding: "10px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Title level={4}>
                      <UserOutlined /> Hồ sơ cá nhân
                    </Title>
                    <Button
                      type="primary"
                      ghost
                      icon={<EditOutlined />}
                      onClick={showModal}
                    >
                      Chỉnh sửa
                    </Button>
                  </div>
                  <Divider />
                  <Row gutter={[32, 32]}>
                    <Col span={12} xs={24} sm={12}>
                      <Space direction="vertical" size={0}>
                        <Text type="secondary">
                          <UserOutlined /> Họ và tên
                        </Text>
                        <Text strong style={{ fontSize: 16 }}>
                          {user?.name || "N/A"}
                        </Text>
                      </Space>
                    </Col>
                    <Col span={12} xs={24} sm={12}>
                      <Space direction="vertical" size={0}>
                        <Text type="secondary">
                          <MailOutlined /> Email tài khoản
                        </Text>
                        <Text strong style={{ fontSize: 16 }}>
                          {user?.email}
                        </Text>
                      </Space>
                    </Col>
                    <Col span={12} xs={24} sm={12}>
                      <Space direction="vertical" size={0}>
                        <Text type="secondary">
                          <CalendarOutlined /> Độ tuổi
                        </Text>
                        <Text strong style={{ fontSize: 16 }}>
                          {user?.age ? `${user.age} tuổi` : "Chưa cập nhật"}
                        </Text>
                      </Space>
                    </Col>
                    <Col span={12} xs={24} sm={12}>
                      <Space direction="vertical" size={0}>
                        <Text type="secondary">Giới tính</Text>
                        <div style={{ marginTop: 4 }}>
                          {renderGender(user?.gender)}
                        </div>
                      </Space>
                    </Col>
                    <Col span={24}>
                      <Space direction="vertical" size={0}>
                        <Text type="secondary">
                          <HomeOutlined /> Địa chỉ
                        </Text>
                        <Text strong style={{ fontSize: 16 }}>
                          {user?.address || "Chưa cập nhật"}
                        </Text>
                      </Space>
                    </Col>
                    <Col span={12}>
                      <Space direction="vertical" size={0}>
                        <Text type="secondary">Vai trò</Text>
                        <div style={{ marginTop: 4 }}>
                          <Tag color="purple">{user?.role?.name}</Tag>
                        </div>
                      </Space>
                    </Col>
                  </Row>
                </div>
              )}

              {currentMenu === "history" && (
                <>
                  <Title level={4}>
                    <HistoryOutlined /> Lịch sử ứng tuyển
                  </Title>
                  <Divider />
                  <Table
                    pagination={{
                      current: current,
                      pageSize: pageSize,
                      total: total,
                      showSizeChanger: true,
                      pageSizeOptions: ["5", "10", "20"],
                      showTotal: (total, range) =>
                        `${range[0]}-${range[1]} trên ${total} kết quả`,
                      onChange: (page, size) => onChangePagination(page, size),
                    }}
                    dataSource={listResume}
                    rowKey="id" // Dùng id làm key cho mỗi dòng
                    columns={[
                      {
                        title: "Vị trí",
                        dataIndex: ["job", "name"], // Truy cập sâu vào job.name
                        key: "jobName",
                        render: (text) => (
                          <Text strong style={{ color: "#722ed1" }}>
                            {text || "N/A"}
                          </Text>
                        ),
                      },
                      {
                        title: "Công ty",
                        dataIndex: "companyName", // Dùng trực tiếp trường companyName từ object resume
                        key: "companyName",
                        render: (text) => <Text>{text || "N/A"}</Text>,
                      },
                      {
                        title: "Trạng thái",
                        dataIndex: "status",
                        key: "status",
                        render: (status) => {
                          let color = "orange";
                          if (status === "APPROVED") color = "green";
                          if (status === "REJECTED") color = "red";
                          return <Tag color={color}>{status}</Tag>;
                        },
                      },
                      {
                        title: "Ngày nộp",
                        dataIndex: "createdAt",
                        key: "createdAt",
                        render: (date) =>
                          date ? dayjs(date).format("DD/MM/YYYY HH:mm") : "N/A",
                      },
                      {
                        title: "CV của tôi",
                        dataIndex: "url",
                        key: "url",
                        render: (_, record) => {
                          return (
                            <a
                              href={`http://localhost:8080/api/v1/files?fileName=${record.url}&folder=resume`}
                              target="_blank"
                              rel="noreferrer"
                            >
                              Xem File
                            </a>
                          );
                        },
                      },
                    ]}
                  />
                </>
              )}

              {currentMenu === "password" && (
                <div style={{ maxWidth: 450, padding: "10px" }}>
                  <Title level={4}>
                    <LockOutlined /> Đổi mật khẩu
                  </Title>
                  <Divider />
                  <Form
                    form={formPassword}
                    layout="vertical"
                    onFinish={handleChangePassword}
                  >
                    <Form.Item
                      label="Mật khẩu hiện tại"
                      name="oldPassword"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập mật khẩu cũ!",
                        },
                      ]}
                    >
                      <Input.Password />
                    </Form.Item>
                    <Form.Item
                      label="Mật khẩu mới"
                      name="newPassword"
                      rules={[
                        {
                          required: true,
                          min: 6,
                          message: "Tối thiểu 6 ký tự!",
                        },
                      ]}
                    >
                      <Input.Password />
                    </Form.Item>
                    <Form.Item
                      label="Xác nhận"
                      name="confirm"
                      dependencies={["newPassword"]}
                      rules={[
                        { required: true, message: "Vui lòng xác nhận!" },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (
                              !value ||
                              getFieldValue("newPassword") === value
                            )
                              return Promise.resolve();
                            return Promise.reject(
                              new Error("Mật khẩu không khớp!"),
                            );
                          },
                        }),
                      ]}
                    >
                      <Input.Password />
                    </Form.Item>
                    <Button
                      type="primary"
                      icon={<ArrowRightOutlined />}
                      htmlType="submit"
                      block
                      style={{
                        height: 45,
                        borderRadius: 10,
                        background: "linear-gradient(90deg,#722ed1,#b37feb)",
                        border: "none",
                        marginTop: 10,
                        fontWeight: 600,
                      }}
                    >
                      Cập nhật mật khẩu
                    </Button>
                  </Form>
                </div>
              )}
            </Card>
          </Col>
        </Row>
      </div>

      <Modal
        title="Chỉnh sửa thông tin cá nhân"
        open={isModalOpen}
        onOk={() => formInfo.submit()}
        onCancel={() => setIsModalOpen(false)}
        confirmLoading={isUpdating}
        okText="Lưu thông tin"
        cancelText="Hủy"
      >
        <Form form={formInfo} layout="vertical" onFinish={handleUpdateInfo}>
          <Form.Item
            label="Họ và tên"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
          >
            <Input />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Tuổi" name="age">
                <InputNumber style={{ width: "100%" }} min={1} max={120} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Giới tính" name="gender">
                <Select>
                  <Option value="MALE">Nam</Option>
                  <Option value="FEMALE">Nữ</Option>
                  <Option value="OTHER">Khác</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="Địa chỉ" name="address">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Profile;
