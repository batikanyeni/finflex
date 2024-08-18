import Paper from "@mui/material/Paper";
import React, {useEffect, useState} from "react";
import Grid from "@mui/material/Grid";
import {PieChart} from "@mui/x-charts/PieChart";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import classes from './CustomerAccountPage.module.css';
import {toast} from "react-hot-toast";
import {
    Alert,
    Chip,
    Dialog, DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select
} from "@mui/material";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import {useLocation} from "react-router-dom";
import axios from "axios";

const CustomerAccountPage = () => {
    const location = useLocation();
    const customer = location.state?.customer;

    const [accounts, setAccounts] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState({
        balance: 0,
        accountNo: '',
    })
    const [selectedAccountLabel,setSelectedAccountLabel] = useState('')
    const [chartData, setChartData] = useState([])

    const [inputValue,setInputValue] = useState();
    const [open, setOpen] = useState(false);
    const [curr, setCurr] = useState("");
    const [isCurrencyExisting, setIsCurrencyExisting] = useState(false);

    const fetchCustomerAccounts = () => {
        axios.get(`http://localhost:8081/api/v1/account/getCustomerAccountsByCustomerNumber/${customer.customerNumber}`)
            .then(res => {
                setAccounts(res.data)
                const formattedData = res.data.map((item, index) => ({
                    id: index,
                    value: item.balance,
                    label: item.currencyType
                }));
                setChartData(formattedData)
            }).catch(err => {
            console.log(err)
        })
    }

    useEffect(() => {
        fetchCustomerAccounts();
    }, []);

    useEffect(() => {
        const isExists = accounts.some(item => item.currencyType === curr);
        setIsCurrencyExisting(isExists)
    }, [accounts, curr]);

    const handleCreateNewAccount = () => {
        axios.post(`http://localhost:8081/api/v1/account/createAccount`, {
            currencyType: curr,
            customerNumber: customer.customerNumber,
        })
            .then(res => {
                fetchCustomerAccounts();
                setCurr("");
                console.log(res);
            })
            .catch(err => {
                console.log(err)
            })
    }

    const handleDepositMoney = () => {
        axios.post(`http://localhost:8081/api/v1/account/deposit-money/${selectedAccount.accountNo}/${inputValue}`)
            .then(res => {
                fetchCustomerAccounts()
                toast.success('Para yatırma işlemi başarılı')
            })
            .catch(err => {
                toast.error(err.response?.data.message);
                console.log(err)
            })
        handleClose();
    }

    const handleWithdrawMoney = () => {
        axios.post(`http://localhost:8081/api/v1/account/withdraw-money/${selectedAccount.accountNo}/${inputValue}`)
            .then(res => {
                fetchCustomerAccounts()
                toast.success('Para çekme işlemi başarılı')
                console.log(res)
            })
            .catch(err => {
                toast.error(err.response?.data.message);
                console.log(err)
            })
        handleClose();
    }

    const handleDeactivateAccount = () => {
        axios.delete(`http://localhost:8081/api/v1/account/deleteAccountByAccountNo/${selectedAccount.accountNo}`)
            .then(res => {
                toast.success("Hesap Pasif Duruma Alındı");
                fetchCustomerAccounts()
                console.log(res)
            })
            .catch(err => {
                toast.error("Bakiyesi Bulunan Hesaplar Pasife Alınamaz!")
                console.log(err)
            })
    }

    const handleInputValue = (event) => {
        setInputValue(event.target.value);
    }

    const handleChange = (event) => {
        setCurr(event.target.value);
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleAccountSelect = (item) => {
        setSelectedAccount(item);
        setSelectedAccountLabel(item.currencyType);
    }

    const handleClose = () => {
        setOpen(false);
        setInputValue("");
        setSelectedAccount({balance: 0,accountNo: ''});
        setSelectedAccountLabel('');
    };

    return(
        <React.Fragment>
            <Dialog
                open={open}
                onClose={handleClose}
            >
                <DialogTitle> {selectedAccount.currencyType} Hesap işlemi</DialogTitle>
                <DialogContent >
                    <Typography>
                        Bakiye: {selectedAccount.balance.toLocaleString()} {selectedAccount.currencyType}
                    </Typography>
                    <TextField
                        id="standard-number"
                        label="Miktar"
                        type="number"
                        value={inputValue}
                        onChange={handleInputValue}
                        sx = {{mt:3, mb:3}}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        inputProps={{min:0}}
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>İptal</Button>
                    <Button
                        variant='outlined'
                        color='success'
                        disabled={inputValue <= 0 || !inputValue}
                        onClick={() => handleDepositMoney()}
                    >
                        Para Yatır
                    </Button>
                    <Button
                        disabled={inputValue > parseFloat(selectedAccount.balance) || inputValue <= 0 || !inputValue}
                        variant='outlined'
                        color='warning'
                        onClick={() => handleWithdrawMoney()}
                    >
                        Para Çek
                    </Button>
                </DialogActions>
            </Dialog>
            <Grid container spacing={2}>
                <Grid item xs={12} md={7}>
                    <Paper
                        sx={{
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            height: 'fit-content'
                        }}
                    >
                        <h2>Müşteri Hesapları</h2>
                        <Chip label={"Müşteri: " + customer.firstName + " " + customer.lastName} variant="outlined" />
                        <Container className={classes['account-container']}>
                            {accounts.map((item) => (
                                <Typography key={item.currencyType} onClick={() => handleAccountSelect(item) }
                                            className={`${classes['accounts']} 
                                            ${selectedAccount.accountNo === item.accountNo ? classes['selectedAccount'] : ''}`}
                                >
                                    {item.currencyType} hesabı: {item.balance.toLocaleString()} {item.currencyType}
                                </Typography>
                            ))}
                        </Container>
                        <Grid container spacing={2}>
                            <Grid item md={6} mt={5}>
                                <Button onClick={handleClickOpen} fullWidth disabled={selectedAccount.accountNo === ''} variant='outlined' color="info">
                                    İşlem Yap
                                </Button>
                            </Grid>
                            <Grid item md={6} mt={5}>
                                <Button fullWidth disabled={selectedAccount.accountNo === '' || selectedAccountLabel === 'TRY'} onClick={() => handleDeactivateAccount()} variant="outlined" color="error">
                                    Hesabı Pasife Al
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={5}>
                    <Paper
                        sx={{
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%'
                        }}
                    >
                        <Box sx={{ flexGrow: 1 }}>
                            <h2>Hesap Ekle</h2>
                            <FormControl variant="standard" sx={{ m: 1, minWidth: 120,width: '80%' }}>
                                <InputLabel id="demo-simple-select-standard-label">Hesap Türü</InputLabel>
                                <Select
                                    labelId="demo-simple-select-standard-label"
                                    id="demo-simple-select-standard"
                                    value={curr}
                                    onChange={handleChange}
                                    label="accounttype"
                                >
                                    <MenuItem value={'USD'}>USD</MenuItem>
                                    <MenuItem value={'EUR'}>EUR</MenuItem>
                                    <MenuItem value={'GBP'}>GBP</MenuItem>
                                    <MenuItem value={'CAD'}>CAD</MenuItem>
                                </Select>
                            </FormControl>
                            <Alert className={classes[!isCurrencyExisting ? 'alert-hidden':' ']} severity="warning">Bu döviz hesabı müşteriye zaten tanımlı!</Alert>
                        </Box>
                        <Button disabled = {isCurrencyExisting || curr === ""} onClick={() => handleCreateNewAccount()} fullWidth variant="outlined" color="info">
                            Hesap Ekle
                        </Button>

                    </Paper>
                </Grid>
                <Grid item xs={12} md={12}>
                    <Paper
                        sx={{
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            height: 'fit-content'
                        }}
                    >
                        <h2>Hesap Döviz Oranları</h2>
                        <PieChart
                            series={[
                                {
                                    data: chartData,
                                    highlightScope: { faded: 'global', highlighted: 'item' },
                                    faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                                },
                            ]}
                            height={200}
                        />
                    </Paper>
                </Grid>
            </Grid>
        </React.Fragment>
    )
}

export default CustomerAccountPage;