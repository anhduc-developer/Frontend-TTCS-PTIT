import React, { useState, useMemo } from "react";
import {
  Row,
  Col,
  Card,
  Typography,
  Tag,
  Pagination,
  Divider,
  Button,
  Input,
  Space,
  Slider,
  Empty,
} from "antd";
import {
  EnvironmentOutlined,
  EyeOutlined,
  SearchOutlined,
  ShopOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";

const { Title, Text } = Typography;

const Home = (props) => {
  const { companyData = [], jobData = [] } = props;
  dayjs.extend(relativeTime);
  dayjs.locale("vi");
  const navigate = useNavigate();
  const [jobSearch, setJobSearch] = useState("");
  const [comSearch, setComSearch] = useState("");
  const [salaryRange, setSalaryRange] = useState([0, 100000000]);

  const [jobCurrent, setJobCurrent] = useState(1);
  const [jobPageSize, setJobPageSize] = useState(6);
  const [comCurrent, setComCurrent] = useState(1);
  const [comPageSize, setComPageSize] = useState(8);
  const removeVietnameseTones = (str) => {
    if (!str) return "";
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .toLowerCase()
      .trim();
  };

  const filteredJobs = useMemo(() => {
    const searchTerm = removeVietnameseTones(jobSearch);

    return jobData
      .filter((job) => {
        const jobName = removeVietnameseTones(job.name);
        const companyName = removeVietnameseTones(job.company?.name);
        const location = removeVietnameseTones(job.location);

        const matchInfo =
          jobName.includes(searchTerm) ||
          companyName.includes(searchTerm) ||
          location.includes(searchTerm);

        const matchSkills = job.skills?.some((s) =>
          removeVietnameseTones(s.name).includes(searchTerm),
        );
        const jobSalary = job.salary || 0;
        const matchSalary =
          jobSalary >= salaryRange[0] && jobSalary <= salaryRange[1];

        return (
          (matchInfo || matchSkills) &&
          matchSalary &&
          job.active &&
          job.status === "APPROVED" &&
          job.hot
        );
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [jobData, jobSearch, salaryRange]);

  const currentJobs = filteredJobs.slice(
    (jobCurrent - 1) * jobPageSize,
    jobCurrent * jobPageSize,
  );

  // --- Logic Lọc Companies (Search không dấu) ---
  const filteredCompanies = useMemo(() => {
    const searchTerm = removeVietnameseTones(comSearch);
    return companyData.filter((c) => {
      const comName = removeVietnameseTones(c.name);
      const comAddr = removeVietnameseTones(c.address);
      return (
        (comName.includes(searchTerm) || comAddr.includes(searchTerm)) &&
        c.outstanding
      );
    });
  }, [companyData, comSearch]);

  // Các logic còn lại giữ nguyên...
  const currentCompanies = filteredCompanies.slice(
    (comCurrent - 1) * comPageSize,
    comCurrent * comPageSize,
  );

  const jobCountMap = jobData.reduce((acc, job) => {
    if (job.company?.id && job.active && job.status === "APPROVED") {
      acc[+job.company.id] = (acc[+job.company.id] || 0) + 1;
    }
    return acc;
  }, {});

  const handleViewDetail = (job) =>
    navigate(`/job/${job.id}`, { state: { job } });
  const handleViewDetailCompany = (company) =>
    navigate(`/company/${company.id}`, { state: { company } });

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "20px 10px" }}>
      {/* GIAO DIỆN GIỮ NGUYÊN NHƯ FILE CŨ CỦA BẠN */}
      <div style={{ marginBottom: 50 }}>
        <Title level={3} style={{ marginBottom: 20 }}>
          🔥 Công Việc Nổi Bật
        </Title>
        <Card
          style={{
            marginBottom: 20,
            borderRadius: 12,
            background: "#f9f9f9",
            border: "none",
          }}
        >
          <Row gutter={[32, 16]} align="middle">
            <Col xs={24} md={12}>
              <Text strong>
                <SearchOutlined /> Tìm kiếm Job
              </Text>
              <Input
                placeholder="Vị trí, kỹ năng, công ty..."
                allowClear
                onChange={(e) => {
                  setJobSearch(e.target.value);
                  setJobCurrent(1);
                }}
                style={{ marginTop: 8, borderRadius: 8 }}
              />
            </Col>
            <Col xs={24} md={12}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Text strong>
                  <DollarOutlined /> Mức lương:{" "}
                </Text>
                <Text type="danger" strong>
                  {salaryRange[0].toLocaleString()} -{" "}
                  {salaryRange[1].toLocaleString()} VNĐ
                </Text>
              </div>
              <Slider
                range
                step={1000000}
                min={0}
                max={100000000}
                defaultValue={[0, 100000000]}
                onChange={(val) => {
                  setSalaryRange(val);
                  setJobCurrent(1);
                }}
                style={{ marginTop: 8 }}
              />
            </Col>
          </Row>
        </Card>

        <Row gutter={[20, 24]}>
          {currentJobs.length > 0 ? (
            currentJobs.map((job) => (
              <Col xs={24} sm={12} md={8} key={job.id}>
                <Card
                  hoverable
                  onClick={() => handleViewDetail(job)}
                  style={{
                    borderRadius: 16,
                    height: "100%",
                    border: "1px solid #f0f0f0",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <Tag
                    color="volcano"
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      margin: 0,
                      borderRadius: "0 0 0 12px",
                      fontWeight: "600",
                    }}
                  >
                    HOT
                  </Tag>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                    }}
                  >
                    <Space align="start" size={12} style={{ marginBottom: 12 }}>
                      <img
                        src={`${import.meta.env.VITE_BACKEND_URL}/storage/company/${job.company?.logo}`}
                        alt="logo"
                        style={{
                          width: 50,
                          height: 50,
                          objectFit: "contain",
                          border: "1px solid #f0f0f0",
                          borderRadius: 8,
                          padding: 4,
                        }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h4
                          style={{ fontSize: 15, fontWeight: 700, margin: 0 }}
                        >
                          {job.name}
                        </h4>
                        <Text type="secondary" ellipsis>
                          {job.company?.name}
                        </Text>
                      </div>
                    </Space>
                    <div style={{ marginBottom: 12 }}>
                      <Space size={[4, 4]} wrap>
                        {job.skills?.slice(0, 3).map((s, i) => (
                          <Tag
                            key={i}
                            color="blue"
                            style={{ margin: 0, fontSize: 10 }}
                          >
                            {s.name}
                          </Tag>
                        ))}
                      </Space>
                    </div>
                    <div style={{ marginTop: "auto" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          marginBottom: 8,
                          color: "#595959",
                          fontSize: 13,
                        }}
                      >
                        <EnvironmentOutlined />
                        <Text ellipsis>{job.location}</Text>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          paddingTop: 12,
                          borderTop: "1px dashed #f0f0f0",
                        }}
                      >
                        <Text strong style={{ color: "#ff4d4f", fontSize: 14 }}>
                          {job.salary?.toLocaleString()} <small>đ</small>
                        </Text>
                        <Text type="secondary" style={{ fontSize: 11 }}>
                          {dayjs(job.createdAt).fromNow()}
                        </Text>
                      </div>
                    </div>
                  </div>
                </Card>
              </Col>
            ))
          ) : (
            <Col span={24} style={{ textAlign: "center", padding: "40px" }}>
              <Empty description="Không tìm thấy công việc hot phù hợp" />
            </Col>
          )}
        </Row>

        {filteredJobs.length > jobPageSize && (
          <div style={{ marginTop: 30, textAlign: "center" }}>
            <Pagination
              current={jobCurrent}
              pageSize={jobPageSize}
              total={filteredJobs.length}
              onChange={(p) => setJobCurrent(p)}
              showSizeChanger={false}
            />
          </div>
        )}
      </div>

      {/* SECTION: NHÀ TUYỂN DỤNG NỔI BẬT */}
      <div style={{ marginBottom: 50 }}>
        <Row justify="space-between" align="middle" gutter={[16, 16]}>
          <Col>
            <Title level={3} style={{ margin: 0 }}>
              🏢 Nhà Tuyển Dụng Nổi Bật
            </Title>
          </Col>
          <Col xs={24} md={8}>
            <Input
              placeholder="Tìm công ty hoặc địa điểm..."
              prefix={<ShopOutlined style={{ color: "#bfbfbf" }} />}
              allowClear
              onChange={(e) => {
                setComSearch(e.target.value);
                setComCurrent(1);
              }}
              style={{ borderRadius: 8 }}
            />
          </Col>
        </Row>
        <Divider />
        <Row gutter={[16, 24]}>
          {currentCompanies.length > 0 ? (
            currentCompanies.map((c) => {
              const count = jobCountMap[+c.id] || 0;
              return (
                <Col xs={12} sm={8} md={6} key={c.id}>
                  <Card
                    hoverable
                    onClick={() => handleViewDetailCompany(c)}
                    style={{
                      textAlign: "center",
                      borderRadius: 16,
                      height: 260,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          height: 80,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginBottom: 10,
                        }}
                      >
                        <img
                          src={`${import.meta.env.VITE_BACKEND_URL}/storage/company/${c?.logo}`}
                          alt={c.name}
                          style={{
                            maxWidth: "80%",
                            maxHeight: 70,
                            objectFit: "contain",
                          }}
                        />
                      </div>
                      <h4
                        style={{
                          fontWeight: 700,
                          marginBottom: 8,
                          fontSize: 14,
                          height: 40,
                          overflow: "hidden",
                        }}
                      >
                        {c.name}
                      </h4>
                      <Tag color={count > 0 ? "blue" : "default"}>
                        {count > 0 ? `${count} việc làm` : "Chưa có việc làm"}
                      </Tag>
                    </div>
                    <Button
                      block
                      type="primary"
                      ghost
                      icon={<EyeOutlined />}
                      size="small"
                      style={{ borderRadius: 8, marginTop: 10 }}
                    >
                      Chi tiết
                    </Button>
                  </Card>
                </Col>
              );
            })
          ) : (
            <Col span={24} style={{ textAlign: "center", padding: "40px" }}>
              <Empty description="Không tìm thấy công ty phù hợp" />
            </Col>
          )}
        </Row>
        {filteredCompanies.length > comPageSize && (
          <div style={{ marginTop: 30, textAlign: "center" }}>
            <Pagination
              current={comCurrent}
              pageSize={comPageSize}
              total={filteredCompanies.length}
              onChange={(p) => setComCurrent(p)}
              showSizeChanger={false}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
