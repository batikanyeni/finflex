import React from "react";
import CustomerSearch from "../../components/CustomerSearch";
import {Route, Routes, useNavigate} from "react-router-dom";
import CustomerInfoPage from "../customer-info/CustomerInfoPage";
import toast, {Toaster} from "react-hot-toast";
import axios from "axios";

const CustomerManagementPage = () => {
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
                navigate('musteri-bilgi', { state: { customer: res.data } });
                console.log(res.data);
            }).catch(err => {
                toast.error("Müşteri Bulunamadı!");
                console.log(err)
            });
    }

    return(
        <React.Fragment>
            <Routes>
                <Route path={"/"} element={<CustomerSearch searchButtonClick={searchButtonClick}/>}></Route>
                <Route path={"/musteri-bilgi/*"}  element={<CustomerInfoPage/>}/>
            </Routes>
        </React.Fragment>
    );

}

export default CustomerManagementPage;