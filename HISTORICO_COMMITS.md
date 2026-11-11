# Histórico de commits do SoundConnect

Este repositório foi organizado a partir da versão final do SoundConnect. A sequência abaixo é uma **reconstrução didática** do desenvolvimento por funcionalidades, criada nesta entrega, e não um registro de commits originalmente realizados em datas anteriores.

Utilizamos a convenção de [Conventional Commits](https://www.conventionalcommits.org/):

- `chore`: configuração e manutenção do projeto.
- `feat`: novas páginas, rotas e funcionalidades.
- `test`: testes automatizados.
- `docs`: documentação.
- `fix`: reservado a correções de defeitos, quando houver.
- `style`: reservado a alterações apenas visuais, sem mudança de comportamento.
- `refactor`: reservado a reorganização interna sem alterar o comportamento.

## Sequência criada

```text
chore: criar estrutura inicial do projeto React com Vite e npm
chore: configurar Tailwind CSS e pipeline de estilos do Vite
feat(navegacao): criar componentes de layout, menu e cartoes musicais
feat(home): implementar pagina inicial e recomendacoes musicais
feat(descobrir): criar pagina de busca e filtros por genero
feat(mensagens): implementar interface de conversas e playlists
feat(perfil): criar edicao de preferencias e perfil musical
feat(sobre-site): apresentar proposta social e funcionamento da plataforma
feat(api): implementar servidor e armazenamento experimental de usuarios
feat(integracao): conectar rotas, paginas, recomendacoes e mensagens a API
test: adicionar testes de cadastro experimental, conexoes e mensagens
docs: documentar CitizenTech, setup, paginas e modo experimental
```

As telas usam `className` do Tailwind CSS. A rota visual é gerenciada em `src/App.jsx` e o menu fica em `src/components/NavBar.jsx`. O servidor Node.js está em `server/`.

## Visualizar os commits

```bash
git log --oneline --reverse
git show --stat HEAD
```

## Executar

```bash
npm install
npm run dev
```

Acesse `http://localhost:5173`. O aplicativo inicia em modo experimental, sem login. Para testar o backend separadamente, execute `npm test`.

**Observação:** a pasta `.git/` está incluída no arquivo ZIP entregue para que o histórico possa ser consultado localmente após a extração. Caso publique no GitHub, configure o remoto no próprio computador.
