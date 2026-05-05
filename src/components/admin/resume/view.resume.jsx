import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Input,
  notification,
  Popconfirm,
  Row,
  Select,
  Space,
  Table,
  Tag,
} from "antd";
import { useState, useContext } from "react";
import { callDeleteResume } from "../../../services/api.service";
import UpdateResume from "./modal.update.resume";
import { AuthContext } from "../../context/auth.context";
import { hasPermission } from "../../../services/helper/permission";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";

const ViewResume = (props) => {
  const { t } = useTranslation();
  const { dataResumes, page, size, total, fetchResumes, loading } = props;
  const { user } = useContext(AuthContext); // Lấy thông tin user từ context

  const [isOpenResume, setIsOpenResume] = useState(false);
  const [dataResume, setDataResume] = useState({});
  const [searchStatus, setSearchStatus] = useState(undefined);
  const [searchJob, setSearchJob] = useState("");
  const [searchCompany, setSearchCompany] = useState("");

  const handleSearch = () => {
    let queryParts = [];
    if (searchCompany) queryParts.push(`job.company.name~'${searchCompany}'`);
    if (searchJob) queryParts.push(`job.name~'${searchJob}'`);
    if (searchStatus) queryParts.push(`status='${searchStatus}'`);
    const filter = queryParts.join(" AND ");
    fetchResumes({
      page: 1,
      size,
      ...(filter && { filter }),
    });
  };

  const handleDeleteResume = async (id) => {
    const res = await callDeleteResume(id);
    if (res.data) {
      notification.success({
        message: `Xóa Resume thành công!`,
        description: `Đã xóa resume có ID: ${id}`,
      });
      fetchResumes({ page, size });
    } else {
      notification.error({
        message: "Lỗi xóa Resume",
        description: res.message || "Vui lòng thử lại sau",
      });
    }
  };

  const handleReset = () => {
    setSearchCompany("");
    setSearchJob("");
    setSearchStatus(undefined);
    fetchResumes({
      page: 1,
      size,
    });
  };

  const columns = [
    {
      title: t("common.stt"),
      width: 70,
      align: "center",
      render: (_, __, index) => (page - 1) * size + index + 1,
    },
    {
      title: t("resume.status"),
      dataIndex: "status",
      width: 130,
      render: (status) => {
        const configs = {
          PENDING: { color: "warning", label: t("resume.statusPending") },
          REVIEWING: { color: "blue", label: t("resume.statusReviewing") },
          APPROVED: { color: "success", label: t("resume.statusApproved") },
          REJECTED: { color: "error", label: t("resume.statusRejected") },
        };
        const config = configs[status] || { color: "default", label: status };
        return (
          <Tag color={config.color} style={{ fontWeight: 600 }}>
            {config.label}
          </Tag>
        );
      },
    },
    {
      title: t("resume.applicantEmail"),
      dataIndex: "email",
    },
    {
      title: t("header.job"),
      render: (_, record) => record?.job?.name || "-",
    },
    {
      title: t("header.company"),
      render: (_, record) => record?.job?.company?.name || "-",
    },
    {
      title: t("resume.submissionDate"),
      dataIndex: "createdAt",
      render: (t) => (t ? dayjs(t).format("DD/MM/YYYY HH:mm") : "-"),
    },
    {
      title: t("common.actions"),
      key: "action",
      width: 100,
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          {/* Nút Sửa: Chỉ hiện nếu có quyền PUT vào module Resumes */}
          {hasPermission(user, {
            apiPath: "/api/v1/resumes",
            method: "PUT",
          }) && (
            <EditOutlined
              title={t("resume.updateStatus")}
              style={{ color: "blue", fontSize: 18, cursor: "pointer" }}
              onClick={() => {
                setIsOpenResume(true);
                setDataResume(record);
              }}
            />
          )}

          {/* Nút Xóa: Chỉ hiện nếu có quyền DELETE */}
          {hasPermission(user, {
            apiPath: "/api/v1/resumes/{id}",
            method: "DELETE",
          }) && (
            <Popconfirm
              title={t("resume.deleteConfirm")}
              description={t("resume.deleteConfirm")}
              onConfirm={() => handleDeleteResume(record.id)}
              okText={t("common.confirm")}
              cancelText={t("common.cancel")}
            >
              <DeleteOutlined
                style={{ color: "red", fontSize: 18, cursor: "pointer" }}
              />
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      {/* Search Card */}
      <Card
        variant="borderless"
        style={{
          marginBottom: 20,
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          borderRadius: "10px",
        }}
      >
        <Row gutter={[24, 16]} align="bottom">
          <Col span={5}>
            <div style={{ marginBottom: 8, fontWeight: 500 }}>
              {t("resume.statusLabel")}
            </div>
            <Select
              placeholder={t("resume.allStatuses")}
              style={{ width: "100%" }}
              allowClear
              options={[
                { label: t("resume.statusPending"), value: "PENDING" },
                { label: t("resume.statusReviewing"), value: "REVIEWING" },
                { label: t("resume.statusApproved"), value: "APPROVED" },
                { label: t("resume.statusRejected"), value: "REJECTED" },
              ]}
              onChange={(value) => setSearchStatus(value)}
              value={searchStatus}
            />
          </Col>
          <Col span={7}>
            <div style={{ marginBottom: 8, fontWeight: 500 }}>
              {t("resume.jobName")}
            </div>
            <Input
              prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
              placeholder={t("resume.jobPlaceholder")}
              allowClear
              onPressEnter={handleSearch}
              onChange={(e) => setSearchJob(e.target.value)}
              value={searchJob}
            />
          </Col>
          <Col span={7}>
            <div style={{ marginBottom: 8, fontWeight: 500 }}>
              {t("header.company")}
            </div>
            <Input
              prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
              placeholder={t("resume.companyPlaceholder")}
              allowClear
              onPressEnter={handleSearch}
              value={searchCompany}
              onChange={(e) => setSearchCompany(e.target.value)}
            />
          </Col>

          <Col span={5}>
            <Space style={{ width: "100%", justifyContent: "flex-end" }}>
              <Button
                type="primary"
                icon={<SearchOutlined />}
                style={{ borderRadius: "6px" }}
                onClick={handleSearch}
              >
                {t("common.filter")}
              </Button>
              <Button
                icon={<ReloadOutlined />}
                style={{ borderRadius: "6px" }}
                onClick={handleReset}
              >
                {t("common.reset")}
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      <Card title={t("resume.listTitle")}>
        <Table
          loading={loading}
          columns={columns}
          dataSource={dataResumes}
          rowKey="id"
          pagination={{
            current: page,
            pageSize: size,
            total: total,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50"],
            onChange: (p, s) => fetchResumes({ page: p, size: s }),
            showTotal: (total, range) =>
              t("resume.paginationText", {
                start: range[0],
                end: range[1],
                total: total,
              }),
          }}
        />
        <UpdateResume
          setIsOpenResume={setIsOpenResume}
          isOpenResume={isOpenResume}
          dataResume={dataResume}
          fetchResumes={fetchResumes}
        />
      </Card>
    </div>
  );
};

export default ViewResume;
