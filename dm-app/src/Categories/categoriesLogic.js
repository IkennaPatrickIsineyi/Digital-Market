
const addCategory = (event, state, updateState, remoteRequest) => {
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
        category: state.categoryInput, description: state.descriptionInput
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
                data: [...state.data, {
                    category: state.categoryInput,
                    description: state.descriptionInput
                }], addNewCategory: false
            });
        }
        else if (body?.errMsg === 'duplicate') {
            showSnackBar('Category already exists', 'error');
        }
        else if (body?.error === 'admin-only') {
            showSnackBar('Only admins are allowed access', 'error');
        }
        else if (body?.error === 'failed') {
            showSnackBar('Something went wrong', 'error');
        }
    }
    remoteRequest('add-category', payload, showSnackBar, callback);
};

export { addCategory };