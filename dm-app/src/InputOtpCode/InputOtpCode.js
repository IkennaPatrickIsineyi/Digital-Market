import { Box, Button, Card, CardContent, Grid, TextField } from "@mui/material";
import { useState } from "react";
import { remoteRequest } from "../app/model";
import { verifyOtp } from "./inputOtpCodeLogic";

function InputOtpCode() {
    const [states, setState] = useState({ remoteRequest: remoteRequest, otp: 0 });
    const updateState = (newValue) => {
        setState((previousValue) => { return { ...previousValue, ...newValue } });
    }

    return (
        <Box display='flex' justifyContent='center' alignItems='center'>
            <Card>
                <CardContent>
                    <Grid container rowSpacing={2}>
                        <Grid item xs={12} display='flex' justifyContent='center' alignItems='center'>
                            Enter the OTP code that we just sent to your email?
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth variant="outlined" label='OTP Code' type={'number'}
                                onChange={(event) => { updateState({ otp: event.target.value }) }}
                            />
                        </Grid>
                        <Grid item xs={12} display='flex' justifyContent='center' alignItems='center'>
                            <Button variant="contained"
                                onClick={(event) => { verifyOtp(event, states, updateState) }}>
                                Submit OTP Code
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

        </Box>
    );
}

export default InputOtpCode;