import axios from "axios";
import toast from "react-hot-toast";

const BASE_URL = "http://localhost:8080/api/v1/users";
const AUTH_URL = "http://localhost:8080/api/v1/auth";

const axiosInstancePersonel = axios.create({
    baseURL: BASE_URL,
    timeout: 5000,
    headers: {
        "Content-Type": "application/json",
    },
});

axiosInstancePersonel.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        console.error("Request error:", error);
        throw error;
    }
);

const getAllUsers = async () => {
    try {
        const response = await axiosInstancePersonel.get("/getAllUsers");
        return response;
    } catch (error) {
        console.error("Error fetching all users:", error);
        throw error;
    }
};

const getUserByTckn = async (tckn) => {
    try {
        const response = await axiosInstancePersonel.get("/getUserByTCKN", {
            params: { tckn },
        });
        return response;
    } catch (error) {
        console.error("Error fetching user by TCKN:", error);
        throw error;
    }
};

const createUser = async (userData) => {
    try {
        const response = await axiosInstancePersonel.post("/createUser", userData);
        return response.data;
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
};

const updateUser = async (userData) => {
    try {
        const response = await axiosInstancePersonel.put("/updateUser", userData);
        return response.data;
    } catch (error) {
        console.error("Error updating user:", error);
        throw error;
    }
};

const deactivateUserByTckn = async (tckn) => {
    try {
        const response = await axiosInstancePersonel.delete(
            "/deleteAccountByTCKN",
            {
                params: { tckn },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error deactivating user by TCKN:", error);
        throw error;
    }
};
const changePassword = async (username, oldPassword, newPassword, token) => {
    try {
        const response = await axios.post(
            AUTH_URL + "/changePass",
            {
                username,
                oldPassword,
                newPassword,
                token,
            },
            {
                headers: {
                    Authorization: `${token}`,
                },
            }
        );
        if (response.status === 200) {
            toast.success("Şifre değiştirme başarılı");
        }
        return response.data;
    } catch (error) {
        console.error("Error changing password:", error);
        throw error;
    }
};
const PersonelService = {
    getAllUsers,
    getUserByTckn,
    createUser,
    updateUser,
    deactivateUserByTckn,
    changePassword,
};

export default PersonelService;
