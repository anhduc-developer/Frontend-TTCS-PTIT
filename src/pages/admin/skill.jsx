import { useEffect, useState } from "react";
import { fetchAllSkills } from "../../services/api.service";
import ViewSkill from "../../components/admin/skill/view.skill";

const Skill = () => {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [skillData, setSkillData] = useState([]);
  const fetchSkills = async (params = {}) => {
    const currentPage = params.page || page;
    const currentSize = params.size || size;
    const res = await fetchAllSkills({
      page: currentPage,
      size: currentSize,
      ...params,
    });
    if (res.data) {
      setSkillData(res.data.result);
      setTotal(res.data.meta?.total || 0);
      if (params.page) setPage(params.page);
      if (params.size) setSize(params.size);
    }
  };
  useEffect(() => {
    fetchSkills();
  }, [page, size]);
  return (
    <ViewSkill
      skillData={skillData}
      fetchSkills={fetchSkills}
      page={page}
      size={size}
      total={total}
    />
  );
};
export default Skill;
