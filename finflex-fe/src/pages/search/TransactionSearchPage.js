import {useEffect, useState} from "react";
import Table from "../../components/Table";
import {axiosInstanceTransaction} from "../../store/axios-instance";
import {getDecodedCustomerTckn} from "../../store/auth-store";
import classes from "./TransactionSearchPage.module.css";

function TransactionSearchPage() {
    const [transactions, setTransactions] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        axiosInstanceTransaction.get(`/getCustomerTransactionsByUserTckn/${getDecodedCustomerTckn()}`)
            .then(res => {
                if(res.status === 200) {
                    setTransactions(res.data)
                }
            })
            .catch(err => {
                if(err.response.data.code === 1005) {
                    setError(err.response.data.message)
                }
            })
    }, []);

    return (
        <>
            {error ? (
                <div className={classes['data-info']}>{error}</div>
            ):(
                <Table
                    searchable={true}
                    head={[
                        {name: 'Source/Target'},
                        {name: 'Source Amount'},
                        {name: 'Target Amount'},
                        {name: 'User ID', sortable: true},
                        {name: 'Customer ID', sortable: true}
                    ]}
                    body={transactions && transactions.map((transaction, key) => (
                        [
                            <>{transaction.sourceCurrType}/{transaction.targetCurrType}</>,
                            <>{transaction.sourceAmount} {transaction.sourceCurr}</>,
                            <>{transaction.targetAmount} {transaction.targetCurr}</>,
                            <div key={transaction.userTCKN}>{transaction.userTCKN}</div>,
                            <div key={transaction.customerTckn}>{transaction.customerTckn}</div>
                        ]
                    ))}
                />
            )}
        </>
    );
}

export default TransactionSearchPage;