import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Upload,
  Row,
  Col,
  notification,
  Switch,
  Spin,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import {
  createCompanyAPI,
  handleUploadFile,
} from "../../../services/api.service";

const CreateCompany = (props) => {
  const { t } = useTranslation();
  const { isOpenCreateCompany, setIsOpenCreateCompany, fetchCompanies } = props;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState("");

  // Giải phóng URL preview khi component unmount hoặc file thay đổi
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleCancel = () => {
    setIsOpenCreateCompany(false);
    setSelectedFile(null);
    setPreview("");
    form.resetFields();
  };

  const handleChange = ({ fileList }) => {
    if (fileList.length > 0) {
      const file = fileList[0].originFileObj;
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    } else {
      setSelectedFile(null);
      setPreview("");
    }
  };

  const onFinish = async (values) => {
    if (!selectedFile) {
      notification.error({ message: t("company.selectLogo") });
      return;
    }

    setLoading(true);
    try {
      // 1. Upload File trước
      const resUpload = await handleUploadFile(selectedFile, "company");

      if (resUpload.data) {
        // 2. Nếu upload thành công mới tạo Company
        const data = {
          name: values.name,
          address: values.address,
          logo: resUpload.data.fileName, // Lấy tên file từ server trả về
          description: values.description,
          outstanding: values.outstanding || false,
        };

        const res = await createCompanyAPI(data);
        if (res.data) {
          notification.success({
            message: t("company.createSuccess"),
            description: `${t("header.company")} ${values.name} ${t("message.createSuccess")}`,
          });
          handleCancel(); // Đóng modal và reset data
          fetchCompanies();
        } else {
          notification.error({
            message: t("company.createError"),
            description: res.message || t("error.checkData"),
          });
        }
      } else {
        notification.error({ message: t("company.uploadFailed") });
      }
    } catch (error) {
      notification.error({ message: t("error.errorOccurred") });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={t("company.createTitle")}
      open={isOpenCreateCompany}
      onOk={() => form.submit()}
      onCancel={handleCancel}
      width={800}
      okText={t("company.createButton")}
      cancelText={t("common.cancel")}
      confirmLoading={loading}
      maskClosable={false} // Tránh bấm nhầm ra ngoài làm mất dữ liệu đang nhập
    >
      <Spin spinning={loading}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          style={{ marginTop: "20px" }}
          initialValues={{ outstanding: false }}
        >
          <Row gutter={20}>
            <Col span={18}>
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

            <Col span={6}>
              <Form.Item
                label={t("company.featured")}
                name="outstanding"
                valuePropName="checked"
              >
                <Switch checkedChildren="YES" unCheckedChildren="NO" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={20}>
            <Col span={8}>
              <Form.Item
                label={t("form.companyLogo")}
                name="logo"
                rules={[
                  { required: true, message: t("validation.pleaseUploadLogo") },
                ]}
                // Không cần getValueFromEvent phức tạp vì ta quản lý qua handleChange
              >
                <Upload
                  listType="picture-card"
                  maxCount={1}
                  showUploadList={true}
                  beforeUpload={() => false} // Chặn upload tự động
                  onChange={handleChange}
                  onRemove={() => {
                    setSelectedFile(null);
                    setPreview("");
                  }}
                >
                  {/* Ẩn nút upload khi đã có 1 file trong danh sách */}
                  {!selectedFile && (
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
                  {
                    required: true,
                    message: t("validation.pleaseEnterAddress"),
                  },
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
      </Spin>
    </Modal>
  );
};

export default CreateCompany;
