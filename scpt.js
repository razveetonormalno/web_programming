var $content;

var main = function () {
    "use strict";

    var medicine = [
        "Доктор МОМ сироп",
        "Стрепсилс таблетки для рассасывания с ментолом и эвкалиптом",
        "Vitascience ОМЕГА-3",
        "Vitascience L-карнитин таблетки",
        "Novasweet заменитель сахара",
        "Pureplast Extra пластырь"
    ];

    setTimeout(function() {
        $('.active').trigger('click');
    });

    $(".tabs a span").toArray().forEach(function (element) {
        $(element).on("click", function () {
            var $element = $(element);
            $("main .content").empty();
            if ($element.parent().is(":nth-child(1)")) {
                $content = $("<ul>");
                for (var i = medicine.length - 1; i > -1; i--) {
                    $content.append($("<li>").text(medicine[i]));
                }
                $("main .content").append($content);
            } else if ($element.parent().is(":nth-child(2)")) {
                $content = $("<ul>");
                medicine.forEach(function (todo) {
                    $content.append($("<li>").text(todo));
                });
                $("main .content").append($content);
            } else if ($element.parent().is(":nth-child(3)")) {
                $(".content").append("<input id=add-btn>");
                $(".content").append("<br/>");
                $(".content").append("<button>Добавить</button>");
                $(".content input").addClass("inputStyle");
                $(".content br").addClass("clear");
                $(".content button").addClass("buttonStyle");
            }

            return false;
        });
    });

    $(".content").on("click", ".buttonStyle", function() {
        if ($(".inputStyle").val() != "") {
            medicine.push($(".inputStyle").val());
            alert("Элемент успешно добавлен!");
            document.getElementById('add-btn').value = "";
        } else {
            alert("ОШИБКА: Текстовое поле пусто!")
        }
    });
};

$(document).ready(main);

