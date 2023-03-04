import { Box, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

function TransactionHistory() {
    const heading = ['Date', 'Trnx Id', 'Product', 'Qty', 'Price', 'Total Price', 'Status', 'Rating', 'Comment'];
    const body = [{ a: 1, b: 2, c: 3, d: 1, e: 1, f: 1, g: 1, h: 1, i: 1 },
    { a: 2, b: 2, c: 2, d: 2, e: 2, f: 2, g: 2, h: 2, i: 2 }, { a: 1, b: 2, c: 3, d: 1, e: 1, f: 1, g: 1, h: 1, i: 1 },
    { a: 2, b: 2, c: 2, d: 2, e: 2, f: 2, g: 2, h: 2, i: 2 }, { a: 1, b: 2, c: 3, d: 1, e: 1, f: 1, g: 1, h: 1, i: 1 },
    { a: 2, b: 2, c: 2, d: 2, e: 2, f: 2, g: 2, h: 2, i: 2 }, { a: 1, b: 2, c: 3, d: 1, e: 1, f: 1, g: 1, h: 1, i: 1 },
    { a: 2, b: 2, c: 2, d: 2, e: 2, f: 2, g: 2, h: 2, i: 2 }, { a: 1, b: 2, c: 3, d: 1, e: 1, f: 1, g: 1, h: 1, i: 1 },
    { a: 2, b: 2, c: 2, d: 2, e: 2, f: 2, g: 2, h: 2, i: 2 }, { a: 1, b: 2, c: 3, d: 1, e: 1, f: 1, g: 1, h: 1, i: 1 },
    { a: 2, b: 2, c: 2, d: 2, e: 2, f: 2, g: 2, h: 2, i: 2 }, { a: 1, b: 2, c: 3, d: 1, e: 1, f: 1, g: 1, h: 1, i: 1 },
    { a: 2, b: 2, c: 2, d: 2, e: 2, f: 2, g: 2, h: 2, i: 2 }, { a: 1, b: 2, c: 3, d: 1, e: 1, f: 1, g: 1, h: 1, i: 1 },
    { a: 2, b: 2, c: 2, d: 2, e: 2, f: 2, g: 2, h: 2, i: 2 }, { a: 1, b: 2, c: 3, d: 1, e: 1, f: 1, g: 1, h: 1, i: 1 },
    { a: 2, b: 2, c: 2, d: 2, e: 2, f: 2, g: 2, h: 2, i: 2 }, { a: 1, b: 2, c: 3, d: 1, e: 1, f: 1, g: 1, h: 1, i: 1 },
    { a: 2, b: 2, c: 2, d: 2, e: 2, f: 2, g: 2, h: 2, i: 2 }, { a: 1, b: 2, c: 3, d: 1, e: 1, f: 1, g: 1, h: 1, i: 1 },
    { a: 2, b: 2, c: 2, d: 2, e: 2, f: 2, g: 2, h: 2, i: 2 }, { a: 1, b: 2, c: 3, d: 1, e: 1, f: 1, g: 1, h: 1, i: 1 },
    { a: 2, b: 2, c: 2, d: 2, e: 2, f: 2, g: 2, h: 2, i: 2 },]


    return (
        <Box display='flex' justifyContent='center' alignItems='center'>
            <Card>
                <TableContainer sx={{ maxHeight: 800 }}>
                    <Table stickyHeader={true} >
                        <TableHead>
                            <TableRow >
                                {heading.map((title, headIndex) => (
                                    <TableCell align="center" sx={(!headIndex) ? {
                                        left: 0, zIndex: 800
                                    } : {}}  >
                                        {title}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {body.map((rowValue, rowIndex) => (
                                <TableRow >
                                    {Object.values(rowValue).map((cellValue, cellIndex) => (
                                        <TableCell align="center" sx={(!cellIndex) ? {
                                            position: 'sticky',
                                            left: 0, zindex: 800, background: 'white'
                                        } : {}} >
                                            {cellValue}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}

                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>
        </Box>
    );
}

export default TransactionHistory;