import React, { lazy } from "react";
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
} from "antd";
import { createUserAPI } from "../../../services/api.service";

const ModalUser = (props) => {
  const {
    isOpenCreateUser,
    setIsOpenCreateUser,
    roleData,
    companyData,
    fetchUsers,
    page,
    size,
  } = props;
  const [form] = Form.useForm();
  const handleOk = () => {
    form.submit();
    setIsOpenCreateUser(false);
  };
  const handleCancel = () => {
    setIsOpenCreateUser(false);
    form.resetFields();
  };
  const onFinish = async (values) => {
    const user = {
      name: values.name,
      email: values.email,
      age: values.age,
      password: values.password,
      gender: values.gender,
      address: values.address,
      role: {
        id: +values.role,
      },
      company: {
        id: +values.company,
      },
    };
    console.log(">> check 2", user.name);
    const res = await createUserAPI(user);
    if (res.data) {
      notification.success({
        message: "Create User Success!",
        description: "Tạo mới người dùng thành công!",
      });
      setIsOpenCreateUser(false);
      form.resetFields();
      fetchUsers({
        page: page,
        size: size,
        params: {},
      });
    } else {
      notification.error({
        message: "Create User Error!",
        description: JSON.stringify(res.message),
      });
    }
  };
  return (
    <Modal
      title="Tạo mới User"
      open={isOpenCreateUser}
      onOk={handleOk}
      onCancel={handleCancel}
      width={800}
      footer={[
        <Button type="primary" onClick={() => form.submit()} key="submit">
          Create
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
      >
        {/* Hàng 1: Email và Password */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: "Vui lòng nhập email!" }]}
            >
              <Input placeholder="Nhập email" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: "Vui lòng nhập password!" }]}
            >
              <Input.Password placeholder="Nhập password" />
            </Form.Item>
          </Col>
        </Row>

        {/* Hàng 2: Tên hiển thị, Tuổi, Giới tính, Vai trò */}
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item
              label="Tên hiển thị"
              name="name"
              rules={[{ required: true }]}
            >
              <Input placeholder="Nhập tên hiển thị" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="Tuổi"
              name="age"
              rules={[{ required: true, message: "Vui lòng nhập tuổi" }]}
            >
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
              rules={[{ required: true, message: "Vui lòng chọn giới tính" }]}
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
            <Form.Item
              label="Vai trò"
              name="role"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn vai trò cho người dùng",
                },
              ]}
            >
              <Select
                placeholder="Chọn vai trò"
                options={roleData.map((item) => ({
                  label: item.name,
                  value: item.id,
                }))}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Hàng 3: Thuộc công ty và Địa chỉ */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Thuộc Công Ty"
              name="company"
              rules={[{ required: false }]}
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

export default ModalUser;
