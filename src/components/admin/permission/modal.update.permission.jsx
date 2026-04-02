import { Col, Form, Input, Modal, notification, Row, Select } from "antd";
import { useEffect } from "react";
import { callPutPermissionAPI } from "../../../services/api.service";

const UpdatePermisison = (props) => {
  const {
    isOpenUpdate,
    setIsOpenUpdate,
    dataPermissionUpdate,
    fetchPermissions,
  } = props;
  const [form] = Form.useForm();

  // Reset và set lại dữ liệu mỗi khi dataPermissionUpdate thay đổi
  useEffect(() => {
    if (dataPermissionUpdate && isOpenUpdate) {
      form.setFieldsValue({
        name: dataPermissionUpdate.name,
        method: dataPermissionUpdate.method,
        apiPath: dataPermissionUpdate.apiPath,
        module: dataPermissionUpdate.module,
      });
    }
  }, [dataPermissionUpdate, isOpenUpdate, form]);

  const onFinish = async (values) => {
    const data = {
      id: dataPermissionUpdate?.id, // Đảm bảo lấy đúng ID
      ...values,
    };
    const res = await callPutPermissionAPI(data);
    if (res.data) {
      notification.success({
        message: "Cập nhật thành công",
        description: "Thông tin Permission đã được thay đổi.",
      });
      handleCancel(); // Dùng hàm cancel chung để reset form
      fetchPermissions({});
    } else {
      notification.error({
        message: "Lỗi cập nhật",
        description: res.message || "Vui lòng kiểm tra lại dữ liệu",
      });
    }
  };

  const handleCancel = () => {
    setIsOpenUpdate(false);
    form.resetFields(); // Quan trọng: Reset để lần mở sau không bị dính data cũ của record trước
  };

  return (
    <Modal
      title="Cập nhật Permission" // Sửa lại tiêu đề cho đúng
      open={isOpenUpdate}
      onCancel={handleCancel}
      width={800}
      onOk={() => form.submit()}
      okText="Cập nhật"
      cancelText="Hủy"
      forceRender // Ép Ant Design render form ngay cả khi modal chưa mở để tránh mất data
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Tên Permission"
              name="name"
              rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
            >
              <Input placeholder="Nhập tên permisison" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Method"
              name="method"
              rules={[{ required: true, message: "Vui lòng chọn method!" }]}
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
              rules={[{ required: true, message: "Vui lòng nhập API Path!" }]}
            >
              <Input placeholder="Nhập API Path" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Module"
              name="module"
              rules={[{ required: true, message: "Vui lòng chọn Module!" }]}
            >
              <Select
                placeholder="Thuộc Module"
                options={[
                  { label: "USERS", value: "USERS" },
                  { label: "JOBS", value: "JOBS" },
                  { label: "SKILLS", value: "SKILLS" },
                  { label: "COMPANIES", value: "COMPANIES" },
                  { label: "PERMISSIONS", value: "PERMISSIONS" },
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

export default UpdatePermisison;
