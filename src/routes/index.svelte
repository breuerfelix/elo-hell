<script context='module'>
	export async function preload(page, session) {
		const res_user = await this.fetch('user.json?amount=100');
		const users = await res_user.json();

		return { users };
	}
</script>

<script>
	export let users;
</script>

<style>
	table {
		font-size: var(--s0);
	}

	th {
		padding: var(--s1) var(--s3);
	}

	td {
		padding: var(--s-3) 0;
	}

	td, th {
		text-align: center;
		vertical-align: middle;
	}
</style>

<table>
	<tr>
		<th># rank</th>
		<th># username</th>
		<th># elo</th>
		<th class='hide-mobile'># wins</th>
		<th class='hide-mobile'># games</th>
		<th class='hide-mobile'># diff</th>
	</tr>
	{#each users as user, rank}
	<tr>
		<td>{rank + 1}</td>
		<td>{user.username}</td>
		<td>{user.elo}</td>
		<td class='hide-mobile'>{user.wins}</td>
		<td class='hide-mobile'>{user.games}</td>
		<td class='hide-mobile'>{user.diff}</td>
	</tr>
	{/each}
</table>
