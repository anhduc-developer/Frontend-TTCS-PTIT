import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Card,
  Pagination,
  Typography,
  Tag,
  Space,
  Spin,
  Empty,
  Divider,
  Input,
  Slider,
} from "antd";
import {
  EnvironmentOutlined,
  DollarOutlined,
  ThunderboltOutlined,
  SearchOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { fetchAllJobs } from "../../../services/api.service";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";

const { Title, Text } = Typography;

const JobPage = () => {
  const [jobsData, setJobsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Các state cho phân trang và lọc
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalJobs, setTotalJobs] = useState(0);

  const [searchQuery, setSearchQuery] = useState("");
  const [salaryRange, setSalaryRange] = useState([0, 100000000]);

  const navigate = useNavigate();
  dayjs.extend(relativeTime);
  dayjs.locale("vi");

  // Hàm fetch data từ Server có tham số lọc và phân trang
  const loadJobs = async () => {
    setIsLoading(true);

    // 🔥 CẬP NHẬT: Thêm điều kiện status='APPROVED' và active=true
    let filter = `active=true AND status='APPROVED'`;

    if (searchQuery) {
      // Lưu ý bọc các điều kiện tìm kiếm trong ngoặc đơn để không làm sai lệch điều kiện status/active
      filter += ` AND (name~'${searchQuery}' OR company.name~'${searchQuery}' OR skills.name~'${searchQuery}')`;
    }

    if (salaryRange) {
      filter += ` AND salary>=${salaryRange[0]} AND salary<=${salaryRange[1]}`;
    }

    const res = await fetchAllJobs({
      page: currentPage,
      size: pageSize,
      filter: filter,
    });

    if (res && res.data) {
      setJobsData(res.data.result || []);
      setTotalJobs(res.data.meta?.total || 0);
    }
    setIsLoading(false);
  };

  // Gọi lại API khi trang hoặc tiêu chí lọc thay đổi
  useEffect(() => {
    loadJobs();
  }, [currentPage, pageSize]);

  // Handler khi nhấn nút tìm kiếm hoặc thay đổi slider
  // Lưu ý: Thêm nút bấm hoặc debounce để tránh gọi API quá nhiều khi gõ/kéo
  const handleFilterTrigger = () => {
    setCurrentPage(1); // Reset về trang 1 khi lọc
    loadJobs();
  };

  if (isLoading && jobsData.length === 0) {
    return (
      <div style={{ padding: 100, textAlign: "center" }}>
        <Spin size="large" tip="Đang tải danh sách việc làm..." />
      </div>
    );
  }

  return (
    <div
      style={{ background: "#f5f7f9", minHeight: "100vh", padding: "40px 0" }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
        {/* BỘ LỌC */}
        <Card
          style={{
            marginBottom: 30,
            borderRadius: 16,
            border: "none",
            boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
          }}
        >
          <Row gutter={[32, 24]} align="middle">
            <Col xs={24} md={12}>
              <Text strong>
                <SearchOutlined /> Tìm kiếm công việc
              </Text>
              <Input
                placeholder="Vị trí, công ty hoặc kỹ năng..."
                allowClear
                size="large"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onPressEnter={handleFilterTrigger} // Nhấn Enter để tìm
                style={{ marginTop: 10, borderRadius: 8 }}
              />
            </Col>
            <Col xs={24} md={10}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Text strong>
                  <FilterOutlined /> Mức lương (VNĐ)
                </Text>
                <Text type="danger" strong>
                  {salaryRange[0].toLocaleString()} -{" "}
                  {salaryRange[1].toLocaleString()}
                </Text>
              </div>
              <Slider
                range
                step={1000000}
                min={0}
                max={100000000}
                value={salaryRange}
                onChange={(val) => setSalaryRange(val)}
                onAfterChange={handleFilterTrigger} // Thả chuột ra mới gọi API
                style={{ marginTop: 15 }}
              />
            </Col>
            <Col xs={24} md={2}>
              <button
                onClick={handleFilterTrigger}
                style={{
                  width: "100%",
                  height: 40,
                  cursor: "pointer",
                  borderRadius: 8,
                  border: "none",
                  background: "#1890ff",
                  color: "#fff",
                }}
              >
                Lọc
              </button>
            </Col>
          </Row>
        </Card>

        {/* DANH SÁCH JOB */}
        <Spin spinning={isLoading}>
          {jobsData.length > 0 ? (
            <>
              <Row gutter={[20, 20]}>
                {jobsData.map((job) => (
                  <Col xs={24} md={12} key={job.id}>
                    <Card
                      hoverable
                      onClick={() =>
                        navigate(`/job/${job.id}`, { state: { job } })
                      }
                      style={{
                        borderRadius: 12,
                        border: "none",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                        overflow: "hidden",
                        position: "relative",
                      }}
                    >
                      {job.hot && (
                        <Tag
                          color="volcano"
                          icon={<ThunderboltOutlined />}
                          style={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                            margin: 0,
                            borderRadius: "0 0 0 12px",
                            padding: "2px 15px",
                            fontWeight: 600,
                            zIndex: 1,
                          }}
                        >
                          HOT
                        </Tag>
                      )}

                      <div style={{ display: "flex", gap: 15 }}>
                        <img
                          src={`${import.meta.env.VITE_BACKEND_URL}/storage/company/${job.company?.logo}`}
                          alt="logo"
                          style={{
                            width: 65,
                            height: 65,
                            objectFit: "contain",
                            border: "1px solid #f0f0f0",
                            borderRadius: 8,
                            padding: 4,
                            background: "#fff",
                          }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <Title
                            level={5}
                            style={{ margin: "0 0 5px 0", color: "#1890ff" }}
                            ellipsis
                          >
                            {job.name}
                          </Title>
                          <Text
                            strong
                            style={{
                              display: "block",
                              marginBottom: 8,
                              fontSize: 13,
                              color: "#595959",
                            }}
                          >
                            {job.company?.name}
                          </Text>
                          <Space
                            wrap
                            size={[4, 8]}
                            style={{ marginBottom: 12 }}
                          >
                            <Tag
                              color="orange"
                              style={{ fontSize: 11, border: "none" }}
                            >
                              {job.level}
                            </Tag>
                            {job.skills?.slice(0, 3).map((s, i) => (
                              <Tag
                                key={i}
                                style={{
                                  fontSize: 11,
                                  borderRadius: 4,
                                  background: "#f0f0f0",
                                  border: "none",
                                }}
                              >
                                {s.name}
                              </Tag>
                            ))}
                          </Space>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              borderTop: "1px dashed #f0f0f0",
                              paddingTop: 12,
                            }}
                          >
                            <Text type="danger" strong>
                              <DollarOutlined /> {job.salary?.toLocaleString()}{" "}
                              VNĐ
                            </Text>
                            <Text style={{ fontSize: 12, color: "#8c8c8c" }}>
                              <EnvironmentOutlined /> {job.location}
                            </Text>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>

              <div style={{ marginTop: 40, textAlign: "center" }}>
                <Pagination
                  current={currentPage}
                  pageSize={pageSize}
                  total={totalJobs}
                  onChange={(p, s) => {
                    setCurrentPage(p);
                    setPageSize(s);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  showSizeChanger
                />
              </div>
            </>
          ) : (
            <Empty
              description={<span>Không tìm thấy công việc phù hợp</span>}
            />
          )}
        </Spin>
      </div>
    </div>
  );
};

export default JobPage;
