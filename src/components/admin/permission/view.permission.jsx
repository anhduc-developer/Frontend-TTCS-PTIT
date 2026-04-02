import { useState } from "react";
import {
  Table,
  Space,
  Button,
  Input,
  Card,
  Flex,
  Typography,
  Popconfirm,
  notification,
  Row,
  Col,
  Select,
  Form,
} from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SettingOutlined,
  VerticalAlignMiddleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import CreatePermission from "./modal.create.permission";
import { callDeletePermissionAPI } from "../../../services/api.service";
import UpdatePermisison from "./modal.update.permission";
const { Text } = Typography;
const ViewPermission = (props) => {
  const { page, size, total, fetchPermissions, permissionData } = props;
  const [isOpenCreate, setIsOpenCreate] = useState(false);
  const [isOpenUpdate, setIsOpenUpdate] = useState(false);
  const [dataPermissionUpdate, setDataPermissionUpdate] = useState({});
  const [form] = Form.useForm();
  const onFinish = (values) => {
    const { name, apiPath, method, module } = values;
    let queryParts = [];

    if (name) queryParts.push(`name~'${name}'`);
    if (apiPath) queryParts.push(`apiPath~'${apiPath}'`);
    if (method) queryParts.push(`method='${method}'`);
    if (module) queryParts.push(`module='${module}'`);

    const filter = queryParts.join(" AND ");

    fetchPermissions({
      page: 1,
      size,
      ...(filter && { filter }),
    });
  };

  const handleReset = () => {
    form.resetFields();
    fetchPermissions({ page: 1, size });
  };

  const handleDeletePermission = async (id) => {
    const res = await callDeletePermissionAPI(id);
    if (res.data) {
      notification.success({ message: "Xóa Permission Thành Công!" });
      fetchPermissions();
    } else {
      notification.error({
        message: "Lỗi xóa",
        description: res.message,
      });
    }
  };

  const columns = [
    {
      title: "Id",
      dataIndex: "id",
      width: 60,
      render: (text) => <a style={{ color: "#1890ff" }}>{text}</a>,
    },
    { title: "Name", dataIndex: "name", sorter: true },
    { title: "API", dataIndex: "apiPath", sorter: true },
    {
      title: "Method",
      dataIndex: "method",
      render: (method) => {
        const colors = {
          POST: "green",
          PUT: "orange",
          DELETE: "red",
          GET: "blue",
        };
        return (
          <Text strong style={{ color: colors[method] || "cyan" }}>
            {method}
          </Text>
        );
      },
    },
    { title: "Module", dataIndex: "module", sorter: true },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      render: (t) => (t ? dayjs(t).format("DD/MM/YYYY HH:mm") : "-"),
    },
    {
      title: "Actions",
      width: 100,
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          <EditOutlined
            style={{ color: "#faad14", fontSize: 18, cursor: "pointer" }}
            onClick={() => {
              setIsOpenUpdate(true);
              setDataPermissionUpdate(record);
            }}
          />
          <Popconfirm
            title="Xóa?"
            onConfirm={() => handleDeletePermission(record.id)}
          >
            <DeleteOutlined
              style={{ color: "#ff4d4f", fontSize: 18, cursor: "pointer" }}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Card
        variant="borderless"
        style={{ marginBottom: 20, borderRadius: "10px" }}
      >
        <Form
          form={form}
          name="search_permission"
          onFinish={onFinish}
          layout="vertical"
        >
          <Row gutter={[24, 16]} align="bottom">
            <Col span={6}>
              <Form.Item
                name="name"
                label={<b>Name</b>}
                style={{ marginBottom: 0 }}
              >
                <Input
                  prefix={<SearchOutlined />}
                  placeholder="Nhập tên..."
                  allowClear
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="apiPath"
                label={<b>API</b>}
                style={{ marginBottom: 0 }}
              >
                <Input
                  prefix={<SearchOutlined />}
                  placeholder="Nhập API..."
                  allowClear
                />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item
                name="method"
                label={<b>METHOD</b>}
                style={{ marginBottom: 0 }}
              >
                <Select
                  placeholder="Chọn Method"
                  allowClear
                  options={[
                    { label: "GET", value: "GET" },
                    { label: "POST", value: "POST" },
                    { label: "PUT", value: "PUT" },
                    { label: "DELETE", value: "DELETE" },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item
                name="module"
                label={<b>MODULE</b>}
                style={{ marginBottom: 0 }}
              >
                <Select
                  placeholder="Chọn module"
                  allowClear
                  options={[
                    { label: "USERS", value: "USERS" },
                    { label: "JOBS", value: "JOBS" },
                    { label: "COMPANIES", value: "COMPANIES" },
                    { label: "SKILLS", value: "SKILLS" },
                    { label: "PERMISISONS", value: "PERMISISONS" },
                    { label: "RESUMES", value: "RESUMES" },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Space style={{ width: "100%", justifyContent: "flex-end" }}>
                <Button
                  type="primary"
                  icon={<SearchOutlined />}
                  htmlType="submit"
                >
                  Lọc
                </Button>
                <Button icon={<ReloadOutlined />} onClick={handleReset}>
                  Reset
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>

      <Card>
        <Flex
          justify="space-between"
          align="center"
          style={{ marginBottom: 16 }}
        >
          <Text strong style={{ fontSize: 16 }}>
            Danh sách Permissions
          </Text>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsOpenCreate(true)}
          >
            Thêm mới
          </Button>
        </Flex>

        <Table
          columns={columns}
          dataSource={permissionData}
          rowKey="id"
          pagination={{
            current: page, // Trang hiện tại
            pageSize: size, // Số bản ghi mỗi trang
            total: total, // Tổng số bản ghi từ Server
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50"],
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} trên ${total} hàng`,
            onChange: (p, s) => {
              // Gọi lại hàm fetch khi người dùng nhấn chuyển trang hoặc đổi size
              fetchPermissions({ page: p, size: s });
            },
          }}
        />
      </Card>

      <CreatePermission
        isOpenCreate={isOpenCreate}
        setIsOpenCreate={setIsOpenCreate}
        fetchPermissions={fetchPermissions}
      />
      <UpdatePermisison
        isOpenUpdate={isOpenUpdate}
        setIsOpenUpdate={setIsOpenUpdate}
        dataPermissionUpdate={dataPermissionUpdate}
        fetchPermissions={fetchPermissions}
      />
    </>
  );
};

export default ViewPermission;
