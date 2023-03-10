
const addProduct = (event, state, updateState, remoteRequest) => {
    console.log('addCategories')
    // updateState({ checking: true });
    event.preventDefault();
    const showSnackBar = (message, severity) => {
        updateState({
            snackbar: {
                ...state.snackbar, open: true,
                message: message, severity: severity
            }
        })
    }

    const body = JSON.stringify({
        category: state.categoryInput, product: state.productNameInput
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
            updateState({
                data: {
                    ...state.data, products: [...state.data.products, {
                        category: state.categoryInput,
                        product_name: state.productNameInput,
                        product_id: body.result.product_id
                    }]
                }, addNewProduct: false
            });
        }
        else if (body?.errMsg === 'bad-db-input') {
            showSnackBar('This product already exists in this category', 'error');
        }
        else if (body?.error === 'admin-only') {
            showSnackBar('Only admins are allowed access', 'error');
        }
        else if (body?.error === 'failed') {
            showSnackBar('Something went wrong', 'error');
        }
    }
    remoteRequest('add-product', payload, showSnackBar, callback);
};

export { addProduct };