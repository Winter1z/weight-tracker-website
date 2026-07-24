/* ==========================================================================
   Weight Arc — progressive enhancement
   --------------------------------------------------------------------------
   This file adds exactly one thing: a light/dark theme toggle.

   Everything else on the site — navigation, legal text, FAQs, layout — is
   plain HTML and CSS and works with JavaScript disabled. Nothing here is
   required to read or navigate the site.

   No analytics, no trackers, no cookies. The only stored value is the
   visitor's own theme choice, kept in localStorage on their device.
   ========================================================================== */

(function () {
  "use strict";

  var STORAGE_KEY = "weight-arc-theme";
  var root = document.documentElement;

  function storedTheme() {
    try {
      var value = window.localStorage.getItem(STORAGE_KEY);
      return value === "light" || value === "dark" ? value : null;
    } catch (error) {
      // Private browsing or blocked storage: fall back to the system theme.
      return null;
    }
  }

  function systemTheme() {
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  function activeTheme() {
    return root.getAttribute("data-theme") || systemTheme();
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute("content", theme === "dark" ? "#0a0c0b" : "#ffffff");
    }
  }

  // Re-apply the saved choice as early as possible. An inline script in each
  // page already does this before first paint; this is the belt-and-braces
  // pass for any page that lacks it.
  var saved = storedTheme();
  if (saved) {
    applyTheme(saved);
  }

  function syncButton(button) {
    var isDark = activeTheme() === "dark";
    button.setAttribute("aria-pressed", isDark ? "true" : "false");
    button.setAttribute(
      "aria-label",
      isDark ? "Switch to light appearance" : "Switch to dark appearance"
    );
  }

  document.addEventListener("DOMContentLoaded", function () {
    var button = document.querySelector(".theme-toggle");
    if (!button) return;

    // The control only exists once JavaScript can drive it, so keyboard and
    // screen-reader users never meet a dead button.
    button.hidden = false;
    syncButton(button);

    button.addEventListener("click", function () {
      var next = activeTheme() === "dark" ? "light" : "dark";
      applyTheme(next);
      try {
        window.localStorage.setItem(STORAGE_KEY, next);
      } catch (error) {
        // Storage unavailable — the choice simply lasts for this page view.
      }
      syncButton(button);
    });

    // Follow the operating system while the visitor has no explicit choice.
    if (window.matchMedia) {
      var query = window.matchMedia("(prefers-color-scheme: dark)");
      var onChange = function () {
        if (!storedTheme()) {
          root.removeAttribute("data-theme");
          syncButton(button);
        }
      };
      if (query.addEventListener) {
        query.addEventListener("change", onChange);
      } else if (query.addListener) {
        query.addListener(onChange);
      }
    }
  });
})();
