import { Box, Card, CardContent, CircularProgress } from "@mui/material";
import { Container } from "@mui/system";
import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AdminHome from "../AdminHome/AdminHome";
import Home from "../Home/Home";
import { remoteRequest } from "../app/model";
import { getHomePage } from "./indexPageLogic";
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { dataUsed } from '../app/frontPageSlice';
import { loadUserData } from '../app/userDataSlice';

//import checkLoginStatus from './indexPageLogic';

function IndexPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();


    //const frontPage = useSelector((state) => state.frontPage);
    const userData = useSelector((state) => state.userData);
    const isLoggingIn = useSelector((state) => state.route.isLoggingIn);

    //const reRouting = useSelector((state) => state.route.reRouting);


    const [state, setState] = useState({
        data: location.state, checking: false, dataUsed: dataUsed,
        snackbar: { open: false, message: '', severity: '', autoHideDuration: 6000 },
        complete: false
    });

    const updateState = (newValue) => {
        setState((previousValue) => {
            return { ...previousValue, ...newValue };
        });
    }

    const data = state.data;

    /* useMemo(() => {
        console.log('data', data);
        dispatch(loadUserData({
            email: data?.userData?.email,
            isAdmin: data?.userData?.is_admin, isSeller: data?.userData?.isSeller
        }));
    }, [data]) */

    // console.log(frontPage.used);
    console.log('data?.frontPage', data?.frontPage, 'userData', userData);

    return (
        <>
            {(data?.frontPage && !isLoggingIn)
                ?
                (userData?.isAdmin)
                    ?
                    <AdminHome data={data.frontPage} />
                    :
                    <Home data={data.frontPage} />
                :
                !isLoggingIn && <Box display='flex' justifyContent='center' alignItems='center'>
                    <Container>
                        <Card>
                            <CardContent>
                                {
                                    (state.snackbar.message === 'Check your Internet connection') ?
                                        'Network Error: Check your Internet connection'
                                        :
                                        <Container>
                                            <CircularProgress />
                                            Loading...
                                        </Container>
                                }
                            </CardContent>
                        </Card>
                    </Container>
                    {(!state.checking) ? getHomePage(state, updateState,
                        remoteRequest, dispatch, loadUserData) : null}
                </Box>
            }
        </>
    )
}

export default IndexPage;