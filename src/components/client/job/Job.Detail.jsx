import { useLocation, useParams, useNavigate } from "react-router-dom";
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
  Empty,
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
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useContext(AuthContext);

  const [job, setJob] = useState(null);
  const [isPageLoading, setIsPageLoading] = useState(true); // Mặc định là true để check ID
  const [isNotFound, setIsNotFound] = useState(false); // 🔥 State chặn ID ảo

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchJobDetail = async () => {
    setIsPageLoading(true);
    try {
      const res = await callFetchJobById(id);
      // Kiểm tra chặt chẽ res.data và res.data.id
      if (res && res.data && (res.data.id || res.data._id)) {
        setJob(res.data);
        setIsNotFound(false);
      } else {
        setIsNotFound(true);
      }
    } catch (error) {
      console.error("Fetch job error:", error);
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
        message: "Yêu cầu đăng nhập",
        description: "Vui lòng đăng nhập để thực hiện ứng tuyển!",
      });
      navigate("/login");
      return;
    }
    setIsModalOpen(true);
  };

  const handleUploadResume = async () => {
    if (fileList.length === 0) {
      message.error("Vui lòng tải lên CV của bạn!");
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
          message.success("Nộp hồ sơ ứng tuyển thành công!");
          setIsModalOpen(false);
          setFileList([]);
        } else {
          notification.error({
            message: "Thất bại",
            description: res.message || "Không thể gửi hồ sơ",
          });
        }
      }
    } catch (err) {
      notification.error({ message: "Lỗi", description: "Có lỗi xảy ra" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 1. Màn hình loading khi F5 hoặc nhập tay URL
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
        <Spin size="large" tip="Đang xác thực thông tin công việc..." />
      </div>
    );
  }

  // 2. Màn hình lỗi nếu ID không tồn tại (Nhập tay URL sai)
  if (isNotFound || !job) {
    return (
      <div style={{ padding: "50px 0" }}>
        <Result
          status="404"
          title="404"
          subTitle="Công việc bạn tìm kiếm không tồn tại hoặc đã hết hạn tuyển dụng."
          extra={
            <Button onClick={() => navigate("/")} type="primary">
              Quay lại trang chủ
            </Button>
          }
        />
      </div>
    );
  }

  // 3. Render giao diện chính khi đã có dữ liệu hợp lệ
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
        Quay lại
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
                  <DollarOutlined /> Mức lương
                </Text>
                <br />
                <Text strong style={{ color: "#ff4d4f", fontSize: 16 }}>
                  {job.salary?.toLocaleString()} đ
                </Text>
              </div>
              <div style={{ minWidth: 150 }}>
                <Text type="secondary">
                  <EnvironmentOutlined /> Địa điểm
                </Text>
                <br />
                <Text strong>{job.location}</Text>
              </div>
              <div style={{ minWidth: 150 }}>
                <Text type="secondary">
                  <UsergroupAddOutlined /> Số lượng
                </Text>
                <br />
                <Text strong>{job.quantity} người</Text>
              </div>
              <Tag color="blue" style={{ fontSize: 14, padding: "2px 10px" }}>
                {job.level}
              </Tag>
            </Space>

            <div style={{ marginBottom: 25 }}>
              <Text strong style={{ display: "block", marginBottom: 10 }}>
                Kỹ năng yêu cầu:
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
            <Title level={4}>Chi tiết công việc</Title>
            <div
              style={{ fontSize: 16, lineHeight: 1.8, color: "#434343" }}
              dangerouslySetInnerHTML={{
                __html: job.description || "Nội dung đang cập nhật...",
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
                <Text type="secondary">Hạn nộp hồ sơ:</Text>
                <Title level={5} style={{ marginTop: 5, color: "#f5222d" }}>
                  {job.endDate
                    ? dayjs(job.endDate).format("DD/MM/YYYY")
                    : "Đang cập nhật"}
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
                ỨNG TUYỂN NGAY
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
                Xem trang công ty →
              </Button>
            </Card>
          </div>
        </Col>
      </Row>

      <Modal
        title="Ứng tuyển công việc"
        open={isModalOpen}
        onOk={handleUploadResume}
        onCancel={() => setIsModalOpen(false)}
        confirmLoading={isSubmitting}
        okText="Gửi hồ sơ"
        cancelText="Hủy"
        width={600}
      >
        <Divider />
        <Form layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Vị trí">
                <Input value={job.name} disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Email">
                <Input value={user?.email} disabled />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="Hồ sơ CV (PDF, Docx, Max 5MB)" required>
            <Dragger
              multiple={false}
              maxCount={1}
              beforeUpload={(file) => {
                // Kiểm tra định dạng file (tùy chọn)
                const isAllowedType =
                  file.type === "application/pdf" ||
                  file.type ===
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

                if (!isAllowedType) {
                  message.error(
                    `${file.name} không phải là file PDF hoặc Docx!`,
                  );
                  return false;
                }

                // 🔥 Kiểm tra kích thước file (5MB = 5 * 1024 * 1024 bytes)
                const isLt5M = file.size / 1024 / 1024 < 5;
                if (!isLt5M) {
                  message.error("Kích thước CV phải nhỏ hơn 5MB!");
                  return false; // Chặn không cho lưu vào fileList
                }

                // Nếu mọi thứ ổn, lưu file vào state
                setFileList([file]);
                return false; // Trả về false để Ant Design không tự động upload ngay lập tức
              }}
              onRemove={() => setFileList([])}
              fileList={fileList}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Kéo thả hoặc nhấp để chọn CV</p>
              <p className="ant-upload-hint">
                Hỗ trợ file .pdf, .docx (Tối đa 5MB)
              </p>
            </Dragger>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default JobDetailPage;
