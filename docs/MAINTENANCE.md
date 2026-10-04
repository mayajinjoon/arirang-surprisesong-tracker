# Guia de manutenção

## Depois de cada show

1. Aguarde o show terminar.
2. Confirme as duas surprise songs e a ordem em pelo menos duas fontes independentes; prefira setlist do promotor/ticketing e cobertura local confiável.
3. No registro já existente em `data/tour.json`, troque `status` de `upcoming` para `completed`.
4. Preencha `surpriseSongs` com exatamente dois objetos em ordem de performance.
5. Acrescente as fontes usadas a `sources` e referencie seus IDs em cada música.
6. Não edite nenhum destaque de primeira aparição; ele é recalculado pelo site.
7. Atualize `dataset.asOf`, `completedThrough`, `completedThroughLabel`, `completedShows` e `upcomingShows`.
8. Execute `node scripts/validate.mjs`.
9. Faça revisão humana antes de publicar.

Exemplo estrutural:

```json
"status": "completed",
"surpriseSongs": [
  {
    "title": "Song One",
    "performanceOrder": 1,
    "sourceIds": ["source-a", "source-b"]
  },
  {
    "title": "Song Two",
    "performanceOrder": 2,
    "sourceIds": ["source-a", "source-b"]
  }
]
```

## Quando uma nova data for anunciada

- Exigir BIGHIT MUSIC/HYBE/Weverse ou o site oficial da turnê.
- Criar o show com `status: "upcoming"` e `surpriseSongs: []`.
- Recalcular `dayNumber` pela ordem cronológica da cidade inteira, inclusive quando uma data extra é inserida antes das originais.
- Adicionar coordenadas aproximadas do venue e registrar `precision`.
- Não preencher músicas, nem mesmo com placeholders.

## Quando uma correção for necessária

- Não apague silenciosamente o histórico da decisão.
- Atualize `docs/VALIDATION.md` com data, campo alterado, valor anterior, valor novo e fontes.
- Se o título canônico mudar, confirme o impacto em todas as primeiras aparições calculadas.

## Automação recomendada

A automação futura pode abrir uma proposta de alteração após cada show, mas não deve publicar diretamente. O merge precisa de aprovação humana porque setlists em tempo real podem trocar ordem, grafia ou até a identidade de uma música.

