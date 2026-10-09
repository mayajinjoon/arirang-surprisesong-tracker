# Notas de validação

## Escopo e corte

O dataset foi atualizado em **9 de outubro de 2026**, com músicas confirmadas até **Lima D1 (7 de outubro de 2026)**. Ele contém **88 shows**: 51 concluídos e 37 oficialmente anunciados como futuros.

## Hierarquia de fontes

Para calendário, cidade e venue:

1. BIGHIT MUSIC/HYBE/Weverse e o site oficial da turnê.
2. BTS Japan Official para Tokyo.
3. Associated Press apenas como registro contemporâneo auxiliar do anúncio inicial, sobretudo para datas passadas que o site oficial deixou de destacar.

Para surprise songs, não foi encontrada uma tabela oficial consolidada. Foram usados trackers consolidados e setlists de show, com preferência por concordância entre fontes. A força da fonte é explicitada em `sources[].authority`.

## Correções feitas durante a auditoria

- **Bogotá D2:** o registro anterior dizia `Mikrokosmos → We Are Bulletproof: The Eternal`. As fontes atualizadas convergem em **`We Are Bulletproof Pt.2 → Mikrokosmos`**. O JSON contém a versão corrigida.
- **Lima D1:** setlist.fm, Infobae Perú e o tracker Fantree convergem em **`HOME → Outro: Wings`**. Ambas são repetições; a regra cronológica mantém suas primeiras aparições anteriores.
- **Tampa D1:** ordem validada como `Permission to Dance → Magic Shop`.
- **Stanford D3:** ordem validada como `I NEED U → No More Dream`.
- **Las Vegas D4:** ordem validada como `Boyz With Fun → Danger`.
- **Arlington D2:** ordem consolidada como `Butterfly → DNA`.
- **Busan D2:** `Dimple → Ddaeng` são as duas surprise songs; `Magic Shop` e `One More Night` ficam separadas em `specialPerformances`.
- **Melbourne:** o show adicional de 10/02/2027 é o primeiro cronologicamente na cidade; portanto recebe `D1`, seguido de 12/02 (`D2`) e 13/02 (`D3`).

## First appearance

O JSON deliberadamente não contém `firstAppearance: true/false`. A regra é derivada:

1. selecionar somente `status === "completed"`;
2. ordenar por `date` crescente;
3. dentro do show, ordenar por `performanceOrder`;
4. normalizar apenas espaços e caixa para comparação, mantendo os títulos canônicos do dataset;
5. a primeira ocorrência de cada título recebe o destaque; as seguintes não.

Essa regra faz de `I'm Fine` uma estreia em Bogotá D1. `We Are Bulletproof Pt.2` e `Mikrokosmos` em Bogotá D2 são repetições.

## Coordenadas

As coordenadas são aproximações do venue, adequadas para marcadores de mapa. Não devem ser usadas para navegação, segurança ou roteamento. `coordinates.precision` registra essa limitação.

## Nomes geográficos

- O show argentino é comercializado como `Buenos Aires`, mas o venue fica em La Plata. O campo `city` preserva o nome oficial de mercado e as coordenadas apontam para o Estadio Único de La Plata.
- O venue de Los Angeles fica em Inglewood. O dataset preserva `Los Angeles`, que é o nome oficial da parada.
- A parada filipina usa `Bulacan`, conforme o calendário oficial, e o Philippine Sports Stadium como venue.

## Limitações e manutenção de confiança

- Surprise songs são dados secundários e podem receber correções posteriores.
- Uma correção de música deve exigir, idealmente, duas fontes independentes ou uma setlist publicada pelo promotor/ticketing oficial.
- Datas futuras só podem ser adicionadas ou removidas com anúncio oficial.
- Novas regiões prometidas, mas ainda sem datas oficiais, não entram no dataset.

## Fontes principais consultadas

- [Site oficial da turnê](https://btsworldtourofficial.com/)
- [Weverse — North America & Europe](https://weverse.io/bts/notice/33091)
- [Weverse — Latin America](https://weverse.io/bts/notice/34448)
- [Weverse — datas extras de Lima, Santiago e Buenos Aires](https://weverse.io/bts/notice/34732)
- [Weverse — Asia & Australia](https://weverse.io/bts/notice/36080)
- [Weverse — Melbourne extra](https://weverse.io/bts/notice/36364)
- [Weverse — Jakarta e Bulacan extras](https://weverse.io/bts/notice/36777)
- [KPopGo — tracker consolidado](https://kpopgo.art/news/bts-arirang-surprise-songs-tracker)
- [The Honey POP — tracker consolidado](https://thehoneypop.com/2026/04/13/bts-surprise-songs-arirang-world-tour/)
- [Live Nation — setlist de Bogotá D2](https://www.livenation.com/artist/K8vZ917KpXV/bts-events)
- [setlist.fm — Lima D1](https://www.setlist.fm/setlist/bts/2026/estadio-san-marcos-lima-peru-1b763d30.html)
- [Infobae Perú — setlist do primeiro show em Lima](https://www.infobae.com/peru/2026/10/09/setlist-de-bts-en-lima-las-canciones-que-cantaran-este-9-y-10-de-octubre-en-el-estadio-san-marcos/)
- [Fantree — tracker de surprise songs](https://fantree.org/bts/p/bts-arirang-setlist-surprise-song-tracker)
