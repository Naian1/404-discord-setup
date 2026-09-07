# Discord Setup Bot — 404 + Mushroom

Um único bot para montar e manter dois modelos de servidor Discord:

- **404 // NO SIGNAL** — Call of Duty
- **MUSH // Legend of Mushroom** — clã do Mushroom

O bot agora funciona em **múltiplos servidores**. Ele registra os slash commands automaticamente em cada servidor em que estiver presente e também quando for adicionado a um servidor novo.

## Variáveis de ambiente

- `DISCORD_TOKEN`: token secreto do bot — nunca publique no GitHub
- `CLIENT_ID`: Application ID do bot

`GUILD_ID` não é mais obrigatório.

## Rodar

1. Instale Node.js 20+.
2. Rode `npm install`.
3. Configure `DISCORD_TOKEN` e `CLIENT_ID`.
4. Rode `npm start`.
5. Adicione o bot ao servidor com permissões para **Gerenciar Canais**, **Gerenciar Cargos**, **Enviar Mensagens** e **Gerenciar Mensagens**.

## Comandos

### 404

- `/setup404` — cria/atualiza cargos, categorias, canais, permissões e painéis do 404.
- `/painel404` — republica o welcome e o painel de cargos do 404.

O setup do 404 continua usando:

- `assets/welcome.png`
- `assets/cargos.png`

### Mushroom

- `/setupmush` — cria/atualiza todo o servidor do clã Mushroom.
- `/painelmush` — republica os painéis de boas-vindas e seleção de cargos.

O setup Mushroom cria:

- **Início**: boas-vindas, cargos, regras e avisos.
- **Codes & Eventos**: codes de resgate, eventos, calendário e novidades.
- **Builds & Guias**: Arqueiro, Mago, Guerreiro, pets, skills e dicas.
- **Comunidade**: geral, dúvidas, prints/drops e comandos.
- **Voz**: Lobby, Farm PVE e PVP/Arena.
- **Clã privado**: chat, estratégias, organização e voz para `🍄・MEMBRO DO CLÃ`.
- **Staff**: área privada para Founder, Admin e Mod.

### Cargos automáticos do Mushroom

O painel permite ao usuário escolher:

- Classe exclusiva: `🏹・ARQUEIRO`, `🔮・MAGO` ou `⚔️・GUERREIRO`.
- Foco: `🌲・PVE` e/ou `🏆・PVP`.
- Notificações: `🎁・PING CODES` e `🎉・PING EVENTOS`.

O cargo `🍄・MEMBRO DO CLÃ` é administrado pela staff e libera a categoria privada do clã.

## Observações

Os comandos de setup são idempotentes por nome: executar novamente atualiza a estrutura sem duplicar canais/cargos já existentes.

O cargo do bot precisa permanecer acima dos cargos que ele deve conceder/remover.
