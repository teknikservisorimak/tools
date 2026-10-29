/*!
 * ORİ Asistan — sitedeki yapay zekâ sohbet kutusu
 * Kullanım (sayfanın </body> etiketinden hemen önce):
 *   <script src="ori-asistan.js" data-endpoint="https://ori-asistan.<hesap>.workers.dev" defer></script>
 * Tema (orimak_theme) ve dil (orimak_i18n_lang) diğer ORİMAK sayfalarıyla ortaktır.
 */
(function () {
  "use strict";
  if (window.__oriAsistan) return;
  window.__oriAsistan = true;

  var script = document.currentScript || document.querySelector('script[src*="ori-asistan"]');
  var ENDPOINT = (script && script.getAttribute("data-endpoint")) || window.ORI_ASISTAN_URL || "https://ori-asistan.teknikservisorimak.workers.dev";
  var STORE = "ori_asistan_chat";

  var T = {
    tr: { title: "ORİ Asistan", sub: "Yapay zekâ destekli yardımcı", hello: "Merhaba, ben **ORİ**! 👋 Sitedeki araçlar, FEFCO kutu tipleri veya koli hesapları hakkında sorabilirsin.", ph: "Bir soru yazın…", send: "Gönder", open: "ORİ'ye sor", close: "Kapat", clear: "Sohbeti temizle", think: "ORİ düşünüyor…", err: "Şu an yanıt veremiyorum, lütfen biraz sonra tekrar deneyin.", rate: "Çok hızlı soru geldi 🙂 Lütfen bir dakika bekleyin.", noep: "Asistan henüz yapılandırılmadı.", note: "Yapay zekâ hata yapabilir. Kişisel bilgi paylaşmayın.", q: ["Hangi araç ne işe yarar?", "Karton eni nasıl hesaplanır?", "FEFCO 0201 nedir?"] },
    en: { title: "ORİ Assistant", sub: "AI-powered helper", hello: "Hi, I'm **ORİ**! 👋 Ask me about the tools on this site, FEFCO box styles or box calculations.", ph: "Type a question…", send: "Send", open: "Ask ORİ", close: "Close", clear: "Clear chat", think: "ORİ is thinking…", err: "I can't answer right now, please try again shortly.", rate: "Too many questions at once 🙂 Please wait a minute.", noep: "The assistant is not configured yet.", note: "AI can make mistakes. Don't share personal data.", q: ["What does each tool do?", "How is board width calculated?", "What is FEFCO 0201?"] },
    de: { title: "ORİ Assistent", sub: "KI-gestützter Helfer", hello: "Hallo, ich bin **ORİ**! 👋 Frag mich zu den Werkzeugen, FEFCO-Kartontypen oder Kartonberechnungen.", ph: "Frage eingeben…", send: "Senden", open: "ORİ fragen", close: "Schließen", clear: "Chat leeren", think: "ORİ denkt nach…", err: "Ich kann gerade nicht antworten, bitte später erneut versuchen.", rate: "Zu viele Fragen 🙂 Bitte eine Minute warten.", noep: "Der Assistent ist noch nicht eingerichtet.", note: "KI kann Fehler machen. Keine persönlichen Daten teilen.", q: ["Was macht welches Werkzeug?", "Wie wird die Kartonbreite berechnet?", "Was ist FEFCO 0201?"] },
    fr: { title: "Assistant ORİ", sub: "Assistant propulsé par l'IA", hello: "Bonjour, je suis **ORİ** ! 👋 Posez-moi vos questions sur les outils, les types FEFCO ou les calculs de caisses.", ph: "Écrivez une question…", send: "Envoyer", open: "Demander à ORİ", close: "Fermer", clear: "Effacer", think: "ORİ réfléchit…", err: "Je ne peux pas répondre pour le moment, réessayez bientôt.", rate: "Trop de questions 🙂 Merci de patienter une minute.", noep: "L'assistant n'est pas encore configuré.", note: "L'IA peut se tromper. Ne partagez pas de données personnelles.", q: ["À quoi sert chaque outil ?", "Comment calculer la laize ?", "Qu'est-ce que FEFCO 0201 ?"] },
    es: { title: "Asistente ORİ", sub: "Ayudante con IA", hello: "¡Hola, soy **ORİ**! 👋 Pregúntame sobre las herramientas, los tipos FEFCO o los cálculos de cajas.", ph: "Escribe una pregunta…", send: "Enviar", open: "Preguntar a ORİ", close: "Cerrar", clear: "Borrar chat", think: "ORİ está pensando…", err: "No puedo responder ahora, inténtalo de nuevo en breve.", rate: "Demasiadas preguntas 🙂 Espera un minuto.", noep: "El asistente aún no está configurado.", note: "La IA puede equivocarse. No compartas datos personales.", q: ["¿Para qué sirve cada herramienta?", "¿Cómo se calcula el ancho de cartón?", "¿Qué es FEFCO 0201?"] },
    ar: { title: "مساعد ORİ", sub: "مساعد بالذكاء الاصطناعي", hello: "مرحباً، أنا **ORİ**! 👋 اسألني عن أدوات الموقع أو أنواع صناديق FEFCO أو حسابات الكرتون.", ph: "اكتب سؤالاً…", send: "إرسال", open: "اسأل ORİ", close: "إغلاق", clear: "مسح المحادثة", think: "ORİ يفكر…", err: "لا أستطيع الرد الآن، يرجى المحاولة لاحقاً.", rate: "أسئلة كثيرة 🙂 يرجى الانتظار دقيقة.", noep: "المساعد غير مهيأ بعد.", note: "قد يخطئ الذكاء الاصطناعي. لا تشارك بيانات شخصية.", q: ["ما وظيفة كل أداة؟", "كيف يُحسب عرض الكرتون؟", "ما هو FEFCO 0201؟"] }
  };

  function lang() {
    var l = "tr";
    try { l = localStorage.getItem("orimak_i18n_lang") || "tr"; } catch (e) {}
    return T[l] ? l : "tr";
  }
  function t(k) { return T[lang()][k]; }

  var css = "" +
    ".oa-root{--oa-acc:#F39200;--oa-bg:#1b1b1d;--oa-fg:#f2f2f2;--oa-mut:#a7a7ad;--oa-line:rgba(255,255,255,.1);--oa-me:#F39200;--oa-meFg:#1a1a1a;--oa-bot:#2a2a2e;" +
    "position:fixed;z-index:2147483000;inset:auto 20px 20px auto;font-family:'Plus Jakarta Sans',system-ui,-apple-system,'Segoe UI',sans-serif;}" +
    ":root[data-theme=light] .oa-root{--oa-bg:#ffffff;--oa-fg:#232323;--oa-mut:#6b6b70;--oa-line:rgba(0,0,0,.1);--oa-bot:#f3f1ee;}" +
    "body[dir=rtl] .oa-root{inset:auto auto 20px 20px;}" +
    ".oa-fab{display:flex;align-items:center;gap:10px;border:0;cursor:pointer;background:var(--oa-acc);color:#1a1a1a;font:800 15px/1 inherit;font-family:inherit;padding:8px 18px 8px 8px;border-radius:999px;box-shadow:0 10px 30px rgba(0,0,0,.35);transition:transform .2s;}" +
    ".oa-fab:hover{transform:translateY(-2px);} .oa-fab svg{width:40px;height:40px;flex:none;}" +
    "body[dir=rtl] .oa-fab{padding:8px 8px 8px 18px;}" +
    ".oa-root.open .oa-fab{display:none;}" +
    ".oa-panel{display:none;flex-direction:column;width:min(380px,calc(100vw - 24px));height:min(580px,calc(100vh - 40px));background:var(--oa-bg);color:var(--oa-fg);border:1px solid var(--oa-line);border-radius:20px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,.45);}" +
    ".oa-root.open .oa-panel{display:flex;animation:oaIn .25s cubic-bezier(.34,1.56,.64,1);}" +
    "@keyframes oaIn{from{opacity:0;transform:translateY(16px) scale(.97)}to{opacity:1;transform:none}}" +
    ".oa-head{display:flex;align-items:center;gap:10px;padding:12px 12px 12px 14px;border-bottom:1px solid var(--oa-line);}" +
    ".oa-head svg{width:38px;height:38px;flex:none;} .oa-ht{flex:1;min-width:0;} .oa-ht b{display:block;font-size:15px;} .oa-ht span{font-size:12px;color:var(--oa-mut);}" +
    ".oa-ib{border:0;background:none;color:var(--oa-mut);cursor:pointer;width:34px;height:34px;border-radius:10px;font-size:17px;line-height:1;} .oa-ib:hover{background:var(--oa-line);color:var(--oa-fg);}" +
    ".oa-msgs{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px;scroll-behavior:smooth;}" +
    ".oa-m{max-width:86%;padding:10px 13px;border-radius:16px;font-size:14px;line-height:1.5;word-wrap:break-word;white-space:pre-wrap;}" +
    ".oa-m.bot{align-self:flex-start;background:var(--oa-bot);border-bottom-left-radius:5px;}" +
    ".oa-m.me{align-self:flex-end;background:var(--oa-me);color:var(--oa-meFg);border-bottom-right-radius:5px;}" +
    "body[dir=rtl] .oa-m.bot{align-self:flex-end;} body[dir=rtl] .oa-m.me{align-self:flex-start;}" +
    ".oa-m a{color:var(--oa-acc);font-weight:700;} .oa-m.me a{color:inherit;}" +
    ".oa-m.err{background:rgba(220,60,60,.15);color:#ff8f8f;} :root[data-theme=light] .oa-m.err{color:#b02020;}" +
    ".oa-dots span{display:inline-block;width:7px;height:7px;margin:0 2px;border-radius:50%;background:var(--oa-mut);animation:oaDot 1.2s infinite;}" +
    ".oa-dots span:nth-child(2){animation-delay:.15s}.oa-dots span:nth-child(3){animation-delay:.3s}" +
    "@keyframes oaDot{0%,60%,100%{opacity:.3;transform:none}30%{opacity:1;transform:translateY(-4px)}}" +
    ".oa-q{display:flex;flex-wrap:wrap;gap:6px;padding:0 14px 10px;} .oa-q button{border:1px solid var(--oa-line);background:none;color:var(--oa-fg);font:600 12.5px/1.2 inherit;font-family:inherit;padding:7px 11px;border-radius:999px;cursor:pointer;} .oa-q button:hover{border-color:var(--oa-acc);color:var(--oa-acc);}" +
    ".oa-form{display:flex;gap:8px;padding:10px 12px 6px;border-top:1px solid var(--oa-line);}" +
    ".oa-in{flex:1;resize:none;border:1px solid var(--oa-line);background:transparent;color:var(--oa-fg);font:14px/1.4 inherit;font-family:inherit;padding:10px 12px;border-radius:14px;max-height:110px;outline:none;} .oa-in:focus{border-color:var(--oa-acc);}" +
    ".oa-send{border:0;background:var(--oa-acc);color:#1a1a1a;width:42px;border-radius:14px;cursor:pointer;flex:none;} .oa-send:disabled{opacity:.45;cursor:default;} .oa-send svg{width:20px;height:20px;}" +
    "body[dir=rtl] .oa-send svg{transform:scaleX(-1);}" +
    ".oa-note{font-size:11px;color:var(--oa-mut);text-align:center;padding:0 12px 10px;}" +
    "@media (max-width:480px){.oa-root{inset:auto 12px 12px auto;} body[dir=rtl] .oa-root{inset:auto auto 12px 12px;} .oa-fab span{display:none;} .oa-fab{padding:8px;}}" +
    "@media print{.oa-root{display:none!important;}}";

  var face = '<svg viewBox="0 0 100 100" aria-hidden="true"><rect x="12" y="18" width="76" height="72" rx="22" fill="#FFC266"/><rect x="12" y="18" width="76" height="72" rx="22" fill="#F39200" opacity=".55"/>' +
    '<path d="M24 20 L48 20 L42 6 L28 9Z M52 20 L76 20 L72 9 L58 6Z" fill="#FFC266"/>' +
    '<ellipse cx="38" cy="50" rx="7" ry="9" fill="#232323"/><ellipse cx="62" cy="50" rx="7" ry="9" fill="#232323"/><circle cx="40" cy="47" r="2.4" fill="#fff"/><circle cx="64" cy="47" r="2.4" fill="#fff"/>' +
    '<path d="M40 66 Q50 75 60 66" stroke="#232323" stroke-width="4.5" fill="none" stroke-linecap="round"/></svg>';
  var sendIco = '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M231.87,114l-168-95.89A16,16,0,0,0,40.92,37.34L71.55,128,40.92,218.67A16,16,0,0,0,56,240a16.15,16.15,0,0,0,7.93-2.1l167.92-96.05a16,16,0,0,0,0-27.89ZM56,224a.56.56,0,0,0,0-.12L85.74,136H144a8,8,0,0,0,0-16H85.74L56.06,32.16A.46.46,0,0,0,56,32l168,95.83Z"/></svg>';

  var style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  var root = document.createElement("div");
  root.className = "oa-root";
  root.innerHTML =
    '<button type="button" class="oa-fab">' + face + '<span class="oa-fab-t"></span></button>' +
    '<section class="oa-panel" role="dialog" aria-modal="false">' +
      '<header class="oa-head">' + face + '<div class="oa-ht"><b class="oa-title"></b><span class="oa-sub"></span></div>' +
        '<button type="button" class="oa-ib oa-clear">⟲</button><button type="button" class="oa-ib oa-close">✕</button></header>' +
      '<div class="oa-msgs" aria-live="polite"></div>' +
      '<div class="oa-q"></div>' +
      '<form class="oa-form"><textarea class="oa-in" rows="1" maxlength="1200"></textarea><button type="submit" class="oa-send">' + sendIco + '</button></form>' +
      '<div class="oa-note"></div>' +
    '</section>';

  var $ = function (s) { return root.querySelector(s); };
  var fab = $(".oa-fab"), msgsEl = $(".oa-msgs"), qEl = $(".oa-q"), form = $(".oa-form"), input = $(".oa-in"), sendBtn = $(".oa-send");

  var history = [];
  try { history = JSON.parse(sessionStorage.getItem(STORE) || "[]"); } catch (e) { history = []; }
  var busy = false;

  function save() { try { sessionStorage.setItem(STORE, JSON.stringify(history.slice(-30))); } catch (e) {} }

  function esc(s) { return s.replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function md(s) {
    s = esc(s);
    s = s.replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>");
    s = s.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    s = s.replace(/(^|[\s(])(https?:\/\/[^\s<)]+[^\s<).,!?;:])/g, '$1<a href="$2" target="_blank" rel="noopener">$2</a>');
    s = s.replace(/^\s*[-*] /gm, "• ");
    return s;
  }

  function bubble(role, text, cls) {
    var d = document.createElement("div");
    d.className = "oa-m " + (role === "user" ? "me" : "bot") + (cls ? " " + cls : "");
    d.innerHTML = role === "user" ? esc(text) : md(text);
    msgsEl.appendChild(d);
    msgsEl.scrollTop = msgsEl.scrollHeight;
    return d;
  }

  function renderAll() {
    msgsEl.innerHTML = "";
    bubble("assistant", t("hello"));
    history.forEach(function (m) { bubble(m.role, m.text); });
    qEl.style.display = history.length ? "none" : "";
  }

  function applyTexts() {
    $(".oa-fab-t").textContent = t("open");
    fab.setAttribute("aria-label", t("open"));
    $(".oa-title").textContent = t("title");
    $(".oa-sub").textContent = t("sub");
    $(".oa-close").setAttribute("aria-label", t("close")); $(".oa-close").title = t("close");
    $(".oa-clear").setAttribute("aria-label", t("clear")); $(".oa-clear").title = t("clear");
    $(".oa-panel").setAttribute("aria-label", t("title"));
    input.placeholder = t("ph");
    sendBtn.setAttribute("aria-label", t("send"));
    $(".oa-note").textContent = t("note");
    qEl.innerHTML = "";
    t("q").forEach(function (q) {
      var b = document.createElement("button");
      b.type = "button"; b.textContent = q;
      b.onclick = function () { ask(q); };
      qEl.appendChild(b);
    });
    renderAll();
  }

  function open() { root.classList.add("open"); setTimeout(function () { input.focus(); }, 50); }
  function close() { root.classList.remove("open"); fab.focus(); }

  function ask(text) {
    text = (text || "").trim();
    if (!text || busy) return;
    if (!ENDPOINT) { bubble("assistant", t("noep"), "err"); return; }
    busy = true; sendBtn.disabled = true; qEl.style.display = "none";
    history.push({ role: "user", text: text.slice(0, 1200) });
    save();
    bubble("user", text);
    input.value = ""; autoGrow();
    var wait = bubble("assistant", "");
    wait.innerHTML = '<span class="oa-dots" aria-label="' + esc(t("think")) + '"><span></span><span></span><span></span></span>';

    var page = (location.pathname.split("/").pop() || "index").replace(/\.html$/, "") || "index";
    var ctrl = new AbortController();
    var timer = setTimeout(function () { ctrl.abort(); }, 30000);

    fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: history.slice(-12), page: page, lang: lang() }),
      signal: ctrl.signal
    }).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (d) { return { status: r.status, d: d }; });
    }).then(function (res) {
      if (res.status === 200 && res.d.reply) {
        history.push({ role: "assistant", text: res.d.reply });
        save();
        wait.innerHTML = md(res.d.reply);
      } else {
        history.pop(); save();
        wait.classList.add("err");
        wait.textContent = res.status === 429 ? t("rate") : t("err");
      }
    }).catch(function () {
      history.pop(); save();
      wait.classList.add("err");
      wait.textContent = t("err");
    }).then(function () {
      clearTimeout(timer);
      busy = false; sendBtn.disabled = false;
      msgsEl.scrollTop = msgsEl.scrollHeight;
      input.focus();
    });
  }

  function autoGrow() { input.style.height = "auto"; input.style.height = Math.min(input.scrollHeight, 110) + "px"; }

  fab.onclick = open;
  $(".oa-close").onclick = close;
  $(".oa-clear").onclick = function () { history = []; save(); renderAll(); };
  form.onsubmit = function (e) { e.preventDefault(); ask(input.value); };
  input.addEventListener("input", autoGrow);
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey && !e.isComposing) { e.preventDefault(); ask(input.value); }
  });
  root.addEventListener("keydown", function (e) { if (e.key === "Escape" && root.classList.contains("open")) close(); });

  // Dil değişince metinleri güncelle (aynı sekme: select değişimi, diğer sekmeler: storage)
  window.addEventListener("storage", function (e) { if (e.key === "orimak_i18n_lang") applyTexts(); });
  document.addEventListener("change", function (e) { if (e.target && e.target.id === "langSelect") setTimeout(applyTexts, 0); });

  // Dışarıdan açmak için: window.oriAsistanAc()
  window.oriAsistanAc = open;

  function mount() { document.body.appendChild(root); applyTexts(); }
  if (document.body) mount(); else document.addEventListener("DOMContentLoaded", mount);
})();

