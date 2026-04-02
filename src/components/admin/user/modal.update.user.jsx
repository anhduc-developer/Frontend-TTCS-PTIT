import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Row,
  Col,
  notification,
  message,
} from "antd";
import { callPutUser } from "../../../services/api.service";
import { useEffect, useEffectEvent } from "react";
const UpdateUser = (props) => {
  const {
    isOpenUpdateUser,
    setIsOpenUpdateUser,
    roleData,
    companyData,
    updateUserData,
    fetchUsers,
  } = props;
  const [form] = Form.useForm();
  useEffect(() => {
    if (updateUserData && isOpenUpdateUser) {
      form.setFieldsValue(updateUserData);
    }
  }, [updateUserData, isOpenUpdateUser, form]);
  const handleOk = () => {};
  const handleCancel = () => {
    setIsOpenUpdateUser(false);
    form.resetFields();
  };
  const onFinish = async (values) => {
    let data = {
      id: updateUserData.id,
      address: values.address,
      name: values.name,
      age: values.age,
      role: values.role?.id ? { id: values.role.id } : null,
      company: values.company?.id ? { id: values.company.id } : null,
      gender: values.gender,
    };
    if (values.password && values.password.trim() !== "") {
      data.password = values.password;
    }
    const res = await callPutUser(data);
    if (res.data) {
      notification.success({
        message: "Update User Success!",
        description: "Cập nhật người dùng thành công!",
      });
      setIsOpenUpdateUser(false);
      form.resetFields();
      fetchUsers();
    } else {
      notification.error({
        message: "Update User Failed",
        description: JSON.stringify(res.message),
      });
    }
  };

  return (
    <Modal
      title="CẬP NHẬT USER"
      open={isOpenUpdateUser}
      onOk={handleOk}
      onCancel={handleCancel}
      width={800}
      footer={[
        <Button type="primary" onClick={() => form.submit()} key="submit">
          Update
        </Button>,
        <Button onClick={handleCancel} key="back">
          Cancel
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical" // Đưa Label lên trên Input
        style={{ marginTop: "20px" }}
        onFinish={onFinish}
        initialValues={updateUserData}
      >
        {/* Hàng 1: Email và Password */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: false, message: "Vui lòng nhập email!" }]}
            >
              <Input placeholder="Nhập email" disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: false, message: "Vui lòng nhập password!" }]}
            >
              <Input.Password placeholder="Nhập password để thay đổi, còn không thì thôi" />
            </Form.Item>
          </Col>
        </Row>

        {/* Hàng 2: Tên hiển thị, Tuổi, Giới tính, Vai trò */}
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item
              label="Tên hiển thị"
              name="name"
              rules={[{ required: false }]}
            >
              <Input placeholder="Nhập tên hiển thị" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Tuổi" name="age" rules={[{ required: false }]}>
              <InputNumber
                style={{ width: "100%" }}
                placeholder="Nhập nhập tuổi"
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="Giới Tính"
              name="gender"
              rules={[{ required: false }]}
            >
              <Select
                placeholder="Chọn giới tính"
                options={[
                  { label: "Nam", value: "MALE" },
                  { label: "Nữ", value: "FEMALE" },
                  { label: "Khác", value: "OTHER" },
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Vai trò" name={["role", "id"]}>
              <Select
                options={roleData}
                fieldNames={{ label: "name", value: "id" }}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Hàng 3: Thuộc công ty và Địa chỉ */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Thuộc Công Ty"
              name={["company", "id"]}
              rules={[{ required: false }]}
            >
              <Select
                allowClear
                placeholder="Chọn công ty"
                options={companyData}
                fieldNames={{ label: "name", value: "id" }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Địa chỉ"
              name="address"
              rules={[{ required: false }]}
            >
              <Input placeholder="Nhập địa chỉ" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};
export default UpdateUser;
