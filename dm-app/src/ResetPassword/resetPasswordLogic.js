
exports.verifyOtp = (event, state, updateState) => {
    console.log('reset password');
    const otp = state.otp;
    const password1 = state.password1;
    const password2 = state.password2;

    const showSnackBar = (message, severity) => {
        updateState({
            snackbar: {
                ...state.snackbar, open: true,
                message: message, severity: severity
            }
        })
    }

    event.preventDefault();
    if (otp && password1 && password2 && (password1 === password2)) {
        const body = JSON.stringify({ otp: otp, password: password1 })
        const payload = {
            method: 'post', credentials: 'include', body: body, headers: {
                'Content-Type': 'application/json'
            }
        };

        const callback = (body) => {
            if (body?.result === 'success') {
                console.log('success');
                state.navigate('/login', { replace: true })
            }
            else if (body?.error === 'invalid-otp') {
                showSnackBar('Invalid OTP', 'error');
            }
            else {
                showSnackBar('Something went wrong... Try again later', 'error');
            }
        }

        state.remoteRequest('reset-password', payload, showSnackBar, callback);
    }
    else {
        showSnackBar('OTP and password are required', 'error');
    }
} 