"use strict";

// El script se ejecuta después de que el navegador procese el HTML.
const year = document.querySelector("#year");

if (year) {
  year.textContent = new Date().getFullYear();
}
