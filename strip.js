// letter strip: each square is a slot-machine reel that spins through characters the newest model reads
(() => {
  const strip = document.querySelector('.strip');
  if (!strip || !Element.prototype.animate) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // taken from the class list of the newest letter model (VOLNA46_S), only characters common fonts can draw
  const POOL = [...'#$%*0123456789@AАBВвCcСсDEЕFGHНнIJKКкLMМмNOoОоPpРрQRSsTТтUuVvWwXxХхYZzaаbdeеfghijklmnqrtyУуЁБГгДдЖжЗИиЙйЛлПпФЦцЧчШшЩщЪъЫыЬьЭэЮюЯябзфё!()+,-.:;?[]_|~=^{}ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿĀāĂăĄąĆćĈĉĊċČčĎďĐđĒēĔĕĖėĘęĚěĜĝĞğĠġĢģĤĥĦħĨĩĪīĬĭĮįİıĲĳĴĵĶķĸĹĺĻļĽľĿŀŁłŃńŅņŇňŉŊŋŌōŎŏŐőŒœŔŕŖŗŘřŚśŜŝŞşŠšŢţŤťŦŧŨũŪūŬŭŮůŰűŲųŴŵŶŷŸŹźŻżŽžΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩΪΫάέήίΰαβγδεζηθικλμνξοπρςστυφχψωЀЂЃЄЅІЇЈЉЊЋЌЍЎЏѐђѓєѕіїјљњћќѝўџ'];
  // upper and lower case of one shape: the model counts them as one class
  const PAIRS = ['cC', 'oO', 'sS', 'uU', 'vV', 'wW', 'xX', 'zZ', 'сС', 'оО', 'кК', 'жЖ', 'шШ', 'яЯ', 'пП', 'эЭ'];

  const cells = [...strip.children];
  const pick = a => a[Math.floor(Math.random() * a.length)];

  function spin(cell, last, turns, delay) {
    if (cell.dataset.busy) return;
    cell.dataset.busy = '1';
    const h = cell.clientHeight;
    const reel = document.createElement('i');
    reel.className = 'reel';
    reel.style.setProperty('--h', h + 'px');
    const chars = [cell.textContent];
    for (let i = 0; i < turns; i++) chars.push(pick(POOL));
    chars.push(last);
    for (const c of chars) {
      const b = document.createElement('b');
      b.textContent = c;
      reel.append(b);
    }
    cell.textContent = '';
    cell.append(reel);
    const run = reel.animate(
      [{ transform: 'translateY(0)' }, { transform: `translateY(${-(chars.length - 1) * h}px)` }],
      { duration: 650 + turns * 40, delay, easing: 'cubic-bezier(.2, .75, .25, 1.06)', fill: 'forwards' });
    run.onfinish = () => { cell.textContent = last; delete cell.dataset.busy; };
  }

  // on load every reel spins and they stop one after another, left to right, on the letters already there
  cells.forEach((cell, i) => spin(cell, cell.textContent, 8 + i, i * 60));

  // later one reel at a time; sometimes a tinted pair lands on two shapes of one letter
  const pairStarts = cells.filter((c, i) => c.classList.contains('pair') && cells[i + 1]?.classList.contains('pair')
    && !cells[i - 1]?.classList.contains('pair'));
  const single = cells.filter(c => !c.classList.contains('pair'));
  setInterval(() => {
    if (document.hidden) return;
    if (pairStarts.length && Math.random() < 0.3) {
      const first = pick(pairStarts), pair = pick(PAIRS);
      spin(first, pair[0], 10, 0);
      spin(first.nextElementSibling, pair[1], 12, 0);
    } else {
      spin(pick(single), pick(POOL), 10, 0);
    }
  }, 2400);
})();
