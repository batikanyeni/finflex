import axios from 'axios';
import {getAuthTokenFromStorage, removeAuthTokenFromStorage} from "./auth-store";

const axiosInstance = (baseURL) => {
    const instance = axios.create({
        baseURL,
    });

    instance.interceptors.request.use(
        (config) => {
            const token = getAuthTokenFromStorage();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            } else {
                console.error('Not authenticated');
                return Promise.reject(new Error('Not authenticated'));
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    instance.interceptors.response.use(
        (response) => {
            return response;
        },
        (error) => {
            if (error.response.status === 401 || error.response.status === 403) {
                console.error('Not authenticated');
                removeAuthTokenFromStorage();
                return Promise.reject(new Error('Not authenticated'));
            }
            return Promise.reject(error);
        }
    );

    return instance;
};

const axiosInstanceAccount = axiosInstance('http://localhost:8081/api/v1/account');
const axiosInstanceAuth = axiosInstance('http://localhost:8080/api/v1/auth');
const axiosInstanceUsers = axiosInstance('http://localhost:8080/api/v1/users');
const axiosInstanceTransaction = axiosInstance('http://localhost:8081/api/v1/transaction');
export { axiosInstanceAccount, axiosInstanceAuth, axiosInstanceTransaction, axiosInstanceUsers };