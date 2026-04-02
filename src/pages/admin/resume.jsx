import { useEffect, useState } from "react";
import ViewResume from "../../components/admin/resume/view.resume";
import { fetchAllResumes } from "../../services/api.service";

const Resume = () => {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0); // Thêm total
  const [dataResumes, setDataResumes] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchResumes = async (params = {}) => {
    setLoading(true);
    // Ưu tiên giá trị từ params truyền vào
    const currentPage = params.page || page;
    const currentSize = params.size || size;

    const res = await fetchAllResumes({
      page: currentPage,
      size: currentSize,
      sort: "createdAt,desc", // Sắp xếp mới nhất lên đầu từ server
      ...params,
    });

    if (res && res.data) {
      setDataResumes(res.data.result);
      setTotal(res.data.meta.total);

      if (params.page) setPage(params.page);
      if (params.size) setSize(params.size);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchResumes();
  }, [page, size]);

  return (
    <ViewResume
      dataResumes={dataResumes}
      page={page}
      size={size}
      total={total}
      loading={loading}
      fetchResumes={fetchResumes}
    />
  );
};

export default Resume;
