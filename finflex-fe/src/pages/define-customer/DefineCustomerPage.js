import Paper from "@mui/material/Paper";
import React, {useMemo, useState} from "react";
import axios from "axios";
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {
    Alert, Checkbox,
    FormControl, FormControlLabel,
    FormGroup, FormLabel,
    InputLabel,
    MenuItem,
    Select,
    useMediaQuery
} from "@mui/material";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import {useTheme} from "@emotion/react";
import toast, {Toaster} from "react-hot-toast";
import {axiosInstanceAccount, axiosInstanceAuth} from "../../store/axios-instance";


const steps = ['Müşteri Bilgileri', 'Adres Bilgileri', 'Döviz Hesabı Seç'];
const StepContent = ({customerType,setCustomerType,companyFormData,personFormData,setCompanyFormData,setPersonFormData, step }) => {
    const [state, setState] = React.useState({
        USD: false,
        EUR: false,
        GBP: false,
        CAD:false,
    });

    const { USD, EUR, GBP,CAD } = state;
    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/i;
    const phoneRegex = /^0?[1-9]\d{9,14}$/;
    const postalNoRegex = /^[A-Za-z0-9\s-]{3,10}$/;
    const identityRegex = /^(^$|[1-9]{11})$/;
    const vknRegex = /^(^$|[1-9]{10})$/;
    const [emailError, setEmailError] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [postalError, setPostalError] = useState('');
    const [identityError,setIdentityError] = useState('');
    const [vknError,setVknError] = useState('');
    const error = [USD, EUR, GBP,CAD].filter((v) => v).length < 1;
    const handleChange = (event) => {
        setCustomerType(event.target.value);

    };
    const validateEmail = (email) => {
        if (!emailRegex.test(email)) {
            setEmailError('Yanlış email formatı');
        } else {
            setEmailError('');
        }
    };
    const validatePhone = (phone) => {
        if (!phoneRegex.test(phone)) {
            setPhoneError('Yanlış telefon no formatı');
        } else {
            setPhoneError('');
        }
    };
    const validatePostalNo = (postalNo) => {
        if (!postalNoRegex.test(postalNo)) {
            setPostalError('Yanlış posta kodu formatı');
        } else {
            setPostalError('');
        }
    };
    const validateIdentity = (identity) => {
        if (!identityRegex.test(identity)) {
            setIdentityError('11 rakam gerekli');
        } else {
            setIdentityError('');
        }
    };
    const validateVkn = (vkn) => {
        if (!vknRegex.test(vkn)) {
            setVknError('10 rakam gerekli');
        } else {
            setVknError('');
        }
    };
    //Tüzel Müşteri fonksiyonları
    const handleCompanyNameChange = (event) => {
        setCompanyFormData({
            ...companyFormData,
            'lastName': event.target.value
        });
    }
    const handleVKNChange = (event) => {
        validateVkn(event.target.value);
        setCompanyFormData({
            ...companyFormData,
            'vkn': event.target.value
        });
    }
    const handleAuthorisedCustomerNameChange = (event) => {
        setCompanyFormData({
            ...companyFormData,
            'firstName': event.target.value
        });
    }
    const handleAuthorisedCustomerTelChange = (event) => {
        validatePhone(event.target.value);
        setCompanyFormData({
            ...companyFormData,
            'phoneNumber': event.target.value
        });
    }
    const handleAuthorisedCustomerEmailChange = (event) => {
        validateEmail(event.target.value)
        setCompanyFormData({
            ...companyFormData,
            'email': event.target.value
        });
    }
    //Bireysel Müşteri Fonksiyonları
    const handleNameChange = (event) => {
        setPersonFormData({
            ...personFormData,
            'firstName': event.target.value
        });
    }
    const handleLastNameChange = (event) => {
        setPersonFormData({
            ...personFormData,
            'lastName': event.target.value
        });
    }
    const handleTCKNChange = (event) => {
        validateIdentity(event.target.value);
        setPersonFormData({
            ...personFormData,
            'tckn': event.target.value
        });
    }
    const handleYKNChange = (event) => {
        validateIdentity(event.target.value);
        setPersonFormData({
            ...personFormData,
            'ykn': event.target.value
        });
    }

    const handleTelNoChange = (event) => {
        validatePhone(event.target.value);
        setPersonFormData({
            ...personFormData,
            'phoneNumber': event.target.value
        });
    }
    const handleEmailChange = (event) => {
        validateEmail(event.target.value)
        setPersonFormData({
            ...personFormData,
            'email': event.target.value
        });
    }
    //Ortak alan fonksiyonları
    const handleAddressChange = (event) => {
        if(customerType === "Kurumsal"){
            setCompanyFormData({
                ...companyFormData,
                'fullAddress': event.target.value
            });
        }
        else{
            setPersonFormData({
                ...personFormData,
                'fullAddress': event.target.value
            });
        }
    }
    const handleCityChange = (event) => {
        if(customerType === "Kurumsal"){
            setCompanyFormData({
                ...companyFormData,
                'city': event.target.value
            });
        }
        else{
            setPersonFormData({
                ...personFormData,
                'city': event.target.value
            });
        }
    }
    const handleDistrictChange = (event) => {
        if(customerType === "Kurumsal"){
            setCompanyFormData({
                ...companyFormData,
                'district': event.target.value
            });
        }
        else{
            setPersonFormData({
                ...personFormData,
                'district': event.target.value
            });
        }
    }
    const handlePostalCodeChange = (event) => {
        validatePostalNo(event.target.value);
        if(customerType === "Kurumsal"){
            setCompanyFormData({
                ...companyFormData,
                'postalCode': event.target.value
            });
        }
        else{
            setPersonFormData({
                ...personFormData,
                'postalCode': event.target.value
            });
        }
    }
    const handleCurrencyChoose = (event) => {
        const { name, checked } = event.target;
        const updatedState = {
            ...state,
            [name]: checked,
        };
        const selectedCurrencies = Object.keys(updatedState).filter((key) => updatedState[key])
            .map((currency) => ({ currencyType: currency }));

        setState(updatedState);

        if(customerType === "Kurumsal"){
            setCompanyFormData({
                ...companyFormData,
                'accounts': selectedCurrencies
            });
        }
        else{
            setPersonFormData({
                ...personFormData,
                'accounts': selectedCurrencies
            });
        }
    }

    switch (step) {
        case 0:
            return <Typography>

                <FormControl variant="standard" sx={{ mt:2,mb:2, minWidth: 120 }}>
                    <InputLabel id="demo-simple-select-standard-label">Müşteri Tipi</InputLabel>
                    <Select
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        value={customerType}
                        onChange={handleChange}
                        label="customerType"
                    >
                        <MenuItem value={'Kurumsal'}>Tüzel</MenuItem>
                        <MenuItem value={'Bireysel'}>Bireysel</MenuItem>

                    </Select>
                </FormControl>
                {customerType === 'Kurumsal' && (
                    <FormGroup component = 'form'>
                        <Grid container spacing={2}>
                            <Grid item md={6}>
                                <TextField
                                    required
                                    value={companyFormData.lastName}
                                    id="company-name-required"
                                    label="Firma Adı"
                                    fullWidth
                                    onChange={handleCompanyNameChange}
                                />
                            </Grid>
                            <Grid item md={6}>
                                <TextField
                                    required
                                    value={companyFormData.vkn}
                                    error={!!vknError}
                                    helperText={vknError}
                                    id="vkn-required"
                                    label="Vergi Numarası"
                                    fullWidth
                                    onChange={handleVKNChange}
                                />
                            </Grid>
                            <Grid item md={6}>
                                <TextField
                                    required
                                    value={companyFormData.firstName}
                                    id="customer-name-required"
                                    label="Yetkili Kişi Adı Soyadı"
                                    fullWidth
                                    onChange={handleAuthorisedCustomerNameChange}
                                />
                            </Grid>
                            <Grid item md={6}>
                                <TextField
                                    required
                                    value={companyFormData.phoneNumber}
                                    id="customer-tel-required"
                                    label="Yetkili Kişi Tel No"
                                    error={!!phoneError}
                                    helperText={phoneError}
                                    fullWidth
                                    onChange={handleAuthorisedCustomerTelChange}
                                />
                            </Grid>
                            <Grid item md={6}>
                                <TextField
                                    required
                                    value={companyFormData.email}
                                    id="customer-email-required"
                                    label="Yetkili Kişi E-Posta"
                                    error={!!emailError}
                                    helperText={emailError}
                                    fullWidth
                                    onChange={handleAuthorisedCustomerEmailChange}
                                />
                            </Grid>
                        </Grid>
                    </FormGroup>
                )}
                {customerType === 'Bireysel' && (
                    <FormGroup>
                        <Grid container spacing={2}>
                            <Grid item md={6}>
                                <TextField
                                    required
                                    value={personFormData.name}
                                    id="name-required"
                                    label="Ad"
                                    fullWidth
                                    onChange={handleNameChange}

                                />
                            </Grid>
                            <Grid item md={6}>
                                <TextField
                                    required
                                    value={personFormData.lastname}
                                    id="lastname-required"
                                    label="Soyad"
                                    fullWidth
                                    onChange={handleLastNameChange}
                                />
                            </Grid>
                            <Grid item md={6}>
                                <TextField
                                    value={personFormData.tckn}
                                    error={!!identityError}
                                    helperText={identityError}
                                    id="tc"
                                    label="TC No"
                                    fullWidth
                                    disabled={personFormData.ykn}
                                    onChange={handleTCKNChange}
                                />
                            </Grid>
                            <Grid item md={6}>
                                <TextField
                                    value={personFormData.ykn}
                                    error={!!identityError}
                                    helperText={identityError}
                                    id="ykn"
                                    label="YKN No"
                                    fullWidth
                                    disabled={personFormData.tckn}
                                    onChange={handleYKNChange}
                                />
                            </Grid>
                            <Grid item md={6}>
                                <TextField
                                    required
                                    value={personFormData.phoneNumber}
                                    error={!!phoneError}
                                    helperText={phoneError}
                                    id="customer-tel-required"
                                    label="Tel No"
                                    fullWidth
                                    onChange={handleTelNoChange}
                                />
                            </Grid>
                            <Grid item md={6}>
                                <TextField
                                    required
                                    value={personFormData.email}
                                    id="customer-email-required"
                                    label="E-Posta"
                                    error={!!emailError}
                                    helperText={emailError}
                                    fullWidth
                                    onChange={handleEmailChange}
                                />
                            </Grid>
                        </Grid>
                    </FormGroup>

                )}
            </Typography>;
        case 1:
            return <Typography>
                <FormGroup  sx={{ mt:2,mb:2}}>
                    <Grid container spacing={2}>
                        <Grid item md={6}>
                            <TextField
                                required
                                value={customerType === 'Kurumsal' ? companyFormData.address: personFormData.address}
                                id="adres"
                                label="Adres"
                                fullWidth
                                onChange={handleAddressChange}
                            />
                        </Grid>
                        <Grid item md={6}>
                            <TextField
                                required
                                value={customerType === 'Kurumsal' ? companyFormData.city: personFormData.city}
                                id="il"
                                label="İl"
                                fullWidth
                                onChange={handleCityChange}
                            />
                        </Grid>
                        <Grid item md={6}>
                            <TextField
                                required
                                value={customerType === 'Kurumsal' ? companyFormData.district: personFormData.district}
                                id="ilce"
                                label="İlçe"
                                fullWidth
                                onChange={handleDistrictChange}
                            />
                        </Grid>
                        <Grid item md={6}>
                            <TextField
                                required
                                value={customerType === 'Kurumsal' ? companyFormData.postalCode: personFormData.postalCode}
                                error={!!postalError}
                                helperText={postalError}
                                id="posta-kod"
                                label="Posta Kodu"
                                fullWidth
                                onChange={handlePostalCodeChange}
                            />
                        </Grid>
                    </Grid>
                </FormGroup>
            </Typography>;
        case 2:
            return <Typography>
                <FormControl
                    required
                    error={error}
                    component="fieldset"
                    sx={{ m: 3 }}
                    variant="standard"
                >
                    <FormLabel component="legend">En az 1 tane seçiniz</FormLabel>
                    <FormGroup>
                        <FormControlLabel
                            control={
                                <Checkbox checked={USD} onChange={handleCurrencyChoose} name="USD" />
                            }
                            label="USD"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox checked={EUR} onChange={handleCurrencyChoose} name="EUR" />
                            }
                            label="EUR"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox checked={GBP} onChange={handleCurrencyChoose} name="GBP" />
                            }
                            label="GBP"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox checked={CAD} onChange={handleCurrencyChoose} name="CAD" />
                            }
                            label="CAD"
                        />
                    </FormGroup>
                </FormControl>
            </Typography>;
        // Add more cases for additional steps
        default:
            return null;
    }
};
const DefineCustomerPage = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [customerType, setCustomerType] = useState('Kurumsal');
    const theme = useTheme();
    const [message,setMessage] = useState('');
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const [personFormData, setPersonFormData] = useState({
        customerType: 'B',
        firstName: null,
        lastName: null,
        tckn: null,
        ykn : null,
        phoneNumber: null,
        email: null,
        fullAddress: null,
        city: null,
        district: null,
        postalCode: null,
        accounts: [],
    });
    const [companyFormData, setCompanyFormData] = useState({
        customerType: 'K',
        lastName: null,
        vkn: null,
        firstName: null,
        phoneNumber: null,
        email: null,
        fullAddress: null,
        city: null,
        district: null,
        postalCode: null,
        accounts: []
    });
    const initialPersonFormData = {
        customerType: 'B',
        firstName: null,
        lastName: null,
        tckn: null,
        ykn: null,
        phoneNumber: null,
        email: null,
        fullAddress: null,
        city: null,
        district: null,
        postalCode: null,
        accounts: []

    };
    const initialCompanyFormData = {
        customerType: 'K',
        lastName: null,
        vkn: null,
        firstName: null,
        phoneNumber: null,
        email: null,
        fullAddress: null,
        city: null,
        district: null,
        postalCode: null,
        accounts: []
    };


    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };
    const handleFinish = async () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        const sendData=customerType==='Kurumsal'?companyFormData:personFormData;
        console.log(sendData)
      axios.post(`http://localhost:8081/api/v1/customer/createCustomer`,sendData)
          .then(res =>{
              console.log("Success",res.data)
              setMessage('');
              toast.success('Müşteri Sisteme Eklendi')
          }).catch(err=>{
              console.log(err)
              setMessage(err.response?.data.message);
              toast.error(err.response?.data.message);
      })
        if(customerType === "Kurumsal"){
            console.log(companyFormData)
        }
        else{
            console.log(personFormData)
        }

    }

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
        setPersonFormData(initialPersonFormData);
        setCompanyFormData(initialCompanyFormData);
        setMessage('');
    };
    const isButtonDisabled = useMemo(() => {
        if(customerType === 'Bireysel'){
            if (activeStep === 0) {
                return !personFormData.firstName || !personFormData.lastName || (!personFormData.tckn && !personFormData.ykn) ||  !personFormData.phoneNumber || !personFormData.email;
            } else if (activeStep === 1) {
                return !personFormData.fullAddress || !personFormData.city || !personFormData.district ||  !personFormData.postalCode;
            } else if (activeStep === 2) {
                return personFormData.accounts.length < 1;
            }
        }else if (customerType === 'Kurumsal'){
            if (activeStep === 0) {
                return !companyFormData.firstName || !companyFormData.lastName || !companyFormData.vkn ||  !companyFormData.phoneNumber || !companyFormData.email;
            } else if (activeStep === 1) {
                return !companyFormData.fullAddress || !companyFormData.city || !companyFormData.district ||  !companyFormData.postalCode;
            } else if (activeStep === 2) {
                return companyFormData.accounts.length < 1;
            }
        }


    }, [companyFormData,customerType,activeStep,personFormData]);

    return(
        <React.Fragment>
            <Alert severity="info">Müşteri tanımlamak için lütfen aşağıdaki adımları eksiksizce tamamlayın.</Alert>
            <Paper
                sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 'fit-content',
                    marginTop: 5
                }}
            >
                <Box sx={{ width: '100%' }}>
                    <Stepper activeStep={activeStep} orientation={isSmallScreen ? 'vertical' : 'horizontal'} >
                        {steps.map((label, index) => {
                            const stepProps = {};
                            const labelProps = {};
                            return (
                                <Step key={label} {...stepProps}>
                                    <StepLabel {...labelProps}>{label}</StepLabel>
                                </Step>
                            );
                        })}
                    </Stepper>
                    {activeStep === steps.length ? (
                        <React.Fragment>
                            <Typography sx={{ mt: 2, mb: 1 }}>
                                {message ? message : 'Bütün adımlar tamamlandı!'}
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                                <Box sx={{ flex: '1 1 auto' }} />
                                <Button variant="outlined" color="success" onClick={handleReset}>SIFIRLA</Button>
                            </Box>
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            <StepContent customerType={customerType} setCustomerType={setCustomerType} companyFormData={companyFormData} personFormData={personFormData} setCompanyFormData={setCompanyFormData} setPersonFormData={setPersonFormData} step={activeStep} />
                            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                                <Button
                                    color="inherit"
                                    disabled={activeStep === 0}
                                    onClick={handleBack}
                                    sx={{ mr: 1 }}
                                >
                                    GERİ
                                </Button>
                                <Box sx={{ flex: '1 1 auto' }} />

                                {activeStep === steps.length - 1 && (
                                    <Button disabled={isButtonDisabled} onClick={handleFinish}>
                                        BİTİR
                                    </Button>
                                )}
                                {activeStep !== steps.length - 1 && (
                                    <Button disabled={isButtonDisabled} sx={{ mr:5}} onClick={handleNext}>
                                        İLERİ
                                    </Button>
                                )}
                                {activeStep !== 0 &&(
                                    <Button variant="outlined" color="error" onClick={handleReset}>SIFIRLA</Button>)}

                            </Box>
                        </React.Fragment>
                    )}
                </Box>
            </Paper>
        </React.Fragment>
    )
}

export default DefineCustomerPage;