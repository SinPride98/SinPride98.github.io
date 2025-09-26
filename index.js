/*var Typer = {
    text: null,
    accessCountimer: null,
    index: 0,
    speed: 2,
    file: "",
    accessCount: 0,
    deniedCount: 0,

    init: function () {
        accessCountimer = setInterval(function () {
            Typer.updLstChr();
        }, 500);

        $.get(Typer.file, function (data) {
            Typer.text = data;
            Typer.text = Typer.text.slice(0, Typer.text.length - 1);
        });
    },

    content: function () {
        return $("#console").html();
    },

    write: function (str) {
        $("#console").append(str);
        return false;
    },

    addText: function (key) {
        if (key.keyCode == 18) {
            Typer.accessCount++;

            if (Typer.accessCount >= 3) {
                Typer.makeAccess();
            }
        } else if (key.keyCode == 20) {
            Typer.deniedCount++;

            if (Typer.deniedCount >= 3) {
                Typer.makeDenied();
            }
        } else if (key.keyCode == 27) {
            Typer.hidepop();
        } else if (Typer.text) {
            var cont = Typer.content();
            if (cont.substring(cont.length - 1, cont.length) == "|")
                $("#console").html($("#console").html().substring(0, cont.length - 1));

            if (key.keyCode != 8) {
                Typer.index += Typer.speed;
            } else {
                if (Typer.index > 0) Typer.index -= Typer.speed;
            }

            var text = Typer.text.substring(0, Typer.index);
            var rtn = new RegExp("\n", "g");

            // usa linkify() per rendere cliccabili gli URL
            $("#console").html(linkify(text.replace(rtn, "<br/>")));

            window.scrollBy(0, 50);
        }

        if (key.preventDefault && key.keyCode != 122) {
            key.preventDefault();
        }

        if (key.keyCode != 122) {
            key.returnValue = false;
        }
    },

    updLstChr: function () {
        var cont = this.content();

        if (cont.substring(cont.length - 1, cont.length) == "|")
            $("#console").html($("#console").html().substring(0, cont.length - 1));
        else this.write("|");
    }
};

// 🔗 funzione per trasformare i link in <a>
function linkify(text) {
    let urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, function (url) {
        return '<a href="' + url + '" target="_blank">' + url + '</a>';
    });
}

Typer.speed = 4;
Typer.file = "Michael.txt";
Typer.init();

var timer = setInterval("t();", 30);
function t() {
    Typer.addText({ keyCode: 123748 });

    if (Typer.index > Typer.text.length) {
        clearInterval(timer);
    }
}

function copyToClipboard(element) {
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val($(element).text()).select();
    document.execCommand("copy");
    $temp.remove();
}*/
var Typer = {
    text: "",
    index: 0,
    speed: 4,
    file: "Michael.txt",

    init: function () {
        // carica il file di testo
        $.get(Typer.file, function (data) {
            Typer.text = data;
            Typer.start();
        });
    },

    start: function () {
        // avvia il timer di scrittura
        Typer.timer = setInterval(Typer.type, 30);
    },

    type: function () {
        if (Typer.index > Typer.text.length) {
            clearInterval(Typer.timer);
            return;
        }

        var text = Typer.text.substring(0, Typer.index);
        var rtn = new RegExp("\n", "g");

        // trasforma newline + link cliccabili
        $("#console").html(linkify(text.replace(rtn, "<br/>")));

        Typer.index += Typer.speed;
        window.scrollBy(0, 50);
    }
};

// 🔗 funzione che rende cliccabili i link
function linkify(text) {
    let urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, function (url) {
        return '<a href="' + url + '" target="_blank">' + url + '</a>';
    });
}

// avvia subito
Typer.init();