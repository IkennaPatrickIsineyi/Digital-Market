
exports.sendOtp = (event, state, updateState, dispatch, reRouteRequest, remoteRequest) => {
    console.log('reset password');
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
            state.navigate('/edit-profile', state = { ...body.result })
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