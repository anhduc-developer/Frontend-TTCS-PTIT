import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
  UndoOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Input,
  notification,
  Popconfirm,
  Space,
  Table,
} from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import ModalUser from "./modal.create.user";
import UpdateUser from "./modal.update.user";
import { callDeleteUser } from "../../../services/api.service";
import UserDetail from "./modal.detail.user";
const ViewUser = (props) => {
  const { t } = useTranslation();
  const {
    userData,
    page,
    size,
    total,
    roleData,
    companyData,
    fetchUsers,
    loading,
    setLoading,
  } = props;
  const [isOpenCreateUser, setIsOpenCreateUser] = useState(false);
  const [isOpenUpdateUser, setIsOpenUpdateUser] = useState(false);
  const [updateUserData, setUpdateUserData] = useState({});
  const [isOpenDetailUser, setIsOpenDetailUser] = useState(false);
  const [dataUserDetail, setDataUserDetail] = useState({});
  const [searchName, setSearchName] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const handleDeleteUser = async (id) => {
    const res = await callDeleteUser(id);
    if (res.data) {
      notification.success({
        message: t('message.success', 'Delete User Success!'),
        description: t('message.deleteSuccess', 'Xóa người dùng thành công!'),
      });
      fetchUsers({
        page: page,
        size: size,
      });
    } else {
      notification.error({
        message: t('message.error', 'Error Delete User!'),
        description: JSON.stringify(res.error),
      });
    }
  };
  const handleSearch = async () => {
    setLoading(true);
    let filter = "";
    if (searchName) {
      filter += `name~'${searchName}'`;
    }
    if (searchEmail) {
      if (filter) filter += " AND ";
      filter += `email~'${searchEmail}'`;
    }
    await fetchUsers({
      page: 1,
      size,
      ...(filter && { filter }),
    });
    setLoading(false);
  };
  const handleReset = async () => {
    setLoading(true);
    setSearchName("");
    setSearchEmail("");

    await fetchUsers({
      page: 1,
      size,
    });
    setLoading(false);
  };
  const handleTableChange = (pagination) => {
    let filter = "";
    if (searchName) {
      filter += `name~'${searchName}'`;
    }
    if (searchEmail) {
      if (filter) filter += " AND ";
      filter += `email~'${searchEmail}'`;
    }
    fetchUsers({
      page: pagination.current,
      size: pagination.pageSize,
      ...(filter && { filter }),
    });
  };
  const columns = [
    {
      title: t('user.stt', 'STT'),
      render: (_, record, index) => (
        <div style={{ marginLeft: "15px" }}>
          {(page - 1) * size + index + 1}
        </div>
      ),
    },
    { title: t('user.name', 'Name'), dataIndex: "name" },
    { title: t('user.email', 'Email'), dataIndex: "email" },
    {
      title: t('user.role', 'Role'),
      render: (_, record) => record?.role?.name || "-",
    },
    {
      title: t('user.company', 'Company'),
      render: (_, record) => record?.company?.name || "-",
    },
    { title: t('user.createdAt', 'CreatedAt'), dataIndex: "createdAt" },
    { title: t('user.updatedAt', 'UpdatedAt'), dataIndex: "updatedAt" },
    {
      title: t('user.action', 'Action'),
      render: (_, record) => (
        <div style={{ display: "flex", gap: 10 }}>
          <EyeOutlined
            style={{ color: "green" }}
            onClick={() => {
              setIsOpenDetailUser(true);
              setDataUserDetail(record);
            }}
          />
          <EditOutlined
            style={{ color: "blue" }}
            onClick={() => {
              setIsOpenUpdateUser(true);
              setUpdateUserData(record);
            }}
          />
          <Popconfirm
            title={t('user.confirmDelete', 'Xóa người dùng')}
            onConfirm={() => handleDeleteUser(record.id)}
          >
            <DeleteOutlined style={{ color: "red" }} />
          </Popconfirm>
        </div>
      ),
    },
  ];
  return (
    <div style={{ padding: 20 }}>
      {/* SEARCH */}
      <Card style={{ marginBottom: 20 }}>
        <Space size="large">
          <Input
            placeholder={t('user.userNamePlaceholder', 'Nhập tên')}
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            style={{ width: 250 }}
            onPressEnter={handleSearch}
          />
          <Input
            placeholder={t('user.userEmailPlaceholder', 'Nhập email')}
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            style={{ width: 250 }}
            onPressEnter={handleSearch}
          />
          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={handleSearch}
          >
            {t('common.search', 'Tìm kiếm')}
          </Button>
          <Button
            loading={loading}
            onClick={handleReset}
            icon={<UndoOutlined />}
          >
            {t('common.reset', 'Làm lại')}
          </Button>
        </Space>
      </Card>
      {/* TABLE */}
      <Card
        title={t('user.listTitle', 'Danh sách Users')}
        extra={
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsOpenCreateUser(true)}
            >
              {t('common.addNew', 'Thêm mới')}
            </Button>
            <ReloadOutlined onClick={handleReset} />
          </Space>
        }
      >
        <ModalUser
          isOpenCreateUser={isOpenCreateUser}
          setIsOpenCreateUser={setIsOpenCreateUser}
          roleData={roleData}
          companyData={companyData}
          fetchUsers={handleSearch}
          page={page}
          size={size}
        />

        <UpdateUser
          isOpenUpdateUser={isOpenUpdateUser}
          setIsOpenUpdateUser={setIsOpenUpdateUser}
          roleData={roleData}
          companyData={companyData}
          updateUserData={updateUserData}
          fetchUsers={handleSearch}
        />

        <UserDetail
          isOpenDetailUser={isOpenDetailUser}
          setIsOpenDetailUser={setIsOpenDetailUser}
          dataUserDetail={dataUserDetail}
        />

        <Table
          loading={loading}
          columns={columns}
          dataSource={userData}
          rowKey="id"
          pagination={{
            current: page,
            pageSize: size,
            total: total,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50"],
            onChange: (p, s) => {
              // Khi người dùng nhấn sang trang p hoặc đổi size thành s
              fetchUsers({ page: p, size: s });
            },
            locale: { items_per_page: t('common.perPage', '/ trang') },
          }}
        />
      </Card>
    </div>
  );
};
export default ViewUser;
