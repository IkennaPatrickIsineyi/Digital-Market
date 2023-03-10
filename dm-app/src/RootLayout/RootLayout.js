import { Outlet, useLocation, useNavigate } from "react-router-dom";
//import AppBar from '@mui/material/AppBar';
import { AppBar, Box, IconButton, Toolbar, Typography, Menu, MenuItem, ListItemIcon, Snackbar, ListItemText } from "@mui/material";
//import MenuIcon from "@mui/icons-material/Menu";
import LogOut from "@mui/icons-material/Logout";
import Profile from "@mui/icons-material/Person";
import LogIn from "@mui/icons-material/Login";
import Cart from "@mui/icons-material/ShoppingCartSharp";
import EditIcon from "@mui/icons-material/EditAttributesRounded";
import { logOutUser, loadUserData } from '../app/userDataSlice';
import { closeSnackbar, loginComplete, reRouteRequest } from '../app/routeSlice';
import { useDispatch, useSelector } from 'react-redux';
import { addNewStock, editProfile, logOut } from "./rootLayoutLogic";
import { useMemo, useState } from "react";
import { remoteRequest } from "../app/model";
import Login from "../Login/Login";

function RootLayout() {
    const userInfo = useSelector(state => state.userData);
    const isLoggingIn = useSelector(state => state.route.isLoggingIn);
    const openSnackbar = useSelector(state => state.route.showSnackbar);
    const message = useSelector(state => state.route.snackbarMessage);
    const severity = useSelector(state => state.route.snackbarSeverity);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const [state, setState] = useState({
        remoteRequest: remoteRequest, openMenu: false, menuAnchor: null,
        snackbar: { open: false, message: '', severity: '', autoHideDuration: 6000 }
    });

    const updateState = (newValue) => {
        setState((previousValue) => { return { ...previousValue, ...newValue } });
    }

    useMemo(() => {
        const data = JSON.parse(localStorage.getItem('user'));
        dispatch(loadUserData({
            email: data?.email ?? '',
            isAdmin: data?.isAdmin ?? false, isSeller: data?.isSeller ?? false
        }));
    }, []);


    const snackBar = (message, severity, dispatch) => {
        const handleClose = () => {
            dispatch(closeSnackbar());
        }
        return <Snackbar open={openSnackbar}
            autoHideDuration={6000}
            message={message}
            severity={severity}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            onClose={handleClose} />
    }

    const handleEdit = (event) => {
        updateState({ closeMenu: !state.closeMenu });
        editProfile(event, state, updateState,
            dispatch, reRouteRequest, remoteRequest, navigate);
    }

    const handleNewStock = (event) => {
        updateState({ closeMenu: !state.closeMenu });
        addNewStock(event, state, updateState,
            dispatch, reRouteRequest, remoteRequest, navigate);
    }

    const handleClose = (event) => {
        return updateState({ menuAnchor: event.target, closeMenu: !state.closeMenu });
    }

    const handleLogout = (event) => {
        logOut(event, state,
            updateState, dispatch, logOutUser)
    }

    const handleCart = (event) => {

    }

    const handleLogin = (event) => {
        console.log('login location.state: ', location.state);
        event.preventDefault();
        (!isLoggingIn) ? dispatch(reRouteRequest({
            nextRoute: '',
            returnPath: '',
            returnMethod: '',
            returnBody: {},
            loginType: 'direct',
            nextRouteState: location.state
        }))
            :
            dispatch(loginComplete());
    }

    const handleLogoClick = (event) => {
        navigate('/', { replace: true });
    }

    const menuContents = [
        userInfo?.email?.length && !userInfo?.isAdmin && { label: 'Edit Account', icon: EditIcon, processor: handleEdit },
        userInfo?.isSeller && { label: 'Add Inventory', icon: EditIcon, processor: handleNewStock },
    ]

    return (
        <>
            <AppBar position="sticky">
                <Toolbar>
                    {/*  <IconButton edge='start' color='inherit'
                        onClick={handleClose}>
                        <MenuIcon />
                    </IconButton> */}
                    <ListItemText onClick={handleLogoClick}>
                        <Typography variant="h5" color='inherit'>
                            DM App
                        </Typography> </ListItemText>
                    <Box sx={{ flexGrow: 1 }} />
                    {(userInfo?.email?.length)
                        ?
                        <Box sx={{ display: 'flex' }} >
                            {!userInfo?.isAdmin &&
                                <IconButton edge='start' color='inherit' size="large"
                                    onClick={handleCart}>
                                    <Cart />
                                </IconButton>}
                            <IconButton color='inherit' size="large"
                                onClick={handleClose}>
                                <Profile />
                            </IconButton>

                            <IconButton edge='end' color='inherit' size="large"
                                onClick={handleLogout}>
                                <LogOut />
                            </IconButton>
                        </Box>
                        :
                        <Box sx={{ display: 'flex' }} >
                            <IconButton edge='end' color='inherit'
                                onClick={handleLogin}>
                                <LogIn />
                            </IconButton>
                        </Box>
                    }

                </Toolbar>
            </AppBar>

            {state.closeMenu && <Menu
                onClose={handleClose}
                open={state.closeMenu}

                anchorEl={state.menuAnchor}>
                <MenuItem>
                    {'Welcome, ' + userInfo?.email ?? 'Anonymous'}
                </MenuItem>
                {menuContents.map(content =>
                    content && <MenuItem onClick={content?.processor}>
                        <ListItemIcon>
                            <EditIcon />
                        </ListItemIcon>
                        {content?.label}
                    </MenuItem>
                )}

            </Menu>}

            {openSnackbar && snackBar(message, severity, dispatch)}

            {(isLoggingIn)
                ?
                <Login />
                :
                null
            }
            <Outlet />
        </>
    );
}

export default RootLayout;