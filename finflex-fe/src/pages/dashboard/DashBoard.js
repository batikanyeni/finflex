import React, { useEffect, useState } from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { MainListItems, SecondaryListItems } from "../../components/listItems";
import CurrencyExchangePage from "../currency-exchange/CurrencyExchangePage";
import { Route, Routes } from "react-router-dom";
import TransactionsPage from "../transaction/TransactionsPage";
import CustomerManagementPage from "../customer-management/CustomerManagementPage";
import DefineCustomerPage from "../define-customer/DefineCustomerPage";
import HomePage from "../home/HomePage";
import PersonelOpsPage from "../personel-ops/PersonelOpsPage";
import DefinePersonelPage from "../personel-ops/DefinePersonelPage";
import ProfileMenu from "../../components/ProfileMenu";
import EditPersonelPage from "../personel-ops/EditPersonelPage";
import logo from "../../assets/images/finflex-logo-no-bg.png"
import { getDecodedCustomerTckn, isAdminUser } from "../../store/auth-store";
import axios from "axios";
import CurrencyRatesPage from "../currency-rates/CurrencyRatesPage";
import classes from "./DashBoard.module.css";

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

const defaultTheme = createTheme();

const DashBoard = () => {
  const [user, setUser] = useState({});
  const userTckn = getDecodedCustomerTckn();
  const [open, setOpen] = useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const fetchUser = () => {
    axios
        .get("http://localhost:8080/api/v1/users/getUserByTCKN", {
          params: {
            tckn: userTckn,
          },
        })
        .then((response) => {
          setUser(response?.data);
        })
        .catch((err) => {
          console.log(err.response?.data.message());
        });
  };
  useEffect(() => {
    fetchUser();
  }, []);

  return (
      <ThemeProvider theme={defaultTheme}>
        <Box sx={{ display: "flex" }}>
          <CssBaseline />
          <AppBar position="absolute" open={open}>
            <Toolbar
                sx={{
                  pr: "24px", // keep right padding when drawer closed
                  bgcolor: "#185a65",
                }}
            >
              <IconButton
                  edge="start"
                  color="inherit"
                  aria-label="open drawer"
                  onClick={toggleDrawer}
                  sx={{
                    marginRight: "36px",
                    ...(open && { display: "none" }),
                  }}
              >
                <MenuIcon />
              </IconButton>
              <Typography
                  component="h1"
                  variant="h6"
                  color="inherit"
                  noWrap
                  sx={{ flexGrow: 1 }}
              >
                <img className={classes['logo']} alt='logo' src={logo}/>
              </Typography>
              <ProfileMenu
                  userFirstName={user.firstName}
                  userLastName={user.lastName}
              />
            </Toolbar>
          </AppBar>
          <Drawer variant="permanent" open={open}>
            <Toolbar
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  px: [1],
                  backgroundColor: "#185a65",
                }}
            >
              <Container>
                <Typography sx={{ color: "#FFFFFF", fontSize: "28px" }}>
                  FinFlex
                </Typography>
              </Container>
              <IconButton onClick={toggleDrawer}>
                <ChevronLeftIcon sx={{ color: "#FFFFFF" }} />
              </IconButton>
            </Toolbar>
            <Divider />
            <List component="nav">
              <MainListItems />
              <Divider sx={{ my: 1 }} />
              <SecondaryListItems />
            </List>
          </Drawer>
          <Box
              component="main"
              sx={{
                backgroundColor: (theme) =>
                    theme.palette.mode === "light"
                        ? theme.palette.grey[100]
                        : theme.palette.grey[900],
                flexGrow: 1,
                height: "100vh",
                overflow: "auto",
                transition: "width 0.3s",
                width: open ? `calc(100% - ${drawerWidth}px)` : "calc(100% - 60px)",
              }}
          >
            <Container maxWidth="xl" sx={{ mt: 10, mb: 4, width: "90%" }}>
              <Routes>
                <Route path={"/"} element={<HomePage user={user}/>} />
                <Route path={"dovizalsat/*"} element={<CurrencyExchangePage />} />
                <Route
                    path={"hesap-haraketleri"}
                    element={<TransactionsPage />}
                />
                  <Route
                      path={"doviz-kurları"}
                      element={<CurrencyRatesPage/>}
                  />

                <Route
                    path={"müsteri-yonetim/*"}
                    element={<CustomerManagementPage />}
                />
                <Route
                    path={"musteri-tanımla"}
                    element={<DefineCustomerPage />}
                />
                {isAdminUser && (
                    <>
                      <Route
                          path={"personel-update"}
                          element={<PersonelOpsPage />}
                      />
                      <Route
                          path={"personel-define"}
                          element={<DefinePersonelPage />}
                      />
                      <Route
                          path={"edit-personel"}
                          element={<EditPersonelPage />}
                      />
                    </>
                )}
              </Routes>
            </Container>
          </Box>
        </Box>
      </ThemeProvider>
  );
};

export default DashBoard;
