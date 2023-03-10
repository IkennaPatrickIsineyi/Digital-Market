import { Button, Card, CardContent, Container, Divider, FormControlLabel, Grid, Radio, RadioGroup, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { editProfile } from "./editProfileLogic";
import { useDispatch } from "react-redux";
import { reRouteRequest, openSnackbar } from "../app/routeSlice";
import { remoteRequest } from "../app/model";

function EditProfile() {
    const labelArr = [['First Name', 'text', 'firstName'], ['Last Name', 'text', 'lastName'],
    ['Phone Number', 'text', 'phone']];

    const location = useLocation();
    const dispatch = useDispatch();
    const [state, setState] = useState({
        data: location.state ?? {
            firstName: '', lastName: '', phone: '', gender: '', picture: '', isSeller: false
        }
    });

    console.log('location state: ', location.state);
    console.log('edit profile state: ', state);

    const updateState = (newValue) => {
        setState((previousValue) => {
            return { ...previousValue, ...newValue }
        })
    }

    const handleGender = (event) => {
        updateState({ data: { ...state.data, gender: event.target.value } });
    }

    const handleSeller = (event) => {
        updateState({ data: { ...state.data, isSeller: event.target.value } });
    }

    const handleFirstName = (event) => {
        updateState({ data: { ...state.data, firstName: event.target.value } });
    }

    const handleLastName = (event) => {
        updateState({ data: { ...state.data, laseName: event.target.value } });
    }

    const handlePhone = (event) => {
        updateState({ data: { ...state.data, phone: event.target.value } });
    }

    const handleClick = (event) => {
        editProfile(event, state, updateState, dispatch,
            reRouteRequest, remoteRequest, openSnackbar)
    }

    const values = {
        phone: state.data.phone, lastName: state.data.lastName,
        firstName: state.data.firstName
    };

    const handlers = {
        phone: handlePhone, lastName: handleLastName,
        firstName: handleFirstName
    };

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
                                <TextField fullWidth label={label[0]} type={label[1]}
                                    defaultValue={values[label[2]]}
                                    onChange={handlers[label[2]]}
                                />
                            </Grid>
                        ))}
                        <Grid item xs={12}>
                            <Container>
                                <Divider />
                                <Typography>
                                    Are you a seller?
                                </Typography>
                                <RadioGroup defaultValue={Boolean(state.data.isSeller)} onChange={handleSeller}>
                                    <FormControlLabel value={true} label='Yes' control={<Radio />} />
                                    <FormControlLabel value={false} label='No' control={<Radio />} />
                                </RadioGroup>
                                <Divider />
                            </Container>

                            <Container sx={{ 'pt': 2 }}>
                                <Divider />
                                <Typography>
                                    Gender?
                                </Typography>
                                <RadioGroup defaultValue={state.data.gender} onChange={handleGender}>
                                    <FormControlLabel value={'m'} label='Male' control={<Radio />} />
                                    <FormControlLabel value={'f'} label='Female' control={<Radio />} />
                                </RadioGroup>
                                <Divider />
                            </Container>

                            <Grid item xs={12} sx={{ 'pt': 2 }} display='flex' justifyContent={'center'} alignItems='center'>
                                <Button variant='contained'
                                    onClick={handleClick}>
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