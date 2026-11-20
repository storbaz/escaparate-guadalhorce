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
    });
  }

  function bindPrint() {
    document.querySelectorAll("[data-print]").forEach(function (button) {
      button.addEventListener("click", function () {
        window.print();
      });
    });
  }

  function ready() {
    drawQrCodes();
    bindPrint();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ready);
  } else {
    ready();
  }
})();
