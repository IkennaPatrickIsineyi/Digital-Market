
exports.resetPassword = (event, state, updateState) => {
    console.log('reset password');
    const email = state.email;
    event.preventDefault();
    if (email) {
        const payload = { method: 'get', credentials: 'include' };

        const callback = (body) => {
            if (body?.result === 'otp-sent') {
                console.log('success');
                state.navigate('/new-password', { replace: true })
            }
            else {
                console.log('invalid');
            }
        }

        state.remoteRequest('reset-password/?email=' + email, payload, callback);
    }
    else {
        console.log('email cannot be empty')
    }
} 