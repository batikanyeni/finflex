import React from "react";
import CustomerSearch from "../../components/CustomerSearch";
import {Route, Routes, useNavigate} from "react-router-dom";
import CustomerForexTransactionPage from "../customer-forex-transaction/CustomerForexTransactionPage";
import axios from "axios";
import toast, {Toaster} from "react-hot-toast";



const CurrencyExchangePage = () => {
    const navigate = useNavigate();

    const searchButtonClick = (value, searchValue, checked) => {
        if (value === "1") {
            if (checked) {
                fetchCustomerBySearchValue(searchValue, "getCustomerByYkn");
            }else {
                fetchCustomerBySearchValue(searchValue, "getCustomerByTckn");
            }
        } else if (value === "2") {
            fetchCustomerBySearchValue(searchValue, "getCustomerByVkn");
        } else if (value === "3") {
            fetchCustomerBySearchValue(searchValue, "getCustomerByCustomerNumber")
        }
    }

    const fetchCustomerBySearchValue = (searchValue, endpoint) => {
        axios.get(`http://localhost:8081/api/v1/customer/${endpoint}/${searchValue}`)
            .then(res => {
                navigate('musteri-doviz-islemi', { state: { customer: res.data } });
            }).catch(err => {
            toast.error("Müşteri Bulunamadı!");
        });
    }
    return(
        <React.Fragment>
            <Routes>
                <Route path={"/"} element={<CustomerSearch searchButtonClick={searchButtonClick}/>} />
                <Route path={"musteri-doviz-islemi"} element={<CustomerForexTransactionPage/>} />
            </Routes>
        </React.Fragment>
    );
}

export default CurrencyExchangePage