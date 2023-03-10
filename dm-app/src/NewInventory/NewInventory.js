import { Box, Button, ButtonGroup, Card, CardContent, Divider, FormControl, Grid, InputLabel, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { remoteRequest } from "../app/model";
import { addInventory } from "./newInventoryLogic";
import { openSnackbar } from "../app/routeSlice";


function NewInventory() {
    const location = useLocation();
    const dispatch = useDispatch()

    const [state, setState] = useState({
        data: location.state ?? {
            categories: [],
            products: [{ product_id: '', product_name: '', category: '' }]
        },
        addNewProduct: false, titleInput: '', descriptionInput: '', priceInput: '',
        quantityInput: 0, productInput: '', categoryInput: ''
    });

    const updateState = (newValues) => {
        setState((previousValue) => {
            return { ...previousValue, ...newValues }
        })
    }

    const handleTitle = (event) => {
        updateState({ titleInput: event.target.value });
    }

    const handleDescription = (event) => {
        updateState({ descriptionInput: event.target.value });
    }

    const handlePrice = (event) => {
        updateState({ priceInput: event.target.value });
    }

    const handleQuantity = (event) => {
        updateState({ quantityInput: event.target.value });
    }

    const handleProduct = (event) => {
        updateState({ productInput: event.target.value });
    }

    const handleCategory = (event) => {
        updateState({ categoryInput: event.target.value });
    }

    const handleClick = (event) => {
        addInventory(event, state, updateState, remoteRequest, dispatch, openSnackbar)
    }


    const values = [
        { label: 'Title', processor: handleTitle, type: 'text' },
        { label: 'Description', processor: handleDescription, type: 'text' },
        { label: 'Price', processor: handlePrice, type: 'text' },
        { label: 'Quantity', processor: handleQuantity, type: 'number' },
    ];

    const products = state.data.products;
    const categories = state.data.categories;

    console.log(state);


    return (
        <Box display='flex' justifyContent='center' alignItems='center'>
            <Card>
                <CardContent>

                    <Grid container>
                        <Grid item xs={12}>
                            {<Card>

                                <Typography align='center' sx={{ typography: { xs: 'h6', md: 'h4' } }}>
                                    Add New Inventory
                                </Typography>
                                <Divider />
                                <Grid container rowSpacing={2} sx={{ 'pt': 2 }} display='flex' justifyContent={'center'} alignItems='center'>

                                    {values.map(entry =>
                                        <Grid item xs={12}>
                                            <TextField fullWidth label={entry.label} type={entry.type}
                                                onChange={entry.processor}
                                            />
                                        </Grid>
                                    )}

                                    <FormControl fullWidth>
                                        <InputLabel id='category-id'>Select Category</InputLabel>
                                        <Select labelId="category-id" fullWidth
                                            variant='filled'
                                            onChange={handleCategory}>

                                            {products.map(product =>
                                                <MenuItem value={product.category}>
                                                    {product.category}
                                                </MenuItem>
                                            )}

                                        </Select>
                                    </FormControl>

                                    <Grid item xs={12}>
                                        <FormControl fullWidth>
                                            <InputLabel id='product-id'>Select Product</InputLabel>
                                            <Select labelId="product-id" fullWidth
                                                variant='filled'
                                                onChange={handleProduct}>

                                                {products.filter(
                                                    entry => entry.category === state.categoryInput)
                                                    .map(product =>
                                                        <MenuItem value={product.product_id}>
                                                            {product.product_name}
                                                        </MenuItem>
                                                    )}

                                            </Select>
                                        </FormControl>

                                    </Grid>

                                    <Grid item xs={12} sx={{ 'pt': 2 }} display='flex' justifyContent={'center'} alignItems='center'>
                                        <Button variant='contained' onClick={handleClick}>
                                            Save Item
                                        </Button>
                                    </Grid>


                                </Grid>

                            </Card>
                            }
                        </Grid>

                    </Grid>
                </CardContent>

            </Card>

        </Box>
    );
}

export default NewInventory;