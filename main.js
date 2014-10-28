var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');
// 数据
// var userSelf = null;
// var roomSelf = null;
var socketId = null;
var userList = [];
var user = {
	name:'username',
	socketId:id
}
var roomList = [];
var room = {
	name:"",
	guest:[]
}
function Room(name){
	this.name = name;
	this.guestList = [];
	this.join = function(user){
		this.guestList.push(user);
	};
	this.leave = function(user){
		var index = guestList.indexOf(user);
		var guestList.splice(index,1);
	}
}
// 方法
// 获得用户信息
function getUser(socketId){
	for(var index in userList){
		if(userList[index].socketId === socketId){
			return userList[index];
		}
	}
}
// 进入聊天室
function joinTalkRoom(roomname,socket){
	createOrJoinRoom(roomname);
}
// 离开聊天室
function leaveTalkRoom(socket){

}
// 用户登录或者注册
function loginOrRegister(name,socketId){
	for(var index in userList){
		if(userList[index].name === name){
			// 如果用户已经存在
			userList[index].socketId = socketId;
			return;
		}
	}
	// 如果用户不存在
	var user = {name:name,socket:socket};
	userList.push(user);
}
// 加入或者创建房间
function createOrJoinRoom(name){
	for(var index in roomList){
		if(roomList[index].name === name){
			// 房间已经存在 加入房间
			roomList[index].join(getUser(socketId));
			return;
		}
	}
	// 如果房间不存在
	var room = new Room(name);
	room.join(getUser(socketId));
	roomList.push(room);
}
function handler(req,res){
	console.log(__dirname);
	fs.readFile(__dirname+"/index.html",function(err,data){
		if(err){

		}else{
			res.writeHead(200);
			res.end(data);
		}
	})
}
app.listen(8080);

io.on("connection",function(socket){
	socketId = socket.id;
	// 登录
	socket.on("login",function(username){
		loginOrRegister(username);
	})
	// 加入房间
	socket.on("join",function(roomname){
		// 加入房间之前要确保已经登录
		if(userSelf === null){
			socket.send("你还没有登录");
			return;
		}
		// 加入房间
		createOrJoinRoom(roomname);
		socket.join(rooname);
	})
	// 
})