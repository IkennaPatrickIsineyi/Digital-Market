
exports.verifyOtp = (event, state, updateState) => {
    console.log('reset password');
    const otp = state.otp;
    const password1 = state.password1;
    const password2 = state.password2;

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
                console.log('invalid otp');
            }
            else {
                console.log('try again later');
            }
        }

        state.remoteRequest('reset-password', payload, callback);
    }
    else {
        console.log('otp or password cannot be empty')
    }
} 