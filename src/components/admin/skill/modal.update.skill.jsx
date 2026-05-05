import { Col, Form, Input, Modal, notification, Row } from "antd";
import { callPutSkill } from "../../../services/api.service";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const UpdateSkill = (props) => {
  const { t } = useTranslation();
  const { fetchSkills, isOpenUpdate, setIsOpenUpdate, dataSkillUpdate } = props;

  const [form] = Form.useForm();

  // ✅ map data vào form
  useEffect(() => {
    if (dataSkillUpdate && isOpenUpdate) {
      form.setFieldsValue({
        name: dataSkillUpdate.name,
      });
    }
  }, [dataSkillUpdate, isOpenUpdate, form]);

  const handleCancel = () => {
    setIsOpenUpdate(false);
    form.resetFields();
  };

  const onFinish = async (values) => {
    try {
      const res = await callPutSkill({
        id: dataSkillUpdate.id,
        name: values.name,
      });

      if (res.data) {
        notification.success({
          message: t("skill.updateSuccess"),
        });

        fetchSkills();
        handleCancel();
      } else {
        notification.error({
          message: t("message.error"),
          description: res.message || t("error.checkData"),
        });
      }
    } catch (error) {
      const msg = error?.response?.data?.message || error?.message || "";

      const isDuplicate =
        msg.toLowerCase().includes("duplicate") ||
        msg.toLowerCase().includes("exists") ||
        msg.toLowerCase().includes("constraint");

      notification.error({
        message: t("message.error"),
        description: isDuplicate
          ? t("skill.alreadyExists")
          : t("error.tryAgain"),
      });
    }
  };

  return (
    <Modal
      title={t("skill.updateTitle")}
      open={isOpenUpdate}
      onOk={() => form.submit()}
      onCancel={handleCancel}
      width={600}
      okText={t("common.edit")}
      cancelText={t("common.cancel")}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="name"
              label={t("skill.skillName")}
              rules={[{ required: true, message: t("validation.required") }]}
            >
              <Input placeholder={t("skill.skillNamePlaceholder")} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default UpdateSkill;
