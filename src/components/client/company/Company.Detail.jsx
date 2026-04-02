import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  Typography,
  Card,
  Divider,
  Tag,
  Button,
  Space,
  Pagination,
  Spin,
  Result,
} from "antd";
import {
  EnvironmentOutlined,
  ArrowLeftOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";
import {
  callFetchCompanyById,
  fetchAllJobs,
} from "../../../services/api.service";

const { Title, Text } = Typography;

const CompanyDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // State quản lý dữ liệu
  const [company, setCompany] = useState(null);
  const [jobData, setJobData] = useState([]);

  // State quản lý trạng thái hiển thị
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isJobLoading, setIsJobLoading] = useState(false);
  const [isNotFound, setIsNotFound] = useState(false);

  // State phân trang cho Jobs
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [totalJobs, setTotalJobs] = useState(0);

  dayjs.extend(relativeTime);
  dayjs.locale("vi");

  // 1. Hàm lấy chi tiết công ty - Xử lý nhập URL tay
  const fetchCompanyInfo = async () => {
    setIsPageLoading(true);
    try {
      const res = await callFetchCompanyById(id);

      // KIỂM TRA CHẶT CHẼ: Phải có data và data phải có ID thực sự
      if (res && res.data && (res.data.id || res.data._id)) {
        setCompany(res.data);
        setIsNotFound(false);
      } else {
        // Trường hợp ID tào lao, API trả về null hoặc {}
        setIsNotFound(true);
      }
    } catch (error) {
      // Trường hợp API bắn lỗi 400, 404...
      setIsNotFound(true);
    } finally {
      setIsPageLoading(false);
    }
  };

  // 2. Hàm lấy danh sách Jobs của công ty đó
  const fetchJobsByCompany = async () => {
    if (isNotFound || !id) return;
    setIsJobLoading(true);
    try {
      const params = {
        page: current,
        size: pageSize,
        filter: `company.id:'${id}' AND active:true`,
      };
      const res = await fetchAllJobs(params);
      if (res && res.data) {
        setJobData(res.data.result || []);
        setTotalJobs(res.data.meta?.total || 0);
      }
    } catch (error) {
      console.error(">>> Fetch Jobs Error:", error);
    } finally {
      setIsJobLoading(false);
    }
  };

  // Chạy khi ID thay đổi (bao gồm cả khi F5 hoặc nhập tay URL)
  useEffect(() => {
    fetchCompanyInfo();
  }, [id]);

  // Chạy khi thông tin công ty đã hợp lệ và phân trang thay đổi
  useEffect(() => {
    if (id && !isNotFound && company) {
      fetchJobsByCompany();
    }
  }, [id, current, pageSize, isNotFound, !!company]);

  // --- CÁC TRẠNG THÁI RENDER ---

  // 1. Đang tải dữ liệu gốc
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
        <Spin size="large" tip="Đang xác thực thông tin công ty..." />
      </div>
    );
  }

  // 2. Nếu nhập URL sai/ID không tồn tại -> Chặn luôn giao diện trắng
  if (isNotFound) {
    return (
      <Result
        status="404"
        title="404"
        subTitle="Công ty này không tồn tại hoặc đường dẫn đã bị hỏng."
        extra={
          <Button type="primary" onClick={() => navigate("/")}>
            Về trang chủ
          </Button>
        }
      />
    );
  }

  // 3. Nếu không có lỗi và đã load xong, render giao diện chính
  return (
    <div
      style={{ background: "#f5f7f9", minHeight: "100vh", padding: "20px 0" }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 15px" }}>
        <Button
          type="link"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
          style={{ marginBottom: 15, padding: 0 }}
        >
          Quay lại
        </Button>

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <Card
              style={{
                borderRadius: 12,
                border: "none",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              }}
            >
              <Title level={2} style={{ margin: 0, wordBreak: "break-word" }}>
                {company?.name}
              </Title>
              <Text type="secondary" style={{ display: "block", marginTop: 8 }}>
                <EnvironmentOutlined /> {company?.address}
              </Text>
              <Divider />
              <Title
                level={4}
                style={{ display: "flex", alignItems: "center", gap: 8 }}
              >
                <div
                  style={{
                    width: 4,
                    height: 18,
                    background: "#722ed1",
                    borderRadius: 2,
                  }}
                />
                Giới thiệu công ty
              </Title>
              <div
                style={{
                  lineHeight: "1.8",
                  fontSize: 15,
                  color: "#555",
                  wordWrap: "break-word",
                }}
                className="description-content"
                dangerouslySetInnerHTML={{
                  __html: company?.description || "Chưa có mô tả chi tiết...",
                }}
              />
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <div style={{ position: "sticky", top: 20 }}>
              <Card
                style={{
                  borderRadius: 12,
                  border: "none",
                  textAlign: "center",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                }}
              >
                <div
                  style={{
                    background: "#fff",
                    border: "1px solid #f0f0f0",
                    borderRadius: 8,
                    padding: 15,
                    marginBottom: 15,
                    height: 160,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src={`${import.meta.env.VITE_BACKEND_URL}/storage/company/${company?.logo}`}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                    }}
                    alt="logo"
                  />
                </div>
                <Title level={5}>{company?.name}</Title>
                <Tag color="purple" icon={<GlobalOutlined />}>
                  Đã xác thực
                </Tag>
              </Card>
            </div>
          </Col>
        </Row>

        <div style={{ marginTop: 40 }}>
          <Divider orientation="left">
            <Title level={3}>Vị trí đang tuyển ({totalJobs})</Title>
          </Divider>

          <Spin spinning={isJobLoading}>
            <Row gutter={[16, 16]}>
              {jobData.length > 0 ? (
                jobData.map((job) => (
                  <Col xs={24} sm={12} key={job.id}>
                    <Card
                      hoverable
                      onClick={() =>
                        navigate(`/job/${job.id}`, { state: { job } })
                      }
                      style={{ borderRadius: 10, height: "100%" }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <Title
                            level={5}
                            ellipsis={{ tooltip: job.name }}
                            style={{ color: "#722ed1", margin: 0 }}
                          >
                            {job.name}
                          </Title>
                          <Space wrap style={{ marginTop: 8 }}>
                            <Tag color="blue">{job.level}</Tag>
                            {job.skills?.slice(0, 2).map((s, i) => (
                              <Tag key={i}>{s.name}</Tag>
                            ))}
                          </Space>
                        </div>
                        {job.hot && <Tag color="volcano">HOT</Tag>}
                      </div>
                      <div
                        style={{
                          marginTop: 15,
                          paddingTop: 12,
                          borderTop: "1px dashed #eee",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Text strong style={{ color: "#ff4d4f" }}>
                          {job.salary?.toLocaleString()} đ
                        </Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {dayjs(job.createdAt).fromNow()}
                        </Text>
                      </div>
                    </Card>
                  </Col>
                ))
              ) : (
                <Col span={24}>
                  <Card style={{ textAlign: "center", borderRadius: 12 }}>
                    <Text type="secondary">
                      Công ty hiện chưa đăng tin tuyển dụng mới.
                    </Text>
                  </Card>
                </Col>
              )}
            </Row>
          </Spin>

          {totalJobs > 0 && (
            <div style={{ textAlign: "center", marginTop: 30 }}>
              <Pagination
                current={current}
                pageSize={pageSize}
                total={totalJobs}
                onChange={(p) => setCurrent(p)}
                showSizeChanger={false}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyDetail;
