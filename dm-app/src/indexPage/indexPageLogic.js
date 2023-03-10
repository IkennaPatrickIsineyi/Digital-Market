
const getHomePage = (state, updateState, remoteRequest, dispatch, loadUserData) => {
    console.log('checkLoginStatus')
    updateState({ checking: true });

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
        const userData = body.userData;
        dispatch(loadUserData({
            email: userData?.email, isAdmin: userData?.is_admin,
            isSeller: (userData?.is_seller === 'true') ? true : false
        }));
        updateState({ data: { ...body.result, reRouted: true } });
    }
    remoteRequest('', payload, showSnackBar, callback);
};

export { getHomePage };