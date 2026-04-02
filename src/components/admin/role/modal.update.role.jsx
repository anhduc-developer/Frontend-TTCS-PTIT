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
import { callPutRoleAPI } from "../../../services/api.service";

const { Panel } = Collapse;

const UpdateRole = (props) => {
  const {
    isOpenUpdate,
    setIsOpenUpdate,
    permissionData,
    fetchRoles,
    dataUpdateRole,
  } = props;
  const [form] = Form.useForm();

  // 1. Group permission theo module (Giữ nguyên logic của bạn)
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

  // 2. Fix quan trọng: Set dữ liệu vào Form
  useEffect(() => {
    if (dataUpdateRole && isOpenUpdate && permissionData?.length) {
      const permissionsObj = {};

      // Bước A: Đánh dấu các permission lẻ mà Role đang có
      dataUpdateRole.permissions?.forEach((p) => {
        permissionsObj[p.id] = true;
      });

      // Bước B: Kiểm tra xem Module đó có được "Check All" hay không
      groupedData.forEach((m) => {
        const allChecked = m.permissions.every((p) =>
          dataUpdateRole.permissions?.some((rp) => rp.id === p.id),
        );
        permissionsObj[m.module] = allChecked;
      });

      // Bước C: Đổ dữ liệu vào form
      form.setFieldsValue({
        name: dataUpdateRole.name,
        active: dataUpdateRole.active,
        description: dataUpdateRole.description,
        permissions: permissionsObj, // Đối tượng phẳng { id: true, MODULE: true }
      });
    }
  }, [dataUpdateRole, isOpenUpdate, permissionData, form]);

  const handleCancel = () => {
    setIsOpenUpdate(false);
    form.resetFields();
  };

  // 3. Xử lý bật/tắt toàn bộ module
  const handleSwitchAll = (checked, moduleName) => {
    const currentPermissions = form.getFieldValue("permissions") || {};
    const updatedPermissions = { ...currentPermissions };

    const moduleInfo = groupedData.find((m) => m.module === moduleName);
    if (moduleInfo) {
      moduleInfo.permissions.forEach((p) => {
        updatedPermissions[p.id] = checked;
      });
      updatedPermissions[moduleName] = checked;
    }

    form.setFieldsValue({ permissions: updatedPermissions });
  };

  // 4. Xử lý bật/tắt từng permission lẻ
  const handleSingle = (checked, id, moduleName) => {
    const currentPermissions = form.getFieldValue("permissions") || {};
    const updatedPermissions = { ...currentPermissions, [id]: checked };

    const moduleInfo = groupedData.find((m) => m.module === moduleName);
    if (moduleInfo) {
      const isAllChecked = moduleInfo.permissions.every(
        (p) => updatedPermissions[p.id],
      );
      updatedPermissions[moduleName] = isAllChecked;
    }

    form.setFieldsValue({ permissions: updatedPermissions });
  };

  const onFinish = async (values) => {
    // Chuyển đổi từ Object { id: true } sang Array [{ id: 1 }] để gửi lên server
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
      notification.success({ message: "Cập nhật Role thành công!" });
      handleCancel();
      fetchRoles();
    } else {
      notification.error({
        message: "Lỗi cập nhật",
        description: res.message || "Vui lòng thử lại",
      });
    }
  };

  return (
    <Modal
      title="Cập nhật Role"
      open={isOpenUpdate}
      onOk={() => form.submit()}
      onCancel={handleCancel}
      width={800}
      forceRender // Cực kỳ quan trọng để không mất data khi mở modal
      okText="Cập nhật"
      cancelText="Hủy"
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
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
                  <Col span={12} key={p.id}>
                    <Card size="small" hoverable>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 500 }}>{p.name}</div>
                          <div style={{ fontSize: 12, color: "#8c8c8c" }}>
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

export default UpdateRole;
