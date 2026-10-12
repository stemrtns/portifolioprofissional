var dadosPortfolio;
var idiomaAtual = "pt";
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

function texto(chave) {
  var idioma = dadosPortfolio && dadosPortfolio.interface
    ? dadosPortfolio.interface[idiomaAtual]
    : null;
  return idioma && idioma[chave] ? idioma[chave] : chave;
}

function aplicarIdioma() {
  document.documentElement.lang = idiomaAtual === "en" ? "en" : "pt-BR";
  document.title = "BRICK / " + texto("site.brand") + " — Stefânia Alves Martins";

  document.querySelectorAll("[data-i18n]").forEach(function (elemento) {
    elemento.textContent = texto(elemento.getAttribute("data-i18n"));
  });
  document.querySelectorAll("[data-i18n-aria-label]").forEach(function (elemento) {
    elemento.setAttribute(
      "aria-label",
      texto(elemento.getAttribute("data-i18n-aria-label"))
    );
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(function (elemento) {
    elemento.setAttribute(
      "placeholder",
      texto(elemento.getAttribute("data-i18n-placeholder"))
    );
  });
  document.querySelectorAll("[data-i18n-value]").forEach(function (elemento) {
    elemento.value = texto(elemento.getAttribute("data-i18n-value"));
  });
  document.querySelectorAll("[data-i18n-alt]").forEach(function (elemento) {
    elemento.setAttribute("alt", texto(elemento.getAttribute("data-i18n-alt")));
  });
  document.querySelectorAll("[data-idioma]").forEach(function (botao) {
    var ativo = botao.getAttribute("data-idioma") === idiomaAtual;
    botao.classList.toggle("ativo", ativo);
    botao.setAttribute("aria-pressed", String(ativo));
  });

  if (dadosPortfolio) {
    renderizarDadosDoPortfolio();
  }
  atualizarRotulosControles();
  atualizarEstadoVisivelDoJogo();
}

function atualizarRotulosControles() {
  document.getElementById("botao-power").setAttribute(
    "aria-label",
    texto(jogoLigado ? "controls.powerOn" : "controls.powerOff")
  );
  document.getElementById("botao-start").setAttribute(
    "aria-label",
    texto(estadoMissao === "ativa" ? "controls.pause" :
      estadoMissao === "concluida" ? "controls.startNew" : "controls.start")
  );
  document.getElementById("botao-sound").setAttribute(
    "aria-label",
    texto(somLigado ? "controls.soundOff" : "controls.soundOn")
  );
}

function atualizarEstadoVisivelDoJogo() {
  if (!jogoLigado && estadoMissao !== "ativa") {
    atualizarPainelJogo(texto("game.off"));
  } else if (estadoMissao === "parada") {
    atualizarPainelJogo(
      texto("game.screen").replace(
        "{screen}",
        String(telasDoJogo.indexOf(telaAtual) + 1).padStart(2, "0")
      )
    );
  } else if (estadoMissao === "pausada") {
    atualizarPainelJogo(texto("game.paused"));
  } else if (estadoMissao === "concluida") {
    atualizarPainelJogo(texto("game.complete"));
  } else {
    atualizarPainelJogo(texto("game.mission"));
  }
}

document.querySelectorAll("[data-idioma]").forEach(function (botao) {
  botao.addEventListener("click", function () {
    idiomaAtual = botao.getAttribute("data-idioma");
    if (idiomaAtual !== "pt" && idiomaAtual !== "en") {
      idiomaAtual = "pt";
    }
    aplicarIdioma();
  });
});

function atualizarPainelJogo(mensagem) {
  document.getElementById("status-jogo").textContent = mensagem;
  document.getElementById("pontuacao-jogo").textContent =
    texto("game.score") +
    " " +
    String(pontosJogo).padStart(4, "0") +
    " · " +
    texto("game.screens") +
    " " +
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
      texto("game.complete")
    );
    return;
  }

  atualizarPainelJogo(
    texto("game.phase")
      .replace("{phase}", String(telasVisitadas.length))
      .replace(
        "{screen}",
        document.querySelector(
          '.link-nav[href="#' + id + '"] [data-i18n]'
        ).textContent
      )
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
    texto(ativa ? "controls.pause" :
      estado === "concluida" ? "controls.startNew" : "controls.start")
  );
  atualizarPainelJogo(mensagem);
}

function iniciarOuPausarMissao() {
  if (!jogoLigado) {
    atualizarPainelJogo(texto("game.startRequired"));
    return;
  }

  if (estadoMissao === "ativa") {
    definirEstadoMissao("pausada", texto("game.paused"));
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
    texto("game.mission")
  );
  tocarEfeito(520);
  visitarTelaDaMissao(telaAtual);
}

function irParaTelaVizinha(direcao) {
  if (!jogoLigado) {
    atualizarPainelJogo(texto("game.powerRequired"));
    return;
  }

  var indice = telasDoJogo.indexOf(telaAtual);
  var proximoIndice = indice + direcao;
  if (proximoIndice < 0 || proximoIndice >= telasDoJogo.length) {
    atualizarPainelJogo(
      direcao < 0 ? texto("game.first") : texto("game.last")
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
    atualizarPainelJogo(texto("game.powerRequired"));
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
    texto(jogoLigado ? "controls.powerOn" : "controls.powerOff")
  );
  atualizarControleDirecional();

  if (!jogoLigado) {
    if (estadoMissao === "ativa") {
      missaoPausadaEnergia = true;
      definirEstadoMissao(
        "pausada",
        texto("game.pausedPower")
      );
    } else {
      atualizarPainelJogo(texto("game.screenOff"));
    }
    tocarEfeito(260);
    return;
  }

  tocarEfeito(520);
  if (estadoMissao === "pausada" && missaoPausadaEnergia) {
    missaoPausadaEnergia = false;
    definirEstadoMissao(
      "ativa",
      texto("game.resume")
    );
    visitarTelaDaMissao(telaAtual);
  } else if (estadoMissao === "pausada") {
    atualizarPainelJogo(texto("game.paused"));
  } else {
    atualizarPainelJogo(texto("game.ready"));
  }
}

function alternarSom() {
  if (!somLigado) {
    var ConstrutorAudio = window.AudioContext || window.webkitAudioContext;
    if (!ConstrutorAudio) {
      atualizarPainelJogo(texto("game.soundUnavailable"));
      return;
    }
    audioJogo = new ConstrutorAudio();
    somLigado = true;
    document.getElementById("botao-sound").setAttribute("aria-pressed", "true");
    document.getElementById("botao-sound").setAttribute(
      "aria-label",
      texto("controls.soundOff")
    );
    document.querySelector("#botao-sound b").textContent = "♫";
    atualizarPainelJogo(texto("game.soundOn"));
    tocarEfeito(660);
    return;
  }
  somLigado = false;
  somLigado = false;
  document.getElementById("botao-sound").setAttribute("aria-pressed", "false");
  document.getElementById("botao-sound").setAttribute(
    "aria-label",
    texto("controls.soundOn")
  );
  atualizarPainelJogo(texto("game.soundOff"));
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
    texto(jogoLigado ? "controls.powerOn" : "controls.powerOff")
  );
  document.querySelector("#botao-power b").textContent = jogoLigado
    ? "ON"
    : "OFF";
  document.getElementById("botao-sound").setAttribute("aria-pressed", "false");
  document.getElementById("botao-sound").setAttribute(
    "aria-label",
    texto("controls.soundOn")
  );
  document.querySelector("#botao-sound b").textContent = "♫";
  document.querySelector(".console").classList.remove("missao-ativa");
  definirEstadoMissao("parada", texto("game.reset"));
  selecionarTela("inicio", true);
  if (!jogoLigado) {
    atualizarPainelJogo(texto("game.off"));
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
    lista.textContent = texto("project.empty");
    resumo.textContent = "0 projetos";
    anos.textContent = "■ " + texto("project.timelineStart");
    return;
  }

  var projetosOrdenados = projetos.slice().sort(function (a, b) {
    return String(a.ano || "").localeCompare(String(b.ano || ""));
  });
  var anosUnicos = [];

  projetosOrdenados.forEach(function (projeto, indice) {
    var ano = projeto.ano || texto("project.year");
    if (anosUnicos.indexOf(ano) === -1) {
      anosUnicos.push(ano);
    }

    var artigo = criarElemento("article", "cartao-projeto");
    var cabecalho = criarElemento("div", "cabecalho-projeto");
    cabecalho.append(
      criarElemento("span", "rotulo-mono", texto("project.label") + " " + String(indice + 1).padStart(2, "0")),
      criarElemento("span", "periodo-projeto", projeto.periodo)
    );

    var arte = criarElemento("div", "arte-projeto");
    if (projeto.imagem) {
      var imagem = criarElemento("img", "imagem-projeto");
      imagem.src = projeto.imagem;
      imagem.alt = projeto.imagemAlt || "";
      imagem.loading = "lazy";
      imagem.decoding = "async";
      arte.appendChild(imagem);
    } else {
      arte.setAttribute("aria-hidden", "true");
      var blocos = criarElemento("div", "mosaico mosaico-projeto");
      for (var bloco = 0; bloco < 6; bloco += 1) {
        blocos.appendChild(document.createElement("i"));
      }
      arte.append(blocos, criarElemento("span", "", texto("project.building")));
    }

    var titulo = criarElemento("h3", "", projeto.nome);
    var descricao = criarElemento("p", "descricao-projeto", projeto.descricao);
    var tecnologias = criarElemento("div", "tecnologias-projeto");
    tecnologias.appendChild(criarElemento("small", "", texto("project.technologies")));
    var listaTecnologias = criarElemento("div", "etiquetas-tecnologia");
    projeto.tecnologias.forEach(function (tecnologia) {
      listaTecnologias.appendChild(criarElemento("span", "", tecnologia));
    });
    tecnologias.appendChild(listaTecnologias);

    var rodape = criarElemento("div", "rodape-projeto");
    var linkGitHub = criarElemento("a", "link-projeto", texto("project.github"));
    linkGitHub.href = projeto.linkGithub;
    linkGitHub.target = "_blank";
    linkGitHub.rel = "noopener noreferrer";
    rodape.appendChild(linkGitHub);

    artigo.append(cabecalho, arte, titulo, descricao, tecnologias, rodape);
    lista.appendChild(artigo);
  });

  anos.replaceChildren();
  anos.appendChild(
    criarElemento("span", "", "■ " + anosUnicos.join("   →   "))
  );
  resumo.textContent =
    projetosOrdenados.length +
    " " +
    texto(projetosOrdenados.length === 1 ? "project.countOne" : "project.countMany");
}

function desenharExperiencias(experiencias) {
  var lista = document.getElementById("lista-experiencias");
  lista.replaceChildren();

  if (experiencias.length === 0) {
    lista.textContent = texto("experience.empty");
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
  var nomeNormalizado = nome.toLowerCase();
  if (nomeNormalizado === "linkedin") {
    return '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M5 3.5a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM3.3 9h3.4v11H3.3V9Zm5.5 0H12v1.5h.1A3.4 3.4 0 0 1 15.2 9c3.3 0 3.9 2.2 3.9 5v6h-3.4v-5.3c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9V20H8.8V9Z"/></svg>';
  }
  if (nomeNormalizado === "whatsapp") {
    return '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M20.5 11.8a8.5 8.5 0 0 1-12.6 7.4L3 20.5l1.4-4.7A8.5 8.5 0 1 1 20.5 11.8Z"/><path d="M8.5 7.8c.2-.4.4-.4.7-.4h.5c.2 0 .4.1.5.4l.8 1.9c.1.2 0 .4-.1.6l-.6.7c-.2.2-.2.4 0 .6.5.9 1.2 1.6 2.1 2.1.2.1.4.1.6-.1l.8-.9c.2-.2.4-.2.6-.1l1.8.9c.2.1.3.3.3.5 0 .4-.2 1-.6 1.3-.5.5-1.2.7-2 .5-1-.2-2.3-.8-3.5-1.9-1.5-1.3-2.5-3-2.7-4-.2-.8.1-1.6.5-2.1Z"/></svg>';
  }
  if (nomeNormalizado === "github") {
    return '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.8c-2.8.6-3.4-1.2-3.4-1.2-.5-1.1-1.1-1.4-1.1-1.4-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.7.4-1.1.6-1.4-2.2-.2-4.5-1.1-4.5-5a3.9 3.9 0 0 1 1-2.7c-.1-.2-.4-1.3.1-2.7 0 0 .8-.3 2.8 1a9.7 9.7 0 0 1 5.1 0c2-1.3 2.8-1 2.8-1 .5 1.4.2 2.5.1 2.7a3.9 3.9 0 0 1 1 2.7c0 3.9-2.3 4.8-4.5 5 .4.3.7.9.7 1.8V21c0 .3.2.6.7.5A10 10 0 0 0 12 2Z"/></svg>';
  }
  return "";
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
    link.setAttribute(
      "aria-label",
      rede.nome.toLowerCase() === "whatsapp"
        ? texto("contact.whatsappAria")
        : texto("contact.profileAria") + " " + rede.nome
    );

    var icone = criarElemento("span", "icone-canal");
    icone.setAttribute("aria-hidden", "true");
    icone.innerHTML = iconeRede(rede.nome);
    var blocoTexto = criarElemento("span", "texto-canal");
    blocoTexto.append(
      criarElemento("strong", "", rede.nome),
      criarElemento(
        "small",
        "",
        rede.descricao ||
          new URL(rede.link).hostname.replace(/^www\./, "") +
            decodeURIComponent(new URL(rede.link).pathname).replace(/\/$/, "")
      ),
      criarElemento(
        "b",
        "",
        rede.acao ||
          (rede.nome.toLowerCase() === "whatsapp"
            ? texto("contact.whatsappAction")
            : texto("contact.linkedinAction"))
      )
    );
    link.append(icone, blocoTexto);
    lista.appendChild(link);
  });
}

function renderizarDadosDoPortfolio() {
  var perfil = dadosPortfolio.perfil;
  var contato = dadosPortfolio.contato;
  var ingles = idiomaAtual === "en";

  document.getElementById("nome-curto").textContent =
    perfil.nome.split(" ")[0];
  document.getElementById("nome-sobre").textContent = perfil.nome;
  document.getElementById("area-destaque").textContent =
    ingles ? perfil.titulo_en : perfil.titulo_pt;
  document.getElementById("introducao").textContent =
    ingles ? perfil.descricao_en : perfil.descricao_pt;
  document.getElementById("formacao").textContent =
    (ingles ? perfil.formacao_en : perfil.formacao)
      .replace(/ - PUC Minas$/, "")
      .replace(/ · PUC Minas$/, "") +
    " · PUC Minas";
  document.getElementById("area-sobre").textContent =
    ingles ? perfil.area_estudo_en : perfil.area_estudo;
  document.getElementById("sobre-texto").textContent =
    ingles ? perfil.sobre_en : perfil.sobre_pt;
  document.getElementById("interesses").textContent =
    ingles ? perfil.interesses_en : perfil.interesses;
  document.getElementById("objetivo").textContent =
    ingles ? perfil.objetivo_en : perfil.objetivo;

  var cartaoEmail = document.getElementById("cartao-email");
  cartaoEmail.href = "mailto:" + contato.email;
  document.getElementById("email-cartao").textContent = contato.email;
  desenharProjetos(
    dadosPortfolio.projetos.map(function (projeto) {
      return {
        ano: projeto.ano,
        nome: ingles ? projeto.titulo_en || projeto.titulo : projeto.titulo,
        periodo: projeto.ano,
        descricao: ingles ? projeto.descricao_en || projeto.descricao : projeto.descricao,
        tecnologias: projeto.tecnologias,
        imagem: projeto.imagem,
        imagemAlt: ingles
          ? projeto.imagem_alt_en || projeto.imagem_alt
          : projeto.imagem_alt,
        linkGithub: projeto.link_github
      };
    })
  );
  desenharExperiencias(
    dadosPortfolio.experiencias.map(function (experiencia) {
      return {
        categoria: ingles ? experiencia.tipo_en || experiencia.tipo : experiencia.tipo,
        periodo: ingles ? experiencia.periodo_en || experiencia.periodo : experiencia.periodo,
        instituicao: experiencia.empresa,
        cargo: ingles ? experiencia.cargo_en || experiencia.cargo : experiencia.cargo,
        descricao: ingles
          ? experiencia.descricao_en || experiencia.descricao
          : experiencia.descricao
      };
    })
  );
  desenharRedes([
    {
      nome: "WhatsApp",
      link: "https://wa.me/" + contato.whatsapp.replace(/\D/g, ""),
      descricao: contato.whatsapp,
      acao: texto("contact.whatsappAction")
    },
    {
      nome: "LinkedIn",
      link: contato.linkedin,
      acao: texto("contact.linkedinAction")
    }
  ]);
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
      texto("game.screen").replace(
        "{screen}",
        String(telasDoJogo.indexOf(id) + 1).padStart(2, "0")
      )
    );
  } else if (estadoMissao === "pausada") {
    atualizarPainelJogo(texto("game.paused"));
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
  var destinatario = dadosPortfolio.contato.email;
  var linkEnvio =
    "mailto:" + destinatario +
    "?subject=" + encodeURIComponent(formulario.elements.assunto.value) +
    "&body=" + encodeURIComponent(corpo);

  document.getElementById("status-contato").textContent =
    texto("contact.mailtoStatus");
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
    aplicarIdioma();
  })
  .catch(function (erro) {
    console.error("Erro ao carregar o arquivo JSON:", erro);
    document.getElementById("lista-projetos").textContent =
      texto("data.error");
    document.getElementById("lista-experiencias").textContent =
      texto("data.error");
  });
