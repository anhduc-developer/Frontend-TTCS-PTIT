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
import { useTranslation } from "react-i18next";
import { createUserAPI } from "../../../services/api.service";

const ModalUser = (props) => {
  const { t } = useTranslation();
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
        message: t('message.success', 'Create User Success!'),
        description: t('message.createSuccess', 'Tạo mới người dùng thành công!'),
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
        message: t('message.error', 'Create User Error!'),
        description: JSON.stringify(res.message),
      });
    }
  };
  return (
    <Modal
      title={t('user.createTitle', 'Tạo mới User')}
      open={isOpenCreateUser}
      onOk={handleOk}
      onCancel={handleCancel}
      width={800}
      footer={[
        <Button type="primary" onClick={() => form.submit()} key="submit">
          {t('common.confirm', 'Create')}
        </Button>,
        <Button onClick={handleCancel} key="back">
          {t('common.cancel', 'Cancel')}
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
              label={t('user.userEmail', 'Email')}
              name="email"
              rules={[{ required: true, message: t('validation.pleaseEnterEmail', 'Vui lòng nhập email!') }]}
            >
              <Input placeholder={t('user.userEmailPlaceholder', 'Nhập email')} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('user.userPassword', 'Password')}
              name="password"
              rules={[{ required: true, message: t('validation.pleaseEnterPassword', 'Vui lòng nhập password!') }]}
            >
              <Input.Password placeholder={t('user.userPasswordPlaceholder', 'Nhập password')} />
            </Form.Item>
          </Col>
        </Row>

        {/* Hàng 2: Tên hiển thị, Tuổi, Giới tính, Vai trò */}
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item
              label={t('user.userName', 'Tên hiển thị')}
              name="name"
              rules={[{ required: true, message: t('validation.pleaseEnterName', 'Vui lòng nhập tên!') }]}
            >
              <Input placeholder={t('user.userNamePlaceholder', 'Nhập tên hiển thị')} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label={t('user.userAge', 'Tuổi')}
              name="age"
              rules={[{ required: true, message: t('validation.pleaseEnterAge', 'Vui lòng nhập tuổi') }]}
            >
              <InputNumber
                style={{ width: "100%" }}
                placeholder={t('user.userAgePlaceholder', 'Nhập tuổi')}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label={t('user.userGender', 'Giới Tính')}
              name="gender"
              rules={[{ required: true, message: t('validation.pleaseSelectGender', 'Vui lòng chọn giới tính') }]}
            >
              <Select
                placeholder={t('common.selectPlaceholder', 'Chọn giới tính')}
                options={[
                  { label: t('user.genderMale', 'Nam'), value: "MALE" },
                  { label: t('user.genderFemale', 'Nữ'), value: "FEMALE" },
                  { label: t('user.genderOther', 'Khác'), value: "OTHER" },
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label={t('user.userRole', 'Vai trò')}
              name="role"
              rules={[
                {
                  required: true,
                  message: t('validation.pleaseSelectRole', 'Vui lòng chọn vai trò cho người dùng'),
                },
              ]}
            >
              <Select
                placeholder={t('common.selectPlaceholder', 'Chọn vai trò')}
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
              label={t('user.company', 'Thuộc Công Ty')}
              name="company"
              rules={[{ required: false }]}
            >
              <Select
                placeholder={t('common.selectPlaceholder', 'Chọn công ty')}
                options={companyData.map((item) => ({
                  label: item.name,
                  value: item.id,
                }))}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('user.userAddress', 'Địa chỉ')}
              name="address"
              rules={[{ required: false }]}
            >
              <Input placeholder={t('user.userAddressPlaceholder', 'Nhập địa chỉ')} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default ModalUser;
