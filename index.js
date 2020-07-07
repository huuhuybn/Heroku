let express = require('express');
let hbs = require('express-handlebars');
let multer = require('multer');

let bodyParser = require('body-parser')

let db = require('mongoose');

const userSchema = require('./model/userScheme')
const itemSchema = require('./model/itemSchema')
const User = db.model('user', userSchema, 'user')
const Item = db.model('item', itemSchema, 'items')
let app = express();


app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));
app.engine('.hbs', hbs({
    extname: 'hbs',
    layoutsDir: ''
}))
app.set('view engine', '.hbs')
app.use('/public', express.static(__dirname + "/public"))
app.listen(9191);

let multerConfig = multer.diskStorage({
    destination: function (request, file, cb) {
        cb(null, './public/images/')
    },
    filename: function (request, file, cb) {

        cb(null, file.originalname)
    }
})

let upload = multer({
    storage: multerConfig, limits: {
        fileSize: 2 * 1024 * 1024
    }
})

db.connect('mongodb+srv://huuhuybn:Emmaila123@cluster0-rwlpt.mongodb.net/demo1', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(r => {

});

app.get('/createUser', async (req, res) => {
    const user = new User({
        username: "huynguyen",
        full_name: "Nguyễn Hữu Huy",
        role: "admin",
        birthday: "03/01/1990"
    });


    let thuchien = db.model('users', userSchema)

    try {
        await thuchien({
            username: "huynguyen",
            full_name: "Nguyễn Hữu Huy",
            role: "admin",
            birthday: "03/01/1990"
        }).save();
        res.send(user);
    } catch (err) {
        res.status(500).send(err);
    }

});

app.get('/deleteItem/:id', async (req, res) => {
    let status = await Item.findByIdAndDelete(req.params.id)

    if (status){
        res.status(200).send()
    }else {
        res.status(500).send();
    }
    res.redirect('/')
});
app.get('/editItem/:id', async (req, res) => {
    await Item.findByIdAndDelete(req.params.id)
    res.redirect('/')
});

app.get('/addItemPage', (req, res) => {
    res.render('additem')
});


app.get('/showListDemo', async (req, res) => {

    let items = await Item.find({}).lean();
    res.render('demoList', {data: items})

})


app.post('/addItem', upload.single('avatar'), async (req, res) => {
    let title = req.body.title;
    let description = req.body.description;
    let time = req.body.time;

    let item = new Item({
        title: title,
        description: description,
        timePublished: time,
        img: req.file.path
    });
    await item.save(function (err, item) {
        if (err) {
            res.render('addItem', {error: err})
        } else {
            res.redirect('/');
        }
    });

});

app.get('/getAllUsers', async (req, res) => {
    let users = await User.find({});
    try {
        res.send(users);
    } catch (e) {

    }
});

app.get('/getAllItemJson', async (req, res) => {

    let items = await Item.find({});

    res.send(items);

})

let up = upload.single('avatar');
app.post('/upload', function (request, response) {
    up(request, response, function (error) {
        if (error) {
            if (error instanceof multer.MulterError) {
                response.send('File quá lớn. Maximum is 2MB');
            } else {
                response.send(error.message);
            }
        } else {
            response.send('Up file thanh cong');
        }
    })
})

// view engine
// view home
app.get('/', async function (request, response) {

    let items = await Item.find({}).lean();

    console.log(items)
    response.render(
        'index', {data: items}
    )
});


app.get('/home', function (request, response) {
    response.send('ABC');
})


