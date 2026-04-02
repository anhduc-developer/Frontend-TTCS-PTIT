import axios from "./axios.customize";
const fetchAllUsers = (params) => {
    return axios.get("/api/v1/users", {
        params: {
            ...params,
            ...(params.filter && {
                filter: params.filter,
            }),
        },
    });
};
const callPutUser = (data) => {
    const URL_BACKEND = `/api/v1/users`;
    return axios.put(URL_BACKEND, data);
};

const createUserAPI = (data) => {
    const URL_BACKEND = `/api/v1/users`;
    return axios.post(URL_BACKEND, data);
};
const callDeleteUser = (id) => {
    const URL_BACKEND = `/api/v1/users/${id}`;
    return axios.delete(URL_BACKEND);
};
const fetchAllRoles = (params) => {
    return axios.get("/api/v1/roles", {
        params: {
            ...params,
            ...(params.filter && { filter: params.filter }),
        },
    });
};
const fetchAllCompanies = (params) => {
    return axios.get("/api/v1/companies", {
        params: {
            ...params,
            ...(params.filter && {
                filter: params.filter,
            }),
        },
    });
};
const callDeleteCompany = (id) => {
    const URL_BACKEND = `/api/v1/companies/${id}`;
    return axios.delete(URL_BACKEND);
};

const createCompanyAPI = (data) => {
    const URL_BACKEND = `/api/v1/companies`;
    return axios.post(URL_BACKEND, data);
};
const handleUploadFile = (file, folder) => {
    const URL_BACKEND = `/api/v1/files`;

    const bodyFormData = new FormData();
    bodyFormData.append("file", file);
    bodyFormData.append("folder", folder);

    return axios.post(URL_BACKEND, bodyFormData);
};

const callPutCompany = (data) => {
    const URL_BACKEND = `/api/v1/companies`;
    return axios.put(URL_BACKEND, data);
};

const fetchAllSkills = (params) => {
    return axios.get("/api/v1/skills", {
        params: {
            ...params,
            ...(params.filter && {
                filter: params.filter
            })
        }
    });
};
const createJobAPI = (data) => {
    const URL_BACKEND = `/api/v1/jobs`;
    return axios.post(URL_BACKEND, data);
};
const fetchAllJobs = (params) => {
    return axios.get("/api/v1/jobs", {
        params: {
            ...params,
            ...(params.filter && {
                filter: params.filter,
            }),
        },
    });
};
const callDeleteJob = (id) => {
    const URL_BACKEND = `/api/v1/jobs/${id}`;
    return axios.delete(URL_BACKEND);
};
const callPutJob = (data) => {
    const URL_BACKEND = `/api/v1/jobs`;
    return axios.put(URL_BACKEND, data);
};
const fetchAllResumes = (params) => {
    return axios.get("/api/v1/resumes", {
        params: {
            ...params,
            ...(params.filter && {
                filter: params.filter,
            }),
        },
    });
};
const callDeleteResume = (id) => {
    const URL_BACKEND = `api/v1/resumes/${id}`;
    return axios.delete(URL_BACKEND);
};
const callPutResume = (data) => {
    const URL_BACKEND = "/api/v1/resumes";
    return axios.put(URL_BACKEND, data);
};
const callDownloadFileAPI = (fileName, folder) => {
    const URL_BACKEND = `/api/v1/folders?fileName=${fileName}&folder=${folder}`;
    return axios.get(URL_BACKEND, {
        responseType: "blob",
    });
};
const fetchAllPermissions = (params) => {
    return axios.get("/api/v1/permissions", {
        params: {
            ...params,
            ...(params.filter && {
                filter: params.filter,
            }),
        },
    });
};
const createPermissionAPI = (data) => {
    const URL_BACKEND = `/api/v1/permissions`;
    return axios.post(URL_BACKEND, data);
};
const callDeletePermissionAPI = (id) => {
    const URL_BACKEND = `/api/v1/permissions/${id}`;
    return axios.delete(URL_BACKEND);
};
const callPutPermissionAPI = (data) => {
    const URL_BACKEND = `/api/v1/permissions`;
    return axios.put(URL_BACKEND, data);
};
const callDeleteRoleAPI = (id) => {
    const URL_BACKEND = `/api/v1/roles/${id}`;
    return axios.delete(URL_BACKEND);
};
const createRoleAPI = (data) => {
    const URL_BACKEND = `/api/v1/roles`;
    return axios.post(URL_BACKEND, data);
};
const callPutRoleAPI = (data) => {
    const URL_BACKEND = `/api/v1/roles`;
    return axios.put(URL_BACKEND, data);
};
const callDashboard = () => {
    const URL_BACKEND = `/api/v1/dashboard`;
    return axios.get(URL_BACKEND);
};
const callDeleteSkill = (id) => {
    const URL_BACKEND = `/api/v1/skills/${id}`;
    return axios.delete(URL_BACKEND)
}
const createSkill = (data) => {
    const URL_BACKEND = '/api/v1/skills';
    return axios.post(URL_BACKEND, data)
}
const callPutSkill = (data) => {
    const URL_BACKEND = '/api/v1/skills';
    return axios.put(URL_BACKEND, data)
}
const callLogin = (data) => {
    const URL_BACKEND = '/api/v1/auth/login';
    return axios.post(URL_BACKEND, data)
}
const callGetAccount = () => {
    return axios.get(`/api/v1/auth/account`);
}
const callResgister = (data) => {
    return axios.post(`/api/v1/auth/register`, data);
}
const callUpdateUserInfo = (data) => {
    return axios.put(`/api/v1/users/profile`, data);
}
export const callChangePassword = (oldPassword, newPassword) => {
    return axios.post('/api/v1/users/change-password', {
        oldPassword,
        newPassword
    });
}
export const callFetchResumeByUser = (query = "page=1&size=10") => {
    return axios.post(`/api/v1/resumes/by-user?${query}`);
}
export const callCreateResume = (data) => {
    return axios.post(`/api/v1/resumes`, data)
}
export const callFetchCompanyById = (id) => {
    const URL_BACKEND = `/api/v1/companies/${id}`;
    return axios.get(URL_BACKEND);
}
export const callFetchJobById = (id) => {
    const URL_BACKEND = `/api/v1/jobs/${id}`;
    return axios.get(URL_BACKEND);

}
export const callCreateSubscriber = (data) => {
    const URL_BACKEND = `/api/v1/subscribers`;
    return axios.post(URL_BACKEND, data)

}
export const callUpdateSubscriber = (data) => {
    const URL_BACKEND = `/api/v1/subscribers`;
    return axios.post(URL_BACKEND, data)

}
export {
    fetchAllUsers,
    createUserAPI,
    fetchAllRoles,
    fetchAllCompanies,
    callPutUser,
    callDeleteUser,
    createCompanyAPI,
    handleUploadFile,
    callDeleteCompany,
    callPutCompany,
    fetchAllJobs,
    fetchAllSkills,
    createJobAPI,
    callDeleteJob,
    callPutJob,
    fetchAllResumes,
    callDeleteResume,
    callPutResume,
    callDownloadFileAPI,
    fetchAllPermissions,
    createPermissionAPI,
    callDeletePermissionAPI,
    callPutPermissionAPI,
    callDeleteRoleAPI,
    createRoleAPI,
    callPutRoleAPI,
    callDashboard,
    callDeleteSkill,
    createSkill,
    callPutSkill,
    callLogin,
    callGetAccount,
    callResgister
    , callUpdateUserInfo
};
