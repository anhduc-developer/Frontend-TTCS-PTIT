// services/helper/permission.js
// services/helper/permission.js
export const hasPermission = (user, permission) => {
    if (!user || !user.role || !user.role.permissions) return false;

    // Admin mặc định thấy tất cả nút
    if (user.role.name === "ADMIN") return true;

    // Kiểm tra xem trong mảng permissions có cái nào khớp API + Method không
    return user.role.permissions.some(
        (p) => p.apiPath === permission.apiPath &&
            p.method === permission.method.toUpperCase()
    );
};
// Hàm bổ trợ check theo Module (dùng cho Menu/Sidebar)
export const hasModule = (user, moduleName) => {
    if (!user || !user.role || !user.role.permissions) return false;
    if (user.role.name === "ADMIN") return true;
    return user.role.permissions.some((p) => p.module === moduleName);
};