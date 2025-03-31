<script lang="ts">
	import { Node, Svelvet } from 'svelvet';
	import { trpc } from '$lib/trpc/client';
	import { onMount } from 'svelte';
	import { type PanzoomObject } from '@panzoom/panzoom';
	import Panzoom from '@panzoom/panzoom';

	let genres: {
		id: number;
		name: string;
		embedding: number[] | null;
		x_cor: string | null;
		y_cor: string | null;
	}[] = [];

	let screenWidth = 700;
	let screenHeight = 700;
	let positionArray: { x: string | null; y: string | null }[] = [];
	let canvas: HTMLCanvasElement;
	let context: CanvasRenderingContext2D | null | undefined = null;

	$: context = canvas?.getContext('2d');

	onMount(async () => {
		genres = await trpc().genres.all.query();
		screenWidth = window?.innerWidth;
		screenHeight = window?.innerHeight;
		const pz = Panzoom(canvas, {
			maxScale: 10,
			minScale: 0.5,
			bounds: true,
			boundsPadding: 0.1
		});
		pz.pan(10, 10);
		pz.zoom(2, { animate: true });

		// Panning and pinch zooming are bound automatically (unless disablePan is true).
		// There are several available methods for zooming
		// that can be bound on button clicks or mousewheel.
		canvas.addEventListener('wheel', pz.zoomWithWheel);
	});

	$: positionArray = genres.map((genre) => ({ x: genre?.x_cor, y: genre?.y_cor }));

	function transformPosition(position: { x: string | null; y: string | null }) {
		const transformNumber = (num: string | null) => {
			if (num == null) {
				return 0;
			}
			let number = Number(num);
			number += 100;
			number *= 30;
			return number;
		};
		return { x: transformNumber(position.x), y: transformNumber(position.y) };
	}

	$: {
		if (context) {
			context.clearRect(0, 0, screenWidth, screenHeight);
			positionArray.forEach((position, indx) => {
				let coordinates = transformPosition(position);
				context.fillText(genres[indx].name, coordinates.x, coordinates.y);
			});
		}
	}

	$: console.log(positionArray.slice(0, 100));
</script>

<!-- <Svelvet id="my-canvas" width="{screenWidth}" height="{screenHeight}"> -->
<!-- 	{#if genres.length > 0} -->
<!-- 		{#each genres.slice(0, 1000) as genre, indx} -->
<!-- 			<Node  -->
<!-- 				key={genre.id} -->
<!-- 				bind:position={positionArray[indx]} -->
<!-- 			> -->
<!-- 				<div> -->
<!-- 					{genre.name} -->
<!-- 				</div> -->
<!-- 			</Node> -->
<!-- 		{/each}  -->
<!-- 	{/if} -->
<!-- </Svelvet> -->

<div>
	<canvas
		id="my-canvas"
		bind:this={canvas}
		width={10000}
		height={10000}
		class="block border-2 border-black"
	>
	</canvas>
</div>
