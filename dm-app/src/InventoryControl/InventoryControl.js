import { Box, Button, Card, CardContent, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";

function InventoryControl() {
    const headingLabelArr = ['Id', 'Product', 'Description', 'Qty', 'Price', 'Edit', 'Delete'];
    const inventoryArr = [
        { inventory_id: 1, prod_name: 'Pepsi', description: 'fresh and sweet', qty: 35, price: '230' },
        { inventory_id: 1, prod_name: 'Pepsi', description: 'fresh and sweet', qty: 35, price: '230' },
        { inventory_id: 1, prod_name: 'Pepsi', description: 'fresh and sweet', qty: 35, price: '230' },
        { inventory_id: 1, prod_name: 'Pepsi', description: 'fresh and sweet', qty: 35, price: '230' },
        { inventory_id: 1, prod_name: 'Pepsi', description: 'fresh and sweet', qty: 35, price: '230' },
        { inventory_id: 1, prod_name: 'Pepsi', description: 'fresh and sweet', qty: 35, price: '230' },
        { inventory_id: 1, prod_name: 'Pepsi', description: 'fresh and sweet', qty: 35, price: '230' },
        { inventory_id: 1, prod_name: 'Pepsi', description: 'fresh and sweet', qty: 35, price: '230' },
        { inventory_id: 1, prod_name: 'Pepsi', description: 'fresh and sweet', qty: 35, price: '230' },
        { inventory_id: 1, prod_name: 'Pepsi', description: 'fresh and sweet', qty: 35, price: '230' },
        { inventory_id: 1, prod_name: 'Pepsi', description: 'fresh and sweet', qty: 35, price: '230' },
    ]

    return (
        <Box display='flex' justifyContent={'center'} alignItems='center'>
            <Card>
                <CardContent>
                    <Typography variant="h4" align='center'>
                        Inventory Control
                    </Typography>
                    <Divider />

                    <TableContainer sx={{ maxHeight: 700 }}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    {headingLabelArr.map((heading, cellIndex) => (
                                        <TableCell>
                                            <Typography align='center'>
                                                {heading}
                                            </Typography>
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {inventoryArr.map((rowValue, rowIndex) => (
                                    <TableRow>
                                        {Object.values(rowValue).map((cellValue, cellIndex) => (
                                            <TableCell>
                                                <Typography align='center'>
                                                    {cellValue}
                                                </Typography>
                                            </TableCell>
                                        ))}
                                        <TableCell>
                                            <Button variant='contained'>
                                                Edit
                                            </Button>
                                        </TableCell>
                                        <TableCell>
                                            <Button variant='contained'>
                                                Delete
                                            </Button>
                                        </TableCell>
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

export default InventoryControl;