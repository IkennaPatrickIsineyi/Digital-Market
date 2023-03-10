import { Box, Button, Card, CardContent, Grid, TextField } from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { remoteRequest } from "../app/model";
import { reRouteRequest } from "../app/routeSlice";
import { snackBar } from "../app/SharedComponent";
import { sendOtp } from "./TestCompLogic";

function TestComp(key = 'sam') {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

    console.log(location.state)

    const [states, setState] = useState(location.state ?? {
        count: 0, data: 0,
        email: '',
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
                            {'Count: ' + states.count + 'Data: ' + states.data}
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth variant="outlined" label='email' type={'email'}

                                onChange={(event) => { updateState({ count: event.target.value }) }}
                            />
                        </Grid>
                        <Grid item xs={12} display='flex' justifyContent='center' alignItems='center'>
                            <Button variant="contained"
                                onClick={(event) => {
                                    //  sendOtp(event, states, updateState, dispatch, reRouteRequest, remoteRequest)
                                    navigate('/testComp2')
                                }}>
                                Receive OTP Code
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
            {snackBar(states, updateState)}
        </Box>
    );
}

export default TestComp;