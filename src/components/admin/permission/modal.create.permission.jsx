import { Col, Form, Input, Modal, notification, Row, Select } from "antd";
import { createPermissionAPI } from "../../../services/api.service";

const CreatePermission = (props) => {
  const { isOpenCreate, setIsOpenCreate, fetchPermissions } = props;
  const [form] = Form.useForm();
  const onFinish = async (values) => {
    const data = {
      name: values.name,
      apiPath: values.apiPath,
      method: values.method,
      module: values.module,
    };
    const res = await createPermissionAPI(data);
    if (res.data) {
      notification.success({
        title: "Create Permission Success!",
        description: "Tạo Mới Permission Thành Công!",
      });
      setIsOpenCreate(false);
      fetchPermissions();
      form.resetFields();
    } else {
      notification.error({
        message: "Error Create Permission!",
        description: "Lỗi Tạo Mới Permission",
      });
    }
  };
  const handleCancel = () => {
    setIsOpenCreate(false);
    form.resetFields();
  };
  return (
    <Modal
      title="Tạo mới Job"
      open={isOpenCreate}
      onCancel={handleCancel}
      width={1000}
      onOk={() => form.submit()}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Tên Permission"
              name="name"
              rules={[{ required: true }]}
            >
              <Input placeholder="Nhập tên permisison" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Method"
              name="method"
              rules={[{ required: true }]}
            >
              <Select
                placeholder="Chọn method"
                options={[
                  { label: "GET", value: "GET" },
                  { label: "POST", value: "POST" },
                  { label: "PUT", value: "PUT" },
                  { label: "DELETE", value: "DELETE" },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="API Path"
              name="apiPath"
              rules={[{ required: true }]}
            >
              <Input style={{ width: "100%" }} placeholder="Nhập API Path" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Module"
              name="module"
              rules={[{ required: true }]}
            >
              <Select
                placeholder="Thuộc Module"
                options={[
                  { label: "USERS", value: "USERS" },
                  { label: "JOBS", value: "JOBS" },
                  { label: "COMPANIES", value: "COMPANIES" },
                  { label: "PERMISSIONS", value: "PERMISSIONS" },
                  { label: "SKILLS", value: "SKILLS" },
                  { label: "RESUMES", value: "RESUMES" },
                  { label: "FILES", value: "FILES" },
                  { label: "ROLES", value: "ROLES" },
                  { label: "SUBSCRIBERS", value: "SUBSCRIBER" },
                  { label: "DASHBOARDS", value: "DASHBOARDS" },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};
export default CreatePermission;
