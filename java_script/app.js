function loadBody() {
	$(document).ready(main);
}

var main = function () {
	"use strict";
	var url = "";
	var arrImg = [];
	var indImg = 0;
	var s = "1";
	var displayImg = function (indImg) {
		var $img = $("#newPicture").hide();
		$("main .photos").empty();
		$img.attr("src", arrImg[indImg]);
		$("main .photos").append($img);
		$img.fadeIn();
		setTimeout(function () {
			indImg++;
			console.log(indImg);
			if (indImg > arrImg.length - 1)
				return;
			displayImg(indImg);
			$img.css('visibility', 'visible');
		}, 3000);
	};
	$("button").on("click", function () {
		url = "http://api.flickr.com/services/feeds/photos_public.gne?tags="+
			$("input").val()+"&format=json&jsoncallback=?";
		console.log(url);
		arrImg = [];
		$.getJSON(url, function (flickrResponse) {
			flickrResponse.items.forEach(function (item) {
				arrImg.push(item.media.m);
			});
		});
		console.log(arrImg);
		displayImg(0);
	});
};
