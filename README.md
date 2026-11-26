# 🏆 Supercopa Clash Royale API

API REST desenvolvida em **NestJS**, **TypeORM** e **PostgreSQL** para gerenciar jogadores, partidas amistosas e torneios eliminatórios de 8 participantes inspirados no universo de *Clash Royale*.

---

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:
* [Node.js](https://nodejs.org) (versão 20.11 ou superior)
* [PostgreSQL](https://postgresql.org) rodando na porta `5432`
* [Git](https://git-scm.com)
* [Postman](https://postman.com) ou [Insomnia](https://insomnia.rest) (para testar as requisições via coleção pronta)

---

## 🚀 Como rodar o projeto

### 1. Clonar o repositório
```bash
git clone https://github.com/JoaoPedroDelguingaro/supercopa-clashroyale-api
cd supercopa-clashroyale-api
```

### 2. Instalar as dependências
```bash
npm install
```

### 3. Configurar as variáveis de ambiente (`.env`)
O projeto utiliza variáveis de ambiente para conectar ao PostgreSQL. Caso você não tenha essas variáveis configuradas globalmente no seu sistema operacional:

1. Localize o arquivo **`.env.example`** na raiz do projeto e crie uma cópia dele renomeando para **`.env`**:
   ```bash
   cp .env.example .env
   ```
2. Abra o arquivo **`.env`** e preencha com os dados do seu banco local:
   ```env
   PG_USER=postgres
   PG_PASSWORD=sua_senha_do_postgres
   PG_DB=supercopa
   ```

### 4. Popular o banco de dados (Seed)
Rode o script de inicialização uma vez para criar o banco automaticamente, cadastrar 10 jogadores iniciais e simular a 1ª edição do torneio:
```bash
npx ts-node src/seed.ts
```

### 5. Iniciar o servidor
```bash
npm run start:dev
```
A API estará disponível em **`http://localhost:3000`**.

---

## 🧪 Testando com o Postman ou Insomnia

O repositório já inclui o arquivo **`supercopa-clashroyale.json`** na raiz do projeto contendo todas as requisições organizadas (Jogadores, Torneios, Partidas, Fluxo Completo e Erros de Regra):

1. Abra o **Postman** ou o **Insomnia**.
2. Clique em **Import** (Importar) e selecione o arquivo **`supercopa-clashroyale.json`** da pasta do projeto.
3. Todas as rotas e corpos JSON já estarão prontos para testar com um clique.

---

## 🃏 Decks Disponíveis

Ao enviar uma requisição para cadastrar (`POST /jogadores`) ou atualizar (`PATCH /jogadores/atualizar/:id`) um jogador, o campo `deck` deve receber exatamente um dos valores abaixo (em letras maiúsculas):

* `PUSH`
* `CICLO`
* `CONTROL`
* `CONSTRUCAO`
* `LOG_BAIT`
* `FIRE_BAIT`
* `BRIDGE_SPAM`
* `SPLIT_LANE`
* `SPLASH_HARD`
* `HYPER_OFFENSE`

**Exemplo de corpo (JSON) para `POST /jogadores`:**
```json
{
  "nick": "novo_jogador",
  "trofeus": 6500,
  "deck": "SPLASH_HARD"
}
```
*(Nota: Os troféus devem ser um número inteiro entre `0` e `14000`).*

---

## ⚙️ Regras de Negócio

* **Cálculo de Probabilidade:** Baseado em `50%` iniciais, somando ou subtraindo a diferença de troféus (`+5%` a cada `1000` troféus de vantagem) e o *matchup* entre os arquétipos de deck (`+18%`, `+10%`, `-10%` ou `-18%`), respeitando os limites mínimo de `20%` e máximo de `80%`.
* **Fluxo do Torneio (8 Jogadores):**
  1. `INSCRICOES` — Aceita até 8 jogadores livres (`emTorneio = false`).
  2. `SORTEADO` — Embaralha os 8 inscritos e gera os 4 confrontos das Quartas.
  3. `QUARTAS_JOGADAS` — Simula as Quartas, libera os 4 eliminados e cria a Semifinal.
  4. `SEMIFINAL_JOGADA` — Simula a Semifinal, libera os 2 eliminados e cria a Final.
  5. `ENCERRADO` — Simula a Final, libera os finalistas, registra o campeão e soma `+1` título ao vencedor.

---

## 🛣️ Endpoints Principais

### Jogadores (`/jogadores`)

| Método | Rota | Descrição |
| :--- | :--- | :--- |
| `GET` | `/jogadores` | Lista todos os jogadores cadastrados |
| `GET` | `/jogadores/:id` | Busca os detalhes de um jogador |
| `POST` | `/jogadores` | Cadastra um novo jogador (`nick`, `trofeus`, `deck`) |
| `PATCH` | `/jogadores/atualizar/:id` | Atualiza dados do jogador (bloqueado se estiver em torneio) |
| `DELETE` | `/jogadores/:id` | Remove um jogador (bloqueado se estiver em torneio) |

### Partidas (`/partidas`)

| Método | Rota | Descrição |
| :--- | :--- | :--- |
| `GET` | `/partidas` | Lista todas as partidas registradas |
| `GET` | `/partidas/:id` | Busca os detalhes de uma partida |
| `GET` | `/partidas/jogador/:id` | Lista o histórico de partidas de um jogador |
| `POST` | `/partidas/amistosa` | Simula uma partida amistosa (`jogador1Id`, `jogador2Id`) |

### Torneios (`/torneios`)

| Método | Rota | Descrição |
| :--- | :--- | :--- |
| `GET` | `/torneios` | Lista todos os torneios |
| `GET` | `/torneios/:id` | Exibe o campeão, status e chaveamento completo do torneio |
| `POST` | `/torneios` | Cria um novo torneio (`titulo`) |
| `POST` | `/torneios/:id/inscrever` | Inscreve um jogador no torneio (`jogadorId`) |
| `POST` | `/torneios/:id/sorteio` | Realiza o sorteio das Quartas de Final |
| `POST` | `/torneios/:id/quartas` | Executa as partidas das Quartas de Final |
| `POST` | `/torneios/:id/semifinal` | Executa as partidas da Semifinal |
| `POST` | `/torneios/:id/final` | Executa a Grande Final e encerra o torneio |
