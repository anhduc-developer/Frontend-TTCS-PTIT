import { PlusOutlined } from "@ant-design/icons";
import {
  Col,
  Form,
  Input,
  Modal,
  notification,
  Row,
  Switch,
  Upload,
} from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css"; // Đảm bảo đã import CSS cho Quill
import {
  callPutCompany,
  handleUploadFile,
} from "../../../services/api.service";

const UpdateCompany = (props) => {
  const { t } = useTranslation();
  const {
    isOpenUpdateCompany,
    setIsOpenUpdateCompany,
    dataUpdateCompany,
    fetchCompanies,
  } = props;

  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [form] = Form.useForm();

  // Đổ dữ liệu vào form khi mở Modal
  useEffect(() => {
    if (dataUpdateCompany && isOpenUpdateCompany) {
      form.setFieldsValue({
        name: dataUpdateCompany.name,
        address: dataUpdateCompany.address,
        description: dataUpdateCompany.description,
        outstanding: dataUpdateCompany.outstanding,
      });

      // Hiển thị logo hiện tại từ server
      if (dataUpdateCompany.logo) {
        setPreview(
          `${import.meta.env.VITE_BACKEND_URL}/storage/company/${dataUpdateCompany.logo}`,
        );
      }
    }
  }, [dataUpdateCompany, isOpenUpdateCompany, form]);

  const handleChange = ({ fileList }) => {
    if (fileList.length > 0) {
      const file = fileList[0]?.originFileObj;
      if (file) {
        // Xóa URL cũ nếu có để tránh rò rỉ bộ nhớ
        if (preview && preview.startsWith("blob:")) {
          URL.revokeObjectURL(preview);
        }
        setSelectedFile(file);
        setPreview(URL.createObjectURL(file));
      }
    } else {
      setPreview(null);
      setSelectedFile(null);
    }
  };

  const handleCancel = () => {
    setIsOpenUpdateCompany(false);
    setSelectedFile(null);
    setPreview("");
    form.resetFields();
  };

  const onFinish = async (values) => {
    setLoading(true);
    let logo = dataUpdateCompany.logo; // Mặc định giữ logo cũ

    try {
      // 1. Nếu có chọn file mới -> Upload file
      if (selectedFile) {
        const uploadRes = await handleUploadFile(selectedFile, "company");
        if (uploadRes.data) {
          logo = uploadRes.data.fileName;
        } else {
          notification.error({ message: t("company.imageUploadError") });
          setLoading(false);
          return;
        }
      }

      // 2. Gọi API Update
      const data = {
        id: dataUpdateCompany.id,
        name: values.name,
        address: values.address,
        logo: logo,
        description: values.description,
        outstanding: values.outstanding,
      };

      const res = await callPutCompany(data);
      if (res.data) {
        notification.success({
          message: t("message.updateSuccess"),
          description: t("company.details") + " " + t("message.updateSuccess"),
        });
        handleCancel();
        fetchCompanies();
      } else {
        notification.error({
          message: "Lỗi cập nhật",
          description: res.message || t("error.errorOccurred"),
        });
      }
    } catch (error) {
      notification.error({ message: t("error.errorOccurred") });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={t("company.updateTitle")}
      open={isOpenUpdateCompany}
      onOk={() => form.submit()}
      onCancel={handleCancel}
      width={800}
      okText={t("message.updateSuccess")}
      cancelText={t("common.cancel")}
      confirmLoading={loading}
      maskClosable={false}
      forceRender
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        style={{ marginTop: "20px" }}
      >
        <Row gutter={20}>
          <Col span={20}>
            <Form.Item
              label={t("form.companyName")}
              name="name"
              rules={[
                {
                  required: true,
                  message: t("validation.pleaseEnterCompanyName"),
                },
              ]}
            >
              <Input placeholder={t("company.nameInput")} />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item
              label={t("company.featured")}
              name="outstanding"
              valuePropName="checked"
            >
              <Switch checkedChildren="HOT" unCheckedChildren="NO" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={20}>
          <Col span={8}>
            <Form.Item label={t("form.companyLogo")}>
              <Upload
                listType="picture-card"
                maxCount={1}
                beforeUpload={() => false}
                showUploadList={false}
                onChange={handleChange}
              >
                {preview ? (
                  <img
                    src={preview}
                    alt="logo"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                ) : (
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                )}
              </Upload>
            </Form.Item>
          </Col>

          <Col span={16}>
            <Form.Item
              label={t("form.companyAddress")}
              name="address"
              rules={[
                { required: true, message: t("validation.pleaseEnterAddress") },
              ]}
            >
              <Input.TextArea
                rows={4}
                placeholder={t("company.addressInput")}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label={t("form.companyDescription")} name="description">
          <ReactQuill
            theme="snow"
            placeholder={t("company.descriptionInput")}
            style={{ height: "200px", marginBottom: "50px" }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateCompany;
