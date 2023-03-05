import { Box, Card, CardContent, CircularProgress } from "@mui/material";
import { Container } from "@mui/system";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AdminHome from "../AdminHome/AdminHome";
import Home from "../Home/Home";
import { remoteRequest } from "../model";
import { checkLoginStatus } from "./indexPageLogic";
//import checkLoginStatus from './indexPageLogic';

function IndexPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const [state, setState] = useState({
        navigate: navigate, checking: false,
        remoteRequest: remoteRequest, frontPageData: location.state?.frontPage ?? {},
        userData: location.state?.userData ?? {},
        snackbar: { open: false, message: '', severity: '', autoHideDuration: 6000 }
    });

    const updateState = (newValue) => {
        setState((previousValue) => {
            return { ...previousValue, ...newValue };
        });
    }

    return (
        <>
            {(Object.keys(state.frontPageData).length)
                ?
                (state.userData?.is_admin)
                    ?
                    <AdminHome data={state.frontPageData} />
                    :
                    <Home data={state.frontPageData} />
                :
                <Box display='flex' justifyContent='center' alignItems='center'>
                    <Container>
                        <Card>
                            <CardContent>
                                <CircularProgress />
                                Loading...
                            </CardContent>
                        </Card>
                    </Container>
                    {(!state.checking) ? checkLoginStatus(state, updateState) : null}
                </Box>
            }
        </>
    )
}

export default IndexPage;