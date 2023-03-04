import { Box, Card, CardContent, Divider, Grid, Typography } from "@mui/material";

function UserDetails() {
    const rowLabels = [['Email', 'email'], ['Phone', 'phone'], ['Reg Date', 'reg_date'],
    ['Transactions', 'trnx'], ['Seller', 'seller'], ['Banned', 'banned']];

    //sample data
    const rowData = {
        'email': 'fkdjjhs@jk.fd', 'phone': '473834793', 'reg_date': '14-01-2023',
        'trnx': 30, 'seller': false, 'banned': false
    };

    return (
        <Box display='flex' justifyContent={'center'} alignItems='center'>
            <Card>
                <Typography variant="h4" align='center' sx={{ 'pt': 2 }}>
                    User's Details
                </Typography>
                <Divider />
                <CardContent>
                    <Grid container rowSpacing={2}>
                        {rowLabels.map((labelArr, rowIndex) => (
                            <>
                                <Grid item xs={6} >
                                    {labelArr[0]}
                                </Grid>

                                <Grid item xs={6}>
                                    {rowData[labelArr[1]].toString()}
                                </Grid>
                            </>
                        ))}

                    </Grid>
                </CardContent>
            </Card>
        </Box>
    );
}

export default UserDetails;