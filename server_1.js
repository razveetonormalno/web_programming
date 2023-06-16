const express = require("express");
const http = require("http"); 
const mongoose = require("mongoose");
const MedicineController = require("./controller/MedicineController.js");
const UsersController = require("./controller/UserController.js");

let app = express();

http.createServer(app).listen(3000); // Начинаем слушать запросы

app.use('/', express.static(__dirname + '/client'));
app.use('/user/:username', express.static(__dirname + '/client'));

// командуем Express принять поступающие объекты JSON
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://0.0.0.0:27017/lab_9', { useNewUrlParser: true, useUnifiedTopology: true })  // Подключаемся к БД
	.then(() => { // Успешное подключение
        	console.log('db connected...');
    	})
    	.catch(() => { // Подключение безуспешно
        	console.log('bad connection...');
    	});

app.get("/medicine.json", MedicineController.index);
app.get("/medicine/:id", MedicineController.show); 
app.post("/medicine", MedicineController.create);
app.put("/medicine/:id", MedicineController.update);
app.delete("/medicine/:id", MedicineController.destroy);

app.get("/users/:username/medicine.json", MedicineController.index);
app.post("/users/:username/medicine", MedicineController.create);
app.put("/users/:username/medicine/:id", MedicineController.update);
app.delete("/users/:username/medicine/:id", MedicineController.destroy);

app.get("/users.json", UsersController.index); 
app.post("/users", UsersController.create); 
app.get("/users/:username", UsersController.show);
app.put("/users/:username", UsersController.update);
app.delete("/users/:username", UsersController.destroy);