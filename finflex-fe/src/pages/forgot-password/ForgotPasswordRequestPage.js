import Grid from "@mui/material/Grid";
import CssBaseline from "@mui/material/CssBaseline";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import React, {useState} from "react";
import axios from "axios";
import LockResetIcon from '@mui/icons-material/LockReset';
import {toast} from "react-hot-toast";
import Link from "@mui/material/Link";
import classes from "./ForgotPassword.module.css";

function ForgotPasswordRequestPage() {
    const defaultTheme = createTheme();
    const [mailAddress, setMailAddress] = useState("");

    const handleForgotPasswordRequest = async ()=> {
        if (mailAddress === "") {
            toast.error("Lütfen mail adresi girin.", {
                position: "top-center",
                autoClose: 100,
                hideProgressBar: false,
                progress: undefined,
                theme: "light",
            });
            return;
        }

        try {
            const response = await axios.post("http://localhost:8080/api/v1/auth/forgotPass", {
                mailAddress,
            });

            if(response.status === 200) {
                toast.success(response.data, {
                    position: "top-center",
                    autoClose: 100,
                    hideProgressBar: false,
                    progress: undefined,
                    theme: "light",
                });
            }
        } catch (error) {
            if (error.response.data.code === 1005) {
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
                            <LockResetIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Şifre Sıfırlama
                        </Typography>
                        <Box noValidate sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="mailAddress"
                                label="Mail Adresi"
                                type="email"
                                autoFocus
                                value={mailAddress}
                                onChange={(e) => setMailAddress(e.target.value)}
                            />
                            <Button
                                onClick={handleForgotPasswordRequest}
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                className={classes["send-btn"]}
                            >
                                Mail Gönder
                            </Button>
                            <Grid container spacing={0} direction="column" alignItems="center" justifyContent="center">
                                <Grid item md={4}>
                                    <Link href="/" variant="body2">
                                        Giriş Yap
                                    </Link>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </ThemeProvider>
    )
}

export default ForgotPasswordRequestPage;