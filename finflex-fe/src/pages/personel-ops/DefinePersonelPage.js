import React, { useState } from "react";
import Paper from "@mui/material/Paper";
import { Button, FormGroup, Grid, TextField, Alert } from "@mui/material";
import PersonelService from "./PersonelService";
import toast, { ToastBar, Toaster } from "react-hot-toast";

const DefinePersonelPage = () => {
  const [personelData, setPersonelData] = useState({
    firstName: "",
    lastName: "",
    mailAddress: "",
    tckn: "",
    address: "",
  });

  const [error, setError] = useState(null);
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const namePattern = /^[A-Za-zÇĞİıÖŞÜçğöşü]+(?:\s[A-Za-zÇĞİıÖŞÜçğöşü]+)*$/;
  const tcknPattern = /^[1-9][0-9]{9}[02468]$/;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setPersonelData((prevPersonelData) => ({
      ...prevPersonelData,
      [name]: value,
    }));
    console.log(personelData);
  };

  const handleSubmit = async () => {
    try {
      if (
        !emailPattern.test(personelData.mailAddress) ||
        !namePattern.test(personelData.firstName) ||
        !namePattern.test(personelData.lastName) ||
        !tcknPattern.test(personelData.tckn)
      ) {
        toast.error("Geçersiz Kullanıcı Bilgisi.");
        return;
      }

      await PersonelService.createUser(personelData);
      toast.success("Personel Başarıyla Kaydedildi.");
      toast.success("Personel bilgileri e-posta ile gönderildi.");
      handleReset();
    } catch (error) {
      toast.error(error.response?.data.message);
    }
  };

  const handleReset = () => {
    setPersonelData({
      firstName: "",
      lastName: "",
      mailAddress: "",
      tckn: "",
      address: "",
    });
    setError(null);
  };

  return (
    <React.Fragment>
      {error && <Alert severity="error">{error}</Alert>}
      <Alert severity="info">
        Personel tanımlamak için lütfen aşağıdaki alanları eksiksizce doldurun.
      </Alert>
      <Paper
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
          height: "fit-content",
          marginTop: 5,
        }}
      >
        <FormGroup component="form">
          <Grid container spacing={2}>
            <Grid item md={6}>
              <TextField
                required
                name="firstName"
                value={personelData.firstName}
                id="first-name-required"
                label="Ad"
                fullWidth
                onChange={handleChange}
              />
            </Grid>
            <Grid item md={6}>
              <TextField
                required
                name="lastName"
                value={personelData.lastName}
                id="last-name-required"
                label="Soyad"
                fullWidth
                onChange={handleChange}
              />
            </Grid>
            <Grid item md={6}>
              <TextField
                required
                name="mailAddress"
                value={personelData.mailAddress}
                id="mail-address-required"
                label="E-Posta"
                fullWidth
                onChange={handleChange}
              />
            </Grid>
            <Grid item md={6}>
              <TextField
                required
                name="tckn"
                value={personelData.tckn}
                id="tckn-required"
                label="TCKN"
                fullWidth
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={9}>
              <TextField
                required
                name="address"
                value={personelData.address}
                id="address-required"
                label="Adres"
                fullWidth
                multiline
                rows={4}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        </FormGroup>
        <div style={{ display: "flex", flexDirection: "row", paddingTop: 16 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            style={{ marginRight: 8 }}
          >
            Kaydet
          </Button>
          <Button variant="outlined" color="error" onClick={handleReset}>
            Sıfırla
          </Button>
        </div>
      </Paper>
    </React.Fragment>
  );
};

export default DefinePersonelPage;
