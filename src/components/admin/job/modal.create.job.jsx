import {
  Button,
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
import { useState } from "react";
import ReactQuill from "react-quill-new";

const { RangePicker } = DatePicker;

const CreateJob = (props) => {
  const {
    isOpenCreateJob,
    setIsOpenCreateJob,
    skillData,
    companyData,
    fetchJobs,
  } = props;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const handleCancel = () => {
    setIsOpenCreateJob(false);
    form.resetFields();
  };

  const onFinish = async (values) => {
    setLoading(true);
    const data = {
      name: values.name,
      skills: values.skills.map((id) => ({ id })),
      location: values.location,
      salary: +values.salary,
      quantity: +values.quantity,
      level: values.level,
      company: {
        id: values.companyId,
      },
      startDate: values.startDate,
      endDate: values.endDate,
      active: values.active,
      description: values.description,
      hot: values.hot,
    };
    const res = await createJobAPI(data);
    if (res.data) {
      notification.success({
        title: "Create Job Success!",
        description: "Tạo mới Job thành công !",
      });
      fetchJobs();
      setIsOpenCreateJob(false);
      form.resetFields();
      setLoading(false);
    } else {
      notification.error({
        title: "Create Job Failed!",
        description: JSON.stringify(res.messsage),
      });
    }
  };

  return (
    <Modal
      title="Tạo mới Job"
      open={isOpenCreateJob}
      onCancel={handleCancel}
      width={1000}
      onOk={() => form.submit()}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        {/* ROW 1 */}
        <Row gutter={16}>
          <Col span={10}>
            <Form.Item label="Tên Job" name="name" rules={[{ required: true }]}>
              <Input placeholder="Nhập tên job" />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              label="Kỹ năng yêu cầu"
              name="skills"
              rules={[{ required: true }]}
            >
              <Select
                mode="multiple"
                placeholder="Please select a skill"
                options={skillData.map((item) => ({
                  label: item.name,
                  value: item.id,
                }))}
              />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item
              label="Địa điểm"
              name="location"
              rules={[{ required: true }]}
            >
              <Select
                placeholder="Chọn địa điểm"
                options={[
                  { label: "Hà Nội", value: "HN" },
                  { label: "Hồ Chí Minh", value: "HCM" },
                  { label: "Đà Nẵng", value: "DN" },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* ROW 2 */}
        <Row gutter={16}>
          <Col span={10}>
            <Form.Item
              label="Mức lương"
              name="salary"
              rules={[{ required: true }]}
            >
              <InputNumber
                style={{ width: "100%" }}
                placeholder="Nhập lương"
                addonAfter="đ"
              />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              label="Số lượng"
              name="quantity"
              rules={[{ required: true }]}
            >
              <InputNumber
                style={{ width: "100%" }}
                placeholder="Nhập số lượng"
              />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item
              label="Trình độ"
              name="level"
              rules={[{ required: true }]}
            >
              <Select
                placeholder="Please select a level"
                options={[
                  { label: "Intern", value: "INTERN" },
                  { label: "Junior", value: "JUNIOR" },
                  { label: "Senior", value: "SENIOR" },
                  { label: "Fresher", value: "FRESHER" },
                  { label: "Middle", value: "MIDDLE" },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* ROW 3 */}
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item
              label="Thuộc Công Ty"
              name="companyId"
              rules={[{ required: true }]}
            >
              <Select
                placeholder="Chọn công ty"
                options={companyData.map((item) => ({
                  label: item.name,
                  value: item.id,
                }))}
              />
            </Form.Item>
          </Col>

          <Col span={5}>
            <Form.Item
              label="Ngày bắt đầu"
              name="startDate"
              rules={[{ required: true }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          <Col span={5}>
            <Form.Item
              label="Ngày kết thúc"
              name="endDate"
              rules={[{ required: true }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          {/* Nút Trạng thái Active */}
          <Col span={4}>
            <Form.Item
              label="Trạng thái"
              name="active"
              valuePropName="checked"
              initialValue={true}
            >
              <Switch checkedChildren="ACTIVE" unCheckedChildren="INACTIVE" />
            </Form.Item>
          </Col>

          {/* MỚI: Nút Bật/Tắt HOT */}
          <Col span={4}>
            <Form.Item
              label="Tin Hot"
              name="hot"
              valuePropName="checked"
              initialValue={false}
            >
              <Switch
                checkedChildren="HOT"
                unCheckedChildren="NORMAL"
                style={{
                  backgroundColor: form.getFieldValue("hot") ? "#ff4d4f" : "",
                }} // Tùy chọn: Đổi màu đỏ khi bật
              />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item label="Miêu tả" name="description">
          <ReactQuill
            theme="snow"
            placeholder="Nhập nội dung miêu tả..."
            style={{ height: "200px", marginBottom: "50px" }} // Chừa chỗ cho toolbar phía dưới
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateJob;
