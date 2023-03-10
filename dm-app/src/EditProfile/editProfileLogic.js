/* if (body?.errMsg === 'not-logged-in') {
    //dispatch reRouteRequest
    //the component should listen to isLoggingIn
}

//this should be the last else if
else if (loginComplete && !isLoggingIn) {
    getHomePage(state, updateState);
} */


exports.editProfile = (event, state, updateState, dispatch,
    reRouteRequest, remoteRequest, openSnackbar) => {
    console.log('editProfile');
    //const email = state.email;
    const firstName = state.data.firstName;
    const lastName = state.data.lastName;
    const phone = state.data.phone;
    const isSeller = state.data.isSeller;
    const gender = state.data.gender;

    const showSnackBar = (message, severity) => {
        dispatch(openSnackbar({ message: message, severity: severity }))
    }


    event.preventDefault();
    const body = JSON.stringify({
        firstName: firstName, lastName: lastName,
        phone: phone, isSeller: isSeller, gender: gender
    });

    const payload = {
        method: 'post', credentials: 'include', body: body, headers: {
            'Content-Type': 'application/json'
        }
    };

    const callback = (body) => {
        if (body?.result) {
            // navigate('/edit-profile', { state: { ...body.result } })
            showSnackBar('Changes saved', 'success');
        }
        else if (body?.error === 'not-logged-in') {
            dispatch(reRouteRequest({
                nextRoute: '/edit-profile',
                returnPath: '/edit-profile',
                returnBody: {},
                returnMethod: 'post',
                loginType: 'samePage',
                nextRouteState: {},
            }));
        }
        else {
            showSnackBar('Invalid', 'error');
        }
    }
    remoteRequest('update-profile', payload, showSnackBar, callback);
} 
