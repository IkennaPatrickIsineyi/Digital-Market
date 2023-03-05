

exports.signIn = (event, state, updateState) => {
    const email = state.email;
    const password = state.password;

    const showSnackBar = (message, severity) => {
        updateState({
            snackbar: {
                ...state.snackbar, open: true,
                message: message, severity: severity
            }
        })
    }

    event.preventDefault();
    if (email && password) {
        const body = JSON.stringify({ email: email, password: password });

        const payload = {
            method: 'post', credentials: 'include', body: body, headers: {
                'Content-Type': 'application/json'
            }
        };

        const callback = (body) => {
            if (body?.result) {
                showSnackBar('Login success', 'success');
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

exports.gotoSignUpPage = (event, state) => {
    event.preventDefault();
    state.navigate('/register');
};

exports.gotoResetPasswordPage = (event, state) => {
    event.preventDefault();
    state.navigate('/reset-password');
};