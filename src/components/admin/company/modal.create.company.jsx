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
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import {
  createCompanyAPI,
  handleUploadFile,
} from "../../../services/api.service";

const CreateCompany = (props) => {
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
      notification.error({ message: "Vui lòng chọn logo công ty!" });
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
            message: "Tạo mới thành công!",
            description: `Công ty ${values.name} đã được tạo.`,
          });
          handleCancel(); // Đóng modal và reset data
          fetchCompanies();
        } else {
          notification.error({
            message: "Lỗi tạo công ty",
            description: res.message || "Vui lòng kiểm tra lại dữ liệu",
          });
        }
      } else {
        notification.error({ message: "Upload ảnh thất bại!" });
      }
    } catch (error) {
      notification.error({ message: "Có lỗi xảy ra, vui lòng thử lại!" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Tạo mới Company"
      open={isOpenCreateCompany}
      onOk={() => form.submit()}
      onCancel={handleCancel}
      width={800}
      okText="Tạo mới"
      cancelText="Hủy"
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
                label="Tên công ty"
                name="name"
                rules={[
                  { required: true, message: "Vui lòng nhập tên công ty!" },
                ]}
              >
                <Input placeholder="Nhập tên công ty" />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item
                label="Nổi bật (Top)"
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
                label="Ảnh Logo"
                name="logo"
                rules={[{ required: true, message: "Vui lòng tải lên logo!" }]}
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
                label="Địa chỉ"
                name="address"
                rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
              >
                <Input.TextArea rows={4} placeholder="Nhập địa chỉ công ty" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Miêu tả" name="description">
            <ReactQuill
              theme="snow"
              placeholder="Nhập nội dung miêu tả..."
              style={{ height: "200px", marginBottom: "50px" }}
            />
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};

export default CreateCompany;
