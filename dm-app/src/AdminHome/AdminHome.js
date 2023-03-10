import { Button, Card, CardContent, Grid } from "@mui/material";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { remoteRequest } from "../app/model";
import { getCategories, getProducts } from "./adminHomeLogic";

function AdminHome() {

    const navigate = useNavigate();
    const location = useLocation();

    const [state, setState] = useState({
        snackbar: { open: false, message: '', severity: '', autoHideDuration: 6000 },
    });

    const updateState = (newValue) => {
        return setState((previousValue) => {
            return { ...previousValue, ...newValue }
        })
    }

    return (
        <>
            <Grid container>
                <Grid item md={4} xs={6}>
                    <Card>
                        <CardContent>
                            <Button onClick={(event) => {
                                getCategories(event, state, updateState, remoteRequest, navigate)
                            }}>
                                categories
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item md={4} xs={6}>
                    <Card>
                        <CardContent>
                            <Button onClick={(event) => {
                                getProducts(event, state, updateState, remoteRequest, navigate)
                            }}>
                                Products
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item md={4} xs={6}>
                    <Card>
                        <CardContent>
                            <Button>
                                Others
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </>
    );
}

export default AdminHome;