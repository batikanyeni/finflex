import React, {useEffect, useState} from "react";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import {
    Alert,
    Dialog, DialogActions,
    DialogContent, DialogContentText,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Tooltip
} from "@mui/material";
import classes from "./CustomerForexTransactionPage.module.css";
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import useMediaQuery from "@mui/material/useMediaQuery";
import {useTheme} from "@mui/material/styles";
import {useLocation} from "react-router-dom";
import axios from "axios";
import {getDecodedPersonelNumber, getDecodedPersonelTckn} from "../../store/auth-store";
import {toast, Toaster} from "react-hot-toast";


const CustomerForexTransactionPage = () => {
    const location = useLocation();
    const customer = location.state?.customer;
    const userTckn = getDecodedPersonelTckn();
    const [accounts, setAccounts] = useState([]);
    const [open, setOpen] = React.useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const [sourceAcc,setSourceAcc] = useState('');
    const [targetAcc,setTargetAcc] = useState('');
    const [sourceAccNo,setSourceAccNo] = useState(0);
    const [targetAccNo,setTargetAccNo] = useState(0);
    const [amount,setAmount] = useState();
    const [parityRate, setParityRate] = useState(0);

    const fetchCustomerAccounts = () => {
        axios.get(`http://localhost:8081/api/v1/account/getCustomerAccountsByCustomerNumber/${customer.customerNumber}`)
            .then(res => {
                setAccounts(res.data)
            }).catch(err => {
            console.log(err)
        })
    }
    const fetchExchangeRate = () => {
        if((targetAcc !== '' && sourceAcc !== '') && targetAcc !== sourceAcc){
            axios.get(`http://localhost:8081/api/v1/exchange-rates/get-exchange-rates`, {
                params: {
                    currencyPair: targetAcc+sourceAcc
                }
            })
                .then(res => {
                    setParityRate(res?.data.rate);
                }).catch(err => {
                console.log(err.response?.data);
            })
        }
    }
    const doTransaction = () => {
        const userNo = getDecodedPersonelNumber();
        const requestBody = {
            customerTckn: customer.tckn || '',
            customerYkn : customer.ykn || '',
            customerVkn : customer.vkn || '',
            userTCKN: userTckn,
            sourceAccountNo:sourceAccNo,
            targetAccountNo:targetAccNo,
            amount : amount*1,
            userNo : userNo
        }
        axios.post(`http://localhost:8081/api/v1/transaction/createTransaction`,requestBody)
            .then(res => {
                console.log('Transaction successful:', res.data);
                fetchCustomerAccounts();
                toast.success('İşlem başarıyla gerçekleşti!')
            }).catch(err => {
            toast.error(err.response?.data.message);


        });
        setAmount("");
        handleClose();
    }
    useEffect(() => {
        fetchExchangeRate();
    }, [sourceAcc,targetAcc]);

    useEffect(() => {
        fetchCustomerAccounts();
        console.log("Customer data:", customer);
    }, []);

    const customRounder = (num) => {
        return Number.parseFloat(num).toFixed(2) * 1;
    }
    const handleSourceChange = (event) => {
        setSourceAcc(event.target.value);
        setSourceAccNo(getAccountNoByLabel(event.target.value));
    }
    const handleTargetChange = (event) => {
        setTargetAcc(event.target.value);
        setTargetAccNo(getAccountNoByLabel(event.target.value));
    }
    const getValueByLabel = (label) => {
        const foundItem = accounts.find(item => item.currencyType === label);
        return foundItem ? foundItem.balance : 0;
    };
    const getAccountNoByLabel = (label) => {
        const foundItem = accounts.find(item => item.currencyType === label);
        return foundItem ? foundItem.accountNo : 0;
    };
    const handleAmountChange = (event) => {
        setAmount(event.target.value);
    }
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const sourceAccBalanceCalc = () => {
        return getValueByLabel(sourceAcc)- customRounder((amount * parityRate) + ((amount * parityRate)*(3/100)));
    }
    const targetAccBalanceCalc = () => {
        return ((getValueByLabel(targetAcc)+ parseFloat(amount))).toLocaleString();
    }
    const findUniqueIdType = () => {
        if(customer.tckn !== null){
            return 'TCKN';
        }else if(customer.vkn !== null){
            return 'VKN';
        }else{
            return 'YKN';
        }
    }


    return(
        <React.Fragment>
            <Dialog
                fullScreen={fullScreen}
                open={open}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">
                    {"Transfer İşlemi"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <Grid container spacing={3}>
                            <Grid item md={12}>
                                <TextField
                                    id="standard-read-only-input"
                                    label={"İsim Soyisim "}
                                    defaultValue={customer.firstName+" "+ (customer.customerType !== 'K' ? customer.lastName:'')}
                                    fullWidth
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    variant="standard"
                                />

                            </Grid>
                            {customer.customerType === 'K' && (
                                <Grid item md={12}>
                                    <TextField
                                        id="standard-read-only-input"
                                        label="Firma İsmi"
                                        defaultValue= {customer.lastName}
                                        mt={3}
                                        fullWidth
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                        variant="standard"
                                    />
                                </Grid>
                            )}
                            <Grid item md={6} xs={12}>
                                <TextField
                                    id="standard-read-only-input"
                                    label="Harcama Yapılan Döviz Hesabı"
                                    defaultValue={sourceAcc}
                                    fullWidth
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    variant="standard"
                                />

                            </Grid>
                            <Grid item md={6} xs={12}>
                                <TextField
                                    id="standard-read-only-input"
                                    label="Harcanan Miktar"
                                    defaultValue={customRounder((amount * parityRate) + ((amount*parityRate)*(3/100)))}
                                    fullWidth
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    variant="standard"
                                />

                            </Grid>
                            <Grid item md={6} xs={12}>
                                <TextField
                                    id="standard-read-only-input"
                                    label="Alım Yapılan Döviz Hesabı"
                                    defaultValue={targetAcc}
                                    fullWidth
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    variant="standard"
                                />
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <TextField
                                    id="standard-read-only-input"
                                    label="Alınan Miktar"
                                    defaultValue={amount}
                                    fullWidth
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    variant="standard"
                                />

                            </Grid>

                        </Grid>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button color="error" autoFocus onClick={handleClose}>
                        İptal
                    </Button>
                    <Button color="success" onClick={doTransaction} autoFocus>
                        Onayla
                    </Button>
                </DialogActions>
            </Dialog>
            <Grid container spacing={3}>
                <Grid item md={4} xs={12}>
                    <Paper
                        sx={{
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            height: 'fit-content',
                            marginTop: 5
                        }}
                    >
                        <h2>Müşteri Bilgileri</h2>
                        <Grid container  direction="column" spacing={6}>
                            <Grid item >
                                <TextField
                                    id="standard-read-only-input"
                                    label={"İsim Soyisim "}
                                    defaultValue={customer.firstName+" "+ (customer.customerType !== 'K' ? customer.lastName:'')}
                                    fullWidth
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    variant="standard"
                                />

                            </Grid>
                            {customer.customerType === 'K' && (
                                <Grid item>
                                    <TextField
                                        id="standard-read-only-input"
                                        label="Firma İsmi"
                                        defaultValue= {customer.lastName}
                                        mt={3}
                                        fullWidth
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                        variant="standard"
                                    />
                                </Grid>
                            )}
                            <Grid item>
                                <TextField
                                    id="standard-read-only-input"
                                    label="Müşteri Numarası"
                                    defaultValue= {customer.customerNumber}
                                    mt={3}
                                    fullWidth
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    variant="standard"
                                />
                            </Grid>
                            <Grid item>
                                <TextField
                                    id="standard-read-only-input"
                                    label={"Müşteri " + findUniqueIdType()}
                                    defaultValue={customer.tckn || customer.vkn  || customer.ykn ||  ''}
                                    mt={3}
                                    fullWidth
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    variant="standard"
                                />

                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
                <Grid item md={8}>
                    <Paper
                        sx={{
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            height: 'fit-content',
                            marginTop: 5
                        }}
                    >
                        <Grid container spacing={3}>
                            <Grid item md={12}>
                                <h2>İşlem Penceresi</h2>
                            </Grid>
                            <Grid item md={5} xs={12}>
                                <FormControl fullWidth variant="standard" sx={{ m: 1, minWidth: 120 }}>
                                    <InputLabel id="demo-simple-select-filled-label">Kaynak Hesap</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-filled-label"
                                        id="source-acc-select"
                                        value={sourceAcc}
                                        onChange={handleSourceChange}
                                    >
                                        {accounts.map((account) => (
                                            <MenuItem key = {account.accountNo} value={account?.currencyType}>{account?.currencyType}</MenuItem>
                                        ))}

                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item sx={{textAlign: 'center'}} md={2}>
                                <Box visibility={((sourceAcc === '' || targetAcc === '') || (sourceAcc === targetAcc)) ? 'hidden':'visible'} p={1}>
                                    <Tooltip title='Parite Oranı'>
                                        <React.Fragment>
                                            <CurrencyExchangeIcon sx={{color:'#FFA500'}}/>
                                            <Typography sx={{color:'#FFA500',fontSize:'large'}}>{parityRate}</Typography>
                                        </React.Fragment>
                                    </Tooltip>
                                </Box>
                            </Grid>
                            <Grid item md={5} xs={12}>
                                <FormControl fullWidth variant="standard" sx={{ m: 1, minWidth: 120 }}>
                                    <InputLabel id="demo-simple-select-filled-label">Hedef Hesap</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-filled-label"
                                        id="target-acc-select"
                                        value={targetAcc}
                                        onChange={handleTargetChange}
                                    >

                                        {accounts.map((account) => (
                                            <MenuItem key = {account.accountNo} value={account?.currencyType}>{account?.currencyType}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <Grid item md={7}>
                                </Grid>
                                <Grid visibility={(targetAcc !== '' && sourceAcc !== targetAcc) ? 'visible' : 'hidden'} item md={12} xs={12}
                                      sx={{m: 1, minWidth: 120}}>
                                    <FormControl  fullWidth>
                                        <TextField
                                            id="standard-number"
                                            label="Miktar"
                                            value={amount}
                                            onChange={handleAmountChange}
                                            type="number"
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            inputProps={{min:0}}
                                            variant="standard"
                                        />
                                        <p className={classes['info-p']}>İşlemden %3 komisyon kesilir</p>
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <Grid item md={6}>
                                <Alert className={classes[(sourceAcc === '' || sourceAcc === targetAcc) ? 'alert-hidden' : '']} variant="outlined"
                                       severity="info">
                                    {sourceAcc} hesabı
                                    Bakiye: {getValueByLabel(sourceAcc).toLocaleString()} {amount > 0 && (<React.Fragment>
                                    {<Typography color='#FF0000'>- ({customRounder(amount * parityRate)} + {<Tooltip title={'%3 komisyon'}>{customRounder((amount * parityRate)*(3/100))}</Tooltip>}) = {customRounder((amount * parityRate)+((amount * parityRate)*(3/100)))}</Typography>} <br/>
                                    Yeni bakiye: {sourceAccBalanceCalc().toLocaleString()}
                                </React.Fragment>)}
                                </Alert>
                            </Grid>
                            <Grid item md={6}>
                                <Alert className={classes[(targetAcc === '' || sourceAcc === targetAcc) ? 'alert-hidden':'']} variant="outlined" severity="info">
                                    {targetAcc} hesabı bakiye: {getValueByLabel(targetAcc).toLocaleString()} {amount > 0 && (<React.Fragment>
                                    {<Typography color='#588739'>+{amount}</Typography>} <br/>
                                    Yeni bakiye: {targetAccBalanceCalc()}
                                </React.Fragment>)}
                                </Alert>
                            </Grid>
                            <Grid display={(!(sourceAcc === targetAcc)) ? 'none':'grid'}  item md={12}>
                                <Alert variant="outlined" severity="error">
                                    Aynı hesaplar arası transfer yapılamaz.
                                </Alert>
                            </Grid>
                        </Grid>
                        <Grid item md={12}  mt={5} >
                            <Button onClick={handleClickOpen} disabled={((sourceAcc === '' || targetAcc === '') || (sourceAcc === targetAcc)) || ((sourceAccBalanceCalc() < 0) || amount <= 0) || !amount} fullWidth variant="outlined" color='success'>Transfer Yap</Button>
                        </Grid>

                    </Paper>
                </Grid>

            </Grid>

        </React.Fragment>


    )
}


export default CustomerForexTransactionPage;