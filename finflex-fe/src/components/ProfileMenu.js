import React, { useState, useEffect } from "react";
import {
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import LockIcon from "@mui/icons-material/Lock";
import PersonelService from "../pages/personel-ops/PersonelService";
import { getDecodedPersonelTckn } from "../store/auth-store";

const ProfileMenu = (props) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [personelData, setPersonelData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPersonelData = async () => {
      try {
        const tckn = getDecodedPersonelTckn();
        const data = await PersonelService.getUserByTckn(tckn);
        setPersonelData(data);
      } catch (error) {
        console.error("Error fetching personel data:", error);
        setError(error.message || "Unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchPersonelData();
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEditProfileClick = () => {
    if (personelData) {
      navigate(`/dashboard/edit-personel/`, {
        replace: true,
        state: { personelData },
      });
      console.log("Edit Profile clicked");
    } else {
      console.error("No personnel data available to edit.");
    }
    handleClose();
  };

  const handleChangePasswordClick = () => {
    handleClose();
    navigate("/change-password");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const nameWithoutSpaces =
    `${personelData?.firstName}${personelData?.lastName}`.replace(/\s/g, "");
  const nameLength = nameWithoutSpaces.length;

  const menuWidth = nameLength > 10 ? 300 : 200;
  return (
    <div>
      <IconButton onClick={handleClick}>
        <Avatar
          {...stringAvatar(`${props.userFirstName} ${props.userLastName}`)}
        />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          elevation: 1,
          sx: {
            width: `${menuWidth}px`,
            padding: "10px",
          },
        }}
      >
        <MenuItem>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              maxWidth: "100%",
              width: "fit-content",
            }}
          >
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{ wordWrap: "break-word", width: "fit-content" }}
            >
              {personelData?.firstName} {personelData?.lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Kullanıcı Adı: {personelData?.userName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Personel No: {personelData?.personelNumber}
            </Typography>
          </Box>
        </MenuItem>
        <MenuItem onClick={handleEditProfileClick}>
          <EditIcon fontSize="small" sx={{ marginRight: "10px" }} />
          Profili Düzenle
        </MenuItem>
        <MenuItem onClick={handleChangePasswordClick}>
          <LockIcon fontSize="small" sx={{ marginRight: "10px" }} />
          Şifreyi Değiştir
        </MenuItem>
      </Menu>
    </div>
  );
};

const stringToColor = (string) => {
  let hash = 0;
  let i;

  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }

  return color;
};

const stringAvatar = (name) => {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
  };
};

export default ProfileMenu;
