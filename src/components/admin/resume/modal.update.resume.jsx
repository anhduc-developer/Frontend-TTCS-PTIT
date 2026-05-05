import {
  Descriptions,
  Modal,
  Select,
  Button,
  notification,
  Divider,
  Badge,
  Typography,
  Space,
} from "antd";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { callPutResume } from "../../../services/api.service";
import {
  FilePdfOutlined,
  MailOutlined,
  InfoCircleOutlined,
  HistoryOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Text } = Typography;

const UpdateResume = (props) => {
  const { t } = useTranslation();
  const { setIsOpenResume, isOpenResume, dataResume, fetchResumes } = props;

  const [status, setStatus] = useState();

  // ✅ sync state
  useEffect(() => {
    if (dataResume) {
      setStatus(dataResume.status);
    }
  }, [dataResume]);

  const handleCancel = () => {
    setIsOpenResume(false);
    setStatus(undefined);
  };

  const handleUpdateStatus = async () => {
    try {
      const res = await callPutResume({
        id: dataResume?.id,
        status: status,
      });

      if (res.data) {
        notification.success({
          message: t("resume.updateSuccess"),
        });

        handleCancel();
        fetchResumes();
      } else {
        notification.error({
          message: t("resume.updateError"),
          description: res.message || t("error.checkData"),
        });
      }
    } catch (error) {
      notification.error({
        message: t("resume.updateError"),
        description: error.message,
      });
    }
  };

  // ✅ status options dùng i18n
  const statusOptions = [
    {
      value: "PENDING",
      label: <Badge status="warning" text={t("resume.statusPending")} />,
    },
    {
      value: "REVIEWING",
      label: <Badge status="processing" text={t("resume.statusReviewing")} />,
    },
    {
      value: "APPROVED",
      label: <Badge status="success" text={t("resume.statusApproved")} />,
    },
    {
      value: "REJECTED",
      label: <Badge status="error" text={t("resume.statusRejected")} />,
    },
  ];

  return (
    <Modal
      title={
        <Space>
          <InfoCircleOutlined style={{ color: "#1890ff" }} />
          <span>{t("resume.detailTitle")}</span>
        </Space>
      }
      open={isOpenResume}
      onCancel={handleCancel}
      onOk={handleUpdateStatus}
      okText={t("common.confirm")}
      cancelText={t("common.cancel")}
      width={700}
      centered
    >
      <Divider orientation="left" plain>
        <Text type="secondary">{t("resume.userInfo")}</Text>
      </Divider>

      <Descriptions bordered column={2} size="small">
        <Descriptions.Item
          label={
            <>
              <MailOutlined /> Email
            </>
          }
        >
          <Text strong copyable>
            {dataResume?.email}
          </Text>
        </Descriptions.Item>

        <Descriptions.Item label={t("resume.jobName")}>
          <Text strong style={{ color: "green" }}>
            {dataResume?.job?.name}
          </Text>
        </Descriptions.Item>

        <Descriptions.Item
          label={
            <>
              <GlobalOutlined /> {t("common.companyName")}
            </>
          }
          span={2}
        >
          {dataResume?.companyName || "N/A"}
        </Descriptions.Item>
      </Descriptions>

      <Divider orientation="left" plain>
        <Text type="secondary">{t("resume.resumeInfo")}</Text>
      </Divider>

      <Descriptions bordered column={2} size="small">
        <Descriptions.Item label="CV">
          {dataResume?.url ? (
            <Button
              type="dashed"
              icon={<FilePdfOutlined />}
              href={`${
                import.meta.env.VITE_BACKEND_URL
              }/api/v1/files?fileName=${dataResume.url}&folder=resume`}
              target="_blank"
              size="small"
              danger
            >
              PDF
            </Button>
          ) : (
            <Text type="secondary">N/A</Text>
          )}
        </Descriptions.Item>

        <Descriptions.Item label={t("resume.status")}>
          <Select
            value={status}
            onChange={setStatus}
            options={statusOptions}
            style={{ width: "100%" }}
          />
        </Descriptions.Item>
      </Descriptions>

      <Divider orientation="left" plain>
        <Text type="secondary">
          <HistoryOutlined /> {t("resume.lastUpdated")}
        </Text>
      </Divider>

      <div style={{ padding: "0 12px", fontSize: 13 }}>
        <div>
          {t("common.createdAt")}:{" "}
          <b>
            {dataResume?.createdAt
              ? dayjs(dataResume.createdAt).format("DD/MM/YYYY HH:mm:ss")
              : "N/A"}
          </b>
        </div>

        <div>
          {t("resume.lastUpdated")}:{" "}
          <b>
            {dataResume?.updatedAt
              ? dayjs(dataResume.updatedAt).format("DD/MM/YYYY HH:mm:ss")
              : "N/A"}
          </b>
        </div>
      </div>
    </Modal>
  );
};

export default UpdateResume;
