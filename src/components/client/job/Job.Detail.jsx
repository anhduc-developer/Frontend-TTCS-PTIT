import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Button,
  Card,
  Col,
  Row,
  Tag,
  Typography,
  Divider,
  Space,
  notification,
  message,
  Form,
  Input,
  Modal,
  Spin,
  Result,
} from "antd";
import {
  ArrowLeftOutlined,
  EnvironmentOutlined,
  DollarOutlined,
  UsergroupAddOutlined,
  ThunderboltOutlined,
  InboxOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
import dayjs from "dayjs";
import {
  callCreateResume,
  handleUploadFile,
  callFetchJobById,
} from "../../../services/api.service";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/auth.context";
import Dragger from "antd/es/upload/Dragger";

const JobDetailPage = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useContext(AuthContext);

  const [job, setJob] = useState(null);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Đồng bộ locale cho Dayjs
  useEffect(() => {
    dayjs.locale(i18n.language === "vi" ? "vi" : "en-gb");
  }, [i18n.language]);

  const fetchJobDetail = async () => {
    setIsPageLoading(true);
    try {
      const res = await callFetchJobById(id);
      if (res && res.data && (res.data.id || res.data._id)) {
        setJob(res.data);
        setIsNotFound(false);
      } else {
        setIsNotFound(true);
      }
    } catch (error) {
      setIsNotFound(true);
    } finally {
      setIsPageLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchJobDetail();
    }
  }, [id]);

  const handleApplyClick = () => {
    if (!isAuthenticated) {
      notification.warning({
        message: t("auth.requireLogin"),
        description: t("auth.pleaseLoginToApply"),
      });
      navigate("/login");
      return;
    }
    setIsModalOpen(true);
  };

  const handleUploadResume = async () => {
    if (fileList.length === 0) {
      message.error(t("validation.pleaseUploadLogo"));
      return;
    }

    setIsSubmitting(true);
    try {
      const uploadRes = await handleUploadFile(fileList[0], "resume");
      if (uploadRes && uploadRes.data) {
        const fileName = uploadRes.data.fileName;
        const dataUpdate = {
          url: fileName,
          email: user.email,
          user: { id: user.id },
          job: { id: job.id },
          status: "PENDING",
        };

        const res = await callCreateResume(dataUpdate);
        if (res && (res.data || res.statusCode === 201)) {
          message.success(t("message.createSuccess"));
          setIsModalOpen(false);
          setFileList([]);
        } else {
          notification.error({
            message: t("message.error"),
            description: res.message || t("error.errorOccurred"),
          });
        }
      }
    } catch (err) {
      notification.error({
        message: t("message.error"),
        description: t("error.errorOccurred"),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isPageLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" tip={t("message.loading")} />
      </div>
    );
  }

  if (isNotFound || !job) {
    return (
      <div style={{ padding: "50px 0" }}>
        <Result
          status="404"
          title="404"
          subTitle={t("job.notFoundJob")}
          extra={
            <Button onClick={() => navigate("/")} type="primary">
              {t("header.home")}
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: 1200,
        margin: "0 auto",
        background: "#f5f7f9",
        minHeight: "100vh",
      }}
    >
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(-1)}
        style={{ marginBottom: 20, borderRadius: 6 }}
      >
        {t("job.cancel")}
      </Button>

      <Row gutter={[24, 24]}>
        <Col xs={24} md={16}>
          <Card
            style={{
              borderRadius: 12,
              border: "none",
              boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
            }}
          >
            <div style={{ display: "flex", gap: 20, marginBottom: 25 }}>
              <img
                src={`${import.meta.env.VITE_BACKEND_URL}/storage/company/${job.company?.logo}`}
                alt="logo"
                style={{
                  width: 80,
                  height: 80,
                  objectFit: "contain",
                  border: "1px solid #f0f0f0",
                  borderRadius: 8,
                  padding: 5,
                }}
              />
              <div style={{ flex: 1 }}>
                <Title level={3} style={{ margin: 0, wordBreak: "break-word" }}>
                  {job.name}
                </Title>
                <Text
                  type="secondary"
                  style={{ fontSize: 16, cursor: "pointer", color: "#1890ff" }}
                  onClick={() => navigate(`/company/${job.company?.id}`)}
                >
                  {job.company?.name}
                </Text>
              </div>
            </div>

            <Space
              size={[24, 12]}
              wrap
              style={{
                marginBottom: 25,
                background: "#fafafa",
                padding: "15px",
                borderRadius: 8,
                width: "100%",
              }}
            >
              <div style={{ minWidth: 150 }}>
                <Text type="secondary">
                  <DollarOutlined /> {t("job.salary")}
                </Text>
                <br />
                <Text strong style={{ color: "#ff4d4f", fontSize: 16 }}>
                  {job.salary?.toLocaleString()} đ
                </Text>
              </div>
              <div style={{ minWidth: 150 }}>
                <Text type="secondary">
                  <EnvironmentOutlined /> {t("job.location")}
                </Text>
                <br />
                <Text strong>{job.location}</Text>
              </div>
              <div style={{ minWidth: 150 }}>
                <Text type="secondary">
                  <UsergroupAddOutlined /> {t("job.quantity")}
                </Text>
                <br />
                <Text strong>
                  {job.quantity} {t("header.member")}
                </Text>
              </div>
              <Tag color="blue" style={{ fontSize: 14, padding: "2px 10px" }}>
                {job.level}
              </Tag>
            </Space>

            <div style={{ marginBottom: 25 }}>
              <Text strong style={{ display: "block", marginBottom: 10 }}>
                {t("job.requiredSkills")}:
              </Text>
              <Space size={[8, 8]} wrap>
                {job.skills?.map((skill) => (
                  <Tag
                    key={skill.id}
                    color="orange"
                    icon={<ThunderboltOutlined />}
                    style={{ borderRadius: 4, padding: "3px 12px" }}
                  >
                    {skill.name}
                  </Tag>
                ))}
              </Space>
            </div>

            <Divider />
            <Title level={4}>{t("job.details")}</Title>
            <div
              style={{ fontSize: 16, lineHeight: 1.8, color: "#434343" }}
              dangerouslySetInnerHTML={{
                __html: job.description || t("common.updating"),
              }}
            />
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <div style={{ position: "sticky", top: 20 }}>
            <Card
              style={{
                borderRadius: 12,
                border: "none",
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                marginBottom: 20,
              }}
            >
              <div style={{ marginBottom: 20 }}>
                <Text type="secondary">{t("job.endDate")}:</Text>
                <Title level={5} style={{ marginTop: 5, color: "#f5222d" }}>
                  {job.endDate
                    ? dayjs(job.endDate).format("DD/MM/YYYY")
                    : t("common.updating")}
                </Title>
              </div>
              <Button
                type="primary"
                size="large"
                block
                style={{
                  height: 50,
                  fontWeight: 700,
                  borderRadius: 8,
                  background: "#52c41a",
                  border: "none",
                }}
                onClick={handleApplyClick}
              >
                {t("resume.applyJob").toUpperCase()}
              </Button>
            </Card>

            <Card
              style={{
                borderRadius: 12,
                border: "none",
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              }}
            >
              <div style={{ textAlign: "center", marginBottom: 15 }}>
                <img
                  src={`${import.meta.env.VITE_BACKEND_URL}/storage/company/${job.company?.logo}`}
                  alt="logo"
                  style={{
                    width: 100,
                    height: 100,
                    objectFit: "contain",
                    marginBottom: 10,
                  }}
                />
                <Title level={5} style={{ margin: 0 }}>
                  {job.company?.name}
                </Title>
              </div>
              <Divider style={{ margin: "12px 0" }} />
              <Button
                type="link"
                block
                onClick={() => navigate(`/company/${job.company?.id}`)}
              >
                {t("company.details")} →
              </Button>
            </Card>
          </div>
        </Col>
      </Row>

      <Modal
        title={t("resume.applyJob")}
        open={isModalOpen}
        onOk={handleUploadResume}
        onCancel={() => setIsModalOpen(false)}
        confirmLoading={isSubmitting}
        okText={t("resume.statusPending")} // Hoặc key Gửi hồ sơ nếu có
        cancelText={t("common.cancel")}
        width={600}
      >
        <Divider />
        <Form layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label={t("job.jobName")}>
                <Input value={job.name} disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={t("user.userEmail")}>
                <Input value={user?.email} disabled />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label={t("profile.cv")} required>
            <Dragger
              multiple={false}
              maxCount={1}
              beforeUpload={(file) => {
                const isAllowedType =
                  file.type === "application/pdf" ||
                  file.type ===
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
                if (!isAllowedType) {
                  message.error(`${file.name} ${t("error.errorOccurred")}`);
                  return false;
                }
                const isLt5M = file.size / 1024 / 1024 < 5;
                if (!isLt5M) {
                  message.error(t("validation.maxLength", { max: 5 }));
                  return false;
                }
                setFileList([file]);
                return false;
              }}
              onRemove={() => setFileList([])}
              fileList={fileList}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">{t("common.updating")}</p>
              <p className="ant-upload-hint">.pdf, .docx (Max 5MB)</p>
            </Dragger>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default JobDetailPage;
