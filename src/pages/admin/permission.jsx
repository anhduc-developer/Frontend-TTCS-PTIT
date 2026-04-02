import { useEffect, useState } from "react";
import ViewPermission from "../../components/admin/permission/view.permission";
import { fetchAllPermissions } from "../../services/api.service";

const Permission = () => {
  const [permissionData, setPermissionData] = useState([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0); // Thêm state total

  const fetchPermissions = async (params = {}) => {
    // Ưu tiên lấy giá trị từ params truyền vào (đối với hành động chuyển trang/đổi size)
    const currentPage = params.page || page;
    const currentSize = params.size || size;

    const res = await fetchAllPermissions({
      page: currentPage,
      size: currentSize,
      ...params,
    });

    if (res && res.data) {
      setPermissionData(res.data.result);
      setTotal(res.data.meta?.total || 0); // Lấy tổng số bản ghi từ meta

      // Cập nhật lại state cha để đồng bộ giao diện
      if (params.page) setPage(params.page);
      if (params.size) setSize(params.size);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, [page, size]);

  return (
    <ViewPermission
      page={page}
      size={size}
      total={total} // Truyền total xuống con
      permissionData={permissionData}
      fetchPermissions={fetchPermissions}
    />
  );
};

export default Permission;
