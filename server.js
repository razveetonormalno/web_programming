var express = require("express"),
http = require("http"),
app = express(),
medicine =
[
  {
    "description": "Доктор МОМ сироп",
    "tags": [ "список", "Доктор МОМ", "сироп"]
  },

  {
    "description": "Стрепсилс таблетки для рассасывания с ментолом и эвкалиптом",
    "tags": [ "список", "Стрепсилс", "таблетки"]
  },

  {
    "description": "Vitascience ОМЕГА-3",
    "tags": [ "список", "ОМЕГА-3", "БАД" ]
  },

  {
    "description": "Novasweet заменитель сахара",
    "tags": [ "список", "Novasweet", "заменитель сахара" ]
  },

  {
    "description": "Pureplast Extra пластырь",
    "tags": [ "список", "Pureplast Extra", "пластырь"]
  }
];

app.use(express.static(__dirname + "/client"));
http.createServer(app).listen(3000);

app.get("/medicine.json", function (req, res) {
	res.json(medicine);
});

app.use(express.static(__dirname + "/client"));

app.use(express.urlencoded({ extended: true }));
app.post("/medicine", function (req, res) { // сейчас объект сохраняется в req.body
	var newMedicine = req.body;
	console.log(newMedicine);
	medicine.push(newMedicine);

	res.json(medicine); // отправляем простой объект
});

