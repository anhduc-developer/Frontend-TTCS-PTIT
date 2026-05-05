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
import { callPutUser } from "../../../services/api.service";
import { useEffect } from "react";

const UpdateUser = (props) => {
  const { t } = useTranslation();
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
      form.setFieldsValue({
        ...updateUserData,
        role: updateUserData?.role?.id,
        company: updateUserData?.company?.id,
      });
    }
  }, [updateUserData, isOpenUpdateUser, form]);

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
      role: values.role ? { id: values.role } : null,
      company: values.company ? { id: values.company } : null,
      gender: values.gender,
    };

    if (values.password && values.password.trim() !== "") {
      data.password = values.password;
    }

    const res = await callPutUser(data);

    if (res.data) {
      notification.success({
        message: t("message.success"),
        description: t("user.updateSuccess"),
      });

      setIsOpenUpdateUser(false);
      form.resetFields();
      fetchUsers();
    } else {
      notification.error({
        message: t("message.error"),
        description: res.message,
      });
    }
  };

  return (
    <Modal
      title={t("user.updateTitle")}
      open={isOpenUpdateUser}
      onCancel={handleCancel}
      width={800}
      footer={[
        <Button type="primary" onClick={() => form.submit()} key="submit">
          {t("common.edit")}
        </Button>,
        <Button onClick={handleCancel} key="back">
          {t("common.cancel")}
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        style={{ marginTop: "20px" }}
        onFinish={onFinish}
      >
        {/* Email + Password */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label={t("user.userEmail")} name="email">
              <Input placeholder={t("user.userEmailPlaceholder")} disabled />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label={t("user.userPassword")} name="password">
              <Input.Password placeholder={t("user.userPasswordPlaceholder")} />
            </Form.Item>
          </Col>
        </Row>

        {/* Name + Age + Gender + Role */}
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item label={t("user.userName")} name="name">
              <Input placeholder={t("user.userNamePlaceholder")} />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item label={t("user.userAge")} name="age">
              <InputNumber
                style={{ width: "100%" }}
                placeholder={t("user.userAgePlaceholder")}
              />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item label={t("user.userGender")} name="gender">
              <Select
                placeholder={t("form.selectPlaceholder")}
                options={[
                  { label: t("user.genderMale"), value: "MALE" },
                  { label: t("user.genderFemale"), value: "FEMALE" },
                  { label: t("user.genderOther"), value: "OTHER" },
                ]}
              />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item label={t("user.userRole")} name="role">
              <Select
                options={roleData}
                fieldNames={{ label: "name", value: "id" }}
                placeholder={t("form.selectPlaceholder")}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Company + Address */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label={t("common.companyName")} name="company">
              <Select
                allowClear
                placeholder={t("form.selectPlaceholder")}
                options={companyData}
                fieldNames={{ label: "name", value: "id" }}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label={t("user.userAddress")} name="address">
              <Input placeholder={t("user.userAddressPlaceholder")} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default UpdateUser;
