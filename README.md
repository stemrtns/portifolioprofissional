# Portfólio Profissional — Stefânia Alves Martins

Portfólio responsivo desenvolvido para a disciplina de Desenvolvimento de Interfaces Web (DIW) da PUC Minas. A interface tem identidade visual inspirada no Brick Game e apresenta a trajetória acadêmica e profissional da autora.

## Funcionalidades

- Navegação por cinco seções: início, sobre mim, projetos, experiências e contato.
- Conteúdo da interface e biografia disponíveis em português e inglês.
- Projetos carregados de `data/portfolio.json`, organizados por ano e com links para seus repositórios.
- Perfil, experiências e canais de contato carregados do mesmo arquivo JSON.
- Formulário com validação do navegador. Ao enviar, abre um rascunho no aplicativo de e-mail do visitante; o site não envia mensagens por um servidor.
- Layout responsivo para celular e desktop.

## Tecnologias utilizadas

- HTML5
- CSS3 (Grid, Flexbox, variáveis CSS e media queries)
- JavaScript sem bibliotecas externas
- JSON para os dados do portfólio e as traduções
- Git e GitHub

Não há dependências de pacotes nem etapa de compilação.

## Estrutura do projeto

```text
.
├── .github/workflows/deploy-pages.yml
├── data/portfolio.json
├── images/
├── wireframes/
├── index.html
├── script.js
├── styles.css
└── README.md
```

## Executar localmente

1. Clone o repositório e abra a pasta no Visual Studio Code:

   ```bash
   git clone https://github.com/stemrtns/portifolioprofissional.git
   cd portifolioprofissional
   ```

2. Inicie um servidor local. No VS Code, instale a extensão **Live Server**, clique com o botão direito em `index.html` e selecione **Open with Live Server**.

O servidor local é necessário para que o navegador consiga carregar `data/portfolio.json` com `fetch`.

## Projetos

- [Shops Oiuaiporque](https://github.com/stemrtns/shops-oiuaiporque) — simulação de loja virtual com HTML e CSS.
- [Portfólio Profissional](https://github.com/stemrtns/portifolioprofissional) — este portfólio.

As imagens dos cards ficam em `images/`. A prévia do portfólio é um wireframe do projeto, não uma captura da versão publicada.

## Wireframes

| Página | Desktop | Mobile |
| --- | --- | --- |
| Início | <img width="280" alt="Wireframe desktop da página inicial" src="./wireframes/WireFrame%20(1)_page-0001.jpg"> | <img width="140" alt="Wireframe mobile da página inicial" src="./wireframes/WireFrame%20(1)_page-0002.jpg"> |
| Sobre mim | <img width="280" alt="Wireframe desktop da página Sobre mim" src="./wireframes/WireFrame%20(1)_page-0008.jpg"> | <img width="140" alt="Wireframe mobile da página Sobre mim" src="./wireframes/WireFrame%20(1)_page-0004.jpg"> |
| Projetos | <img width="280" alt="Wireframe desktop da página de projetos" src="./wireframes/WireFrame%20(1)_page-0009.jpg"> | <img width="140" alt="Wireframe mobile da página de projetos" src="./wireframes/WireFrame%20(1)_page-0006.jpg"> |
| Experiências | <img width="280" alt="Wireframe desktop da página de experiências" src="./wireframes/WireFrame%20(1)_page-0007.jpg"> | <img width="140" alt="Wireframe mobile da página de experiências" src="./wireframes/WireFrame%20(1)_page-0003.jpg"> |
| Contato | <img width="280" alt="Wireframe desktop da página de contato" src="./wireframes/WireFrame%20(1)_page-0010.jpg"> | <img width="140" alt="Wireframe mobile da página de contato" src="./wireframes/WireFrame%20(1)_page-0005.jpg"> |

## Publicação no GitHub Pages

O repositório inclui um workflow pronto para publicar os arquivos estáticos no GitHub Pages a cada push para `main`. Para ativar:

1. No GitHub, abra **Settings → Pages** e escolha **GitHub Actions** como fonte de publicação.
2. Envie as alterações para a branch `main`.
3. Confira a execução do workflow **Deploy to GitHub Pages** na aba **Actions**.

Depois que a primeira execução terminar com sucesso, o site deverá estar disponível em [stemrtns.github.io/portifolioprofissional](https://stemrtns.github.io/portifolioprofissional/). A URL ainda não está publicada até essa configuração e execução.

## Autora

**Stefânia Alves Martins** — estudante de Ciência da Computação na PUC Minas.

[Perfil no GitHub](https://github.com/stemrtns)
