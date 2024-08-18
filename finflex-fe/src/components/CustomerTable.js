import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import classes from './CustomerTable.module.css';


const columns = [
    { id: 'name', label: 'Name', minWidth: 170 },
    { id: 'lastname', label: 'Last Name', minWidth: 100 },
    {
        id: 'tckn_ykn',
        label: 'TCKN/YKN',
        minWidth: 170,
        align: 'right'
    },
    {
        id: 'vkn',
        label: 'VKN',
        minWidth: 170,
        align: 'right',
    }
];

function createData(name, lastname, tckn_ykn, vkn) {
    return { name, lastname, tckn_ykn, vkn};
}

const rows = [
    createData('Bugra', 'Calıskan', '1324171354','-'),
    createData('Ritchie','Parlatt','629104996','-'),
    createData('Rianon','Cundict','776490756','-'),
    createData('-', 'kurum', '-', '98335202'),
    createData('-', 'kurum2', '-', '56482642'),
    createData('Silvana', 'Eddins', '45896321547', '-'),
    createData('Mahmut', 'Basaran', '85896489647', '-'),
    createData('Bugra', 'Calıskan', '58223171354','-'),
    createData('Rafık','Ekmek','456823996','-'),
    createData('Kemal','Ucan','13253210756','-'),
    createData('-', 'kurum', '-', '6548935202'),
    createData('-', 'kurum2', '-', '64822642'),
    createData('Ayse', 'Hatme', '44830235458', '-'),
    createData('Namık', 'Kemal', '9872213527', '-'),
];





const CustomerTable = (props) => {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const handleRowClick = (row) =>{
        console.log(row.name,row.lastname,row.tckn_ykn,row.vkn);
    }
    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead sx={{ bgcolor: '#a9a7a7' }}>
                        <TableRow >
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{ minWidth: column.minWidth }}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row) => {
                                return (
                                    <TableRow onClick={() => handleRowClick(row)} className={classes['table-row']} hover role="checkbox" tabIndex={-1} key={row.code}>
                                        {columns.map((column) => {
                                            const value = row[column.id];
                                            return (
                                                <TableCell key={column.id} align={column.align}>
                                                    {column.format && typeof value === 'number'
                                                        ? column.format(value)
                                                        : value}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                );
                            })}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );

}

export default CustomerTable;