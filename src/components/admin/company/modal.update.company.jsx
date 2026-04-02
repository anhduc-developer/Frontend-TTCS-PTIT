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
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css"; // Đảm bảo đã import CSS cho Quill
import {
  callPutCompany,
  handleUploadFile,
} from "../../../services/api.service";

const UpdateCompany = (props) => {
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
          notification.error({ message: "Lỗi upload ảnh!" });
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
          message: "Cập nhật thành công!",
          description: "Thông tin công ty đã được cập nhật.",
        });
        handleCancel();
        fetchCompanies();
      } else {
        notification.error({
          message: "Lỗi cập nhật",
          description: res.message || "Có lỗi xảy ra",
        });
      }
    } catch (error) {
      notification.error({ message: "Lỗi hệ thống, vui lòng thử lại!" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Cập nhật Company"
      open={isOpenUpdateCompany}
      onOk={() => form.submit()}
      onCancel={handleCancel}
      width={800}
      okText="Cập nhật"
      cancelText="Hủy"
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
              label="Tên công ty"
              name="name"
              rules={[
                { required: true, message: "Vui lòng nhập tên công ty!" },
              ]}
            >
              <Input placeholder="Nhập tên công ty" />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item
              label="Nổi bật"
              name="outstanding"
              valuePropName="checked"
            >
              <Switch checkedChildren="HOT" unCheckedChildren="NO" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={20}>
          <Col span={8}>
            <Form.Item label="Ảnh Logo (Click để đổi)">
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
    </Modal>
  );
};

export default UpdateCompany;
