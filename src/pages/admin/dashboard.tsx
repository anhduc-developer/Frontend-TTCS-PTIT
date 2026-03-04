import { Card, Col, Row, Statistic } from "antd";
import CountUp from "react-countup";
import { useEffect, useState } from "react";
import { callFetchDashboard } from "@/config/api";

const DashboardPage = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await callFetchDashboard();
      setData(res.data);
    } catch (error) {
      console.error("Error fetching dashboard", error);
    }
  };

  const formatter = (value: number | string) => (
    <CountUp end={Number(value)} separator="," />
  );

  return (
    <Row gutter={[20, 20]}>
      <Col span={24} md={8}>
        <Card title="Users" bordered={false}>
          <Statistic
            title="Total Users"
            value={data?.totalUsers || 0}
            formatter={formatter}
          />
        </Card>
      </Col>

      <Col span={24} md={8}>
        <Card title="Roles" bordered={false}>
          <Statistic
            title="Total Roles"
            value={data?.totalRoles || 0}
            formatter={formatter}
          />
        </Card>
      </Col>

      <Col span={24} md={8}>
        <Card title="Jobs" bordered={false}>
          <Statistic
            title="Total Jobs"
            value={data?.totalJobs || 0}
            formatter={formatter}
          />
        </Card>
      </Col>

      <Col span={24} md={8}>
        <Card title="Companies" bordered={false}>
          <Statistic
            title="Total Companies"
            value={data?.totalCompanies || 0}
            formatter={formatter}
          />
        </Card>
      </Col>

      <Col span={24} md={8}>
        <Card title="Resumes" bordered={false}>
          <Statistic
            title="Total Resumes"
            value={data?.totalResumes || 0}
            formatter={formatter}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default DashboardPage;
