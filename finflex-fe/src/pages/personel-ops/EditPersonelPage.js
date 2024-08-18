import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import { Button, FormGroup, Grid, TextField, Alert } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import PersonelService from "./PersonelService";

const EditPersonelPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const personelData = location.state?.personelData || {};
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const namePattern = /^[A-Za-zÇĞİıÖŞÜçğöşü]+(?:\s[A-Za-zÇĞİıÖŞÜçğöşü]+)*$/;

  const [updatedPersonelData, setUpdatedPersonelData] = useState({
    firstName: personelData.firstName || "",
    lastName: personelData.lastName || "",
    mailAddress: personelData.mailAddress || "",
    tckn: personelData.tckn || "",
    address: personelData.address || "",
  });

  useEffect(() => {
    setUpdatedPersonelData({
      firstName: personelData.firstName || "",
      lastName: personelData.lastName || "",
      mailAddress: personelData.mailAddress || "",
      tckn: personelData.tckn || "",
      address: personelData.address || "",
    });
  }, [personelData]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUpdatedPersonelData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (
        !emailPattern.test(updatedPersonelData.mailAddress) ||
        !namePattern.test(updatedPersonelData.firstName) ||
        !namePattern.test(updatedPersonelData.lastName)
      ) {
        toast.error("Geçersiz Kullanıcı Bilgisi.");
        return;
      }
      await PersonelService.updateUser(updatedPersonelData);
      toast.success("Kullanıcı Başarıyla Güncellendi", {
        position: "top-right",
        autoClose: 100,
        hideProgressBar: false,
        progress: undefined,
        theme: "light",
      });
      navigate("/dashboard");
      window.location.reload();
    } catch (error) {
      toast.error(error.response?.data.message);
      console.error("Update error:", error);
    }
  };

  return (
    <React.Fragment>
      <Alert severity="info">
        Personel bilgilerini güncellemek için lütfen aşağıdaki alanları
        düzenleyin.
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
                value={updatedPersonelData.firstName}
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
                value={updatedPersonelData.lastName}
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
                value={updatedPersonelData.mailAddress}
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
                value={updatedPersonelData.tckn}
                id="tckn-required"
                label="TCKN"
                fullWidth
                onChange={handleChange}
                disabled
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <TextField
                required
                name="address"
                value={updatedPersonelData.address}
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
            Güncelle
          </Button>
        </div>
      </Paper>
    </React.Fragment>
  );
};

export default EditPersonelPage;
