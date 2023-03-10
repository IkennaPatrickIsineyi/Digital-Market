
const getCategories = (event, state, updateState, remoteRequest, navigate) => {
    console.log('getCategories')
    // updateState({ checking: true });

    const showSnackBar = (message, severity) => {
        updateState({
            snackbar: {
                ...state.snackbar, open: true,
                message: message, severity: severity
            }
        })
    }

    const payload = { method: "get", credentials: 'include' };
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
            navigate('/categories', { state: { data: body.result } })
        }
        else if (body?.error === 'failed') {
            showSnackBar('Something went wrong', 'error');
        }
    }
    remoteRequest('categories', payload, showSnackBar, callback);
};


const getProducts = (event, state, updateState, remoteRequest, navigate) => {
    console.log('getProducts')
    // updateState({ checking: true });

    const showSnackBar = (message, severity) => {
        updateState({
            snackbar: {
                ...state.snackbar, open: true,
                message: message, severity: severity
            }
        })
    }

    const payload = { method: "get", credentials: 'include' };
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
            navigate('/products', { state: { data: body.result } })
        }
        else if (body?.error === 'failed') {
            showSnackBar('Something went wrong', 'error');
        }
    }
    remoteRequest('products', payload, showSnackBar, callback);
};

export { getCategories, getProducts };