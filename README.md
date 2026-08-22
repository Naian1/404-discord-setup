# 404 Discord Setup
Bot temporário para montar o servidor privado **404 // NO SIGNAL**.

## Variáveis
- `DISCORD_TOKEN`: token secreto do bot (não publique no GitHub)
- `CLIENT_ID`: `1540839942262095922`
- `GUILD_ID`: `1540833365974982766`

## Rodar
1. Instale Node.js 20+.
2. `npm install`
3. Configure as variáveis de ambiente.
4. `npm start`
5. No Discord, execute `/setup404` como administrador.

O comando é idempotente por nome: executar novamente não deve duplicar cargos/canais existentes.

## Onboarding
Depois do setup, use o recurso nativo **Onboarding / Canais e Cargos** do Discord e associe:
- INPUT: Controle / Mouse & Keyboard
- PLATFORM: PC / PlayStation / Xbox / GeForce NOW
- GAME MODES: Warzone / Ranked / Multiplayer / Zombies
