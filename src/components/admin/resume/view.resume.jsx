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
import { AuthContext } from "../../context/auth.context"; // Đảm bảo đúng đường dẫn
import { hasPermission } from "../../../services/helper/permission";
import dayjs from "dayjs";

const ViewResume = (props) => {
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
      title: "STT",
      width: 70,
      align: "center",
      render: (_, __, index) => (page - 1) * size + index + 1,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: 130,
      render: (status) => {
        const configs = {
          PENDING: { color: "warning", label: "CHỜ DUYỆT" },
          REVIEWING: { color: "blue", label: "ĐANG XEM" },
          APPROVED: { color: "success", label: "CHẤP NHẬN" },
          REJECTED: { color: "error", label: "TỪ CHỐI" },
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
      title: "Ứng viên (Email)",
      dataIndex: "email",
    },
    {
      title: "Công việc",
      render: (_, record) => record?.job?.name || "-",
    },
    {
      title: "Công ty",
      render: (_, record) => record?.job?.company?.name || "-",
    },
    {
      title: "Ngày nộp",
      dataIndex: "createdAt",
      render: (t) => (t ? dayjs(t).format("DD/MM/YYYY HH:mm") : "-"),
    },
    {
      title: "Thao tác",
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
              title="Cập nhật trạng thái"
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
              title="Xóa Resume?"
              description="Bạn có chắc chắn muốn xóa hồ sơ này không?"
              onConfirm={() => handleDeleteResume(record.id)}
              okText="Xác nhận"
              cancelText="Hủy"
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
            <div style={{ marginBottom: 8, fontWeight: 500 }}>Trạng Thái</div>
            <Select
              placeholder="Tất cả trạng thái"
              style={{ width: "100%" }}
              allowClear
              options={[
                { label: "PENDING", value: "PENDING" },
                { label: "REVIEWING", value: "REVIEWING" },
                { label: "APPROVED", value: "APPROVED" },
                { label: "REJECTED", value: "REJECTED" },
              ]}
              onChange={(value) => setSearchStatus(value)}
              value={searchStatus}
            />
          </Col>
          <Col span={7}>
            <div style={{ marginBottom: 8, fontWeight: 500 }}>Tên Job</div>
            <Input
              prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
              placeholder="Nhập tên công việc..."
              allowClear
              onPressEnter={handleSearch}
              onChange={(e) => setSearchJob(e.target.value)}
              value={searchJob}
            />
          </Col>
          <Col span={7}>
            <div style={{ marginBottom: 8, fontWeight: 500 }}>Công ty</div>
            <Input
              prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
              placeholder="Nhập tên công ty..."
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
                Lọc
              </Button>
              <Button
                icon={<ReloadOutlined />}
                style={{ borderRadius: "6px" }}
                onClick={handleReset}
              >
                Reset
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      <Card title="DANH SÁCH HỒ SƠ ỨNG TUYỂN">
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
              `${range[0]}-${range[1]} trên ${total} hồ sơ`,
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
