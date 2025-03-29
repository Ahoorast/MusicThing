<script>
	import { Node, Svelvet } from 'svelvet';
	import { trpc } from '$lib/trpc/client';
	import { onMount } from 'svelte';
	
	let genres = [];
	let screenWidth = 700;
	let screenHeight = 700;
	let positionArray = [];
	onMount(async () => {
		genres = await trpc().genres.all.query();
		screenWidth = window?.innerWidth;
		screenHeight = window?.innerHeight;
	});
	
	$: positionArray = genres.map(genre => ({x: genre.x_cor * 10, y: genre.y_cor * 10}));
	$: console.log(positionArray.slice(0, 100));
</script>

<Svelvet id="my-canvas" width="{screenWidth}" height="{screenHeight}">
	{#if genres.length > 0}
		{#each genres.slice(0, 600) as genre, indx}
			<Node 
				key={genre.id}
				bind:position={positionArray[indx]}
			>
				<div>
					{genre.name}
				</div>
			</Node>
		{/each} 
	{/if}
</Svelvet>

