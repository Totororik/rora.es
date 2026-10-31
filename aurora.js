/* Glass squares tilt and catch the light under a real mouse; touch screens and reduced motion get the still version */
(function () {
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  document.querySelectorAll(".tile.link").forEach(function (t) {
    t.addEventListener("animationend", function (e) { if (e.animationName === "tileIn") t.style.animation = "none"; });
    t.addEventListener("pointermove", function (e) {
      var r = t.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      t.style.setProperty("--mx", (x * 100) + "%");
      t.style.setProperty("--my", (y * 100) + "%");
      t.style.setProperty("--ry", ((x - .5) * 10) + "deg");
      t.style.setProperty("--rx", ((.5 - y) * 10) + "deg");
    });
    t.addEventListener("pointerleave", function () {
      t.style.setProperty("--rx", "0deg");
      t.style.setProperty("--ry", "0deg");
    });
  });
})();
