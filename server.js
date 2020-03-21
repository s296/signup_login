const express = require('express');
const bodyParser = require("body-parser");

const mongoose = require('mongoose');
var schema = mongoose.Schema;
var blogschema = new schema({
    fname: { type: String, required: 'required' },
    lname: String,
    email: { type: String, index: { unique: true } },
    password: String,
    image: String
});

mongoose.connect('mongodb://localhost:27017/user', { useNewUrlParser: true, useUnifiedTopology: true });
const app = express();
app.use(express.static("public"))
// app.use(express.static(__dirname + "public"))
console.log("in");
const userdb = mongoose.model('signup1', blogschema);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var multer = require('multer');
var upload = multer({ dest: 'public/upload' });


// app.get("/login", (req, res) => {
//     res.sendFile(__dirname + "/public/login.html")
// })

app.all("/login", upload.single('avatar'), (req, res) => {
    console.log("hello");

    new userdb({
        fname: req.body.fname,
        lname: req.body.lname,
        email: req.body.email,
        password: req.body.password,
        image: __dirname + "/" + req.file.path
    }).save(function (err, result) {
        if (err) res.send("This account is already exists.");
        else {
            console.log(req.body, __dirname + "/" + req.file.path)
            res.redirect("/login.html");
            // res.sendFile(__dirname + "/public/login.html")
        }
    });

});


app.get('/', (req, res) => {
    // res.send('sdfsd');
    res.redirect('signup.html')

})

app.post("/game", (req, res) => {
    console.log(req.body);
    userdb.find({ email: req.body.email, password: req.body.password }, (err, data) => {
        if (err) console.log(err);
        else {
            console.log(data, data.length);
            if (data.length == 0) {
                console.log('')
                res.redirect('login.html');
                // res.sendFile(__dirname + "/public/login.html")
            }
            else {
                res.redirect('s&l/temp.html');
                // res.sendFile(__dirname + "/s&l/temp.html");
            }
        }
    })

})

app.listen(8081, () => {
    console.log('Server is on')
})