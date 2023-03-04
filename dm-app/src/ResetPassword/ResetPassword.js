import { Box, Button, Card, CardContent, Grid, TextField } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { remoteRequest } from "../model";
import { verifyOtp } from "./resetPasswordLogic";

function ResetPassword() {
    const navigate = useNavigate();
    const [states, setState] = useState({
        navigate: navigate,
        remoteRequest: remoteRequest, otp: 0, password1: '', password2: ''
    });

    const updateState = (newValue) => {
        setState((previousValue) => { return { ...previousValue, ...newValue } });
    }

    return (
        <Box display='flex' justifyContent='center' alignItems='center'>
            <Card>
                <CardContent>
                    <Grid container rowSpacing={2}>
                        <Grid item xs={12} display='flex' justifyContent='center' alignItems='center'>
                            Choose a new password
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth variant="outlined" label='Input OTP' type={'number'}
                                onChange={(event) => { updateState({ otp: event.target.value }) }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth variant="outlined" label='New password' type={'password'}
                                onChange={(event) => { updateState({ password1: event.target.value }) }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth variant="outlined" label='Confirm password' type={'password'}
                                onChange={(event) => { updateState({ password2: event.target.value }) }} />
                        </Grid>
                        <Grid item xs={12} display='flex' justifyContent='center' alignItems='center'>
                            <Button variant="contained"
                                onClick={(event) => { verifyOtp(event, states, updateState) }}>
                                Reset Password
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

        </Box>
    );
}

export default ResetPassword;