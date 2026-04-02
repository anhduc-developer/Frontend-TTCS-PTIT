import React, { useState } from "react";
import {
  Modal,
  Form,
  Input,
  Row,
  Col,
  Switch,
  Collapse,
  Card,
  Tag,
  notification,
} from "antd";
import { createRoleAPI } from "../../../services/api.service";

const { Panel } = Collapse;

const CreateRole = (props) => {
  const { isOpenCreate, setIsOpenCreate, permissionData, fetchRoles } = props;
  const [form] = Form.useForm();

  const groupPermissions = (data = []) => {
    const result = [];
    data.forEach((item) => {
      const exists = result.find((x) => x.module === item.module);
      if (exists) {
        exists.permissions.push(item);
      } else {
        result.push({
          module: item.module,
          permissions: [item],
        });
      }
    });
    return result;
  };

  const groupedData = groupPermissions(permissionData);
  const handleSwitchAll = (checked, module) => {
    const current = form.getFieldValue("permissions") || {};
    const updated = { ...current };
    const moduleData = groupedData.find((m) => m.module === module);
    moduleData?.permissions.forEach((p) => {
      updated[p.id] = checked;
    });
    updated[module] = checked;
    form.setFieldsValue({ permissions: updated });
  };

  const handleSingle = (checked, id, module) => {
    const current = form.getFieldValue("permissions") || {};
    const updated = { ...current, [id]: checked };
    const moduleData = groupedData.find((m) => m.module === module);
    const allChecked = moduleData.permissions.every((p) => updated[p.id]);
    updated[module] = allChecked;
    form.setFieldsValue({ permissions: updated });
  };

  const onFinish = async (values) => {
    const selected = Object.keys(values.permissions || {})
      .filter((k) => values.permissions[k] === true && !isNaN(k))
      .map((id) => ({ id: Number(id) }));
    console.log({
      ...values,
      permissions: [1, 2, 3],
    });
    const data = {
      ...values,
      permissions: selected,
    };
    console.log(">>> check data", data);
    const res = await createRoleAPI(data);
    if (res.data) {
      notification.success({
        title: "Create a Role Success!",
        description: "Tạo mới Role thành công!",
      });
      setIsOpenCreate(false);
      form.resetFields();
      fetchRoles();
    } else {
      notification.error({
        message: "Error Create Role",
        description: JSON.stringify(res.message),
      });
    }
  };

  return (
    <Modal
      title="Tạo mới Role"
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
              label="Tên Role"
              rules={[{ required: true }]}
            >
              <Input placeholder="Nhập name" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="active" label="Trạng thái" valuePropName="checked">
              <Switch checkedChildren="ACTIVE" unCheckedChildren="INACTIVE" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              name="description"
              label="Miêu tả"
              rules={[{ required: true }]}
            >
              <Input.TextArea placeholder="Nhập miêu tả role" />
            </Form.Item>
          </Col>
        </Row>

        <p>
          <b>Quyền hạn</b>
        </p>

        <Collapse>
          {groupedData?.map((item) => (
            <Panel
              header={item.module}
              key={item.module}
              extra={
                <Form.Item
                  name={["permissions", item.module]}
                  valuePropName="checked"
                  noStyle
                >
                  <Switch
                    onClick={(e) => e.stopPropagation()}
                    onChange={(v) => handleSwitchAll(v, item.module)}
                  />
                </Form.Item>
              }
            >
              <Row gutter={[16, 16]}>
                {item.permissions?.map((p) => (
                  <Col span={12} key={p.id}>
                    <Card size="small">
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <div>
                          <div>{p.name}</div>
                          <div style={{ fontSize: 12 }}>
                            <Tag
                              color={
                                p.method === "POST"
                                  ? "green"
                                  : p.method === "PUT"
                                    ? "orange"
                                    : p.method === "DELETE"
                                      ? "red"
                                      : "blue"
                              }
                            >
                              {p.method}
                            </Tag>
                            {p.apiPath}
                          </div>
                        </div>

                        <Form.Item
                          name={["permissions", p.id]}
                          valuePropName="checked"
                          noStyle
                        >
                          <Switch
                            onChange={(v) => handleSingle(v, p.id, item.module)}
                          />
                        </Form.Item>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Panel>
          ))}
        </Collapse>
      </Form>
    </Modal>
  );
};

export default CreateRole;
