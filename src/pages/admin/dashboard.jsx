import { useContext, useEffect, useState } from "react";
import ViewDashboard from "../../components/admin/dashboard/view.dashboard";
import { callDashboard } from "../../services/api.service";
import { AuthContext } from "../../components/context/auth.context";
import { Spin } from "antd";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState([]);
  const { user } = useContext(AuthContext); // LẤY USER Ở ĐÂY
  const [loading, setLoading] = useState(true);
  const fetchDashboard = async () => {
    setLoading(true);
    const res = await callDashboard();
    if (res.data) {
      setDashboardData(res.data);
      console.log(">>> check data", res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) return <Spin tip="Đang tải thống kê..." />;

  return <ViewDashboard dashboardData={dashboardData} user={user} />;
};

export default Dashboard;
