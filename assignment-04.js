//Assignment 04	- Back End Development
//http://localhost:9000/
//Reference: Maynooth Moodle
//Work in IE, Chrome and firefox, work in Windows OS.

var http = require("http"); 
var url = require("url"); 
var querystring = require("querystring");
var fs = require("fs"); 
var port = 9000; 
var server = http.createServer(); // create the server

//Create and connect MySQL
var	mysql =	require('mysql');
var	con	= mysql.createConnection({
	// Database connection information
});
con.connect(function(err){
	if (err) throw err;
	console.log("Database Connected.");
});

server.on("request", function (request, response) {	
	var currentRoute = url.format(request.url); 
	var currentMethod = request.method; 
	var requestBody = "";	
	response.setHeader("Access-Control-Allow-Origin","*");
	response.setHeader("Access-Control-Allow-Methods","OPTIONS, POST, GET");
	response.setHeader("Content-Type","text/html");
	console.log(currentRoute);
	var queryStr = "";
	if (currentRoute.indexOf('?') > 0) {		
		queryStr = currentRoute.substring(currentRoute.indexOf('?') + 1);		
		currentRoute = currentRoute.substring(0, currentRoute.indexOf('?'));
	}	
	console.log(queryStr);
	switch (currentRoute) {	
	case "/":
		//Default page
      	fs.readFile(__dirname + "/assignment-04.html", function (err, data) {
			var headers = {
				"Content-Type": "text/html",
			};
			response.writeHead(200, headers);
			response.end(data); 
		});
		break;
	case "/api/updateuser":
		if (currentMethod === "POST") {
			request.on("data", function (chunk) {
				requestBody += chunk.toString();
			});
			const { headers } = request;
			let ctype = headers["content-type"];
			request.on("end", function () {
				var userData = "";
				if (ctype.match(new RegExp('^application/x-www-form-urlencoded'))) {
					userData = querystring.parse(requestBody);
				} else {
					userData = JSON.parse(requestBody);
				}		
				console.log (
					"USER DATA RECEIVED: \n" + JSON.stringify(userData, null, 2) + "\n"
				);	
				//Update
				var values = [userData.title, userData.firstname, userData.surname, 
					userData.mobile, userData.email, userData.userid];    
				var sql = "update User_Info set Title=?, FirstName=?, Surname=?, Mobile=?,"
					+ "Email=? where userID =?";
				con.query(sql, values, function(err, result) {
					if (err) throw err;															
					var headers = {"Content-Type": "text/plain",};
					if (!response.headersSent) {
						response.writeHead(200, headers);
					}
					console.log("User " + userData.userid + " data updated to the Database!" );
					response.end("User " + userData.userid + " data updated to the Database!" );																
				});		
		    });
		} 
		break;
	case "/api/updateaddress":
		if (currentMethod === "POST") {
			request.on("data", function (chunk) {
				requestBody += chunk.toString();
			});
			const { headers } = request;
			let ctype = headers["content-type"];
			request.on("end", function () {
				var addressData = "";
				if (ctype.match(new RegExp('^application/x-www-form-urlencoded'))) {
					addressData = querystring.parse(requestBody);
				} else {
					addressData = JSON.parse(requestBody);
				}		
				console.log (
					"ADDRESS DATA RECEIVED: \n" + JSON.stringify(addressData, null, 2) + "\n"
				);	
				//Update Address
				var values = [addressData.isshipaddress, addressData.address1, addressData.address2, 
					addressData.town, addressData.countryorcity, addressData.eircode, addressData.id];    
				var sql = "update User_Address set Address1=?, Address2=?, Town=?, CountryOrCity=?,"
					+ "Eircode=? where id =?";
				con.query(sql, values, function(err, result) {
					if (err) throw err;															
					var headers = {"Content-Type": "text/plain",};
					if (!response.headersSent) {
						response.writeHead(200, headers);
					}
					console.log("Address " + addressData.id + " data updated to the Database!" );
					response.end("Address " + addressData.id + " data updated to the Database!" );																
				});		
			});
		} 
		break;
	case "/api/deleteaddress":
		if (currentMethod === "POST") {
			request.on("data", function (chunk) {
				requestBody += chunk.toString();
			});
			const { headers } = request;
			let ctype = headers["content-type"];
			request.on("end", function(){
				var userData = "";
				if (ctype.match(new RegExp('^application/x-www-form-urlencoded'))) {
					userData = querystring.parse(requestBody);
				} else {
					userData = JSON.parse(requestBody);
				}		
				console.log (
					"USER DATA RECEIVED: \n" + JSON.stringify(userData, null, 2) + "\n"
				);	
				//Delete
				var addressId = userData.addressid;
				var sql = "delete from User_Address where Id = ?";
				con.query(sql, addressId, function(err, result) {
					if (err) throw err;		
					console.log("Address " + addressId + " data deleted from the Database!" );
					var headers = {"Content-Type": "text/plain",};
					response.writeHead(200, headers);
					response.end("User " + addressId + " data deleted from the Database!" );						
				});	
			});
		}
		break;
	case "/api/deleteuser":
		if (currentMethod === "POST") {
			request.on("data", function (chunk) {
				requestBody += chunk.toString();
			});
			const { headers } = request;
			let ctype = headers["content-type"];
			request.on("end", function(){
				var userData = "";
				if (ctype.match(new RegExp('^application/x-www-form-urlencoded'))) {
					userData = querystring.parse(requestBody);
				} else {
					userData = JSON.parse(requestBody);
				}		
				console.log (
					"USER DATA RECEIVED: \n" + JSON.stringify(userData, null, 2) + "\n"
				);	
				//Delete user by matching Email Phone and Name.
				var addressId = userData.addressid;
				var sql = "delete from User_Info where Email = ? and Mobile = ? and FirstName=? and Surname=?";
				var values = [userData.email, userData.mobile, userData.firstname, userData.surname];   
				con.query(sql, values, function(err, result) {
					if (err) throw err;		
					console.log("User " + userData.firstname + " data deleted from the Database!" );
					var headers = {"Content-Type": "text/plain",};
					response.writeHead(200, headers);
					response.end("User " + userData.firstname + " data deleted from the Database!" );						
				});	
			});
		}
		break;
	case "/api/user":		
		if (currentMethod === "POST") {
			request.on("data", function (chunk) {
				requestBody += chunk.toString();
			});
			const { headers } = request;
			let ctype = headers["content-type"];
			request.on("end", function () {
				var userData = "";
				if (ctype.match(new RegExp('^application/x-www-form-urlencoded'))) {
					userData = querystring.parse(requestBody);
				} else {
					userData = JSON.parse(requestBody);
				}		
				console.log (
					"USER DATA RECEIVED: \n" + JSON.stringify(userData, null, 2) + "\n"
				);	
				//Insert
				var values = [userData.title, userData.firstname, userData.surname, 
					userData.mobile, userData.email];    
				var sql = "insert into User_Info(Title, FirstName, Surname, Mobile, Email) values (?)";
				con.query(sql, [values], function(err, result) {
					if (err) throw err;	
					// Get new UserId
					var userId = "";	
					con.query("SELECT LAST_INSERT_ID() as userid", function(err, rows) {
						if (err) throw err;	
						userId = rows[0].userid;	
						// Insert user's addresses
						console.log(userData['isshipaddress[]'].length);
						console.log(userData['isshipaddress[]'][0]);
						if (!Array.isArray(userData['isshipaddress[]'])) {
							userData['isshipaddress[]'] = [userData['isshipaddress[]']];
						}
						if (!Array.isArray(userData['address1[]'])) {
							userData['address1[]'] = [userData['address1[]']];
						}
						if (!Array.isArray(userData['address2[]'])) {
							userData['address2[]'] = [userData['address2[]']];
						}
						if (!Array.isArray(userData['eircode[]'])) {
							userData['eircode[]'] = [userData['eircode[]']];
						}
						if (!Array.isArray(userData['town[]'])) {
							userData['town[]'] = [userData['town[]']];
						}
						if (!Array.isArray(userData['countryorcity[]'])) {
							userData['countryorcity[]'] = [userData['countryorcity[]']];
						}
						for(var i = 0; i < userData['isshipaddress[]'].length; i++) {
							var addressvalues = [userId, userData['isshipaddress[]'][i], 
								userData['address1[]'][i], userData['address2[]'][i], 
								userData['eircode[]'][i], userData['countryorcity[]'][i], 
								userData['town[]'][i]]; 
							var addresssql = "insert into User_Address(UserId, IsShipAddress, Address1, Address2,"
								+ "Eircode, CountryOrCity, Town) values (?)";
							con.query(addresssql, [addressvalues], function(err, result) {
								if (err) throw err;	
								console.log("Address has added to the Database!" );															
								var headers = {"Content-Type": "text/plain",};
								if (!response.headersSent) {
									response.writeHead(200, headers);
								}
								response.end("Address has added to the Database!" );	
							});	
						}
						console.log("User " + userId + " data added to the Database!" );
						response.end("User " + userId + " data added to the Database!" );																
					});						
				});	
		    });
		} else if (currentMethod === "GET") {			
			var params = new URLSearchParams(queryStr);
			var firstname = params.get('firstname');
			var surname = params.get('surname');
			//Read
			var sql = "select a.UserId,b.id,title,firstname,surname,address1, address2, eircode,"
				+ "town,countryorcity,mobile,email from User_Info a inner join User_Address b on "
				+ "a.userId = b.userId where 1=1 ";
			if (firstname != "") {
				sql += "and firstname = '" + firstname + "' "
			}
			if (surname != "") {
				sql += "and surname = '" + surname + "' "
			}
			sql += "order by a.UserId desc";
			//var values = [userData.firstname, userData.surname]; 
			con.query(sql, function(err, result) {
				if (err) throw err;
				//console.log(sql);
				console.log("User and Address Data Read: \n" + JSON.stringify(result, null, 2) + "\n");
				var headers = {
					"Content-Type": "application/json",
				};				  
				response.writeHead(200, headers);
				response.end(JSON.stringify(result));
			});		    
		}
		break;
		
	}
  });
  
  server.listen(port, function () {
	console.log("AJAX (HTTP) API server running on port: " + port + "\n");
  });
  