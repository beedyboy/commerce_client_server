const express = require("express");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const http = require('http');
const socketio = require('socket.io');
const path = require('path'); 
const knex = require('./config/knex').knex; 
const fs = require('fs'); 
const cors = require("cors"); 
var routes = require('./models/index');
// var sms = require('./plugins/sms');
// app.use(cors());
const app = express();
app.use(express.static('views/'));
app.use('/uploads/products', express.static('uploads/products'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());

const server = http.createServer(app);
const io = socketio(server);
app.post("/get_messages", (req, res) => {
//gt
const { buyer, seller } = req.body;
	knex('chats').where({buyer, seller}).select().then(result => {
		//response will be in JSON
		if(result) {
			res.json({
				result 
			})
		}
	});
});
var  users = [];
//set up a socket with nsmespace "connection"
io.on('connection', (socket) => {
	console.log('A user is connected', socket.id)

	//get connected
	socket.on("user_connected", (user) => {
		//save in array
		console.log('user', user, socket.id )
	 
		users[user] = socket.id; 
		//broadcast it out to user
		// socket.broadcast.emit('outgoing', {data:  user })
	
	});
	socket.on("send_message", (data) => {
		console.log(data);
		
		// send message to receiver
		var socketId = users[data.receiver];
		io.to(socketId).emit('new_message', data);

		//save the message in the database  
	//   const { buyer_id, seller_id, message, sender} = data ;
	//   const created_at = new Date().toLocaleString();
	// knex('chats').insert( { buyer, seller, message, sender, created_at })
	// .then( ( result ) => {  
	//   if(result.length > 0) {
	 
	//   }
	 
	//    });
			   
	 
	});

	 
	// a special namespace "disconnect" for when a client disconnectes
	socket.on('disconnect', () => console.log('CLient disconnected'));
});

app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "http://localhost:3000");
	res.header("Access-Control-Allow-Credentials", true);
	res.header("Access-Control-Allow-Headers", "x-www-form-urlencoded, Origin, X-Requested-With, Content-Type, Accept, Authorization");
	if (req.method === 'OPTIONS') {
		res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
		return res.status(200).json({});
	}
	next();
});
 
app.use('/api', routes); 
app.get('/', (req,res) => { 
	 console.log('Cookies: ', req.cookies)
  // Cookies that have been signed
  console.log('Signed Cookies: ', req.signedCookies)
 res.writeHead(200, {'Content-Type': 'text/plain'});
    var message = 'It works ooo!\n',
        version = 'NodeJS ' + process.versions.node + '\n',
        response = [message, version].join('\n');
    res.end(response);
})
 
// Define PORT
const port = process.env.PORT || 8000;
 server.listen(port, () => {
    console.log('Connected to port ' + port);
    // var dos = slug.split(" ").forEach()
})
// const io = socketio(server);

 