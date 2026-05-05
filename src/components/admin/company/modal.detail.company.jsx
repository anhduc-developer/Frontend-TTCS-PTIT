import { UserOutlined, StarFilled } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { Avatar, Descriptions, Divider, Drawer, Tag, Empty } from "antd";
import dayjs from "dayjs";

const CompanyDetail = (props) => {
  const { t, i18n } = useTranslation();
  const { isOpenDetailCompany, dataCompanyDetail, setIsOpenDetailCompany } =
    props;

  // Lấy URL ảnh logo
  const logoUrl = dataCompanyDetail?.logo
    ? `${import.meta.env.VITE_BACKEND_URL}/storage/company/${dataCompanyDetail.logo}`
    : null;

  // Format ngày tháng theo ngôn ngữ hiện tại
  const formatDate = (date) => {
    if (!date) return "N/A";
    const formatStr =
      i18n.language === "vi" ? "DD/MM/YYYY HH:mm:ss" : "MM/DD/YYYY HH:mm:ss";
    return dayjs(date).format(formatStr);
  };

  return (
    <Drawer
      title={t("company.detailTitle")}
      placement="right"
      width={600}
      onClose={() => setIsOpenDetailCompany(false)}
      open={isOpenDetailCompany}
    >
      {/* HEADER */}
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <Avatar
          size={120}
          src={logoUrl}
          shape="square"
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
              {t("common.hot")}
            </Tag>
          ) : (
            <Tag color="blue">{t("common.active")}</Tag>
          )}
        </div>
      </div>

      <Divider
        orientation="left"
        style={{ fontSize: "14px", color: "#8c8c8c" }}
      >
        {t("company.details")}
      </Divider>

      <Descriptions column={1} bordered size="middle">
        <Descriptions.Item label={t("common.id")}>
          <Tag color="geekblue">{dataCompanyDetail?.id}</Tag>
        </Descriptions.Item>

        <Descriptions.Item label={t("form.companyAddress")}>
          {dataCompanyDetail?.address || "N/A"}
        </Descriptions.Item>

        <Descriptions.Item label={t("common.createdAt")}>
          {formatDate(dataCompanyDetail?.createdAt)}
        </Descriptions.Item>

        <Descriptions.Item label={t("common.updatedAt")}>
          {formatDate(dataCompanyDetail?.updatedAt)}
        </Descriptions.Item>
      </Descriptions>

      <Divider
        orientation="left"
        style={{ fontSize: "14px", color: "#8c8c8c", marginTop: 30 }}
      >
        {t("company.detailedDescription")}
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
            description={t("company.noDetailedDescription")}
          />
        )}
      </div>
    </Drawer>
  );
};

export default CompanyDetail;
