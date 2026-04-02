import { Col, Form, Input, Modal, notification, Row, Switch } from "antd";
import { callPutSkill, createSkill } from "../../../services/api.service";
import { useEffect } from "react";

const UpdateSkill = (props) => {
  const { fetchSkills, isOpenUpdate, setIsOpenUpdate, dataSkillUpdate } = props;
  const [form] = Form.useForm();
  useEffect(() => {
    if (dataSkillUpdate && isOpenUpdate) {
      form.setFieldsValue(dataSkillUpdate);
    }
  }, [dataSkillUpdate, isOpenUpdate, form]);
  const onFinish = async (values) => {
    const res = await callPutSkill({
      id: dataSkillUpdate.id,
      ...dataSkillUpdate,
      name: values.name,
    });
    if (res.data) {
      notification.success({
        title: "Update a Skill Success!",
        description: "Cập nhật skill thành công",
      });
      fetchSkills();
      setIsOpenUpdate(false);
      form.resetFields();
    } else {
      notification.error({
        message: "Error Update Skill",
        description: JSON.stringify(res.message),
      });
    }
  };

  return (
    <Modal
      title="Cập nhật Skill"
      open={isOpenUpdate}
      onOk={() => form.submit()}
      onCancel={() => setIsOpenUpdate(false)}
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
export default UpdateSkill;
