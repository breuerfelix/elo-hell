<script>
    import { onMount } from 'svelte';

    export let padding = '--s0';
    export let margin = '--s0';
    export let centerMargin = 'auto';

    $: id = padding + margin + centerMargin;

    onMount(() => {
        document.querySelectorAll(`.cover${id}`).forEach(e => e.style.padding = `var(${padding})`);
        document.querySelectorAll(`.cover${id} > .above`).forEach(e => e.style.marginBottom = `var(${margin})`);
        document.querySelectorAll(`.cover${id} > .below`).forEach(e => e.style.marginTop = `var(${margin})`);
	document.querySelectorAll(`.cover${id} > .center`).forEach(e => {
	    e.style.marginTop = centerMargin;
	    e.style.marginBottom = centerMargin;
	});
    });
</script>

<style>
    [class^="cover"] {
        display: flex;
        flex-direction: column;
        min-height: 70vh;
    }

    [class^="cover"] > .center {
        margin-top: auto;
        margin-bottom: auto;
    }

    [class^="cover"] > .above {
        margin-top: 0;
    }

    [class^="cover"] > .below {
        margin-bottom: 0;
    }
</style>

<div class={`cover${id}`}>
    <div class='above'>
        <slot name='above'></slot>
    </div>
    <div class='center'>
        <slot name='center'></slot>
    </div>
    <div class='below'>
        <slot name='below'></slot>
    </div>
</div>
