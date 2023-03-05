import { Outlet } from "react-router-dom";
//import AppBar from '@mui/material/AppBar';
import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";
import Menu from "@mui/icons-material/Menu";

function RootLayout() {

    return (
        <>
            <AppBar position="sticky">
                <Toolbar>
                    <IconButton edge='start' color='inherit'>
                        <Menu />
                    </IconButton>
                    <Typography variant="h6" color='inherit'>
                        DM App
                    </Typography>
                </Toolbar>
            </AppBar>

            <Outlet />
        </>
    );
}

export default RootLayout;