import React from "react";
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
import { useTranslation } from "react-i18next";
import { createRoleAPI } from "../../../services/api.service";

const { Panel } = Collapse;

const CreateRole = (props) => {
  const { t } = useTranslation();
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

  const handleCancel = () => {
    setIsOpenCreate(false);
    form.resetFields();
  };

  const onFinish = async (values) => {
    try {
      const selected = Object.keys(values.permissions || {})
        .filter((k) => values.permissions[k] === true && !isNaN(k))
        .map((id) => ({ id: Number(id) }));

      const data = {
        ...values,
        permissions: selected,
      };

      const res = await createRoleAPI(data);

      if (res.data) {
        notification.success({
          message: t("role.createSuccess"),
        });

        handleCancel();
        fetchRoles();
      } else {
        notification.error({
          message: t("message.error"),
          description: res.message || t("error.checkData"),
        });
      }
    } catch (error) {
      notification.error({
        message: t("message.error"),
        description: t("error.tryAgain"),
      });
    }
  };

  return (
    <Modal
      title={t("role.createTitle")}
      open={isOpenCreate}
      onOk={() => form.submit()}
      onCancel={handleCancel}
      width={1000}
      okText={t("common.confirm")}
      cancelText={t("common.cancel")}
      bodyStyle={{ maxHeight: "70vh", overflow: "auto" }}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="name"
              label={t("role.roleName")}
              rules={[{ required: true, message: t("validation.required") }]}
            >
              <Input placeholder={t("role.roleNamePlaceholder")} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="active"
              label={t("common.status")}
              valuePropName="checked"
            >
              <Switch
                checkedChildren={t("common.active")}
                unCheckedChildren={t("common.inactive")}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              name="description"
              label={t("common.description")}
              rules={[{ required: true, message: t("validation.required") }]}
            >
              <Input.TextArea placeholder={t("role.descriptionPlaceholder")} />
            </Form.Item>
          </Col>
        </Row>

        <p>
          <b>{t("role.permissions")}</b>
        </p>

        <Collapse bordered={false}>
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
                  <Col xs={24} md={12} key={p.id}>
                    <Card size="small">
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: 12,
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 500 }}>{p.name}</div>

                          <div style={{ fontSize: 12, color: "#888" }}>
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

                            <span style={{ marginLeft: 8 }}>{p.apiPath}</span>
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
