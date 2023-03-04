import { Box, Button, Card, CardContent, Divider, FormControlLabel, Grid, Radio, RadioGroup, TextField, Typography } from "@mui/material";
import { Container } from "@mui/material";
import Submit from '@mui/icons-material/Send'
import { useState } from "react";
import { signUp } from "./registerLogic";
import { remoteRequest } from "../model";

function Register() {
    const [states, setState] = useState({
        remoteRequest: remoteRequest,
        email: '', password1: '', password2: '',
        firstName: '', lastName: '', gender: '', isSeller: false
    });

    console.log(states);

    const updateState = (newValue) => {
        setState((previousValue) => { return { ...previousValue, ...newValue } })
    }

    return (
        <Box display={'flex'} justifyContent='center' alignItems={'center'}>
            <Card>
                <CardContent>
                    <Grid container rowSpacing={2}>
                        <Grid item xs={12} display={'flex'} justifyContent='center' alignItems={'center'}>
                            <Typography variant="h6">
                                Sign up form
                            </Typography>
                            <Divider />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth variant="outlined" label='First name' type={'text'}
                                onChange={(event) => { updateState({ firstName: event.target.value }) }}
                            />
                        </Grid>
                        <Grid item xs={12}>

                            <TextField fullWidth variant="outlined" label=' last name' type={'text'}
                                onChange={(event) => { updateState({ lastName: event.target.value }) }}
                            />
                        </Grid>
                        <Grid item xs={12}>

                            <TextField fullWidth variant="outlined" label='Email' type={'email'}
                                onChange={(event) => { updateState({ email: event.target.value }) }}
                            />

                        </Grid>
                        <Grid item xs={12}>
                            <Divider />
                            <Container>
                                Gender
                                <RadioGroup onChange={(event) => { updateState({ gender: event.target.value }) }}>
                                    <FormControlLabel value='m' control={<Radio />} label='Male' />
                                    <FormControlLabel value='f' control={<Radio />} label='Female' />
                                </RadioGroup>
                            </Container>
                            <Divider />
                        </Grid>
                        <Grid item xs={12}>
                            <Container>
                                Are you a seller?
                                <RadioGroup onChange={(event) => { updateState({ isSeller: event.target.value }) }}>
                                    <FormControlLabel control={<Radio />} value={false} label='No' />
                                    <FormControlLabel control={<Radio />} value={true} label='Yes' />
                                </RadioGroup>
                            </Container>
                            <Divider />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth variant="outlined" label='Password' type={'password'}
                                onChange={(event) => { updateState({ password1: event.target.value }) }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth variant="outlined" label='Confirm password' type={'password'}
                                onChange={(event) => { updateState({ password2: event.target.value }) }}
                            />
                        </Grid>
                        <Grid item xs={12} display={'flex'} justifyContent='center' alignItems={'center'}>
                            <Button variant="contained" startIcon={<Submit />}
                                onClick={(event) => { signUp(event, states, updateState) }}>
                                Sign Up
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Box>
    );
}

export default Register;