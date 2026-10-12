var stackValues = [];
var queueValues = [];
var stackView = document.getElementById("stack-view");
var queueView = document.getElementById("queue-view");
var stackStatus = document.getElementById("stack-status");
var queueStatus = document.getElementById("queue-status");
var sortResult = document.getElementById("sort-result");

function currentLanguage() {
  return document.documentElement.lang === "en" ? "en" : "pt";
}

function message(pt, en) {
  return currentLanguage() === "en" ? en : pt;
}

function drawValues(container, values) {
  container.replaceChildren();
  if (values.length === 0) {
    container.textContent = message("Estrutura vazia", "Empty structure");
    return;
  }
  values.forEach(function (value) {
    var item = document.createElement("span");
    item.className = "item";
    item.textContent = value;
    container.appendChild(item);
  });
}

document.getElementById("stack-push").addEventListener("click", function () {
  var input = document.getElementById("stack-value");
  if (input.value === "") {
    stackStatus.textContent = message("Informe um valor para empilhar.", "Enter a value to push.");
    input.focus();
    return;
  }
  stackValues.push(input.value);
  drawValues(stackView, stackValues.slice().reverse());
  stackStatus.textContent = message("Valor empilhado: ", "Pushed value: ") + input.value;
});

document.getElementById("stack-pop").addEventListener("click", function () {
  var value = stackValues.pop();
  drawValues(stackView, stackValues.slice().reverse());
  stackStatus.textContent =
    value === undefined
      ? message("A pilha está vazia.", "The stack is empty.")
      : message("Valor removido do topo: ", "Popped from top: ") + value;
});

document.getElementById("queue-add").addEventListener("click", function () {
  var input = document.getElementById("queue-value");
  if (input.value === "") {
    queueStatus.textContent = message("Informe um valor para enfileirar.", "Enter a value to enqueue.");
    input.focus();
    return;
  }
  queueValues.push(input.value);
  drawValues(queueView, queueValues);
  queueStatus.textContent = message("Valor adicionado ao fim: ", "Added to the end: ") + input.value;
});

document.getElementById("queue-remove").addEventListener("click", function () {
  var value = queueValues.shift();
  drawValues(queueView, queueValues);
  queueStatus.textContent =
    value === undefined
      ? message("A fila está vazia.", "The queue is empty.")
      : message("Valor removido da frente: ", "Removed from front: ") + value;
});

document.getElementById("sort-button").addEventListener("click", function () {
  var values = [42, 7, 23, 7, 18];
  var frequencias = new Array(43).fill(0);
  values.forEach(function (value) {
    frequencias[value] += 1;
  });
  var ordenados = [];
  frequencias.forEach(function (frequencia, valor) {
    for (var repeticao = 0; repeticao < frequencia; repeticao += 1) {
      ordenados.push(valor);
    }
  });
  sortResult.textContent = ordenados.join(", ");
});

document.addEventListener("project-language-change", function () {
  drawValues(stackView, stackValues.slice().reverse());
  drawValues(queueView, queueValues);
  stackStatus.textContent = "";
  queueStatus.textContent = "";
});

drawValues(stackView, stackValues);
drawValues(queueView, queueValues);
