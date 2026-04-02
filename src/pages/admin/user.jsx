import { useEffect, useState, useCallback } from "react";
import {
  fetchAllCompanies,
  fetchAllRoles,
  fetchAllUsers,
} from "../../services/api.service";
import ViewUser from "../../components/admin/user/view.user";

const UserAdmin = () => {
  const [userData, setUserData] = useState([]);
  const [roleData, setRoleData] = useState([]);
  const [companyData, setCompanyData] = useState([]);

  // State quản lý phân trang
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // Cập nhật hàm fetchUsers để nhận params linh hoạt
  const fetchUsers = async (params = {}) => {
    setLoading(true);

    // Ưu tiên dùng page/size từ params truyền vào, nếu không có mới dùng state
    const currentPage = params.page || page;
    const currentSize = params.size || size;

    const res = await fetchAllUsers({
      page: currentPage,
      size: currentSize,
      ...params, // bao gồm cả filter nếu có
    });

    if (res && res.data) {
      setUserData(res.data.result);
      setTotal(res.data.meta.total); // Lưu tổng số bản ghi để phân trang

      // Cập nhật ngược lại state nếu params có thay đổi
      if (params.page) setPage(params.page);
      if (params.size) setSize(params.size);
    }
    setLoading(false);
  };

  const fetchRoles = async () => {
    // Roles thường ít, có thể fetch 100 cái để làm dropdown
    const res = await fetchAllRoles({ page: 1, size: 100 });
    if (res?.data) setRoleData(res.data.result);
  };

  const fetchCompanies = async () => {
    // Tương tự Roles, lấy danh sách công ty để chọn khi tạo User
    const res = await fetchAllCompanies({ page: 1, size: 100 });
    if (res?.data) setCompanyData(res.data.result);
  };

  // Chỉ chạy 1 lần khi mount để lấy dữ liệu tĩnh
  useEffect(() => {
    fetchRoles();
    fetchCompanies();
  }, []);

  // Chạy khi page hoặc size thay đổi
  useEffect(() => {
    fetchUsers();
  }, [page, size]);

  return (
    <ViewUser
      userData={userData}
      total={total}
      page={page}
      size={size}
      roleData={roleData}
      companyData={companyData}
      fetchUsers={fetchUsers}
      loading={loading}
    />
  );
};

export default UserAdmin;
