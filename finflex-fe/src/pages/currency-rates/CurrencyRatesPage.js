import Paper from "@mui/material/Paper";
import TableHead from "@mui/material/TableHead";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Table from "@mui/material/Table";
import {useEffect, useState} from "react";
import axios from "axios";


const CurrencyRatesPage = () => {
    const [rows,setRows] = useState([]);


    const getExchangeRates = () => {
        axios.get('http://localhost:8081/api/v1/exchange-rates/get-all-exchange-rates')
            .then(response => {
                const rates = response.data;
                const formattedData = [];

                rates.forEach(({currencyPair, rate}) => {
                    const target = currencyPair.slice(0, 3);
                    const source = currencyPair.slice(3);
                    formattedData.push({target:target,source:source,rate:rate});
                })

                setRows(formattedData);
            })
            .catch(err => {
                console.log(err.response?.data.message);
            })
    }
    useEffect(()=>{
       getExchangeRates();
    },[])

    return(
        // eslint-disable-next-line react/jsx-no-undef
        <TableContainer component={Paper}>
            {/* eslint-disable-next-line react/jsx-no-undef */}
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Hedef Döviz</TableCell>
                        <TableCell>Kaynak Döviz</TableCell>
                        <TableCell align="right">Oran</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow
                            key={row.target+row.source}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {row.target}
                            </TableCell>
                            <TableCell>{row.source}</TableCell>
                            <TableCell align="right">{row.rate}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default CurrencyRatesPage