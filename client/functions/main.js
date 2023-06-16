var main = function (UsersObjects) {
	"use strict";
	var $input = $("<input>").addClass("inputStyle"),
		$butLogin = $("<button>").text("Войти в аккаунт").addClass("buttonUser")

	$butLogin.on("click", function() {
		var username = $input.val();
		if (username !== null && username.trim() !== "") {
			var loginUser = {"username": username};
			$.ajaxSetup({ cache: false });
			$.ajax({
				'url': '/users/'+username,
				'type': 'GET'
			}).done(function(responde) {
				window.location.replace('users/' + username + '/');
			}).fail(function(jqXHR, textStatus, error) {
				console.log(error);
				alert("Произошла ошибка!\n"+jqXHR.status + " " + jqXHR.textStatus);	
			});
		}
	});

	$("main .centerInfo .authorization").append($input);
	$("main .centerInfo .logOrRegRefBlock").append($butLogin);

}

$(document).ready(function() {
	$.getJSON("users.json", function (UsersObjects) {
		main(UsersObjects);
	});
});