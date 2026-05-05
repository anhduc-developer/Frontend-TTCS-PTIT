import {
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  notification,
  Row,
  Select,
  Switch,
} from "antd";
import { useEffect, useState, useContext } from "react"; // Thêm useContext
import { useTranslation } from "react-i18next";
import ReactQuill from "react-quill-new";
import dayjs from "dayjs";
import { callPutJob } from "../../../services/api.service";
import { AuthContext } from "../../context/auth.context"; // Import AuthContext

const UpdateJob = (props) => {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext); // Lấy thông tin user để check role
  const {
    isOpenUpdateJob,
    setIsOpenUpdateJob,
    dataUpdateJob,
    companyData,
    fetchJobs,
    skillData,
  } = props;

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Kiểm tra quyền HR
  const isHR = user?.role?.name === "HR";

  const handleCancel = () => {
    setIsOpenUpdateJob(false);
    form.resetFields();
  };

  useEffect(() => {
    if (dataUpdateJob && isOpenUpdateJob) {
      form.setFieldsValue({
        ...dataUpdateJob,
        skills: dataUpdateJob.skills?.map((s) => s.id),
        companyId: dataUpdateJob.company?.id,
        startDate: dataUpdateJob.startDate
          ? dayjs(dataUpdateJob.startDate)
          : null,
        endDate: dataUpdateJob.endDate ? dayjs(dataUpdateJob.endDate) : null,
        status: dataUpdateJob.status,
        description: dataUpdateJob.description || "",
      });
    }
  }, [dataUpdateJob, isOpenUpdateJob, form]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const data = {
        id: dataUpdateJob.id,
        name: values.name,
        skills: values.skills.map((id) => ({ id })),
        location: values.location,
        salary: +values.salary,
        quantity: +values.quantity,
        level: values.level,
        company: { id: values.companyId },
        startDate: values.startDate?.toISOString(),
        endDate: values.endDate?.toISOString(),
        active: values.active,
        hot: values.hot,
        description: values.description?.replace(/&nbsp;/g, " "),
        status: isHR ? "PENDING_APPROVAL" : values.status,
      };
      const res = await callPutJob(data);
      if (res.data) {
        notification.success({
          message: t("job.updateSuccess"),
        });
        setIsOpenUpdateJob(false);
        fetchJobs();
        form.resetFields();
      } else {
        notification.error({
          message: t("job.updateError"),
          description: res.message,
        });
      }
    } catch (error) {
      notification.error({
        message: t("job.updateError"),
        description: error.message,
      });
    }
    setLoading(false);
  };
  return (
    <Modal
      title={t("job.updateTitle")}
      open={isOpenUpdateJob}
      onCancel={handleCancel}
      width={1000}
      onOk={() => form.submit()}
      confirmLoading={loading}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        {/* ROW 1 */}
        <Row gutter={16}>
          <Col span={10}>
            <Form.Item
              label={t("job.jobName")}
              name="name"
              rules={[{ required: true, message: t("validation.required") }]}
            >
              <Input placeholder={t("job.jobNamePlaceholder")} />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              label={t("job.requiredSkills")}
              name="skills"
              rules={[{ required: true, message: t("validation.required") }]}
            >
              <Select
                mode="multiple"
                options={skillData.map((item) => ({
                  label: item.name,
                  value: item.id,
                }))}
              />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item
              label={t("job.location")}
              name="location"
              rules={[{ required: true, message: t("validation.required") }]}
            >
              <Select
                options={[
                  { label: t("job.locationHN"), value: "HN" },
                  { label: t("job.locationHCM"), value: "HCM" },
                  { label: t("job.locationDN"), value: "DN" },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* ROW 2 */}
        <Row gutter={16}>
          <Col span={10}>
            <Form.Item
              label={t("job.salary")}
              name="salary"
              rules={[{ required: true, message: t("validation.required") }]}
            >
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              label={t("job.quantity")}
              name="quantity"
              rules={[{ required: true, message: t("validation.required") }]}
            >
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item
              label={t("job.level")}
              name="level"
              rules={[{ required: true, message: t("validation.required") }]}
            >
              <Select
                options={[
                  { label: t("job.levelIntern"), value: "INTERN" },
                  { label: t("job.levelJunior"), value: "JUNIOR" },
                  { label: t("job.levelSenior"), value: "SENIOR" },
                  { label: t("job.levelFresher"), value: "FRESHER" },
                  { label: t("job.levelMiddle"), value: "MIDDLE" },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* ROW 3 */}
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item
              label={t("job.company")}
              name="companyId"
              rules={[{ required: true, message: t("validation.required") }]}
            >
              <Select
                options={companyData.map((item) => ({
                  label: item.name,
                  value: item.id,
                }))}
              />
            </Form.Item>
          </Col>

          <Col span={5}>
            <Form.Item
              label={t("job.startDate")}
              name="startDate"
              rules={[{ required: true, message: t("validation.required") }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          <Col span={5}>
            <Form.Item
              label={t("job.endDate")}
              name="endDate"
              rules={[{ required: true, message: t("validation.required") }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          {/* CHỈ ADMIN MỚI THẤY FIELD STATUS ĐỂ SỬA */}
          {!isHR && (
            <Col span={4}>
              <Form.Item
                label={t("job.status")}
                name="status"
                rules={[{ required: true }]}
              >
                <Select
                  placeholder={t("common.selectPlaceholder")}
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
          )}

          <Col span={2}>
            <Form.Item
              label={t("job.active")}
              name="active"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Col>

          <Col span={2}>
            <Form.Item label={t("job.hot")} name="hot" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Col>
        </Row>

        {/* DESCRIPTION */}
        <Form.Item
          label={t("job.description")}
          name="description"
          valuePropName="value"
          getValueFromEvent={(content) => content}
        >
          <ReactQuill theme="snow" style={{ height: 250, marginBottom: 50 }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateJob;
