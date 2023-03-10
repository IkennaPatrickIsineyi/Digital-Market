import { Box, Button, Card, CardContent, Grid, TextField } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { remoteRequest } from "../app/model";
import { snackBar } from "../app/SharedComponent";
import { verifyOtp } from "./resetPasswordLogic";

function ResetPassword() {
    const navigate = useNavigate();
    const [state, setState] = useState({
        navigate: navigate,
        remoteRequest: remoteRequest, otp: 0, password1: '', password2: '',
        snackbar: { open: false, message: '', severity: '', autoHideDuration: 6000 }
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
                                onClick={(event) => { verifyOtp(event, state, updateState) }}>
                                Reset Password
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
            {snackBar(state, updateState)}
        </Box>
    );
}

export default ResetPassword;