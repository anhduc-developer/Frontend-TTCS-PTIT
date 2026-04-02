import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Input,
  notification,
  Popconfirm,
  Space,
  Table,
  Typography,
} from "antd";
import { useState } from "react";
import CreateCompany from "./modal.create.company";
import { callDeleteCompany } from "../../../services/api.service";
import UpdateCompany from "./modal.update.company";
import CompanyDetail from "./modal.detail.company";
import dayjs from "dayjs";

const { Text } = Typography;

const ViewCompany = (props) => {
  // Nhận thêm total từ props để hiển thị tổng số trang
  const { companyData, page, size, fetchCompanies, total, loading } = props;
  const [isOpenCreateCompany, setIsOpenCreateCompany] = useState(false);
  const [isOpenUpdateCompany, setIsOpenUpdateCompany] = useState(false);
  const [dataUpdateCompany, setDataUpdateCompany] = useState({});
  const [isOpenDetailCompany, setIsOpenDetailCompany] = useState(false);
  const [dataCompanyDetail, setDataCompanyDetail] = useState({});

  const [searchName, setSearchName] = useState("");
  const [searchAddress, setSearchAddress] = useState("");

  const handleSearch = () => {
    let queryParts = [];
    if (searchName) queryParts.push(`name~'${searchName}'`);
    if (searchAddress) queryParts.push(`address~'${searchAddress}'`);

    const filter = queryParts.join(" AND ");

    fetchCompanies({
      page: 1, // Reset về trang 1 khi tìm kiếm
      size: size,
      ...(filter && { filter }),
    });
  };

  const handleReset = () => {
    setSearchAddress("");
    setSearchName("");
    fetchCompanies({ page: 1, size: 10 }); // Reset về mặc định
  };

  const handleDeleteCompany = async (id) => {
    const res = await callDeleteCompany(id);
    if (res.data) {
      notification.success({
        message: "Xóa thành công",
        description: "Đã xóa công ty khỏi hệ thống",
      });
      fetchCompanies({ page, size }); // Load lại trang hiện tại
    } else {
      notification.error({
        message: "Lỗi xóa dữ liệu",
        description: res.message,
      });
    }
  };

  const columns = [
    {
      title: "STT",
      width: 80,
      align: "center",
      render: (_, __, index) => (page - 1) * size + index + 1,
    },
    {
      title: "Tên công ty",
      dataIndex: "name",
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      render: (date) => (date ? dayjs(date).format("DD/MM/YYYY HH:mm") : "-"),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 120,
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          <EyeOutlined
            style={{ color: "green", cursor: "pointer", fontSize: 17 }}
            onClick={() => {
              setDataCompanyDetail(record);
              setIsOpenDetailCompany(true);
            }}
          />
          <EditOutlined
            style={{ color: "blue", cursor: "pointer", fontSize: 17 }}
            onClick={() => {
              setDataUpdateCompany(record);
              setIsOpenUpdateCompany(true);
            }}
          />
          <Popconfirm
            title="Xác nhận xóa công ty?"
            onConfirm={() => handleDeleteCompany(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <DeleteOutlined
              style={{ color: "red", cursor: "pointer", fontSize: 17 }}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      {/* Search Bar */}
      <Card style={{ marginBottom: 20 }}>
        <Space size="large" wrap>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Text>Tên:</Text>
            <Input
              value={searchName}
              placeholder="Nhập tên công ty"
              style={{ width: 250 }}
              onChange={(e) => setSearchName(e.target.value)}
              onPressEnter={handleSearch}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Text>Địa chỉ:</Text>
            <Input
              value={searchAddress}
              placeholder="Nhập địa chỉ"
              style={{ width: 250 }}
              onChange={(e) => setSearchAddress(e.target.value)}
              onPressEnter={handleSearch}
            />
          </div>
          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={handleSearch}
          >
            Tìm kiếm
          </Button>
          <Button icon={<ReloadOutlined />} onClick={handleReset}>
            Reset
          </Button>
        </Space>
      </Card>

      {/* Table Card */}
      <Card
        title={
          <Text strong style={{ fontSize: 18 }}>
            Quản lý công ty
          </Text>
        }
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsOpenCreateCompany(true)}
          >
            Thêm mới
          </Button>
        }
      >
        <Table
          loading={loading} // Thêm hiệu ứng loading
          columns={columns}
          dataSource={companyData}
          rowKey="id"
          pagination={{
            current: page,
            pageSize: size,
            total: total, // Hiển thị đúng số lượng trang dựa trên tổng số record
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50"],
            onChange: (p, s) => {
              fetchCompanies({ page: p, size: s });
            },
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} trên ${total} công ty`,
            locale: { items_per_page: "/ trang" },
          }}
        />
      </Card>
      <CreateCompany
        setIsOpenCreateCompany={setIsOpenCreateCompany}
        isOpenCreateCompany={isOpenCreateCompany}
        fetchCompanies={fetchCompanies}
      />
      <UpdateCompany
        setIsOpenUpdateCompany={setIsOpenUpdateCompany}
        isOpenUpdateCompany={isOpenUpdateCompany}
        dataUpdateCompany={dataUpdateCompany}
        fetchCompanies={fetchCompanies}
      />
      <CompanyDetail
        dataCompanyDetail={dataCompanyDetail}
        isOpenDetailCompany={isOpenDetailCompany}
        setIsOpenDetailCompany={setIsOpenDetailCompany}
      />
    </div>
  );
};

export default ViewCompany;
