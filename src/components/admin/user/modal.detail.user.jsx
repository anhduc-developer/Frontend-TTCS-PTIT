import { Avatar, Descriptions, Drawer, Divider, Tag } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

const UserDetail = (props) => {
  const { t } = useTranslation();
  const { dataUserDetail, isOpenDetailUser, setIsOpenDetailUser } = props;

  const renderGender = (gender) => {
    const map = {
      MALE: t("user.genderMale"),
      FEMALE: t("user.genderFemale"),
      OTHER: t("user.genderOther"),
    };

    return <Tag color="blue">{map[gender] || t("user.genderOther")}</Tag>;
  };

  return (
    <Drawer
      title={t("user.detailTitle")}
      placement="right"
      width={500}
      onClose={() => setIsOpenDetailUser(false)}
      open={isOpenDetailUser}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <Avatar size={100} icon={<UserOutlined />} />

        <h2>{dataUserDetail?.name || "N/A"}</h2>

        {/* ✅ Role giữ nguyên */}
        <Tag color="cyan">{dataUserDetail?.role?.name || "USER"}</Tag>
      </div>

      <Divider orientation="left">{t("user.personalInfo")}</Divider>

      <Descriptions column={1} bordered size="small">
        <Descriptions.Item label="ID">{dataUserDetail?.id}</Descriptions.Item>

        <Descriptions.Item label={t("user.userEmail")}>
          {dataUserDetail?.email}
        </Descriptions.Item>

        <Descriptions.Item label={t("user.userAge")}>
          {dataUserDetail?.age}
        </Descriptions.Item>

        <Descriptions.Item label={t("user.userGender")}>
          {renderGender(dataUserDetail?.gender)}
        </Descriptions.Item>

        <Descriptions.Item label={t("user.userAddress")}>
          {dataUserDetail?.address || "N/A"}
        </Descriptions.Item>

        <Descriptions.Item label={t("common.createdAt")}>
          {dataUserDetail?.createdAt
            ? new Date(dataUserDetail.createdAt).toLocaleString()
            : "N/A"}
        </Descriptions.Item>

        <Descriptions.Item label={t("user.createdBy")}>
          {dataUserDetail?.createdBy || "System"}
        </Descriptions.Item>
      </Descriptions>

      <Divider orientation="left">{t("common.companyName")}</Divider>

      <Descriptions column={1} bordered size="small">
        <Descriptions.Item label={t("common.companyName")}>
          {dataUserDetail?.company?.name || t("common.noData")}
        </Descriptions.Item>
      </Descriptions>
    </Drawer>
  );
};

export default UserDetail;
