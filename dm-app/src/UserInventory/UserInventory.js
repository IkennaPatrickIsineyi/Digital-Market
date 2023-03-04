import { Box, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";

function UserInventory() {
    const tableHeading = [['Id', 'inventory_id'], ['Product', 'prod_name'], ['Description', 'description'],
    ['Qty', 'qty'], ['Price', 'price'], ['Date added', 'date_added'],
    ['Last trnx', 'last_trnx'], ['Last restock', 'last_restock'], ['Last price change', 'last_price_change']];

    const tableRows = [
        {
            'inventory_id': 1, 'prod_name': 'Coca Cola', 'description': 'Fresh and new', 'qty': 25, 'price': '200',
            'date_added': '14-01-2023', 'last_trnx': '03-02-2023', 'last_restock': '29-01-2023', 'last_price_change': '15-01-2023'
        },
        {
            'inventory_id': 1, 'prod_name': 'Coca Cola', 'description': 'Fresh and new', 'qty': 25, 'price': '200',
            'date_added': '14-01-2023', 'last_trnx': '03-02-2023', 'last_restock': '29-01-2023', 'last_price_change': '15-01-2023'
        },
        {
            'inventory_id': 1, 'prod_name': 'Coca Cola', 'description': 'Fresh and new', 'qty': 25, 'price': '200',
            'date_added': '14-01-2023', 'last_trnx': '03-02-2023', 'last_restock': '29-01-2023', 'last_price_change': '15-01-2023'
        },
        {
            'inventory_id': 1, 'prod_name': 'Coca Cola', 'description': 'Fresh and new', 'qty': 25, 'price': '200',
            'date_added': '14-01-2023', 'last_trnx': '03-02-2023', 'last_restock': '29-01-2023', 'last_price_change': '15-01-2023'
        },
        {
            'inventory_id': 1, 'prod_name': 'Coca Cola', 'description': 'Fresh and new', 'qty': 25, 'price': '200',
            'date_added': '14-01-2023', 'last_trnx': '03-02-2023', 'last_restock': '29-01-2023', 'last_price_change': '15-01-2023'
        },
        {
            'inventory_id': 1, 'prod_name': 'Coca Cola', 'description': 'Fresh and new', 'qty': 25, 'price': '200',
            'date_added': '14-01-2023', 'last_trnx': '03-02-2023', 'last_restock': '29-01-2023', 'last_price_change': '15-01-2023'
        },
        {
            'inventory_id': 1, 'prod_name': 'Coca Cola', 'description': 'Fresh and new', 'qty': 25, 'price': '200',
            'date_added': '14-01-2023', 'last_trnx': '03-02-2023', 'last_restock': '29-01-2023', 'last_price_change': '15-01-2023'
        },
        {
            'inventory_id': 1, 'prod_name': 'Coca Cola', 'description': 'Fresh and new', 'qty': 25, 'price': '200',
            'date_added': '14-01-2023', 'last_trnx': '03-02-2023', 'last_restock': '29-01-2023', 'last_price_change': '15-01-2023'
        },
        {
            'inventory_id': 1, 'prod_name': 'Coca Cola', 'description': 'Fresh and new', 'qty': 25, 'price': '200',
            'date_added': '14-01-2023', 'last_trnx': '03-02-2023', 'last_restock': '29-01-2023', 'last_price_change': '15-01-2023'
        },
        {
            'inventory_id': 1, 'prod_name': 'Coca Cola', 'description': 'Fresh and new', 'qty': 25, 'price': '200',
            'date_added': '14-01-2023', 'last_trnx': '03-02-2023', 'last_restock': '29-01-2023', 'last_price_change': '15-01-2023'
        },
        {
            'inventory_id': 1, 'prod_name': 'Coca Cola', 'description': 'Fresh and new', 'qty': 25, 'price': '200',
            'date_added': '14-01-2023', 'last_trnx': '03-02-2023', 'last_restock': '29-01-2023', 'last_price_change': '15-01-2023'
        },
        {
            'inventory_id': 1, 'prod_name': 'Coca Cola', 'description': 'Fresh and new', 'qty': 25, 'price': '200',
            'date_added': '14-01-2023', 'last_trnx': '03-02-2023', 'last_restock': '29-01-2023', 'last_price_change': '15-01-2023'
        }
    ];

    return (
        <Box display='flex' justifyContent={'center'} alignItems='center'>
            <Card>
                <CardContent>
                    <Typography variant="h4" align='center'>
                        User's inventory
                    </Typography>

                    <TableContainer sx={{ maxHeight: 700 }}>
                        <Table stickyHeader>
                            <TableHead >
                                <TableRow>
                                    {tableHeading.map((headingArr, rowIndex) => (
                                        <TableCell>
                                            <Typography align='center' noWrap>
                                                {headingArr[0]}
                                            </Typography>
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {tableRows.map((rowValue, rowIndex) => (
                                    <TableRow>
                                        {Object.values(rowValue).map((cellValue, cellIndex) => (
                                            <TableCell>
                                                <Typography align='center' noWrap>
                                                    {cellValue}
                                                </Typography>
                                            </TableCell>
                                        ))}
                                    </TableRow>

                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>
        </Box>
    );
}

export default UserInventory;