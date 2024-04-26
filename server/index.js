const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const { expressjwt: exjwt }=require('express-jwt') ;
const jwt_decode= require('jwt-decode')


const app = express();
app.use(cors());
app.use(express.json());

secretKey="abcd"
algorithm="HS256"

const jwtmw= exjwt({
    secret:secretKey,
    algorithms:[algorithm]
})

const client = new MongoClient('mongodb+srv://admin1:admin1@cluster0.cgffwji.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
client.connect();

const db = client.db('counselling');
const col = db.collection('register');

app.post('/register', async (req, res) => {
    try {
        await col.insertOne(req.body);
        console.log(req.body);
        res.send("Data Inserted Successfully");
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

app.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    console.log(email);
    const user = await col.findOne({ email });
    console.log(user.email, user.password, password);
    if (!user || !(password === user.password)) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }
    const token=jwt.sign(user,secretKey,{ algorithm : algorithm, expiresIn: '1m'});


    res.json({ username: user.name ,token:token}); // Return the username upon successful login
});


app.get('/retrieve', jwtmw, async (req, res) => {
    try {
        console.log(jwt_decode.jwtDecode(req.headers.authorization.substring(7)))
        const result = await col.find().toArray();
        console.log(result);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});



app.post('/exams', async (req, res) => {
    try {
      const { title, duration } = req.body;
      const db = client.db(dbName);
      const collection = db.collection('exams');
      const result = await collection.insertOne({ title, duration });
      res.json(result.ops[0]);
    } catch (error) {
      console.error('Error adding new exam:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


  app.post('/login', (req, res) => {
    const { username, password } = req.body;
  
    connection.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (error, results, fields) => {
      if (error) {
        return res.status(500).json({ error: 'Internal server error' });
      }
      if (results.length === 0) {
        return res.status(401).json({ error: 'Incorrect username or password' });
      }
      res.status(200).json({ message: 'Login successful' });
    });
  });
  
  app.get('/exam/questions', (req, res) => {
    connection.query('SELECT * FROM exam_questions', (error, results, fields) => {
      if (error) {
        return res.status(500).json({ error: 'Internal server error' });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: 'No questions found' });
      }
      res.status(200).json(results);
    });
  });

app.get('/', (req, res) => {
    res.send('<center><h1>Hello KL University</h1></center>');
});

app.get('/about', (req, res) => {
    res.send('<h1>This is About Page</h1>');
});

app.get('/contact', (req, res) => {
    res.send('<h1>This is Contact Page</h1>');
});

app.get('/home', (req, res) => {
    res.send('<h1>This is Home Page</h1>');
});

app.put('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, role, email, password } = req.body;
        const result = await col.updateOne({ _id: new ObjectId(id) }, { $set: { name, role, email, password } });
        res.send('updated');
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

app.delete('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await col.deleteOne({ _id: new ObjectId(id) });
        res.json({ message: 'deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});







app.get('/exams/:id', async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id).populate('questions');
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }
    res.json(exam);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



app.listen(8080, () => { console.log('Express server is running'); });