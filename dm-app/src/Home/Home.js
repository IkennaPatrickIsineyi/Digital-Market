import { Button, Card, CardActions, CardContent, CardHeader, CardMedia, Container, Grid, IconButton, Typography } from "@mui/material";
import sampleImg from '../images/icons8-doctor-male-48.png';
import AddShoppingCart from "@mui/icons-material/AddShoppingCart";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();

    const [state, setState] = useState({ trending: {}, latest: {}, viewed: {} });

    const updateState = (newValue) => {
        setState((previousValue) => {
            return { ...previousValue, ...newValue }
        })
    }

    return (
        <>
            <Grid container >

                <Grid container lg={4} xs={12} order={{ lg: 1, xs: 2 }} >
                    {/*  For trending items */}
                    <Container>
                        <Card>
                            <CardContent>
                                <CardHeader component="string" title='Hot Trends' />

                                <Grid container rowSpacing={1} >
                                    {[...Array(5)].map((_, indx) => (
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

                            </CardContent>
                        </Card>
                    </Container>
                </Grid>

                <Grid container rowSpacing={1} lg={4} xs={12} order={{ lg: 2, xs: 1 }}>
                    {/* For most recently added items */}
                    {[...Array(25)].map((_, indx) =>
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

                <Grid container lg={4} xs={12} order={{ lg: 3, xs: 3 }}>
                    {/* For recently viewed items */}
                    <Container>
                        <Card>
                            <CardContent>
                                <CardHeader component="string" title='Latest Releases' />

                                <Grid container rowSpacing={1} >
                                    {[...Array(5)].map((trend) => (
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
            </Grid>

        </>
    );
}

export default Home;