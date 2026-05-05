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
  ArrowRightOutlined,
  MailOutlined,
  HomeOutlined,
  ManOutlined,
  WomanOutlined,
  CalendarOutlined,
  EditOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import { AuthContext } from "../../context/auth.context";
import {
  callFetchResumeByUser,
  callUpdateUserInfo,
  callChangePassword,
} from "../../../services/api.service";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const { Title, Text } = Typography;
const { Option } = Select;

const Profile = () => {
  const { t, i18n } = useTranslation();
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

  // Tự động fetch Resume khi chuyển sang tab lịch sử
  const fetchResumes = async () => {
    const res = await callFetchResumeByUser();
    if (res && res.data) {
      setListResume(res.data.result || []);
      setTotal(res.data.meta.total || 0);
    }
  };

  useEffect(() => {
    if (currentMenu === "history") {
      fetchResumes();
    }
  }, [currentMenu]);

  // Hàm thay đổi ngôn ngữ
  const handleChangeLanguage = (value) => {
    i18n.changeLanguage(value);
    message.info(
      t("header.language") + ": " + (value === "vi" ? "Tiếng Việt" : "English"),
    );
  };

  const handleChangePassword = async (values) => {
    const { oldPassword, newPassword } = values;
    const res = await callChangePassword(oldPassword, newPassword);

    if (res && (res.statusCode === 200 || res.data?.statusCode === 200)) {
      message.success(t("profile.changePasswordSuccess"));
      localStorage.removeItem("access_token");
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
      navigate("/login");
    } else {
      notification.error({
        message: t("profile.incorrectPassword"),
        description: res.message || t("error.errorOccurred"),
      });
    }
  };

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
      message.success(t("profile.updateSuccess"));
      setUser({ ...user, ...data });
      setIsModalOpen(false);
    } else {
      notification.error({
        message: t("message.error"),
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

  const renderGender = (gender) => {
    if (gender === "MALE")
      return (
        <Tag color="blue" icon={<ManOutlined />}>
          {t("user.genderMale")}
        </Tag>
      );
    if (gender === "FEMALE")
      return (
        <Tag color="pink" icon={<WomanOutlined />}>
          {t("user.genderFemale")}
        </Tag>
      );
    return <Tag color="default">{t("user.genderOther")}</Tag>;
  };

  const menuItems = [
    { id: "info", label: t("user.personalInfo"), icon: <UserOutlined /> },
    { id: "history", label: t("profile.history"), icon: <HistoryOutlined /> },
    {
      id: "password",
      label: t("profile.changePasswordTitle"),
      icon: <LockOutlined />,
    },
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
                {user?.name || t("profile.notUpdated")}
              </Title>
              <Text type="secondary" style={{ fontSize: 16 }}>
                {user?.email}
              </Text>
            </div>
          </div>
          {/* Language Switcher */}
        </div>

        <Row gutter={[24, 24]}>
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
                      <UserOutlined /> {t("user.userInfo")}
                    </Title>
                    <Button
                      type="primary"
                      ghost
                      icon={<EditOutlined />}
                      onClick={showModal}
                    >
                      {t("common.edit")}
                    </Button>
                  </div>
                  <Divider />
                  <Row gutter={[32, 32]}>
                    <Col span={12} xs={24} sm={12}>
                      <Space direction="vertical" size={0}>
                        <Text type="secondary">
                          <UserOutlined /> {t("user.userName")}
                        </Text>
                        <Text strong style={{ fontSize: 16 }}>
                          {user?.name || "N/A"}
                        </Text>
                      </Space>
                    </Col>
                    <Col span={12} xs={24} sm={12}>
                      <Space direction="vertical" size={0}>
                        <Text type="secondary">
                          <MailOutlined /> {t("user.userEmail")}
                        </Text>
                        <Text strong style={{ fontSize: 16 }}>
                          {user?.email}
                        </Text>
                      </Space>
                    </Col>
                    <Col span={12} xs={24} sm={12}>
                      <Space direction="vertical" size={0}>
                        <Text type="secondary">
                          <CalendarOutlined /> {t("user.userAge")}
                        </Text>
                        <Text strong style={{ fontSize: 16 }}>
                          {user?.age
                            ? t("profile.age_years", { age: user.age })
                            : t("profile.notUpdated")}
                        </Text>
                      </Space>
                    </Col>
                    <Col span={12} xs={24} sm={12}>
                      <Space direction="vertical" size={0}>
                        <Text type="secondary">{t("user.userGender")}</Text>
                        <div style={{ marginTop: 4 }}>
                          {renderGender(user?.gender)}
                        </div>
                      </Space>
                    </Col>
                    <Col span={24}>
                      <Space direction="vertical" size={0}>
                        <Text type="secondary">
                          <HomeOutlined /> {t("user.userAddress")}
                        </Text>
                        <Text strong style={{ fontSize: 16 }}>
                          {user?.address || t("profile.notUpdated")}
                        </Text>
                      </Space>
                    </Col>
                  </Row>
                </div>
              )}

              {currentMenu === "history" && (
                <>
                  <Title level={4}>
                    <HistoryOutlined /> {t("profile.history")}
                  </Title>
                  <Divider />
                  <Table
                    pagination={{
                      current: current,
                      pageSize: pageSize,
                      total: total,
                      showSizeChanger: true,
                      pageSizeOptions: ["5", "10", "20"],
                      onChange: (page, size) => {
                        setCurrent(page);
                        setPageSize(size);
                      },
                      showTotal: (total, range) =>
                        t("resume.paginationText", {
                          start: range[0],
                          end: range[1],
                          total,
                        }),
                    }}
                    dataSource={listResume}
                    rowKey="id"
                    columns={[
                      {
                        title: t("profile.job"),
                        dataIndex: ["job", "name"],
                        key: "jobName",
                        render: (text) => (
                          <Text strong style={{ color: "#722ed1" }}>
                            {text || "N/A"}
                          </Text>
                        ),
                      },
                      {
                        title: t("profile.company"),
                        dataIndex: "companyName",
                        key: "companyName",
                      },
                      {
                        title: t("profile.status"),
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
                        title: t("profile.applyDate"),
                        dataIndex: "createdAt",
                        key: "createdAt",
                        render: (date) =>
                          date ? dayjs(date).format("DD/MM/YYYY HH:mm") : "N/A",
                      },
                      {
                        title: t("profile.cv"),
                        dataIndex: "url",
                        key: "url",
                        render: (url) => (
                          <a
                            href={`http://localhost:8080/api/v1/files?fileName=${url}&folder=resume`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {t("common.detail")}
                          </a>
                        ),
                      },
                    ]}
                  />
                </>
              )}

              {currentMenu === "password" && (
                <div style={{ maxWidth: 450, padding: "10px" }}>
                  <Title level={4}>
                    <LockOutlined /> {t("profile.changePasswordTitle")}
                  </Title>
                  <Divider />
                  <Form
                    form={formPassword}
                    layout="vertical"
                    onFinish={handleChangePassword}
                  >
                    <Form.Item
                      label={t("form.oldPassword")}
                      name="oldPassword"
                      rules={[
                        {
                          required: true,
                          message: t("validation.pleaseEnterOldPassword"),
                        },
                      ]}
                    >
                      <Input.Password />
                    </Form.Item>
                    <Form.Item
                      label={t("form.newPassword")}
                      name="newPassword"
                      rules={[
                        {
                          required: true,
                          min: 6,
                          message: t("validation.minLength", { min: 6 }),
                        },
                      ]}
                    >
                      <Input.Password />
                    </Form.Item>
                    <Form.Item
                      label={t("form.confirmPassword")}
                      name="confirm"
                      dependencies={["newPassword"]}
                      rules={[
                        {
                          required: true,
                          message: t("validation.pleaseConfirm"),
                        },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (
                              !value ||
                              getFieldValue("newPassword") === value
                            )
                              return Promise.resolve();
                            return Promise.reject(
                              new Error(t("validation.passwordMismatch")),
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
                      {t("profile.updatePasswordButton")}
                    </Button>
                  </Form>
                </div>
              )}
            </Card>
          </Col>
        </Row>
      </div>

      <Modal
        title={t("user.personalInfo")}
        open={isModalOpen}
        onOk={() => formInfo.submit()}
        onCancel={() => setIsModalOpen(false)}
        confirmLoading={isUpdating}
        okText={t("form.submitButton")}
        cancelText={t("form.cancelButton")}
      >
        <Form form={formInfo} layout="vertical" onFinish={handleUpdateInfo}>
          <Form.Item
            label={t("user.userName")}
            name="name"
            rules={[
              { required: true, message: t("validation.pleaseEnterName") },
            ]}
          >
            <Input />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label={t("user.userAge")} name="age">
                <InputNumber style={{ width: "100%" }} min={1} max={120} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={t("user.userGender")} name="gender">
                <Select>
                  <Option value="MALE">{t("user.genderMale")}</Option>
                  <Option value="FEMALE">{t("user.genderFemale")}</Option>
                  <Option value="OTHER">{t("user.genderOther")}</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label={t("user.userAddress")} name="address">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Profile;
