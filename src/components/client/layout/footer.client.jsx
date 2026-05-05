import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Layout,
  Row,
  Col,
  Typography,
  Space,
  Divider,
  Input,
  Button,
  notification,
  Select,
} from "antd";
import {
  FacebookFilled,
  LinkedinFilled,
  YoutubeFilled,
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  SendOutlined,
  GithubFilled,
} from "@ant-design/icons";
import { callCreateSubscriber } from "../../../services/api.service";

const { Footer } = Layout;
const { Title, Text, Link } = Typography;

const AppFooter = (props) => {
  const { t } = useTranslation();
  const { skillsData } = props;

  const [email, setEmail] = useState("");
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!email) {
      notification.error({ message: t("validation.pleaseEnterEmail") });
      return;
    }
    if (skills.length === 0) {
      notification.error({ message: t("validation.pleaseSelectSkill") });
      return;
    }

    setLoading(true);

    const payload = {
      email,
      name: email.split("@")[0],
      skills: skills.map((id) => ({ id })),
    };

    const res = await callCreateSubscriber(payload);

    if (res.data) {
      notification.success({
        message: t("profile.systemRegistered"),
      });
      setEmail("");
      setSkills([]);
    } else {
      notification.error({
        message: t("message.error"),
        description: res.message || t("error.tryAgain"),
      });
    }

    setLoading(false);
  };

  return (
    <Footer style={{ backgroundColor: "#fff", padding: 0, width: "100%" }}>
      {/* BANNER */}
      <div style={{ background: "#f8f9fa", padding: "40px 50px" }}>
        <Title level={4} style={{ textAlign: "center", marginBottom: 30 }}>
          {t("common.registerTitle")}
        </Title>

        <Row gutter={[16, 16]} justify="center">
          {[
            {
              name: "JobSearch",
              desc: t("footer.jobSearchDesc"),
              color: "linear-gradient(90deg, #1e394d 0%, #00b14f 100%)",
            },
            {
              name: "CV Builder",
              desc: t("footer.cvBuilderDesc"),
              color: "linear-gradient(90deg, #f2994a 0%, #f2c94c 100%)",
            },
            {
              name: "SkillTest",
              desc: t("footer.skillTestDesc"),
              color: "linear-gradient(90deg, #2c3e50 0%, #0061ff 100%)",
            },
            {
              name: "CareerUp",
              desc: t("footer.careerUpDesc"),
              color: "linear-gradient(90deg, #00b14f 0%, #00d2ff 100%)",
            },
          ].map((item, idx) => (
            <Col xs={24} sm={12} md={6} key={idx}>
              <div
                style={{
                  background: item.color,
                  padding: 20,
                  borderRadius: 12,
                  color: "#fff",
                  height: "100%",
                  cursor: "pointer",
                  transition: "transform 0.3s",
                }}
                className="hover-card"
              >
                <Text strong style={{ color: "#fff", fontSize: 16 }}>
                  {item.name}
                </Text>
                <br />
                <Text style={{ color: "#fff", fontSize: 12, opacity: 0.9 }}>
                  {item.desc}
                </Text>
              </div>
            </Col>
          ))}
        </Row>
      </div>

      {/* MAIN */}
      <div
        style={{ padding: "60px 50px 20px", maxWidth: 1400, margin: "0 auto" }}
      >
        <Row gutter={[40, 40]}>
          {/* INFO */}
          <Col xs={24} md={8}>
            <Title level={3} style={{ color: "#00b14f", marginBottom: 20 }}>
              JOB PORTAL
            </Title>

            <Space direction="vertical">
              <Text>
                <EnvironmentOutlined /> {t("footer.address")}
              </Text>
              <Text>
                <PhoneOutlined /> {t("footer.hotline")}: 0845639467
              </Text>
              <Text>
                <MailOutlined /> {t("footer.email")}: tomorrowduc@gmail.com
              </Text>

              <Space size="large" style={{ fontSize: 24, marginTop: 10 }}>
                <Link href="https://facebook.com/tomorrowduc" target="_blank">
                  <FacebookFilled style={{ color: "#1877F2" }} />
                </Link>
                <Link href="https://github.com/anhduc-developer">
                  <GithubFilled style={{ color: "#0A66C2" }} />
                </Link>
                <Link href="/">
                  <YoutubeFilled style={{ color: "#FF0000" }} />
                </Link>
              </Space>
            </Space>
          </Col>

          {/* CANDIDATE */}
          <Col xs={12} md={4}>
            <Title level={5}>{t("footer.candidate")}</Title>
            <Space direction="vertical">
              <Link>{t("footer.findJob")}</Link>
              <Link>{t("footer.topJobs")}</Link>
              <Link>{t("footer.topCompanies")}</Link>
            </Space>
          </Col>

          {/* EMPLOYER */}
          <Col xs={12} md={4}>
            <Title level={5}>{t("footer.employer")}</Title>
            <Space direction="vertical">
              <Link>{t("footer.postJob")}</Link>
              <Link>{t("footer.searchCandidate")}</Link>
              <Link>{t("footer.managementSolution")}</Link>
            </Space>
          </Col>

          {/* SUBSCRIBE */}
          <Col xs={24} md={8}>
            <Title level={5}>{t("common.registerTitle")}</Title>
            <Text type="secondary">{t("profile.systemRegistered")}</Text>

            <div style={{ marginTop: 15 }}>
              <Select
                mode="multiple"
                allowClear
                style={{ width: "100%" }}
                placeholder={t("common.selectPlaceholder")}
                value={skills}
                onChange={(v) => setSkills(v)}
                options={skillsData?.map((s) => ({
                  label: s.name,
                  value: s.id,
                }))}
              />
            </div>

            <div style={{ display: "flex", marginTop: 10 }}>
              <Input
                placeholder={t("footer.enterEmail")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button
                type="primary"
                icon={<SendOutlined />}
                loading={loading}
                onClick={handleSubscribe}
              >
                {t("common.register")}
              </Button>
            </div>
          </Col>
        </Row>

        <Divider />

        {/* BOTTOM */}
        <Row justify="space-between" align="middle">
          <Col>
            <Text type="secondary" style={{ fontSize: 12 }}>
              © 2026 JobPortal. {t("footer.license")}
            </Text>
          </Col>

          <Col>
            <Space size="middle">
              <Link style={{ fontSize: 12 }}>{t("footer.terms")}</Link>
              <Link style={{ fontSize: 12 }}>{t("footer.privacy")}</Link>
            </Space>
          </Col>
        </Row>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .hover-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }
        .ant-typography a:hover {
          color: #00b14f !important;
        }
      `,
        }}
      />
    </Footer>
  );
};

export default AppFooter;
