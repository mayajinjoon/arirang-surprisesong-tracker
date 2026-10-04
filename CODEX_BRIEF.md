# Brief para o Codex — construção do site

Construa a primeira versão de produção do site estático **BTS ARIRANG TOUR — Surprise Songs Tracker** para o repositório exato `mayajinjoon/arirang-surprisesong-tracker`.

## Autoridade dos arquivos

1. Use `data/tour.json` como única fonte de verdade para calendário, cidades, países, legs, status, coordenadas e surprise songs.
2. Leia `docs/VALIDATION.md` antes de alterar qualquer dado.
3. Leia `docs/ASSETS.md` antes de usar imagens.
4. Não reintroduza informações do histórico de chat que contradigam o dataset validado.

## Requisitos funcionais

- Site estático, leve, mobile-first e compatível com GitHub Pages em `/arirang-surprisesong-tracker/`.
- Views: `COUNTRIES`, `SONGS`, `FULL TOUR`, mapa-múndi e `PRINT`.
- Em `COUNTRIES`, agregar todas as visitas ao mesmo país e ordenar por data/cidade.
- Em `SONGS`, oferecer busca e listar todas as ocorrências da música.
- Calcular `first appearance` em tempo de execução pela cronologia; nunca usar um campo manual.
- Shows futuros aparecem como `Upcoming`, com `surpriseSongs: []`, sem “TBD”, “Unknown” ou títulos inventados.
- Mapa com pontos acessíveis e painel inferior confortável no celular.
- Impressão limpa de tour completa, leg ou país.
- Zero analytics, cookies, login, formulários ou chamadas externas desnecessárias.
- Respeitar `prefers-reduced-motion` e não iniciar áudio automaticamente.

## Identidade e conteúdo

- O projeto é **BTS OT7**. Maya Pop é anfitriã; Maya Joon é apenas a assinatura/criadora.
- Usar `assets/original/maya-pop-purple.jpeg` como host principal.
- Usar `maya-pop-arirang-red.jpeg` apenas como variação editorial; `maya-pop-princess.jpeg` é opcional/easter egg.
- Usar `arirang-symbol-red.jpeg` no cabeçalho sem redesenhar a arte.
- Usar `maya-joon-signature.png` discretamente no rodapé.
- Preservar todos os originais; criar derivados otimizados em uma pasta separada.
- Não copiar o design de `map-reference.png`; ele é apenas referência conceitual.

## Hero

Exibir as saudações, com fade sutil a cada aproximadamente 2 segundos:

`Welcome! 💜` → `Bem-vindos! 💜` → `Willkommen! 💜` → `환영합니다! 💜` → `¡Bienvenidos! 💜` → `Bienvenue ! 💜` → `ようこそ！💜`

Após um ciclo: `Choose a stop and explore the tour ✦`.

## Critérios de aceite

- Rodar `scripts/validate.mjs` sem falhas.
- Testar desktop, mobile e impressão.
- Confirmar que Bogotá D2 exibe `We Are Bulletproof Pt.2` primeiro e `Mikrokosmos` depois.
- Confirmar que Lima e todos os shows futuros estão sem músicas.
- Confirmar que `I’m Fine` é calculada como estreia em Bogotá D1, enquanto as duas músicas de Bogotá D2 são repetições.
- Não publicar nem criar o repositório remoto sem autorização separada da usuária.

