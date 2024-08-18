import React from "react";
import {Route, Routes, useLocation, useNavigate} from "react-router-dom";
import CustomerAccountPage from "../customer-account/CustomerAccountPage";
import CustomerInfo from "../../components/CustomerInfo";

const CustomerInfoPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const customer = location.state?.customer;

    const accountsClick = () => {
        navigate('musteri-hesap', { state: { customer: customer } });
    }

    return(
        <React.Fragment>
            <Routes>
                <Route path={"/"} element={<CustomerInfo accountsClick={accountsClick}/>}/>
                <Route path={"/musteri-hesap"} element={<CustomerAccountPage/>}/>
            </Routes>

        </React.Fragment>
    )
}

export default CustomerInfoPage;