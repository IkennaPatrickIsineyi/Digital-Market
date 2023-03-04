

exports.signIn = (event, state, updateState) => {
    const email = state.email;
    const password = state.password;

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
                console.log('success');
            }
            else if (body?.error === 'failed') {
                console.log('invalid data');
            }
            else if (body?.error === 'already-logged-in') {
                console.log('already logged in');
            }
        }

        state.remoteRequest('login', payload, callback);
    }
    else {
        console.log('email or password cannot be empty')
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