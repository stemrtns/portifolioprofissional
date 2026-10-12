function setPageLanguage(language) {
  document.documentElement.lang = language === "en" ? "en" : "pt-BR";
  document.querySelectorAll("[data-pt][data-en]").forEach(function (element) {
    element.textContent = element.dataset[language];
  });
  document.querySelectorAll("[data-language]").forEach(function (button) {
    button.setAttribute(
      "aria-pressed",
      String(button.dataset.language === language)
    );
  });
  document.querySelectorAll("[data-placeholder-pt][data-placeholder-en]").forEach(
    function (element) {
      element.placeholder =
        language === "en"
          ? element.dataset.placeholderEn
          : element.dataset.placeholderPt;
    }
  );
  document.dispatchEvent(new CustomEvent("project-language-change"));
}

document.querySelectorAll("[data-language]").forEach(function (button) {
  button.addEventListener("click", function () {
    setPageLanguage(button.dataset.language);
  });
});

setPageLanguage("pt");
