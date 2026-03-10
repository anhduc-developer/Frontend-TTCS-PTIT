import { Card, Col, Row, Statistic } from "antd";
import CountUp from "react-countup";
import { useEffect, useState } from "react";
import { callFetchDashboard } from "@/config/api";
import { useAppSelector } from "@/redux/hooks";
import { ALL_PERMISSIONS } from "@/config/permissions";
import { useNavigate } from "react-router-dom";
import { Pie } from "@ant-design/plots";

const DashboardPage = () => {
  const navigate = useNavigate();

  const [data, setData] = useState<any>(null);

  const permissions = useAppSelector(
    (state) => state.account.user?.role?.permissions || [],
  );

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await callFetchDashboard();
      if (res?.data) {
        setData(res.data);
      }
    } catch (error) {
      console.error("Error fetching dashboard", error);
    }
  };

  const formatter = (value: number | string) => (
    <CountUp end={Number(value)} separator="," />
  );

  const hasPermission = (apiPath: string, method: string) => {
    return permissions?.find(
      (item: any) => item.apiPath === apiPath && item.method === method,
    );
  };

  const dashboardItems = [
    {
      title: "Users",
      statisticTitle: "Total Users",
      value: data?.totalUsers || 0,
      permission: ALL_PERMISSIONS.USERS.GET_PAGINATE,
      color: "#003eb3",
      bg: "#91caff",
      link: "/admin/user",
    },
    {
      title: "Roles",
      statisticTitle: "Total Roles",
      value: data?.totalRoles || 0,
      permission: ALL_PERMISSIONS.ROLES.GET_PAGINATE,
      color: "#391085",
      bg: "#d3adf7",
      link: "/admin/role",
    },
    {
      title: "Jobs",
      statisticTitle: "Total Jobs",
      value: data?.totalJobs || 0,
      permission: ALL_PERMISSIONS.JOBS.GET_PAGINATE,
      color: "#135200",
      bg: "#b7eb8f",
      link: "/admin/job",
    },
    {
      title: "Companies",
      statisticTitle: "Total Companies",
      value: data?.totalCompanies || 0,
      permission: ALL_PERMISSIONS.COMPANIES.GET_PAGINATE,
      color: "#873800",
      bg: "#ffd591",
      link: "/admin/company",
    },
    {
      title: "Resumes",
      statisticTitle: "Total Resumes",
      value: data?.totalResumes || 0,
      permission: ALL_PERMISSIONS.RESUMES.GET_PAGINATE,
      color: "#780650",
      bg: "#ffadd2",
      link: "/admin/resume",
    },
    {
      title: "Skills",
      statisticTitle: "Total Skills",
      value: data?.totalSkills || 0,
      permission: ALL_PERMISSIONS.SKILLS.GET_PAGINATE,
      color: "#0050b3",
      bg: "#bae0ff",
      link: "/admin/job",
    },
  ];

  const pieData = [
    { type: "Users", value: data?.totalUsers || 0 },
    { type: "Roles", value: data?.totalRoles || 0 },
    { type: "Jobs", value: data?.totalJobs || 0 },
    { type: "Companies", value: data?.totalCompanies || 0 },
    { type: "Resumes", value: data?.totalResumes || 0 },
    { type: "Skills", value: data?.totalSkills || 0 },
  ];

  const pieConfig = {
    data: pieData,
    angleField: "value",
    colorField: "type",
    radius: 0.8,
    label: {
      type: "outer",
    },
    interactions: [
      {
        type: "element-active",
      },
    ],
  };

  return (
    <>
      <Row gutter={[20, 20]}>
        {dashboardItems.map((item, index) => {
          const canView = hasPermission(
            item.permission.apiPath,
            item.permission.method,
          );

          if (!canView) return null;

          return (
            <Col span={24} md={8} key={index}>
              <Card
                title={item.title}
                bordered={false}
                hoverable
                onClick={() => navigate(item.link)}
                style={{
                  background: item.bg,
                  borderRadius: 12,
                  cursor: "pointer",
                  transition: "all 0.25s",
                }}
                bodyStyle={{
                  padding: 24,
                }}
              >
                <Statistic
                  title={item.statisticTitle}
                  value={item.value}
                  formatter={formatter}
                  valueStyle={{
                    color: item.color,
                    fontSize: 30,
                    fontWeight: "bold",
                  }}
                />
              </Card>
            </Col>
          );
        })}
      </Row>

      {/* PIE CHART */}
      <Row style={{ marginTop: 40 }}>
        <Col span={24}>
          <Card title="System Overview">
            <Pie {...pieConfig} />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default DashboardPage;
