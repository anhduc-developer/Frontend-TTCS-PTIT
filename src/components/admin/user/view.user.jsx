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
import ModalUser from "./modal.create.user";
import UpdateUser from "./modal.update.user";
import { callDeleteUser } from "../../../services/api.service";
import UserDetail from "./model.detail.user";
const ViewUser = (props) => {
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
        message: "Delete User Success!",
        description: "Xóa người dùng thành công!",
      });
      fetchUsers({
        page: page,
        size: size,
      });
    } else {
      notification.error({
        message: "Error Delete User!",
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
      title: "STT",
      render: (_, record, index) => (
        <div style={{ marginLeft: "15px" }}>
          {(page - 1) * size + index + 1}
        </div>
      ),
    },
    { title: "Name", dataIndex: "name" },
    { title: "Email", dataIndex: "email" },
    {
      title: "Role",
      render: (_, record) => record?.role?.name || "-",
    },
    {
      title: "Company",
      render: (_, record) => record?.company?.name || "-",
    },
    { title: "CreatedAt", dataIndex: "createdAt" },
    { title: "UpdatedAt", dataIndex: "updatedAt" },
    {
      title: "Action",
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
            title="Xóa người dùng"
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
            placeholder="Nhập tên"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            style={{ width: 250 }}
            onPressEnter={handleSearch}
          />
          <Input
            placeholder="Nhập email"
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
            Tìm kiếm
          </Button>
          <Button
            loading={loading}
            onClick={handleReset}
            icon={<UndoOutlined />}
          >
            Làm lại
          </Button>
        </Space>
      </Card>
      {/* TABLE */}
      <Card
        title="Danh sách Users"
        extra={
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsOpenCreateUser(true)}
            >
              Thêm mới
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
            locale: { items_per_page: "/ trang" },
          }}
        />
      </Card>
    </div>
  );
};
export default ViewUser;
