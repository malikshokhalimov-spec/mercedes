'use strict';

/* =========================================================
   1. Точная десятичная арифметика
   Числа хранятся как { m: BigInt, e: number } = m × 10^e,
   поэтому 0,1 + 0,2 = 0,3 без ошибок плавающей точки.
   ========================================================= */

const MAX_DIGITS = 15;
const ERR_DIV_ZERO = 'Деление на ноль';
const ERR_OVERFLOW = 'Слишком большое число';
const ERR_INVALID = 'Ошибка';

class CalcError extends Error {}

function pow10(n) {
  return 10n ** BigInt(n);
}

function toDec(str) {
  const match = /^([+-]?)(\d*)(?:\.(\d*))?(?:e([+-]?\d+))?$/i.exec(String(str).trim());
  if (!match || (match[2] === '' && !match[3])) {
    throw new CalcError(ERR_INVALID);
  }
  const sign = match[1] === '-' ? -1n : 1n;
  const intPart = match[2] || '0';
  const fracPart = match[3] || '';
  const exp = match[4] ? parseInt(match[4], 10) : 0;
  return { m: sign * BigInt(intPart + fracPart), e: exp - fracPart.length };
}

function decAdd(a, b) {
  if (a.e === b.e) return { m: a.m + b.m, e: a.e };
  if (a.e < b.e) return { m: a.m + b.m * pow10(b.e - a.e), e: a.e };
  return { m: a.m * pow10(a.e - b.e) + b.m, e: b.e };
}

function decSub(a, b) {
  return decAdd(a, { m: -b.m, e: b.e });
}

function decMul(a, b) {
  return { m: a.m * b.m, e: a.e + b.e };
}

function digitLength(m) {
  return (m < 0n ? -m : m).toString().length;
}

function decDiv(a, b) {
  if (b.m === 0n) throw new CalcError(ERR_DIV_ZERO);
  // Запас точности: не меньше 30 значащих цифр в частном
  const scale = 30 + digitLength(b.m);
  return { m: (a.m * pow10(scale)) / b.m, e: a.e - b.e - scale };
}

function decToNumber(d) {
  return Number(d.m.toString() + 'e' + d.e);
}

/** Число → каноническая строка (до 15 значащих цифр). */
function numToString(n) {
  if (!Number.isFinite(n)) throw new CalcError(ERR_OVERFLOW);
  const r = Number(n.toPrecision(15));
  if (r === 0) return '0';
  const abs = Math.abs(r);
  if (abs >= 1e15 || abs < 1e-6) {
    return r.toExponential(9).replace(/\.?0+e/, 'e');
  }
  return String(r);
}

/** Вычисление последовательности токенов с приоритетом × и ÷. */
function evaluateTokens(tokens) {
  const t = tokens.slice();
  while (t.length && t[t.length - 1].type === 'op') t.pop();
  if (!t.length) return { m: 0n, e: 0 };

  const terms = [toDec(t[0].value)];
  const addOps = [];

  for (let i = 1; i < t.length; i += 2) {
    const op = t[i].value;
    const operand = toDec(t[i + 1].value);
    if (op === '*') {
      terms.push(decMul(terms.pop(), operand));
    } else if (op === '/') {
      terms.push(decDiv(terms.pop(), operand));
    } else {
      addOps.push(op);
      terms.push(operand);
    }
  }

  let acc = terms[0];
  for (let i = 0; i < addOps.length; i++) {
    acc = addOps[i] === '+' ? decAdd(acc, terms[i + 1]) : decSub(acc, terms[i + 1]);
  }
  return acc;
}

function computeString(tokens) {
  return numToString(decToNumber(evaluateTokens(tokens)));
}

function countDigits(str) {
  const mantissa = str.split(/e/i)[0];
  return mantissa.replace(/\D/g, '').length;
}

/** Приводит вводимое число к аккуратному виду: «5.» → «5», «-0» → «0». */
function normalizeEntry(value) {
  let v = value;
  if (v === '' || v === '-') return '0';
  if (v.endsWith('.')) v = v.slice(0, -1);
  if (/^-?0*(\.0*)?$/.test(v)) return '0';
  return v;
}

/* =========================================================
   2. Состояние калькулятора
   ========================================================= */

class Calculator {
  constructor() {
    this.reset();
  }

  reset() {
    this.tokens = [];          // завершённые числа и операторы
    this.current = '0';        // число, которое вводится сейчас ('' — после оператора)
    this.overwrite = false;    // следующая цифра заменит current
    this.justEvaluated = false;
    this.lastExpression = [];  // выражение, показанное после «=»
    this.error = null;
  }

  getExpressionTokens() {
    if (this.current === '') return this.tokens.map((t) => ({ ...t }));
    return [...this.tokens.map((t) => ({ ...t })), { type: 'num', value: this.current }];
  }

  get activeOperator() {
    if (this.error || this.justEvaluated || this.current !== '') return null;
    const last = this.tokens[this.tokens.length - 1];
    return last && last.type === 'op' ? last.value : null;
  }

  _fail(err, tokens) {
    this.error = err instanceof CalcError ? err.message : ERR_INVALID;
    this.lastExpression = tokens;
    this.tokens = [];
    this.current = '0';
    this.overwrite = false;
    this.justEvaluated = false;
  }

  inputDigit(d) {
    if (this.error || this.justEvaluated) this.reset();
    if (this.overwrite) {
      this.current = '';
      this.overwrite = false;
    }
    if (this.current === '0') {
      this.current = d;
      return true;
    }
    if (this.current === '-0') {
      this.current = '-' + d;
      return true;
    }
    if (countDigits(this.current) >= MAX_DIGITS) return false;
    this.current += d;
    return true;
  }

  inputDecimal() {
    if (this.error || this.justEvaluated) this.reset();
    if (this.overwrite) {
      this.current = '0';
      this.overwrite = false;
    }
    if (this.current === '') this.current = '0';
    if (this.current.includes('.')) return false;
    if (countDigits(this.current) >= MAX_DIGITS) return false;
    this.current += '.';
    return true;
  }

  inputOperator(op) {
    if (this.error) return false;
    if (this.justEvaluated) {
      this.justEvaluated = false;
      this.lastExpression = [];
      this.tokens = [];
    }
    this.overwrite = false;

    if (this.current === '') {
      const last = this.tokens[this.tokens.length - 1];
      if (last && last.type === 'op') {
        last.value = op; // замена оператора
        return true;
      }
      return false;
    }

    this.tokens.push({ type: 'num', value: normalizeEntry(this.current) }, { type: 'op', value: op });
    this.current = '';
    return true;
  }

  /** Возвращает { tokens, result } при успешном вычислении, иначе null. */
  equals() {
    if (this.error) {
      this.reset();
      return null;
    }
    if (this.justEvaluated) return null;

    const tks = this.getExpressionTokens().map((t) =>
      t.type === 'num' ? { type: 'num', value: normalizeEntry(t.value) } : t
    );
    while (tks.length && tks[tks.length - 1].type === 'op') tks.pop();

    if (tks.length < 3) {
      this.tokens = [];
      this.current = tks.length ? tks[0].value : '0';
      this.overwrite = true;
      return null;
    }

    try {
      const result = computeString(tks);
      this.lastExpression = tks;
      this.tokens = [];
      this.current = result;
      this.overwrite = false;
      this.justEvaluated = true;
      return { tokens: tks, result };
    } catch (err) {
      this._fail(err, tks);
      return { tokens: tks, error: this.error };
    }
  }

  toggleSign() {
    if (this.error) return false;
    if (this.current === '') {
      this.current = '-0';
      this.overwrite = false;
      return true;
    }
    if ((this.justEvaluated || this.overwrite) && normalizeEntry(this.current) === '0') return false;
    this.current = this.current.startsWith('-') ? this.current.slice(1) : '-' + this.current;
    if (this.justEvaluated) this.lastExpression = [];
    return true;
  }

  percent() {
    if (this.error || this.current === '') return false;
    try {
      const value = toDec(normalizeEntry(this.current));
      const hundredth = { m: 1n, e: -2 };
      const last = this.tokens[this.tokens.length - 1];
      let res;
      if (last && (last.value === '+' || last.value === '-')) {
        // 200 + 10% → 200 + 20
        const base = evaluateTokens(this.tokens.slice(0, -1));
        res = decMul(base, decMul(value, hundredth));
      } else {
        // 50% → 0,5 ;  200 × 10% → 200 × 0,1
        res = decMul(value, hundredth);
      }
      this.current = numToString(decToNumber(res));
      this.overwrite = true;
      if (this.justEvaluated) this.lastExpression = [];
      return true;
    } catch (err) {
      this._fail(err, this.getExpressionTokens());
      return true;
    }
  }

  backspace() {
    if (this.error || this.justEvaluated) {
      this.reset();
      return true;
    }
    if (this.overwrite) {
      this.current = this.tokens.length ? '' : '0';
      this.overwrite = false;
      return true;
    }
    if (this.current !== '') {
      if (this.current === '0') return false;
      this.current = this.current.slice(0, -1);
      if (this.current === '' || this.current === '-') {
        this.current = this.tokens.length ? '' : '0';
      }
      return true;
    }
    if (this.tokens.length) {
      this.tokens.pop(); // оператор
      const num = this.tokens.pop();
      this.current = num ? num.value : '0';
      this.overwrite = /e/i.test(this.current);
      return true;
    }
    return false;
  }

  /** Подставляет значение (например, из истории) как текущее число. */
  loadValue(value) {
    if (this.error || this.justEvaluated) this.reset();
    this.current = value;
    this.overwrite = true;
    return true;
  }
}

/* =========================================================
   3. Форматирование
   ========================================================= */

const OP_SYMBOLS = { '+': '+', '-': '−', '*': '×', '/': '÷' };
const THIN_SPACE = ' ';

function formatNumber(str) {
  if (str === '' || str == null) return '';
  let s = String(str);
  let sign = '';
  if (s.startsWith('-')) {
    sign = '−';
    s = s.slice(1);
  }
  if (/e/i.test(s)) {
    const [mant, exp] = s.split(/e/i);
    return sign + mant.replace('.', ',') + 'e' + exp.replace('+', '').replace('-', '−');
  }
  const [intPart, fracPart] = s.split('.');
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, THIN_SPACE);
  return sign + grouped + (fracPart !== undefined ? ',' + fracPart : '');
}

function formatExpression(tokens) {
  return tokens
    .map((t, i) => {
      if (t.type === 'op') return OP_SYMBOLS[t.value];
      const s = formatNumber(t.value);
      return i > 0 && t.value.startsWith('-') ? `(${s})` : s;
    })
    .join(' ');
}

/** Текст для буфера обмена: без пробелов-разделителей, с запятой. */
function toClipboardText(str) {
  return normalizeEntry(str).replace('.', ',');
}

/* =========================================================
   4. Интерфейс
   ========================================================= */

function initUI() {
  const calc = new Calculator();

  const $ = (id) => document.getElementById(id);
  const root = document.documentElement;
  const expressionEl = $('expression');
  const resultEl = $('result');
  const keypadEl = $('keypad');
  const copyBtn = $('copyBtn');
  const themeBtn = $('themeBtn');
  const historyBtn = $('historyBtn');
  const historyPanel = $('historyPanel');
  const historyList = $('historyList');
  const clearHistoryBtn = $('clearHistoryBtn');
  const closeHistoryBtn = $('closeHistoryBtn');
  const toastEl = $('toast');
  const themeMeta = document.querySelector('meta[name="theme-color"]');

  const HISTORY_KEY = 'calc.history';
  const THEME_KEY = 'calc.theme';
  const HISTORY_LIMIT = 10;

  let mainRawValue = '0'; // то, что сейчас в главной строке (для копирования)
  let history = loadHistory();

  /* ---------- Хранилище ---------- */
  function storageGet(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }

  function storageSet(key, value) {
    try { localStorage.setItem(key, value); } catch (e) { /* недоступно */ }
  }

  function loadHistory() {
    try {
      const data = JSON.parse(storageGet(HISTORY_KEY) || '[]');
      return Array.isArray(data) ? data.slice(0, HISTORY_LIMIT) : [];
    } catch (e) {
      return [];
    }
  }

  function saveHistory() {
    storageSet(HISTORY_KEY, JSON.stringify(history));
  }

  /* ---------- Отрисовка ---------- */
  function render(effect) {
    let exprText = '';
    let mainText = '';
    let isPreview = false;
    let isError = false;
    mainRawValue = null;

    if (calc.error) {
      exprText = calc.lastExpression.length ? formatExpression(calc.lastExpression) + ' =' : '';
      mainText = calc.error;
      isError = true;
    } else if (calc.justEvaluated) {
      exprText = calc.lastExpression.length ? formatExpression(calc.lastExpression) + ' =' : '';
      mainText = formatNumber(calc.current);
      mainRawValue = calc.current;
    } else if (!calc.tokens.length) {
      mainText = formatNumber(calc.current);
      mainRawValue = calc.current;
    } else {
      const tks = calc.getExpressionTokens();
      exprText = formatExpression(tks);
      isPreview = true;
      try {
        const value = computeString(tks);
        mainText = formatNumber(value);
        mainRawValue = value;
      } catch (err) {
        mainText = err instanceof CalcError ? err.message : ERR_INVALID;
        isError = true;
      }
    }

    expressionEl.textContent = exprText;
    expressionEl.scrollLeft = expressionEl.scrollWidth;

    resultEl.textContent = mainText;
    resultEl.classList.toggle('is-preview', isPreview);
    resultEl.classList.toggle('is-error', isError);
    resultEl.setAttribute('aria-label', isError ? mainText : 'Результат: ' + mainText);
    fitResult();

    const active = calc.activeOperator;
    keypadEl.querySelectorAll('.key--op[data-action="operator"]').forEach((btn) => {
      btn.classList.toggle('is-active', btn.dataset.value === active);
    });

    copyBtn.disabled = mainRawValue === null;
    copyBtn.style.opacity = mainRawValue === null ? '0.3' : '';

    if (effect) playEffect(effect);
  }

  function playEffect(name) {
    resultEl.classList.remove('pop', 'shake');
    void resultEl.offsetWidth; // перезапуск анимации
    resultEl.classList.add(name);
  }

  resultEl.addEventListener('animationend', () => resultEl.classList.remove('pop', 'shake'));

  function fitResult() {
    resultEl.style.fontSize = '';
    const base = parseFloat(getComputedStyle(resultEl).fontSize);
    let size = base;
    const min = 22;
    while (resultEl.scrollWidth > resultEl.clientWidth && size > min) {
      size -= 2;
      resultEl.style.fontSize = size + 'px';
    }
  }

  /* ---------- История ---------- */
  function addToHistory(entry) {
    history.unshift({
      expr: formatExpression(entry.tokens),
      result: entry.result != null ? entry.result : null,
      error: entry.error || null,
      time: Date.now(),
    });
    history = history.slice(0, HISTORY_LIMIT);
    saveHistory();
    renderHistory();
  }

  function formatTime(ts) {
    const d = new Date(ts);
    return d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  }

  function renderHistory() {
    historyList.textContent = '';
    history.forEach((item, index) => {
      const li = document.createElement('li');
      li.className = 'history__item';
      li.style.animationDelay = index * 30 + 'ms';

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'history__entry';
      btn.dataset.index = String(index);

      const meta = document.createElement('span');
      meta.className = 'history__meta';
      const time = document.createElement('span');
      time.className = 'history__time';
      time.textContent = formatTime(item.time);
      const expr = document.createElement('span');
      expr.className = 'history__expr';
      expr.textContent = item.expr + ' =';
      meta.append(time, expr);

      const result = document.createElement('span');
      result.className = 'history__result';
      if (item.error) {
        result.classList.add('is-error');
        result.textContent = item.error;
        btn.disabled = true;
      } else {
        result.textContent = formatNumber(item.result);
        btn.setAttribute('aria-label', `${item.expr} = ${formatNumber(item.result)}. Использовать результат`);
      }

      btn.append(meta, result);
      li.append(btn);
      historyList.append(li);
    });

    historyPanel.classList.toggle('is-empty', history.length === 0);
    clearHistoryBtn.disabled = history.length === 0;
  }

  function openHistory() {
    renderHistory();
    historyPanel.classList.add('is-open');
    historyPanel.setAttribute('aria-hidden', 'false');
    historyBtn.setAttribute('aria-expanded', 'true');
  }

  function closeHistory() {
    historyPanel.classList.remove('is-open');
    historyPanel.setAttribute('aria-hidden', 'true');
    historyBtn.setAttribute('aria-expanded', 'false');
  }

  function isHistoryOpen() {
    return historyPanel.classList.contains('is-open');
  }

  historyBtn.addEventListener('click', () => (isHistoryOpen() ? closeHistory() : openHistory()));
  closeHistoryBtn.addEventListener('click', closeHistory);

  clearHistoryBtn.addEventListener('click', () => {
    history = [];
    saveHistory();
    renderHistory();
    showToast('История очищена');
  });

  historyList.addEventListener('click', (e) => {
    const btn = e.target.closest('.history__entry');
    if (!btn) return;
    const item = history[Number(btn.dataset.index)];
    if (!item || item.error) return;
    calc.loadValue(item.result);
    closeHistory();
    render('pop');
  });

  /* ---------- Тема ---------- */
  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    if (themeMeta) themeMeta.setAttribute('content', theme === 'dark' ? '#050506' : '#eceef3');
    themeBtn.setAttribute('aria-label', theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему');
  }

  function toggleTheme() {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    storageSet(THEME_KEY, next);
  }

  themeBtn.addEventListener('click', toggleTheme);
  applyTheme(root.getAttribute('data-theme') === 'light' ? 'light' : 'dark');

  if (window.matchMedia) {
    const mq = window.matchMedia('(prefers-color-scheme: light)');
    const onChange = (e) => {
      if (!storageGet(THEME_KEY)) applyTheme(e.matches ? 'light' : 'dark');
    };
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else if (mq.addListener) mq.addListener(onChange);
  }

  /* ---------- Уведомления и копирование ---------- */
  let toastTimer = null;
  function showToast(text) {
    toastEl.textContent = text;
    toastEl.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('is-visible'), 1600);
  }

  async function writeClipboard(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (e) { /* используем запасной способ */ }

    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.top = '-1000px';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    ta.remove();
    return ok;
  }

  let copyTimer = null;
  async function copyResult() {
    if (mainRawValue === null) {
      showToast('Нечего копировать');
      return;
    }
    const text = toClipboardText(mainRawValue);
    const ok = await writeClipboard(text);
    if (ok) {
      showToast('Скопировано: ' + text);
      copyBtn.classList.add('is-done');
      clearTimeout(copyTimer);
      copyTimer = setTimeout(() => copyBtn.classList.remove('is-done'), 1200);
    } else {
      showToast('Не удалось скопировать');
    }
  }

  copyBtn.addEventListener('click', copyResult);

  /* ---------- Обработка действий ---------- */
  function haptic() {
    if (navigator.vibrate) {
      try { navigator.vibrate(6); } catch (e) { /* не поддерживается */ }
    }
  }

  function perform(action, value) {
    let effect = null;
    switch (action) {
      case 'digit':
        calc.inputDigit(value);
        break;
      case 'decimal':
        calc.inputDecimal();
        break;
      case 'operator':
        calc.inputOperator(value);
        break;
      case 'equals': {
        const outcome = calc.equals();
        if (outcome) {
          addToHistory(outcome);
          effect = outcome.error ? 'shake' : 'pop';
        }
        break;
      }
      case 'percent':
        calc.percent();
        if (calc.error) effect = 'shake';
        break;
      case 'sign':
        calc.toggleSign();
        break;
      case 'backspace':
        calc.backspace();
        break;
      case 'clear':
        calc.reset();
        break;
      default:
        return;
    }
    render(effect);
  }

  keypadEl.addEventListener('click', (e) => {
    const btn = e.target.closest('.key');
    if (!btn) return;
    haptic();
    perform(btn.dataset.action, btn.dataset.value);
  });

  function flashKey(action, value) {
    const selector = value !== undefined
      ? `.key[data-action="${action}"][data-value="${value}"]`
      : `.key[data-action="${action}"]`;
    const btn = keypadEl.querySelector(selector);
    if (!btn) return;
    btn.classList.add('is-pressed');
    setTimeout(() => btn.classList.remove('is-pressed'), 120);
  }

  /* ---------- Клавиатура компьютера ---------- */
  function mapKey(e) {
    const k = e.key;
    if (/^[0-9]$/.test(k)) return ['digit', k];
    switch (k) {
      case '.':
      case ',':
      case 'Decimal':
        return ['decimal'];
      case '+':
        return ['operator', '+'];
      case '-':
      case '−':
      case 'Subtract':
        return ['operator', '-'];
      case '*':
      case 'x':
      case 'X':
      case 'х':
      case 'Х':
      case '×':
        return ['operator', '*'];
      case '/':
      case ':':
      case '÷':
        return ['operator', '/'];
      case 'Enter':
      case '=':
        return ['equals'];
      case '%':
        return ['percent'];
      case 'Backspace':
        return ['backspace'];
      case 'Escape':
      case 'Delete':
      case 'c':
      case 'C':
      case 'с':
      case 'С':
        return ['clear'];
      case 'F9':
      case 'n':
      case 'N':
        return ['sign'];
      default:
        return null;
    }
  }

  document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + C — копировать результат, если на странице ничего не выделено
    if ((e.ctrlKey || e.metaKey) && !e.altKey && (e.key === 'c' || e.key === 'C' || e.key === 'с' || e.key === 'С')) {
      const selection = window.getSelection ? String(window.getSelection()) : '';
      if (!selection) {
        e.preventDefault();
        copyResult();
      }
      return;
    }
    if (e.ctrlKey || e.metaKey || e.altKey) return;

    if (e.key === 'Escape' && isHistoryOpen()) {
      e.preventDefault();
      closeHistory();
      return;
    }
    if (e.key === 'h' || e.key === 'H' || e.key === 'р' || e.key === 'Р') {
      e.preventDefault();
      isHistoryOpen() ? closeHistory() : openHistory();
      return;
    }
    if (e.key === 't' || e.key === 'T' || e.key === 'е' || e.key === 'Е') {
      e.preventDefault();
      toggleTheme();
      return;
    }

    const mapped = mapKey(e);
    if (!mapped) return;

    // Не даём Enter/пробелу повторно «нажать» кнопку в фокусе
    e.preventDefault();
    if (isHistoryOpen()) closeHistory();

    const [action, value] = mapped;
    flashKey(action, value);
    perform(action, value);
  });

  // Снимаем фокус с кнопок после клика мышью, чтобы Enter не дублировал ввод
  document.addEventListener('pointerup', () => {
    const el = document.activeElement;
    if (el && el.classList && el.classList.contains('key')) el.blur();
  });

  let resizeFrame = null;
  window.addEventListener('resize', () => {
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(fitResult);
  });

  renderHistory();
  render();
}

/* =========================================================
   5. Запуск
   ========================================================= */

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initUI);
  } else {
    initUI();
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Calculator, computeString, formatNumber, formatExpression, numToString, toDec };
}
