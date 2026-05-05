import { Col, Form, Input, Modal, notification, Row } from "antd";
import { createSkill } from "../../../services/api.service";
import { useTranslation } from "react-i18next";

const CreateSkill = (props) => {
  const { t } = useTranslation();
  const { isOpenCreate, setIsOpenCreate, fetchSkills } = props;

  const [form] = Form.useForm();

  // ✅ đóng modal + reset form
  const handleCancel = () => {
    setIsOpenCreate(false);
    form.resetFields();
  };

  const onFinish = async (values) => {
    try {
      const res = await createSkill({
        name: values.name,
      });

      if (res.data) {
        notification.success({
          message: t("skill.createSuccess"),
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
      notification.error({
        message: t("message.error"),
        description: error.message,
      });
    }
  };

  return (
    <Modal
      title={t("skill.createTitle")}
      open={isOpenCreate}
      onOk={() => form.submit()}
      onCancel={handleCancel}
      width={600}
      okText={t("common.confirm")}
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

export default CreateSkill;
