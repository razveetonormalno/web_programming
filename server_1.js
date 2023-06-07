const express = require("express");
const http = require("http"); 
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let app = express();

mongoose.connect('mongodb://0.0.0.0:27017/timedesk', { useNewUrlParser: true, useUnifiedTopology: true })  // Подключаемся к БД
	.then(() => { // Успешное подключение
        	console.log('db connected...');
    	})
    	.catch(() => { // Подключение безуспешно
        	console.log('bad connection...');
    	});

let Medicine = mongoose.model('Medicine', new Schema({ description: String, tags: [ String ] })); // Создаем модель данных

app.use(express.static(__dirname + "/client"));
http.createServer(app).listen(3000); // Начинаем слушать запросы

app.get("/medicine.json", async (req, res) => { // Настраиваем маршрутизатор для GET-запроса
		await Medicine.find() // Выбираем все объекты модели данных
				.then((med) => { // Успешная читка
					res.json(med);
				})
				.catch((err) => { // Ошибка читки
					console.log(err);
				});
});

app.use(express.urlencoded({ extended: true }));

app.post("/medicine", async (req, res) => { // Настроиваем маршрутизатор для POST-запроса
	console.log(req.body);
	let newMed = new Medicine({"description":req.body.description, "tags":req.body.tags});
	
	const newMedicineDoc = await newMed.save() // Сохраняем (добавляем) новые данные в модель данных
			.then(async (result) => { // Данные успешно сохранены
				await Medicine.find()
					.then(async (result) => { // Успешная читка
						res.json(result);
					})
					.catch(async (err) => { // Ошибка читки
						res.send('ERROR');
					});
			})
			.catch(async (err) => { // Ошибка сохранения
				console.log(err);
				res.send('ERROR');
			});
});