import React, { useState } from "react";
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
  const { skillsData } = props; // Giả sử bạn truyền list skill từ trang chủ xuống
  const [email, setEmail] = useState("");
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    // 1. Validate dữ liệu cơ bản
    if (!email) {
      notification.error({ message: "Vui lòng nhập Email!" });
      return;
    }
    if (skills.length === 0) {
      notification.error({ message: "Vui lòng chọn ít nhất một kỹ năng!" });
      return;
    }

    setLoading(true);

    // 2. Chuẩn bị payload theo đúng cấu trúc Backend mong đợi
    // Backend cần mảng Object: skills: [{id: 1}, {id: 2}]
    const payload = {
      email: email,
      name: email.split("@")[0], // Tạm lấy phần trước @ làm tên nếu bạn không có field Name
      skills: skills.map((id) => ({ id: id })),
    };

    // 3. Gọi API duy nhất (POST /subscribers)
    const res = await callCreateSubscriber(payload);

    if (res.data) {
      notification.success({
        message: "Đăng ký thành công!",
        description:
          "Hệ thống đã ghi nhận sở thích của bạn và sẽ gửi mail hàng tuần.",
      });
      // Reset form sau khi thành công
      setEmail("");
      setSkills([]);
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        description: res.message || "Vui lòng thử lại sau",
      });
    }
    setLoading(false);
  };
  return (
    <Footer style={{ backgroundColor: "#fff", padding: "0", width: "100%" }}>
      {/* 1. Phần Hệ sinh thái (Banner màu như mẫu TopCV bạn thích) */}
      <div style={{ background: "#f8f9fa", padding: "40px 50px" }}>
        <Title level={4} style={{ textAlign: "center", marginBottom: "30px" }}>
          Hệ sinh thái HR Tech toàn diện
        </Title>
        <Row gutter={[16, 16]} justify="center">
          {[
            {
              name: "JobSearch",
              desc: "Tìm việc làm nhanh",
              color: "linear-gradient(90deg, #1e394d 0%, #00b14f 100%)",
            },
            {
              name: "CV Builder",
              desc: "Tạo CV chuyên nghiệp",
              color: "linear-gradient(90deg, #f2994a 0%, #f2c94c 100%)",
            },
            {
              name: "SkillTest",
              desc: "Đánh giá năng lực",
              color: "linear-gradient(90deg, #2c3e50 0%, #0061ff 100%)",
            },
            {
              name: "CareerUp",
              desc: "Lộ trình thăng tiến",
              color: "linear-gradient(90deg, #00b14f 0%, #00d2ff 100%)",
            },
          ].map((item, idx) => (
            <Col xs={24} sm={12} md={6} key={idx}>
              <div
                style={{
                  background: item.color,
                  padding: "20px",
                  borderRadius: "12px",
                  color: "#fff",
                  height: "100%",
                  cursor: "pointer",
                  transition: "transform 0.3s",
                }}
                className="hover-card"
              >
                <Text strong style={{ color: "#fff", fontSize: "16px" }}>
                  {item.name}
                </Text>
                <br />
                <Text style={{ color: "#fff", fontSize: "12px", opacity: 0.9 }}>
                  {item.desc}
                </Text>
              </div>
            </Col>
          ))}
        </Row>
      </div>

      {/* 2. Phần Thông tin chi tiết */}
      <div
        style={{
          padding: "60px 50px 20px 50px",
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        <Row gutter={[40, 40]}>
          {/* Cột 1: Về chúng tôi */}
          <Col xs={24} md={8}>
            <Title level={3} style={{ color: "#00b14f", marginBottom: "20px" }}>
              JOB PORTAL
            </Title>
            <Space direction="vertical" size="middle">
              <Text>
                <EnvironmentOutlined /> Hà Đông, Hà Nội
              </Text>
              <Text>
                <PhoneOutlined /> Hotline: 0845639467
              </Text>
              <Text>
                <MailOutlined /> Email: tomorrowduc@gmail.com
              </Text>
              <Space
                size="large"
                style={{ fontSize: "24px", marginTop: "10px" }}
              >
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

          {/* Cột 2: Dành cho ứng viên */}
          <Col xs={12} md={4}>
            <Title level={5}>Ứng viên</Title>
            <Space direction="vertical">
              <Link href="#">Tìm việc làm</Link>
              <Link href="/">Top việc làm</Link>
              <Link href="/">Top công ty</Link>
            </Space>
          </Col>

          {/* Cột 3: Dành cho nhà tuyển dụng */}
          <Col xs={12} md={4}>
            <Title level={5}>Nhà tuyển dụng</Title>
            <Space direction="vertical">
              <Link href="/">Đăng tin tuyển dụng</Link>
              <Link href="/">Tìm kiếm ứng viên</Link>
              <Link href="/">Giải pháp quản trị</Link>
            </Space>
          </Col>

          {/* Cột 4: Đăng ký nhận tin */}
          <Col xs={24} md={8}>
            <Title level={5}>Nhận bản tin việc làm</Title>
            <Text type="secondary">
              Chọn kỹ năng bạn quan tâm để nhận cơ hội việc làm tốt nhất.
            </Text>

            {/* Chọn Skills */}
            <div style={{ marginTop: "15px" }}>
              <Select
                mode="multiple"
                allowClear
                style={{ width: "100%" }}
                placeholder="Chọn kỹ năng (Java, React...)"
                value={skills}
                onChange={(v) => setSkills(v)}
                options={skillsData?.map((s) => ({
                  label: s.name,
                  value: s.id,
                }))}
              />
            </div>

            {/* Nhập Email và Nút gửi */}
            <div style={{ display: "flex", marginTop: "10px" }}>
              <Input
                placeholder="Email của bạn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ borderRadius: "4px 0 0 4px" }}
              />
              <Button
                type="primary"
                icon={<SendOutlined />}
                loading={loading}
                onClick={handleSubscribe}
                style={{ borderRadius: "0 4px 4px 0" }}
              >
                Đăng ký
              </Button>
            </div>
          </Col>
        </Row>

        <Divider />

        {/* 3. Phần Pháp lý & Copyright */}
        <Row
          justify="space-between"
          align="middle"
          style={{ paddingBottom: "20px" }}
        >
          <Col>
            <Text type="secondary" style={{ fontSize: "12px" }}>
              © 2026 JobPortal. Giấy phép ĐKKD số 0123456789 cấp bởi Sở KH&ĐT Hà
              Nội
            </Text>
          </Col>
          <Col>
            <Space size="middle">
              <Link href="#" style={{ fontSize: "12px" }}>
                Điều khoản dịch vụ
              </Link>
              <Link href="#" style={{ fontSize: "12px" }}>
                Chính sách bảo mật
              </Link>
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
