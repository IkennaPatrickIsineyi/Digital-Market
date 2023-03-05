
const checkLoginStatus = (state, updateState) => {
    updateState({ checking: true });

    const showSnackBar = (message, severity) => {
        updateState({
            snackbar: {
                ...state.snackbar, open: true,
                message: message, severity: severity
            }
        })
    }

    const payload = { method: "get", credentials: 'include' };
    const callback = (body) => {
        updateState({ frontPageData: body.result.frontPage, userData: body.result.userData });
    }

    state.remoteRequest('', payload, showSnackBar, callback);
};

export { checkLoginStatus };