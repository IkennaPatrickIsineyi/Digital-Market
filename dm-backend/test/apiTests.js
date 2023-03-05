//test/apiTests.js

//set NODE_ENV to 'test' and PORT to 42011
process.env.NODE_ENV = 'test';
process.env.PORT = 42011;

//import server app
const server = require('../dm.app.js');
//import database connection
const dbConnection = require('./test.dm.db.js');

//import chai
const chai = require('chai');
//import chai-http
const chaiHttp = require('chai-http');
//load should from chai
const should = chai.should();

//install chaiHttp on chai so as to allow for http requests
chai.use(chaiHttp);
let otpCode;
//used to retain session across requests
let agent = chai.request.agent(server);

const login = [
    { email: 'sap.erro@jfld.kgf', password: 'ertfdjfd323' },
    { email: 'dssap.edrro@jrsdd.ogf', password: 'eehewd323' },//seller
    { email: 'sap.ero@jrfldds.kgf', password: 'edfsrtfdjfd323' },
    { email: 'dssap.edrrsao@jrsdd.ogf', password: 'eggrwehewd323' }
];

let testTrnxRef = "";
let testCart = {};
let testFrontPageItems = {};


//clear database
const clearDatabase = (callback) => {
    //change schema setting to allow wiping of database content
    dbConnection.get('pragma writable_schema=1', (err) => {
        if (err) return console.log('error with writable_schema');
        dbConnection.exec("delete from sqlite_master where type in ('table','trigger','index');", (err) => {
            if (err) console.log('error deleting tables...', err);
            else console.log('tables deleted...');
            dbConnection.get('pragma writable_schema=0', (err) => {
                callback();
                process.exit(1);
            });
        });
    });
}

//tests// 

describe('test container', () => {
    before((done) => {
        server.on('server_started', function () {
            done();
        })
    });

    //Registration, login and logout
    describe('Registration, login and logout', () => {
        it('creates new account', (done) => {
            const body = {
                firstName: 'Joe', lastName: 'Biden', email: login[0].email,
                password: login[0].password, gender: 'm', isSeller: false
            }
            agent.post('/api/register').send(body).end((err, res) => {
                if (err) {
                    console.log(err);
                    return done();
                }
                console.log(res.body);
                res.body.should.have.property('result');
                done();
            })
        });

        it('cannot log in already logged in user', (done) => {
            const body = {
                email: login[0].email,
                password: login[0].password
            };
            agent.post('/api/login').send(body).end((err, res) => {
                if (err) {
                    console.log(err);
                    return done();
                }
                res.body.should.have.property('error').eql('already-logged-in');
                done();
            })
        });

        it('logs out current user', (done) => {
            agent.get('/api/logout').end((err, res) => {
                if (err) {
                    console.log(err);
                }
                else {
                    res.body.should.be.a('object');
                    res.body.should.have.property('result');
                }
                done();
            })
        });

        it('cannot log in an unregistered user', (done) => {
            const body = {
                email: login[1].email,
                password: login[1].password
            };
            agent.post('/api/login').send(body).end((err, res) => {
                if (err) {
                    console.log(err);
                    done();
                }
                res.body.should.be.a('object');
                res.body.should.have.property('error').eql('failed');
                done();
            })
        });

        it('cannot log in with invalid password', (done) => {
            const body = {
                email: login[0].email,
                password: login[1].password
            };
            agent.post('/api/login').send(body).end((err, res) => {
                if (err) {
                    console.log(err);
                    done();
                }
                res.body.should.be.a('object');
                res.body.should.have.property('error').eql('failed');
                done();
            })
        });

        it('logs in user successfully', (done) => {
            const body = {
                email: login[0].email,
                password: login[0].password
            };
            agent.post('/api/login').send(body).end((err, res) => {
                res.body.should.be.a('object');
                res.body.should.have.property('result');
                done();
            })
        });

        it('cannot create new account while logged in', (done) => {
            const body = {
                firstName: 'Oak', lastName: 'Dowen', email: login[2].email,
                password: login[2].password, gender: 'f', isSeller: false
            }
            agent.post('/api/register').send(body).end((err, res) => {
                res.body.should.be.a('object');
                res.body.should.have.property('error').eql('already-logged-in');
                done();
            })
        });

        it('logs out current user', (done) => {
            agent.get('/api/logout').end((err, res) => {
                if (err) {
                    console.log(err);
                }
                else {
                    res.body.should.be.a('object');
                    res.body.should.have.property('result').eql('logged-out');
                }
                done();
            })
        });

        it('creates new seller account', (done) => {
            const body = {
                firstName: 'Sam', lastName: 'Paul', email: login[1].email,
                password: login[1].password, gender: 'm', isSeller: true
            }
            agent.post('/api/register').send(body).end((err, res) => {
                if (err) {
                    console.log(err);
                    return done();
                }
                res.body.should.have.property('result');
                done();
            })
        });

        it('logs out current user', (done) => {
            agent.get('/api/logout').end((err, res) => {
                if (err) {
                    console.log(err);
                }
                else {
                    res.body.should.be.a('object');
                    res.body.should.have.property('result').eql('logged-out');
                }
                done();
            })
        });
    });

    //Update profile
    describe('Update profile', () => {
        it('only logged in users can update profile', (done) => {
            agent.post('/api/update-profile').send({
                firstName: 'Danny', lastName: 'Manny',
                isSeller: false
            }).end((err, res) => {
                if (err) {
                    console.log(err);
                    done();
                }
                else {
                    res.body.should.be.a('object');
                    res.body.should.have.property('error').eql('not-logged-in');
                    done();
                }
            })
        });

        it('logs in user successfully', (done) => {
            const body = {
                email: login[0].email,
                password: login[0].password
            };
            agent.post('/api/login').send(body).end((err, res) => {
                if (err) {
                    console.log(err);
                    return done();
                }
                res.body.should.be.a('object');
                res.body.should.have.property('result');
                done();
            })
        });

        it('updates user profile successfully', (done) => {
            agent.post('/api/update-profile').send({
                firstName: 'Danny', lastName: 'Manny',
                isSeller: false
            }).end((err, res) => {
                if (err) {
                    console.log(err);
                    done();
                }
                else {
                    res.body.should.be.a('object');
                    res.body.should.have.property('result').eql('success');
                    done();
                }
            })
        });
    });

    //Change Password
    describe("Change Password", () => {
        it("generates otp", (done) => {
            agent.get('/api/reset-password/?email=' + login[0].email).end((err, res) => {
                if (err) {
                    console.log(err);
                    done();
                }
                else {
                    res.body.should.have.a('object');
                    res.body.should.have.property('result').eql('otp-sent');
                    otpCode = res.body.testOtp;
                    done();
                }
            })
        });

        it("confirms otp and changes password", (done) => {
            const body = { password: 'A2222444', otp: otpCode };
            agent.post('/api/reset-password').send(body).end((err, res) => {
                if (err) {
                    console.log(err);
                    done();
                }
                else {
                    res.body.should.have.a('object');
                    res.body.should.have.property('result').eql('success');
                    done();
                }
            })
        })

        it("Automatically Log out user after changing password", (done) => {
            agent.get('/api/logout').end((err, res) => {
                if (err) {
                    console.log(err);
                }
                else {
                    res.body.should.be.a('object');
                    res.body.should.have.property('error').eql('not-logged-in');
                }
                done();
            })
        });

        it("should also generate otp for logged out users without verifying email", (done) => {
            //reason: verifying email at this step would make it easy for attackers to make a list of emails
            //that are registered in the system. Verification should be after confirming OTP
            agent.get('/api/reset-password/?email=' + login[3].email).end((err, res) => {
                if (err) {
                    console.log(err);
                    done();
                }
                else {
                    res.body.should.have.a('object');
                    res.body.should.have.property('result').eql('otp-sent');
                    otpCode = res.body.testOtp;
                    done();
                }
            })
        });

        it("should NOT change password if email is not registered", (done) => {
            const body = { password: 'A244435', otp: otpCode };
            agent.post('/api/reset-password').send(body).end((err, res) => {
                if (err) {
                    console.log(err);
                    done();
                }
                else {
                    res.body.should.have.a('object');
                    res.body.should.have.property('error').eql('failed');
                    done();
                }
            })
        });

        it('fail to log in user with previous password', (done) => {
            const body = { email: login[0].email, password: 'A234e678' };
            agent.post('/api/login').send(body).end((err, res) => {
                if (err) {
                    console.log(err);
                    done();
                }
                res.body.should.be.a('object');
                res.body.should.have.property('error').eql('failed');
                done();
            })
        });

        it('successfully  log in user with new password', (done) => {
            const body = { email: login[0].email, password: 'A2222444' };
            agent.post('/api/login').send(body).end((err, res) => {
                if (err) {
                    console.log(err);
                    return done();
                }
                res.body.should.be.a('object');
                res.body.should.have.property('result');
                done();
            })
        });
    });

    //Add product category
    describe("Add Product Category", () => {
        it("Log out user", (done) => {
            agent.get('/api/logout').end((err, res) => {
                if (err) {
                    console.log(err);
                }
                else {
                    res.body.should.be.a('object');
                    res.body.should.have.property('result').eql('logged-out');
                }
                done();
            });
        });

        it("allows ONLY logged in user to add product category", (done) => {
            const body = { category: 'laptops', description: 'section for all kinds of laptops' };
            agent.post('/api/add-category').send(body).end((err, res) => {
                if (err) {
                    console.log(err);
                    return done();
                }
                res.body.should.have.property('error').eql('not-logged-in');
                done();
            });
        });

        it("log in user who is not an admin", (done) => {
            const body = { email: login[0].email, password: 'A2222444' };
            agent.post('/api/login').send(body).end((err, res) => {
                if (err) {
                    console.log(err);
                    return done();
                }
                res.body.should.have.property('result');
                done();
            })

        });

        it("allows ONLY an admin to add product category", (done) => {
            const body = { category: 'laptops', description: 'section for all kinds of laptops' };
            agent.post('/api/add-category').send(body).end((err, res) => {
                if (err) {
                    console.log(err);
                    return done();
                }
                res.body.should.have.property('error').eql('admin-only');
                done();
            });
        });

        it("log out user", (done) => {
            agent.get('/api/logout').end((err, res) => {
                if (err) {
                    console.log(err);
                }
                else {
                    res.body.should.have.property('result').eql('logged-out');
                }
                done();
            });
        });

        it("log in user who is an admin", (done) => {
            const body = { email: 'admin', password: 'admin' };
            agent.post('/api/login').send(body).end((err, res) => {
                if (err) {
                    console.log(err);
                    return done();
                }

                res.body.should.have.property('result');
                done();
            });
        });

        it("Add unique product category", (done) => {
            const body = { category: 'laptops', description: 'section for all kinds of laptops' };
            agent.post('/api/add-category').send(body).end((err, res) => {
                if (err) {
                    console.log(err);
                    return done();
                }
                res.body.should.have.property('result').eql('success');
                done();
            });
        });

        it("Cannot add already existing category", (done) => {
            const body = { category: 'laptops', description: 'section for all kinds of laptops' };
            agent.post('/api/add-category').send(body).end((err, res) => {
                if (err) {
                    console.log(err);
                    return done();
                }
                res.body.should.have.property('error').eql('failed');
                res.body.should.have.property('errMsg').eql('duplicate');
                done();
            });
        });

        it("Add unique product category", (done) => {
            const body = { category: 'phones', description: 'section for all kinds of phones' };
            agent.post('/api/add-category').send(body).end((err, res) => {
                if (err) {
                    console.log(err);
                    return done();
                }
                res.body.should.have.property('result').eql('success');
                done();
            });
        });

        it("Add another unique product category", (done) => {
            const body = { category: 'charger', description: 'section for all kinds of charger' };
            agent.post('/api/add-category').send(body).end((err, res) => {
                if (err) {
                    console.log(err);
                    return done();
                }
                res.body.should.have.property('result').eql('success');
                done();
            });
        });


    });

    //Add product
    describe("Add Product", () => {
        it("Log out user", (done) => {
            agent.get('/api/logout').end((err, res) => {
                if (err) {
                    console.log(err);
                }
                else {
                    res.body.should.be.a('object');
                    res.body.should.have.property('result').eql('logged-out');
                }
                done();
            });
        });

        it("allows ONLY logged in user to add product", (done) => {
            const body = { product: 'hp', category: 'laptops' };
            agent.post('/api/add-product').send(body).end((err, res) => {
                if (err) {
                    console.log(err);
                    return done();
                }
                res.body.should.have.property('error').eql('not-logged-in');
                done();
            });
        });

        it("log in user who is not an admin", (done) => {
            const body = { email: login[0].email, password: 'A2222444' };
            agent.post('/api/login').send(body).end((err, res) => {
                if (err) {
                    console.log(err);
                    return done();
                }
                res.body.should.have.property('result');
                done();
            })

        });

        it("allows ONLY an admin to add product", (done) => {
            const body = { product: 'hp', category: 'laptops' };
            agent.post('/api/add-product').send(body).end((err, res) => {
                if (err) {
                    console.log(err);
                    return done();
                }
                res.body.should.have.property('error').eql('admin-only');
                done();
            });
        });

        it("log out user", (done) => {
            agent.get('/api/logout').end((err, res) => {
                if (err) {
                    console.log(err);
                }
                else {
                    res.body.should.have.property('result').eql('logged-out');
                }
                done();
            });
        });

        it("log in user who is an admin", (done) => {
            const body = { email: 'admin', password: 'admin' };
            agent.post('/api/login').send(body).end((err, res) => {
                if (err) {
                    console.log(err);
                    return done();
                }

                res.body.should.have.property('result');
                done();
            });
        });

        it("Add unique product", (done) => {
            const body = { product: 'hp', category: 'laptops' };
            agent.post('/api/add-product').send(body).end((err, res) => {
                if (err) {
                    console.log(err);
                    return done();
                }
                res.body.should.have.property('result').eql('success');
                done();
            });
        });

        it("Cannot add already existing product under same category", (done) => {
            const body = { product: 'hp', category: 'laptops' };
            agent.post('/api/add-product').send(body).end((err, res) => {
                if (err) {
                    console.log(err);
                    return done();
                }
                res.body.should.have.property('error').eql('failed');
                res.body.should.have.property('errMsg').eql('bad-db-input');
                done();
            });
        });

        it("Cannot add product to non-existent category", (done) => {
            const body = { product: 'hp', category: 'computer' };
            agent.post('/api/add-product').send(body).end((err, res) => {
                if (err) {
                    console.log(err);
                    return done();
                }
                res.body.should.have.property('error').eql('failed');
                res.body.should.have.property('errMsg').eql('bad-db-input');
                done();
            });
        });

        it("Add unique product", (done) => {
            const body = { product: 'dell', category: 'laptops' };
            agent.post('/api/add-product').send(body).end((err, res) => {
                if (err) {
                    console.log(err);
                    return done();
                }
                res.body.should.have.property('result').eql('success');
                done();
            });
        });

        it("Add an existing product to a different category", (done) => {
            const body = { product: 'dell', category: 'phones' };
            agent.post('/api/add-product').send(body).end((err, res) => {
                if (err) {
                    console.log(err);
                    return done();
                }
                res.body.should.have.property('result').eql('success');
                done();
            });
        });

        it("Add a product with same name as the category", (done) => {
            const body = { product: 'phones', category: 'phones' };
            agent.post('/api/add-product').send(body).end((err, res) => {
                if (err) {
                    console.log(err);
                    return done();
                }
                res.body.should.have.property('result').eql('success');
                done();
            });
        });

        it("Add a product that has the same name as an category to a different category", (done) => {
            const body = { product: 'charger', category: 'phones' };
            agent.post('/api/add-product').send(body).end((err, res) => {
                if (err) {
                    console.log(err);
                    return done();
                }
                res.body.should.have.property('result').eql('success');
                done();
            });
        });

        it("A product named prodA exists in a category named prodB. " +
            "Then add a new product named prodB to a category named prodA",
            (done) => {
                const body = { product: 'phones', category: 'charger' };
                agent.post('/api/add-product').send(body).end((err, res) => {
                    if (err) {
                        console.log(err);
                        return done();
                    }
                    res.body.should.have.property('result').eql('success');
                    done();
                });
            }
        );
    });

    //Add new Inventory
    describe("Add New Inventory", () => {
        it("Log out user", (done) => {
            agent.get('/api/logout').end((err, res) => {
                if (err) {
                    console.log(err);
                }
                else {
                    res.body.should.be.a('object');
                    res.body.should.have.property('result').eql('logged-out');
                }
                done();
            });
        });

        it("Must log in to add new inventory", (done) => {
            const body = {
                productId: 1, title: 'HP Elitebook Pro', description: 'yellow version',
                qty: 10, price: 12000, imageList: ['ad1.jpg', 'ad2.png', 'ad3.jpg', 'ad4.png']
            };
            agent.post('/api/add-new-inventory').send(body).end((err, res) => {
                if (err) {
                    console.log(err);
                    return done();
                }
                res.body.should.have.property('error').eql('not-logged-in');
                done();
            });
        });

        it("log in user who is not a seller", (done) => {
            const body = { email: login[0].email, password: 'A2222444' };
            agent.post('/api/login').send(body).end((err, res) => {
                if (err) {
                    console.log(err);
                    return done();
                }
                res.body.should.have.property('result');
                done();
            })
        });

        it("Must be a seller to add new inventory", (done) => {
            const body = {
                productId: 1, title: 'HP Elitebook Pro', description: 'yellow version',
                qty: 10, price: 12000, imageList: ['ad1.jpg', 'ad2.png', 'ad3.jpg', 'ad4.png']
            };
            agent.post('/api/add-new-inventory').send(body).end((err, res) => {
                if (err) {
                    console.log(err);
                    return done();
                }
                res.body.should.have.property('error').eql('seller-only');
                done();
            });
        });

        it("Log out user", (done) => {
            agent.get('/api/logout').end((err, res) => {
                if (err) {
                    console.log(err);
                }
                else {
                    res.body.should.be.a('object');
                    res.body.should.have.property('result').eql('logged-out');
                }
                done();
            });
        });

        it("log in user who is a seller", (done) => {
            const body = {
                email: login[1].email,
                password: login[1].password
            };
            agent.post('/api/login').send(body).end((err, res) => {
                if (err) {
                    console.log(err);
                    return done();
                }
                res.body.should.have.property('result');
                done();
            });
        });

        it("New inventory must be a valid product", (done) => {
            const body = {
                productId: 9, title: 'HP Elitebook Pro', description: 'yellow version',
                qty: 10, price: 12000, imageList: ['ad1.jpg', 'ad2.png', 'ad3.jpg', 'ad4.png']
            };
            agent.post('/api/add-new-inventory').send(body).end((err, res) => {
                if (err) {
                    console.log(err);
                    return done();
                }
                res.body.should.have.property('error').eql('failed');
                res.body.should.have.property('errMsg').eql('bad-db-input');
                done();
            });
        });

        it("Add new inventory successfully", (done) => {
            const body = {
                productId: 1, title: 'HP Elitebook Pro', description: 'yellow version',
                qty: 10, price: 12000, imageList: ['ac1.jpg', 'ac2.png', 'ac3.jpg', 'ac4.png']
            };
            agent.post('/api/add-new-inventory').send(body).end((err, res) => {
                if (err) {
                    console.log(err);
                    return done();
                }
                res.body.should.have.property('result').eql('success');
                done();
            });
        });

        it("Add another new inventory successfully", (done) => {
            const body = {
                productId: 1, title: 'HP Folio', description: 'white version',
                qty: 15, price: 19000, imageList: ['ad1.jpg', 'ad2.png', 'ad3.jpg', 'ad4.png']
            };
            agent.post('/api/add-new-inventory').send(body).end((err, res) => {
                if (err) {
                    console.log(err);
                    return done();
                }
                res.body.should.have.property('result').eql('success');
                done();
            });
        });

        it("Add another new inventory successfully", (done) => {
            const body = {
                productId: 1, title: 'Dell Latitude', description: 'pink version',
                qty: 23, price: 16000, imageList: ['af1.jpg', 'af2.png', 'af3.jpg', 'af4.png']
            };
            agent.post('/api/add-new-inventory').send(body).end((err, res) => {
                if (err) {
                    console.log(err);
                    return done();
                }
                res.body.should.have.property('result').eql('success');
                done();
            });
        });
    });

    //Get Front page Content for normal user and admin respectively
    describe("Get Front Page Content", () => {
        it("Log out user", (done) => {
            agent.get('/api/logout').end((err, res) => {
                if (err) {
                    console.log(err);
                }
                else {
                    res.body.should.be.a('object');
                    res.body.should.have.property('result').eql('logged-out');
                }
                done();
            });
        });

        it("Allow logged out users to get front page items", (done) => {
            agent.get('/api/').end((err, res) => {
                if (err) {
                    console.log(err);
                    return done();
                }
                res.body.should.have.property('result');
                done();
            });
        });

        it("Log in as admin", (done) => {
            const body = { email: 'admin', password: 'admin' };
            agent.post('/api/login').send(body).end((err, res) => {
                if (err) {
                    console.log(err);
                    return done();
                }
                res.body.should.have.property('result');
                done();
            })
        });

        it("Admin should get a different kind of front page", (done) => {
            agent.get('/api/').end((err, res) => {
                if (err) {
                    console.log(err);
                    return done();
                }
                res.body.should.have.property('result').eql('not-built');
                done();
            });
        });
    });

    //click front page item
    describe("Front Page Item Clicked", () => {
        it("Log out user", (done) => {
            agent.get('/api/logout').end((err, res) => {
                if (err) {
                    console.log(err);
                }
                else {
                    res.body.should.be.a('object');
                    res.body.should.have.property('result').eql('logged-out');
                }
                done();
            });
        });

        it("There is no recently viewed item on front page", (done) => {
            agent.get('/api/').end((err, res) => {
                if (err) {
                    console.log(err);
                    return done();
                }
                res.body.result.frontPage.recentlyViewed.should.have.lengthOf(0);
                done();
            });
        });

        it("Register first click even if user is logged out", (done) => {
            agent.get("/api/item-details/?inventoryId=1").end((err, res) => {
                if (err) {
                    console.log(err);
                    return done();
                }
                res.body.should.have.property('result');
                res.body.should.have.property('firstView').eql(true);
                done();
            });
        });

        it("Add clicked item to the user's recently viewed list on front page", (done) => {
            agent.get('/api/').end((err, res) => {
                if (err) {
                    console.log(err);
                    return done();
                }
                res.body.should.have.property('result');
                res.body.result.frontPage.recentlyViewed.length.should.be.above(0);
                done();
            });
        });

        it("Do not register subsequent clicks on an item in the same day", (done) => {
            agent.get("/api/item-details/?inventoryId=1").end((err, res) => {
                if (err) {
                    console.log(err);
                    return done();
                }
                res.body.should.have.property('result');
                res.body.should.have.property('firstView').eql(false);
                done();
            });
        });

    });

    //Add to cart
    describe("Add items to shopping cart", () => {
        it("Log out user", (done) => {
            agent.get('/api/logout').end((err, res) => {
                if (err) {
                    console.log(err);
                }
                else {
                    res.body.should.have.property('error').eql('not-logged-in');
                }
                done();
            });
        });

        it("Cannot add item to cart without logging in", (done) => {
            const body = {
                inventoryId: 0, qty: 4, unitPrice: 20000,
                totalPrice: 80000, seller: login[1].email
            };
            agent.post('/api/add-to-cart').send(body).end((err, res) => {
                if (err) {
                    console.log(err);
                    return done();
                }
                res.body.should.have.property('error').eql('not-logged-in');
                done();
            })
        });

        it("Log in user", (done) => {
            const body = { email: login[0].email, password: 'A2222444' };
            agent.post('/api/login').send(body).end((err, res) => {
                if (err) {
                    console.log(err);
                    return done();
                }
                res.body.should.have.property('result');
                done();
            })
        });

        it("Can add item to cart while logged in", (done) => {
            const body = {
                inventoryId: 1, qty: 4, unitPrice: 20000,
                totalPrice: 80000, seller: login[1].email
            };
            agent.post('/api/add-to-cart').send(body).end((err, res) => {
                if (err) {
                    console.log(err);
                    return done();
                }
                res.body.should.have.property('result').eql('success');
                done();
            })
        });

        it("Can add another item to cart while logged in", (done) => {
            const body = {
                inventoryId: 2, qty: 2, unitPrice: 20000,
                totalPrice: 80000, seller: login[1].email
            };
            agent.post('/api/add-to-cart').send(body).end((err, res) => {
                if (err) {
                    console.log(err);
                    return done();
                }
                res.body.should.have.property('result').eql('success');
                done();
            })
        });

        it("Can add another item to cart while logged in", (done) => {
            const body = {
                inventoryId: 3, qty: 5, unitPrice: 20000,
                totalPrice: 80000, seller: login[1].email
            };
            agent.post('/api/add-to-cart').send(body).end((err, res) => {
                if (err) {
                    console.log(err);
                    return done();
                }
                res.body.should.have.property('result').eql('success');
                done();
            })
        });
    });

    //Get shopping cart: all pending transactions
    describe("Get Shopping Cart: all pending transactions", () => {
        it("Log out user", (done) => {
            agent.get('/api/logout').end((err, res) => {
                if (err) {
                    console.log(err);
                }
                else {
                    res.body.should.be.a('object');
                    res.body.should.have.property('result').eql('logged-out');
                }
                done();
            });
        });

        it("Cannot get shopping cart without logging in", (done) => {
            agent.get('/api/get-cart').end((err, res) => {
                if (err) {
                    console.log(err);
                    return done();
                }
                res.body.should.have.property('error').eql('not-logged-in');
                done();
            });
        });

        it("Log in user", (done) => {
            const body = { email: login[0].email, password: 'A2222444' };
            agent.post('/api/login').send(body).end((err, res) => {
                if (err) {
                    console.log(err);
                    return done();
                }
                res.body.should.have.property('result');
                done();
            })
        });

        it("Get shopping cart of current user", (done) => {
            agent.get('/api/get-cart').end((err, res) => {
                if (err) {
                    console.log(err);
                    return done();
                }
                res.body.should.have.property('result');
                res.body?.result.map((item) => testCart[item.trnxId] = item.inventory_id);
                done()
            });
        });
    });

    //checkout using Flutterwave
    describe("Checkout Using Flutterwave payment processor", () => {
        it("Log out user", (done) => {
            agent.get('/api/logout').end((err, res) => {
                if (err) {
                    console.log(err);
                }
                else {
                    res.body.should.be.a('object');
                    res.body.should.have.property('result').eql('logged-out');
                }
                done();
            });
        });

        it("Cannot allow user that is not logged in", (done) => {
            const body = { inventoryIdArr: [1, 2, 3], trnxIdArr: [1, 2, 3] };
            agent.post('/api/checkout').send(body).end((err, res) => {
                if (err) {
                    console.log(err);
                    return done();
                }
                res.body.should.have.property('error').eql('not-logged-in');
                done();
            });
        });

        it("Log in user", (done) => {
            const body = { email: login[0].email, password: 'A2222444' };
            agent.post('/api/login').send(body).end((err, res) => {
                if (err) {
                    console.log(err);
                    return done();
                }
                res.body.should.have.property('result');
                done();
            })
        });

        it("Fetch url for payment from Flutterwave", (done) => {
            const body = { inventoryIdArr: [1, 2, 3], trnxIdArr: [1, 2, 3] };
            agent.post('/api/checkout').send(body).end((err, res) => {
                if (err) {
                    console.log(err);
                    return done();
                }
                if (res.body) {
                    console.log(res.body);
                    testTrnxRef = res.body.result.trnxRef;
                    //this if statement skips execution of these lines
                    //it returns to execute them when the async API call has returned a value
                    res.body.should.have.property('result');
                    res.body.result.data.should.have.property('link');
                    done();
                }
            })
        });
    });

    //Verify payment
    describe("Verify payment", () => {
        it("Should reject payment if tx_ref from redirect and from transaction_id do not match", (done) => {
            agent.get(
                '/api/verify-payment/?status=successful&transaction_id=4175823&tx_ref=' + testTrnxRef)
                .end((err, res) => {
                    if (err) {
                        console.log(err);
                        return done();
                    }
                    if (res.body) {
                        console.log(res.body);
                        res.body.should.have.property('error').eql('failed');
                        done();
                    }

                });
        });

        it("Successfully verify payment with matching tx_ref and trnx_ref", (done) => {
            agent.get(
                '/api/verify-payment/?status=successful&transaction_id=4178268&tx_ref=' + testTrnxRef)
                .end((err, res) => {
                    if (err) {
                        console.log(err);
                        return done();
                    }
                    if (res.body) {
                        console.log(res.body);
                        res.body.should.have.property('result').eql('successful');
                        done();
                    }

                });
        });
    });


    after((done) => {
        console.log('All tests Completed...');
        //delete all tables and triggers in the test database after this testing session
        clearDatabase(done);
    });
});
