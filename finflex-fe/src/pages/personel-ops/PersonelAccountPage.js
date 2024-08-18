import React, { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import PersonelService from "./PersonelService";
import { toast } from "react-hot-toast";

const PersonelAccountPage = ({ personelData }) => {
  const navigate = useNavigate();
  const [fetchedPersonelData, setFetchedPersonelData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const fetchPersonelData = async () => {
      try {
        const data = await PersonelService.getUserByTckn(personelData.tckn);
        setFetchedPersonelData(data);
      } catch (error) {
        console.error("Error fetching personel data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPersonelData();
  }, [personelData.tckn]);

  const handleEditClick = () => {
    navigate("/dashboard/edit-personel", {
      state: { personelData: fetchedPersonelData || personelData },
    });
  };

  const handleDeleteClick = async () => {
    try {
      await PersonelService.deactivateUserByTckn(personelData.tckn);
      toast.success("Kullanıcı Silindi", {
        position: "top-right",
        autoClose: 100,
        hideProgressBar: false,
        progress: undefined,
        theme: "light",
      });
      navigate("/dashboard");
    } catch (error) {
      console.error("Error deleting personel:", error);
    } finally {
      setOpenDialog(false);
    }
  };

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };
  const handleBackClick = () => {
    navigate("/dashboard");
  };

  if (loading) {
    return <Typography variant="body1">Loading...</Typography>;
  }

  if (!fetchedPersonelData && !personelData) {
    return <Typography variant="body1">No data available</Typography>;
  }

  const dataToDisplay = fetchedPersonelData || personelData;

  return (
    <Paper
      sx={{
        p: 2,
        display: "flex",
        flexDirection: "column",
        height: "fit-content",
        marginTop: 5,
      }}
    >
      <Typography variant="h5" gutterBottom>
        Personel Bilgileri
      </Typography>
      <Box sx={{ mb: 2 }}>
        <Typography variant="body1">
          <strong>Kullanıcı Adı:</strong> {dataToDisplay.userName}
        </Typography>
        <Typography variant="body1">
          <strong>Ad:</strong> {dataToDisplay.firstName}
        </Typography>
        <Typography variant="body1">
          <strong>Soyad:</strong> {dataToDisplay.lastName}
        </Typography>
        <Typography variant="body1">
          <strong>E-Posta:</strong> {dataToDisplay.mailAddress}
        </Typography>
        <Typography variant="body1">
          <strong>TCKN:</strong> {dataToDisplay.tckn}
        </Typography>
        <Typography variant="body1">
          <strong>Personel No:</strong> {dataToDisplay.personelNumber}
        </Typography>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="outlined"
          color="secondary"
          sx={{ mr: 1 }}
          onClick={handleBackClick}
        >
          Ana Sayfaya Dön
        </Button>
        <Button
          variant="outlined"
          color="primary"
          sx={{ mr: 1 }}
          onClick={handleEditClick}
        >
          Düzenle
        </Button>
        <Button variant="outlined" color="error" onClick={handleDialogOpen}>
          Sil
        </Button>
      </Box>

      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Kullanıcıyı Sil</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bu kullanıcıyı silmek istediğinizden emin misiniz? Bu işlem geri
            alınamaz.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            İptal
          </Button>
          <Button onClick={handleDeleteClick} color="error">
            Sil
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default PersonelAccountPage;
