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
import { useTranslation } from "react-i18next";
import CreatePermission from "./modal.create.permission";
import { callDeletePermissionAPI } from "../../../services/api.service";
import UpdatePermisison from "./modal.update.permission";
const { Text } = Typography;
const ViewPermission = (props) => {
  const { t } = useTranslation();
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
      notification.success({ message: t('message.deleteSuccess', 'Xóa Permission Thành Công!') });
      fetchPermissions();
    } else {
      notification.error({
        message: t('message.error', 'Lỗi xóa'),
        description: res.message,
      });
    }
  };

  const columns = [
    {
      title: t('permission.id', 'Id'),
      dataIndex: "id",
      width: 60,
      render: (text) => <a style={{ color: "#1890ff" }}>{text}</a>,
    },
    { title: t('permission.name', 'Name'), dataIndex: "name", sorter: true },
    { title: t('permission.api', 'API'), dataIndex: "apiPath", sorter: true },
    {
      title: t('permission.method', 'Method'),
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
    { title: t('permission.module', 'Module'), dataIndex: "module", sorter: true },
    {
      title: t('permission.createdAt', 'Ngày tạo'),
      dataIndex: "createdAt",
      render: (t) => (t ? dayjs(t).format("DD/MM/YYYY HH:mm") : "-"),
    },
    {
      title: t('permission.actions', 'Actions'),
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
            title={t('permission.confirmDelete', 'Xóa?')}
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
                label={<b>{t('permission.permissionName', 'Name')}</b>}
                style={{ marginBottom: 0 }}
              >
                <Input
                  prefix={<SearchOutlined />}
                  placeholder={t('permission.permissionNamePlaceholder', 'Nhập tên...')}
                  allowClear
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="apiPath"
                label={<b>{t('permission.apiPath', 'API')}</b>}
                style={{ marginBottom: 0 }}
              >
                <Input
                  prefix={<SearchOutlined />}
                  placeholder={t('permission.apiPathPlaceholder', 'Nhập API...')}
                  allowClear
                />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item
                name="method"
                label={<b>{t('permission.method', 'METHOD')}</b>}
                style={{ marginBottom: 0 }}
              >
                <Select
                  placeholder={t('permission.methodPlaceholder', 'Chọn Method')}
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
                label={<b>{t('permission.module', 'MODULE')}</b>}
                style={{ marginBottom: 0 }}
              >
                <Select
                  placeholder={t('permission.modulePlaceholder', 'Chọn module')}
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
                  {t('common.filter', 'Lọc')}
                </Button>
                <Button icon={<ReloadOutlined />} onClick={handleReset}>
                  {t('common.reset', 'Reset')}
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
            {t('permission.viewTitle', 'Danh sách Permissions')}
          </Text>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsOpenCreate(true)}
          >
            {t('common.addNew', 'Thêm mới')}
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
              t('common.paginationText', '{{start}}-{{end}} trên {{total}} hàng', { start: range[0], end: range[1], total }),
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
