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
const Typer = {
  text: "",
  index: 0,
  speed: 4,
  file: "Michael.txt",
  cursorVisible: true,

  init: function () {
    $.get(Typer.file)
      .done(function (data) {
        Typer.text = data;
        Typer.start();
        Typer.cursorBlink();
      })
      .fail(function () {
        $("#console").html("❌ Impossibile caricare il file: " + Typer.file);
      });
  },

  start: function () {
    Typer.timer = setInterval(Typer.type, 30);
  },

  type: function () {
    if (Typer.index > Typer.text.length) {
      clearInterval(Typer.timer);
      return;
    }

    const text = Typer.text.substring(0, Typer.index);
    const formatted = linkify(text.replace(/\n/g, "<br/>"));
    const cursor = Typer.cursorVisible ? '<span id="k">|</span>' : "";
    $("#console").html(formatted + cursor);

    Typer.index += Typer.speed;
    window.scrollBy(0, 50);
  },

  cursorBlink: function () {
    setInterval(() => {
      Typer.cursorVisible = !Typer.cursorVisible;
    }, 500);
  }
};

function linkify(text) {
  const urlRegex = /(https?:\/\/[^\s<>"']+)/g;
  return text.replace(urlRegex, url => `<a href="${url}" target="_blank">${url}</a>`);
}

function generateCascade(streamId) {
  const stream = document.getElementById(streamId);
  stream.innerHTML = "";

  const chars = "0123456789ABCDEF@#$%&";
  for (let i = 0; i < 60; i++) {
    const line = document.createElement("div");
    line.className = "cascade-line";
    line.textContent = Array.from({ length: 10 }, () =>
      chars[Math.floor(Math.random() * chars.length)]
    ).join(" ");
    line.style.animationDelay = `${Math.random() * 5}s`;
    stream.appendChild(line);
  }
}
// Aggiorna ogni 1000ms per maggiore fluidità
setInterval(() => {
  generateCascade("left-stream");
  generateCascade("right-stream");
}, 3000); // ogni 3 secondi
Typer.init();