var formularioFatorial = document.getElementById("form-fatorial");
var campoNumero = document.getElementById("numero");
var resultadoFatorial = document.getElementById("resultado");

formularioFatorial.addEventListener("submit", function (evento) {
  evento.preventDefault();

  var numero = campoNumero.valueAsNumber;
  if (!Number.isInteger(numero) || numero < 0 || numero > 2000) {
    resultadoFatorial.textContent = "Digite um número inteiro entre 0 e 2000.";
    campoNumero.focus();
    return;
  }

  var resultado = 1n;
  for (var fator = 2n; fator <= BigInt(numero); fator += 1n) {
    resultado *= fator;
  }

  resultadoFatorial.textContent = numero + "! = " + resultado.toString();
});
