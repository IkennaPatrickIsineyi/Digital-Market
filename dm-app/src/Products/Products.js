import { Box, Button, ButtonGroup, Card, CardContent, Divider, FormControl, Grid, InputLabel, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { remoteRequest } from "../app/model";
import { addProduct } from "./productsLogic";

function Products() {
    const location = useLocation();
    const [state, setState] = useState({
        data: location.state.data ?? {
            categories: [],
            products: [{ product_id: '', product_name: '', category: '' }]
        },
        addNewProduct: false, categoryInput: '', productNameInput: ''
    });

    const updateState = (newValues) => {
        setState((previousValue) => {
            return { ...previousValue, ...newValues }
        })
    }

    const heading = ['ID', 'Name', 'Category'];

    const values = [{ label: 'Product Name', value: 'productNameInput' },
    { label: 'Description', value: 'descriptionInput' }];

    const products = state.data.products;
    const categories = state.data.categories;

    console.log(state);


    return (
        <Box display='flex' justifyContent='center' alignItems='center'>
            <Card>
                <CardContent>
                    <ButtonGroup>
                        <Button onClick={(event) => {
                            updateState({ addNewProduct: !state.addNewProduct })
                        }}>
                            Add Product
                        </Button>
                    </ButtonGroup>
                    <Grid container>
                        <Grid item xs={12}>
                            {state.addNewProduct && <Card>

                                <Typography align='center' sx={{ typography: { xs: 'h6', md: 'h4' } }}>
                                    Add New Product
                                </Typography>
                                <Divider />
                                <Grid container rowSpacing={2} sx={{ 'pt': 2 }} display='flex' justifyContent={'center'} alignItems='center'>

                                    <Grid item xs={12}>
                                        <TextField fullWidth label='Product Name' type='text'
                                            onChange={(event) => { updateState({ productNameInput: event.target.value }) }}
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <FormControl fullWidth>
                                            <InputLabel id='category-id'>Select Category</InputLabel>
                                            <Select labelId="category-id" fullWidth
                                                value={state.categoryInput} variant='filled'
                                                onChange={(event) => {
                                                    updateState({ categoryInput: event.target.value })
                                                }}>
                                                {categories.map(category =>
                                                    <MenuItem value={category}>
                                                        {category}
                                                    </MenuItem>
                                                )}

                                            </Select>
                                        </FormControl>

                                    </Grid>

                                    <Grid item xs={12} sx={{ 'pt': 2 }} display='flex' justifyContent={'center'} alignItems='center'>
                                        <Button variant='contained'
                                            onClick={(event) => {
                                                addProduct(event, state, updateState, remoteRequest)
                                            }}>
                                            Save Product
                                        </Button>
                                    </Grid>


                                </Grid>

                            </Card>
                            }
                        </Grid>

                        <Grid item xs={12}>
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
                                        {products.map((rowValue, rowIndex) => (
                                            <TableRow >
                                                <TableCell align="center" sx={(true) ? {
                                                    position: 'sticky',
                                                    left: 0, zindex: 800, background: 'white'
                                                } : {}} >
                                                    {rowValue.product_id}
                                                </TableCell>
                                                <TableCell align="center"   >
                                                    {rowValue.product_name}
                                                </TableCell>
                                                <TableCell align="center"   >
                                                    {rowValue.category}
                                                </TableCell>

                                            </TableRow>
                                        ))}

                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    </Grid>
                </CardContent>

            </Card>

        </Box>
    );
}

export default Products;