import { useEffect, useState } from "react";
import ViewCompany from "../../components/admin/company/view.company";
import { fetchAllCompanies } from "../../services/api.service";

const Company = () => {
  const [companyData, setCompanyData] = useState([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0); // Thêm state total
  const [loading, setLoading] = useState(false);

  const fetchCompanies = async (params = {}) => {
    setLoading(true);
    // Ưu tiên lấy giá trị từ params truyền vào (khi click chuyển trang)
    const currentPage = params.page || page;
    const currentSize = params.size || size;

    const res = await fetchAllCompanies({
      page: currentPage,
      size: currentSize,
      ...params,
    });

    if (res && res.data) {
      setCompanyData(res.data.result);
      setTotal(res.data.meta.total); // Lưu tổng số bản ghi

      // Cập nhật lại state để ViewCompany nhận được page/size mới nhất
      if (params.page) setPage(params.page);
      if (params.size) setSize(params.size);
    }
    setLoading(false);
  };

  // Chạy khi page hoặc size thay đổi
  useEffect(() => {
    fetchCompanies();
  }, [page, size]);

  return (
    <ViewCompany
      companyData={companyData}
      page={page}
      size={size}
      total={total} // Truyền total xuống
      loading={loading}
      fetchCompanies={fetchCompanies}
    />
  );
};

export default Company;
