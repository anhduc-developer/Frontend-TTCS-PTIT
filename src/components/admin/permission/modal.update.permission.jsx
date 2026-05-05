import { Col, Form, Input, Modal, notification, Row, Select } from "antd";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { callPutPermissionAPI } from "../../../services/api.service";

const UpdatePermission = (props) => {
  const { t } = useTranslation();
  const {
    isOpenUpdate,
    setIsOpenUpdate,
    dataPermissionUpdate,
    fetchPermissions,
  } = props;

  const [form] = Form.useForm();

  // ✅ map data vào form
  useEffect(() => {
    if (dataPermissionUpdate && isOpenUpdate) {
      form.setFieldsValue({
        name: dataPermissionUpdate.name,
        method: dataPermissionUpdate.method,
        apiPath: dataPermissionUpdate.apiPath,
        module: dataPermissionUpdate.module,
      });
    }
  }, [dataPermissionUpdate, isOpenUpdate, form]);

  const handleCancel = () => {
    setIsOpenUpdate(false);
    form.resetFields();
  };

  const onFinish = async (values) => {
    try {
      const res = await callPutPermissionAPI({
        id: dataPermissionUpdate?.id,
        ...values,
      });

      if (res.data) {
        notification.success({
          message: t("permission.updateSuccess"),
        });

        handleCancel();
        fetchPermissions();
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
          ? "Permission already exists"
          : t("error.tryAgain"),
      });
    }
  };

  return (
    <Modal
      title={t("permission.updateTitle")}
      open={isOpenUpdate}
      onCancel={handleCancel}
      onOk={() => form.submit()}
      width={800}
      okText={t("common.edit")}
      cancelText={t("common.cancel")}
      forceRender
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        {/* ROW 1 */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={t("permission.permissionName")}
              name="name"
              rules={[{ required: true, message: t("validation.required") }]}
            >
              <Input placeholder={t("permission.permissionNamePlaceholder")} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label={t("permission.method")}
              name="method"
              rules={[{ required: true, message: t("validation.required") }]}
            >
              <Select
                placeholder={t("permission.methodPlaceholder")}
                options={[
                  { label: t("permission.methodGET"), value: "GET" },
                  { label: t("permission.methodPOST"), value: "POST" },
                  { label: t("permission.methodPUT"), value: "PUT" },
                  { label: t("permission.methodDELETE"), value: "DELETE" },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* ROW 2 */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={t("permission.apiPath")}
              name="apiPath"
              rules={[{ required: true, message: t("validation.required") }]}
            >
              <Input placeholder={t("permission.apiPathPlaceholder")} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label={t("permission.module")}
              name="module"
              rules={[{ required: true, message: t("validation.required") }]}
            >
              <Select
                placeholder={t("permission.modulePlaceholder")}
                options={[
                  { label: t("permission.moduleUSERS"), value: "USERS" },
                  { label: t("permission.moduleJOBS"), value: "JOBS" },
                  { label: t("permission.moduleSKILLS"), value: "SKILLS" },
                  {
                    label: t("permission.moduleCOMPANIES"),
                    value: "COMPANIES",
                  },
                  {
                    label: t("permission.modulePERMISSIONS"),
                    value: "PERMISSIONS",
                  },
                  { label: t("permission.moduleRESUMES"), value: "RESUMES" },
                  { label: t("permission.moduleFILES"), value: "FILES" },
                  { label: t("permission.moduleROLES"), value: "ROLES" },
                  {
                    label: t("permission.moduleSUBSCRIBERS"),
                    value: "SUBSCRIBERS",
                  }, // ✅ FIX
                  {
                    label: t("permission.moduleDASHBOARDS"),
                    value: "DASHBOARDS",
                  },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default UpdatePermission;
