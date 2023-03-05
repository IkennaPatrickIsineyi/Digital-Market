
exports.sendOtp = (event, state, updateState) => {
    console.log('reset password');
    const email = state.email;

    const showSnackBar = (message, severity) => {
        updateState({
            snackbar: {
                ...state.snackbar, open: true,
                message: message, severity: severity
            }
        })
    }

    event.preventDefault();
    if (email) {
        const payload = { method: 'get', credentials: 'include' };

        const callback = (body) => {
            if (body?.result === 'otp-sent') {
                state.navigate('/new-password', { replace: true })
            }
            else {
                showSnackBar('Invalid', 'error');
            }
        }

        state.remoteRequest('reset-password/?email=' + email, payload, showSnackBar, callback);
    }
    else {
        showSnackBar('email is required', 'error');
    }
} 