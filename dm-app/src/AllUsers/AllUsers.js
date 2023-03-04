import { Box, Button, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";

function AllUsers() {
    const tableHeading = ['Email', 'Phone', 'Seller', 'Reg Date', 'No. of trnx', 'banned',
        'ban', 'View trnx', 'View inventory'];
    //const buttonLabel = ['Ban', 'Transactions', 'Inventory'];

    const tableContent = [{
        'email': 'fhdj@fjd.fjd', 'phone': '945893',
        seller: true, 'reg_date': '13-01-2023', 'no_of_trnx': 30, 'banned': false
    }, {
        'email': 'fhdj@fjd.fjd', 'phone': '945893',
        seller: true, 'reg_date': '13-01-2023', 'no_of_trnx': 30, 'banned': true
    }, {
        'email': 'fhdj@fjd.fjd', 'phone': '945893',
        seller: true, 'reg_date': '13-01-2023', 'no_of_trnx': 30, 'banned': false
    }, {
        'email': 'fhdj@fjd.fjd', 'phone': '945893',
        seller: false, 'reg_date': '13-01-2023', 'no_of_trnx': 30, 'banned': false
    }, {
        'email': 'fhdj@fjd.fjd', 'phone': '945893',
        seller: true, 'reg_date': '13-01-2023', 'no_of_trnx': 30, 'banned': false
    }, {
        'email': 'fhdj@fjd.fjd', 'phone': '945893',
        seller: true, 'reg_date': '13-01-2023', 'no_of_trnx': 30, 'banned': false
    }, {
        'email': 'fhdj@fjd.fjd', 'phone': '945893',
        seller: true, 'reg_date': '13-01-2023', 'no_of_trnx': 30, 'banned': false
    }, {
        'email': 'fhdj@fjd.fjd', 'phone': '945893',
        seller: true, 'reg_date': '13-01-2023', 'no_of_trnx': 30, 'banned': false
    }, {
        'email': 'fhdj@fjd.fjd', 'phone': '945893',
        seller: true, 'reg_date': '13-01-2023', 'no_of_trnx': 30, 'banned': false
    }, {
        'email': 'fhdj@fjd.fjd', 'phone': '945893',
        seller: true, 'reg_date': '13-01-2023', 'no_of_trnx': 30, 'banned': false
    },]

    return (
        <Box display='flex' justifyContent={'center'} alignItems='center'>
            <Card>
                <Typography variant="h5" align="center" sx={{ 'pt': 2 }}>Details of All Users</Typography>
                <TableContainer sx={{ maxHeight: 600 }}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                {tableHeading.map((headValue, cellInx) => (
                                    <TableCell align='center'>
                                        <Typography noWrap>
                                            {headValue}
                                        </Typography>

                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {tableContent.map((rowValue, rowIndx) => (
                                <TableRow>
                                    {Object.values(rowValue).map((cellValue, cellIndx) => (
                                        <TableCell align="center">
                                            <Typography noWrap>
                                                {cellValue.toString()}
                                            </Typography>
                                        </TableCell>
                                    ))}

                                    <TableCell align='center'>
                                        <Button variant="contained">
                                            {(tableContent[rowIndx].banned) ?
                                                'Unban' : 'Ban'}
                                        </Button>
                                    </TableCell>

                                    <TableCell align='center'>
                                        <Button variant="contained">
                                            {'Transactions'}
                                        </Button>
                                    </TableCell>

                                    <TableCell align='center'>
                                        {(tableContent[rowIndx].seller) ?
                                            <Button variant="contained">
                                                {'Inventory'}
                                            </Button> : null}
                                    </TableCell>

                                </TableRow>
                            ))}

                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>
        </Box>
    );
}

export default AllUsers;