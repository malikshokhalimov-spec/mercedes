/* ==========================================================
   Mercedes-Benz — каталог. Чистый JS, без библиотек.
   ========================================================== */
(function () {
  "use strict";

  var MODELS = window.MODELS || [];
  var byId = {};
  MODELS.forEach(function (m, i) { m._i = i; byId[m.id] = m; });

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var nf = new Intl.NumberFormat("ru-RU");
  var MAX_COMPARE = 3;

  /* ---------- Хранилище (с защитой от приватного режима) ---------- */
  function load(key) {
    try { var v = JSON.parse(localStorage.getItem(key)); return Array.isArray(v) ? v.filter(function (id) { return byId[id]; }) : []; }
    catch (e) { return []; }
  }
  function save(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) { /* ignore */ } }

  var state = {
    era: "all",
    body: "all",
    q: "",
    sort: "default",
    favs: load("mb-favs"),
    compare: load("mb-compare").slice(0, MAX_COMPARE)
  };
  var visible = []; // текущий отфильтрованный список

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function num(v, unit) { return v == null ? "—" : nf.format(v) + (unit ? " " + unit : ""); }

  /* ==========================================================
     SVG-иллюстрации автомобилей (вместо фото или пока фото грузится)
     ========================================================== */
  var SHAPES = {
    sedan: {
      body: "M30,176 L30,152 Q32,136 56,131 L122,123 Q152,93 186,89 L254,89 Q286,91 312,121 L356,129 Q376,134 378,152 L378,176 Z",
      glass: "M138,122 Q162,99 189,97 L251,97 Q276,99 299,122 Z",
      pillar: 218, wheels: [100, 302], r: 25, bottom: 176
    },
    suv: {
      body: "M28,180 L28,142 Q30,123 52,119 L96,114 L130,72 Q136,65 152,65 L292,65 Q308,66 320,81 L347,113 L364,118 Q378,123 378,142 L378,180 Z",
      glass: "M140,112 L162,75 L287,75 Q298,76 306,87 L327,112 Z",
      pillar: 232, wheels: [98, 304], r: 28, bottom: 180
    },
    coupe: {
      body: "M30,174 L30,154 Q34,139 62,135 L132,127 Q168,93 208,91 L238,92 Q282,100 322,127 L360,135 Q378,141 378,157 L378,174 Z",
      glass: "M148,126 Q175,100 208,99 L236,100 Q264,107 292,126 Z",
      pillar: null, wheels: [100, 304], r: 25, bottom: 174
    },
    roadster: {
      body: "M30,172 L30,152 Q35,138 66,134 L150,129 L172,108 L177,110 L170,129 L250,129 L262,118 Q270,112 278,118 L286,129 Q312,130 330,134 L362,138 Q378,143 378,158 L378,172 Z",
      glass: "M170,129 L177,110 L181,112 L176,129 Z",
      pillar: null, wheels: [102, 304], r: 25, bottom: 172
    },
    hyper: {
      body: "M22,170 L24,156 Q40,142 92,137 L152,131 Q192,101 232,99 Q276,101 332,133 L370,141 Q385,147 383,160 L381,170 Z M300,126 L346,118 L350,123 L306,132 Z",
      glass: "M167,129 Q197,107 232,106 Q263,108 300,129 Z",
      pillar: null, wheels: [96, 306], r: 24, bottom: 170
    },
    van: {
      body: "M30,180 L30,122 Q32,108 50,104 L92,98 L120,61 Q124,55 134,55 L356,55 Q372,56 374,72 L376,180 Z",
      glass: "M100,98 L126,65 L168,65 L168,98 Z M178,65 L244,65 L244,98 L178,98 Z M254,65 L320,65 L320,98 L254,98 Z M330,65 L364,65 L364,98 L330,98 Z",
      pillar: null, wheels: [96, 316], r: 26, bottom: 180
    },
    vintage: {
      body: "M62,160 L62,128 L128,124 L146,80 Q148,74 156,74 L232,74 Q240,74 241,82 L244,124 L322,124 Q340,126 342,142 L342,160 Z M40,168 Q58,128 104,130 Q140,132 150,168 Z M252,168 Q262,128 302,128 Q344,130 360,168 Z",
      glass: "M154,82 L176,82 L176,118 L146,118 Z M186,82 L232,82 L234,118 L186,118 Z",
      pillar: null, wheels: [100, 304], r: 30, bottom: 168, spokes: true
    }
  };
  var COLORS = {
    obsidian: ["#4a4f55", "#121417"], silver: ["#f1f3f5", "#8d949b"], grey: ["#9aa1a8", "#40464c"],
    white: ["#ffffff", "#c9ced3"], red: ["#e0312d", "#6d0b0a"], blue: ["#5aa6e6", "#0a3d6b"],
    cream: ["#efe4cc", "#a08f6d"], green: ["#3f5e4a", "#14231a"]
  };
  var uid = 0;
  function pickColor(m) {
    if (m.amg) return "red";
    if (m.body === "ev") return "blue";
    if (m.era === "classic") return m.year < 1950 ? "green" : ["cream", "silver", "obsidian", "white"][m._i % 4];
    return ["obsidian", "silver", "grey", "white"][m._i % 4];
  }
  function carSVG(m) {
    var key = m.era === "classic" && m.year < 1950 ? "vintage" : (m.body === "ev" ? "sedan" : m.body);
    var s = SHAPES[key] || SHAPES.sedan;
    var c = COLORS[pickColor(m)];
    var id = "g" + (++uid);
    var wheelY = s.bottom - 10;
    var ground = wheelY + s.r;
    var wheels = s.wheels.map(function (x) {
      var w = '<circle cx="' + x + '" cy="' + wheelY + '" r="' + (s.r + 5) + '" fill="#0d0d0d" opacity=".55"/>' +
        '<circle cx="' + x + '" cy="' + wheelY + '" r="' + s.r + '" fill="#1c1c1c"/>' +
        '<circle cx="' + x + '" cy="' + wheelY + '" r="' + Math.round(s.r * 0.62) + '" fill="url(#' + id + 'r)"/>';
      if (s.spokes) {
        for (var a = 0; a < 12; a++) {
          var ang = a * Math.PI / 6, rr = s.r * 0.9;
          w += '<line x1="' + x + '" y1="' + wheelY + '" x2="' + (x + Math.cos(ang) * rr).toFixed(1) + '" y2="' + (wheelY + Math.sin(ang) * rr).toFixed(1) + '" stroke="#bfb59f" stroke-width="1.6"/>';
        }
      } else {
        for (var b = 0; b < 5; b++) {
          var an = b * Math.PI * 2 / 5 - Math.PI / 2, r1 = s.r * 0.18, r2 = s.r * 0.58;
          w += '<line x1="' + (x + Math.cos(an) * r1).toFixed(1) + '" y1="' + (wheelY + Math.sin(an) * r1).toFixed(1) + '" x2="' + (x + Math.cos(an) * r2).toFixed(1) + '" y2="' + (wheelY + Math.sin(an) * r2).toFixed(1) + '" stroke="#5b6066" stroke-width="3" stroke-linecap="round"/>';
        }
      }
      return w + '<circle cx="' + x + '" cy="' + wheelY + '" r="' + Math.max(3, s.r * 0.14).toFixed(1) + '" fill="#2a2d31"/>';
    }).join("");
    var light = m.body === "ev" && key !== "vintage"
      ? '<rect x="40" y="139" width="330" height="2" rx="1" fill="#8fd0ff" opacity=".85"/>' : "";
    var pillar = s.pillar ? '<rect x="' + s.pillar + '" y="92" width="5" height="32" fill="url(#' + id + 'b)"/>' : "";
    return '<svg viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Иллюстрация: ' + esc(m.name) + '">' +
      '<defs>' +
      '<linearGradient id="' + id + 'b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + c[0] + '"/><stop offset="1" stop-color="' + c[1] + '"/></linearGradient>' +
      '<linearGradient id="' + id + 'g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5d6a78"/><stop offset=".55" stop-color="#1b2229"/><stop offset="1" stop-color="#0b0e11"/></linearGradient>' +
      '<radialGradient id="' + id + 'r"><stop offset="0" stop-color="#e6e9ec"/><stop offset="1" stop-color="#7c838a"/></radialGradient>' +
      '<linearGradient id="' + id + 'f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f2f3f4"/><stop offset="1" stop-color="#cfd3d7"/></linearGradient>' +
      '</defs>' +
      '<rect width="400" height="250" fill="url(#' + id + 'f)"/>' +
      '<text x="200" y="238" text-anchor="middle" font-family="Georgia,serif" font-size="30" fill="#000" opacity=".06" letter-spacing="4">' + esc(m.code) + '</text>' +
      '<ellipse cx="203" cy="' + (ground + 2) + '" rx="180" ry="9" fill="#000" opacity=".22"/>' +
      '<path d="' + s.body + '" fill="url(#' + id + 'b)"/>' +
      '<path d="' + s.body + '" fill="none" stroke="#000" stroke-opacity=".18" stroke-width="1"/>' +
      '<path d="' + s.glass + '" fill="url(#' + id + 'g)"/>' + pillar + light +
      wheels +
      '</svg>';
  }

  /* Иллюстрация + фото поверх (фото плавно появляется, при ошибке — остаётся рисунок) */
  function mediaHTML(m, eager) {
    var img = m.img
      ? '<img src="img/' + esc(m.img) + '.jpg" alt="' + esc(m.name + " " + m.code) + '" width="960" height="600" ' +
        (eager ? 'fetchpriority="high"' : 'loading="lazy"') + ' decoding="async" data-photo>'
      : "";
    return carSVG(m) + img;
  }
  // Один обработчик на весь документ — события load/error не всплывают, ловим на фазе захвата
  document.addEventListener("load", function (e) {
    var t = e.target;
    if (t.tagName === "IMG" && t.hasAttribute("data-photo")) {
      t.classList.add("is-loaded");
    }
  }, true);
  document.addEventListener("error", function (e) {
    var t = e.target;
    if (t.tagName === "IMG" && t.hasAttribute("data-photo")) t.remove();
  }, true);

  /* ==========================================================
     Каталог
     ========================================================== */
  var grid = $("#grid"), results = $("#results"), empty = $("#empty");
  var BODY_LABEL = { sedan: "Седан", suv: "Внедорожник", coupe: "Купе", roadster: "Родстер", ev: "Электро", hyper: "Гиперкар", van: "Минивэн" };

  function matches(m) {
    if (state.era !== "all" && m.era !== state.era) return false;
    if (state.body === "amg" && !m.amg) return false;
    if (state.body === "favs" && state.favs.indexOf(m.id) < 0) return false;
    if (["all", "amg", "favs"].indexOf(state.body) < 0 && m.body !== state.body) return false;
    if (state.q) {
      var hay = (m.name + " " + m.code + " " + m.trim + " " + m.years + " " + (m.amg ? "amg" : "") + " " + (BODY_LABEL[m.body] || "") + " " + m.fuel).toLowerCase();
      var words = state.q.toLowerCase().split(/\s+/).filter(Boolean);
      for (var i = 0; i < words.length; i++) if (hay.indexOf(words[i]) < 0) return false;
    }
    return true;
  }
  function sorter(a, b) {
    switch (state.sort) {
      case "year-desc": return b.year - a.year;
      case "year-asc": return a.year - b.year;
      case "power-desc": return (b.power || 0) - (a.power || 0);
      case "accel-asc": return (a.accel == null ? 999 : a.accel) - (b.accel == null ? 999 : b.accel);
      case "name": return a.name.localeCompare(b.name, "ru");
      default: return a._i - b._i;
    }
  }
  function plural(n, one, few, many) {
    var m10 = n % 10, m100 = n % 100;
    if (m10 === 1 && m100 !== 11) return one;
    if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return few;
    return many;
  }

  function heart() { return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.5s-7.5-4.6-9.3-9.4C1.4 7.6 3.6 4 7.2 4c2 0 3.6 1.1 4.8 2.8C13.2 5.1 14.8 4 16.8 4c3.6 0 5.8 3.6 4.5 7.1-1.8 4.8-9.3 9.4-9.3 9.4z"/></svg>'; }

  function cardHTML(m, idx) {
    var isFav = state.favs.indexOf(m.id) >= 0;
    var inCmp = state.compare.indexOf(m.id) >= 0;
    var tags = "";
    if (m.era === "classic") tags += '<span class="tag tag--classic">Классика</span>';
    if (m.amg) tags += '<span class="tag tag--amg">AMG</span>';
    if (m.fuel === "Электро") tags += '<span class="tag tag--ev">EQ</span>';
    var third = m.fuel === "Электро" && m.range
      ? '<div><b>' + num(m.range) + '</b><span>км запас</span></div>'
      : '<div><b>' + num(m.vmax) + '</b><span>км/ч макс.</span></div>';
    return '<article class="card" style="animation-delay:' + Math.min(idx, 12) * 40 + 'ms">' +
      '<div class="card__media" data-action="open" data-id="' + m.id + '">' + mediaHTML(m, idx < 3) + '<div class="card__tags">' + tags + '</div></div>' +
      '<button class="fav' + (isFav ? " is-on" : "") + '" data-action="fav" data-id="' + m.id + '" aria-pressed="' + isFav + '" aria-label="В избранное: ' + esc(m.name) + '">' + heart() + '</button>' +
      '<div class="card__body">' +
        '<div class="card__meta">' + esc(m.code) + ' · ' + esc(m.years) + '</div>' +
        '<h3 class="card__title">' + esc(m.name) + '</h3>' +
        '<p class="card__tagline">' + esc(m.tagline) + '</p>' +
        '<div class="card__specs">' +
          '<div><b>' + num(m.power) + '</b><span>л.с.</span></div>' +
          '<div><b>' + (m.accel == null ? "—" : nf.format(m.accel)) + '</b><span>сек 0–100</span></div>' +
          third +
        '</div>' +
        '<div class="card__actions">' +
          '<button class="btn btn--dark" data-action="open" data-id="' + m.id + '">Подробнее</button>' +
          '<button class="btn btn--outline' + (inCmp ? " is-on" : "") + '" data-action="compare" data-id="' + m.id + '" aria-pressed="' + inCmp + '">' + (inCmp ? "✓ В сравнении" : "Сравнить") + '</button>' +
        '</div>' +
      '</div>' +
    '</article>';
  }

  function render() {
    visible = MODELS.filter(matches).sort(sorter);
    grid.innerHTML = visible.map(cardHTML).join("");
    empty.hidden = visible.length > 0;
    results.textContent = visible.length
      ? "Найдено: " + visible.length + " " + plural(visible.length, "модель", "модели", "моделей")
      : "";
  }

  /* Точечное обновление кнопок без перерисовки всей сетки */
  function syncCardButtons() {
    $$('[data-action="fav"]', grid).forEach(function (b) {
      var on = state.favs.indexOf(b.dataset.id) >= 0;
      b.classList.toggle("is-on", on); b.setAttribute("aria-pressed", on);
    });
    $$('[data-action="compare"]', grid).forEach(function (b) {
      var on = state.compare.indexOf(b.dataset.id) >= 0;
      b.classList.toggle("is-on", on); b.setAttribute("aria-pressed", on);
      b.textContent = on ? "✓ В сравнении" : "Сравнить";
    });
  }

  /* ---------- Избранное и сравнение ---------- */
  function toggleFav(id) {
    var i = state.favs.indexOf(id);
    if (i >= 0) { state.favs.splice(i, 1); toast("Удалено из избранного"); }
    else { state.favs.push(id); toast("♥ " + byId[id].name + " — в избранном"); }
    save("mb-favs", state.favs);
    updateFavCount();
    if (state.body === "favs") render(); else syncCardButtons();
    syncModalButtons();
  }
  function updateFavCount() {
    var b = $("#favCount");
    b.textContent = state.favs.length;
    b.hidden = state.favs.length === 0;
  }
  function toggleCompare(id) {
    var i = state.compare.indexOf(id);
    if (i >= 0) state.compare.splice(i, 1);
    else {
      if (state.compare.length >= MAX_COMPARE) { toast("Можно сравнить не более " + MAX_COMPARE + " моделей"); return; }
      state.compare.push(id);
      toast(byId[id].name + " добавлен к сравнению");
    }
    save("mb-compare", state.compare);
    syncCardButtons(); syncModalButtons(); renderCompare();
  }

  var CMP_ROWS = [
    ["Годы выпуска", function (m) { return m.years; }],
    ["Версия", function (m) { return m.trim; }],
    ["Двигатель", function (m) { return m.engine; }],
    ["Мощность", function (m) { return m.power; }, "max", "л.с."],
    ["Крутящий момент", function (m) { return m.torque; }, "max", "Н·м"],
    ["Разгон 0–100 км/ч", function (m) { return m.accel; }, "min", "с"],
    ["Макс. скорость", function (m) { return m.vmax; }, "max", "км/ч"],
    ["Запас хода (WLTP)", function (m) { return m.range; }, "max", "км"],
    ["Привод", function (m) { return m.drive; }],
    ["Коробка передач", function (m) { return m.gearbox; }],
    ["Длина", function (m) { return m.length; }, null, "мм"],
    ["Масса", function (m) { return m.weight; }, "min", "кг"],
    ["Топливо", function (m) { return m.fuel; }]
  ];
  function renderCompare() {
    var box = $("#compareBox");
    var list = state.compare.map(function (id) { return byId[id]; });
    if (!list.length) {
      box.innerHTML = '<div class="compare-empty">Пока ничего не выбрано. Добавьте модели кнопкой «Сравнить» в каталоге.<br><br><a class="btn btn--dark" href="#models">Перейти к моделям</a></div>';
    } else {
      var head = '<tr><th scope="row"></th>' + list.map(function (m) {
        return '<th scope="col"><div class="c-head"><div class="c-img" data-action="open" data-id="' + m.id + '" style="cursor:pointer">' + mediaHTML(m) + '</div>' +
          '<span class="c-name">' + esc(m.name) + '</span><button class="c-rm" data-action="compare" data-id="' + m.id + '">Убрать</button></div></th>';
      }).join("") + (list.length < MAX_COMPARE ? '<th scope="col"><div class="compare-empty" style="padding:24px 12px">+ добавьте модель</div></th>' : "") + '</tr>';
      var body = CMP_ROWS.map(function (row) {
        var vals = list.map(function (m) { return row[1](m); });
        if (row[0].indexOf("Запас хода") === 0 && vals.every(function (v) { return v == null; })) return "";
        var nums = vals.filter(function (v) { return typeof v === "number"; });
        var best = null;
        if (row[2] && nums.length > 1) best = row[2] === "max" ? Math.max.apply(null, nums) : Math.min.apply(null, nums);
        return '<tr><th scope="row">' + row[0] + '</th>' + vals.map(function (v) {
          var txt = typeof v === "number" ? num(v, row[3]) : (v == null ? "—" : esc(v));
          return '<td' + (best !== null && v === best ? ' class="best"' : "") + '>' + txt + '</td>';
        }).join("") + (list.length < MAX_COMPARE ? "<td></td>" : "") + '</tr>';
      }).join("");
      box.innerHTML = '<div class="compare-wrap"><table class="ctable"><thead>' + head + '</thead><tbody>' + body + '</tbody></table></div>';
    }
    // плавающая панель
    var bar = $("#cbar");
    bar.hidden = list.length === 0 || compareInView;
    $("#cbarItems").innerHTML = list.map(function (m) {
      return '<span class="cbar__item">' + esc(m.name) + '<button data-action="compare" data-id="' + m.id + '" aria-label="Убрать ' + esc(m.name) + '">×</button></span>';
    }).join("");
  }

  /* ==========================================================
     Модальное окно
     ========================================================== */
  var modal = $("#modal"), modalBody = $("#modalBody"), dialog = $(".modal__dialog", modal);
  var currentId = null, lastFocus = null, openedViaPush = false;

  function modalHTML(m) {
    var isFav = state.favs.indexOf(m.id) >= 0, inCmp = state.compare.indexOf(m.id) >= 0;
    var rows = [
      ["Версия", m.trim], ["Годы выпуска", m.years], ["Двигатель", m.engine],
      ["Мощность", num(m.power, "л.с.")], ["Крутящий момент", num(m.torque, "Н·м")],
      ["Разгон 0–100 км/ч", m.accel == null ? "—" : num(m.accel, "с")],
      ["Максимальная скорость", num(m.vmax, "км/ч")]
    ];
    if (m.range) rows.push(["Запас хода (WLTP)", num(m.range, "км")]);
    rows.push(["Привод", m.drive], ["Коробка передач", m.gearbox], ["Длина", num(m.length, "мм")], ["Снаряжённая масса", num(m.weight, "кг")], ["Топливо", m.fuel]);
    var list = visible.length && visible.indexOf(m) >= 0 ? visible : MODELS;
    var i = list.indexOf(m);
    var prev = list[(i - 1 + list.length) % list.length], next = list[(i + 1) % list.length];
    return '<div class="m-media">' + mediaHTML(m, true) + '</div>' +
      '<div class="m-body">' +
        '<div>' +
          '<p class="eyebrow eyebrow--dark">' + esc(m.code) + ' · ' + esc(m.years) + (m.era === "classic" ? " · Классика" : "") + (m.amg ? " · AMG" : "") + '</p>' +
          '<h2 class="m-title" id="mTitle">' + esc(m.name) + '</h2>' +
          '<p class="m-tagline">' + esc(m.tagline) + '</p>' +
          '<p class="m-desc">' + esc(m.desc) + '</p>' +
          '<div class="m-key">' +
            '<div><b>' + num(m.power) + '</b><span>л.с.</span></div>' +
            '<div><b>' + (m.accel == null ? "—" : nf.format(m.accel)) + '</b><span>сек 0–100</span></div>' +
            '<div><b>' + num(m.vmax) + '</b><span>км/ч</span></div>' +
          '</div>' +
          '<div class="m-actions">' +
            '<button class="btn btn--dark" data-maction="compare">' + (inCmp ? "✓ В сравнении" : "Добавить к сравнению") + '</button>' +
            '<button class="btn btn--outline' + (isFav ? " is-on" : "") + '" data-maction="fav">' + (isFav ? "♥ В избранном" : "♡ В избранное") + '</button>' +
          '</div>' +
        '</div>' +
        '<table class="specs"><caption>Технические характеристики</caption><tbody>' +
          rows.map(function (r) { return '<tr><th scope="row">' + r[0] + '</th><td>' + esc(r[1]) + '</td></tr>'; }).join("") +
        '</tbody></table>' +
      '</div>' +
      '<div class="m-nav">' +
        '<button data-goto="' + prev.id + '">← ' + esc(prev.name) + '</button>' +
        '<button data-goto="' + next.id + '">' + esc(next.name) + ' →</button>' +
      '</div>';
  }
  function syncModalButtons() {
    if (!currentId) return;
    var c = $('[data-maction="compare"]', modal), f = $('[data-maction="fav"]', modal);
    var inCmp = state.compare.indexOf(currentId) >= 0, isFav = state.favs.indexOf(currentId) >= 0;
    if (c) c.textContent = inCmp ? "✓ В сравнении" : "Добавить к сравнению";
    if (f) { f.textContent = isFav ? "♥ В избранном" : "♡ В избранное"; f.classList.toggle("is-on", isFav); }
  }
  function showModal(id) {
    var m = byId[id];
    if (!m) return;
    if (modal.hidden) lastFocus = document.activeElement;
    currentId = id;
    modalBody.innerHTML = modalHTML(m);
    modal.hidden = false;
    document.body.classList.add("no-scroll");
    dialog.scrollTop = 0;
    dialog.focus({ preventScroll: true });
    document.title = m.name + " " + m.code + " — Mercedes-Benz";
  }
  function hideModal() {
    if (modal.hidden) return;
    modal.hidden = true;
    currentId = null;
    document.body.classList.remove("no-scroll");
    modalBody.innerHTML = "";
    document.title = "Mercedes-Benz — каталог моделей и история марки";
    if (lastFocus && document.contains(lastFocus)) lastFocus.focus({ preventScroll: true });
  }
  function openModel(id) {
    if (!byId[id]) return;
    if (modal.hidden) {
      history.pushState({ modal: id }, "", "#model/" + id);
      openedViaPush = true;
    } else {
      history.replaceState({ modal: id }, "", "#model/" + id);
    }
    showModal(id);
  }
  function closeModel() {
    if (openedViaPush && history.state && history.state.modal) { history.back(); return; }
    history.replaceState(null, "", location.pathname + location.search + "#models");
    hideModal();
  }
  window.addEventListener("popstate", function () {
    var mm = /^#model\/(.+)$/.exec(location.hash);
    if (mm && byId[decodeURIComponent(mm[1])]) showModal(decodeURIComponent(mm[1]));
    else { openedViaPush = false; hideModal(); }
  });

  modal.addEventListener("click", function (e) {
    var t = e.target.closest("[data-close],[data-maction],[data-goto]");
    if (!t) return;
    if (t.hasAttribute("data-close")) closeModel();
    else if (t.dataset.maction === "compare") toggleCompare(currentId);
    else if (t.dataset.maction === "fav") toggleFav(currentId);
    else if (t.dataset.goto) openModel(t.dataset.goto);
  });
  document.addEventListener("keydown", function (e) {
    if (modal.hidden) return;
    if (e.key === "Escape") { closeModel(); return; }
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      if (/INPUT|SELECT|TEXTAREA/.test(document.activeElement.tagName)) return;
      var b = $$("[data-goto]", modal)[e.key === "ArrowLeft" ? 0 : 1];
      if (b) b.click();
    }
    if (e.key === "Tab") { // удерживаем фокус внутри окна
      var f = $$('button, a[href], [tabindex]:not([tabindex="-1"])', dialog).filter(function (el) { return el.offsetParent !== null; });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === dialog)) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  // свайп вниз закрывает окно на телефоне
  (function () {
    var y0 = null;
    dialog.addEventListener("touchstart", function (e) { y0 = dialog.scrollTop <= 0 ? e.touches[0].clientY : null; }, { passive: true });
    dialog.addEventListener("touchend", function (e) {
      if (y0 !== null && e.changedTouches[0].clientY - y0 > 120) closeModel();
      y0 = null;
    }, { passive: true });
  })();

  /* ==========================================================
     События каталога
     ========================================================== */
  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-action]");
    if (!t || modal.contains(t)) return;
    var id = t.dataset.id;
    if (t.dataset.action === "open") openModel(id);
    else if (t.dataset.action === "fav") toggleFav(id);
    else if (t.dataset.action === "compare") toggleCompare(id);
  });

  function setEra(era) {
    state.era = era;
    $$(".segmented__btn").forEach(function (b) {
      var on = b.dataset.era === era;
      b.classList.toggle("is-active", on); b.setAttribute("aria-selected", on);
    });
  }
  function setBody(body) {
    state.body = body;
    $$("#bodyChips .chip").forEach(function (b) { b.classList.toggle("is-active", b.dataset.body === body); });
  }
  $$(".segmented__btn").forEach(function (b) { b.addEventListener("click", function () { setEra(b.dataset.era); render(); }); });
  $$("#bodyChips .chip").forEach(function (b) {
    b.addEventListener("click", function () {
      setBody(b.dataset.body); render();
      if (b.scrollIntoView) b.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
    });
  });
  var qTimer;
  $("#search").addEventListener("input", function (e) {
    clearTimeout(qTimer);
    qTimer = setTimeout(function () { state.q = e.target.value.trim(); render(); }, 120);
  });
  $("#sort").addEventListener("change", function (e) { state.sort = e.target.value; render(); });
  $("#resetFilters").addEventListener("click", function () {
    setEra("all"); setBody("all"); state.q = ""; state.sort = "default";
    $("#search").value = ""; $("#sort").value = "default"; render();
  });

  /* ---------- Меню ---------- */
  var burger = $("#burger"), nav = $("#nav");
  function setMenu(open) {
    nav.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", open);
    document.body.classList.toggle("no-scroll", open);
  }
  burger.addEventListener("click", function () { setMenu(!nav.classList.contains("is-open")); });
  nav.addEventListener("click", function (e) {
    var a = e.target.closest("a");
    if (!a) return;
    if (a.hasAttribute("data-filter-favs")) {
      e.preventDefault();
      setEra("all"); setBody("favs"); render();
      $("#models").scrollIntoView({ behavior: "smooth" });
    }
    setMenu(false);
  });
  window.addEventListener("resize", function () { if (window.innerWidth > 960 && nav.classList.contains("is-open")) setMenu(false); }, { passive: true });

  /* ---------- Тост ---------- */
  var toastEl = $("#toast"), toastTimer;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove("is-on"); }, 2000);
  }

  /* ---------- История, технологии, источники ---------- */
  $("#timeline").innerHTML = (window.TIMELINE || []).map(function (t) {
    return '<li class="reveal"><div class="timeline__year">' + t.y + '</div><div><h3>' + esc(t.t) + '</h3><p>' + esc(t.d) + '</p></div></li>';
  }).join("");
  $("#techGrid").innerHTML = (window.TECH || []).map(function (t) {
    return '<div class="tech__item reveal"><div class="tech__year">' + esc(t.y) + '</div><div class="tech__name">' + esc(t.k) + '</div><p>' + esc(t.d) + '</p></div>';
  }).join("");
  var cr = window.CREDITS || {};
  $("#credits").innerHTML = Object.keys(cr).map(function (k) {
    var f = cr[k];
    return '<li><a href="https://commons.wikimedia.org/wiki/File:' + encodeURIComponent(f) + '" target="_blank" rel="noopener">' + esc(f.replace(/_/g, " ")) + '</a></li>';
  }).join("");
  $("#year").textContent = new Date().getFullYear();
  $("#statModels").textContent = MODELS.length;

  /* ---------- Наблюдатели: появление, активный пункт меню, панель сравнения ---------- */
  var compareInView = false;
  if ("IntersectionObserver" in window) {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-in"); ro.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px" });
    $$(".reveal").forEach(function (el) { ro.observe(el); });

    var links = $$(".nav a[href^='#']");
    var so = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.target.id === "compare") { compareInView = en.isIntersecting; $("#cbar").hidden = compareInView || state.compare.length === 0; }
        if (en.isIntersecting) links.forEach(function (a) { a.classList.toggle("is-current", a.getAttribute("href") === "#" + en.target.id); });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    ["models", "compare", "history", "tech"].forEach(function (id) { so.observe(document.getElementById(id)); });
  } else {
    $$(".reveal").forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---------- Старт ---------- */
  updateFavCount();
  render();
  renderCompare();
  var start = /^#model\/(.+)$/.exec(location.hash);
  if (start && byId[decodeURIComponent(start[1])]) { history.replaceState({ modal: decodeURIComponent(start[1]) }, "", location.hash); openedViaPush = false; showModal(decodeURIComponent(start[1])); }
})();
