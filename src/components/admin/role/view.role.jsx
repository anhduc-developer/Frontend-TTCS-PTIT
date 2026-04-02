import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Flex,
  Form,
  Input,
  notification,
  Popconfirm,
  Row,
  Select,
  Space,
  Table,
  Tag,
} from "antd";
import Text from "antd/es/typography/Text";
import dayjs from "dayjs";
import { useState } from "react";
import CreateRole from "./modal.create.role";
import { callDeleteRoleAPI } from "../../../services/api.service";
import UpdateRole from "./modal.update.role";

const ViewRole = (props) => {
  const { roleData, page, size, total, permissionData, fetchRoles } = props;
  const [isOpenUpdate, setIsOpenUpdate] = useState(false);
  const [dataUpdateRole, setDataUpdateRole] = useState({});
  const [isOpenCreate, setIsOpenCreate] = useState(false);
  const [form] = Form.useForm();
  const onFinish = async (values) => {
    console.log(">>> check values", values);
    let queryParts = [];
    if (values.name) queryParts.push(`name~'${values.name}'`);
    if (values.active) {
      const temp = values.active === "ACTIVE" ? true : false;
      queryParts.push(`active=${temp}`);
    }
    const filter = queryParts.join(" AND ");
    console.log(">>>> check filter", filter);
    fetchRoles({
      page: 1,
      size,
      ...(filter && {
        filter,
      }),
    });
  };
  const handleReset = () => {
    form.resetFields();
    fetchRoles({ page: 1, size });
  };
  const handleDelete = async (id) => {
    const res = await callDeleteRoleAPI(id);
    if (res.data) {
      notification.success({
        title: "Delete a Role Success!",
        description: "Xóa Role Thành Công",
      });
      fetchRoles();
    } else {
      notification.error({
        message: "Error Delete a Role",
        description: JSON.stringify(res.message),
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
    {
      title: "Trạng thái",
      dataIndex: "active",
      render: (_, record) => {
        return (
          <Tag
            color={record.active ? "success" : "error"}
            style={{ borderRadius: "8px", padding: "4px 10px" }}
          >
            {record.active ? "ACTIVE" : "INACTIVE"}
          </Tag>
        );
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      render: (t) => (t ? dayjs(t).format("DD/MM/YYYY HH:mm") : "-"),
    },
    {
      title: "Cập Nhật",
      dataIndex: "updatedAt",
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
              setDataUpdateRole(record);
            }}
          />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa Role này?"
            onConfirm={() => handleDelete(record.id)}
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
            <Col span={10}>
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
            <Col span={10}>
              <Form.Item
                name="active"
                label={<b>Trạng Thái</b>}
                style={{ marginBottom: 0 }}
              >
                <Select
                  allowClear
                  placeholder="Trạng Thái"
                  options={[
                    { label: "ACTIVE", value: "ACTIVE" },
                    { label: "INACTIVE", value: "INACTIVE" },
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
            Danh sách Role
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
          dataSource={roleData}
          rowKey="id"
          pagination={{
            current: page, // Trang hiện tại
            pageSize: size, // Số lượng hàng mỗi trang
            total: total, // Tổng số hàng từ Server
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50"],
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} trên ${total} hàng`,
            onChange: (p, s) => {
              // Gọi lại hàm fetch khi người dùng thao tác phân trang
              fetchRoles({ page: p, size: s });
            },
          }}
        />
      </Card>
      <CreateRole
        isOpenCreate={isOpenCreate}
        setIsOpenCreate={setIsOpenCreate}
        permissionData={permissionData}
        fetchRoles={fetchRoles}
      />
      <UpdateRole
        isOpenUpdate={isOpenUpdate}
        setIsOpenUpdate={setIsOpenUpdate}
        dataUpdateRole={dataUpdateRole}
        fetchRoles={fetchRoles}
        permissionData={permissionData}
      />
    </>
  );
};
export default ViewRole;
