# BTS ARIRANG TOUR — Surprise Songs Tracker

Site estático interativo e pacote de dados validado para `mayajinjoon/arirang-surprisesong-tracker`.

## Entregáveis

- `index.html`, `styles.css` e `app.js`: experiência completa, responsiva e sem dependências externas de runtime.
- A abertura inclui um link editorial discreto para o TikTok `@mayajoonofficial`, sem feed incorporado ou rastreamento.
- `data/tour.json`: calendário mestre de 88 shows, com 50 realizados até Bogotá D2 e 38 futuros oficialmente anunciados.
- `data/tour.schema.json`: contrato JSON Schema para a integração.
- `scripts/validate.mjs`: valida estrutura, cronologia, fontes, status e a regra de músicas futuras vazias.
- `docs/VALIDATION.md`: decisões de validação, correções e limitações das fontes.
- `docs/MAINTENANCE.md`: fluxo seguro para atualizar o tracker depois de cada show.
- `docs/ASSETS.md`: inventário e uso previsto dos assets Maya Pop/Maya Joon/ARIRANG.
- `docs/BUILD_TEST_REPORT.md`: registro dos testes automatizados e da revisão em navegador.
- `CODEX_BRIEF.md`: instruções prontas para a etapa de construção do site.

## Decisão central de dados

`first appearance` **não é gravado manualmente** no JSON. A interface ordena os shows pela data, percorre apenas shows concluídos e destaca a primeira ocorrência de cada título canônico. Isso impede que o destaque fique incorreto quando novas datas ou músicas forem acrescentadas.

## Verificação

Com Node.js instalado:

```bash
npm run check
```

Resultado esperado: `OK — 88 shows; 50 completed; 38 upcoming; 59 unique surprise songs`.

O comando também cria `dist/`, copiando `data/tour.json` sem transformação. Essa pasta é o artefato publicado pelo GitHub Pages.

## Prévia local

```bash
node tools/serve.mjs
```

Abra `http://127.0.0.1:4173/`. Para testar exatamente o prefixo do GitHub Pages, abra `http://127.0.0.1:4173/arirang-surprisesong-tracker/`.

## Estado do pacote

- Corte dos dados: 4 de outubro de 2026.
- Último show concluído: Bogotá D2, 3 de outubro de 2026.
- Próximo show: Lima D1, 7 de outubro de 2026.
- Build de produção concluído e validado localmente.
- O workflow `.github/workflows/deploy-pages.yml` valida, testa, constrói e publica automaticamente após pushes aprovados para `main`; também aceita execução manual.
