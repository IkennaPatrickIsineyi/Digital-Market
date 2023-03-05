const rootUrl = 'http://localhost:3422/api/';

exports.remoteRequest = (url: String, payload: Object, showSnackBar, callback: Function) => {
    console.log('request loading', payload);
    fetch(rootUrl + url, payload).then(
        (response) => {
            response.json().then((body) => {

                console.log(body);
                if (response.status !== 200) {
                    showSnackBar('Something went wrong...Try again later', 'error');
                }
                else callback(body);
            });
        },
        (error) => {
            showSnackBar('Check your Internet connection', 'error');
        }
    );
}
