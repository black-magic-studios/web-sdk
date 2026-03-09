<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';

	const { Story } = defineMeta({
		title: 'Animations/Mitosis',
	});
</script>

<script lang="ts">
	import MitosisScene from './MitosisScene.svelte';
	import MitosisBouncyScene from './MitosisBouncyScene.svelte';
	import PhotomosaicScene from './PhotomosaicScene.svelte';
	import CoordinateMosaicScene from './CoordinateMosaicScene.svelte';

	const textures = [
		'/germ_0.png', '/germ_1.png', '/germ_2.png', '/germ_3.png',
		'/germ_4.png', '/germ_5.png', '/germ_6.png', '/germ_7.png',
	];
</script>

<Story name="SingleCell">
	<div
		style="display:flex;align-items:center;justify-content:center;width:100%;height:100vh;background:#111;"
	>
		<MitosisScene textureSrcs={textures} />
	</div>
</Story>

<Story name="FourCellWins">
	<div
		style="display:flex;align-items:center;justify-content:center;width:100%;height:100vh;background:#111;"
	>
		<div
			style="display:grid;grid-template-columns:repeat(4, 1fr);gap:8px;"
		>
			<MitosisScene textureSrcs={textures} />
			<MitosisScene textureSrcs={textures} />
			<MitosisScene textureSrcs={textures} />
			<MitosisScene textureSrcs={textures} />
		</div>
	</div>
</Story>

<Story name="BouncySingleCell">
	<div
		style="display:flex;align-items:center;justify-content:center;width:100%;height:100vh;background:#111;"
	>
		<MitosisBouncyScene textureSrcs={textures} />
	</div>
</Story>

<Story name="BouncyFourCellWins">
	<div
		style="display:flex;align-items:center;justify-content:center;width:100%;height:100vh;background:#111;"
	>
		<div
			style="display:grid;grid-template-columns:repeat(4, 1fr);gap:8px;"
		>
			<MitosisBouncyScene textureSrcs={textures} />
			<MitosisBouncyScene textureSrcs={textures} />
			<MitosisBouncyScene textureSrcs={textures} />
			<MitosisBouncyScene textureSrcs={textures} />
		</div>
	</div>
</Story>

<Story name="PhotomosaicDemo">
	<div
		style="display:flex;flex-direction:column;align-items:center;justify-content:center;width:100%;height:100vh;background:#111;gap:16px;"
	>
		<p style="color:#888;font-family:monospace;font-size:13px;margin:0;">
			256 germs → Star blueprint → Tumble → Triangle blueprint (loops)
		</p>
		<PhotomosaicScene />
	</div>
</Story>

<Story name="CoordinateMosaic">
	<div
		style="display:flex;flex-direction:column;align-items:center;justify-content:center;width:100%;height:100vh;background:#111;gap:16px;"
	>
		<p style="color:#888;font-family:monospace;font-size:13px;margin:0;">
			1→4096: Swarm bounce (1-16) → Photomosaic formation (32+)
		</p>
		<CoordinateMosaicScene textureSrcs={textures} />
	</div>
</Story>

<Story name="CoordinateMosaic4x4">
	<div
		style="display:flex;flex-direction:column;align-items:center;justify-content:center;width:100%;height:100vh;background:#111;gap:16px;"
	>
		<p style="color:#888;font-family:monospace;font-size:13px;margin:0;">
			4×4 slot grid — each cell: swarm → mosaic (capped at 512)
		</p>
		<div style="display:grid;grid-template-columns:repeat(4,1fr);grid-template-rows:repeat(4,1fr);gap:4px;">
			{#each Array(16) as _}
				<CoordinateMosaicScene textureSrcs={textures} maxGerms={4096} cellSize={128} />
			{/each}
		</div>
	</div>
</Story>
