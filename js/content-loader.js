(function () {
  "use strict";

  function showError(message) {
    var app = document.getElementById("app");
    if (!app) return;
    app.innerHTML = '<main class="error-message" role="alert"><h1>Our little universe needs a moment</h1><p>' + message + '</p></main>';
  }

  async function load() {
    var path = document.body.dataset.page === "intro" ? "data/birthday-content.json" : "../data/birthday-content.json";
    var response = await fetch(path, { cache: "no-cache" });
    if (!response.ok) throw new Error("The birthday content could not be loaded (" + response.status + ").");
    var content = await response.json();
    if (!content.girlfriend || !content.intro || !content.navigation || !content.images) {
      throw new Error("The birthday content file is missing required sections. Check data/birthday-content.json.");
    }
    return content;
  }

  function escapeHTML(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (character) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[character];
    });
  }

  window.BirthdayContent = { load: load, showError: showError, escapeHTML: escapeHTML };
})();
