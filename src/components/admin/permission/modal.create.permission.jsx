import { Col, Form, Input, Modal, notification, Row, Select } from "antd";
import { createPermissionAPI } from "../../../services/api.service";
import { useTranslation } from "react-i18next";

const CreatePermission = (props) => {
  const { t } = useTranslation();
  const { isOpenCreate, setIsOpenCreate, fetchPermissions } = props;

  const [form] = Form.useForm();

  const handleCancel = () => {
    setIsOpenCreate(false);
    form.resetFields();
  };

  const onFinish = async (values) => {
    try {
      const data = {
        name: values.name,
        apiPath: values.apiPath,
        method: values.method,
        module: values.module,
      };

      const res = await createPermissionAPI(data);

      if (res.data) {
        notification.success({
          message: t("permission.createSuccess"),
        });

        fetchPermissions();
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
          ? "Permission already exists"
          : t("error.tryAgain"),
      });
    }
  };

  return (
    <Modal
      title={t("permission.createTitle")}
      open={isOpenCreate}
      onCancel={handleCancel}
      onOk={() => form.submit()}
      width={800}
      okText={t("common.confirm")}
      cancelText={t("common.cancel")}
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
                  {
                    label: t("permission.moduleCOMPANIES"),
                    value: "COMPANIES",
                  },
                  {
                    label: t("permission.modulePERMISSIONS"),
                    value: "PERMISSIONS",
                  },
                  { label: t("permission.moduleSKILLS"), value: "SKILLS" },
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

export default CreatePermission;
