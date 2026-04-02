import React, { useEffect, useState } from "react";
import { Layout } from "antd";
import { Outlet, useLocation } from "react-router-dom";
import AppHeader from "./header.client";
import AppFooter from "./footer.client";
import { fetchAllSkills } from "../../../services/api.service";

const { Content, Footer } = Layout;

const ClientLayout = () => {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const [skillsData, setSkillsData] = useState([]);
  useEffect(() => {
    const fetchSkills = async () => {
      const res = await fetchAllSkills({
        page: 1,
        size: 1000,
        params: {},
      });
      if (res.data) {
        setSkillsData(res.data.result);
      }
    };
    fetchSkills();
  }, []);
  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* 🔥 truyền isHome xuống Header */}
      <AppHeader isHome={isHome} />

      <Layout>
        <Content style={{ margin: "16px" }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: "#fff",
              borderRadius: "8px",
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>

      <Footer style={{ padding: 0 }}>
        <AppFooter skillsData={skillsData} />
      </Footer>
    </Layout>
  );
};

export default ClientLayout;
