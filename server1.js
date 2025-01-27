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
},{strict:false});

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
        // Find user by email
        const user = await User.findOne({username});
        if (!user) {
            return res.status(400).json({ message: 'Invalid Username' });
        }

        // Validate password
        if (!user || user.password !== password) {
            return res.status(400).json({ message: 'Wrong Password' });
        }

        res.json({ message: 'Login successful' });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
        
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
