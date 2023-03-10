exports.addToCart = (event, state, updateState, dispatch,
    loadUserData, loginComplete) => {
    console.log('addToCart');

    event.preventDefault();
    const nextRoute = state.returnData.nextRoute;

    const showSnackBar = (message, severity) => {
        updateState({
            snackbar: {
                ...state.snackbar, open: true,
                message: message, severity: severity
            }
        })
    }

    const payload = {
        method: 'get', credentials: 'include'
    };

    const callback = (body) => {
        if (body?.result) {
            /*  console.log('success');
             dispatch(loadFrontPageData(body.result.frontPage));
             dispatch(loadUserData(body.userData));
             state.navigate('/'); */

            /*   const userData = body.userData;
              dispatch(loadUserData({
                  email: userData?.email, isAdmin: userData?.is_admin,
                  isSeller: userData?.is_seller
              }));
              dispatch(loginComplete()); */

            state.navigate('/edit-profile', { state: body.result });
        }
        else if (body?.error === 'not-logged-in') {
            //save state, set loginType to pageSwitch 
            // set nexRoute,returnPath,nextRouteState 

            state.dispatch(state.reRouteRequest({
                nextRoute: '/edit-profile',
                returnPath: '/user-profile', returnBody: {},
                returnMethod: 'get', loginType: 'pageSwitch'
            }));

        }
        else if (body?.error === 'failed' && body?.errMsg === 'bad-db-input') {
            console.log('email already exits');
        }
        else if (body?.error === 'failed' && body?.errMsg === 'RegenerationErr') {
            console.log('Login now');
        }
        else if (body?.error === 'failed' &&
            (body?.errMsg === 'RegenerationErr' || body?.errMsg === 'savingErr')) {
            console.log('Login now');
        }
        else if (body?.error === 'failed' && body?.errMsg === 'not-created') {
            console.log('Try again');
        }
        else {
            console.log('Try again');
        }
    }

    state.remoteRequest('user-profile', payload, showSnackBar, callback);


}

exports.getItemDetails = (event, state, updateState, dispatch,
    navigate, inventoryId) => {
    console.log('getItemDetails');

    event.preventDefault();
    //const nextRoute = state.returnData.nextRoute;

    const showSnackBar = (message, severity) => {
        updateState({
            snackbar: {
                ...state.snackbar, open: true,
                message: message, severity: severity
            }
        })
    }

    const payload = {
        method: 'get', credentials: 'include'
    };

    const callback = (body) => {
        if (body?.result) {
            /*  console.log('success');
             dispatch(loadFrontPageData(body.result.frontPage));
             dispatch(loadUserData(body.userData));
             state.navigate('/'); */

            /*   const userData = body.userData;
              dispatch(loadUserData({
                  email: userData?.email, isAdmin: userData?.is_admin,
                  isSeller: userData?.is_seller
              }));
              dispatch(loginComplete()); */

            navigate('/item-details', { state: body.result });
        }
        else if (body?.error === 'not-logged-in') {
            //save state, set loginType to pageSwitch 
            // set nexRoute,returnPath,nextRouteState 

            dispatch(state.reRouteRequest({
                nextRoute: '/item-details',
                returnPath: '/item-details/?' + inventoryId,
                returnBody: {},
                returnMethod: 'get', loginType: 'pageSwitch'
            }));

        }
        else if (body?.error === 'failed' && body?.errMsg === 'bad-db-input') {
            console.log('email already exits');
        }
        else if (body?.error === 'failed' && body?.errMsg === 'RegenerationErr') {
            console.log('Login now');
        }
        else if (body?.error === 'failed' &&
            (body?.errMsg === 'RegenerationErr' || body?.errMsg === 'savingErr')) {
            console.log('Login now');
        }
        else if (body?.error === 'failed' && body?.errMsg === 'not-created') {
            console.log('Try again');
        }
        else {
            console.log('Try again');
        }
    }

    state.remoteRequest('item-details/?' + inventoryId, payload, showSnackBar, callback);


}