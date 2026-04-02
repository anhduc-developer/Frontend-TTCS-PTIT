import axios from "axios";
import nProgress from "nprogress";

// 1. Cấu hình NProgress (Tùy chọn: tắt vòng xoay để trông chuyên nghiệp hơn)
nProgress.configure({
    showSpinner: false,
    speed: 500,
    trickleSpeed: 200
});

const instance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
});

instance.interceptors.request.use(
    function (config) {
        // 2. Chạy thanh loading khi bắt đầu gửi request
        nProgress.start();

        if (
            typeof window !== "undefined" &&
            window &&
            window.localStorage &&
            window.localStorage.getItem("access_token")
        ) {
            config.headers.Authorization =
                "Bearer " + window.localStorage.getItem("access_token");
        }
        return config;
    },
    function (error) {
        // 3. Kết thúc nếu có lỗi xảy ra ngay từ lúc gửi
        nProgress.done();
        return Promise.reject(error);
    },
);

// Add a response interceptor
instance.interceptors.response.use(
    function (response) {
        // 4. Kết thúc thanh loading khi nhận được phản hồi 2xx
        nProgress.done();

        if (response.data && response.data.data) {
            return response.data;
        }
        return response;
    },
    function (error) {
        // 5. Kết thúc thanh loading kể cả khi có lỗi (4xx, 5xx...)
        nProgress.done();

        if (error.response && error.response.data) return error.response.data;
        return Promise.reject(error);
    },
);

export default instance;