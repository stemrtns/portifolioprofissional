var exampleVehicles = [
  { id: "car-1", make: "Toyota", model: "Aquarela", year: 2022, price: 119900 },
  { id: "car-2", make: "Honda", model: "Horizonte", year: 2023, price: 144500 },
  { id: "car-3", make: "Fiat", model: "Brisa", year: 2021, price: 78900 }
];
var favoriteVehicles = new Set();
var makeFilter = document.getElementById("make-filter");
var priceFilter = document.getElementById("price-filter");
var favoriteToggle = document.getElementById("show-favorites");
var vehicleList = document.getElementById("vehicle-list");
var resultCount = document.getElementById("result-count");

function vehicleText(pt, en) {
  return document.documentElement.lang === "en" ? en : pt;
}

function renderVehicles() {
  var maxPrice = priceFilter.value === "" ? Infinity : Number(priceFilter.value);
  var favoritesOnly = favoriteToggle.getAttribute("aria-pressed") === "true";
  var shownVehicles = exampleVehicles.filter(function (vehicle) {
    return (
      (!makeFilter.value || vehicle.make === makeFilter.value) &&
      vehicle.price <= maxPrice &&
      (!favoritesOnly || favoriteVehicles.has(vehicle.id))
    );
  });

  vehicleList.replaceChildren();
  shownVehicles.forEach(function (vehicle) {
    var card = document.createElement("article");
    card.className = "vehicle-card";
    var heading = document.createElement("h3");
    heading.textContent = vehicle.make + " " + vehicle.model;
    var details = document.createElement("p");
    details.textContent =
      vehicle.year +
      " · " +
      vehicle.price.toLocaleString(
        document.documentElement.lang === "en" ? "en-US" : "pt-BR"
      ) +
      " " +
      vehicleText("R$", "BRL");
    var favoriteButton = document.createElement("button");
    favoriteButton.type = "button";
    favoriteButton.setAttribute(
      "aria-pressed",
      String(favoriteVehicles.has(vehicle.id))
    );
    favoriteButton.textContent = favoriteVehicles.has(vehicle.id)
      ? vehicleText("★ Favorito", "★ Saved")
      : vehicleText("☆ Adicionar aos favoritos", "☆ Add to favorites");
    favoriteButton.addEventListener("click", function () {
      if (favoriteVehicles.has(vehicle.id)) {
        favoriteVehicles.delete(vehicle.id);
      } else {
        favoriteVehicles.add(vehicle.id);
      }
      renderVehicles();
    });
    card.append(heading, details, favoriteButton);
    vehicleList.appendChild(card);
  });

  resultCount.textContent =
    shownVehicles.length + " " + vehicleText("exemplo(s)", "sample(s)");
}

makeFilter.addEventListener("change", renderVehicles);
priceFilter.addEventListener("input", renderVehicles);

document.getElementById("clear-filters").addEventListener("click", function () {
  makeFilter.value = "";
  priceFilter.value = "";
  favoriteToggle.setAttribute("aria-pressed", "false");
  renderVehicles();
});

favoriteToggle.addEventListener("click", function () {
  var isActive = favoriteToggle.getAttribute("aria-pressed") !== "true";
  favoriteToggle.setAttribute("aria-pressed", String(isActive));
  renderVehicles();
});

document.addEventListener("project-language-change", renderVehicles);

renderVehicles();
