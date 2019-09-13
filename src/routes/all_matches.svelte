<script context='module'>
    export async function preload(page, session) {
        const res_game = await this.fetch('game.json?amount=0');
        const games = await res_game.json();

        return { games };
    }
</script>

<script>
    export let users;
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
        padding-bottom: var(--s-5);
    }

    td, th {
        text-align: center;
        vertical-align: middle;
    }


</style>

<table id="matches">
    <tr class="match_header red">
        <th class="match_id"></th>
        <th class="match_name"># Heim</th>
        <th class="match_score"># Tore</th>
        <th class="match_name"># Gast</th>
        <th class="match_score"># Tore</th>
        <th class="match_day"># Spieltag</th>
    </tr>
    {#each games as game, rank}
    <tr class="match_content">
        <td class="match_id">{rank + 1}</td>
        <td class="match_name">{#each game.usersOne as player } {player}<br> {/each}</td>
        <td class="match_score">{game.scoreOne}</td>
        <td class="match_name">{#each game.usersTwo as player } {player}<br> {/each}</td>
        <td class="match_score">{game.scoreTwo}</td>
        <td class="match_day">{game.timestamp}</td>
    </tr>
    {/each}
</table>
