import { useEffect, useState } from "react";
import { fetchAllPermissions, fetchAllRoles } from "../../services/api.service";
import ViewRole from "../../components/admin/role/view.role";

const Role = () => {
  const [roleData, setRoleData] = useState([]);
  const [permissionData, setPermissionData] = useState([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0); // Thêm state total

  const fetchRoles = async (params = {}) => {
    // Ưu tiên lấy page/size từ params truyền vào (từ Table onChange)
    const currentPage = params.page || page;
    const currentSize = params.size || size;

    const res = await fetchAllRoles({
      page: currentPage,
      size: currentSize,
      ...params,
    });

    if (res && res.data) {
      setRoleData(res.data.result);
      setTotal(res.data.meta?.total || 0); // Gán tổng số bản ghi từ API

      // Cập nhật lại state để UI đồng bộ
      if (params.page) setPage(params.page);
      if (params.size) setSize(params.size);
    }
  };

  const fetchPermissions = async () => {
    // Lấy danh sách permission (thường để dùng trong Modal Create/Update)
    const res = await fetchAllPermissions({ page: 1, size: 100 });
    if (res?.data) {
      setPermissionData(res.data.result);
    }
  };

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, [page, size]);

  return (
    <ViewRole
      page={page}
      size={size}
      total={total} // Truyền total xuống
      roleData={roleData}
      permissionData={permissionData}
      fetchRoles={fetchRoles}
    />
  );
};

export default Role;
