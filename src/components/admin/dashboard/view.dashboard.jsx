import React from "react";
import { Column } from "@ant-design/plots";
import { hasPermission } from "../../../services/helper/permission";
import { Empty, Typography } from "antd"; // Import Typography để lấy Title chuẩn
import { useTranslation } from "react-i18next";

const { Title } = Typography;

const ViewDashboard = ({ dashboardData, user }) => {
  const { t } = useTranslation();
  // 1. Định nghĩa tất cả các cột thống kê có thể có
  const allStats = [
    { type: t('header.user', 'User'), sales: dashboardData?.totalUsers || 0, module: "USERS" },
    {
      type: t('header.company', 'Company'),
      sales: dashboardData?.totalCompanies || 0,
      module: "COMPANIES",
    },
    { type: t('header.job', 'Job'), sales: dashboardData?.totalJobs || 0, module: "JOBS" },
    {
      type: t('header.permission', 'Permission'),
      sales: dashboardData?.totalPermissions || 0,
      module: "PERMISSIONS",
    },
    { type: t('header.role', 'Role'), sales: dashboardData?.totalRoles || 0, module: "ROLES" },
    {
      type: t('header.resume', 'Resume'),
      sales: dashboardData?.totalResumes || 0,
      module: "RESUMES",
    },
    {
      type: t('header.subscriber', 'Subscriber'),
      sales: dashboardData?.totalSubscribers || 0,
      module: "SUBSCRIBERS",
    },
    { type: t('header.skill', 'Skill'), sales: dashboardData?.totalSkills || 0, module: "SKILLS" },
  ];

  // 2. Lọc dữ liệu: Chỉ giữ lại những gì User thực sự có quyền xem (GET)
  const filteredData = allStats.filter((item) => {
    // Nếu là ADMIN tối cao thì cho xem tất cả
    if (user?.role?.name === "ADMIN") return true;

    // Kiểm tra trong mảng permissions của user
    // Chỉ cần có bất kỳ quyền nào (thường là GET) thuộc Module này là cho hiện cột
    return user?.role?.permissions?.some(
      (p) => p.module === item.module && p.method === "GET",
    );
  });

  // 3. Cấu hình biểu đồ
  const config = {
    data: filteredData, // SỬA TẠI ĐÂY: Dùng filteredData thay vì mảng hardcode
    xField: "type",
    yField: "sales",
    colorField: "type",
    scale: {
      color: {
        range: [
          "#1890ff",
          "#722ed1",
          "#a0d911",
          "#f4664a",
          "#faad14",
          "#13c2c2",
          "#eb2f96",
        ],
      },
    },
    padding: "auto",
    label: {
      text: (d) => `${d.sales}`,
      style: { fill: "#000", opacity: 0.6 },
    },
    // Thêm animation cho mượt
    animation: {
      appear: {
        animation: "path-in",
        duration: 1000,
      },
    },
  };

  return (
    <div
      style={{
        padding: 20,
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      <Title level={4} style={{ marginBottom: 30 }}>
        📊 {t('header.dashboard', 'Thống kê hệ thống')}
      </Title>

      {/* Nếu filteredData có phần tử, biểu đồ sẽ hiện.
          Nếu HR chỉ có quyền JOBS và RESUMES, nó sẽ hiện 2 cột.
      */}
      {filteredData.length > 0 ? (
        <div style={{ height: 400 }}>
          <Column {...config} data={filteredData} />
        </div>
      ) : (
        <Empty
          style={{ padding: "40px 0" }}
          description={t('common.accessDenied', 'Bạn không có quyền truy cập dữ liệu thống kê của các module này.')}
        />
      )}
    </div>
  );
};

export default ViewDashboard;
