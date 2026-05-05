import {
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Row,
  Col,
  DatePicker,
  Switch,
  notification,
} from "antd";
import { createJobAPI } from "../../../services/api.service";
import { useState, useContext } from "react"; // Thêm useContext
import ReactQuill from "react-quill-new";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../../context/auth.context"; // Import AuthContext

const { RangePicker } = DatePicker;

const CreateJob = (props) => {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext); // Lấy thông tin user (bao gồm role)

  const {
    isOpenCreateJob,
    setIsOpenCreateJob,
    skillData,
    companyData,
    fetchJobs,
  } = props;

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Kiểm tra xem user hiện tại có phải là HR hay không
  const isHR = user?.role?.name === "HR";

  const handleCancel = () => {
    setIsOpenCreateJob(false);
    form.resetFields();
  };

  const onFinish = async (values) => {
    setLoading(true);

    try {
      const [start, end] = values.timeRange || [];

      const data = {
        name: values.name,
        skills: values.skills.map((id) => ({ id })),
        location: values.location,
        salary: +values.salary,
        quantity: +values.quantity,
        level: values.level,
        company: { id: values.companyId },
        startDate: start?.toISOString(),
        endDate: end?.toISOString(),
        active: values.active,
        hot: values.hot,
        description: values.description,
        // Nếu là HR, ép kiểu mặc định là PENDING_APPROVAL cho dù form có gửi gì lên
        status: isHR ? "PENDING_APPROVAL" : values.status,
      };

      const res = await createJobAPI(data);

      if (res.data) {
        notification.success({
          message: t("job.createSuccess"),
        });
        fetchJobs();
        setIsOpenCreateJob(false);
        form.resetFields();
      } else {
        notification.error({
          message: t("job.createError"),
          description: res.message || t("error.checkData"),
        });
      }
    } catch (error) {
      notification.error({
        message: t("job.createError"),
        description: error.message,
      });
    }

    setLoading(false);
  };

  return (
    <Modal
      title={t("job.createTitle")}
      open={isOpenCreateJob}
      onCancel={handleCancel}
      width={1000}
      onOk={() => form.submit()}
      confirmLoading={loading}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
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
                placeholder={t("form.selectPlaceholder")}
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
                placeholder={t("job.locationPlaceholder")}
                options={[
                  { label: t("job.locationHN"), value: "HN" },
                  { label: t("job.locationHCM"), value: "HCM" },
                  { label: t("job.locationDN"), value: "DN" },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={10}>
            <Form.Item
              label={t("job.salary")}
              name="salary"
              rules={[{ required: true, message: t("validation.required") }]}
            >
              <InputNumber
                style={{ width: "100%" }}
                placeholder={t("job.salaryPlaceholder")}
              />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              label={t("job.quantity")}
              name="quantity"
              rules={[{ required: true, message: t("validation.required") }]}
            >
              <InputNumber
                style={{ width: "100%" }}
                placeholder={t("job.quantityPlaceholder")}
              />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item
              label={t("job.level")}
              name="level"
              rules={[{ required: true, message: t("validation.required") }]}
            >
              <Select
                placeholder={t("job.levelPlaceholder")}
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

        {/* ẨN STATUS NẾU LÀ HR */}
        {!isHR && (
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item
                label={t("job.status")}
                name="status"
                rules={[{ required: true, message: t("validation.required") }]}
                initialValue="PENDING_APPROVAL"
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
          </Row>
        )}

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={t("job.company")}
              name="companyId"
              rules={[{ required: true, message: t("validation.required") }]}
            >
              <Select
                placeholder={t("job.companyPlaceholder")}
                options={companyData.map((item) => ({
                  label: item.name,
                  value: item.id,
                }))}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label={t("job.startDate")}
              name="timeRange"
              rules={[{ required: true, message: t("validation.required") }]}
            >
              <RangePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={6}>
            <Form.Item
              label={t("job.active")}
              name="active"
              valuePropName="checked"
              initialValue={true}
            >
              <Switch />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item
              label={t("job.hot")}
              name="hot"
              valuePropName="checked"
              initialValue={false}
            >
              <Switch />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label={t("job.description")}
          name="description"
          valuePropName="value"
          getValueFromEvent={(content) => content}
        >
          <ReactQuill
            theme="snow"
            placeholder={t("job.descriptionPlaceholder")}
            style={{ height: "200px", marginBottom: "50px" }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateJob;
