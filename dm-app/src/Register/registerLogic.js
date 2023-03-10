exports.signUp = (event, state, updateState, dispatch,
    loadUserData, loginComplete) => {
    console.log('sign up');
    const email = state.email;
    const password1 = state.password1;
    const password2 = state.password2;
    const firstName = state.firstName;
    const lastName = state.lastName;
    const gender = state.gender;
    const isSeller = state.isSeller;
    const nextRoute = state.returnData.nextRoute;

    const showSnackBar = (message, severity) => {
        updateState({
            snackbar: {
                ...state.snackbar, open: true,
                message: message, severity: severity
            }
        })
    }

    event.preventDefault();
    if (email && password1 && password2 && firstName && lastName
        && gender && isSeller && (password1 === password2)) {
        const body = JSON.stringify({
            ...state.returnData, reRoute: Boolean(nextRoute.length),
            email: email, password: password1, gender: gender,
            isSeller: (isSeller === 'true') ? true : false,
            firstName: firstName, lastName: lastName
        });

        const payload = {
            method: 'post', credentials: 'include', body: body, headers: {
                'Content-Type': 'application/json'
            }
        };

        const callback = (body) => {
            if (body?.result) {
                /*  console.log('success');
                 dispatch(loadFrontPageData(body.result.frontPage));
                 dispatch(loadUserData(body.userData));
                 state.navigate('/'); */

                const userData = body.userData;
                dispatch(loadUserData({
                    email: userData?.email, isAdmin: userData?.is_admin,
                    isSeller: userData?.is_seller
                }));
                dispatch(loginComplete());
            }
            else if (body?.error === 'already-logged-in') {
                console.log('already logged in');
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

        state.remoteRequest('register', payload, showSnackBar, callback);
    }
    else {
        console.log('email,password,gender,lastname,firstname,isseller cannot be empty')
    }
}