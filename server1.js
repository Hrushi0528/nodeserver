const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const cors = require('cors');



const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

const userSchema = new mongoose.Schema({
    /*username: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Store hashed passwords*/
},{strict:false,
   versionKey: false
});

const User = mongoose.model('users', userSchema);

// MongoDB Connection
mongoose.connect('mongodb+srv://admin:Admin0008@cluster1.uwzcwak.mongodb.net/Itenary_Planning', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(async () => {
    console.log('Connected to MongoDB Atlas!');

    // Retrieve all documents
    /*const allDocuments = await User.find({});
    console.log('All Documents:', allDocuments);*/
})
.catch((error) => console.error('Error connecting to MongoDB Atlas:', error));


// Schema and Model

app.get('/', (req, res) => {
    res.send('Welcome to the server!'); // Message displayed at the root URL
});


// Login Validation Endpoint
app.post('/login', async (req, res) => {
    console.log('Received request:', req.body);

    const { username, password } = req.body;
   

    try {
        const user = await User.findOne({email:username});
        const user1 = await User.findOne({username:username});
        if (!user && !user1) {
            return res.status(400).json({ message: 'Invalid Username or Mail' })
            }
        // Validate password
        if ((!user || user.password !== password) && (!user1 || user1.password!== password)){
            return res.status(400).json({ message: 'Wrong Password' });
        }


        res.json({ message: 'Login successful' });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
        
    }
});

app.post('/signup', async (req, res) => {
    try {
        const user = new User(req.body);
        console.log(req.body)
        const {username,email,pwd,re_pwd}=req.body;

        const check_uname= await User.findOne({username:username});
        //Checking if the username already exist.
        if (check_uname){
            return res.status(400).json({message:'Username Already Exist',uname:''});
        }
        const check_email= await User.findOne({email:email});
        //Checking if the email already exist.
        if (check_email){
            return res.status(400).json({message:'Email Already Exist',email:''});
        }
        if (pwd !== re_pwd){
            return res.status(400).json({message:'Password and Re-Enter password does not Match',password:''});
        }
        delete user.re_pwd;
        await user.save();
        res.status(201).send({ message: 'User added successfully'});
    } catch (err) {
        res.status(400).send(err);
    }
});

// Start Server (optional)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
