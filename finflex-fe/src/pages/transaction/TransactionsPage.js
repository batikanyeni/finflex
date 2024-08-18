import {useEffect, useState} from "react";
import Table from "../../components/Table";
import Paper from "@mui/material/Paper";
import Pagination from "@mui/material/Pagination";
import {getDecodedCustomerTckn, getDecodedPersonelNumber, getDecodedRole} from "../../store/auth-store";
import {axiosInstanceTransaction} from "../../store/axios-instance";
import {toast, Toaster} from "react-hot-toast";
import {useSearchParams} from "react-router-dom";

const TransactionsPage = () => {
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [customerNumberFilter, setCustomerNumberFilter] = useState("");
    const [accountNumberFilter, setAccountNumberFilter] = useState("");
    const [personelNumberFilter, setPersonelNumberFilter] = useState("");
    const [loading, setLoading] = useState(false);
    const [totalTransactions, setTotalTransactions] = useState(0);
    const [searchParams, setSearchParams] = useSearchParams();
    const [dateFilter, setDateFilter] = useState([null, null]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const pageSize = 10;
    const currentPage = parseInt(searchParams.get('page') || '1', 10);
    const role = getDecodedRole();

    const handleCustomerNumberChange = (e) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) {
            setCustomerNumberFilter(value);
        }
    };

    const handleAccountNumberChange = (e) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) {
            setAccountNumberFilter(value);
        }
    };

    const handlePersonelNumberChange = (e) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) {
            setPersonelNumberFilter(value);
        }
    };

    const handleDateChange = (dates, dateStrings) => {
        setDateFilter(dates);
        setStartDate(dateStrings[0])
        setEndDate(dateStrings[1])
    }

    const head = [
        {name: 'Tarih', sortable: true},
        {name: 'Müşteri İsmi', sortable: true},
        {name: 'Müşteri Numarası', sortable: true},
        {name: 'Hesap Numarası', sortable: true},
        {name: 'Alınan Miktar', sortable: true},
        {name: 'Komisyon Tutarı', sortable: true},
        {name: 'İşlem Tutarı', sortable: true},
        {name: 'Personel Numarası', sortable: true},
    ];

    useEffect(() => {
        handleFilter();
    }, [currentPage]);


    const handleFilter = async (page = currentPage) => {
        const loadingToastId = toast.loading("Veriler Getiriliyor...");
        setLoading(true);
            const params = {
                page: page - 1,
                pageSize
            };

            if (startDate !== '') {
                params.startDate = startDate + 'T00:00:00';
            }
            if (endDate !== '') {
                params.endDate = endDate + 'T23:59:59';
            }
            if (customerNumberFilter) {
                params.customerNo = customerNumberFilter;
            }
            if (accountNumberFilter) {
                params.accountNo = accountNumberFilter;
            }
            if (personelNumberFilter) {
                params.userNo = personelNumberFilter;
            }

            if(startDate === '' && endDate === '' && !customerNumberFilter && !accountNumberFilter
                && !personelNumberFilter && getDecodedRole() === 'USER'){
                try {
                    const tckn = getDecodedCustomerTckn();
                    const response = await axiosInstanceTransaction.get(
                        `/get-customer-transactions-user-tckn/${tckn}`,
                        {
                            params: {
                                page: page - 1,
                                pageSize
                            }
                        }
                    );
                    setFilteredTransactions(response.data.content || []);
                    setTotalTransactions(response.data.totalElements || 0);
                } catch (error) {
                    console.error("Error fetching transactions:", error);
                    setFilteredTransactions([]);
                } finally {
                    toast.dismiss(loadingToastId);
                    setLoading(false);
                }
            }

            else {
                try {
                    const response = await axiosInstanceTransaction.get(`/getFilteredTransactions`, { params });

                    setFilteredTransactions(response.data.content);
                    setTotalTransactions(response.data.totalElements || 0);

                } catch (error) {
                    toast.dismiss(loadingToastId);

                    if (error.response) {
                        console.log(error.response)
                        const errorMessage = error.response.data.message;
                        console.log(errorMessage)
                        if (errorMessage.includes("Account Not Found")) {
                            toast.error("Hesap Bulunamadı");
                        } else if (errorMessage.includes("Customer Not Found")) {
                            toast.error("Müşteri Bulunamadı");
                        } else if (errorMessage.includes("Personnel Not Found")) {
                            toast.error("Personel Bulunamadı");
                        } else {
                            toast.error("Bir hata oluştu.");
                        }
                    } else {
                        toast.error("Bir hata oluştu.");
                    }
                } finally {
                    toast.dismiss(loadingToastId);
                    setLoading(false);
                }
            }



    };

    const capitalizeName = (name) => {
        return name
            .split(' ')
            .map(word =>
                word.charAt(0).toLocaleUpperCase('tr-TR') +
                word.slice(1).toLocaleLowerCase('tr-TR')
            )
            .join(' ');
    };


    const body = filteredTransactions.map(transaction => {
        const formattedDate = transaction?.transactionDate
            ? new Date(transaction.transactionDate).toLocaleDateString('tr-TR', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            })
            : "N/A";

        const formatAmount = (amount) => {
            if (amount === 0) {
                return "0";
            }
            return amount ? Number(amount).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }) : "N/A";
        };

        return [
            formattedDate,
            transaction.customerTckn
                ? `${capitalizeName(transaction.customerFirstName)} ${capitalizeName(transaction.customerLastName)}`
                : transaction.customerLastName
                    ? capitalizeName(transaction.customerLastName)
                    : "N/A",
            transaction.customerNumber || "N/A",
            transaction.accountNumber || "N/A",
            formatAmount(transaction?.targetAmount) + " " + transaction.targetCurrType || "N/A",
            formatAmount(transaction?.transactionFee) + " " + transaction.sourceCurrType || "N/A",
            formatAmount(transaction?.sourceAmount) + " " + transaction?.sourceCurrType || "N/A",
            transaction.userNo || "N/A"
        ];
    });

    const handlePageChange = (event, newPage) => {
        setSearchParams({page: newPage});
        window.scrollTo(0, 0);
    };

    const onApplyFilterClicked = () => {
        setSearchParams({page: '1'});
        handleFilter();
    }

    return (
        <>
            <Toaster/>
            <Paper sx={{width: "100%"}}>
                <Table
                    head={head}
                    body={body}
                    loading={loading}
                    searchable={true}
                    role={role}
                    customerNumberFilter={customerNumberFilter}
                    accountNumberFilter={accountNumberFilter}
                    personelNumberFilter={personelNumberFilter}
                    dateFilter={dateFilter}
                    onCustomerNumberChange={(e) => handleCustomerNumberChange(e)}
                    onAccountNumberChange={(e) => handleAccountNumberChange(e)}
                    onPersonelNumberChange={(e) => handlePersonelNumberChange(e)}
                    onDateChange={(dates, dateStrings) => handleDateChange(dates, dateStrings)}
                    onFilterApply={onApplyFilterClicked}
                    onFilterReset={() => {
                        setCustomerNumberFilter("");
                        setAccountNumberFilter("");
                        setPersonelNumberFilter("");
                        handleFilter();
                        setSearchParams({page: '1'})
                    }}
                />
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    margin: '20px',
                    padding: '20px'
                }}>
                    <span>{`${(currentPage - 1) * pageSize + 1} - ${Math.min(currentPage * pageSize, totalTransactions)} of ${totalTransactions}`}</span>
                    <Pagination
                        page={currentPage}
                        count={Math.ceil(totalTransactions / pageSize)}
                        onChange={handlePageChange}
                        color="primary"
                    />
                </div>
            </Paper>
        </>
    );
};

export default TransactionsPage;
