var express = require('express');
var app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.listen(process.env.PORT||3000,process.env.IP,function(){
	console.log("Server Started");
})

var mongoose = require("mongoose");
mongoose.connect("mongodb+srv://ayanghosal:ayanghosal0@cluster0-zx5tz.mongodb.net/test?retryWrites=true&w=majority", { useNewUrlParser: true });
//mongoose.connect("mongodb://localhost/phasebook_user_app", { useNewUrlParser: true });
var initialPic = "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRk5X_5u4w0vG2N-xreQybLYIyu73x9fhqC-BGzSRS7HjZdGOIF";

//------------------------------------------------SCHEMA1
var userSchema = new mongoose.Schema({
	name: String,
	surname: String,
	email: String,
	password: String,
	birthday: Date,
	gender: String,
	profilePic: String,
	posts:[{title: String,
			content: String
			}]
});

//------------------------------------------------Review Schema
var reviewSchema = new mongoose.Schema({
	author: String,
	userid: String,
	url: String,
	content: String,
	featured: String,
});

//------------------------------------------------MODELS
var User = mongoose.model("User", userSchema);
var Review = mongoose.model("Review", reviewSchema);

//-------------------------------------------------------------------------------ADD REVIEW
app.post("/post/review/:id", function(req, res){
	var content = req.body.content;
	var id = req.params.id;
	//var featured = "false";
	var featured = "true";
	var author;
	var url;
	if(id != "nonuser"){
		User.find({_id: id}, function(err, foundUser){
			if(err){
				console.log("REVIEW ERROR");
				url = "error";
				auhtor = "error occured";
			}
			else{
				author = foundUser[0].name;
				url = foundUser[0].profilePic;
				
			}
			var newReview = {userid: id, 
				content: content,
				featured: featured,
				author: author,
				url: url
				};
			Review.create(newReview, function(err, review){
				if(err){
					console.log("ERROR IN Review Post");
				}
				else{
					res.redirect("/");
				}
			})
		});
	}
	else{
		author = "Unkonwn User";
		url = initialPic;
		var newReview = {userid: id, 
			content: content,
			featured: featured,
			author: author,
			url: url
			};
		Review.create(newReview, function(err, review){
			if(err){
				console.log("ERROR IN Review Post");
			}
			else{
				res.redirect("/");
			}
		})
	}
})

//-------------------------------------------------------------------------------REVIEW TOGGLE FEATURED
app.get("/:featured/review/:id", function(req, res){
	var featured = req.params.featured;
	if(featured == "true")
		featured = "false";
	else
		featured = "true";
	console.log(featured);
	var id = req.params.id;
	var myquery = {_id: id};
	Review.updateOne(myquery,{featured: featured}, function(err, _res){
			if(err){
				console.log("Review Toggle ERROR");
			}
			else{
				Review.find({}, function(err, foundReview){
					if(err){
						console.log("SIGNIN ERROR");
					}
					else{
						res.render("allReviews.ejs",{reviews:foundReview});
					}
				})
			}
	})
})



//------------------------------------------------HOME PAGE

app.get("/",function(req, res){
	Review.find({}, function(err, reviews){
		if(err){
			console.log("HOME ERROR");
		}
		else{
			res.render("phasebook.ejs",{reviews: reviews});
		}
	})
});

//------------------------------------------------SIGNUP

app.post("/signup", function(req, res){
	var name = req.body.username;
	var surname = req.body.usersurname;
	var email = req.body.useremail;
	var password = req.body.userpassword;
	var birthday = req.body.userbirthday;
	var gender = req.body.usergender;
	var newUser = {name: name, surname:surname, email: email, password: password, birthday: birthday, gender: gender, profilePic: initialPic};
	//check if user already exists
	User.find({email: email}, function(err, foundUser){
		var len = foundUser.length;
		if(err){
			console.log("Error in user find signup");
		}
		else if(len == 0){
			User.create(newUser, function(err, user){
				if(err){
					console.log("ERROR IN SIGNUP");
				}
				else{
					res.render("users.ejs",{user:user});
				}
			})
		}
		else{
			console.log("Username already in use!");
			res.redirect("/");
		}
	})
})

//------------------------------------------------SIGNIN

app.post("/signin", function(req, res){
	var email = req.body.useremail;
	var password = req.body.userpassword;
	//check password
	User.find({email: email , password: password}, function(err, foundUser){
		var len = foundUser.length;
		if(err){
			console.log("SIGNIN ERROR");
		}
		else if(len == 1){

			res.render("users.ejs",{user:foundUser[0]});
		}
		else{
			console.log("WRONG ID/Pass!");
			res.redirect("/");
		}
	})
})

//--------------------------------------------------ADMIN
app.get("/admin",function(req, res){
	res.render("admin.ejs");
});

//------------------------------------------------ADMIN LOGIN

app.post("/adminLogin", function(req, res){
	var pass = req.body.adminPass;
	var page = req.body.page;
	if(pass == 743144 && page == "allUsers"){
		User.find({}, function(err, foundUser){
			if(err){
				console.log("SIGNIN ERROR");
			}
			else{
				res.render("allUsers.ejs",{users:foundUser});
			}
		})
	}
	else if(pass == 743144 && page == "allReviews"){
		Review.find({}, function(err, foundReview){
			if(err){
				console.log("SIGNIN ERROR");
			}
			else{
				res.render("allReviews.ejs",{reviews:foundReview});
			}
		})
	}
	else{
		console.log("WRONG ID/Pass!");
		res.redirect("/");
	}	
})

//------------------------------------------------USER DELETE

app.post("/users/delete/", function(req, res){
	User.deleteOne({_id:req.body.userid},function(){
		res.redirect("/");
	})
})

//-------------------------------------------------POST DELETE
app.post("/users/delete/post", function(req, res){
		var userid = req.body.userid;
		var postid = req.body.postid;
		var myquery = {_id: userid};
		var posts;
		User.find(myquery,function(err, foundUser){
			if(err){
				console.log("ADD POST ERROR");
			}
			else{	
					posts = foundUser[0].posts;
					posts.pull({_id: postid});
					var newvalues = {$set: {posts: posts}};
					User.updateOne(myquery, newvalues, function(err, _res) {
			 	    	if (err) {throw err}
			 	    	else{
			 				signin(userid, res);
			 	    	}
     				})
			}
		})
		 
		
})

//------------------------------------------------ADMIN ACCOUNT DELETE

app.get("/admin/delete/:id", function(req, res){
		User.deleteOne({_id:req.params.id},function(){
			User.find({}, function(err, foundUser){
				if(err){
					console.log("SIGNIN ERROR");
				}
				else{
					res.render("allUsers.ejs",{users:foundUser});
				}
			})
		});
})

//------------------------------------------------ADMIN Review DELETE

app.get("/admin/review/delete/:id", function(req, res){
	Review.deleteOne({_id:req.params.id},function(){
		Review.find({}, function(err, foundReview){
			if(err){
				console.log("SIGNIN ERROR");
			}
			else{
				res.render("allReviews.ejs",{reviews:foundReview});
			}
		})
	});
})

//-----------------------------------------------profile pic update
app.post("/users/updateDP", function(req, res){
	var id = req.body.userid;
	var myquery = {_id: id};
	if(! req.body.pic)
		req.body.pic = initialPic;
  	var newvalues = {$set: {profilePic: req.body.pic}};

	User.updateOne(myquery, newvalues, function(err, _res) {
    	if (err) {throw err}
    	else{
			signin(id, res);
    	}
    })
});

//---------------------------------------------------------signin function
var signin = function(id, res){
	User.find({_id: id},function(err, foundUser){
			if(err){
				console.log("ProfilePic ERROR");
			}
			else{
				res.render("users.ejs",{user:foundUser[0]});
			}
	})
}	
//-------------------------------------------------------------------------------ADD POST
app.post("/users/addPost", function(req, res){
	var id = req.body.userid;
	var title = req.body.newTitle;
	var content = req.body.newContent;
	var myquery = {_id: id};
	var posts = [];
	User.find(myquery,function(err, foundUser){
			if(err){
				console.log("ADD POST ERROR");
			}
			else{
				posts = foundUser[0].posts;
				var newvalues = {$set: {posts: posts}};
				posts.push({title: title, content: content});
				User.updateOne(myquery, newvalues, function(err, _res) {
			    	if (err) {throw err}
			    	else{
						signin(id, res);
			    	}
    			})
			}
	})
})




