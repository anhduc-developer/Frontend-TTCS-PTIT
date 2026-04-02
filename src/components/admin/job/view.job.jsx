import {
  CreditCardOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Input,
  Modal,
  notification,
  Popconfirm,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  Form,
  Tooltip,
} from "antd";
import { useState, useContext } from "react";
import CreateJob from "./modal.create.job";
import { callDeleteJob, callPutJob } from "../../../services/api.service";
import UpdateJob from "./modal.update.job";
import { AuthContext } from "../../context/auth.context";

const { Text, Title } = Typography;

const ViewJob = (props) => {
  const {
    companyData,
    page,
    size,
    jobData,
    skillData,
    fetchJobs,
    total,
    isLoading,
  } = props;

  const { user } = useContext(AuthContext);
  const [form] = Form.useForm();

  // States quản lý Modal
  const [isOpenCreateJob, setIsOpenCreateJob] = useState(false);
  const [isOpenUpdateJob, setIsOpenUpdateJob] = useState(false);
  const [dataUpdateJob, setDataUpdateJob] = useState({});

  // States cho QR Payment
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [selectedJobForPay, setSelectedJobForPay] = useState(null);
  const [loadingPayment, setLoadingPayment] = useState(false);

  // --- Logic Tìm kiếm ---
  const onFinish = (values) => {
    const { name, companyName, status } = values;
    let queryParts = [];
    if (name) queryParts.push(`name~'${name}'`);
    if (companyName) queryParts.push(`company.name~'${companyName}'`);
    if (status) queryParts.push(`status='${status}'`);

    const filter = queryParts.join(" AND ");
    // Khi lọc luôn ép về trang 1 để tránh lỗi phân trang
    fetchJobs({ page: 1, size, ...(filter && { filter }) });
  };

  const handleReset = () => {
    form.resetFields();
    fetchJobs({ page: 1, size });
  };

  // --- Logic Thanh toán ---
  const showQRModal = (record) => {
    setSelectedJobForPay(record);
    setIsQRModalOpen(true);
  };

  const handleConfirmPayment = async () => {
    if (!selectedJobForPay) return;
    setLoadingPayment(true);
    const data = {
      ...selectedJobForPay,
      status: "PENDING_APPROVAL",
      company: { id: selectedJobForPay.company?.id },
      skills: selectedJobForPay.skills?.map((s) => ({ id: s.id })),
    };

    const res = await callPutJob(data);
    if (res.data) {
      notification.success({
        message: "Thanh toán thành công",
        description: "Tin đăng đang chờ Admin phê duyệt.",
      });
      setIsQRModalOpen(false);
      fetchJobs({ page, size });
    }
    setLoadingPayment(false);
  };

  // --- Logic Admin Duyệt tin ---
  const handleApproveJob = (record, newStatus) => {
    const isApprove = newStatus === "APPROVED";
    Modal.confirm({
      title: isApprove ? "Duyệt tin tuyển dụng" : "Từ chối tin",
      content: `Xác nhận thay đổi trạng thái Job: ${record.name}?`,
      okText: "Xác nhận",
      onOk: async () => {
        const data = {
          ...record,
          status: newStatus,
          active: isApprove,
          company: { id: record.company?.id },
          skills: record.skills?.map((s) => ({ id: s.id })),
        };
        const res = await callPutJob(data);
        if (res.data) {
          notification.success({ message: "Cập nhật thành công!" });
          fetchJobs({ page, size });
        }
      },
    });
  };

  const handleDeleteJob = async (record) => {
    const res = await callDeleteJob(record.id);
    if (res.data) {
      notification.success({ message: "Xóa Job thành công!" });
      fetchJobs({ page, size });
    }
  };

  const columns = [
    {
      title: "STT",
      width: 60,
      align: "center",
      render: (_, __, index) => (page - 1) * size + index + 1,
    },
    {
      title: "Tên Job",
      dataIndex: "name",
      width: 200,
      ellipsis: true,
      render: (t) => <Text strong>{t}</Text>,
    },
    {
      title: "Công ty",
      render: (_, r) => r?.company?.name || "-",
    },
    {
      title: "Giá dịch vụ",
      width: 120,
      render: () => <Text type="danger">50.000 đ</Text>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: 150,
      render: (status) => {
        const configs = {
          PENDING_PAYMENT: { color: "warning", text: "Chờ thanh toán" },
          PENDING_APPROVAL: { color: "processing", text: "Chờ duyệt" },
          APPROVED: { color: "success", text: "Đang hiển thị" },
          REJECTED: { color: "error", text: "Bị từ chối" },
        };
        const config = configs[status] || { color: "default", text: status };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: "Thao tác",
      key: "action",
      width: 170,
      fixed: "right",
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          {record.status === "PENDING_PAYMENT" && (
            <Tooltip title="Thanh toán QR">
              <CreditCardOutlined
                style={{ color: "#faad14", fontSize: 20, cursor: "pointer" }}
                onClick={() => showQRModal(record)}
              />
            </Tooltip>
          )}

          {user.role.name === "ADMIN" &&
            record.status === "PENDING_APPROVAL" && (
              <>
                <CheckCircleOutlined
                  title="Duyệt"
                  style={{ color: "#52c41a", fontSize: 18, cursor: "pointer" }}
                  onClick={() => handleApproveJob(record, "APPROVED")}
                />
                <CloseCircleOutlined
                  title="Từ chối"
                  style={{ color: "#ff4d4f", fontSize: 18, cursor: "pointer" }}
                  onClick={() => handleApproveJob(record, "REJECTED")}
                />
              </>
            )}

          <EditOutlined
            title="Sửa"
            style={{ color: "#1890ff", fontSize: 18, cursor: "pointer" }}
            onClick={() => {
              setDataUpdateJob(record);
              setIsOpenUpdateJob(true);
            }}
          />

          <Popconfirm
            title="Xác nhận xóa?"
            onConfirm={() => handleDeleteJob(record)}
          >
            <DeleteOutlined
              style={{ color: "#ff4d4f", fontSize: 18, cursor: "pointer" }}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      {/* Search Form */}
      <Card
        style={{
          marginBottom: 20,
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Row gutter={[16, 0]}>
            <Col xs={24} md={7}>
              <Form.Item name="name" label="Tên công việc">
                <Input
                  placeholder="Tìm theo tên vị trí..."
                  allowClear
                  prefix={<SearchOutlined />}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={7}>
              <Form.Item name="companyName" label="Công ty">
                <Input placeholder="Tìm theo tên công ty..." allowClear />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item name="status" label="Trạng thái">
                <Select
                  placeholder="Lọc theo trạng thái"
                  allowClear
                  options={[
                    { label: "Chờ thanh toán", value: "PENDING_PAYMENT" },
                    { label: "Chờ duyệt", value: "PENDING_APPROVAL" },
                    { label: "Đang hiển thị", value: "APPROVED" },
                    { label: "Bị từ chối", value: "REJECTED" },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col
              xs={24}
              md={4}
              style={{
                display: "flex",
                alignItems: "flex-end",
                paddingBottom: 24,
              }}
            >
              <Space>
                <Button type="primary" htmlType="submit">
                  Lọc
                </Button>
                <Button onClick={handleReset}>Reset</Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>

      {/* Table Section */}
      <Card
        title={
          <Title level={4} style={{ margin: 0 }}>
            Danh sách tin đăng
          </Title>
        }
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsOpenCreateJob(true)}
          >
            Đăng tin mới
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={jobData}
          rowKey="id"
          loading={isLoading}
          scroll={{ x: 1200 }}
          pagination={{
            current: page,
            pageSize: size,
            total: total, // 🔥 Đảm bảo tổng số (VD: 12) truyền xuống từ file cha
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50"],
            onChange: (p, s) => fetchJobs({ page: p, size: s }),
            showTotal: (total) => `Tổng cộng ${total} kết quả`,
          }}
        />
      </Card>

      {/* MODAL THANH TOÁN QR */}
      <Modal
        title="Thanh toán phí dịch vụ"
        open={isQRModalOpen}
        onCancel={() => setIsQRModalOpen(false)}
        footer={[
          <Button key="back" onClick={() => setIsQRModalOpen(false)}>
            Hủy bỏ
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loadingPayment}
            onClick={handleConfirmPayment}
          >
            Xác nhận đã chuyển tiền
          </Button>,
        ]}
        width={400}
        centered
      >
        <div style={{ textAlign: "center" }}>
          <Text type="secondary">
            Vui lòng quét mã QR để thanh toán phí đăng tin
          </Text>
          <div
            style={{
              margin: "20px 0",
              border: "1px solid #f0f0f0",
              padding: 10,
              borderRadius: 8,
            }}
          >
            <img
              src={`https://img.vietqr.io/image/MB-4711032004-compact.png?amount=50000&addInfo=PAY%20JOB%20${selectedJobForPay?.id}&accountName=QUAN%20TRI%20VIEN`}
              alt="VietQR"
              style={{ width: "100%", maxWidth: 250 }}
            />
          </div>
          <Title level={3} style={{ color: "#ff4d4f", margin: 0 }}>
            50.000 VNĐ
          </Title>
          <div
            style={{
              marginTop: 15,
              textAlign: "left",
              background: "#fafafa",
              padding: 12,
              borderRadius: 8,
            }}
          >
            <p style={{ margin: 0 }}>
              <InfoCircleOutlined /> <b>Nội dung:</b> PAY JOB{" "}
              {selectedJobForPay?.id}
            </p>
            <p style={{ margin: "5px 0 0 0" }}>
              <InfoCircleOutlined /> <b>Chủ tài khoản:</b> QUAN TRI VIEN
            </p>
          </div>
        </div>
      </Modal>

      <CreateJob
        isOpenCreateJob={isOpenCreateJob}
        setIsOpenCreateJob={setIsOpenCreateJob}
        skillData={skillData}
        companyData={companyData}
        fetchJobs={fetchJobs}
      />
      <UpdateJob
        isOpenUpdateJob={isOpenUpdateJob}
        setIsOpenUpdateJob={setIsOpenUpdateJob}
        dataUpdateJob={dataUpdateJob}
        companyData={companyData}
        skillData={skillData}
        fetchJobs={fetchJobs}
      />
    </div>
  );
};

export default ViewJob;
