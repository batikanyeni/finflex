import * as React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import LogoutIcon from "@mui/icons-material/Logout";
import ReceiptIcon from "@mui/icons-material/Receipt";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PeopleIcon from "@mui/icons-material/People";
import HomeIcon from "@mui/icons-material/Home";
import CoPresentIcon from "@mui/icons-material/CoPresent";
import ShowChartIcon from '@mui/icons-material/ShowChart';
import { useNavigate } from "react-router-dom";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { isAdminUser,removeAuthTokenFromStorage } from "../store/auth-store";
import {useState} from "react";


export const MainListItems = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleItemClick = (item) => {
        setSelectedItem(item);
    };
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (path) => {
    navigate(path);
    handleItemClick('menu')
    handleMenuClose();
  };

  const handleHomePageClick = () => {
    handleItemClick("home");
    navigate("");
  };
  const handleCurrencyExchangeClick = () => {
      handleItemClick("currency-exchange");
      navigate("dovizalsat");
  };
  const handleTransactionsClick = () => {
      handleItemClick("transactions");
      navigate("hesap-haraketleri");
  };
  const handleCustomerManagementClick = () => {
      handleItemClick("customer-management");
      navigate("müsteri-yonetim");
  };
  const handleDefineCustomerClick = () => {
      handleItemClick("define-customer");
    navigate("musteri-tanımla");
  };
  const handleCurrencyRatesClick = () => {
        handleItemClick('currency-rates');
        navigate("doviz-kurları");
    };
  const isAdmin = isAdminUser();

  return (
      <React.Fragment>
        <ListItemButton
            onClick={handleHomePageClick}
            selected={selectedItem === 'home'}
                    >
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Anasayfa" />
        </ListItemButton>
        <ListItemButton
            onClick={handleCurrencyExchangeClick}
            selected={selectedItem === 'currency-exchange'}
        >
          <ListItemIcon>
            <AttachMoneyIcon />
          </ListItemIcon>
          <ListItemText primary="Döviz Al/Sat" />
        </ListItemButton>
        <ListItemButton
            onClick={handleTransactionsClick}
            selected={selectedItem === 'transactions'}
        >
          <ListItemIcon>
            <ReceiptIcon />
          </ListItemIcon>
          <ListItemText primary="Hareketler" />
        </ListItemButton>
          <ListItemButton
              onClick={handleCurrencyRatesClick}
              selected={selectedItem === 'currency-rates'}
          >
              <ListItemIcon>
                  <ShowChartIcon/>
              </ListItemIcon>
              <ListItemText primary="Döviz Kurları" />
          </ListItemButton>
        <ListItemButton
            onClick={handleCustomerManagementClick}
            selected={selectedItem === 'customer-management'}
        >
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="Müşteri Yönetim" />
        </ListItemButton>
        <ListItemButton
            onClick={handleDefineCustomerClick}
            selected={selectedItem === 'define-customer'}
        >
          <ListItemIcon>
            <PersonAddIcon />
          </ListItemIcon>
          <ListItemText primary="Müşteri Tanımla" />
        </ListItemButton>

        {isAdmin && (
            <ListItemButton
                onClick={handleMenuClick}
                selected={selectedItem === 'menu'}
            >
              <ListItemIcon>
                <CoPresentIcon />
              </ListItemIcon>
              <ListItemText primary="Personel İşlemleri" />
            </ListItemButton>
        )}

        <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
        >
          {isAdmin && (
              <>
                <MenuItem onClick={() => handleMenuItemClick("personel-define")}>
                  Personel Tanımla
                </MenuItem>
                <MenuItem onClick={() => handleMenuItemClick("personel-update")}>
                  Personel Güncelle
                </MenuItem>
              </>
          )}
        </Menu>
      </React.Fragment>
  );
};

export const SecondaryListItems = () => {
  const navigate = useNavigate();
  const handleLogoutClick = () => {
      removeAuthTokenFromStorage();
    navigate("/");
  };

  return (
      <React.Fragment>
        <ListItemButton onClick={handleLogoutClick}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Çıkış Yap" />
        </ListItemButton>
      </React.Fragment>
  );
};
