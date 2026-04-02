import { Col, Form, Input, Modal, notification, Row, Switch } from "antd";
import { createSkill } from "../../../services/api.service";

const CreateSkill = (props) => {
  const {
    isOpenCreate,
    setIsOpenCreate,
    fetchSkills,
    isOpenUpdate,
    setIsOpenUpdate,
    dataSkillUpdate,
  } = props;
  const [form] = Form.useForm();
  const onFinish = async (values) => {
    const res = await createSkill({
      name: values.name,
    });
    console.log(">>> check name", values.name);
    if (res.data) {
      notification.success({
        title: "Create a Skill Success!",
        description: "Tạo mới skill thành công",
      });
      fetchSkills();
      setIsOpenCreate(false);
      form.resetFields();
    } else {
      notification.error({
        message: "Error Create Skill",
        description: JSON.stringify(res.message),
      });
    }
  };
  return (
    <Modal
      title="Tạo mới Skill"
      open={isOpenCreate}
      onOk={() => form.submit()}
      onCancel={() => setIsOpenCreate(false)}
      width={800}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ isActive: true }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="name"
              label="Tên Skill"
              rules={[{ required: true }]}
            >
              <Input placeholder="Nhập name" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};
export default CreateSkill;
