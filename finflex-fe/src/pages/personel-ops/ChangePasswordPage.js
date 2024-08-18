import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { getAuthTokenFromStorage } from "../../store/auth-store";
import PersonelService from "./PersonelService";
import { Toaster } from "react-hot-toast";

const ChangePasswordPage = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [username, setUsername] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const navigate = useNavigate();

  const passwordPattern =
    /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\S+$).{8,20}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setErrorMessage("Yeni şifreler eşleşmiyor.");
      return;
    }

    if (!passwordPattern.test(newPassword)) {
      setErrorMessage(
        "Yeni şifre en az 8-20 karakter uzunluğunda olmalı, en az bir büyük harf, bir küçük harf, bir rakam ve bir özel karakter içermelidir."
      );
      return;
    }

    const token = getAuthTokenFromStorage();

    if (!token) {
      setErrorMessage("Geçersiz oturum. Lütfen tekrar giriş yapın.");
      return;
    }

    try {
      await PersonelService.changePassword(
        username,
        oldPassword,
        newPassword,
        token
      );
      navigate("/dashboard");
    } catch (error) {
      console.error(error.response?.data.message);
      setErrorMessage(error.response.data.message);
    }
  };

  const handleMainPage = () => {
    navigate("/dashboard");
  };

  const togglePasswordVisibility = () => {
    setShowPasswords((prev) => !prev);
  };

  return (
    <React.Fragment>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 5000,
        }}
      />
      <Container component="main" maxWidth="xs">
        <Paper elevation={3} sx={{ padding: 2, marginTop: 4 }}>
          <Typography variant="h5" gutterBottom>
            Şifreyi Değiştir
          </Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Yeni şifre en az 8-20 karakter uzunluğunda olmalı, en az bir büyük
            harf, bir küçük harf, bir rakam ve bir özel karakter (@#$%^&+=)
            içermelidir.
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label="Kullanıcı Adı"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label="Mevcut Şifre"
              type={showPasswords ? "text" : "password"}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={togglePasswordVisibility} edge="end">
                      {showPasswords ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label="Yeni Şifre"
              type={showPasswords ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={togglePasswordVisibility} edge="end">
                      {showPasswords ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label="Yeni Şifreyi Onayla"
              type={showPasswords ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={togglePasswordVisibility} edge="end">
                      {showPasswords ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {errorMessage && (
              <Typography color="error" variant="body2">
                {errorMessage}
              </Typography>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ marginTop: 2 }}
            >
              Şifreyi Değiştir
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              sx={{ marginTop: 2 }}
              onClick={handleMainPage}
            >
              Ana Sayfaya Dön
            </Button>
          </form>
        </Paper>
      </Container>
    </React.Fragment>
  );
};

export default ChangePasswordPage;
