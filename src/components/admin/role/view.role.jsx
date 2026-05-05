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
import { useTranslation } from "react-i18next";
import CreateRole from "./modal.create.role";
import { callDeleteRoleAPI } from "../../../services/api.service";
import UpdateRole from "./modal.update.role";

const ViewRole = (props) => {
  const { t } = useTranslation();
  const { roleData, page, size, total, permissionData, fetchRoles } = props;
  const [isOpenUpdate, setIsOpenUpdate] = useState(false);
  const [dataUpdateRole, setDataUpdateRole] = useState({});
  const [isOpenCreate, setIsOpenCreate] = useState(false);
  const [form] = Form.useForm();
  const [currentFilter, setCurrentFilter] = useState("");

  const onFinish = (values) => {
    let queryParts = [];

    if (values.name) {
      queryParts.push(`name~'${values.name}'`);
    }

    if (values.active) {
      queryParts.push(`active=${values.active === "ACTIVE"}`);
    }

    const filter = queryParts.join(" AND ");
    setCurrentFilter(filter);

    fetchRoles({
      page: 1,
      size,
      ...(filter && { filter }),
    });
  };

  const handleReset = () => {
    form.resetFields();
    setCurrentFilter("");
    fetchRoles({ page: 1, size });
  };

  const handleDelete = async (id) => {
    try {
      const res = await callDeleteRoleAPI(id);

      if (res.data) {
        notification.success({
          message: t("message.deleteSuccess"),
        });
        fetchRoles();
      } else {
        notification.error({
          message: t("message.error"),
          description: res.message || t("error.checkData"),
        });
      }
    } catch (error) {
      notification.error({
        message: t("message.error"),
        description: t("error.tryAgain"),
      });
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      width: 60,
      render: (text) => <a style={{ color: "#1890ff" }}>{text}</a>,
    },
    {
      title: t("common.name"),
      dataIndex: "name",
      sorter: true,
    },
    {
      title: t("common.status"),
      dataIndex: "active",
      render: (_, record) => (
        <Tag color={record.active ? "success" : "error"}>
          {record.active ? "ACTIVE" : "INACTIVE"}
        </Tag>
      ),
    },
    {
      title: t("common.createdAt"),
      dataIndex: "createdAt",
      render: (t) => (t ? dayjs(t).format("DD/MM/YYYY HH:mm") : "-"),
    },
    {
      title: t("common.updatedAt"),
      dataIndex: "updatedAt",
      render: (t) => (t ? dayjs(t).format("DD/MM/YYYY HH:mm") : "-"),
    },
    {
      title: t("common.actions"),
      width: 100,
      align: "center",
      render: (_, record) => (
        <Space>
          <EditOutlined
            style={{ color: "#faad14", cursor: "pointer" }}
            onClick={() => {
              setIsOpenUpdate(true);
              setDataUpdateRole(record);
            }}
          />
          <Popconfirm
            title={t("common.confirmDelete")}
            onConfirm={() => handleDelete(record.id)}
          >
            <DeleteOutlined style={{ color: "#ff4d4f", cursor: "pointer" }} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      {/* FILTER */}
      <Card style={{ marginBottom: 20 }}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <Form.Item name="name" label={t("common.name")}>
                <Input
                  prefix={<SearchOutlined />}
                  placeholder={t("common.searchPlaceholder")}
                  allowClear
                />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item name="active" label={t("common.status")}>
                <Select
                  allowClear
                  placeholder={t("common.selectPlaceholder")}
                  options={[
                    { label: "ACTIVE", value: "ACTIVE" },
                    { label: "INACTIVE", value: "INACTIVE" },
                  ]}
                />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label=" " colon={false}>
                <Space>
                  <Button
                    type="primary"
                    icon={<SearchOutlined />}
                    htmlType="submit"
                  >
                    {t("common.search")}
                  </Button>
                  <Button icon={<ReloadOutlined />} onClick={handleReset}>
                    {t("common.reset")}
                  </Button>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>

      {/* TABLE */}
      <Card>
        <Flex justify="space-between" style={{ marginBottom: 16 }}>
          <Text strong>{t("role.listTitle")}</Text>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsOpenCreate(true)}
          >
            {t("common.addNew")}
          </Button>
        </Flex>

        <Table
          columns={columns}
          dataSource={roleData}
          rowKey="id"
          pagination={{
            current: page,
            pageSize: size,
            total: total,
            showSizeChanger: true,
            onChange: (p, s) => {
              fetchRoles({
                page: p,
                size: s,
                ...(currentFilter && { filter: currentFilter }),
              });
            },
          }}
        />
      </Card>

      {/* MODALS */}
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
