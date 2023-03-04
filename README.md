##Simple web application for selling stuff online (e-commerce)

Just a way to keep myself busy and sharp during downtimes... Still work in progress.

Front end is built with Reactjs.

Backend is built with Nodejs, expressjs.

Database is built with sqLite.

Payment processor is Flutterwave.

Automated testing with Mocha, Chai, and Jest. Each test session creates a new test database and deletes the database at the end of the testing session.

To run the automated test, create a .evn file in the backend folder and type:

NODE_ENV='dev'

FLUTTERWAVE_PUBLIC_KEY=''

FLUTTERWAVE_SECRET_KEY= ''

In the above, set FLUTTERWAVE_PUBLIC_KEY to your flutterwave public key and set FLUTTERWAVE_SECRET_KEY to your flutterwave secret key.

From the root folder type 'npm test' to run all the automated test. The payment tests will fail if you do not add the flutterwave public key and secret key to the environment as shown above.

In case you want to launch the server and your OS happens to be Windows, simply double click the launchServer BAT file located in the backend folder.

Feel free to copy, contribute, and whatever.