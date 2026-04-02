import { useEffect, useState } from "react";
import ViewJob from "../../components/admin/job/view.job";
import {
  fetchAllCompanies,
  fetchAllJobs,
  fetchAllSkills,
} from "../../services/api.service";

const Job = () => {
  const [jobData, setJobData] = useState([]);
  const [companyData, setCompanyData] = useState([]);
  const [skillData, setSkillData] = useState([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);
  const fetchJobs = async (params = {}) => {
    const currentPage = params.page || page;
    const currentSize = params.size || size;
    const res = await fetchAllJobs({
      page: currentPage,
      size: currentSize,
      ...params,
    });
    if (res.data) {
      setJobData(res.data.result.reverse());
      setTotal(res.data.meta?.total || 0);
      if (params.page) setPage(params.page);
      if (params.size) setSize(params.size);
    }
  };
  const fetchCompanies = async () => {
    const res = await fetchAllCompanies({ page, size });
    if (res.data) {
      setCompanyData(res.data.result);
    }
  };
  const fetchSkills = async () => {
    const res = await fetchAllSkills({ page, size });
    if (res.data) {
      setSkillData(res.data.result);
    }
  };
  useEffect(() => {
    fetchCompanies();
    fetchJobs();
    fetchSkills();
  }, [page, size]);
  return (
    <ViewJob
      page={page}
      size={size}
      total={total}
      skillData={skillData}
      jobData={jobData}
      fetchJobs={fetchJobs}
      companyData={companyData}
      setPage={setPage}
      setSize={setSize}
    />
  );
};
export default Job;
