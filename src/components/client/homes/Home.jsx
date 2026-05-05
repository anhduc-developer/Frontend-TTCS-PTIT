import React, { useState, useMemo, useEffect } from "react";
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
import "dayjs/locale/en";
import { useTranslation } from "react-i18next";

const { Title, Text } = Typography;

const Home = (props) => {
  const { t, i18n } = useTranslation();
  const { companyData = [], jobData = [] } = props;

  dayjs.extend(relativeTime);
  useEffect(() => {
    dayjs.locale(i18n.language === "vi" ? "vi" : "en");
  }, [i18n.language]);

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
      {/* JOB */}
      <div style={{ marginBottom: 50 }}>
        <Title level={3}> {t("home.hotJobs")}</Title>
        <Card style={{ marginBottom: 20 }}>
          <Row gutter={[32, 16]}>
            <Col xs={24} md={12}>
              <Text strong>
                <SearchOutlined /> {t("home.searchJob")}
              </Text>
              <Input
                placeholder={t("home.searchPlaceholder")}
                allowClear
                onChange={(e) => {
                  setJobSearch(e.target.value);
                  setJobCurrent(1);
                }}
              />
            </Col>

            <Col xs={24} md={12}>
              <Text strong>
                <DollarOutlined /> {t("home.salary")}
              </Text>
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
                    transition: "all 0.25s ease",
                    position: "relative", // 👈 bắt buộc
                    paddingTop: 8,
                  }}
                  bodyStyle={{ padding: 16 }}
                >
                  {/* HOT FIXED TOP RIGHT */}
                  {job.hot && (
                    <Tag
                      color="volcano"
                      style={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        zIndex: 2,
                        fontWeight: 600,
                        borderRadius: 6,
                      }}
                    >
                      HOT
                    </Tag>
                  )}

                  {/* HEADER */}
                  <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                    <img
                      src={
                        job.company?.logo
                          ? `${import.meta.env.VITE_BACKEND_URL}/storage/company/${job.company.logo}`
                          : "https://via.placeholder.com/50"
                      }
                      onError={(e) => {
                        e.currentTarget.src = "https://via.placeholder.com/50";
                      }}
                      alt="logo"
                      style={{
                        width: 48,
                        height: 48,
                        objectFit: "contain",
                        borderRadius: 8,
                        border: "1px solid #eee",
                        padding: 4,
                      }}
                    />

                    {/* 👇 CHỖ QUAN TRỌNG */}
                    <div style={{ flex: 1, paddingRight: 50 }}>
                      {/* paddingRight để tránh bị HOT đè */}

                      <div
                        style={{
                          fontWeight: 600,
                          fontSize: 15,
                          lineHeight: "20px",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {job.name}
                      </div>

                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {job.company?.name}
                      </Text>
                    </div>
                  </div>

                  {/* SKILLS */}
                  <div style={{ marginBottom: 10 }}>
                    <Space size={[6, 6]} wrap>
                      {job.skills?.slice(0, 3).map((s, i) => (
                        <Tag key={i} color="blue" style={{ fontSize: 11 }}>
                          {s.name}
                        </Tag>
                      ))}
                    </Space>
                  </div>

                  {/* LOCATION */}
                  <div
                    style={{ fontSize: 12, color: "#666", marginBottom: 10 }}
                  >
                    <EnvironmentOutlined /> {job.location}
                  </div>

                  {/* FOOTER */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      borderTop: "1px dashed #eee",
                      paddingTop: 10,
                      marginTop: 10,
                    }}
                  >
                    <Text strong style={{ color: "#ff4d4f" }}>
                      {job.salary?.toLocaleString()} đ
                    </Text>

                    <Text type="secondary" style={{ fontSize: 11 }}>
                      {dayjs(job.createdAt)
                        .locale(i18n.language === "vi" ? "vi" : "en")
                        .fromNow()}
                    </Text>
                  </div>
                </Card>
              </Col>
            ))
          ) : (
            <Col span={24}>
              <Empty description={t("home.noJobs")} />
            </Col>
          )}
        </Row>

        <Pagination
          current={jobCurrent}
          pageSize={jobPageSize}
          total={filteredJobs.length}
          onChange={(p) => setJobCurrent(p)}
        />
      </div>

      {/* COMPANY */}
      <div>
        <Title level={3}> {t("home.topCompanies")}</Title>

        <Input
          placeholder={t("home.searchCompany")}
          prefix={<ShopOutlined />}
          allowClear
          onChange={(e) => {
            setComSearch(e.target.value);
            setComCurrent(1);
          }}
        />

        <Divider />

        <Row gutter={[16, 24]}>
          {currentCompanies.length > 0 ? (
            currentCompanies.map((c) => {
              const count = jobCountMap[+c.id] || 0;

              return (
                <Col xs={12} md={6} key={c.id}>
                  <Card
                    hoverable
                    onClick={() => handleViewDetailCompany(c)}
                    style={{
                      borderRadius: 16,
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      textAlign: "center",
                      padding: 12,
                      transition: "all 0.25s ease",
                    }}
                    bodyStyle={{ padding: 12 }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.boxShadow =
                        "0 8px 20px rgba(0,0,0,0.08)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "none";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    {/* LOGO (FIX CHUẨN) */}
                    <div
                      style={{
                        height: 70,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: 10,
                      }}
                    >
                      <img
                        src={
                          c?.logo
                            ? `${import.meta.env.VITE_BACKEND_URL}/storage/company/${c.logo}`
                            : "https://via.placeholder.com/80"
                        }
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://via.placeholder.com/80";
                        }}
                        alt={c.name}
                        style={{
                          maxHeight: 60,
                          maxWidth: "80%",
                          objectFit: "contain",
                        }}
                      />
                    </div>

                    {/* NAME (FIX KHÔNG VỠ) */}
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: 14,
                        marginBottom: 8,
                        minHeight: 40,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {c.name}
                    </div>

                    {/* JOB COUNT */}
                    <Tag style={{ marginBottom: 10 }}>
                      {count > 0
                        ? `${count} ${t("home.jobs")}`
                        : t("home.noCompanyJobs")}
                    </Tag>

                    {/* BUTTON */}
                    <Button icon={<EyeOutlined />} block>
                      {t("common.detail")}
                    </Button>
                  </Card>
                </Col>
              );
            })
          ) : (
            <Col span={24}>
              <Empty description={t("home.noCompanyJobs")} />
            </Col>
          )}
        </Row>

        <Pagination
          current={comCurrent}
          pageSize={comPageSize}
          total={filteredCompanies.length}
          onChange={(p) => setComCurrent(p)}
        />
      </div>
    </div>
  );
};

export default Home;
