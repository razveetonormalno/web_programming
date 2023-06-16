function getUrlName() {
	const paramsString = new URLSearchParams(document.location.href);
		var searchParams = new URLSearchParams(paramsString);
		
		for(var pair of searchParams.entries()) {
		   urlName = pair[0].replace("http://localhost:3000/users/", "");
		   urlName = urlName.replace("/", "");
		   console.log(urlName);
		   break;
		}
}

var organizeByTags = function (MedicineObjects) { 
	// создание пустого массива для тегов
	var tags = [];
	// перебираем все элементы Medicine 
	MedicineObjects.forEach(function (med) {
		// перебираем все теги для каждого лекарства 
		med.tags.forEach(function (tag) {
			// убеждаемся, что этого тега еще нет в массиве
			if (tags.indexOf(tag) === -1) { 
				tags.push(tag);
			}
		});
	}); 
	var tagObjects = tags.map(function (tag) {
		// здесь мы находим все лекарства,
		// содержащие этот тег
		var MedsWithTag = []; 
		MedicineObjects.forEach(function (med) {
			// проверка, что результат
			// indexOf is *не* равен -1
			if (med.tags.indexOf(tag) !== -1) { 
				MedsWithTag.push(med.description);
			}
		});
		// мы связываем каждый тег с объектом, который содержит название тега и массив
		return { "name": tag, "meds": MedsWithTag };
	});
	return tagObjects;
};

var liaWithEditOrDeleteOnClick = function (medicine, callback) {
	var $medListItem = $("<li>").text(medicine.description),
		$medEditLink = $("<a>").attr("style", 'padding: 3px; margin-left: 10px;').attr("href", "medicine/" + medicine._id),
		$medRemoveLink = $("<a>").attr("style", 'padding: 3px; margin-left: 30px;').attr("href", "medicine/" + medicine._id);

	//$todoEditLink.addClass("linkEdit");
	//$todoRemoveLink.addClass("linkRemove");

	$medRemoveLink.text(" Удалить");
	$medRemoveLink.on("click", function () {
		$.ajax({
			url: "/medicine/" + medicine._id,
			type: "DELETE"
		}).done(function (responde) {
			callback();
		}).fail(function (err) {
			console.log("error on delete 'medicine'!");
		});
		return false;
	});
	$medListItem.append($medRemoveLink);

	$medEditLink.text(" Редактировать");
	$medEditLink.on("click", function() {
		var newDescription = prompt("Введите новое наименование лекарства", medicine.description);
		if (newDescription !== null && newDescription.trim() !== "") {
			$.ajax({
				"url": "/medicine/" + medicine._id,
				"type": "PUT",
				"data": { "description": newDescription },
			}).done(function (responde) {
				callback();
			}).fail(function (err) {
				console.log("Произошла ошибка: " + err);
			});
		}
		return false;
	});
	$medListItem.append($medEditLink);

	return $medListItem;
}

var main = function (MedicineObjects) {
	"use strict";
	// создание пустого массива с вкладками
	var tabs = [];
	// добавляем вкладку Новые
	tabs.push({
		"name": "Новые",
		// создаем функцию content
		// так, что она принимает обратный вызов
		"content": function(callback) {
			$.getJSON("http://localhost:3000/medicine/" + urlName, function (MedicineObjects) {
				var $content = $("<ul>");
				for (var i = MedicineObjects.length-1; i>=0; i--) {
					var $medListItem = liaWithEditOrDeleteOnClick(MedicineObjects[i], function() {
						$(".tabs a:first-child span").trigger("click");
					});
					$content.append($medListItem);
				}
				callback(null, $content);
			}).fail(function (jqXHR, textStatus, error) {
				callback(error, null);
			});
		}
	});

	// добавляем вкладку Старые
	tabs.push({
		"name": "Старые",
		"content": function(callback) {
			$.getJSON("http://localhost:3000/medicine/" + urlName, function (MedicineObjects) {
				var $content,
					i;
				$content = $("<ul>");
				for (i = 0; i < MedicineObjects.length; i++) {
					var $medListItem = liaWithEditOrDeleteOnClick(MedicineObjects[i], function() {
						$(".tabs a:nth-child(2) span").trigger("click");
					});
					$content.append($medListItem);
				}
				callback(null, $content);
			}).fail(function(jqXHR, textStatus, error) {
				callback(error, null);
			});
		}
	});

	// добавляем вкладку Теги
	tabs.push({
		"name": "Теги",
		"content":function (callback) {
			$.get("http://localhost:3000/medicine/" + urlName, function (MedicineObjects) {	
				// создание $content для Теги 
				var organizedByTag = organizeByTags(MedicineObjects),
					$content;
				organizedByTag.forEach(function (tag) {
					var $tagName = $("<h3>").text(tag.name);
						$content = $("<ul>");
					tag.meds.forEach(function (description) {
						var $li = $("<li>").text(description);
						$content.append($li);
					});
					$("main .content").append($tagName);
					$("main .content").append($content);
				});
				callback(null,$content);
			}).fail(function (jqXHR, textStatus, error) {
				// в этом случае мы отправляем ошибку вместе с null для $content
				callback(error, null);
			});
		}
	});

	// создаем вкладку Добавить
	tabs.push({
		"name": "Добавить",
		"content":function () {
			$.get("http://localhost:3000/medicine/" + urlName, function (MedicineObjects) {	
				// создание $content для Добавить 
				var $textInput = $("<h3>").text("Введите новое лекарство: "),
					$input = $("<input>"),//.addClass("description"), 
					$textTag = $("<h3>").text("Тэги: "),
					$tagInput = $("<input>"),//.addClass("tags"),
					$button = $("<button>").text("Добавить"),
					$content1 = $("<ul>"), $content2 = $("<ul>");

				$content1.append($input);
				$content2.append($tagInput);

				$("main .content").append($textInput);
				$("main .content").append($content1);
				$("main .content").append($textTag);
				$("main .content").append($content2);
				$("main .content").append($button); 
				
				function btnfunc() {
					var description = $input.val(),
						tags = $tagInput.val().split(","),
						// создаем новый элемент списка лекарств
						newMedicine = {"description":description, "tags":tags};
					$.post("medicine", newMedicine, function(result) {
						$input.val("");
						$tagInput.val("");
						$(".tabs a:first-child span").trigger("click");
					});
				}
				$button.on("click", function() {
					btnfunc();
				});
				$('.tags').on('keydown',function(e){
					if (e.which === 13) {
						btnfunc();
					}
				});
			});
		}
	});

	tabs.forEach(function (tab) {
		var $aElement = $("<a>").attr("href",""),
			$spanElement = $("<span>").text(tab.name);
		$aElement.append($spanElement);
		$("main .tabs").append($aElement);

		$spanElement.on("click", function () {
			var $content;
			$(".tabs a span").removeClass("active");
			//$spanElement.addClass("active");
			$("main .content").empty();
			tab.content(function (err, $content) {
				if (err !== null) {
					alert ("Возникла проблема при обработке запроса: " + err);
				} else {
					$("main .content").append($content);
				}
			});
			return false;
		});
	});

	$(".tabs a:first-child span").trigger("click");
}

let urlName = "";

getUrlName();

$(document).ready(function() {
	$.getJSON("http://localhost:3000/medicine/" + urlName, function (MedicineObjects) {
		main(MedicineObjects);
	});
});