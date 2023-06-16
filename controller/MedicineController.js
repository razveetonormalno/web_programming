let Med = require("../models/medicine.js");
let User = require("../models/user.js");
let MedicineController = {};

MedicineController.index = async function (req, res) {
	console.log("Вызван MedicineController.index");
	
	let username = req.params.username || null;
	let respondWithMeds;
	
	respondWithMeds = async function (query) { 
		await Med.find()
			.then(async (meds) => {
				res.status(200).json(meds);
			})
			.catch(async (err) => {
				res.json(500, err);
			});
	};

	if (username !== null) {
		console.log("Поиск пользователя: " + username);

		await User.find({"username": username})
			.then(async (err, result) => {
				if (result.length === 0) {
					res.status(404).json({"result_length": 0});
				} else {
					respondWithMeds({"owner": result[0]._id});
				}
			})
			.catch(async (err, result) => {
				res.json(500, err);
			});
	} else {
		respondWithMeds({});
	}
};

MedicineController.create = async function (req, res) {
	var username = req.params.username || null;
	var newMed = new Med({
		"description": req.body.description,
		"tags": req.body.tags
	});

	console.log("вызвано действие: MedicineController.create");
	console.log("username: " + username);

	await User.find({"username": username})
		.then(async (result) => {
			if (result.length === 0) {
				newMed.owner = null;
			} else {
				newMed.owner = result[0]._id;
			}
			await newMed.save()
				.then(async (result) => {
					res.status(200).json(result);
					console.log("New data: " + result);
				})
				.catch(async (err) => {
					console.log(err);
					res.json(500, err);
				});
		})
		.catch(async (err, result) => {
			res.send(500);
		});
};

MedicineController.show = async function (req, res) {
	// это ID, который мы отправляем через URL
	console.log("вызвано действие: MedicineController.show");
	var id = req.params.id;

	let userResultId;
	
	await User.find({"username":id})
		.then(async (result) => {
			userResultId = JSON.parse(JSON.stringify(result))[0]._id;
		})
		.catch(async (err) => {
			res.status(500).json(err);
		});

	// находим элемент списка задач с соответствующим ID 
	await Med.find({"owner":userResultId})
		.then(async (med) => {
			res.status(200).json(med);

		})
		.catch(async (err) => {
			res.status(500).json(err);
		});
};

MedicineController.destroy = async function (req, res) {
	console.log("вызвано действие: MedicineController.destroy");
	var id = req.params.id;

	await Med.deleteOne({"_id": id})
		.then(async (todo) => {
			res.status(200).json(todo);
		})
		.catch(async (err) => {
			res.status(500).json(err);
		});
}

MedicineController.update = async function (req, res) {
	console.log("вызвано действие: MedicineController.update");

	var id = req.params.id;
	var newDescription = {$set: {description: req.body.description}};

	await Med.updateOne({"_id": id}, newDescription)
		.then(async (todo) => {
			res.status(200).json(todo);
			console.log("New data:" + todo);
		})
		.catch(async (err) => {
			res.status(500).json(err);
		});
}

module.exports = MedicineController;