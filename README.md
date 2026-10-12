# Portfólio acadêmico — Stefânia Alves Martins

Este portfólio acadêmico foi desenvolvido para a disciplina de Desenvolvimento de Interfaces Web (DIW). Sou estudante de Ciência da Computação, atualmente no segundo período, e estou construindo minha trajetória na área de tecnologia. Tenho interesse em desenvolvimento de software e na criação de soluções digitais.

O projeto utiliza HTML para estruturar o conteúdo, CSS para definir a apresentação visual, JavaScript para carregar os dados e JSON para armazenar as informações do perfil.

## Wireframe da interface

[WireFrame (1).pdf](<wireframes/WireFrame (1).pdf>)

O wireframe apresenta as versões para computador e celular e define a identidade visual BRICK: moldura de terminal, tela verde-sálvia, navegação escura e destaques amarelos.

## Sprint 2

- Layout implementado seguindo o wireframe: identidade BRICK, moldura de terminal, tela verde-sálvia e navegação com destaque amarelo.
- As cinco seções funcionam como telas independentes: o menu troca a tela exibida em vez de empilhar todas em uma página longa. Os links de voltar/avançar do navegador acompanham a navegação.
- Início com apresentação, ilustração geométrica e atalhos para as seções.
- Seção "Sobre mim" com conteúdo em português e inglês, formação, interesses e objetivo profissional.
- Projetos exibidos em cartões organizados por ano na linha do tempo, gerados a partir de `data/portfolio.json`.
- Experiências acadêmicas organizadas em cartões com categoria, instituição, período e descrição.
- Contato com e-mail, perfis reais de LinkedIn e GitHub, além de formulário com campos obrigatórios e validação de formato de e-mail.
- O envio do formulário prepara uma mensagem e abre o aplicativo de e-mail configurado no dispositivo. O site é estático e não envia mensagens por um servidor.
- Composição responsiva para desktop e celular e controles visuais de Brick Game no rodapé. Se uma tela ultrapassar o espaço disponível, ela pode rolar sem mostrar as outras seções.
- Os controles do jogo são interativos: ON/OFF liga a tela, START inicia/pausa uma missão, SOUND ativa efeitos sonoros, o direcional navega entre telas e RESET reinicia a pontuação.
- O portfólio inicia com a tela desligada: pressione o botão ON no rodapé ou o comando amarelo na tela para começar. RESET reinicia a missão sem ligar a tela automaticamente.
- Na missão, cada tela visitada pela primeira vez vale 100 pontos. Explore as cinco telas para concluir o desafio com 500 pontos. O teclado também funciona: setas navegam/rolam, Espaço inicia ou pausa, M ativa/desativa o som e R reinicia.
- Os botões físicos do jogo foram ampliados para facilitar o uso no desktop e em dispositivos móveis.

## Como abrir

No VS Code, instale a extensão **Live Server** se ainda não tiver. Depois:

1. Abra o arquivo `index.html`.
2. Clique com o botão direito dentro do arquivo.
3. Escolha **Open with Live Server**.

O Live Server é necessário porque o navegador precisa buscar os dados do arquivo JSON.

## Onde mudar as informações

As informações ficam em `data/portfolio.json`. Para editar uma informação, mude o texto entre aspas e mantenha a vírgula no final da linha quando necessário. Por exemplo:

```json
"area": "Estudante de Ciência da Computação",
"formacao": "Ciência da Computação — 2º período"
```

Não apague as aspas, as chaves `{ }` ou os colchetes `[ ]`: eles fazem parte do formato JSON.

As listas `projetos`, `experiencias` e `redesSociais` ficam entre colchetes. Projetos e experiências são gerados a partir desses dados; podem ser acrescentados seguindo os campos dos objetos existentes. Os campos terminados em `En` contêm as versões em inglês.

## Como as partes se conectam

- `index.html` tem os títulos, as seções e os lugares onde o conteúdo aparece.
- `styles.css` define a identidade visual e adapta o layout para diferentes tamanhos de tela.
- `script.js` busca o JSON, cria as listas e prepara o formulário de contato.
- `data/portfolio.json` guarda os dados pessoais e as listas.
- `wireframes/` contém o rascunho da página de perfil para computador.

## Arquivos

- `index.html`: conteúdo e seções da página.
- `styles.css`: cores, tamanhos e organização visual.
- `script.js`: lê o JSON e coloca os dados na página.
- `data/portfolio.json`: textos, projetos e experiências.
- `images/foto-perfil.jpeg`: foto de referência guardada no projeto.
- `wireframes/`: material de planejamento da interface.

## Sprint 1

- Planejamento das seções: apresentação, perfil, projetos, experiências e contato.
- Elaboração de um wireframe para computador.
- Implementação do protótipo inicial e da navegação entre seções.
