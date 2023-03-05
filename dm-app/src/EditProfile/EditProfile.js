import { Button, Card, CardContent, Container, Divider, FormControlLabel, Grid, Radio, RadioGroup, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";

function EditProfile() {
    const labelArr = [['First Name', 'text'], ['Last Name', 'text']];

    const [state, setState] = useState({});

    const updateState = (newValue) => {
        setState((previousValue) => {
            return { ...previousValue, ...newValue }
        })
    }

    const values = { email: 'kfljjlds@jds.jf', phone: '234245524', seller: true };

    return (
        <Box display='flex' justifyContent={'center'} alignItems='center'>
            <Card>
                <CardContent>
                    <Typography align='center' sx={{ typography: { xs: 'h6', md: 'h4' } }}>
                        Edit Profile
                    </Typography>
                    <Divider />
                    <Grid container rowSpacing={2} sx={{ 'pt': 2 }} display='flex' justifyContent={'center'} alignItems='center'>
                        {labelArr.map((label, index) => (
                            <Grid item xs={12}>
                                <TextField fullWidth label={label[0]} type={label[1]} defaultValue={values[label[1]]} />
                            </Grid>
                        ))}
                        <Grid item xs={12}>
                            <Container>
                                <Divider />
                                <Typography>
                                    Are you a seller?
                                </Typography>
                                <RadioGroup >
                                    <FormControlLabel value={true} label='Yes' control={<Radio />} />
                                    <FormControlLabel value={false} label='No' control={<Radio />} />
                                </RadioGroup>
                                <Divider />
                            </Container>

                            <Grid item xs={12} sx={{ 'pt': 2 }} display='flex' justifyContent={'center'} alignItems='center'>
                                <Button variant='contained'>
                                    Save Changes
                                </Button>
                            </Grid>

                        </Grid>

                    </Grid>
                </CardContent>
            </Card>
        </Box>
    );
}

export default EditProfile;