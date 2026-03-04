import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { callFetchAccount } from "@/config/api";

/* ================= TYPES ================= */

interface IPermission {
  id: string;
  name: string;
  apiPath: string;
  method: string;
  module: string;
}

interface IRole {
  id?: string;
  name?: string;
  permissions?: IPermission[];
}

export interface IUser {
  id: string;
  email: string;
  name: string;
  gender?: string;
  address?: string;
  age?: number;
  role: IRole;
}

interface IState {
  isAuthenticated: boolean;
  isLoading: boolean;
  isRefreshToken: boolean;
  errorRefreshToken: string;
  user: IUser;
  activeMenu: string;
}

/* ================= DEFAULT USER ================= */

const defaultUser: IUser = {
  id: "",
  email: "",
  name: "",
  gender: undefined,
  address: undefined,
  age: undefined,
  role: {
    id: "",
    name: "",
    permissions: [],
  },
};

/* ================= THUNK ================= */

export const fetchAccount = createAsyncThunk(
  "account/fetchAccount",
  async () => {
    const response = await callFetchAccount();
    return response.data;
  },
);

/* ================= INITIAL STATE ================= */

const initialState: IState = {
  isAuthenticated: false,
  isLoading: true,
  isRefreshToken: false,
  errorRefreshToken: "",
  user: defaultUser,
  activeMenu: "home",
};

/* ================= SLICE ================= */

export const accountSlide = createSlice({
  name: "account",
  initialState,
  reducers: {
    setActiveMenu: (state, action: PayloadAction<string>) => {
      state.activeMenu = action.payload;
    },

    // Dùng khi login
    setUserLoginInfo: (state, action: PayloadAction<IUser>) => {
      state.isAuthenticated = true;
      state.isLoading = false;
      state.user = {
        ...defaultUser,
        ...action.payload,
      };
    },

    // Dùng khi update profile
    setUserProfile: (state, action: PayloadAction<Partial<IUser>>) => {
      state.user = {
        ...state.user,
        ...action.payload,
      };
    },

    setLogoutAction: (state) => {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      state.isAuthenticated = false;
      state.user = defaultUser;
    },

    setRefreshTokenAction: (
      state,
      action: PayloadAction<{ status?: boolean; message?: string }>,
    ) => {
      state.isRefreshToken = action.payload?.status ?? false;
      state.errorRefreshToken = action.payload?.message ?? "";
    },
  },

  extraReducers: (builder) => {
    builder.addCase(fetchAccount.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(fetchAccount.fulfilled, (state, action) => {
      state.isAuthenticated = true;
      state.isLoading = false;

      const user = action.payload?.user ?? action.payload;

      state.user = {
        ...defaultUser,
        ...user,
      };
    });

    builder.addCase(fetchAccount.rejected, (state) => {
      state.isAuthenticated = false;
      state.isLoading = false;
    });
  },
});

/* ================= EXPORT ================= */

export const {
  setActiveMenu,
  setUserLoginInfo,
  setLogoutAction,
  setRefreshTokenAction,
  setUserProfile,
} = accountSlide.actions;

export default accountSlide.reducer;
