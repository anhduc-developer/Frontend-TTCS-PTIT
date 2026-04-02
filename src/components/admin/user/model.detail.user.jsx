import { Avatar, Badge, Descriptions, Drawer, Divider, Tag } from "antd";
import { UserOutlined } from "@ant-design/icons";

const UserDetail = (props) => {
  const { dataUserDetail, isOpenDetailUser, setIsOpenDetailUser } = props;

  // Hàm helper để hiển thị Tag cho Role hoặc Gender
  const renderGender = (gender) => {
    if (gender === "MALE") return <Tag color="blue">Nam</Tag>;
    if (gender === "FEMALE") return <Tag color="magenta">Nữ</Tag>;
    return <Tag color="orange">Khác</Tag>;
  };

  return (
    <Drawer
      title="CHI TIẾT NGƯỜI DÙNG"
      placement="right"
      width={500} // Tăng chiều rộng một chút cho thoáng
      onClose={() => setIsOpenDetailUser(false)}
      open={isOpenDetailUser}
    >
      {/* Header: Ảnh đại diện và Tên */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <Avatar
          size={100}
          icon={<UserOutlined />}
          style={{ backgroundColor: "#1677ff" }}
        />
        <h2 style={{ marginTop: "10px" }}>{dataUserDetail?.name || "N/A"}</h2>
        <Tag color="cyan">{dataUserDetail?.role?.name || "USER"}</Tag>
      </div>

      <Divider orientation="left">Thông tin cá nhân</Divider>

      <Descriptions column={1} bordered size="small">
        <Descriptions.Item label="ID">{dataUserDetail?.id}</Descriptions.Item>
        <Descriptions.Item label="Email">
          {dataUserDetail?.email}
        </Descriptions.Item>
        <Descriptions.Item label="Tuổi">
          {dataUserDetail?.age}
        </Descriptions.Item>
        <Descriptions.Item label="Giới tính">
          {renderGender(dataUserDetail?.gender)}
        </Descriptions.Item>
        <Descriptions.Item label="Địa chỉ">
          {dataUserDetail?.address || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Ngày tạo">
          {dataUserDetail?.createdAt
            ? new Date(dataUserDetail.createdAt).toLocaleString()
            : "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Người tạo">
          {dataUserDetail?.createdBy || "Hệ thống"}
        </Descriptions.Item>
      </Descriptions>

      <Divider orientation="left">Thông tin công việc</Divider>

      <Descriptions column={1} bordered size="small">
        <Descriptions.Item label="Công ty">
          {dataUserDetail?.company?.name || "Chưa cập nhật"}
        </Descriptions.Item>
      </Descriptions>
    </Drawer>
  );
};

export default UserDetail;
