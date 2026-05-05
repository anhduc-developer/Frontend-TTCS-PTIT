import React, { useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Row,
  Col,
  Switch,
  Collapse,
  Tag,
  notification,
  Card,
} from "antd";
import { useTranslation } from "react-i18next";
import { callPutRoleAPI } from "../../../services/api.service";

const { Panel } = Collapse;

const UpdateRole = (props) => {
  const { t } = useTranslation();
  const {
    isOpenUpdate,
    setIsOpenUpdate,
    permissionData,
    fetchRoles,
    dataUpdateRole,
  } = props;

  const [form] = Form.useForm();

  // Group permission theo module
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

  // Set data vào form
  useEffect(() => {
    if (dataUpdateRole && isOpenUpdate && permissionData?.length) {
      const permissionsObj = {};

      dataUpdateRole.permissions?.forEach((p) => {
        permissionsObj[p.id] = true;
      });

      groupedData.forEach((m) => {
        const allChecked = m.permissions.every((p) =>
          dataUpdateRole.permissions?.some((rp) => rp.id === p.id),
        );
        permissionsObj[m.module] = allChecked;
      });

      form.setFieldsValue({
        name: dataUpdateRole.name,
        active: dataUpdateRole.active,
        description: dataUpdateRole.description,
        permissions: permissionsObj,
      });
    }
  }, [dataUpdateRole, isOpenUpdate, permissionData, form]);

  const handleCancel = () => {
    setIsOpenUpdate(false);
    form.resetFields();
  };

  // Switch all
  const handleSwitchAll = (checked, moduleName) => {
    const current = form.getFieldValue("permissions") || {};
    const updated = { ...current };

    const moduleInfo = groupedData.find((m) => m.module === moduleName);
    if (moduleInfo) {
      moduleInfo.permissions.forEach((p) => {
        updated[p.id] = checked;
      });
      updated[moduleName] = checked;
    }

    form.setFieldsValue({ permissions: updated });
  };

  // Switch single
  const handleSingle = (checked, id, moduleName) => {
    const current = form.getFieldValue("permissions") || {};
    const updated = { ...current, [id]: checked };

    const moduleInfo = groupedData.find((m) => m.module === moduleName);
    if (moduleInfo) {
      const isAllChecked = moduleInfo.permissions.every((p) => updated[p.id]);
      updated[moduleName] = isAllChecked;
    }

    form.setFieldsValue({ permissions: updated });
  };

  const onFinish = async (values) => {
    try {
      const selectedPermissions = Object.keys(values.permissions || {})
        .filter((key) => !isNaN(key) && values.permissions[key] === true)
        .map((id) => ({ id: Number(id) }));

      const data = {
        id: dataUpdateRole.id,
        name: values.name,
        active: values.active,
        description: values.description,
        permissions: selectedPermissions,
      };

      const res = await callPutRoleAPI(data);

      if (res.data) {
        notification.success({
          message: t("role.updateSuccess"),
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
      title={t("role.updateTitle")}
      open={isOpenUpdate}
      onOk={() => form.submit()}
      onCancel={handleCancel}
      width={1000}
      okText={t("common.edit")}
      cancelText={t("common.cancel")}
      forceRender
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

        <Collapse ghost>
          {groupedData?.map((item) => (
            <Panel
              header={<span style={{ fontWeight: 500 }}>{item.module}</span>}
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

export default UpdateRole;
