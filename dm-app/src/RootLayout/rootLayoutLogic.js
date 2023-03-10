

exports.logOut = (event, state, updateState, dispatch, logOutUser) => {

    event.preventDefault();

    const returnPath = state.returnPath;
    const nextRoute = state.nextRoute;

    const showSnackBar = (message, severity) => {
        updateState({
            snackbar: {
                ...state.snackbar, open: true,
                message: message, severity: severity
            }
        })
    }

    //const body = JSON.stringify({ email: email, password: password, returnPath: returnPath });

    const payload = {
        method: 'get', credentials: 'include'
    };

    const callback = (body) => {
        if (body?.result === 'logged-out') {

            console.log('Logout success', 'success', body.result);

            /*  dispatch(loadFrontPageData(body.result.frontPage));
             dispatch(loadUserData(body.result.userData)); */
            localStorage.removeItem('user');
            dispatch(logOutUser());
            showSnackBar('Logged out', 'success');
            // state.navigate(nextRoute, { state: { ...body.result, reRouted: true } });
        }
        else if (body?.error === 'not-logged-in') {
            localStorage.removeItem('user');
            //showSnackBar('You are not logged in', 'info');

        }
    }

    state.remoteRequest('logout', payload, showSnackBar, callback);

};


exports.editProfile = (event, state, updateState, dispatch,
    reRouteRequest, remoteRequest, navigate) => {
    console.log('editProfile');
    //const email = state.email;

    const showSnackBar = (message, severity) => {
        updateState({
            snackbar: {
                ...state.snackbar, open: true,
                message: message, severity: severity
            }
        })
    }

    event.preventDefault();

    const payload = { method: 'get', credentials: 'include' };

    const callback = (body) => {
        if (body?.result) {
            navigate('/edit-profile', { state: { ...body.result } })
        }
        else if (body?.error === 'not-logged-in') {
            dispatch(reRouteRequest({
                nextRoute: '/edit-profile',
                returnPath: '/user-profile',
                returnBody: {},
                returnMethod: 'get',
                loginType: 'pageSwitch',
                nextRouteState: {},
            }));
        }
        else {
            showSnackBar('Invalid', 'error');
        }
    }

    remoteRequest('user-profile', payload, showSnackBar, callback);


}


exports.addNewStock = (event, state, updateState, dispatch,
    reRouteRequest, remoteRequest, navigate) => {
    console.log('addNewStock');
    //const email = state.email;

    const showSnackBar = (message, severity) => {
        updateState({
            snackbar: {
                ...state.snackbar, open: true,
                message: message, severity: severity
            }
        })
    }

    event.preventDefault();

    const payload = { method: 'get', credentials: 'include' };

    const callback = (body) => {
        if (body?.result) {
            navigate('/new-inventory', { state: { ...body.result } })
        }
        else if (body?.error === 'not-logged-in') {
            dispatch(reRouteRequest({
                nextRoute: '/new-inventory',
                returnPath: '/products',
                returnBody: {},
                returnMethod: 'get',
                loginType: 'pageSwitch',
                nextRouteState: {},
            }));
        }
        else {
            showSnackBar('Invalid', 'error');
        }
    }

    remoteRequest('products', payload, showSnackBar, callback);


} 
