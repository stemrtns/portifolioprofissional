var dadosPortfolio;
window.history.scrollRestoration = "manual";
var telasDoJogo = ["inicio", "sobre", "projetos", "experiencias", "contato"];
var telaAtual = "inicio";
var jogoLigado = false;
var somLigado = false;
var estadoMissao = "parada";
var telasVisitadas = [];
var pontosJogo = 0;
var audioJogo;
var missaoPausadaEnergia = false;

function atualizarPainelJogo(mensagem) {
  document.getElementById("status-jogo").textContent = mensagem;
  document.getElementById("pontuacao-jogo").textContent =
    "PONTOS " +
    String(pontosJogo).padStart(4, "0") +
    " · TELAS " +
    telasVisitadas.length +
    "/" +
    telasDoJogo.length;
}

function tocarEfeito(frequencia) {
  if (!somLigado || !audioJogo) {
    return;
  }

  var oscilador = audioJogo.createOscillator();
  var volume = audioJogo.createGain();
  var agora = audioJogo.currentTime;
  oscilador.type = "square";
  oscilador.frequency.setValueAtTime(frequencia, agora);
  volume.gain.setValueAtTime(0.045, agora);
  volume.gain.exponentialRampToValueAtTime(0.001, agora + 0.09);
  oscilador.connect(volume);
  volume.connect(audioJogo.destination);
  oscilador.start(agora);
  oscilador.stop(agora + 0.09);
}

function visitarTelaDaMissao(id) {
  if (
    !jogoLigado ||
    estadoMissao !== "ativa" ||
    telasVisitadas.indexOf(id) !== -1
  ) {
    return;
  }

  telasVisitadas.push(id);
  pontosJogo += 100;
  tocarEfeito(660);

  if (telasVisitadas.length === telasDoJogo.length) {
    estadoMissao = "concluida";
    document.querySelector(".console").classList.remove("missao-ativa");
    document.querySelector(".console").classList.add("missao-concluida");
    document
      .getElementById("botao-start")
      .setAttribute("aria-pressed", "false");
    document.querySelector("#botao-start small").textContent = "START";
    document.getElementById("botao-start").setAttribute(
      "aria-label",
      "Iniciar nova missão"
    );
    tocarEfeito(880);
    atualizarPainelJogo(
      "MISSÃO COMPLETA! Você explorou as 5 telas e ganhou 500 pontos."
    );
    return;
  }

  atualizarPainelJogo(
    "FASE " +
      (telasVisitadas.length) +
      "/5 CONCLUÍDA · +" +
      "100 PONTOS · " +
      document.querySelector('.link-nav[href="#' + id + '"]').textContent.trim()
  );
}

function atualizarControleDirecional() {
  var indiceAtual = telasDoJogo.indexOf(telaAtual);
  document
    .querySelector('[data-direcao="esquerda"]')
    .toggleAttribute("disabled", !jogoLigado || indiceAtual === 0);
  document
    .querySelector('[data-direcao="direita"]')
    .toggleAttribute(
      "disabled",
      !jogoLigado || indiceAtual === telasDoJogo.length - 1
    );
  document
    .querySelector('[data-direcao="cima"]')
    .toggleAttribute("disabled", !jogoLigado);
  document
    .querySelector('[data-direcao="baixo"]')
    .toggleAttribute("disabled", !jogoLigado);
}

function definirEstadoMissao(estado, mensagem) {
  estadoMissao = estado;
  var consoleJogo = document.querySelector(".console");
  var botaoStart = document.getElementById("botao-start");
  var ativa = estado === "ativa";
  consoleJogo.classList.toggle("missao-ativa", ativa);
  consoleJogo.classList.toggle("missao-concluida", estado === "concluida");
  botaoStart.setAttribute("aria-pressed", String(ativa));
  document.querySelector("#botao-start small").textContent = ativa
    ? "PAUSE"
    : "START";
  botaoStart.setAttribute(
    "aria-label",
    ativa ? "Pausar missão" : "Iniciar ou continuar missão"
  );
  atualizarPainelJogo(mensagem);
}

function iniciarOuPausarMissao() {
  if (!jogoLigado) {
    atualizarPainelJogo("Ligue a tela antes de iniciar a missão.");
    return;
  }

  if (estadoMissao === "ativa") {
    definirEstadoMissao("pausada", "MISSÃO PAUSADA · pressione START para continuar.");
    tocarEfeito(330);
    return;
  }

  if (estadoMissao === "parada" || estadoMissao === "concluida") {
    telasVisitadas = [];
    pontosJogo = 0;
    document.querySelector(".console").classList.remove("missao-concluida");
  }

  definirEstadoMissao(
    "ativa",
    "MISSÃO: explore as 5 telas · cada tela nova vale 100 pontos."
  );
  tocarEfeito(520);
  visitarTelaDaMissao(telaAtual);
}

function irParaTelaVizinha(direcao) {
  if (!jogoLigado) {
    atualizarPainelJogo("Ligue a tela para continuar jogando.");
    return;
  }

  var indice = telasDoJogo.indexOf(telaAtual);
  var proximoIndice = indice + direcao;
  if (proximoIndice < 0 || proximoIndice >= telasDoJogo.length) {
    atualizarPainelJogo(
      direcao < 0 ? "VOCÊ ESTÁ NA PRIMEIRA TELA." : "VOCÊ CHEGOU À ÚLTIMA TELA."
    );
    tocarEfeito(220);
    return;
  }
  selecionarTela(telasDoJogo[proximoIndice], true);
}

function moverDirecional(direcao) {
  if (direcao === "esquerda") {
    irParaTelaVizinha(-1);
    return;
  }
  if (direcao === "direita") {
    irParaTelaVizinha(1);
    return;
  }
  if (!jogoLigado) {
    atualizarPainelJogo("Ligue a tela para continuar jogando.");
    return;
  }

  if (direcao === "cima") {
    window.scrollTo({ top: 0, behavior: "smooth" });
  } else {
    window.scrollBy({
      top: Math.max(240, Math.floor(window.innerHeight * 0.7)),
      behavior: "smooth"
    });
  }
}

function alternarEnergia() {
  jogoLigado = !jogoLigado;
  var consoleJogo = document.querySelector(".console");
  var botaoPower = document.getElementById("botao-power");
  consoleJogo.classList.toggle("desligado", !jogoLigado);
  botaoPower.setAttribute("aria-pressed", String(jogoLigado));
  document.querySelector("#botao-power b").textContent = jogoLigado
    ? "ON"
    : "OFF";
  botaoPower.setAttribute(
    "aria-label",
    jogoLigado ? "Desligar tela" : "Ligar tela"
  );
  atualizarControleDirecional();

  if (!jogoLigado) {
    if (estadoMissao === "ativa") {
      missaoPausadaEnergia = true;
      definirEstadoMissao(
        "pausada",
        "TELA DESLIGADA · missão pausada; pressione ON para voltar."
      );
    } else {
      atualizarPainelJogo("TELA DESLIGADA · pressione ON para voltar.");
    }
    tocarEfeito(260);
    return;
  }

  tocarEfeito(520);
  if (estadoMissao === "pausada" && missaoPausadaEnergia) {
    missaoPausadaEnergia = false;
    definirEstadoMissao(
      "ativa",
      "TELA LIGADA · sua missão continua. Explore as próximas telas."
    );
    visitarTelaDaMissao(telaAtual);
  } else if (estadoMissao === "pausada") {
    atualizarPainelJogo("TELA LIGADA · a missão continua pausada; pressione START.");
  } else {
    atualizarPainelJogo("TELA LIGADA · pressione START para jogar.");
  }
}

function alternarSom() {
  if (!somLigado) {
    var ConstrutorAudio = window.AudioContext || window.webkitAudioContext;
    if (!ConstrutorAudio) {
      atualizarPainelJogo("SOM INDISPONÍVEL NESTE NAVEGADOR.");
      return;
    }
    audioJogo = new ConstrutorAudio();
    somLigado = true;
    document.getElementById("botao-sound").setAttribute("aria-pressed", "true");
    document.getElementById("botao-sound").setAttribute(
      "aria-label",
      "Desativar efeitos sonoros"
    );
    document.querySelector("#botao-sound b").textContent = "♫";
    atualizarPainelJogo("EFEITOS SONOROS LIGADOS.");
    tocarEfeito(660);
    return;
  }
  somLigado = false;
  somLigado = false;
  document.getElementById("botao-sound").setAttribute("aria-pressed", "false");
  document.getElementById("botao-sound").setAttribute(
    "aria-label",
    "Ativar efeitos sonoros"
  );
  atualizarPainelJogo("EFEITOS SONOROS DESLIGADOS.");
}

function reiniciarJogo() {
  telasVisitadas = [];
  pontosJogo = 0;
  somLigado = false;
  missaoPausadaEnergia = false;
  document
    .querySelector(".console")
    .classList.toggle("desligado", !jogoLigado);
  document
    .getElementById("botao-power")
    .setAttribute("aria-pressed", String(jogoLigado));
  document.getElementById("botao-power").setAttribute(
    "aria-label",
    jogoLigado ? "Desligar tela" : "Ligar tela"
  );
  document.querySelector("#botao-power b").textContent = jogoLigado
    ? "ON"
    : "OFF";
  document.getElementById("botao-sound").setAttribute("aria-pressed", "false");
  document.getElementById("botao-sound").setAttribute(
    "aria-label",
    "Ativar efeitos sonoros"
  );
  document.querySelector("#botao-sound b").textContent = "♫";
  document.querySelector(".console").classList.remove("missao-ativa");
  definirEstadoMissao("parada", "JOGO REINICIADO · pressione START para uma nova missão.");
  selecionarTela("inicio", true);
  if (!jogoLigado) {
    atualizarPainelJogo("TELA DESLIGADA · pressione ON para ligar o Brick Game.");
  }
  atualizarControleDirecional();
}

function criarElemento(tag, classe, texto) {
  var elemento = document.createElement(tag);
  if (classe) {
    elemento.className = classe;
  }
  if (texto) {
    elemento.textContent = texto;
  }
  return elemento;
}

function desenharProjetos(projetos) {
  var lista = document.getElementById("lista-projetos");
  var resumo = document.getElementById("total-projetos");
  var anos = document.getElementById("anos-projetos");
  lista.replaceChildren();

  if (projetos.length === 0) {
    lista.textContent = "Em breve, novos projetos serão adicionados.";
    resumo.textContent = "0 projetos";
    anos.textContent = "■ A LINHA DO TEMPO COMEÇA AQUI";
    return;
  }

  var projetosOrdenados = projetos.slice().sort(function (a, b) {
    return String(a.ano || "").localeCompare(String(b.ano || ""));
  });
  var anosUnicos = [];

  projetosOrdenados.forEach(function (projeto, indice) {
    var ano = projeto.ano || "Em andamento";
    if (anosUnicos.indexOf(ano) === -1) {
      anosUnicos.push(ano);
    }

    var artigo = criarElemento("article", "cartao-projeto");
    var cabecalho = criarElemento("div", "cabecalho-projeto");
    cabecalho.append(
      criarElemento("span", "rotulo-mono", "PROJETO " + String(indice + 1).padStart(2, "0")),
      criarElemento("span", "periodo-projeto", projeto.periodo)
    );

    var arte = criarElemento("div", "arte-projeto");
    arte.setAttribute("aria-hidden", "true");
    var blocos = criarElemento("div", "mosaico mosaico-projeto");
    for (var bloco = 0; bloco < 6; bloco += 1) {
      blocos.appendChild(document.createElement("i"));
    }
    arte.append(blocos, criarElemento("span", "", "PROJETO EM CONSTRUÇÃO"));

    var titulo = criarElemento("h3", "", projeto.nome);
    var descricao = criarElemento("p", "descricao-projeto", projeto.descricao);
    var tecnologias = criarElemento("div", "tecnologias-projeto");
    tecnologias.appendChild(criarElemento("small", "", "TECNOLOGIAS"));
    var listaTecnologias = criarElemento("div", "etiquetas-tecnologia");
    projeto.tecnologias.forEach(function (tecnologia) {
      listaTecnologias.appendChild(criarElemento("span", "", tecnologia));
    });
    tecnologias.appendChild(listaTecnologias);

    var rodape = criarElemento("div", "rodape-projeto");
    rodape.appendChild(criarElemento("span", "", "PROJETO ACADÊMICO"));
    rodape.appendChild(criarElemento("span", "seta-projeto", "↗"));

    artigo.append(cabecalho, arte, titulo, descricao, tecnologias, rodape);
    lista.appendChild(artigo);
  });

  anos.replaceChildren();
  anos.appendChild(criarElemento("span", "", "■ " + anosUnicos.join("   →   ")));
  resumo.textContent =
    projetosOrdenados.length +
    (projetosOrdenados.length === 1 ? " projeto" : " projetos");
}

function desenharExperiencias(experiencias) {
  var lista = document.getElementById("lista-experiencias");
  lista.replaceChildren();

  if (experiencias.length === 0) {
    lista.textContent =
      "Novas experiências acadêmicas e profissionais serão adicionadas aqui.";
    return;
  }

  experiencias.forEach(function (experiencia) {
    var artigo = criarElemento("article", "cartao-experiencia");
    var meta = criarElemento("div", "meta-experiencia");
    meta.append(
      criarElemento("strong", "", experiencia.categoria.toUpperCase()),
      criarElemento("span", "", experiencia.periodo)
    );

    var descricao = criarElemento("div", "detalhe-experiencia");
    descricao.append(
      criarElemento("h3", "", experiencia.instituicao),
      criarElemento("strong", "cargo-experiencia", experiencia.cargo),
      criarElemento("p", "", experiencia.descricao)
    );
    artigo.append(meta, descricao);
    lista.appendChild(artigo);
  });
}

function iconeRede(nome) {
  if (nome.toLowerCase() === "linkedin") {
    return '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M5 3.5a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM3.3 9h3.4v11H3.3V9Zm5.5 0H12v1.5h.1A3.4 3.4 0 0 1 15.2 9c3.3 0 3.9 2.2 3.9 5v6h-3.4v-5.3c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9V20H8.8V9Z"/></svg>';
  }
  return '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.8c-2.8.6-3.4-1.2-3.4-1.2-.5-1.1-1.1-1.4-1.1-1.4-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.7.4-1.1.6-1.4-2.2-.2-4.5-1.1-4.5-5a3.9 3.9 0 0 1 1-2.7c-.1-.2-.4-1.3.1-2.7 0 0 .8-.3 2.8 1a9.7 9.7 0 0 1 5.1 0c2-1.3 2.8-1 2.8-1 .5 1.4.2 2.5.1 2.7a3.9 3.9 0 0 1 1 2.7c0 3.9-2.3 4.8-4.5 5 .4.3.7.9.7 1.8V21c0 .3.2.6.7.5A10 10 0 0 0 12 2Z"/></svg>';
}

function desenharRedes(redes) {
  var lista = document.getElementById("redes-sociais-contato");
  lista.replaceChildren();

  redes.forEach(function (rede) {
    var link = document.createElement("a");
    link.className = "cartao-canal";
    link.href = rede.link;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.setAttribute("aria-label", "Abrir perfil " + rede.nome);

    var icone = criarElemento("span", "icone-canal");
    icone.setAttribute("aria-hidden", "true");
    icone.innerHTML = iconeRede(rede.nome);
    var texto = criarElemento("span", "texto-canal");
    texto.append(
      criarElemento("strong", "", rede.nome),
      criarElemento(
        "small",
        "",
        new URL(rede.link).hostname.replace(/^www\./, "") +
          decodeURIComponent(new URL(rede.link).pathname).replace(/\/$/, "")
      ),
      criarElemento("b", "", "Visitar perfil ↗")
    );
    link.append(icone, texto);
    lista.appendChild(link);
  });
}

function selecionarTela(id, adicionarAoHistorico) {
  var telaSelecionada = document.getElementById(id);
  if (!telaSelecionada || !telaSelecionada.classList.contains("painel")) {
    return;
  }

  document.querySelectorAll(".painel").forEach(function (painel) {
    painel.hidden = painel !== telaSelecionada;
  });
  telaAtual = id;

  document.querySelectorAll(".link-nav").forEach(function (link) {
    var ativo = link.getAttribute("href") === "#" + id;
    link.classList.toggle("ativo", ativo);
    if (ativo) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });

  if (
    adicionarAoHistorico &&
    window.location.hash !== "#" + id
  ) {
    window.history.pushState(null, "", "#" + id);
  }

  if (estadoMissao === "parada") {
    atualizarPainelJogo(
      "TELA " +
        (telasDoJogo.indexOf(id) + 1) +
        "/5 · pressione START para iniciar a missão."
    );
  } else if (estadoMissao === "pausada") {
    atualizarPainelJogo("MISSÃO PAUSADA · pressione START para continuar.");
  }
  atualizarControleDirecional();
  visitarTelaDaMissao(id);
  window.scrollTo(0, 0);
}

function configurarNavegacao() {
  document.addEventListener("click", function (evento) {
    var link = evento.target.closest('a[href^="#"]');
    if (!link) {
      return;
    }

    var id = link.getAttribute("href").slice(1);
    if (!document.getElementById(id) || !document.getElementById(id).classList.contains("painel")) {
      return;
    }

    evento.preventDefault();
    selecionarTela(id, true);
  });

  function sincronizarTelaComEndereco() {
    var id = window.location.hash.slice(1) || "inicio";
    selecionarTela(id, false);
  }

  window.addEventListener("popstate", sincronizarTelaComEndereco);
  window.addEventListener("hashchange", sincronizarTelaComEndereco);
  sincronizarTelaComEndereco();
}

document.getElementById("botao-reset").addEventListener("click", function () {
  reiniciarJogo();
});

document.getElementById("botao-power").addEventListener("click", alternarEnergia);
document
  .getElementById("botao-power-prompt")
  .addEventListener("click", alternarEnergia);
document
  .getElementById("botao-start")
  .addEventListener("click", iniciarOuPausarMissao);
document.getElementById("botao-sound").addEventListener("click", alternarSom);
document.querySelectorAll("[data-direcao]").forEach(function (botao) {
  botao.addEventListener("click", function () {
    moverDirecional(botao.getAttribute("data-direcao"));
  });
});

document.addEventListener("keydown", function (evento) {
  if (evento.target.closest("input, textarea, select, [contenteditable='true']")) {
    return;
  }

  if (evento.key === "ArrowLeft" || evento.key === "ArrowRight") {
    evento.preventDefault();
    moverDirecional(evento.key === "ArrowLeft" ? "esquerda" : "direita");
  } else if (evento.key === "ArrowUp" || evento.key === "ArrowDown") {
    evento.preventDefault();
    moverDirecional(evento.key === "ArrowUp" ? "cima" : "baixo");
  } else if (
    !evento.target.closest("button, a") &&
    evento.key === " "
  ) {
    evento.preventDefault();
    iniciarOuPausarMissao();
  } else if (!evento.target.closest("button, a") && evento.key.toLowerCase() === "m") {
    alternarSom();
  } else if (!evento.target.closest("button, a") && evento.key.toLowerCase() === "r") {
    reiniciarJogo();
  }
});

configurarNavegacao();
atualizarControleDirecional();
atualizarPainelJogo(
  "TELA DESLIGADA · pressione ON para ligar o Brick Game."
);

document.getElementById("formulario-contato").addEventListener("submit", function (evento) {
  evento.preventDefault();

  var formulario = evento.currentTarget;
  var nome = formulario.elements.nome.value.trim();
  var email = formulario.elements.email.value.trim();
  var mensagem = formulario.elements.mensagem.value.trim();

  if (!nome || !email || !mensagem) {
    formulario.reportValidity();
    return;
  }

  var corpo = "De: " + nome + " <" + email + ">\n\n" + mensagem;
  var destinatario = dadosPortfolio.email;
  var linkEnvio =
    "mailto:" + destinatario +
    "?subject=" + encodeURIComponent(formulario.elements.assunto.value) +
    "&body=" + encodeURIComponent(corpo);

  document.getElementById("status-contato").textContent =
    "Seu aplicativo de e-mail será aberto para concluir o envio.";
  window.location.href = linkEnvio;
});

fetch("data/portfolio.json")
  .then(function (resposta) {
    if (!resposta.ok) {
      throw new Error("A resposta do arquivo de dados não foi bem-sucedida.");
    }
    return resposta.json();
  })
  .then(function (dados) {
    dadosPortfolio = dados;
    document.getElementById("nome-curto").textContent = dados.nome.split(" ")[0];
    document.getElementById("nome-sobre").textContent = dados.nome;
    document.getElementById("area-destaque").textContent = dados.area;
    document.getElementById("introducao").textContent = dados.introducao;
    document.getElementById("formacao").textContent =
      dados.formacao + " · PUC Minas";
    document.getElementById("area-sobre").textContent =
      "Ciência da Computação";
    document.getElementById("sobre-texto").textContent = dados.sobre;
    document.getElementById("sobre-texto-en").textContent = dados.sobreEn;
    document.getElementById("interesses").textContent = dados.interesses;
    document.getElementById("objetivo").textContent = dados.objetivo;

    var cartaoEmail = document.getElementById("cartao-email");
    cartaoEmail.href = "mailto:" + dados.email;
    document.getElementById("email-cartao").textContent = dados.email;
    desenharProjetos(dados.projetos);
    desenharExperiencias(dados.experiencias);
    desenharRedes(dados.redesSociais);
  })
  .catch(function (erro) {
    console.error("Erro ao carregar o arquivo JSON:", erro);
    document.getElementById("lista-projetos").textContent =
      "Não foi possível carregar os dados. Abra o site usando Live Server.";
    document.getElementById("lista-experiencias").textContent =
      "Não foi possível carregar os dados. Abra o site usando Live Server.";
  });
