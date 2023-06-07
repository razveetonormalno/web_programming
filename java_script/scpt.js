var $content;

function organizeByTags(medicineObjects) {
    var medDescription = medicineObjects.map(function (med) {
        return med.description;
    });

    var medTags = medicineObjects.map(function (med) {
        return med.tags;
    });

    var sTags = function(name, med) {
        this.name = name;
        this.med = med;
    }

    var array = [];

    for (var i = 0; i < medDescription.length; i++) {
        var x = new sTags(medDescription[i], medTags[i]);
        array.push(x);
    }

    let json = JSON.stringify(array);
    json = JSON.parse(json);

    return json;
}

function convertToTags(obj) {
    var newMedDescription = obj.map(function (newMed) {
        return newMed.description;
    });

    var newMedTags = obj.map(function (med) {
        return med.tags;
    });

    var newTags = function(name, med) {
        this.name = name;
        this.med = med;
    }

    var newArray = [];
    var arrayTags = [];
    var strTag = '';
    var array = [];

    for (var i = 0; i < newMedTags.length; i++) {
        for (var j = 0; j < newMedTags[i].length; j++) {
            if (arrayTags.indexOf(newMedTags[i][j]) == -1) {
                arrayTags.push(newMedTags[i][j]);
                strTag = newMedTags[i][j];
                for (var k = 0; k < newMedDescription.length; k++) {
                    if (newMedTags[k].indexOf(newMedTags[i][j]) != -1) {
                        newArray.push(newMedDescription[k]);
                    }
                }

                var x = new newTags(strTag, newArray);
                newArray = [];
                array.push(x);
            }
        }
    }

    let json = JSON.stringify(array);
    json = JSON.parse(json);

    return json;
}

var main = function(medicineObjects) {
    "use strict";

    var organizedByTagNewOld = organizeByTags(medicineObjects);
    var organizedByTag = convertToTags(medicineObjects);

    setTimeout(function() {
        $('#new').trigger('click');
    });

    $(".tabs a span").toArray().forEach(function (element) {
        $(element).on("click", function () {
            var organizedByTagNewOld = organizeByTags(medicineObjects);
            var organizedByTag = convertToTags(medicineObjects);
            var $element = $(element);
            $("main .content").empty();
            if ($element.parent().is(":nth-child(1)")) {
                $content = $("<ul>");
                for (var i = organizedByTagNewOld.length - 1; i > -1; i--) {
                    $content.append($("<li>").text(organizedByTagNewOld[i].name));
                }
                $("main .content").append($content);
            } else if ($element.parent().is(":nth-child(2)")) {
                $content = $("<ul>");
                organizedByTagNewOld.forEach(function (med) {
                    $content.append($("<li>").text(med.name));
                });
                $("main .content").append($content);
            } else if ($element.parent().is(":nth-child(3)")) {
                organizedByTag.forEach(function (tag) { 
                    var $tagName = $("<h3>").text(tag.name),
                    $content = $("<ul>");
                    tag.med.forEach(function (description) {
                        var $li = $("<li>").text(description);
                        $content.append($li);
                    });
                    $("main .content").append($tagName);
                    $("main .content").append($content);
                });
            } else if ($element.parent().is(":nth-child(4)")) {
                $(".content").append("<input id='description' style='margin-bottom: 15px;'>");
				$(".content #description").addClass("inputStyle");
				$(".content").append("<br />");
				$(".content").append("<input id='tags'>");
				$(".content #tags").addClass("inputStyle");
				$(".content").append("<br />");
				$(".content").append("<button id='push'>Добавить</button>");
				$(".content br").addClass("clear");
				$(".content button").addClass("buttonStyle");
            }

            return false;
        });
    });

    $(".content").on("click", ".buttonStyle", function() {
        var newDescription = $("#description").val();
        var newTags = $("#tags").val().replace(/\s/g, "").split(',');

        var newMed = {
            "description": newDescription,
            "tags": newTags
        };  

        $.post("medicine", newMed, function (result) {
            // alert(result);

            medicineObjects.push(newMed);

            organizedByTag = organizeByTags(medicineObjects);

            $("#description").val("");
            $("#tags").val("");
        });
    });
}

function loadBody() {
    $(document).ready(function() {
        $.getJSON("json/medicine.json", function(medicineObjects) {
            main(medicineObjects);
        });
    });
}

