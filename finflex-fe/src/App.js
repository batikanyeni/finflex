import "./App.css";
import {Routes, Route, useNavigate} from "react-router-dom";
import LoginPage from "./pages/login/LoginPage";
import DashBoard from "./pages/dashboard/DashBoard";
import VerifyAccount from "./pages/verify/VerifyAccount";
import TransactionSearchPage from "./pages/search/TransactionSearchPage";
import PersonelAccountPage from "./pages/personel-ops/PersonelAccountPage";
import EditPersonelPage from "./pages/personel-ops/EditPersonelPage";
import ChangePasswordPage from "./pages/personel-ops/ChangePasswordPage";
import ForgotPasswordRequestPage from "./pages/forgot-password/ForgotPasswordRequestPage";
import ResetForgottenPasswordPage from "./pages/forgot-password/ResetForgottenPasswordPage";
import PersonelOpsPage from "./pages/personel-ops/PersonelOpsPage";
import DefinePersonelPage from "./pages/personel-ops/DefinePersonelPage";
import {Toaster} from "react-hot-toast";
import {useState} from "react";
import NotFoundPage from "./pages/not-found/NotFoundPage";
import {authTokenCheck} from "./store/auth-store";


function App() {
    const [isAuthenticated,setIsAuthenticated] = useState(false);
  return (
      <div>
          <Toaster/>
          <Routes>
          <Route path="/" element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/verify" element={<VerifyAccount />} />
          <Route path="/reset_password" element={<ResetForgottenPasswordPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordRequestPage />} />
            {(isAuthenticated || authTokenCheck())  && (
                <>
                  <Route path="/dashboard/*" element={<DashBoard />} />
                  <Route path="/search-transaction" element={<TransactionSearchPage />} />
                  <Route path="/personel-account" element={<PersonelAccountPage />} />
                  <Route path="/edit-personel" element={<EditPersonelPage />} />
                  <Route path="/change-password" element={<ChangePasswordPage />} />
                  <Route path="/personel-update" element={<PersonelOpsPage />} />
                  <Route path="/personel-define" element={<DefinePersonelPage />} />
                </>
            )}
           <Route path='*' element={<NotFoundPage/>} />
        </Routes>
      </div>
  );
}

export default App;
