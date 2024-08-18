import Paper from "@mui/material/Paper";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import axios from "axios";
import {useEffect, useState} from "react";




export const TryForexRateTable = () => {
    const [currData,setCurrData] = useState([]);

    const getExchangeRates = () => {
        axios.get('http://localhost:8081/api/v1/exchange-rates/get-all-exchange-rates')
            .then(response => {
                const rates = response.data;
                const formattedData = [];



                rates.forEach(({ currencyPair, rate }) => {
                    if (currencyPair.includes('TRY')) {
                        const base = currencyPair.slice(0, 3);
                        const quote = currencyPair.slice(3);

                        if (currencyPair.endsWith('TRY')) {
                            const existing = formattedData.find(item => item.name === base);
                            if (existing) {
                                existing.buy = rate;
                            } else {
                                formattedData.push({ name: base, buy: rate, sell: 'N/A' });
                            }
                        } else if (currencyPair.startsWith('TRY')) {
                            const existing = formattedData.find(item => item.name === quote);
                            if (existing) {
                                existing.sell = rate;
                            } else {
                                formattedData.push({ name: quote, buy: 'N/A', sell: rate });
                            }
                        }
                    }
                });

                setCurrData(formattedData);
            })
            .catch(err => {
                console.log(err.response?.data.message);
            })
    }

    useEffect(()=> {
       getExchangeRates();
    },[])

    return(
        // eslint-disable-next-line react/jsx-no-undef
        <TableContainer sx={{ width: 350}} component={Paper}>
            <Table  size="small" aria-label="a dense table">
                <TableHead>
                    <TableRow>
                        <TableCell>Döviz cinsi</TableCell>
                        <TableCell align="right">TRY Alış Oranı</TableCell>
                        <TableCell align="right">Döviz Satış Oranı</TableCell>

                    </TableRow>
                </TableHead>
                <TableBody>
                    {currData.map((row) => (
                        <TableRow
                            key={row.name}
                            sx={{ '&:last-child td, &:last-child th': { border:0} }}
                        >
                            <TableCell component="th" scope="row">
                                {row.name}
                            </TableCell>
                            <TableCell align="right">{row.buy}</TableCell>
                            <TableCell align="right">{row.sell}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}


export default TryForexRateTable;