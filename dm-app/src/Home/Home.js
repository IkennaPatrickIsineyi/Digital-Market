import { Button, Card, CardActions, CardContent, CardHeader, CardMedia, Container, Grid, IconButton, Typography } from "@mui/material";
import sampleImg from '../images/icons8-doctor-male-48.png';
import AddShoppingCart from "@mui/icons-material/AddShoppingCart";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Home(props) {

    const trending = props.data.trending;
    const viewed = props.data.recentlyViewed;
    const latest = props.data.latest;

    const navigate = useNavigate();

    const [state, setState] = useState({});

    const updateState = (newValue) => {
        setState((previousValue) => {
            return { ...previousValue, ...newValue };
        });
    };

    return (
        <>
            <Grid container >
                {(trending.length) ?
                    <Grid container lg={4} xs={12} order={{ lg: 1, xs: 2 }} >
                        {/*  For trending items */}
                        <Container>
                            <Card>
                                <CardContent>
                                    <CardHeader component="string" title='Hot Trends' />


                                    <Grid container rowSpacing={1} >
                                        {state.trending.map((_, indx) => (
                                            <Grid item xs={12}>
                                                <Card   >
                                                    <CardContent>
                                                        <CardMedia component={'img'} image={sampleImg} />
                                                        <Grid container>
                                                            <Grid item xs={12} >
                                                                {"Title " + indx}
                                                            </Grid>
                                                            <Grid item xs={6}>
                                                                {"Rating " + indx}
                                                            </Grid>
                                                            <Grid item xs={6}>
                                                                {"Price " + indx}
                                                            </Grid>

                                                        </Grid>
                                                        <CardActions>
                                                            <Button variant="contained" size="small" startIcon={<AddShoppingCart />} >
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

                {(latest.length) ?
                    <Grid container rowSpacing={1} lg={4} xs={12} order={{ lg: 2, xs: 1 }}>
                        {/* For most recently added items */}
                        {state.latest.map((_, indx) =>
                        (<Grid item lg={4} xs={12}>
                            <Container>
                                <Card   >

                                    <CardContent>
                                        <CardMedia component={'img'} image={sampleImg} />
                                        <Grid container>
                                            <Grid item xs={12} >
                                                {"Title " + indx}
                                            </Grid>
                                            <Grid item xs={6}>
                                                {"Rating " + indx}
                                            </Grid>
                                            <Grid item xs={6}>
                                                {"Price " + indx}
                                            </Grid>

                                        </Grid>
                                        <CardActions>
                                            <Button variant="contained" size="small" startIcon={<AddShoppingCart />} >
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
                                        {state.viewed.map((trend) => (
                                            <Grid item xs={12}>
                                                <Card   >
                                                    <CardContent>
                                                        <CardMedia component={'img'} image={sampleImg} />
                                                        <Grid container>
                                                            <Grid item xs={12} >
                                                                {"Title "}
                                                            </Grid>
                                                            <Grid item xs={6}>
                                                                {"Rating "}
                                                            </Grid>
                                                            <Grid item xs={6}>
                                                                {"Price "}
                                                            </Grid>

                                                        </Grid>
                                                        <CardActions>
                                                            <Button variant="contained" size="small" startIcon={<AddShoppingCart />} >
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