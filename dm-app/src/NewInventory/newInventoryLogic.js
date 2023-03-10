
const addInventory = (event, state, updateState, remoteRequest, dispatch, openSnackbar) => {
    console.log('addInventory')
    // updateState({ checking: true });

    event.preventDefault();

    const productId = state.productInput;
    const title = state.titleInput;
    const description = state.descriptionInput;
    const quantity = state.quantityInput;
    const price = state.priceInput;

    const showSnackBar = (message, severity) => {
        dispatch(openSnackbar({ message: message, severity: severity }))
    }
    console.log('klkd', state, productId, title.length, description.length, Number(quantity), price.length)

    if (productId && title.length && description.length && Number(quantity) && price.length) {

        const body = JSON.stringify({
            productId: productId, description: description, title: title,
            qty: quantity, price: price
        });

        const payload = {
            method: 'post', credentials: 'include', body: body, headers: {
                'Content-Type': 'application/json'
            }
        };
        const callback = (body) => {
            //updateState({ frontPageData: body.result.frontPage, userData: body.result.userData }); 
            //dispatch(loadFrontPageData(body.result.frontPage));
            //dispatch(loadUserData(body.result.userData));  
            /* dispatch(loadUserData({
                email: userData?.email, isAdmin: userData?.is_admin,
                isSeller: userData?.is_seller
            })); */
            //updateState({ data: { ...body.result, reRouted: true } });
            if (body?.result) {
                showSnackBar('New Inventory added', 'success');
                updateState({
                    productInput: null, titleInput: '',
                    descriptionInput: '', quantityInput: '', priceInput: ''
                })
            }
            else if (body?.errMsg === 'bad-db-input') {
                showSnackBar('This product already exists in this category', 'error');
            }
            else if (body?.errMsg === 'not-logged-in') {
                console.log('not logged in');
                showSnackBar('Kndly login to proceed', 'error');
            }
            else if (body?.error === 'seller-only') {
                showSnackBar('Only sellers are allowed access', 'error');
            }
            else {
                showSnackBar('Something went wrong', 'error');
            }
        }
        remoteRequest('add-new-inventory', payload, showSnackBar, callback);
    }
    else {
        showSnackBar('All Fields are required', 'error');
    }

};

export { addInventory };