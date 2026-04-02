import { useEffect, useState } from "react";
import Home from "../../components/client/homes/Home";
import { fetchAllCompanies, fetchAllJobs } from "../../services/api.service";
import CompanyPage from "../../components/client/company/CompanyPage";

const HomePage = () => {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [jobData, setJobData] = useState([]);
  const [companyData, setCompanyData] = useState([]);
  const fetchJobsHomepage = async (params = {}) => {
    const res = await fetchAllJobs({
      page: page,
      size: 10000,
      ...params,
    });
    if (res.data) {
      setJobData(res.data.result);
    }
  };
  const fetchCompaniesHompage = async (params = {}) => {
    const res = await fetchAllCompanies({
      page: page,
      size: 100000,
      ...params,
    });
    if (res.data) {
      setCompanyData(res.data.result);
    }
  };
  useEffect(() => {
    fetchCompaniesHompage();
    fetchJobsHomepage();
  }, [page, size]);
  return <Home jobData={jobData} companyData={companyData} />;
};
export default HomePage;
