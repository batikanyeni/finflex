import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import React from "react";
import {useLocation} from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CustomerInfo = (props) => {
    const location = useLocation();
    const navigate = useNavigate();
    const customer = location.state?.customer;
    const customerType = customer.customerType;

    const deactivateCustomer = (customerNo) => {
        axios.delete(`http://localhost:8081/api/v1/customer/deleteCustomerByCustomerNo/${customerNo}`)
            .then(res => {
                console.log(res)
                toast.success('Müşteri Hesabı Pasife Alındı!')
                navigate('/dashboard/müsteri-yonetim');
            }).catch(err => {
                console.log(err)
                toast.error(err.response?.data.message);
            });
    }

    return(
        <Container>
            <Grid container sx={{height:'100%', width: '100%'}}  spacing={2}>
                <Grid item md={12}>
                    <Paper
                        sx={{
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            height: 'fit-content',
                            paddingBottom: 5
                        }}
                    >
                        <h2>Müşteri Bilgileri</h2>
                        <Grid container spacing={2}>
                            <Grid item mt={2} xs={12} md={6}>
                                {customerType === 'B' && (
                                    <TextField
                                        id="standard-read-only-input"
                                        label="İsim Soyisim"
                                        defaultValue={customer.firstName + " " + customer.lastName}
                                        fullWidth
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                        variant="standard"
                                    />
                                )}
                                {customerType === 'K' && (
                                    <TextField
                                        id="standard-read-only-input"
                                        label="Yetkili İsim Soyisim"
                                        defaultValue={customer.firstName}
                                        fullWidth
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                        variant="standard"
                                    />
                                )}
                            </Grid>
                            {customerType === 'K' && (
                                <Grid item mt={2} xs={12} md={6}>
                                    <TextField
                                        id="standard-read-only-input"
                                        label="Firma İsmi"
                                        fullWidth
                                        defaultValue={customer.lastName}
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                        variant="standard"
                                    />
                                </Grid>
                            )}
                            <Grid item mt={2} xs={12} md={6}>
                                <TextField
                                    id="standard-read-only-input"
                                    label="Adres"
                                    fullWidth
                                    defaultValue={customer.fullAddress}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    variant="standard"
                                />
                            </Grid>
                            <Grid item mt={2} xs={12} md={6}>
                                <TextField
                                    id="standard-read-only-input"
                                    label="Müşteri No"
                                    defaultValue={customer.customerNumber}
                                    fullWidth
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    variant="standard"
                                />
                            </Grid>
                            <Grid item mt={2} xs={12} md={6}>
                                <TextField
                                    id="standard-read-only-input"
                                    label="İl"
                                    fullWidth
                                    defaultValue={customer.city}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    variant="standard"
                                />
                            </Grid>
                            <Grid item mt={2} xs={12} md={6}>
                                <TextField
                                    id="standard-read-only-input"
                                    label="E-Posta"
                                    defaultValue={customer.email}
                                    fullWidth
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    variant="standard"
                                />
                            </Grid>
                            <Grid item mt={2} xs={12} md={6}>
                                <TextField
                                    id="standard-read-only-input"
                                    label="İlçe"
                                    fullWidth
                                    defaultValue={customer.district}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    variant="standard"
                                />
                            </Grid>

                            <Grid item mt={2} xs={12} md={6}>
                                <TextField
                                    id="standard-read-only-input"
                                    label={customer.tckn ? 'TCKN' : ''  || customer.vkn ? 'VKN' : '' || customer.ykn ? 'YKN' : ''}
                                    defaultValue={customer.tckn || customer.vkn || customer.ykn}
                                    fullWidth
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    variant="standard"
                                />
                            </Grid>
                            <Grid item mt={2} xs={12} md={6}>
                                <TextField
                                    id="standard-read-only-input"
                                    label="Posta Kodu"
                                    fullWidth
                                    defaultValue={customer.postalCode}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    variant="standard"
                                />
                            </Grid>
                            <Grid item mt={2} xs={12} md={6}>
                                <TextField
                                    id="standard-read-only-input"
                                    label="Telefon Numarası"
                                    fullWidth
                                    defaultValue={customer.phoneNumber}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    variant="standard"
                                />
                            </Grid>
                            {customerType === 'B' && (
                                <Grid item mt={2} xs={12} md={6}>
                                </Grid>
                            )}
                            <Grid  item mt={4} xs={12} md={6}>
                                <Button onClick={() => deactivateCustomer(customer.customerNumber)} variant="outlined" color="error">
                                    Müşteriyi Pasife Al
                                </Button>
                            </Grid>
                            <Grid item sx={{textAlign:'right'}}  mt={4} xs={12} md={6}>
                                <Button onClick={props.accountsClick} variant="outlined" color="info">
                                    Hesapları Görüntüle
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    )

}

export default CustomerInfo;

