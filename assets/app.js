(function () {
  "use strict";

  function absolute(text) {
    try {
      return new URL(text, window.location.href).href;
    } catch (error) {
      return text;
    }
  }

  function drawQrCodes() {
    var nodes = document.querySelectorAll("[data-qr]");
    if (!nodes.length) return;

    if (typeof QRCode === "undefined") {
      Array.prototype.forEach.call(nodes, function (node) {
        node.textContent = "QR no disponible sin conexión";
      });
      return;
    }

    Array.prototype.forEach.call(nodes, function (node) {
      var target = absolute(node.getAttribute("data-qr") || window.location.href);
      node.innerHTML = "";
      new QRCode(node, {
        text: target,
        width: 168,
        height: 168,
        colorDark: "#14251f",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.M
      });

      var name = node.getAttribute("data-qr-name");
      var canvas = node.querySelector("canvas");
      var link = node.parentElement && node.parentElement.querySelector("[data-download-link]");
      if (name && canvas && link) {
        try {
          link.href = canvas.toDataURL("image/png");
          link.download = name + ".png";
        } catch (error) {
          link.hidden = true;
        }
      }
    });
  }

  function bindPrint() {
    document.querySelectorAll("[data-print]").forEach(function (button) {
      button.addEventListener("click", function () {
        window.print();
      });
    });
  }

  function bindShare() {
    document.querySelectorAll("[data-share]").forEach(function (button) {
      button.addEventListener("click", function () {
        var url = window.location.href;
        if (navigator.share) {
          navigator.share({ title: document.title, url: url }).catch(function () {});
          return;
        }
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(url).then(function () {
            button.textContent = "Enlace copiado";
          }).catch(function () {
            window.prompt("Copia este enlace", url);
          });
          return;
        }
        window.prompt("Copia este enlace", url);
      });
    });
  }

  function bindFilters() {
    var chips = document.querySelectorAll("[data-filter]");
    if (!chips.length) return;

    var state = { pueblo: "todos", categoria: "todos" };
    var cards = document.querySelectorAll(".card[data-pueblo]");

    function apply() {
      Array.prototype.forEach.call(cards, function (card) {
        var okPueblo = state.pueblo === "todos" || card.getAttribute("data-pueblo") === state.pueblo;
        var okCategoria = state.categoria === "todos" || card.getAttribute("data-categoria") === state.categoria;
        card.hidden = !(okPueblo && okCategoria);
      });
    }

    Array.prototype.forEach.call(chips, function (chip) {
      chip.addEventListener("click", function () {
        var filter = chip.getAttribute("data-filter");
        state[filter] = chip.getAttribute("data-value");
        document.querySelectorAll('[data-filter="' + filter + '"]').forEach(function (other) {
          other.classList.toggle("is-active", other === chip);
        });
        apply();
      });
    });
  }

  function ready() {
    drawQrCodes();
    bindPrint();
    bindShare();
    bindFilters();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ready);
  } else {
    ready();
  }
})();
