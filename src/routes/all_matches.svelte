<script context='module'>
    export async function preload(page, session) {
        const res_game = await this.fetch('game.json?amount=200');
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
</style>

<table>
    <tr>
        <th># team 1</th>
        <th># score 1</th>
        <th># team 2</th>
        <th># score 2</th>
        <th># date</th>
    </tr>
    {#each games as game}
    <tr>
        <td>{#each game.usersOne as player}{player}<br>{/each}</td>
        <td>{game.scoreOne}</td>
        <td>{#each game.usersTwo as player}{player}<br>{/each}</td>
        <td>{game.scoreTwo}</td>
        <td>{formatDate(game.timestamp)}</td>
    </tr>
    {/each}
</table>
