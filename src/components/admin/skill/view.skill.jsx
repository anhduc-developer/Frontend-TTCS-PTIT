import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Input,
  notification,
  Popconfirm,
  Space,
  Table,
  Tag,
  Form,
} from "antd";
import { callDeleteSkill } from "../../../services/api.service";
import { useState, useContext } from "react"; // Thêm useContext
import CreateSkill from "./modal.create.skill";
import UpdateSkill from "./modal.update.skill";
import { AuthContext } from "../../context/auth.context"; // Đảm bảo đúng đường dẫn
import { hasPermission } from "../../../services/helper/permission";

const ViewSkill = (props) => {
  const { skillData, fetchSkills, size, page, total } = props;
  const { user } = useContext(AuthContext); // Lấy thông tin user
  const [form] = Form.useForm();

  const [isOpenCreate, setIsOpenCreate] = useState(false);
  const [isOpenUpdate, setIsOpenUpdate] = useState(false);
  const [dataSkillUpdate, setDataSkillUpdate] = useState({});

  const onFinish = (values) => {
    const { name } = values;
    let filter = "";
    if (name) {
      filter = `name~'${name}'`;
    }
    fetchSkills({
      page: 1,
      size: size,
      ...(filter && { filter }),
    });
  };

  const handleReset = () => {
    form.resetFields();
    fetchSkills({ page: 1, size });
  };

  const handleDelete = async (id) => {
    const res = await callDeleteSkill(id);
    if (res.data) {
      notification.success({
        message: "Xóa thành công",
        description: `Đã xóa kỹ năng có ID: ${id}`,
      });
      fetchSkills({ page, size });
    } else {
      notification.error({
        message: "Lỗi xóa Skill",
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
      title: "Name",
      dataIndex: "name",
      render: (text) => (
        <Tag color={text.length > 5 ? "geekblue" : "green"}>{text}</Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: 120,
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          {/* Nút Sửa: Kiểm tra quyền PUT */}
          {hasPermission(user, {
            apiPath: "/api/v1/skills",
            method: "PUT",
          }) && (
            <EditOutlined
              style={{ color: "#faad14", fontSize: 18, cursor: "pointer" }}
              onClick={() => {
                setIsOpenUpdate(true);
                setDataSkillUpdate(record);
              }}
            />
          )}

          {/* Nút Xóa: Kiểm tra quyền DELETE */}
          {hasPermission(user, {
            apiPath: "/api/v1/skills/{id}",
            method: "DELETE",
          }) && (
            <Popconfirm
              title="Bạn có chắc chắn muốn xóa Skill này?"
              onConfirm={() => handleDelete(record.id)}
              okText="Xóa"
              cancelText="Hủy"
            >
              <DeleteOutlined
                style={{ color: "#ff4d4f", fontSize: 18, cursor: "pointer" }}
              />
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <Card style={{ marginBottom: "20px", borderRadius: "10px" }}>
        <Form
          form={form}
          name="search_skill"
          onFinish={onFinish}
          layout="inline"
          style={{ justifyContent: "flex-start", gap: "20px" }}
        >
          <Form.Item name="name" label={<b>Tên Skill</b>}>
            <Input
              placeholder="Nhập tên skill cần tìm..."
              style={{ width: 300 }}
              allowClear
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button
                type="primary"
                icon={<SearchOutlined />}
                htmlType="submit"
              >
                Tìm kiếm
              </Button>
              <Button icon={<ReloadOutlined />} onClick={handleReset}>
                Làm lại
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      <Card
        title={<b>Danh sách Skill</b>}
        extra={
          /* Nút Thêm mới: Kiểm tra quyền POST */
          hasPermission(user, {
            apiPath: "/api/v1/skills",
            method: "POST",
          }) && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsOpenCreate(true)}
            >
              Thêm mới
            </Button>
          )
        }
      >
        <Table
          columns={columns}
          dataSource={skillData}
          rowKey="id"
          pagination={{
            current: page,
            pageSize: size,
            total: total,
            showSizeChanger: true,
            onChange: (p, s) => fetchSkills({ page: p, size: s }),
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} trên ${total} skills`,
          }}
        />
      </Card>

      <CreateSkill
        isOpenCreate={isOpenCreate}
        setIsOpenCreate={setIsOpenCreate}
        fetchSkills={fetchSkills}
      />
      <UpdateSkill
        fetchSkills={fetchSkills}
        isOpenUpdate={isOpenUpdate}
        setIsOpenUpdate={setIsOpenUpdate}
        dataSkillUpdate={dataSkillUpdate}
      />
    </div>
  );
};

export default ViewSkill;
