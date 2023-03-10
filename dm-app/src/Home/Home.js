import { Button, Card, CardActions, CardContent, CardHeader, CardMedia, Container, Grid, IconButton, Typography } from "@mui/material";
import sampleImg from '../images/icons8-doctor-male-48.png';
import AddShoppingCart from "@mui/icons-material/AddShoppingCart";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { dataUsed } from '../app/frontPageSlice';
//import { getProfile } from "./homeLogic";

import { reRouteRequest } from '../app/routeSlice';
import { addToCart, getItemDetails } from "./homeLogic";

function Home(props) {

    const trending = props?.data?.trending ?? [];
    const viewed = props?.data?.recentlyViewed ?? [];
    const latest = props?.data?.latest ?? [];

    const loginType = useSelector(state => state.route.loginType);

    const dispatch = useDispatch();

    useEffect(() => { dispatch(dataUsed()) }, []);


    const navigate = useNavigate();

    const [state, setState] = useState({
        // data: location.state ?? { trending: [], latest[]: viewed: []},
        loginType: loginType,
        dispatch: dispatch, reRouteRequest: reRouteRequest
    });

    const updateState = (newValue) => {
        setState((previousValue) => {
            return { ...previousValue, ...newValue };
        });
    };

    const handleAddToCart = (event) => {
        console.log('handleAddToCart ', 'id:', event.currentTarget.id)
        /* addToCart = (event, state, updateState, dispatch,
            navigate, event.target.id) */
    }

    const handleItemClick = (event) => {
        console.log('handleItemClick ', 'id:', event.currentTarget.id)
        /*  getItemDetails = (event, state, updateState, dispatch,
             navigate, event.target.id) */
    }


    return (
        <>
            <Grid container >
                {(trending?.length) ?
                    <Grid container lg={4} xs={12} order={{ lg: 1, xs: 2 }} >
                        {/*  For trending items */}
                        <Container>
                            <Card>
                                <CardContent>
                                    <CardHeader component="string" title='Hot Trends' />
                                    <Grid container rowSpacing={1} >
                                        {trending.map((item, indx) => (
                                            <Grid item xs={12}>
                                                <Card >
                                                    <CardContent>
                                                        <div id={item.inventory_id}
                                                            onClick={handleItemClick}>
                                                            <CardMedia component={'img'} image={sampleImg} />
                                                            <Grid container>
                                                                <Grid item xs={12} >
                                                                    {/* title */}
                                                                    {item.title}
                                                                </Grid>
                                                                <Grid item xs={6}>
                                                                    {/* rating */}
                                                                    {item.rating}
                                                                </Grid>
                                                                <Grid item xs={6}>
                                                                    {/* price */}
                                                                    {item.price}
                                                                </Grid>

                                                            </Grid>
                                                        </div>

                                                        <CardActions>
                                                            <Button variant="contained" size="small"
                                                                startIcon={<AddShoppingCart />}
                                                                id={item.inventory_id}
                                                                onClick={handleAddToCart}>
                                                                Add to Cart
                                                            </Button>
                                                        </CardActions>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        ))}

                                    </Grid>

                                    <Grid container rowSpacing={1} >
                                        <Grid item xs={12}>

                                            <Typography>

                                            </Typography>

                                        </Grid>
                                    </Grid>

                                </CardContent>
                            </Card>
                        </Container>
                    </Grid>
                    :
                    null
                }

                {(latest?.length) ?
                    <Grid container rowSpacing={1} lg={4} xs={12} order={{ lg: 2, xs: 1 }}>
                        {/* For most recently added items */}
                        {latest.map((item, indx) =>
                        (<Grid item lg={4} xs={12}>
                            <Container >
                                <Card  >
                                    <CardContent>
                                        <div id={item.inventory_id}
                                            onClick={handleItemClick}>
                                            <CardMedia component={'img'} image={sampleImg} />
                                            <Grid container>
                                                <Grid item xs={12} >
                                                    {/* title */}
                                                    {item.title}
                                                </Grid>
                                                <Grid item xs={6}>
                                                    {/* rating */}
                                                    {item.rating}
                                                </Grid>
                                                <Grid item xs={6}>
                                                    {/* price */}
                                                    {item.price}
                                                </Grid>

                                            </Grid>
                                        </div>

                                        <CardActions>
                                            <Button variant="contained" size="small"
                                                startIcon={<AddShoppingCart />}
                                                id={item.inventory_id}
                                                onClick={handleAddToCart}>
                                                Add to Cart
                                            </Button>
                                        </CardActions>
                                    </CardContent>
                                </Card>
                            </Container>
                        </Grid>)
                        )}

                    </Grid>
                    :
                    <Grid container rowSpacing={1} lg={4} xs={12} order={{ lg: 2, xs: 1 }} >
                        <Grid item xs={12}>
                            <Container>
                                <Card>
                                    <CardContent>
                                        <Typography>
                                            No available item
                                        </Typography>
                                    </CardContent>

                                </Card>
                            </Container>
                        </Grid>
                    </Grid>
                }

                {(viewed.length) ?
                    <Grid container lg={4} xs={12} order={{ lg: 3, xs: 3 }}>
                        {/* For recently viewed items */}
                        <Container>
                            <Card>
                                <CardContent>
                                    <CardHeader component="string" title='Latest Releases' />

                                    <Grid container rowSpacing={1} >
                                        {viewed.map((item, indx) => (
                                            <Grid item xs={12}>
                                                <Card >
                                                    <CardContent>
                                                        <div id={item.inventory_id}
                                                            onClick={handleItemClick}>
                                                            <CardMedia component={'img'} image={sampleImg} />
                                                            <Grid container>
                                                                <Grid item xs={12} >
                                                                    {/* title */}
                                                                    {item.title}
                                                                </Grid>
                                                                <Grid item xs={6}>
                                                                    {/* rating */}
                                                                    {item.rating}
                                                                </Grid>
                                                                <Grid item xs={6}>
                                                                    {/* price */}
                                                                    {item.price}
                                                                </Grid>

                                                            </Grid>
                                                        </div>

                                                        <CardActions>
                                                            <Button variant="contained" size="small"
                                                                startIcon={<AddShoppingCart />}
                                                                id={item.inventory_id}
                                                                onClick={handleAddToCart}>
                                                                Add to Cart
                                                            </Button>
                                                        </CardActions>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        ))}

                                    </Grid>

                                </CardContent>
                            </Card>
                        </Container>
                    </Grid>
                    :
                    null
                }
            </Grid>

        </>
    );
}

export default Home;