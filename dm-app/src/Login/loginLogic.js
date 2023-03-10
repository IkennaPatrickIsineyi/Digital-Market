
exports.signIn = (event, state, updateState, dispatch,
    loadUserData, loginComplete) => {

    console.log(state);
    event.preventDefault();

    if (state.returnData.nextRoute === '/testComp') {
        console.log(state.returnData.nextRouteState);

        const reqResult = {}
        state.navigate(state.returnData.nextRoute, {
            state: {
                ...state.returnData.nextRouteState,
                ...reqResult
            }
        });
        dispatch(loginComplete());
    }
    else {
        console.log('state.returnData.nextRouteState', state.returnData.nextRouteState);
        const email = state.email;
        const password = state.password;

        const returnPath = state.returnData.returnPath;
        const nextRoute = state.returnData.nextRoute;
        const returnBody = state.returnData.returnBody;
        const returnMethod = state.returnData.returnMethod;

        const showSnackBar = (message, severity) => {
            updateState({
                snackbar: {
                    ...state.snackbar, open: true,
                    message: message, severity: severity
                }
            })
        }

        if (email && password) {
            const body = JSON.stringify({
                ...state.returnData,
                email: email, password: password,
                reRoute: Boolean(nextRoute.length)
            });

            const payload = {
                method: 'post', credentials: 'include', body: body, headers: {
                    'Content-Type': 'application/json'
                }
            };

            const callback = (body) => {
                console.log('body', body);
                if (body?.result) {
                    const userData = body.userData;
                    localStorage.setItem('user', JSON.stringify({
                        email: userData?.email, isAdmin: userData?.is_admin,
                        isSeller: userData?.is_seller
                    }));
                    if (state.returnData.loginType === 'direct') {
                        //That is, the user clicked login button from app bar
                        dispatch(loadUserData({
                            email: userData?.email, isAdmin: userData?.is_admin,
                            isSeller: (userData?.is_seller === 'true') ? true : false
                        }));
                        dispatch(loginComplete());
                        /* state.navigate('.', {
                            state: {
                                ...state.returnData.nextRouteState
                            }
                        }); */
                    }
                    else if (state.returnData.loginType === 'samePage') {
                        //That is, the user want to perform an action that requires login
                        //But the user will still remain on the same page after the action.
                        //We must restore the previous state of the user after logging it in
                        dispatch(loadUserData({
                            email: userData?.email, isAdmin: userData?.is_admin,
                            isSeller: (userData?.is_seller === 'true') ? true : false
                        }));
                        dispatch(loginComplete());
                        state.navigate(state.returnData.nextRoute, {
                            state: {
                                ...state.returnData.nextRouteState,
                                ...body.result
                            }
                        });
                    }
                    else if (state.returnData.loginType === 'pageSwitch') {
                        //That is, the user want to perform an action that requires login
                        //But the user will be navigated to another page after the action
                        dispatch(loadUserData({
                            email: userData?.email, isAdmin: userData?.is_admin,
                            isSeller: (userData?.is_seller === 'true') ? true : false
                        }));
                        dispatch(loginComplete());
                        state.navigate(state.returnData.nextRoute, { state: { ...body.result } });
                    }
                    //showSnackBar('Login success', 'success', body.result);

                    console.log('Login success', 'success', body.result);

                    /*  dispatch(loadFrontPageData(body.result.frontPage));
                     dispatch(loadUserData(body.result.userData)); */
                    /*    if (nextRoute.length) {
                           state.navigate(nextRoute, { state: { ...body.result, reRouted: true } });
                       }
                       else { */

                    //state.navigate('-1', { replace: true });
                    //  }
                }
                else if (body?.error === 'failed') {
                    showSnackBar('Wrong email and password', 'error');
                }
                else if (body?.error === 'already-logged-in') {
                    showSnackBar('Already logged in', 'info');
                }
            }

            state.remoteRequest('login', payload, showSnackBar, callback);
        }
        else {
            showSnackBar('email and password are required', 'error');
        }
    };

}

exports.gotoSignUpPage = (event, state) => {
    event.preventDefault();
    state.navigate('/register');
};

exports.gotoResetPasswordPage = (event, state) => {
    event.preventDefault();
    state.navigate('/reset-password');
};