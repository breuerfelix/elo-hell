<script context='module'>
	export async function preload({ query }, session) {
		const res_user = await this.fetch('user.json?amount=100');
		const users = await res_user.json();

		return { users, query };
	}
</script>

<script>
	import { onMount, onDestroy } from 'svelte';
	import { tryParseInt } from '../core';

	export let users;
	export let query;

	// if reload query parameter is set
	// auto update the table every x seconds
	const intervalTimer = tryParseInt(query.reload, 0);
	if (intervalTimer > 0) {
		let interval = null;
		onMount(async () => {
			interval = setInterval(async () => {
				const res_user = await fetch('user.json?amount=100');
				users = await res_user.json();
			}, intervalTimer * 1000);
		});

		onDestroy(() => interval && clearInterval(interval));
	}
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

	.unverified {
		font-style: italic;
	}
</style>

<table>
	<tr>
		<th>rank</th>
		<th>username</th>
		<th>elo</th>
		<th class='hide-mobile'>wins</th>
		<th class='hide-mobile'>games</th>
		<th class='hide-mobile'>diff</th>
	</tr>
	{#each users as user, rank}
	<tr>
		<td>{rank + 1}</td>
		<td class:unverified={!user.verified}>{user.username}</td>
		<td>{user.elo}</td>
		<td class='hide-mobile'>{user.wins}</td>
		<td class='hide-mobile'>{user.games}</td>
		<td class='hide-mobile'>{user.diff}</td>
	</tr>
	{/each}
</table>
