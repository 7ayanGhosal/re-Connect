var express = require('express');
var app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.listen(process.env.PORT||3100,process.env.IP,function(){
	console.log("Server Started");
})

var mongoose = require("mongoose");
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb+srv://ayanghosal:ayanghosal0@cluster0-zx5tz.mongodb.net/test?retryWrites=true&w=majority", { useNewUrlParser: true });
//mongoose.connect("mongodb://localhost/phasebook_user_app", { useNewUrlParser: true });


//------------------------------------------------SCHEMA
var userSchema = new mongoose.Schema({
	name: String,
	surname: String,
	email: String,
	password: String,
	birthday: Date,
	gender: String,
});

//------------------------------------------------MODEL
var User = mongoose.model("User", userSchema);


//------------------------------------------------HOME PAGE

app.get("/",function(req, res){
	res.render("phasebook.ejs");
});

//------------------------------------------------SIGNUP

app.post("/signup", function(req, res){
	var name = req.body.username;
	var surname = req.body.usersurname;
	var email = req.body.useremail;
	var password = req.body.userpassword;
	var birthday = req.body.userbirthday;
	var gender = req.body.usergender;
	var newUser = {name: name, surname:surname, email: email, password: password, birthday: birthday, gender: gender};
	//check if user already exists
	User.find({name: name}, function(err, foundUser){
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

////------------------------------------------------ADMIN
app.get("/admin",function(req, res){
	res.render("admin.ejs");
});



//------------------------------------------------ADMIN

app.post("/adminLogin", function(req, res){
	var pass = req.body.adminPass;
	if(pass == 8240864954){
		User.find({}, function(err, foundUser){
			if(err){
				console.log("SIGNIN ERROR");
			}
			else{
				res.render("allUsers.ejs",{users:foundUser});
			}
		})
	}
	else{
		console.log("WRONG ID/Pass!");
		res.redirect("/");
	}	
})



//------------------------------------------------USER DELETE

app.get("/users/delete/:id", function(req, res){
		User.deleteOne({_id:req.params.id},function(){
			res.redirect("/");
		})
})

//------------------------------------------------ADMIN DELETE

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
