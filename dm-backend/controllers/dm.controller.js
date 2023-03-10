//dm.controller.js 
//import model
const db = require('../models/dm.model.js');
//import bcrypt for password encryption and comparison 
const bcrypt = require('bcrypt');
const otpGen = require('otp-generator');

const got = require('got');

const Flutterwave = require('flutterwave-node-v3');

//send 500 status code
exports.send500Status = (req, res) => {
	res.status(500).send("unknown error occurred...");
};

//send 404 status code
exports.send404Status = (req, res) => {
	res.status(404).send("not found...");
};

//send 401 status code
exports.send401Status = (req, res) => {
	res.status(401).send("Please log in again...");
};


//create tables, triggers and admin
exports.setupDatabase = (callback) => {
	const tables = [db.createUsertb, db.createLogintb, db.createCategorytb,
	db.createProducttb, db.createInventorytb, db.createTrnxtb, db.createInteractiontb,
	db.createImagetb, db.createReviewtb, db.createDecrQtyTrigger, db.createIncrPopularity,
	db.createAdmin];

	let count = 0;

	const builder = (nextCount) => {
		tables[count](function (err) {
			count++;
			if (err) {
				console.log("error executing query ", count, err);
			}
			else {
				console.log("Setup query ", count, " executed", this);
			}
			if (count < tables.length) return builder(nextCount);
			else return callback();
		});
	};

	builder(count);

	/* (tables[count])(tableCallback); */
};


//check if user is logged in: user required to log in first else request fails
exports.isLoggedIn = (req, res, next) => {
	//console.log('isLoggedIn called with user = ', req.session.user);
	if (req.session.user) return next();
	else return res.send({ userData: req?.userData ?? {}, error: 'not-logged-in' });
};

//check if user is not logged in: user required to log out first else request fails
exports.isNotLoggedIn = (req, res, next) => {
	//console.log('isNotLoggedIn called with user = ', req.session.user);
	if (!req.session.user) return next();
	else return res.send({ userData: req?.userData ?? {}, error: 'already-logged-in' });
};

//check if user is an admin: user is required to be an admin else request fails
exports.isAdmin = (req, res, next) => {
	if (req.session.isAdmin) return next();
	return res.send({ userData: req?.userData ?? {}, error: 'admin-only' });
};

//check if user is not an admin 
exports.isNotAdmin = (req, res, next) => {
	if (!req.session.isAdmin) return next();
	return this.getAdminFrontPage(req, res);
};

//check if user is a seller: user is required to be a seller else request fails
exports.isSeller = (req, res, next) => {
	if (req.session.isSeller) return next();
	return res.send({ userData: req?.userData ?? {}, error: 'seller-only' });
};

const frontPage = (req, res, isAdmin) => {
	console.log('front page');
	(isAdmin) ? this.getAdminFrontPage(req, res) : this.getFrontPageItems(req, res)
}

//validate login credentials. and log in user
exports.login = (req, res, next) => {

	const body = req.body;
	const email = body.email;
	const password = body.password;
	const sessionId = req.session.id;
	const returnPath = body.returnPath;
	const returnMethod = body.returnMethod;
	const returnBody = body.returnBody;
	const reRoute = body.reRoute;
	let userData = {};

	console.log('login');

	db.getPasswordHash(email, function (err, result) {
		console.log('getPasswordHash', result);
		if (err) {
			//error occurred
			console.log(err);
			return res.send({ userData: req?.userData ?? {}, error: 'failed', errMsg: 'retrieval' });
		}
		else if (result.length) {
			//email exists
			bcrypt.compare(password, result[0].password,
				function (err, match) {
					if (match) {
						console.log('matched');
						//regenerate session and log user in
						req.session.regenerate(function (err) {
							if (err) return res.send({ userData: req?.userData ?? {}, error: 'failed', errMsg: 'regeneration' });

							//save changes
							req.session.save(function (err) {
								console.log('saving');
								if (err) return res.send({ userData: req?.userData ?? {}, error: 'failed', errMsg: 'saving' });
								// log user in by setting user id to email 
								req.session.user = email;
								req.session.isAdmin = result[0]?.is_admin;
								req.session.isSeller = result[0]?.is_seller;

								userData = {
									email: email, is_admin: result[0]?.is_admin,
									is_seller: result[0]?.is_seller
								};



								db.updateSessionId(sessionId, req.session.id, function (err) {
									if (err) {
										console.log(err);
									}
									if (reRoute) {
										//route to the return route
										req.url = '/api' + returnPath;
										req.method = returnMethod;
										if (returnMethod !== 'get')
											req.body = returnBody;
										req.userData = { ...userData };
										req.app.handle(req, res);
									}
									else {
										console.log(userData);
										return res.send({ userData: userData ?? {}, result: {} });
									}
									//frontPage(req, res, req.session.isAdmin);
								});

								//return  res.send({ userData: req?.userData??{}, result: { frontPage: frontPageItems, userData: result[0] ?? {} } });


							});//req.session.save
						});//req.session.regenerate
					}
					else {
						//reject login request
						return res.send({ userData: req?.userData ?? {}, error: 'failed', errMsg: 'mismatch' });
					}
				});//bcrypt
		}//else if
		else {
			//email does not exist
			return res.send({ userData: req?.userData ?? {}, error: 'failed', errMsg: 'no-user' });
		}
	});//db.getPasswordHash
};//exports.validateLoginCredential

//register new user
exports.registerUser = (req, res) => {
	const sessionId = req.session.id;
	console.log('register called', sessionId);

	const body = req.body;
	const returnPath = body.returnPath;
	const returnMethod = body.returnMethod;
	const returnBody = body.returnBody;
	const reRoute = body.reRoute;
	let userData = {}
	//generate hash of password using saltrounds of 10 
	bcrypt.hash(req.body.password, 10, function (err, passwordHash) {
		if (err) return res.send({ userData: req?.userData ?? {}, error: 'failed', errMsg: 'hashErr' });
		//register user
		db.registerUser(req.body.firstName, req.body.lastName,
			req.body.email, passwordHash, req.body.gender, req.body.isSeller,
			function (err) {
				console.log('registerUser returned');
				if (err) {
					console.log(err);
					return res.send({ userData: req?.userData ?? {}, error: 'failed', errMsg: 'bad-db-input' });
				}
				if (this.changes) {
					//getFrontPageItems(req, res)
					//successful so change session id of this user 
					req.session.regenerate(function (err) {
						if (err) return res.send({ userData: req?.userData ?? {}, error: 'failed', errMsg: 'RegenerationErr' });

						//save changes to session
						req.session.save(function (err) {
							if (err) {
								console.log(err);
								return res.send({ userData: req?.userData ?? {}, error: 'failed', errMsg: 'savingErr' });
							}
							console.log('prevSess: ', sessionId, 'newSess: ', req.session.id);
							//log in user by setting user id of user to email
							req.session.user = req.body.email;
							req.session.isSeller = req.body.isSeller;
							req.session.isAdmin = false;

							userData = {
								email: req.body.email, is_admin: false,
								is_seller: req.body.isSeller
							};
							db.updateSessionId(sessionId, req.session.id, function (err) {
								if (err) {
									console.log(err);
								}
								if (reRoute) {
									//route to the return route
									req.url = '/api' + returnPath;
									console.log(req.url);
									req.method = returnMethod;
									if (returnMethod !== 'get')
										req.body = returnBody;
									req.userData = { ...userData };
									//console.log(req.url);
									req.app.handle(req, res);
								}
								else {
									return res.send({ userData: result[0] ?? {}, result: {} });
								}
								//frontPage(req, res, req.session.isAdmin);
								// res.send({ userData: req?.userData??{}, result: 'success' });
							})
						});
					});
				}
				else {
					//email clashed with existing email
					res.send({ userData: req?.userData ?? {}, error: 'failed', errMsg: 'not-created' });
				}
			});
	});
};

//log out user
exports.logout = (req, res) => {
	req.session.regenerate(function (err) {
		if (err) {
			console.log('regen error');
			return res.send({ userData: req?.userData ?? {}, error: 'saving-error', result: 'logged-out' });
		}
		else {
			req.session.save(function (err) {
				if (err) {
					console.log("saving error");
					res.send({ userData: req?.userData ?? {}, error: 'saving-error', result: 'logged-out' });
				}
				else {
					//console.log('saved');
					res.send({ userData: req?.userData ?? {}, result: 'logged-out' });
				}
			})
		}
	})
};

//update profile
exports.updateProfile = (req, res) => {
	db.updateProfile(req.body.firstName, req.body.lastName,
		req.session.user, req.body.isSeller, req.body.gender, req.body.phone,
		function (err) {
			if (err) {
				console.log(err);
				return res.send({ userData: req?.userData ?? {}, error: 'failed' });
			}
			if (this.changes) {
				res.send({ userData: req?.userData ?? {}, result: 'success' });
			}
			else {
				res.send({ userData: req?.userData ?? {}, error: 'failed', result: 'unknown-error' });
			}
		});
};

//generate and send OTP to user
exports.generateOTP = (req, res) => {
	return otpGen.generate(6, {
		digits: true,
		lowerCaseAlphabets: false,
		upperCaseAlphabets: false, specialChars: false
	});
};

//send OTP to user
exports.sendOTP = (req, res) => {
	const otp = this.generateOTP(req, res);
	req.session.otp = otp;
	req.session.email = req?.query.email || req.session?.user;
	const respObj = { 'result': 'otp-sent' };

	if (process.env.NODE_ENV === 'test') respObj.testOtp = otp; //Testing tool needs to know the OTP

	console.log(otp); //DELETE THIS WHEN EMAILING IS AVAILABLE
	/** write the code to send otp to email or phone here
	 * 
	 * 
	**/

	res.send(respObj); //MOVE THIS INTO THE EMAILING BLOCK AND CALL IT WHEN EMAIL HAS BEEN SENT
};

//change password
exports.changePassword = (req, res) => {
	const sessionId = req.session.id;
	if (req.session.otp !== req.body.otp) {
		return res.send({ userData: req?.userData ?? {}, error: 'invalid-otp' });
	}
	else bcrypt.hash(req.body.password, 10, function (err, passwordHash) {
		if (err) res.send({ userData: req?.userData ?? {}, error: 'failed', errMsg: 'hashErr' });
		db.changePassword(passwordHash, req.session.email,
			function (err) {
				if (err) return res.send({ userData: req?.userData ?? {}, error: 'failed', errMsg: 'bad-db-input' });
				if (this.changes) {
					req.session.otp = null; //delete otp code
					req.session.email = null; //delete email 
					// change session id of this user to prevent fixation
					req.session.regenerate(function (err) {
						if (err) return res.send({ userData: req?.userData ?? {}, error: 'failed', errMsg: 'RegenerationErr' });
						//save changes to session
						req.session.save(function (err) {
							if (err) return res.send({ userData: req?.userData ?? {}, error: 'failed', errMsg: 'savingErr' });
							console.log('prevSess: ', sessionId, 'newSess: ', req.session.id)
							db.updateSessionId(sessionId, req.session.id, function (err) {
								if (err) {
									console.log(err);
								}
								res.send({ userData: req?.userData ?? {}, result: 'success' });
							});
						});
					});
				}
				else {
					req.session.otp = null; //delete otp code
					req.session.email = null; //delete email 
					res.send({ userData: req?.userData ?? {}, error: 'failed', errMsg: 'unknown' });
				}
			});
	});
};

//add new product category
exports.addCategory = (req, res) => {
	db.addCategory(req.body.category, req.body?.description || null,
		function (err) {
			if (err) {
				console.log(err);
				return res.send({ userData: req?.userData ?? {}, error: 'failed', errMsg: 'duplicate' });
			}
			else if (this.changes) {
				return res.send({ userData: req?.userData ?? {}, result: 'success' });
			}
			else {
				res.send({ userData: req?.userData ?? {}, error: 'failed' });
			}
		});
};

//add new product
exports.addProduct = (req, res) => {
	db.addProduct(req.body.product, req.body.category,
		function (err) {
			if (err) {
				return res.send({
					userData: req?.userData ?? {}, error: 'failed',
					errMsg: 'bad-db-input', errNum: err.errno
				});
			}
			else if (this.changes) {
				return res.send({ userData: req?.userData ?? {}, result: { product_id: this.lastID } });
			}
			else {
				res.send({ userData: req?.userData ?? {}, error: 'failed' });
			}
		});
};

//create inventory
exports.addNewInventory = (req, res) => {
	db.addNewInventory(req.session.user, req.body.productId, req.body.title,
		req.body.description, req.body.qty, req.body.price, req.body.imageList ?? ['noImage.jpg'],
		function (err) {
			if (err) {
				res.send({ userData: req?.userData ?? {}, error: 'failed', errMsg: 'bad-db-input', errNum: err.errno });
			}
			else if (this.changes) {
				res.send({ userData: req?.userData ?? {}, result: 'success' });
			}
			else {
				res.send({ userData: req?.userData ?? {}, error: 'failed', errMsg: 'unknown' });
			}
		}
	);
}
//get transaction history of a particular user
exports.getTransactionHistory = (req, res) => {
	db.getTransactionHistory(req.session.user, function (err, result) {
		if (err) return res.send({ userData: req?.userData ?? {}, error: 'failed' });
		res.send({ userData: req?.userData ?? {}, result: result });
	});
};

//get item details when an item is clicked.
//Also attempt to record the click. If it fails to record, that means the 
//browser with the session ID has been used to click the item earlier today
exports.getItemDetails = (req, res) => {
	const inventoryId = req.query.inventoryId;
	const finalResult = { data: {}, imageList: [] };
	db.getItemDetails(inventoryId, function (err, result) {
		if (err) {
			return res.send({ userData: req?.userData ?? {}, error: 'failed', errMsg: 'bad-db-input' });
		}
		if (result.length) {
			const { image_id, ...withOutImg } = { ...result[0] };
			finalResult.data = withOutImg;

			result.map((item) => finalResult.imageList.push(item.image_id));

			db.recordInteraction(inventoryId, req.session.id, function (err) {
				if (err) {
					return res.send({ userData: req?.userData ?? {}, result: result, firstView: false });
				}
				return res.send({ userData: req?.userData ?? {}, result: result, firstView: true });
			});
		}
		else {
			return res.send({ userData: req?.userData ?? {}, error: 'invalid' });
		}

	});
};

//get the items that are trending, recently viewed by this user and recently added 
//to the market respectively. These 3 set of items will be used to build the front page 
exports.getFrontPageItems = (req, res) => {
	console.log('regular front page')
	const frontPageItems = {};
	let userData = {}

	//get trending items
	db.getTop10TrendingItems(function (err, result) {
		if (err) {
			console.log(err);
			frontPageItems.trending = [];
		}
		else {
			frontPageItems.trending = result;
			//get items recently viewed by the session ID
			db.getTop10RecentlyViewedItems(req.session.id, function (err, result) {
				if (err) {
					console.log(err);
					frontPageItems.recentlyViewed = []
				}
				else {
					frontPageItems.recentlyViewed = result;
					//get item recently added by sellers to the market
					db.getTop10LatestItems(function (err, result) {
						if (err) {
							console.log(err);
							frontPageItems.latest = [];
						}
						else frontPageItems.latest = result;
						//get email,first name, admin status,
						// seller status of user else set userdata to null
						if (!req?.userData) {
							db.identifyUser(req.session.user, function (err, result) {
								if (err) {
									console.log(err);
								}
								//userData = { ...result[0] };
								console.log(frontPageItems);
								return res.send({
									userData: result[0] ?? {
										email: req.session.user,
										is_admin: false, is_seller: req.session.isSeller
									},
									result: { frontPage: frontPageItems }
								});
							})
						}
						else {
							return res.send({
								userData: req?.userData,
								result: { frontPage: frontPageItems }
							});
						}

					});
				}
			});
		}
	});
};

//get admin front page
exports.getAdminFrontPage = (req, res) => {
	res.send({
		userData: req?.userData ?? { email: req.session.user, is_admin: true, is_seller: false },
		result: { frontPage: {} }
	});
};

//get details of user
exports.getUserDetails = (req, res) => {
	db.getUserDetails(req.session.user, function (err, result) {
		if (err) return res.send({ userData: req?.userData ?? {}, error: 'failed' });
		res.send({ userData: req?.userData ?? {}, result: result });
	});
};

//get profile details of user
exports.getProfile = (req, res) => {
	db.getProfile(req.session.user, function (err, result) {
		if (err) return res.send({ userData: req?.userData ?? {}, error: 'failed' });
		res.send({ userData: req?.userData ?? {}, result: result[0] });
	});
};

//get categories
exports.getCategories = (req, res) => {
	db.getCategories(function (err, result) {
		if (err) {
			console.log(err);
			return res.send({ userData: req?.userData ?? {}, error: 'failed' });
		}
		console.log(result);
		res.send({ userData: req?.userData ?? {}, result: result });
	});
};


//get products
exports.getProducts = (req, res) => {
	db.getProducts(function (err, result) {
		if (err) {
			console.log(err);
			return res.send({ userData: req?.userData ?? {}, error: 'failed' });
		}
		console.log('result', result);
		res.send({ userData: req?.userData ?? {}, result: result });
	});
};

//get all users
exports.getAllUsers = (req, res) => {
	db.getAllUsers(function (err, result) {
		if (err) return send500Status(req, res);
		res.send({ userData: req?.userData ?? {}, 'data': result });
	});
};

//get inventory of user
exports.getUserInventory = (req, res) => {
	db.getUserInventory(req.session.user, function (err, result) {
		if (err) return send500Status(req, res);
		res.send({ userData: req?.userData ?? {}, 'data': result });
	});
};


//add to cart
exports.addToCart = (req, res) => {
	db.addToCart(req.body.inventoryId, req.body.qty,
		req.body.unitPrice, req.body.totalPrice, req.session.user,
		req.body.seller, function (err) {
			if (err) {
				return res.send({ userData: req?.userData ?? {}, error: 'failed', errMsg: 'bad-db-input' });
			}
			if (this.changes) {
				res.send({ userData: req?.userData ?? {}, result: 'success' });
			}
			else {
				res.send({ userData: req?.userData ?? {}, error: 'failed', errMsg: 'unknown' });
			}
		});
};

//get shopping cart
exports.getCart = (req, res) => {
	db.getCart(req.session.user, function (err, result) {
		if (err) {
			return res.send({ userData: req?.userData ?? {}, error: 'failed', errMsg: 'bad-db-input' });
		}
		else {
			return res.send({ userData: req?.userData ?? {}, result: result });
		}
	});
};

//checkout using Flutterwave
exports.checkoutWithFlutterwave = (req, res) => {
	const trnxIdArr = req.body.trnxIdArr; //Array of the trnxIds of all the trnx in the cart
	let trnxRef = 'fdd';
	//save final unit and total price at which product is about to be sold to this user.
	//Price changes over time so it is very important to know historical selling prices.
	//Also set a trnx_ref identify all the trnx in the cart as a single trnx
	db.saveFinalTrnxData(req.body.inventoryIdArr, trnxIdArr, req.session.user,
		function (err) {
			if (err) {
				console.log(err);
				return res.send({ userData: req?.userData ?? {}, error: 'failed', errMsg: 'bad-db-input' });
			}
			else if (this.changes) {
				//get the final selling price from trnxtb
				console.log('saved', this);
				db.getFinalTotalPrice(trnxIdArr, function (err, result) {
					console.log(result);
					if (err) {
						console.log(err);
						return res.send({ userData: req?.userData ?? {}, error: 'failed', errMsg: 'bad-db-input' });
					}
					else {
						trnxRef = result[0]?.trnx_ref;
						const url = 'https://api.flutterwave.com/v3/payments'
						//request payload
						const payload = {
							tx_ref: trnxRef,
							amount: result[0]?.total_price,
							currency: 'NGN',
							redirect_url: 'https://lying-opposite-joke.glitch.me', //mock redirect url
							customer: {
								email: req.session.user
							},
							customizations: {
								title: 'Digital Market Payment',
								description: 'Make your payment here.'
							}
						};
						//request options
						const options = {
							headers: {
								Authorization: 'Bearer ' + process.env.FLUTTERWAVE_SECRET_KEY
							},
							json: payload,
							responseType: 'json'
						}

						//send request
						got.post(url, options).then((response) => {
							if (response.body.status != 'success')
								return res.send({ userData: req?.userData ?? {}, error: 'failed' });

							response.body.trnxRef = trnxRef;
							return res.send({ userData: req?.userData ?? {}, result: response.body }); //redirect user to the url in response.body
						}, (err) => {
							return res.send({ userData: req?.userData ?? {}, error: 'network-error', errMsg: err })
						});
					}
				});
			}
			else {
				console.log('unknown error', this);

				return res.send({ userData: req?.userData ?? {}, error: 'failed', errMsg: 'unknown' });
			}
		});
};

//verify payment
exports.verifyPayment = (req, res) => {
	if (req.query.status === 'successful') {
		db.getTrnxDetails(req.query.tx_ref, function (err, result) {
			if (err) {
				console.log(err);
				return res.send({ userData: req?.userData ?? {}, error: 'failed', errMsg: 'bad-db-input' });
			}
			else {
				console.log(req.query.tx_ref, 'done', result);
				//get original trnx info from Flutterwave because anyone could have call
				//your redirect url and passed ficitious payload to it

				//initialise request object
				const flw = new Flutterwave(process.env.FLUTTERWAVE_PUBLIC_KEY,
					process.env.FLUTTERWAVE_SECRET_KEY);

				//request information about the transaction that this transaction_id refers to 
				flw.Transaction.verify({ id: req.query.transaction_id }).then((response) => {
					if (response.data.status === 'successful'
						&& response.data.amount === result[0].total_price
						&& response.data.currency === 'NGN'
						&& response.data.tx_ref === req.query.tx_ref) {
						console.log('success');
						db.finishTransaction(req.query.tx_ref, function (err) {
							if (err) return res.send({ userData: req?.userData ?? {}, error: 'failed', errMsg: 'successful' });
							if (this.changes) {
								return res.send({ userData: req?.userData ?? {}, result: 'successful' });
							}
							else {
								return res.send({ userData: req?.userData ?? {}, error: 'failed', errMsg: 'duplicate' });
							}
						})

					} else {
						console.log('failed');
						return res.send({ userData: req?.userData ?? {}, error: 'failed', errMsg: 'not-successful' });
					}
				}, (error) => {
					console.log('network issues', error);
					return res.send({ userData: req?.userData ?? {}, error: 'failed', errMsg: 'network-issues' });
				});
			}
		});
	}
	else {
		console.log('failed');
		res.send({ userData: req?.userData ?? {}, error: 'failed', errMsg: 'not-successful' });
	}

};

//delete inventory
exports.deleteInventory = (req, res) => {
	db.deleteInventory(req.session.user, req.body.inventoryId,
		function (err) {
			if (err) return send500Status(req, res);
			if (this.changes) {
				res.send('deleted');
			}
			else {
				res.send('not deleted');
			}
		});
};

//ban user
exports.banUser = (req, res) => {
	db.banUser(req.session.user, function (err) {
		if (err) return send500Status(req, res);
		if (this.changes) {
			res.send('banned');
		}
		else {
			res.send('not banned');
		}
	});
};

//unban user
exports.unbanUser = (req, res) => {
	db.unbanUser(req.session.user, function (err) {
		if (err) return send500Status(req, res);
		if (this.changes) {
			res.send('unbanned');
		}
		else {
			res.send('not unbanned');
		}
	});
};

//update inventory details
exports.editInventoryDetails = (req, res) => {
	db.editInventoryDetails(req.body.description,
		req.body.price, req.body.inventoryId, function (err) {
			if (err) return send500Status(req, res);
			if (this.changes) {
				res.send('updated');
			}
			else {
				res.send('not updated');
			}
		});
};

//increase inventory qty
exports.increaseInventoryQty = (req, res) => {
	db.increaseInventoryQty(req.body.qty,
		req.body.inventoryId, function (err) {
			if (err) return send500Status(req, res);
			if (this.changes) {
				res.send('updated');
			}
			else {
				res.send('not updated');
			}
		});
};

//get transaction details

//rate seller

//delete pictures

//add pictures 

