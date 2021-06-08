const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
// const routes = require('./routes');
const app = express();
const crypto = require('crypto');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const path = require('path');

const PORT = process.env.PORT||8000;

if(process.env.NODE_ENV !== 'production'){
    require(`dotenv`).config();
}

app.use(cors());
app.use(express.json());

// try {
//     mongoose.connect(process.env.MONGO_DB_CONNECTION, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true
//     })
//     console.log(`MongoDB connected`);
// } catch (err){
//     console.log(err);
// }
const mongoURI = 'mongodb+srv://temp_user:960419@jeanrauwer.eiwek.mongodb.net/AnubisInterviewDB?retryWrites=true&w=majority';
var conn; 

try {
    
    conn = mongoose.createConnection(mongoURI, {useNewUrlParser: true, useUnifiedTopology: true});
    console.log(`MongoDB connected`);
} catch (err){
    console.log(err);
}


// app.use(routes);
app.use(express.urlencoded({extended: true}));
app.use(express.json())
app.use(methodOverride('_method'));


// Init gfs
let gfs;
conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('AnubisInterviewDB');
});

const storage = new GridFsStorage({
    url: mongoURI,
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }
          const filename = buf.toString('hex') + path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            bucketName: 'AnubisInterviewDB'
          };
          resolve(fileInfo);
        });
      });
    }
  });
  const upload = multer({ storage });

app.get('/images', (req, res)=>{
  gfs.files.find().toArray((err, files)=>{
    res.json({files: files});
  })
})

app.post('/upload', upload.single("file"), (req, res) =>{
    res.json({file: req.file});
    console.log("success");
    console.log(res.json({file: req.file}));
});

app.get('/files', (req, res)=>{
  gfs.files.find().toArray((err, files)=>{
    if (!files || files.length === 0){
      return res.status(404).json({
        err: 'No files exist'
      });
    }
    // exists
    return res.json(files);
  })
});
app.get('/files/:filename', (req, res)=>{
  gfs.files.findOne({filename: req.params.filename}, (err, file) => {
    if (!file || file.length === 0){
      return res.status(404).json({
        err: 'No file exist'
      });
    }

    //file exists
    return res.json(file);
    })
  });


app.get('/image/:filename', (req, res)=>{
  gfs.files.findOne({filename: req.params.filename}, (err, file) => {
    if (!file || file.length === 0){
      return res.status(404).json({
        err: 'No file exist'
      });
    }

    //check if image 
    if (file.contentType === 'image/jpeg' || file.contentType === 'img/png'){
      // Read output to browser
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    } else {
      res.status(404).json({
        err: 'Not an image'
      });
    }
    })
  });


app.listen(PORT, ()=>{
    console.log(`listening on ${PORT}`)
})