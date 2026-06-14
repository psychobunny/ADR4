'use strict';

/* ============================================================
   ADR — Anime Dungeon Raids RPG  |  public/js/adr.js
   ============================================================ */

(function () {

  /* ── Tab switching ── */
  function initTabs() {
    var tabs = document.querySelectorAll('.adr-tab');
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var targetId = 'tab-' + tab.dataset.tab;
        // deactivate all tabs and panes
        document.querySelectorAll('.adr-tab').forEach(function (t) { t.classList.remove('active'); });
        document.querySelectorAll('.adr-tab-content').forEach(function (c) { c.style.display = 'none'; });
        // activate clicked
        tab.classList.add('active');
        var pane = document.getElementById(targetId);
        if (pane) pane.style.display = 'block';
      });
    });
  }

  /* ── Confirm dangerous forms ── */
  function initConfirmForms() {
    document.querySelectorAll('[data-adr-confirm]').forEach(function (el) {
      el.addEventListener('submit', function (e) {
        var msg = el.dataset.adrConfirm || 'Are you sure?';
        if (!window.confirm(msg)) e.preventDefault();
      });
    });
  }

  /* ── Dismiss alerts ── */
  function initAlertDismiss() {
    document.querySelectorAll('.adr-alert[data-dismiss]').forEach(function (el) {
      el.style.cursor = 'pointer';
      el.addEventListener('click', function () {
        el.style.transition = 'opacity 0.3s';
        el.style.opacity = '0';
        setTimeout(function () { el.remove(); }, 300);
      });
    });
  }

  /* ── Auto-dismiss flash alerts after 6 s ── */
  function initAutoDismiss() {
    var alerts = document.querySelectorAll('.adr-alert-success, .adr-alert-danger');
    alerts.forEach(function (el) {
      setTimeout(function () {
        el.style.transition = 'opacity 0.5s';
        el.style.opacity = '0';
        setTimeout(function () { el.remove(); }, 500);
      }, 6000);
    });
  }

  /* ── Bar animation on paint ── */
  function initBarAnimation() {
    document.querySelectorAll('.adr-bar-fill').forEach(function (bar) {
      var target = bar.style.width;
      bar.style.width = '0%';
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          bar.style.width = target;
        });
      });
    });
  }

  /* ── Character stat roller (creation page) ── */
  function initStatRoller() {
    var roller = document.querySelector('.adr-stat-roller');
    if (!roller) return;

    roller.addEventListener('click', function () {
      var inputs = document.querySelectorAll('.adr-stats-grid input[type="number"]');
      var min    = parseInt(document.querySelector('[data-min-char]') && document.querySelector('[data-min-char]').dataset.minChar, 10) || 3;
      var max    = parseInt(document.querySelector('[data-max-char]') && document.querySelector('[data-max-char]').dataset.maxChar, 10) || 20;
      inputs.forEach(function (inp) {
        inp.value = Math.floor(Math.random() * (max - min + 1)) + min;
      });
    });
  }

  /* ── Number input: clamp on blur ── */
  function initNumberClamp() {
    document.querySelectorAll('input[type="number"][min][max]').forEach(function (inp) {
      inp.addEventListener('blur', function () {
        var v   = parseInt(inp.value, 10);
        var min = parseInt(inp.min, 10);
        var max = parseInt(inp.max, 10);
        if (!isNaN(min) && v < min) inp.value = min;
        if (!isNaN(max) && v > max) inp.value = max;
      });
    });
  }

  /* ── Tooltip-like item hover ── */
  function initItemTooltips() {
    document.querySelectorAll('.adr-item-card').forEach(function (card) {
      card.addEventListener('mouseenter', function () {
        card.style.transform = 'translateY(-2px)';
      });
      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
      });
    });
  }

  /* ── Battle log scroll to bottom ── */
  function initBattleLogScroll() {
    var log = document.querySelector('.adr-battle-log');
    if (log) log.scrollTop = log.scrollHeight;
  }

  /* ── PvP challenge pre-fill ── */
  function initPvpChallenge() {
    var params = new URLSearchParams(window.location.search);
    var uid    = params.get('challenge');
    if (!uid) return;
    var inp = document.querySelector('input[name="targetUid"]');
    if (inp) inp.value = uid;
  }

  /* ── Stock buy: max button ── */
  function initStockMax() {
    document.querySelectorAll('[data-stock-max]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var max   = btn.dataset.stockMax;
        var form  = btn.closest('form');
        var input = form && form.querySelector('input[name="amount"]');
        if (input) input.value = max;
      });
    });
  }

  /* ── Admin: select-card radio fix for Bootstrap themes ── */
  function initAdminSelectCards() {
    document.querySelectorAll('.adr-select-card input[type="radio"]').forEach(function (radio) {
      radio.addEventListener('change', function () {
        document.querySelectorAll('input[name="' + radio.name + '"]').forEach(function (r) {
          var inner = r.closest('.adr-select-card') && r.closest('.adr-select-card').querySelector('.adr-select-card-inner');
          if (inner) inner.style.borderColor = '';
        });
        var active = radio.closest('.adr-select-card') && radio.closest('.adr-select-card').querySelector('.adr-select-card-inner');
        if (active) active.style.borderColor = 'var(--adr-primary)';
      });
    });
  }

  /* ── Boot ── */
  function boot() {
    initTabs();
    initConfirmForms();
    initAlertDismiss();
    initAutoDismiss();
    initBarAnimation();
    initStatRoller();
    initNumberClamp();
    initItemTooltips();
    initBattleLogScroll();
    initPvpChallenge();
    initStockMax();
    initAdminSelectCards();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  /* Expose for NodeBB AMD / require.js if needed */
  if (typeof define === 'function' && define.amd) {
    define('adr', [], function () { return { boot: boot }; });
  }

})();
