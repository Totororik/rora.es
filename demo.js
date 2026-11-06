// before/after demos, played like a screen recording: the same text is typed into both invoices.
// the left invoice keeps its height, so the text lies on top; the right one grows and pushes the page down.
// a script, not css keyframes: it works the same in every browser, including safari on iphone.
(function () {
  var TOP = ['Persona de contacto: Ana López', 'Teléfono: 600 000 000', 'Email: ana@ejemplo.es', 'Horario: de 9:00 a 18:00'];
  var TIP = ['luz del sol. Apaga lo que no uses', 'y desenchufa los aparatos en', 'standby: gastan hasta un 10 %', 'de tu factura. Por la mañana', 'deja entrar también la']; // typed into the middle of the tip
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
    each(boxes, function (box) { var d = document.createElement('div'); box.insertBefore(d, box.querySelector('.keep')); lines.push(d); });
    return lines;
  }

  // camera (06.11): when an invoice is shown through a short window (phone: only part of the page fits), the window
  // glides to the line being typed — the start of its block stays in view while it fits, then the newest line does.
  // If the whole page fits (desktop), there is nowhere to move and nothing happens.
  var AIR = 0.3, MARGIN = 10, GLIDE = 650; // share of the window kept above the block (where on the page we are); px under the line; ms
  function glide(inv, to) {
    to = Math.max(0, Math.min(to, inv.scrollHeight - inv.clientHeight));
    var from = inv.scrollTop, t0 = null;
    inv._glide = (inv._glide || 0) + 1;
    var mine = inv._glide;
    if (Math.abs(to - from) < 1) return Promise.resolve();
    return new Promise(function (ok) {
      function step(t) {
        if (mine !== inv._glide) return ok();          // a newer glide took over
        if (t0 === null) t0 = t;
        var x = Math.min(1, (t - t0) / GLIDE), e = x < .5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
        inv.scrollTop = from + (to - from) * e;
        if (x < 1) requestAnimationFrame(step); else ok();
      }
      requestAnimationFrame(step);
    });
  }
  function follow(lines) {
    return Promise.all(lines.map(function (line) {
      var inv = line.closest('.inv');
      if (!inv || inv.scrollHeight <= inv.clientHeight + 2) return Promise.resolve();
      var r0 = inv.getBoundingClientRect().top - inv.scrollTop;
      var block = line.closest('.gr') || line.parentNode;
      var top = block.getBoundingClientRect().top - r0 - inv.clientHeight * AIR;
      var bottom = line.getBoundingClientRect().bottom - r0 + MARGIN;
      return glide(inv, bottom - top > inv.clientHeight ? bottom - inv.clientHeight : top);
    }));
  }
  function home(demo) {
    return Promise.all(Array.prototype.map.call(demo.querySelectorAll('.inv'), function (inv) { return glide(inv, 0); }));
  }

  async function invoice(demo) {
    each(demo.querySelectorAll('.inv'), fitPoints);
    var top = demo.querySelectorAll('.e1'), tip = demo.querySelectorAll('.e3'), table = demo.querySelectorAll('.e2');
    for (;;) {
      each(top, function (b) { b.textContent = ''; });
      each(table, function (b) { b.textContent = ''; });
      each(tip, function (b) { each(b.querySelectorAll('div:not(.keep)'), function (d) { d.remove(); }); });
      await home(demo);
      await wait(1500);
      for (var i = 0; i < TOP.length; i++) {
        var l1 = newLine(top);
        if (i === 0) await follow(l1); else follow(l1);
        await typeInto(l1, TOP[i]);
        await wait(350);
      }
      await wait(900);
      for (var t = 0; t < TIP.length; t++) {
        var l3 = newLine(tip);
        if (t === 0) await follow(l3); else follow(l3);   // first line of a block: wait until the camera is there
        await typeInto(l3, TIP[t]);
        await wait(300);
      }
      await wait(900);
      for (var j = 0; j < ROWS.length; j++) {
        var rows = newLine(table);
        if (j === 0) await follow(rows); else follow(rows);
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
