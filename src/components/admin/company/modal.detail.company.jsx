import { UserOutlined, StarFilled } from "@ant-design/icons";
import { Avatar, Descriptions, Divider, Drawer, Tag, Empty } from "antd";

const CompanyDetail = (props) => {
  const { isOpenDetailCompany, dataCompanyDetail, setIsOpenDetailCompany } =
    props;

  // Lấy URL ảnh logo
  const logoUrl = dataCompanyDetail?.logo
    ? `${import.meta.env.VITE_BACKEND_URL}/storage/company/${dataCompanyDetail.logo}`
    : null;

  return (
    <Drawer
      title="CHI TIẾT CÔNG TY"
      placement="right"
      width={600} // Tăng nhẹ chiều rộng để xem description thoải mái hơn
      onClose={() => setIsOpenDetailCompany(false)}
      open={isOpenDetailCompany}
    >
      {/* HEADER */}
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <Avatar
          size={120}
          src={logoUrl}
          shape="square" // Logo công ty thường để square hoặc rounded-square sẽ đẹp hơn tròn
          icon={<UserOutlined />}
          style={{
            border: "1px solid #f0f0f0",
            marginBottom: 12,
            borderRadius: "8px",
            padding: "4px",
            backgroundColor: "#fff",
          }}
        />

        <h2 style={{ margin: "10px 0 5px 0", color: "#1a1a1a" }}>
          {dataCompanyDetail?.name || "N/A"}
        </h2>

        <div style={{ marginBottom: 16 }}>
          {dataCompanyDetail?.outstanding ? (
            <Tag color="volcano" icon={<StarFilled />}>
              Nổi bật (HOT)
            </Tag>
          ) : (
            <Tag color="blue">Thông thường</Tag>
          )}
        </div>
      </div>

      <Divider
        orientation="left"
        style={{ fontSize: "14px", color: "#8c8c8c" }}
      >
        Thông tin cơ bản
      </Divider>

      <Descriptions column={1} bordered size="middle">
        <Descriptions.Item label="Mã định danh (ID)">
          <Tag color="geekblue">{dataCompanyDetail?.id}</Tag>
        </Descriptions.Item>

        <Descriptions.Item label="Địa chỉ cụ thể">
          {dataCompanyDetail?.address || "N/A"}
        </Descriptions.Item>

        <Descriptions.Item label="Ngày tạo hệ thống">
          {dataCompanyDetail?.createdAt
            ? new Date(dataCompanyDetail.createdAt).toLocaleString("vi-VN")
            : "N/A"}
        </Descriptions.Item>

        <Descriptions.Item label="Cập nhật lần cuối">
          {dataCompanyDetail?.updatedAt
            ? new Date(dataCompanyDetail.updatedAt).toLocaleString("vi-VN")
            : "N/A"}
        </Descriptions.Item>
      </Descriptions>

      <Divider
        orientation="left"
        style={{ fontSize: "14px", color: "#8c8c8c", marginTop: 30 }}
      >
        Mô tả chi tiết
      </Divider>

      {/* Hiển thị Rich Text từ ReactQuill */}
      <div
        style={{
          padding: "10px",
          backgroundColor: "#fafafa",
          borderRadius: "8px",
          lineHeight: "1.6",
        }}
      >
        {dataCompanyDetail?.description ? (
          <div
            className="company-description-detail"
            dangerouslySetInnerHTML={{ __html: dataCompanyDetail.description }}
          />
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Chưa có mô tả chi tiết"
          />
        )}
      </div>
    </Drawer>
  );
};

export default CompanyDetail;
