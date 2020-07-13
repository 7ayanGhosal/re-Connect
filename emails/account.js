// var nodemailer = require('nodemailer');

// var transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'reconnect.24for.you7@gmail.com',
//     pass: 'ayanghosal0'
//   }
// });

// var mailOptions = {
//   from: 'reconnect.24for.you7@gmail.com',
//   to: 'reconnect.24for.you7@gmail.com',
//   subject: 'Sending Email using Node.js',
//   text: 'That was easy!'
// };

// transporter.sendMail(mailOptions, function(error, info){
//   if (error) {
//     console.log(error);
//   } else {
//     console.log('Email sent: ' + info.response);
//   }
// });


var mongoose = require("mongoose");
mongoose.connect("mongodb+srv://add2kart:<password>@cluster0-zntgd.mongodb.net/test?retryWrites=true&w=majority", { useNewUrlParser: true });
