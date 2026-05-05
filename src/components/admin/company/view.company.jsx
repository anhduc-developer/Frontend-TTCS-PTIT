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
import { useTranslation } from "react-i18next";
import CreateCompany from "./modal.create.company";
import { callDeleteCompany } from "../../../services/api.service";
import UpdateCompany from "./modal.update.company";
import CompanyDetail from "./modal.detail.company";
import dayjs from "dayjs";

const { Text } = Typography;

const ViewCompany = (props) => {
  const { t } = useTranslation();
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
        message: t("message.deleteSuccess"),
        description: t("company.details") + " " + t("message.deleteSuccess"),
      });
      fetchCompanies({ page, size }); // Load lại trang hiện tại
    } else {
      notification.error({
        message: t("message.error"),
        description: res.message,
      });
    }
  };

  const columns = [
    {
      title: t("common.stt"),
      width: 80,
      align: "center",
      render: (_, __, index) => (page - 1) * size + index + 1,
    },
    {
      title: t("common.companyName"),
      dataIndex: "name",
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: t("common.address"),
      dataIndex: "address",
    },
    {
      title: t("common.createdAt"),
      dataIndex: "createdAt",
      render: (date) => (date ? dayjs(date).format("DD/MM/YYYY HH:mm") : "-"),
    },
    {
      title: t("common.actions"),
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
            title={t("company.deleteConfirm")}
            onConfirm={() => handleDeleteCompany(record.id)}
            okText={t("common.delete")}
            cancelText={t("common.cancel")}
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
            <Text>{t("common.name")}:</Text>
            <Input
              value={searchName}
              placeholder={t("company.searchByName")}
              style={{ width: 250 }}
              onChange={(e) => setSearchName(e.target.value)}
              onPressEnter={handleSearch}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Text>{t("common.address")}:</Text>
            <Input
              value={searchAddress}
              placeholder={t("company.searchByAddress")}
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
            {t("common.search")}
          </Button>
          <Button icon={<ReloadOutlined />} onClick={handleReset}>
            {t("common.reset")}
          </Button>
        </Space>
      </Card>

      {/* Table Card */}
      <Card
        title={
          <Text strong style={{ fontSize: 18 }}>
            {t("header.manageCompanies")}
          </Text>
        }
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsOpenCreateCompany(true)}
          >
            {t("common.addNew")}
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
