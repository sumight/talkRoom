var app = require('http').createServer(handler);
var io = require('socket.io')(app);
var fs = require('fs');
// 数据
// var userSelf = null;
// var roomSelf = null;
var socketId = null;
var userList = [];
// 方法
// 获得用户信息
function getUser(socketId){
	console.log(userList);
	for(var index in userList){
		if(userList[index].socketId === socketId){
			return userList[index];
		}
	}
}
// 进入聊天室
function joinTalkRoom(roomname,socket){
	var user = getUser(socket.id);
	if(user.roomname){
		socket.leave(roomname);
	}
	user.roomname = roomname;
	socket.join(roomname);
	io.to(user.roomname).send(user.name+"进入房间");
	socket.send("你已经进入房间");
}
// 离开聊天室
function leaveTalkRoom(socket){
	var user = getUser(socket.id);
	if(user.roomname){
		socket.leave(user.roomname);
		io.to(user.roomname).send(user.name+"离开房间");
		socket.send("你已经离开房间");
		user.roomname = undefined;
	}
}
// 说话
function talk(words,socket){
	var user = getUser(socket.id);
	io.to(user.roomname).emit('talk',user.name+'说：'+words);
}
// 用户登录或者注册
function loginOrRegister(name,socket){
	for(var index in userList){
		if(userList[index].name === name){
			// 如果用户已经存在
			userList[index].socketId = socket.id;
			return;
		}
	}
	// 如果用户不存在
	var user = {name:name,socketId:socketId};
	userList.push(user);
	socket.send(name+"你好，你已经登录");
}
// 加入或者创建房间
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
		socketId = socket.id;
		loginOrRegister(username,socket);
	})
	// 加入房间
	socket.on("join",function(roomname){
		socketId = socket.id;
		// 加入房间之前要确保已经登录
		var user = getUser(socket.id);
		if(!user){
			socket.send("你还未登录");
			return;
		}
		// 加入房间
		joinTalkRoom(roomname,socket);
	})
	// 说话
	socket.on("talk",function(words){
		socketId = socket.id;
		var user = getUser(socket.id);
		if(!user){
			socket.send("你还未登录");
			return;
		}
		if(user.roomname){
			talk(words,socket);
		}else{
			socket.send("你不在房间不能说话");
		}
	})
	// 离开房间
	socket.on("leave",function(data){
		leaveTalkRoom(socket);
	})
})