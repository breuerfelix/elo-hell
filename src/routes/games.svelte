<script context='module'>
    export async function preload(page, session) {
        const res_game = await this.fetch('game.json?amount=100');
        const games = await res_game.json();

        games.sort((a, b) =>
            new Date(b.timestamp) - new Date(a.timestamp)
        );

        return { games };
    }
</script>

<script>
    import { formatDate } from '../core';
    export let games;
</script>

<style>
    table {
        font-size: var(--s0);
    }

    th {
        padding: var(--s1) var(--s3);
    }

    td {
        padding: var(--s-3);
    }

    td, th {
        text-align: center;
        vertical-align: middle;
    }

    .unverified {
        font-style: italic;
    }

    .declined {
        text-decoration: line-through;
    }

    .bold {
        font-weight: bold;
    }
</style>

<table>
    <tr>
        <th>team 1</th>
        <th>score</th>
        <th>team 2</th>
        <th class='hide-mobile'>date</th>
        <th class='hide-mobile'>elo</th>
    </tr>
    {#each games as game}
    <tr
        class:unverified={!game.userVerified || game.userVerified.length < 1}
        class:declined={game.userDeclined && game.userDeclined.length > 0}
        class:bold={game.scoreOne == 0 || game.scoreTwo == 0}
    >
        <td>{#each game.usersOne as player}{player}<br>{/each}</td>
        <td>{game.scoreOne} : {game.scoreTwo}</td>
        <td>{#each game.usersTwo as player}{player}<br>{/each}</td>
        <td class='hide-mobile'>{formatDate(game.timestamp)}</td>
        <td class='hide-mobile'>{game.elo ? game.elo.toFixed(2) : '-'}</td>
    </tr>
    {/each}
</table>
