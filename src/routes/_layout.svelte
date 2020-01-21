<script>
	import Nav from '../components/Nav.svelte';
	import Stack from '@silvancodes/svelte-the-stack';
	import Bracket from '../components/Bracket.svelte';
	
	export let segment;
</script>

<svelte:head>
	<title>elo-hell</title>
</svelte:head>

<Stack>
	<Nav {segment}/>

	<Bracket margin='--zero'>
		<div slot='center'>
			<slot></slot>
		</div>
	</Bracket>

</Stack>
