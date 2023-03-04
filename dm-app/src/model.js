const rootUrl = 'http://localhost:3422/api/';

exports.remoteRequest = (url: '', payload: {}, callback: () => {}) => {
    console.log('request loading', payload);
    fetch(rootUrl + url, payload).then(
        (response) => {
            response.json().then((body) => {

                console.log(body);
                if (response.status !== 200) {
                    console.log('bad request')
                }
                else callback(body);
            });
        },
        (error) => {
            console.log('network error');
        }
    );
}
