// index.js - versione aggiornata, vanilla JS

const Typer = {
  text: "",
  file: "Michael.txt",
  index: 0,
  speed: 4,             // caratteri per tick
  typingInterval: 30,   // ms
  blinkIntervalMs: 500,
  accessCount: 0,
  deniedCount: 0,
  typingTimer: null,
  blinkTimer: null,
  consoleEl: null,

  init() {
    this.consoleEl = document.getElementById("console");
    if (!this.consoleEl) {
      console.error("Elemento #console non trovato.");
      return;
    }

    // carica il file di testo
    fetch(this.file)
      .then(resp => {
        if (!resp.ok) throw new Error("File non trovato: " + this.file);
        return resp.text();
      })
      .then(text => {
        // rimuovi eventuale newline finale indesiderato
        this.text = text.replace(/\r/g, "");
        // start typing
        this.startTyping();
      })
      .catch(err => {
        console.error("Errore fetch:", err);
        this.text = "Errore nel caricamento del file di testo.";
        this.startTyping();
      });

    // cursore lampeggiante
    this.blinkTimer = setInterval(() => this._toggleCursor(), this.blinkIntervalMs);

    // gestione tasti globali (Alt=18, CapsLock=20, Esc=27)
    window.addEventListener("keydown", (ev) => this._handleKeydown(ev));
  },

  startTyping() {
    if (this.typingTimer) clearInterval(this.typingTimer);
    this.typingTimer = setInterval(() => this._typeStep(), this.typingInterval);
  },

  _typeStep() {
    // scrive fino all'indice corrente
    if (this.index > this.text.length) {
      clearInterval(this.typingTimer);
      this._ensureNoCursorDup();
      return;
    }

    this.index += this.speed;
    if (this.index > this.text.length) this.index = this.text.length;

    const partial = this.text.substring(0, this.index)
      .replace(/\n/g, "<br/>")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // sostituisci URL con link
    this.consoleEl.innerHTML = Typer._linkify(partial);
    // assicurati che il cursore appaia (non duplicarlo)
    this._ensureCursor();
    window.scrollBy(0, 50);
  },

  _ensureCursor() {
    const html = this.consoleEl.innerHTML;
    if (!html.endsWith("|")) {
      this.consoleEl.innerHTML = html + "|";
    }
  },

  _ensureNoCursorDup() {
    // rimuove eventuale cursore duplicato finale
    if (this.consoleEl.innerHTML.endsWith("|")) {
      // non rimuovere se vuoto
    }
  },

  _toggleCursor() {
    const html = this.consoleEl.innerHTML;
    if (html.endsWith("|")) {
      this.consoleEl.innerHTML = html.slice(0, -1);
    } else {
      this.consoleEl.innerHTML = html + "|";
    }
  },

  _handleKeydown(ev) {
    // evita di bloccare le funzionalità standard come F12 (122) — come nell'originale
    if (ev.keyCode === 18) { // Alt
      this.accessCount++;
      if (this.accessCount >= 3) this._makeAccess();
    } else if (ev.keyCode === 20) { // CapsLock
      this.deniedCount++;
      if (this.deniedCount >= 3) this._makeDenied();
    } else if (ev.keyCode === 27) { // Esc
      this._hidePop();
    }
    // impediamo default solo per alcuni casi (non globalmente)
    if (ev.keyCode !== 122) ev.preventDefault?.();
  },

  _makeAccess() {
    // esempio: appendi una riga
    this._appendLine("<br/>Access granted. Welcome admin.<br/>");
  },

  _makeDenied() {
    this._appendLine("<br/>Access denied.<br/>");
  },

  _hidePop() {
    // comportamento di Esc: qui lo implemetiamo come cancellare eventuali popup/testi
    // per ora rimuoviamo gli ultimi 50 caratteri simulando 'hide'
    const current = this.consoleEl.innerHTML;
    this.consoleEl.innerHTML = current.replace(/\|$/, ""); // togli cursore se presente
  },

  _appendLine(html) {
    // rimuovi cursore, aggiungi la linea, riaggiungi cursore
    let content = this.consoleEl.innerHTML;
    if (content.endsWith("|")) content = content.slice(0, -1);
    this.consoleEl.innerHTML = content + html + "|";
    window.scrollBy(0, 50);
  },

  // semplice linkifier: trasforma http(s)://... in <a>
  _linkify(str) {
    // non abusare di regex troppo permissive; questa gestisce URL base
    return str.replace(/(https?:\/\/[^\s<]+)/g, (m) => {
      // escape
      const escaped = m.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      return `<a href="${escaped}" target="_blank" rel="noopener noreferrer">${escaped}</a>`;
    });
  }
};

// copia negli appunti (usa navigator.clipboard se disponibile)
function copyToClipboardFromSelector(selector) {
  const el = document.querySelector(selector);
  if (!el) return Promise.reject("Elemento non trovato: " + selector);
  const text = el.innerText || el.textContent || "";
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(text);
  } else {
    // fallback
    const input = document.createElement("textarea");
    input.style.position = "fixed";
    input.style.left = "-9999px";
    input.value = text;
    document.body.appendChild(input);
    input.select();
    try {
      document.execCommand("copy");
      document.body.removeChild(input);
      return Promise.resolve();
    } catch (e) {
      document.body.removeChild(input);
      return Promise.reject(e);
    }
  }
}

// inizializza al DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  Typer.init();
});