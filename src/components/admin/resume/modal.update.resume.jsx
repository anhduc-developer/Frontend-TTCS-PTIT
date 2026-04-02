import {
  Descriptions,
  Modal,
  Select,
  Tag,
  Button,
  notification,
  Divider,
  Badge,
  Typography,
  Space,
} from "antd";
import { useState, useEffect } from "react";
import {
  callDownloadFileAPI,
  callPutResume,
} from "../../../services/api.service";
import {
  FilePdfOutlined,
  MailOutlined,
  InfoCircleOutlined,
  HistoryOutlined,
  GlobalOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
const { Text } = Typography;

const UpdateResume = (props) => {
  const { setIsOpenResume, isOpenResume, dataResume, fetchResumes } = props;
  const [status, setStatus] = useState(dataResume?.status);

  useEffect(() => {
    setStatus(dataResume?.status);
  }, [dataResume]);

  const handleUpdateStatus = async () => {
    const data = { id: dataResume?.id, status: status };
    const res = await callPutResume(data);
    if (res.data) {
      notification.success({ message: "Cập Nhật Thành Công!" });
      setIsOpenResume(false);
      fetchResumes();
    } else {
      notification.error({
        message: "Cập Nhật Thất Bại",
        description: res.message || "Có lỗi xảy ra",
      });
    }
  };

  const statusOptions = [
    { value: "PENDING", label: <Badge status="warning" text="PENDING" /> },
    {
      value: "REVIEWING",
      label: <Badge status="processing" text="REVIEWING" />,
    },
    { value: "APPROVED", label: <Badge status="success" text="APPROVED" /> },
    { value: "REJECTED", label: <Badge status="error" text="REJECTED" /> },
  ];

  return (
    <Modal
      title={
        <Space>
          <InfoCircleOutlined style={{ color: "#1890ff" }} />
          <span>CHI TIẾT HỒ SƠ ỨNG TUYỂN</span>
        </Space>
      }
      open={isOpenResume}
      onCancel={() => setIsOpenResume(false)}
      onOk={handleUpdateStatus}
      okText="Lưu thay đổi"
      cancelText="Đóng"
      width={700}
      centered
    >
      <Divider orientation="left" plain>
        <Text type="secondary">Thông tin ứng viên</Text>
      </Divider>

      <Descriptions bordered column={2} size="small">
        <Descriptions.Item
          label={
            <>
              <MailOutlined /> Email
            </>
          }
          span={1}
        >
          <Text strong copyable>
            {dataResume?.email}
          </Text>
        </Descriptions.Item>
        <Descriptions.Item label="Vị trí ứng tuyển" span={1}>
          <Text style={{ color: "green" }} strong>
            {dataResume?.job?.name}
          </Text>
        </Descriptions.Item>
        <Descriptions.Item
          label={
            <>
              <GlobalOutlined /> Công ty
            </>
          }
          span={2}
        >
          {dataResume?.companyName || "N/A"}
        </Descriptions.Item>
      </Descriptions>

      <Divider orientation="left" plain>
        <Text type="secondary">Tệp đính kèm & Trạng thái</Text>
      </Divider>

      <Descriptions bordered column={2} size="small">
        <Descriptions.Item label="Hồ sơ CV" span={1}>
          {dataResume?.url ? (
            <Button
              type="dashed"
              icon={<FilePdfOutlined />}
              href={`http://localhost:8080/api/v1/files?fileName=${dataResume.url}&folder=resume`}
              target="_blank"
              size="small"
              danger
            >
              Xem tệp PDF
            </Button>
          ) : (
            <Text type="secondary" italic>
              Chưa có file
            </Text>
          )}
        </Descriptions.Item>

        <Descriptions.Item label="Xử lý hồ sơ" span={1}>
          <Select
            value={status}
            style={{ width: "100%" }}
            onChange={(val) => setStatus(val)}
            options={statusOptions}
          />
        </Descriptions.Item>
      </Descriptions>

      <Divider orientation="left" plain>
        <Text type="secondary">
          <HistoryOutlined /> Nhật ký hệ thống
        </Text>
      </Divider>

      <div
        style={{
          padding: "0 12px",
          color: "#8c8c8c",
          fontSize: "13px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <span>
          Ngày tạo:{" "}
          <b>
            {dataResume?.createdAt
              ? dayjs(dataResume.createdAt).format("DD/MM/YYYY HH:mm:ss")
              : "N/A"}
          </b>
        </span>
        <span>
          Cập nhật cuối:{" "}
          <b>
            {dataResume?.updatedAt
              ? dayjs(dataResume.updatedAt).format("DD/MM/YYYY HH:mm:ss")
              : "N/A"}
          </b>
        </span>
      </div>
    </Modal>
  );
};

export default UpdateResume;
