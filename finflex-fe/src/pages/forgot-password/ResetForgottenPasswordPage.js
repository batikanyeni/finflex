import React, {useState} from "react";
import axios from "axios";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import {useNavigate, useSearchParams} from "react-router-dom";
import Grid from "@mui/material/Grid";
import CssBaseline from "@mui/material/CssBaseline";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import PasswordIcon from '@mui/icons-material/Password';
import classes from "./ForgotPassword.module.css";
import {toast} from "react-hot-toast";

function ResetForgottenPasswordPage () {
    const defaultTheme = createTheme();
    const navigate=useNavigate();
    const [searchParams] = useSearchParams();
    const [newPassword, setNewPassword] = useState("");

    const handleResetForgottenPasswordRequest = async ()=> {
        if (newPassword === "") {
            toast.error("Lütfen yeni şifre girin.", {
                position: "top-center",
                autoClose: 100,
                hideProgressBar: false,
                progress: undefined,
                theme: "light",
            });
            return;
        }

        try {
            const token = searchParams.get('token');
            if (token) {
                const response = await axios.put(`http://localhost:8080/api/v1/tokens/change-password-mail?token=${token}`, {
                    newPassword
                })

                if (response.status === 200) {
                    toast.success(response.data, {
                        position: "top-center",
                        autoClose: 100,
                        hideProgressBar: false,
                        progress: undefined,
                        theme: "light",
                    });
                    navigate("/");
                }
            } else {
                toast.error("Token boş.", {
                    position: "top-center",
                    autoClose: 100,
                    hideProgressBar: false,
                    progress: undefined,
                    theme: "light",
                });
            }
        } catch (error) {
            if (error.response.data.code === 1009 || error.response.data.code === 1006 || error.response.data.code === 1010  || error.response.data.code === 1007) {
                toast.error(error.response.data.message, {
                    position: "top-center",
                    autoClose: 100,
                    hideProgressBar: false,
                    progress: undefined,
                    theme: "light",
                });
            }
        }
    }

    return (
        <ThemeProvider theme={defaultTheme}>
            <Grid container sx={{ height: '100vh', backgroundColor: '#185a65' }}>
                <CssBaseline />
                <Grid item xs={12} sm={8} md={5} sx={{ margin: '0 auto 0 auto' }} component={Paper} elevation={6} square>
                    <Box
                        sx={{
                            my: 8,
                            mx: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Avatar
                            sx={{
                                m: 1,
                                backgroundColor: "#185a65",
                            }}
                        >
                            <PasswordIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Yeni Şifre Oluştur
                        </Typography>
                        <Box noValidate sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="newPassword"
                                label="Yeni Şifre"
                                type="password"
                                autoFocus
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <Button
                                onClick={handleResetForgottenPasswordRequest}
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                className={classes["send-btn"]}
                            >
                                Bitti
                            </Button>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </ThemeProvider>
    )
}

export default ResetForgottenPasswordPage;