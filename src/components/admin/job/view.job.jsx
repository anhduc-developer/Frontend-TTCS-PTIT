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
import { useTranslation } from "react-i18next";
import CreateJob from "./modal.create.job";
import { callDeleteJob, callPutJob } from "../../../services/api.service";
import UpdateJob from "./modal.update.job";
import { AuthContext } from "../../context/auth.context";

const { Text, Title } = Typography;

const ViewJob = (props) => {
  const { t } = useTranslation();
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
  const [isOpenCreateJob, setIsOpenCreateJob] = useState(false);
  const [isOpenUpdateJob, setIsOpenUpdateJob] = useState(false);
  const [dataUpdateJob, setDataUpdateJob] = useState({});
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [selectedJobForPay, setSelectedJobForPay] = useState(null);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const onFinish = (values) => {
    const { name, companyName, status } = values;
    console.log("Search values:", values); // Debug log to check form values
    let queryParts = [];
    if (name) queryParts.push(`name~'${name}'`);
    if (companyName) queryParts.push(`company.name~'${companyName}'`);
    if (status) queryParts.push(`status='${status}'`);

    const filter = queryParts.join(" AND ");
    fetchJobs({ page: 1, size, ...(filter && { filter }) });
  };
  const handleReset = () => {
    form.resetFields();
    fetchJobs({ page: 1, size });
  };
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
        message: t("message.success"),
        description: t("job.updateSuccess"),
      });
      setIsQRModalOpen(false);
      fetchJobs({ page, size });
    }
    setLoadingPayment(false);
  };

  const handleApproveJob = (record, newStatus) => {
    const isApprove = newStatus === "APPROVED";
    Modal.confirm({
      title: isApprove ? t("job.approve") : t("job.reject"),
      content: `${t("common.confirm")} ${t("message.updateStatus")}: ${record.name}?`,
      okText: t("common.confirm"),
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
          notification.success({ message: t("message.updateSuccess") });
          fetchJobs({ page, size });
        }
      },
    });
  };

  const handleDeleteJob = async (record) => {
    const res = await callDeleteJob(record.id);
    if (res.data) {
      notification.success({ message: t("job.deleteSuccess") });
      fetchJobs({ page, size });
    }
  };

  const columns = [
    {
      title: t("common.stt"),
      width: 60,
      align: "center",
      render: (_, __, index) => (page - 1) * size + index + 1,
    },
    {
      title: t("job.jobName"),
      dataIndex: "name",
      width: 200,
      ellipsis: true,
      render: (t) => <Text strong>{t}</Text>,
    },
    {
      title: t("common.companyName"),
      render: (_, r) => r?.company?.name || "-",
    },
    {
      title: t("common.price"),
      width: 120,
      render: () => <Text type="danger">50.000 đ</Text>,
    },
    {
      title: t("common.status"),
      dataIndex: "status",
      width: 150,
      render: (status) => {
        const configs = {
          PENDING_PAYMENT: {
            color: "warning",
            text: t("job.statusPendingPayment"),
          },
          PENDING_APPROVAL: {
            color: "processing",
            text: t("job.statusPendingApproval"),
          },
          APPROVED: { color: "success", text: t("job.statusApproved") },
          REJECTED: { color: "error", text: t("job.statusRejected") },
        };
        const config = configs[status] || { color: "default", text: status };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: t("common.actions"),
      key: "action",
      width: 170,
      fixed: "right",
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          {record.status === "PENDING_PAYMENT" && (
            <Tooltip title={t("job.paymentQR")}>
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
                  title={t("job.approve")}
                  style={{ color: "#52c41a", fontSize: 18, cursor: "pointer" }}
                  onClick={() => handleApproveJob(record, "APPROVED")}
                />
                <CloseCircleOutlined
                  title={t("job.reject")}
                  style={{ color: "#ff4d4f", fontSize: 18, cursor: "pointer" }}
                  onClick={() => handleApproveJob(record, "REJECTED")}
                />
              </>
            )}

          <EditOutlined
            title={t("common.edit")}
            style={{ color: "#1890ff", fontSize: 18, cursor: "pointer" }}
            onClick={() => {
              setDataUpdateJob(record);
              setIsOpenUpdateJob(true);
            }}
          />

          <Popconfirm
            title={t("job.deleteConfirm")}
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
              <Form.Item name="name" label={t("job.jobName")}>
                <Input
                  placeholder={t("job.searchByName")}
                  allowClear
                  prefix={<SearchOutlined />}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={7}>
              <Form.Item name="companyName" label={t("common.companyName")}>
                <Input placeholder={t("job.searchByCompany")} allowClear />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item name="status" label={t("common.status")}>
                <Select
                  placeholder={t("job.filterByStatus")}
                  allowClear
                  options={[
                    {
                      label: t("job.statusPendingPayment"),
                      value: "PENDING_PAYMENT",
                    },
                    {
                      label: t("job.statusPendingApproval"),
                      value: "PENDING_APPROVAL",
                    },
                    { label: t("job.statusApproved"), value: "APPROVED" },
                    { label: t("job.statusRejected"), value: "REJECTED" },
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
                  {t("common.filter")}
                </Button>
                <Button onClick={handleReset}>{t("common.reset")}</Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>

      {/* Table Section */}
      <Card
        title={
          <Title level={4} style={{ margin: 0 }}>
            {t("header.allJobs")}
          </Title>
        }
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsOpenCreateJob(true)}
          >
            {t("job.createTitle")}
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
            total: total,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50"],
            onChange: (p, s) => fetchJobs({ page: p, size: s }),
            showTotal: (total) =>
              `${t("common.total")} ${total} ${t("common.results")}`,
          }}
        />
      </Card>

      {/* MODAL THANH TOÁN QR */}
      <Modal
        title={t("job.paymentTitle")}
        open={isQRModalOpen}
        onCancel={() => setIsQRModalOpen(false)}
        footer={[
          <Button key="back" onClick={() => setIsQRModalOpen(false)}>
            {t("common.cancel")}
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loadingPayment}
            onClick={handleConfirmPayment}
          >
            {t("job.confirmPayment")}
          </Button>,
        ]}
        width={400}
        centered
      >
        <div style={{ textAlign: "center" }}>
          <Text type="secondary">{t("job.paymentQRHint")}</Text>
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
              <InfoCircleOutlined /> <b>{t("job.paymentContent")}:</b> PAY JOB{" "}
              {selectedJobForPay?.id}
            </p>
            <p style={{ margin: "5px 0 0 0" }}>
              <InfoCircleOutlined /> <b>{t("job.accountOwner")}:</b> QUAN TRI
              VIEN
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
