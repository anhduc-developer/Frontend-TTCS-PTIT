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
import { useEffect, useState } from "react";
import ReactQuill from "react-quill-new";
import dayjs from "dayjs";
import { callPutJob } from "../../../services/api.service";
const UpdateJob = (props) => {
  const {
    isOpenUpdateJob,
    setIsOpenUpdateJob,
    dataUpdateJob,
    companyData,
    fetchJobs,
    skillData,
  } = props;

  // 1. CHUYỂN DESCRIPTION LÊN ĐẦU
  const [description, setDescription] = useState("");

  // XÓA ĐOẠN cleanDescription Ở ĐÂY (VÌ NÓ GÂY LỖI TRUY CẬP TRƯỚC KHI KHỞI TẠO)

  const skillIds = dataUpdateJob.skills?.map((skill) => skill.id) || [];
  const [form] = Form.useForm();

  const handleCancel = () => {
    setIsOpenUpdateJob(false);
    form.resetFields(); // Nên thêm để reset form
  };

  useEffect(() => {
    if (dataUpdateJob && isOpenUpdateJob) {
      form.setFieldsValue({
        ...dataUpdateJob,
        skills: skillIds,
        startDate: dataUpdateJob.startDate
          ? dayjs(dataUpdateJob.startDate)
          : null,
        endDate: dataUpdateJob.endDate ? dayjs(dataUpdateJob.endDate) : null,
        companyId: dataUpdateJob.company?.id,
      });

      setDescription(dataUpdateJob.description || "");
    }
  }, [dataUpdateJob, isOpenUpdateJob]);

  const onFinish = async (values) => {
    // 2. CHỈ XỬ LÝ CLEAN TẠI ĐÂY KHI BẤM SUBMIT
    const cleanDescription = description
      ? description.replace(/&nbsp;/g, " ")
      : "";
    const data = {
      id: dataUpdateJob.id,
      name: values.name,
      skills: values.skills.map((id) => ({ id })),
      location: values.location,
      salary: +values.salary,
      quantity: +values.quantity,
      level: values.level,
      company: { id: values.companyId },
      startDate: values.startDate,
      endDate: values.endDate,
      active: values.active,
      description: cleanDescription, // Gửi bản đã dọn dẹp
      hot: values.hot,
    };

    console.log(">>> Data gửi đi:", data);

    const res = await callPutJob(data);
    if (res.data) {
      notification.success({
        title: "Update Job Success!",
        description: "Cập nhật job thành công",
      });
      setIsOpenUpdateJob(false);
      fetchJobs();
    } else {
      notification.error({
        message: "Update Job Failed",
        description: JSON.stringify(res.message),
      });
    }
  };
  return (
    <Modal
      title="Tạo mới Job"
      open={isOpenUpdateJob}
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
        <Form.Item label="Miêu tả">
          <ReactQuill
            theme="snow"
            value={description}
            onChange={setDescription}
            style={{ height: "300px", marginBottom: "50px" }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default UpdateJob;
