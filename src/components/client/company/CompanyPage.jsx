import React, { useEffect, useState, useMemo } from "react";
import {
  Row,
  Col,
  Card,
  Pagination,
  Typography,
  Empty,
  Spin,
  Input,
  Divider,
} from "antd";
import { useNavigate } from "react-router-dom";
import { SearchOutlined, EnvironmentOutlined } from "@ant-design/icons";
import { fetchAllCompanies } from "../../../services/api.service";

const { Title, Text } = Typography;

const CompanyPage = () => {
  const [companyData, setCompanyData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState(""); // State để tìm kiếm
  const pageSize = 8; // 12 công ty mỗi trang (4 cột x 3 hàng)
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      // Lấy size lớn (100) để phân trang và tìm kiếm ở Client cho mượt
      const res = await fetchAllCompanies({ page: 1, size: 100 });
      if (res.data) {
        setCompanyData(res.data.result);
      }
      setLoading(false);
    };
    init();
  }, []);

  // --- Logic Tìm kiếm (Client-side) ---
  const filteredCompanies = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return companyData;

    return companyData.filter(
      (c) =>
        c.name?.toLowerCase().includes(query) ||
        c.address?.toLowerCase().includes(query),
    );
  }, [companyData, searchQuery]);

  // --- Logic Phân trang ---
  const startIndex = (currentPage - 1) * pageSize;
  const currentCompanies = filteredCompanies.slice(
    startIndex,
    startIndex + pageSize,
  );

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset về trang 1 khi gõ tìm kiếm
  };

  if (loading) {
    return (
      <div style={{ padding: 100, textAlign: "center" }}>
        <Spin size="large" tip="Đang tải danh sách công ty..." />
      </div>
    );
  }

  return (
    <div
      style={{ background: "#f5f7f9", minHeight: "100vh", padding: "40px 0" }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
        {/* 1. THANH TÌM KIẾM */}
        <div style={{ marginBottom: 40, textAlign: "center" }}>
          <Title level={2} style={{ marginBottom: 20 }}>
            Khám phá các Doanh nghiệp hàng đầu
          </Title>
          <Input
            placeholder="Nhập tên công ty hoặc địa điểm..."
            prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
            allowClear
            size="large"
            onChange={handleSearch}
            style={{
              maxWidth: 600,
              borderRadius: 30,
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              padding: "10px 25px",
            }}
          />
        </div>

        <Divider />

        {/* 2. DANH SÁCH CÔNG TY */}
        {filteredCompanies.length > 0 ? (
          <>
            <Row gutter={[24, 24]}>
              {currentCompanies.map((c) => (
                <Col xs={24} sm={12} md={8} lg={6} key={c.id}>
                  <Card
                    hoverable
                    onClick={() =>
                      navigate(`/company/${c.id}`, { state: { company: c } })
                    }
                    style={{
                      borderRadius: 16,
                      height: 260,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      border: "none",
                      boxShadow: "0 4px 10px rgba(0,0,0,0.03)",
                      overflow: "hidden",
                    }}
                  >
                    {/* Tag Nổi bật */}
                    {c.outstanding && (
                      <span
                        style={{
                          position: "absolute",
                          top: 0,
                          right: 0,
                          background: "#ff4d4f",
                          color: "#fff",
                          padding: "4px 12px",
                          borderRadius: "0 0 0 12px",
                          fontSize: 10,
                          fontWeight: "bold",
                          zIndex: 1,
                        }}
                      >
                        NỔI BẬT
                      </span>
                    )}

                    <div style={{ textAlign: "center", paddingTop: 10 }}>
                      <div
                        style={{
                          height: 80,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginBottom: 15,
                        }}
                      >
                        <img
                          src={`${import.meta.env.VITE_BACKEND_URL}/storage/company/${c.logo}`}
                          alt={c.name}
                          style={{
                            maxWidth: "80%",
                            maxHeight: 80,
                            objectFit: "contain",
                          }}
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/150?text=Company";
                          }}
                        />
                      </div>
                      <Text
                        strong
                        style={{
                          fontSize: 15,
                          display: "block",
                          height: 44,
                          overflow: "hidden",
                        }}
                      >
                        {c.name}
                      </Text>
                    </div>

                    <div
                      style={{
                        borderTop: "1px solid #f0f0f0",
                        paddingTop: 10,
                        textAlign: "center",
                      }}
                    >
                      <Text
                        type="secondary"
                        ellipsis
                        style={{ width: "100%", fontSize: 12 }}
                      >
                        <EnvironmentOutlined /> {c.address}
                      </Text>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>

            {/* 3. BỘ PHÂN TRANG (PAGINATION) */}
            <div style={{ marginTop: 50, textAlign: "center" }}>
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={filteredCompanies.length}
                onChange={(page) => {
                  setCurrentPage(page);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                showSizeChanger={false}
              />
            </div>
          </>
        ) : (
          <Empty
            description={
              <span>
                Không tìm thấy công ty phù hợp với "<b>{searchQuery}</b>"
              </span>
            }
          />
        )}
      </div>
    </div>
  );
};

export default CompanyPage;
