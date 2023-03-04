
exports.verifyOtp = (event, state, updateState) => {
    console.log('reset password');
    const otp = state.otp;
    event.preventDefault();
    if (otp) {
        const body = JSON.stringify({ otpCode: otp })
        const payload = { method: 'post', credentials: 'include', body: body };

        const callback = (body) => {
            if (body?.result === 'otp-sent') {
                console.log('success');
                state.navigate('/new-password', { replace: true })
            }
            else {
                console.log('invalid');
            }
        }

        state.remoteRequest('reset-password', payload, callback);
    }
    else {
        console.log('otp cannot be empty')
    }
} 