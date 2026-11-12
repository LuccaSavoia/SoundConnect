Integrantes: Lucca Savoia Bergamasco Diniz  
RM: 569489

---

# SoundConnect – Conectando pessoas através da música

Aplicação MVP da CitizenTech **SoundConnect**, desenvolvido com **React, JavaScript e Vite**, com foco em aproximar pessoas com problemas de socialização por afinidades musicais.

### 1. Nome da CitizenTech

**SoundConnect – Conectando pessoas através da música**

### 2. Cidade e bairro

São Paulo, SP – Aplicativo digital com alcance inicial em toda a cidade, sem restrição de bairro.

### 3. Cidadão beneficiado

Pessoas que enfrentam dificuldades de socialização, timidez, solidão ou isolamento social, especialmente jovens e adultos que desejam construir novas amizades e que estão em uma situação onde não tem coragem de iniciar esse contato com pessoas que vê no dia-a-dia.

### 4. Problema, em uma frase

A dificuldade de estabelecer conexões sociais e encontrar pessoas com interesses semelhantes contribui para o isolamento e a solidão.

### 5. Como funciona

O usuário cadastra suas preferências musicais e uma inteligência artificial analisa artistas, gêneros e músicas favoritas para identificar pessoas com gostos semelhantes, sugerindo conexões e facilitando o início de conversas.

### 6. O que cada parte faz

**Usuário:** cadastra seus gostos musicais (musicas, bandas, etc), recebe sugestões de pessoas compatíveis e interage por meio de conversas e sugestões de playlists.

**Inteligência artificial:** analisa as preferências musicais, identifica afinidades, recomenda conexões e sugere assuntos para facilitar a comunicação.

**Aplicativo:** disponibiliza os perfis, o sistema de recomendações, o chat e os recursos de segurança e privacidade.

### 7. Indicador de impacto

Percentual de usuários que estabelecem ao menos uma conexão social recíproca por meio do aplicativo, considerando conversas iniciadas e interações mantidas ao longo de 30 dias.

### 8. ODS conectados

**ODS 3 – Saúde e Bem-Estar:** promoção do bem-estar emocional por meio da socialização e redução do isolamento.

**ODS 10 – Redução das Desigualdades:** promoção da inclusão social de pessoas que enfrentam dificuldades de interação.

**ODS 11 – Cidades e Comunidades Sustentáveis:** fortalecimento de vínculos sociais e incentivo à formação de comunidades mais inclusivas.

---

## Interações disponíveis

- Descobrir pessoas e filtrar por artistas e estilos musicais.
- Editar o perfil de teste, sem e-mail nem senha.
- Conectar-se aos perfis fictícios (aceitação automática no modo experimental).
- Trocar mensagens com respostas automáticas claramente identificadas como simulação.
- Criar playlists e adicionar músicas.
- Consultar a página **Sobre o site** e a proposta CitizenTech.
- Testar a API com `npm test`.

## Executar o projeto

No terminal, dentro da pasta do projeto:

```bash
npm install
npm run dev
```

Acesse `http://localhost:5173`. O comando inicia o frontend React e a API local. Para executar os testes automatizados, use `npm test`.

## Estrutura principal

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

## Observações sobre o MVP experimental

A versão atual não exige cadastro nem login. Um perfil de demonstração é criado automaticamente para permitir testar o aplicativo. Os demais perfis e as respostas de chat são simulados. A compatibilidade musical usa uma comparação algorítmica de artistas favoritos; **não há IA generativa nem integração com serviços de streaming nesta versão**.

Os dados de demonstração são armazenados localmente pelo servidor. O protótipo não possui infraestrutura de autenticação, privacidade e moderação adequada para publicação como serviço público. Evite inserir dados pessoais reais.

## Tailwind CSS

A interface usa Tailwind CSS 3 com classes `className` diretamente nos componentes JSX. As configurações do Tailwind e do Autoprefixer estão centralizadas em `vite.config.js`, com personalizações em `tailwind.config.cjs`. O `src/index.css` contém apenas as diretivas do Tailwind.
