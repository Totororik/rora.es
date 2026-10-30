/* Language switch EN/ES, shared by all pages */
(function () {
  var bloki = document.querySelectorAll("[data-lang]");
  var knopki = document.querySelectorAll(".lang button");
  function pokazat(l) {
    bloki.forEach(function (b) { b.hidden = b.getAttribute("data-lang") !== l; });
    knopki.forEach(function (k) { k.setAttribute("aria-pressed", k.getAttribute("data-l") === l ? "true" : "false"); });
    document.documentElement.lang = l;
    try { localStorage.setItem("lang", l); } catch (e) { /* bez pamjati jazyka - pokazyvaem po umolchaniju */ }
  }
  knopki.forEach(function (k) { k.addEventListener("click", function () { pokazat(k.getAttribute("data-l")); }); });
  var l = null;
  try { l = localStorage.getItem("lang"); } catch (e) { l = null; }
  if (!l && (navigator.language || "").slice(0, 2) === "es") l = "es";
  pokazat(l === "es" ? "es" : "en");
})();
