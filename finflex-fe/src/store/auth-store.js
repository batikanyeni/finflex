import jwt_decode from "jwt-decode";

export const setAuthToken = (token) => {
    localStorage.setItem("token", token);
};
export const setTempToken = (tempToken) => {
    sessionStorage.setItem("temp-token", tempToken);
};
export const getAuthTokenFromStorage = () => {
    return localStorage.getItem("token");
};
export const getTempTokenFromStorage = () => {
    return sessionStorage.getItem("temp-token");
};
function isJWT(token) {
    const parts = token.split(".");
    return Array.isArray(parts) && parts.length === 3;
}
export const getDecodedAuthToken = () => {
    const token = getAuthTokenFromStorage();
    const decodedToken = jwt_decode(token);
    return decodedToken;
};
export const removeAuthTokenFromStorage = () => {
    localStorage.removeItem("token");
};
export const removeTokenFromStorage = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("Tckn");
};
export const removeTempTokenFromStorage = () => {
    sessionStorage.removeItem("temp-token");
};
export const authTokenCheck = () => {
    const token = localStorage.getItem("token");
    return token !== null && isJWT(token);
};
export const setResetAuthToken = (token) => {
    localStorage.setItem("reset-token", token);
};
export const getResetAuthToken = () => {
    return localStorage.getItem("reset-token");
};
export const getDecodedRole = () => {
    const decodedToken = getDecodedAuthToken();
    const role = decodedToken.role;
    return role;
};
export const getDecodedCustomerTckn = () => {
    const decodedToken = getDecodedAuthToken();
    return decodedToken.tckn;
};
export const isAdminUser = () => {
    const role = getDecodedRole();
    return role === "ADMIN";
};
export const getDecodedPersonelTckn = () => {
    const decodedToken = getDecodedAuthToken();
    return decodedToken.tckn;
};
export const getDecodedPersonelNumber = () => {
    const decodedToken = getDecodedAuthToken();
    return decodedToken.personelNumber;
}
