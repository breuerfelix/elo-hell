<script context='module'>
	export async function preload(page, session) {
		const res_user = await this.fetch('user.json?amount=0');
		const res_game = await this.fetch('game.json');
		const users = await res_user.json();
		const games = await res_game.json();

		return { users, games };
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

<table>
	<tr class="red">
		<th># rank</th>
		<th># username</th>
		<th># elo</th>
		<th># wins</th>
		<th># games</th>
		<th># TD</th>
	</tr>
	{#each users as user, rank}
	<tr>
		<td>{rank + 1}</td>
		<td>{user.username}</td>
		<td>{user.elo}</td>
		<td>{user.wins}</td>
		<td>{user.games}</td>
	</tr>
	{/each}
</table>

<table>
	<tr class="red">
		<th># Heim</th>
		<th># Tore</th>
		<th># Gast</th>
		<th># Tore</th>
		<th># Spieltag</th>
	</tr>
	{#each games as game}
	<tr>
		<td>{#each game.usersOne as player } {player}<br> {/each}</td>
		<td>{game.scoreOne}</td>
		<td>{#each game.usersTwo as player } {player}<br> {/each}</td>
		<td>{game.scoreTwo}</td>
		<td>{game.timestamp}</td>
	</tr>
	{/each}
</table>
