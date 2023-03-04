import { Box, Button, Card, CardContent, CardMedia, Container, Divider, Grid } from "@mui/material";
import sampleImg from '../images/icons8-receptionist-66.png';

function ItemDetails() {

    return (
        <Box display='flex' justifyContent={'center'} alignItems='center'>
            <Card>
                <CardContent>

                    <Grid container rowSpacing={2}>
                        <Grid item xs={12}>
                            <CardMedia component={'img'} image={sampleImg} />
                        </Grid>

                        <Grid item xs={12}>
                            <Card>
                                <Container>
                                    <Grid container>
                                        <Grid item xs={12} sx={{ pt: 1 }}>
                                            title
                                            <Divider />
                                        </Grid>
                                        <Grid item xs={6} sx={{ py: 1 }}>
                                            price
                                        </Grid>
                                        <Grid item xs={6} sx={{ py: 1 }}>
                                            rating
                                        </Grid>
                                    </Grid>

                                </Container>
                            </Card>
                        </Grid>

                        <Grid item xs={12} display='flex' justifyContent={'center'} alignItems='center'>
                            <Button variant='contained'>
                                Add to cart
                            </Button>
                        </Grid>

                        <Grid item xs={12}>
                            <Card>
                                <Container sx={{ py: 1 }}>
                                    reviews
                                </Container>
                            </Card>
                        </Grid>

                        <Grid item xs={12}  >
                            <Card>
                                <Container sx={{ py: 1 }}>
                                    description
                                </Container>
                            </Card>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Box>
    );
}

export default ItemDetails;