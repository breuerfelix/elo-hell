<script>
	import Nav from '../components/Nav.svelte';
	import Stack from '../components/Stack.svelte';
	import Bracket from '../components/Bracket.svelte';
	
	export let segment;
</script>

<svelte:head>
	<title>elo-hell</title>
</svelte:head>

<Stack>
	<Nav {segment}/>

	<Bracket>
		<div slot='center'>
			<slot></slot>
		</div>
	</Bracket>

</Stack>
