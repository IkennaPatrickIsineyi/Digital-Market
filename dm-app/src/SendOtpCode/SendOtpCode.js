import { Box, Button, Card, CardContent, Grid, TextField } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { remoteRequest } from "../model";
import { resetPassword } from "./sendOtpCodeLogic";

function SendOtpCode() {
    const navigate = useNavigate();
    const [states, setState] = useState({ navigate: navigate, remoteRequest: remoteRequest, email: '' });

    const updateState = (newValue) => {
        setState((previousValue) => { return { ...previousValue, ...newValue } });
    }

    return (
        <Box display='flex' justifyContent='center' alignItems='center'>
            <Card>
                <CardContent>
                    <Grid container rowSpacing={2}>
                        <Grid item xs={12} display='flex' justifyContent='center' alignItems='center'>
                            What is your email address?
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth variant="outlined" label='email' type={'email'}
                                onChange={(event) => { updateState({ email: event.target.value }) }}
                            />
                        </Grid>
                        <Grid item xs={12} display='flex' justifyContent='center' alignItems='center'>
                            <Button variant="contained"
                                onClick={(event) => { resetPassword(event, states, updateState) }}>
                                Receive OTP Code
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

        </Box>
    );
}

export default SendOtpCode;