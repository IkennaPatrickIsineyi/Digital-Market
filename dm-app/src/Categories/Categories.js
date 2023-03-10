import { Box, Button, ButtonGroup, Card, CardContent, Container, Divider, fabClasses, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { addCategory } from "./categoriesLogic";
import { remoteRequest } from '../app/model';

function Categories() {
    const location = useLocation();

    const [state, setState] = useState({
        data: location.state.data ?? [],
        addNewCategory: false, categoryInput: '', descriptionInput: ''
    });

    const updateState = (newValues) => {
        setState((previousValue) => {
            return { ...previousValue, ...newValues }
        })
    }
    console.log(state);

    const heading = ['Category', 'Description'];

    const values = [{ label: 'Category', value: 'categoryInput' },
    { label: 'Description', value: 'descriptionInput' }];
    const body = state.data;


    return (
        <Box display='flex' justifyContent='center' alignItems='center'>
            <Card>
                <CardContent>
                    <Grid container>
                        <Grid item>
                            <ButtonGroup>
                                <Button onClick={(event) => {
                                    updateState({ addNewCategory: !state.addNewCategory })
                                }}>
                                    Add Category
                                </Button>
                            </ButtonGroup>
                        </Grid>

                        <Grid item xs={12}>
                            {state.addNewCategory && <Container>
                                <CardContent>
                                    <Typography align='center' sx={{ typography: { xs: 'h6', md: 'h4' } }}>
                                        Add New Category
                                    </Typography>
                                    <Divider />
                                    <Grid container rowSpacing={2} sx={{ 'pt': 2 }} display='flex' justifyContent={'center'} alignItems='center'>
                                        {values.map((box, index) => (
                                            <Grid item xs={12}>
                                                <TextField fullWidth label={box.label} type='text'
                                                    onChange={(event) => { updateState({ [box.value]: event.target.value }) }}
                                                />
                                            </Grid>
                                        ))}


                                        <Grid item xs={12} sx={{ 'pt': 2 }} display='flex' justifyContent={'center'} alignItems='center'>
                                            <Button variant='contained'
                                                onClick={(event) => {
                                                    addCategory(event, state, updateState, remoteRequest)
                                                }}>
                                                Save Category
                                            </Button>
                                        </Grid>


                                    </Grid>
                                </CardContent>
                            </Container>
                            }
                        </Grid>

                        <Grid item xs={12}>
                            <Card>
                                Product Categories
                                <TableContainer sx={{ maxHeight: 800 }}>
                                    <Table stickyHeader={true} >
                                        <TableHead>
                                            <TableRow >
                                                {heading.map((title, headIndex) => (
                                                    <TableCell align="center" sx={(!headIndex) ? {
                                                        left: 0, zIndex: 800
                                                    } : {}}  >
                                                        {title}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        </TableHead>

                                        <TableBody>
                                            {body.map((rowValue, rowIndex) => (
                                                rowValue.category && rowValue.description && < TableRow >
                                                    <TableCell align="center" sx={(true) ? {
                                                        position: 'sticky',
                                                        left: 0, zindex: 800, background: 'white'
                                                    } : {}} >
                                                        {rowValue.category}
                                                    </TableCell>
                                                    <TableCell align="center"   >
                                                        {rowValue.description}
                                                    </TableCell>
                                                </TableRow>
                                            ))}

                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Card>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>






        </Box >
    );
}

export default Categories;