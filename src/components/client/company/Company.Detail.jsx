import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
import "dayjs/locale/en-gb";
import {
  callFetchCompanyById,
  fetchAllJobs,
} from "../../../services/api.service";

const { Title, Text } = Typography;

const CompanyDetail = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const [company, setCompany] = useState(null);
  const [jobData, setJobData] = useState([]);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isJobLoading, setIsJobLoading] = useState(false);
  const [isNotFound, setIsNotFound] = useState(false);

  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [totalJobs, setTotalJobs] = useState(0);

  // Cấu hình ngôn ngữ cho thời gian (1 giờ trước / 1 hour ago)
  dayjs.extend(relativeTime);
  useEffect(() => {
    dayjs.locale(i18n.language === "vi" ? "vi" : "en-gb");
  }, [i18n.language]);

  const fetchCompanyInfo = async () => {
    setIsPageLoading(true);
    try {
      const res = await callFetchCompanyById(id);
      if (res && res.data && (res.data.id || res.data._id)) {
        setCompany(res.data);
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

  useEffect(() => {
    fetchCompanyInfo();
  }, [id]);

  useEffect(() => {
    if (id && !isNotFound && company) {
      fetchJobsByCompany();
    }
  }, [id, current, pageSize, isNotFound, !!company]);

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

  if (isNotFound) {
    return (
      <Result
        status="404"
        title="404"
        subTitle={t("company.notFound")}
        extra={
          <Button type="primary" onClick={() => navigate("/")}>
            {t("header.home")}
          </Button>
        }
      />
    );
  }

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
          {t("job.cancel")}
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
                {t("company.detailedDescription")}
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
                  __html:
                    company?.description || t("company.noDetailedDescription"),
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
                  {t("header.member")}
                </Tag>
              </Card>
            </div>
          </Col>
        </Row>

        <div style={{ marginTop: 40 }}>
          <Divider orientation="left">
            <Title level={3}>
              {t("company.featuredCompanies")} ({totalJobs})
            </Title>
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
                        {job.hot && (
                          <Tag color="volcano">{t("common.hot")}</Tag>
                        )}
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
                    <Text type="secondary">{t("home.noCompanyJobs")}</Text>
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
                showTotal={(total, range) =>
                  t("common.paginationText", {
                    start: range[0],
                    end: range[1],
                    total,
                  })
                }
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyDetail;
