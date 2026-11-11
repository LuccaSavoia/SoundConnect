# SoundConnect — Experiência aberta (sem login)

Abra o site e explore imediatamente: **não é necessário cadastrar e-mail ou senha**. O projeto cria automaticamente um perfil de teste anônimo por navegador. No menu, acesse **Sobre o site** para conhecer a proposta CitizenTech, público-alvo, ODS e funcionamento.

## Executar

```bash
npm install
npm run dev
```

Acesse http://localhost:5173. O servidor da API opera em http://localhost:3001/api/health. Apenas o comando `npm run dev` é necessário para iniciar ambos.

## O que é experimental

- Perfis de Lara, Gabriel, Bia e Rafa são fictícios e identificados no sistema como perfis de demonstração.
- Convites enviados a perfis fictícios são aceitos automaticamente, para que a conversa possa ser testada sem outra pessoa conectada.
- As respostas dos perfis fictícios são automáticas e não são mensagens de usuários reais.
- As recomendações calculam semelhança de artistas favoritos (Jaccard); não há IA generativa ou Spotify integrado.
- As preferências, mensagens, conexões e playlists são persistidas no arquivo local `server/data.json`. Não coloque dados pessoais reais no protótipo.
- As telas de cadastro e login foram removidas da experiência. O aplicativo cria uma sessão experimental automaticamente.

---

# SoundConnect – Conectando pessoas através da música

Aplicação MVP da CitizenTech **SoundConnect**, desenvolvido com **React, JavaScript e Vite**, com foco em aproximar pessoas por afinidades musicais.

## Proposta da CitizenTech

### 1. Nome da CitizenTech

**SoundConnect – Conectando pessoas através da música**

### 2. Cidade e bairro

São Paulo, SP – Aplicativo digital com alcance inicial em toda a cidade, sem restrição de bairro.

### 3. Cidadão beneficiado

Pessoas que enfrentam dificuldades de socialização, timidez, solidão ou isolamento social, especialmente jovens e adultos que desejam construir novas amizades.

### 4. Problema, em uma frase

A dificuldade de estabelecer conexões sociais e encontrar pessoas com interesses semelhantes contribui para o isolamento e a solidão.

### 5. Como funciona

O usuário cadastra suas preferências musicais e uma inteligência artificial analisa artistas, gêneros e músicas favoritas para identificar pessoas com gostos semelhantes, sugerindo conexões e facilitando o início de conversas.

### 6. O que cada parte faz

**Usuário:** cadastra seus gostos musicais, recebe sugestões de pessoas compatíveis e interage por meio de conversas e playlists.

**Inteligência artificial:** analisa as preferências musicais, identifica afinidades, recomenda conexões e sugere assuntos para facilitar a comunicação.

**Aplicativo:** disponibiliza os perfis, o sistema de recomendações, o chat e os recursos de segurança e privacidade.

### 7. Indicador de impacto

Percentual de usuários que estabelecem ao menos uma conexão social recíproca por meio do aplicativo, considerando conversas iniciadas e interações mantidas ao longo de 30 dias.

### 8. ODS conectados

**ODS 3 – Saúde e Bem-Estar:** promoção do bem-estar emocional por meio da socialização e redução do isolamento.

**ODS 10 – Redução das Desigualdades:** promoção da inclusão social de pessoas que enfrentam dificuldades de interação.

**ODS 11 – Cidades e Comunidades Sustentáveis:** fortalecimento de vínculos sociais e incentivo à formação de comunidades mais inclusivas.

---

## Estrutura do projeto

```text
src/
  components/NavBar.jsx
  pages/home.jsx
  pages/produtos.jsx
  pages/contato.jsx
  pages/Sobre.jsx
  pages/SobreSite.jsx
  App.jsx
  api.js
  index.css
  main.jsx
server/
  index.js
  dev.mjs
  test.js
```

## Interações disponíveis

- Descobrir pessoas e filtrar por artistas e estilos musicais.
- Editar o perfil de teste, sem e-mail nem senha.
- Conectar-se aos perfis fictícios (aceitação automática no modo experimental).
- Trocar mensagens com respostas automáticas claramente identificadas como simulação.
- Criar playlists e adicionar músicas.
- Consultar a página **Sobre o site** e a proposta CitizenTech.
- Testar a API com `npm test`.

## Avisos técnicos

Este é um projeto de demonstração local, não um produto pronto para acesso público. Não existe autenticação de produção, moderação ativa ou infraestrutura para armazenar dados pessoais com segurança. O modo experimental utiliza um identificador aleatório por navegador e uma sessão temporária de API para associar as ações ao perfil de teste, sem exigir login. Não publique a API como serviço aberto na internet sem revisão de segurança.


## Estilização com Tailwind CSS

Esta versão utiliza **Tailwind CSS 3** com Vite e PostCSS. O arquivo `tailwind.config.cjs` define as cores e as fontes do projeto; `postcss.config.cjs` ativa o processamento das classes. A interface permanece com o mesmo design escuro e lavanda da versão anterior.

As classes utilitárias do Tailwind aparecem diretamente no JSX e o arquivo `src/index.css` também utiliza `@apply` para os componentes reutilizáveis. Os estilos CSS personalizados foram preservados apenas quando necessários para manter efeitos como gradientes, discos de vinil, animações e layouts responsivos específicos.

Para instalar e executar no Windows ou em outros sistemas:

```bash
npm install
npm run dev
```

O comando inicia a API e o Vite. Acesse `http://localhost:5173`. Não há login; o aplicativo utiliza perfil e interações experimentais.


## Tailwind CSS sem estilos de componentes em CSS

A estilização foi migrada para classes utilitárias aplicadas diretamente nas propriedades `className` dos componentes React (`src/components`, `src/pages` e `src/App.jsx`). O arquivo `src/index.css` contém somente `@tailwind base`, `@tailwind components` e `@tailwind utilities`. Os gradientes, efeitos visuais e seletores condicionais usam valores arbitrários e variantes Tailwind. Não há arquivo `style.css` com regras de componentes.

### Configuração do Tailwind no Vite

O Tailwind CSS 3 e o Autoprefixer são importados diretamente em `vite.config.js`, na propriedade `css.postcss.plugins`. O arquivo `tailwind.config.cjs` permanece para definir os caminhos dos componentes e as personalizações do tema. Não é necessário `postcss.config.cjs`.
