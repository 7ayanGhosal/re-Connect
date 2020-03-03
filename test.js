var express = require('express');
var app = express();
app.listen(process.env.PORT||3100,process.env.IP,function(){
	console.log("Server Started");
})

// function f(){};
function addPost(callback){
	setTimeout(function(){
		console.log("post added");
		callback();
		callback();
		console.log("xxx");
	},2000);
	callback();
	
};
function dispPost(){
	setTimeout(function(){
		console.log("post displayed");
		
	},0);
};

// addPost(f);
addPost(dispPost);
// addpost(f);





