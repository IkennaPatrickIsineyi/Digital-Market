//models/dm.model.js

require('dotenv/config')
//import connection
const sql = require((process.env.NODE_ENV === 'test') ? '../test/test.dm.db.js' : './dm.db.js');
const bcrypt = require('bcrypt');

//hash password
const hashPassword = (password, salt, callback) => {
	bcrypt.hash(password, salt, callback);
};

console.log('connection imported')
//create tables//

//Login table. This table is not necessary because express session can be used instead
exports.createLogintb = (result) => {
	sql.run("create table  if not exists logintb(sessionId varchar(64),\
     email varchar(64) not null, dateLogged date default(current_date),\
     timeLogged time default(current_time), primary key(sessionId),\
     foreign key (email) references usertb(email) on delete \
     cascade on update cascade)", result);
};

//User table: contains user details
exports.createUsertb = (result) => {
	sql.run("create table  if not exists usertb(email varchar(64),\
     password varchar(64) not null, first_name varchar(30) not null,\
     last_name varchar(30) not null, gender varchar(1) not null, \
     is_seller boolean default false, picture text, is_admin boolean default false,\
     is_banned boolean default false, phone varchar(16),\
     primary key(email))", result);
};

//category table: conatains all the categories of products in the system
exports.createCategorytb = (result) => {
	sql.run("create table if not exists categorytb(category varchar(64) primary key,\
	description text)", result);
};


//Transaction table: contains details of all transactions
exports.createTrnxtb = (result) => {
	sql.run("create table  if not exists trnxtb(trnxId integer,\
    trnxDate date default(current_date), trnxTime time default (current_time),\
    inventory_id integer not null, qty Integer not null, unit_price float not null,\
    total_price float not null, trnx_ref varchar (64), rating integer default 0,\
	 comment text default ' ',\
    status varchar(16) default 'pending', buyer varchar (64), seller varchar(64),\
    primary key(trnxId), foreign key(inventory_id) references inventorytb(inventory_id) \
    on delete cascade on update cascade,foreign key(buyer) references \
    usertb(email) on delete cascade on update cascade,\
	foreign key( seller) references \
    usertb(email) on delete cascade on update cascade)", result);
};

//payment table: contains a mapping of transactions to payments
//This table was not used
exports.createPaymenttb = (result) => {
	sql.run("create table  if not exists paymenttb(payment_id integer, \
	trnxId integer, trnx_ref  varchar(64),\
    paymentDate date default(current_date), paymentTime time default(current_time),\
	primary key (payment_id), foreign key(trnxId) references trnxtb(trnxId) \
	on delete cascade on update cascade)", result);
};

//Interaction table: maps users to the items they have clicked and the date they did so
//This is used to measure trend and to remind user of the items they recently viewed.
//No record must contain exactly the same date, user, and inventory_id.
exports.createInteractiontb = (result) => {
	sql.run("create table  if not exists interactiontb(interaction_id integer, \
	inventory_id integer, session_id varchar(64), interaction_date date default(current_date), \
	primary key (interaction_id),unique(inventory_id,session_id,interaction_date), \
	 foreign key(inventory_id) references inventorytb(inventory_id) \
	on delete cascade on update cascade)", result);
};

//product table: contains details of all stocks in the system.
exports.createProducttb = (result) => {
	sql.run("create table  if not exists producttb(product_id integer,\
      product_name varchar(64), category varchar (64), \
      primary key(product_id), unique(product_name,category),\
	    foreign key(category) references \
	  categorytb(category) on delete set null on update cascade)", result);
};

//Images table: contains references of all images in the system to their respective owners
exports.createImagetb = (result) => {
	sql.run("create table  if not exists imagetb(image_id integer, \
	inventory_id integer, image_name varchar(64),\
    primary key(image_id),  foreign key(inventory_id) \
    references inventorytb(inventory_id) on delete cascade \
    on update cascade)", result);
};

//Inventory table: contains a mapping of users to products they have for sale
exports.createInventorytb = (result) => {
	sql.run("create table  if not exists inventorytb(inventory_id integer,\
	user_id varchar(64), product_id Integer, title varchar (128), description text,\
    qty integer default 0, price float default 0, popularity_factor float default 1,\
	 rating float default 0, date_added date default(current_date), time_added time \
	default (current_time), \
    primary key(inventory_id), foreign key(user_id) references usertb(email) \
    on delete cascade on update cascade, foreign key(product_id) references \
    producttb (product_id) on delete cascade on update cascade)", result);
};

//reviews table: contains a mapping of inventory to reviews
exports.createReviewtb = (result) => {
	sql.run("create table  if not exists reviewtb(review_id integer, \
	trnxId integer, rating integer default 0, comment text, \
    reviewDate date default(current_date), reviewTime time default(current_time),\
	primary key (review_id), foreign key(trnxId) references trnxtb(trnxId) \
	on delete cascade on update cascade)", result);
};



//create admin//
exports.createAdmin = (result) => {
	hashPassword('admin', 10, function (err, passwordHash) {
		if (err) {
			console.log(err);
			return result()
		}
		sql.run("insert or ignore into usertb (email, password,first_name,last_name,\
			gender, is_seller, is_admin) values (?,?,?,?,?,?,?)",
			['admin', passwordHash, 'Admin', 'Admin', 'f', false, true],
			result);
	})
};

//create triggers//

//Subtracts qty of an item sold from the qty of that items available 
exports.createDecrQtyTrigger = (result) => {
	sql.run("create trigger if not exists decr_qty_trigger after update on trnxtb \
	for each row begin update inventorytb  set  qty= qty-new.qty \
	where inventorytb.inventory_id=new.inventory_id \
	and new.status='finished' and old.status='pending'; end;", result);
};

//Add 0.5 to the popularity factor of an item after each unique click
exports.createIncrPopularity = (result) => {
	sql.run("create trigger if not exists incr_popularity after insert on interactiontb \
	for each row begin update inventorytb set popularity_factor=popularity_factor+0.3 \
	where inventorytb.inventory_id=new.inventory_id; end;", result);
};

//query database//

//get stored password hash of user: for authentication 
exports.getPasswordHash = (email, result) => {
	sql.all("select password,is_admin, is_seller from usertb where email=?",
		[email], result);
};

//register new user
exports.registerUser = (firstName, lastName, email, password,
	gender, isSeller, result) => {
	sql.run("insert into usertb(first_name, last_name, email,password,\
	gender, is_seller) values(?,?,?,?,?,?)", [firstName, lastName, email, password,
		gender, isSeller], result);
};

//update profile
exports.updateProfile = (firstName, lastName, email, isSeller, gender, phone, result) => {
	sql.run("update usertb set first_name=?, last_name=?, \
	is_seller=?, gender=?,phone=? where email=?",
		[firstName, lastName, isSeller, gender, phone, email], result);
};

//change password
exports.changePassword = (newPassword, email, result) => {
	sql.run("update usertb set password=? where email=?",
		[newPassword, email], result);
};

//add category
exports.addCategory = (category, description, result) => {
	sql.run("insert into categorytb (category,description) values (?,?)",
		[category, description], result)
};

//add product
exports.addProduct = (product, category, result) => {
	sql.run("insert into producttb (product_name,category) values (?,?)",
		[product, category], result)
};

/* //add new inventory
exports.addNewInventory = (userId, productId, title, description, qty, price, result) => {
	sql.run("insert into inventorytb (user_id,product_id,title,description,qty,price) \
	values (?,?,?,?,?,?)", [userId, productId, title, description, qty, price], result)
}; */

//add new inventory
exports.addNewInventory = (userId, productId, title, description, qty, price, imgList, result) => {
	//build query
	//const inventoryId = 1;
	let finalQuery = "insert into imagetb (image_name, inventory_id) values ";

	const finalImgList = [];

	sql.run("insert into inventorytb (user_id,product_id,title,description,qty,price) \
	values (?,?,?,?,?,?)", [userId, productId, title, description, qty, price],
		(!imgList.length) ? result : function (err) {
			if (err) result(err);
			else {
				imgList.map((item, indx) => {
					finalQuery += `(?,?) ${(indx + 1 < imgList.length) ? ',' : ''}`;
					finalImgList.push(...[item, this.lastID]);
				});
				sql.run(finalQuery, finalImgList, result);
			}
		});


	/* sql.run("begin transaction;\
	insert into inventorytb (user_id,product_id,title,description,qty,price) \
	values (?,?,?,?,?,?);"+ finalQuery,
		[userId, productId, title, description, qty, price, ...finalImgList], result) */
};

//get transaction history of a particular user
exports.getTransactionHistory = (email, result) => {
	sql.all("select t.trnxId, t.trnxDate, t.trnxTime, p.product_name, \
    t.qty,t.unit_price,t.total_price, t.rating, t.comment \
    from trnxtb as t inner join producttb as p on t.product_id=p.product_id \
    where buyer=? or seller=?", [email, email], result);
};

//get details of user
exports.getUserDetails = (email, result) => {
	sql.all("select email, phone, first_name, last_name, is_seller,\
	gender, picture, is_banned from usertb where email=?", [email], result);
};

//get profile details of user
exports.getProfile = (email, result) => {
	sql.all("select  phone, first_name firstName, last_name lastName, is_seller isSeller,\
	gender, picture from usertb where email=?", [email], result);
};

//get all users
exports.getAllUsers = (result) => {
	sql.all("select email, phone, first_name, last_name, is_seller,\
	gender, picture, is_banned from usertb", result);
};

//get inventory of user
exports.getUserInventory = (email, result) => {
	sql.all("select i.inventory_id,p.product_name,i.description,\
	i.qty, i.price,i.rating from inventorytb as i inner join producttb as p \
	on i.product_id=p.product_id where i.user_id=?", [email], result);
};

/* //get item details
exports.getItemDetails = (inventoryId, result) => {
	sql.all("select i.inventory_id, u.first_name, u.last_name,\
	im.image_name, p.product_name, i.description, \
	i.qty, i.price, i.rating from inventorytb as i join producttb \
	as p on i.product_id=p.product_id join usertb as u on \
	i.user_id=u.email join imagetb as im on \
	i.inventory_id = im.inventory_id where i.inventory_id=?",
		[inventoryId], result);
}; */

//get item details
exports.getItemDetails = (inventoryId, result) => {
	sql.all("select i.inventory_id, u.first_name, u.last_name,\
	im.image_id, i.title, i.description, \
    i.qty, i.price, i.rating from inventorytb as i \
	inner join usertb as u on i.user_id=u.email cross \
	join imagetb as im \
	where i.inventory_id=? and im.inventory_id=?",
		[inventoryId, inventoryId], result);
};

//get the last 10 items that were recently viewed by this user.
//cross inventorytb with imagetb to get the images for each chosen inventory
exports.getTop10RecentlyViewedItems = (sessionId, result) => {
	sql.all("select i.inventory_id,i.title,i.user_id,i.rating,i.price, \
	p.image_id from \
	inventorytb as i cross join imagetb as p  \
	where i.qty>0 and i.inventory_id=p.inventory_id and i.inventory_id \
	in (select inventory_id from \
	interactiontb where session_id=? order by interaction_id desc limit 10) ",
		[sessionId], result);
};

//get the first 10 items with the highest popularity factor.
exports.getTop10TrendingItems = (result) => {
	sql.all("select i.inventory_id, i.title, i.user_id, i.rating, i.price, \
	p.image_id from \
	inventorytb as i inner join imagetb as p on i.inventory_id=p.inventory_id \
	where i.qty>0 order by i.popularity_factor desc limit 10", result);
};


//get the last 10 items that were introduced to the market by sellers
exports.getTop10LatestItems = (result) => {
	sql.all("select i.inventory_id,i.title,i.user_id,i.rating,i.price, \
	p.image_id from \
	inventorytb as i inner join imagetb as p on i.inventory_id=p.inventory_id \
	where i.qty>0 order by date_added desc, time_added desc limit 10", result);
};

//get user's email,first name, admin status, seller status
exports.identifyUser = (email, result) => {
	sql.all("select email,first_name,is_admin,is_seller from usertb where\
	email=?", [email], result);
};

//register the new click in the interactiontb
//After this succeeds, a trigger will automatically increase the popularity factor
//of this particular item by 0.5
exports.recordInteraction = (inventoryId, sessionId, result) => {
	sql.run("insert into interactiontb (inventory_id,session_id) values (?,?)",
		[inventoryId, sessionId], result);
};

//update session_id of user in interactiontb. Session id gets regenerated every now and then as a
//security measure. Hence, the interactiontb record should be updated to the new session id
exports.updateSessionId = (newSessionId, oldSessionId, result) => {
	sql.run("update interactiontb set session_id=? where session_id=?",
		[newSessionId, oldSessionId], result);
}


//add to cart
exports.addToCart = (inventoryId, qty,
	unitPrice, totalPrice, buyer, seller, result) => {
	sql.run("insert into trnxtb (inventory_id,qty,unit_price,total_price,\
	status, buyer, seller) values (?,?,?,?,?,?,?)", [inventoryId, qty,
		unitPrice, totalPrice, 'pending', buyer, seller], result);
};

//get shopping cart: all pending transactions
exports.getCart = (buyer, result) => {
	sql.all("select t.trnxId,i.inventory_id,t.trnxDate,t.trnxTime,t.seller,i.price,t.qty, \
	t.unit_price*t.qty as total_price, i.title from trnxtb as t inner join inventorytb \
	as i on t.inventory_id= i.inventory_id where t.buyer=? and t.status=?",
		[buyer, 'pending'], result);
};

//get categories
exports.getCategories = (result) => {
	sql.all("select category,description from categorytb",
		result);
};

//get products
exports.getProducts = (result) => {
	sql.all("select product_id,product_name, category from producttb;",
		function (err, result1) {
			sql.all("select category from categorytb;",
				function (err, result2) {
					result(err, { categories: result2?.map(obj => obj?.category), products: result1 })
				}
			);
		}
	);
};

//get transaction details
exports.getTrnxDetails = (trnxRef, result) => {
	sql.all("select sum(total_price) as 'total_price' from trnxtb where trnx_ref=?",
		[trnxRef], result);
};

/* //set final unit price, total price, and trnx ref for transactions
exports.saveFinalTrnxData = (inventoryId, trnxIdArr, userId, result) => {
	//inventoryIdArr = [1, 2, 3]; trnxIdArr = [9, 3, 7]; i = 0;
	sql.run("update trnxtb set unit_price=(select inventorytb.price from inventorytb \
		where inventory_id=?), total_price = ((select inventorytb.price  from inventorytb \
		where inventory_id=?) * trnxtb.qty),trnx_ref= (? || (select sum(trnxId) from trnxtb \
		where trnxId >= ?)), where trnxId in ?",
		[inventoryId, inventoryId, userId, trnxIdArr[0], trnxIdArr], result);
} */

//set final unit price, total price, and trnx ref for transactions
exports.saveFinalTrnxData = (inventoryIdArr, trnxIdArr, userId, result) => {
	//inventoryIdArr = [1, 2, 3]; trnxIdArr = [9, 3, 7]; i = 0;
	let count = 0;

	const callback = function (err) {
		if (err) {
			console.log(err);
			return result(err);
		}
		else {
			count++;
			if (count >= trnxIdArr) {
				console.log('finished loading');
				//return result(null, this);
			}
			else {
				loader(count, callback);
			}
		}
	};

	const loader = function (i, callback) {
		sql.run("update trnxtb set unit_price=(select inventorytb.price from inventorytb \
			where inventory_id=?), total_price = ((select inventorytb.price  from inventorytb \
			where inventory_id=?) * trnxtb.qty),trnx_ref= (? || (select sum(trnxId) from trnxtb \
			where trnxId >= ?)) where trnxId = ?",
			[inventoryIdArr[i], inventoryIdArr[i], userId, trnxIdArr[0], trnxIdArr[i]],
			(count + 1 < trnxIdArr.length) ? callback : result);
	};

	loader(count, callback);
};

//set the trnx ref to identify all the trnx currently in this user's cart
exports.setTrnxRef = (user_id, trnxId, result) => {
	sql.run("update trnxtb set trnx_ref= (? || (select sum(trnxId) from trnxtb where trnxId >= ?)),\
	where trnxId=?", [user_id, trnxId - 5, trnxId], result);
};


//get final selling price
exports.getFinalTotalPrice = (trnxIdArr, result) => {
	console.log([1, 2, 3].join(','));
	sql.all("select trnx_ref, sum(total_price) as 'total_price' from \
	trnxtb where trnxId in ("+ trnxIdArr.join(',') + ") group by trnx_ref",
		result);
};

//finish transaction by setting status to finished and reducing qty of inventory accordingly.
//Also increase the popularity factor of the inventory by 1
exports.finishTransaction = (trnxRef, result) => {
	sql.run("update trnxtb set status=? where trnx_ref=?",
		['finished', trnxRef], result);
};

//delete inventory
exports.deleteInventory = (email, inventoryId, result) => {
	sql.run("delete from inventorytb where user_id=? and \
	inventory_id=?", [email, inventoryId], result);
};

//ban user
exports.banUser = (email, result) => {
	sql.run("update usertb set is_banned=? where email=?",
		[true, email], result);
};

//unban user
exports.unbanUser = (email, result) => {
	sql.run("update usertb set is_banned=? where email=?",
		[false, email], result);
};

//update inventory details
exports.editInventoryDetails = (description, price, inventoryId, result) => {
	sql.run("update inventorytb set  description=?,\
    price=?, where inventory_id=?", [description, price, inventoryId], result);
};

//increase inventory qty
exports.increaseInventoryQty = (qty, inventoryId, result) => {
	sql.run("update inventorytb set qty=qty+? \
    where inventory_id=?", [qty, inventoryId], result);
};

//get transaction details

//rate seller

//delete pictures

//add pictures 


