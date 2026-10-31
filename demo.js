// before/after demos, played like a screen recording: the same text is typed into both invoices.
// the left invoice keeps its height, so the text lies on top; the right one grows and pushes the page down.
// a script, not css keyframes: it works the same in every browser, including safari on iphone.
(function () {
  var TOP = ['Persona de contacto: Ana López', 'Teléfono: 600 000 000', 'Email: ana@ejemplo.es', 'Horario: de 9:00 a 18:00'];
  var TIP = ['Y desenchufa los aparatos', 'en standby: ahorrarás hasta', 'un 10 % en tu factura.'];
  var ROWS = [['Alquiler de contador', '0,00€'], ['Bono social', '0,00€'], ['Servicio de mantenimiento', '0,00€'],
    ['Energía reactiva', '0,00€'], ['Compensación de excedentes', '0,00€']];
  var CHAR = 45; // ms per typed letter

  function wait(ms) { return new Promise(function (ok) { setTimeout(ok, ms); }); }
  function each(list, fn) { Array.prototype.forEach.call(list, fn); }

  // one PDF point in pixels, set from the real width (container units are not enough for older safari)
  function fitPoints(inv) {
    var pg = inv.querySelector('.pg');
    function set() { pg.style.setProperty('--k', inv.clientWidth / 595 + 'px'); }
    set();
    if (window.ResizeObserver) new ResizeObserver(set).observe(inv);
    else window.addEventListener('resize', set);
  }

  // append an empty line to every box, then type the text into all of them at once
  async function typeInto(boxes, text) {
    var nodes = [];
    each(boxes, function (box) { var n = document.createElement('span'); box.appendChild(n); nodes.push(n); });
    for (var i = 1; i <= text.length; i++) {
      nodes.forEach(function (n) { n.textContent = text.slice(0, i); });
      await wait(CHAR);
    }
  }
  function newLine(boxes) {
    var lines = [];
    each(boxes, function (box) { var d = document.createElement('div'); box.appendChild(d); lines.push(d); });
    return lines;
  }

  async function invoice(demo) {
    each(demo.querySelectorAll('.inv'), fitPoints);
    var top = demo.querySelectorAll('.e1'), tip = demo.querySelectorAll('.e3'), table = demo.querySelectorAll('.e2');
    for (;;) {
      each(top, function (b) { b.textContent = ''; });
      each(table, function (b) { b.textContent = ''; });
      each(tip, function (b) { b.textContent = ''; });
      await wait(1500);
      for (var i = 0; i < TOP.length; i++) {
        await typeInto(newLine(top), TOP[i]);
        await wait(350);
      }
      await wait(900);
      for (var t = 0; t < TIP.length; t++) {
        await typeInto(newLine(tip), TIP[t]);
        await wait(300);
      }
      await wait(900);
      for (var j = 0; j < ROWS.length; j++) {
        var rows = newLine(table);
        await typeInto(rows, ROWS[j][0]);
        await typeInto(rows, ROWS[j][1]);
        await wait(350);
      }
      await wait(4500);
    }
  }

  async function font(demo) {
    var names = demo.querySelectorAll('.nm'), subs = demo.querySelectorAll('.bad .nm');
    for (;;) {
      each(subs, function (n) { n.classList.remove('sub'); });
      each(names, function (n) { n.textContent = 'Ana'; });
      await wait(1800);
      for (var i = 2; i >= 0; i--) { each(names, function (n) { n.textContent = 'Ana'.slice(0, i); }); await wait(140); }
      each(subs, function (n) { n.classList.add('sub'); });
      for (var k = 1; k <= 5; k++) { each(names, function (n) { n.textContent = 'María'.slice(0, k); }); await wait(170); }
      await wait(4000);
    }
  }

  each(document.querySelectorAll('.invdemo'), invoice);
  each(document.querySelectorAll('.fontdemo'), font);
})();
