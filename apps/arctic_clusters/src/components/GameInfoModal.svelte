<script lang="ts">
	import PopupLight from './PopupLight.svelte';
	import { zIndex } from 'constants-shared/zIndex';
	import { getContext } from '../game/context';

	const context = getContext();

	type Props = {
		show: boolean;
		onclose: () => void;
	};

	const props: Props = $props();

	// Symbol image paths (served from SvelteKit static/)
	const SYMBOL_SHEET = '/assets/sprites/symbolsStatic/symbolsStatic.png';
	const WILD_IMG = '/assets/sprites/symbolsStatic/arctic_clusters_wild.png';
	const SCATTER_IMG = '/assets/sprites/symbolsStatic/cool_clusters/symbols/arctic_clusters_bonus.png';
	const SUPER_IMG = '/assets/super.png';

	// Spritesheet: 768x768, each symbol 256x256
	// h1: 0,0  h2: 256,0  h3: 512,0
	// l2: 0,256  l3: 256,256  l4: 512,256
	// h4: 0,512  l1: 256,512
	const symbolPos: Record<string, { x: number; y: number }> = {
		H1: { x: 0, y: 0 },
		H2: { x: 256, y: 0 },
		H3: { x: 512, y: 0 },
		H4: { x: 0, y: 512 },
		L1: { x: 256, y: 512 },
		L2: { x: 0, y: 256 },
		L3: { x: 256, y: 256 },
		L4: { x: 512, y: 256 },
	};

	// Paytable data — pays are multiplied by total bet
	const highPay = [
		{ key: 'H1', name: 'Polar Bear', pays: [1.0, 1.2, 1.4, 1.6, 1.9, 2.3, 2.8, 3.4, 4.2, 5.2, 6.5, 8.0, 9.8, 11.8, 14.0, 16.5] },
		{ key: 'H2', name: 'Arctic Fox', pays: [0.8, 1.0, 1.2, 1.4, 1.7, 2.1, 2.6, 3.1, 3.8, 4.6, 5.7, 6.9, 8.4, 10.0, 11.9, 14.0] },
		{ key: 'H3', name: 'Narwhal', pays: [0.6, 0.8, 1.0, 1.2, 1.4, 1.7, 2.1, 2.5, 3.0, 3.6, 4.3, 5.1, 6.0, 7.0, 8.1, 9.3] },
		{ key: 'H4', name: 'Snowflake', pays: [0.5, 0.6, 0.8, 1.0, 1.2, 1.4, 1.7, 2.0, 2.4, 2.9, 3.5, 4.1, 4.8, 5.6, 6.5, 7.5] },
	];

	const lowPay = [
		{ key: 'L1', name: 'A', pays: [0.3, 0.4, 0.5, 0.6, 0.8, 1.0, 1.2, 1.5, 1.8, 2.2, 2.7, 3.2, 3.8, 4.5, 5.3, 6.2] },
		{ key: 'L2', name: 'K', pays: [0.2, 0.3, 0.4, 0.5, 0.6, 0.8, 1.0, 1.2, 1.5, 1.8, 2.2, 2.6, 3.1, 3.6, 4.2, 4.9] },
		{ key: 'L3', name: 'Q', pays: [0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.9, 1.1, 1.3, 1.6, 1.9, 2.3, 2.7, 3.2, 3.7, 4.3] },
		{ key: 'L4', name: 'J', pays: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.9, 1.1, 1.3, 1.6, 1.9, 2.2, 2.6, 3.0, 3.5] },
	];

	// Full cluster sizes: 5 through 20+
	const allClusterSizes = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

	// Navigation tabs (used on desktop)
	type Tab = 'paytable' | 'features' | 'rules' | 'modes';
	let activeTab = $state<Tab>('paytable');

	// Detect mobile layout
	const isMobile = $derived(
		['portrait', 'tablet'].includes(context.stateLayoutDerived.layoutType())
	);
</script>

{#if props.show}
	<PopupLight zIndex={zIndex.modal} onclose={props.onclose}>
		<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
		<div class="info-modal" onclick={(e) => e.stopPropagation()}>
			<!-- Tab navigation (desktop only) -->
			{#if !isMobile}
			<nav class="tabs">
				<button class:active={activeTab === 'paytable'} onclick={() => (activeTab = 'paytable')}>Paytable</button>
				<button class:active={activeTab === 'features'} onclick={() => (activeTab = 'features')}>Features</button>
				<button class:active={activeTab === 'rules'} onclick={() => (activeTab = 'rules')}>Rules</button>
				<button class:active={activeTab === 'modes'} onclick={() => (activeTab = 'modes')}>Bet Modes</button>
			</nav>
			{/if}

			<div class="content" class:mobile-content={isMobile}>
				<!-- ═══════════════════════════════════════════ -->
				<!-- PAYTABLE                                   -->
				<!-- ═══════════════════════════════════════════ -->
				{#if isMobile || activeTab === 'paytable'}
					<div class="section">
						<h2>Paytable</h2>
						<p class="subtitle">All pays are multiplied by total bet. Minimum cluster size: 5 symbols.</p>

						<h3>High Pay Symbols</h3>
						{#each highPay as sym}
							<div class="pay-symbol-block">
								<div class="symbol-cell">
									<div
										class="symbol-icon"
										style="background-image: url({SYMBOL_SHEET}); --sprite-col: {symbolPos[sym.key].x / 256}; --sprite-row: {symbolPos[sym.key].y / 256};"
									></div>
									<span class="symbol-name">{sym.name}</span>
								</div>
								<div class="pay-table-scroll">
									<table class="pay-table">
										<thead>
											<tr>
												{#each allClusterSizes as size, i}
													<th>{size}{i === allClusterSizes.length - 1 ? '+' : ''}</th>
												{/each}
											</tr>
										</thead>
										<tbody>
											<tr>
												{#each sym.pays as pay}
													<td>{pay.toFixed(1)}x</td>
												{/each}
											</tr>
										</tbody>
									</table>
								</div>
							</div>
						{/each}

						<h3>Low Pay Symbols</h3>
						{#each lowPay as sym}
							<div class="pay-symbol-block">
								<div class="symbol-cell">
									<div
										class="symbol-icon"
										style="background-image: url({SYMBOL_SHEET}); --sprite-col: {symbolPos[sym.key].x / 256}; --sprite-row: {symbolPos[sym.key].y / 256};"
									></div>
									<span class="symbol-name">{sym.name}</span>
								</div>
								<div class="pay-table-scroll">
									<table class="pay-table">
										<thead>
											<tr>
												{#each allClusterSizes as size, i}
													<th>{size}{i === allClusterSizes.length - 1 ? '+' : ''}</th>
												{/each}
											</tr>
										</thead>
										<tbody>
											<tr>
												{#each sym.pays as pay}
													<td>{pay.toFixed(1)}x</td>
												{/each}
											</tr>
										</tbody>
									</table>
								</div>
							</div>
						{/each}

						<h3>Special Symbols</h3>
						<div class="special-symbols">
							<div class="special-row">
								<img src={WILD_IMG} alt="Wild" class="special-icon" />
								<div class="special-info">
									<strong>Wild</strong>
									<p>Substitutes for all paying symbols. Cannot substitute for Scatter or Super Scatter. Only appears via the Aurora feature — never lands on an initial spin.</p>
								</div>
							</div>
							<div class="special-row">
								<img src={SCATTER_IMG} alt="Scatter" class="special-icon" />
								<div class="special-info">
									<strong>Scatter</strong>
									<p>Triggers Free Spins when 3 or more land anywhere on the grid. Does not need to be part of a cluster.</p>
								</div>
							</div>
							<div class="special-row">
								<img src={SUPER_IMG} alt="Super Scatter" class="special-icon" />
								<div class="special-info">
									<strong>Super Scatter</strong>
									<p>Works like a Scatter, but when combined with 3+ regular Scatters, triggers the enhanced Super Bonus instead of Free Spins.</p>
								</div>
							</div>
						</div>
					</div>

				{/if}

				<!-- ═══════════════════════════════════════════ -->
				<!-- FEATURES                                   -->
				<!-- ═══════════════════════════════════════════ -->
				{#if isMobile || activeTab === 'features'}
					<div class="section">
						<h2>Tumble Feature</h2>
						<div class="feature-block">
							<div class="feature-steps">
								<div class="step"><span class="step-num">1</span> All winning clusters are evaluated and paid.</div>
								<div class="step"><span class="step-num">2</span> Winning symbols are removed from the grid.</div>
								<div class="step"><span class="step-num">3</span> Remaining symbols fall down to fill gaps.</div>
								<div class="step"><span class="step-num">4</span> New symbols drop in from the top.</div>
								<div class="step"><span class="step-num">5</span> Process repeats until no new wins form.</div>
							</div>
						</div>
					</div>

					<div class="section">
						<h2>Cell Multipliers</h2>
						<div class="feature-block">
							<p>Every cell on the grid has a positional multiplier starting at <strong>1x</strong>.</p>
							<ul>
								<li>When a cell is part of a winning cluster, its multiplier <strong>doubles</strong> after the win is paid (1x → 2x → 4x → 8x … up to 1024x).</li>
								<li>Multipliers are <strong>positional</strong> — they stay at the cell, not with the symbol.</li>
								<li>If a cell is part of multiple winning clusters in the same tumble, its multiplier only doubles <strong>once</strong>.</li>
								<li>For each cluster, the win is calculated using the sum of all cell multipliers ≥ 2x within the cluster. If all cells are 1x, the base pay applies.</li>
							</ul>
							<div class="highlight-box">
								<strong>Base Game:</strong> Multipliers reset to 1x each spin.<br />
								<strong>Free Spins & Super Bonus:</strong> Multipliers persist across all spins.
							</div>
						</div>
					</div>

					<div class="section">
						<h2>Aurora Feature</h2>
						<div class="feature-block">
							<p>At the start of each spin, <strong>0–5 Aurora cells</strong> are randomly placed as invisible overlays on the grid.</p>
							<ul>
								<li>When a winning cluster lands on an Aurora cell, the Aurora <strong>activates</strong>.</li>
								<li>Each activation generates <strong>1–3 Wild symbols</strong>.</li>
								<li>Wilds are held in reserve until no more wins remain, then placed on the board to create new opportunities.</li>
								<li>Aurora cells are single-use — once activated, they are removed.</li>
							</ul>
							<div class="highlight-box">
								<strong>Super Bonus:</strong> Enhanced Aurora generates 2–7 cells per spin.
							</div>
						</div>
					</div>

					<div class="section">
						<h2>Free Spins</h2>
						<div class="feature-block">
							<p>Land <strong>3 or more Scatter</strong> symbols anywhere on the grid to trigger Free Spins.</p>
							<table class="info-table">
								<thead><tr><th>Scatters</th><th>Free Spins</th></tr></thead>
								<tbody>
									<tr><td>3</td><td>8</td></tr>
									<tr><td>4</td><td>12</td></tr>
									<tr><td>5+</td><td>15</td></tr>
								</tbody>
							</table>
							<p>Free Spins can be <strong>retriggered</strong> by landing additional Scatters:</p>
							<table class="info-table compact">
								<thead><tr><th>Scatters</th><th>+Spins</th></tr></thead>
								<tbody>
									<tr><td>3</td><td>+5</td></tr>
									<tr><td>4</td><td>+8</td></tr>
									<tr><td>5</td><td>+10</td></tr>
									<tr><td>6</td><td>+12</td></tr>
									<tr><td>7</td><td>+15</td></tr>
									<tr><td>8+</td><td>+18</td></tr>
								</tbody>
							</table>
						</div>
					</div>

					<div class="section">
						<h2>Super Bonus</h2>
						<div class="feature-block">
							<p>Land <strong>3+ Scatters</strong> and at least <strong>1 Super Scatter</strong> to trigger the Super Bonus.</p>
							<table class="info-table">
								<thead><tr><th>Scatters + Super</th><th>Spins</th></tr></thead>
								<tbody>
									<tr><td>3 + Super</td><td>10</td></tr>
									<tr><td>4 + Super</td><td>12</td></tr>
									<tr><td>5+ + Super</td><td>15</td></tr>
								</tbody>
							</table>
							<ul>
								<li>Enhanced Aurora: 2–7 cells per spin.</li>
								<li>Cell multipliers persist throughout all Super Bonus spins.</li>
							</ul>
						</div>
					</div>

				{/if}

				<!-- ═══════════════════════════════════════════ -->
				<!-- RULES                                     -->
				<!-- ═══════════════════════════════════════════ -->
				{#if isMobile || activeTab === 'rules'}
					<div class="section">
						<h2>Game Overview</h2>
						<div class="stats-grid">
							<div class="stat"><span class="stat-label">Grid</span><span class="stat-value">7 × 7</span></div>
							<div class="stat"><span class="stat-label">Engine</span><span class="stat-value">Cluster Pays</span></div>
							<div class="stat"><span class="stat-label">RTP</span><span class="stat-value">96.50%</span></div>
							<div class="stat"><span class="stat-label">Volatility</span><span class="stat-value">High</span></div>
							<div class="stat"><span class="stat-label">Max Win</span><span class="stat-value">25,000x</span></div>
							<div class="stat"><span class="stat-label">Min Cluster</span><span class="stat-value">5 symbols</span></div>
						</div>
					</div>

					<div class="section">
						<h2>General Rules</h2>
						<div class="feature-block">
							<ul>
								<li>A winning cluster consists of 5 or more matching symbols connected horizontally or vertically (not diagonally).</li>
								<li>Wild symbols substitute for all paying symbols (not Scatters).</li>
								<li>Wild symbols can participate in multiple winning clusters simultaneously, but their cell multiplier only increases once per tumble.</li>
								<li>Scatter symbols are counted before tumbles begin.</li>
								<li>All wins from a single spin (including all tumbles) are accumulated into one total win.</li>
								<li>Maximum win per spin is capped at <strong>25,000x</strong> the bet. If the cap is reached, remaining tumbles are stopped.</li>
								<li>Cluster payouts are capped at cluster size 20 — clusters larger than 20 pay the same as 20.</li>
							</ul>
						</div>
					</div>

				{/if}

				<!-- ═══════════════════════════════════════════ -->
				<!-- BET MODES                                  -->
				<!-- ═══════════════════════════════════════════ -->
				{#if isMobile || activeTab === 'modes'}
					<div class="section">
						<h2>Bet Modes</h2>

						<h3>Standard Mode</h3>
						<div class="feature-block">
							<p>Normal gameplay at 1x bet cost. All cell multipliers start at 1x.</p>
						</div>

						<h3>Ante Bet</h3>
						<div class="feature-block">
							<p>Costs <strong>2.5x</strong> the standard bet. Significantly increases the chance of triggering Free Spins. One Scatter is guaranteed on the grid each spin.</p>
						</div>

						<h3>Buy Bonus</h3>
						<div class="feature-block">
							<p>Costs <strong>100x</strong> the standard bet. Instantly triggers <strong>8 Free Spins</strong>, skipping the base game entirely.</p>
						</div>

						<h3>Multiplier Base Modes</h3>
						<div class="feature-block">
							<p>Start every cell at a higher multiplier for an increased bet cost. All wins benefit from amplified multipliers from the very first tumble.</p>
							<table class="info-table">
								<thead>
									<tr><th>Start Mult</th><th>Bet Cost</th></tr>
								</thead>
								<tbody>
									<tr><td>2x</td><td>2.9x</td></tr>
									<tr><td>4x</td><td>5.8x</td></tr>
									<tr><td>8x</td><td>11.2x</td></tr>
									<tr><td>16x</td><td>23.0x</td></tr>
									<tr><td>32x</td><td>46.2x</td></tr>
									<tr><td>64x</td><td>90.6x</td></tr>
									<tr><td>128x</td><td>181.8x</td></tr>
									<tr><td>256x</td><td>354.5x</td></tr>
									<tr><td>512x</td><td>665.1x</td></tr>
									<tr><td>1024x</td><td>1,110.8x</td></tr>
								</tbody>
							</table>
						</div>
					</div>
				{/if}
			</div>
		</div>
	</PopupLight>
{/if}

<style lang="scss">
	.info-modal {
		position: relative;
		z-index: 100;
		width: min(92vw, 640px);
		max-height: 82vh;
		display: flex;
		flex-direction: column;
		background: linear-gradient(170deg, #0d1b2a 0%, #1b2838 40%, #0d1b2a 100%);
		border: 1px solid rgba(100, 180, 255, 0.2);
		border-radius: 16px;
		overflow: hidden;
		box-shadow: 0 0 40px rgba(50, 120, 200, 0.15), 0 0 80px rgba(50, 120, 200, 0.05);
	}

	/* Mobile: full-screen scrollable */
	.mobile-content {
		max-height: none;
	}

	/* ── Tab navigation ── */
	.tabs {
		display: flex;
		border-bottom: 1px solid rgba(100, 180, 255, 0.15);
		background: rgba(0, 0, 0, 0.3);
		flex-shrink: 0;

		button {
			flex: 1;
			padding: 12px 8px;
			border: none;
			background: transparent;
			color: rgba(136, 204, 255, 0.6);
			font-family: 'proxima-nova', Arial, sans-serif;
			font-size: 13px;
			font-weight: 600;
			letter-spacing: 0.5px;
			text-transform: uppercase;
			cursor: pointer;
			transition: all 0.2s;
			border-bottom: 2px solid transparent;

			&:hover {
				color: rgba(136, 204, 255, 0.9);
				background: rgba(100, 180, 255, 0.05);
			}

			&.active {
				color: #88ccff;
				border-bottom-color: #88ccff;
				background: rgba(100, 180, 255, 0.08);
			}
		}
	}

	/* ── Scrollable content ── */
	.content {
		overflow-y: auto;
		padding: 20px 24px 28px;
		scrollbar-width: thin;
		scrollbar-color: rgba(136, 204, 255, 0.3) transparent;

		&::-webkit-scrollbar { width: 6px; }
		&::-webkit-scrollbar-track { background: transparent; }
		&::-webkit-scrollbar-thumb {
			background: rgba(136, 204, 255, 0.3);
			border-radius: 3px;
		}
	}

	/* ── Sections & headings ── */
	.section {
		margin-bottom: 24px;

		&:last-child { margin-bottom: 0; }
	}

	h2 {
		font-family: 'proxima-nova', Arial, sans-serif;
		font-size: 18px;
		font-weight: 700;
		color: #88ccff;
		margin: 0 0 12px;
		letter-spacing: 0.5px;
	}

	h3 {
		font-family: 'proxima-nova', Arial, sans-serif;
		font-size: 14px;
		font-weight: 600;
		color: rgba(136, 204, 255, 0.8);
		margin: 16px 0 8px;
		text-transform: uppercase;
		letter-spacing: 0.3px;
	}

	.subtitle {
		font-size: 12px;
		color: rgba(255, 255, 255, 0.5);
		margin: -8px 0 16px;
	}

	/* ── Paytable: symbol block + scrollable table ── */
	.pay-symbol-block {
		margin-bottom: 14px;
		padding: 10px 12px;
		border-radius: 8px;
		background: rgba(255, 255, 255, 0.03);
	}

	.symbol-cell {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-bottom: 8px;
	}

	.symbol-icon {
		width: clamp(28px, 8vw, 48px);
		height: clamp(28px, 8vw, 48px);
		flex-shrink: 0;
		border-radius: 6px;
		image-rendering: auto;
		/* Sprite sheet is 3x3 grid (768px / 256px). Position via CSS custom props */
		background-size: 300% 300%;
		background-position: calc(var(--sprite-col) * -100%) calc(var(--sprite-row) * -100%);
	}

	.symbol-name {
		font-size: 13px;
		font-weight: 600;
		color: rgba(255, 255, 255, 0.85);
	}

	.pay-table-scroll {
		overflow-x: auto;
		scrollbar-width: thin;
		scrollbar-color: rgba(136, 204, 255, 0.3) transparent;

		&::-webkit-scrollbar { height: 4px; }
		&::-webkit-scrollbar-track { background: transparent; }
		&::-webkit-scrollbar-thumb {
			background: rgba(136, 204, 255, 0.3);
			border-radius: 2px;
		}
	}

	.pay-table {
		border-collapse: collapse;
		width: 100%;
		min-width: 500px;

		th {
			font-size: 10px;
			font-weight: 600;
			color: rgba(136, 204, 255, 0.5);
			padding: 3px 6px;
			text-align: center;
			white-space: nowrap;
		}

		td {
			font-size: 12px;
			font-weight: 700;
			color: #ffffff;
			padding: 4px 6px;
			text-align: center;
			white-space: nowrap;
			background: rgba(100, 180, 255, 0.04);
			border-radius: 3px;
		}
	}

	/* ── Special symbols ── */
	.special-symbols {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.special-row {
		display: flex;
		align-items: center;
		gap: 14px;
		padding: 10px 12px;
		border-radius: 8px;
		background: rgba(255, 255, 255, 0.03);
	}

	.special-icon {
		width: 52px;
		height: 52px;
		flex-shrink: 0;
		border-radius: 8px;
		object-fit: contain;
	}

	.special-info {
		flex: 1;

		strong {
			font-size: 14px;
			color: #88ccff;
			display: block;
			margin-bottom: 4px;
		}

		p {
			font-size: 12px;
			color: rgba(255, 255, 255, 0.7);
			line-height: 1.5;
			margin: 0;
		}
	}

	/* ── Feature blocks ── */
	.feature-block {
		padding: 12px 14px;
		border-radius: 10px;
		background: rgba(255, 255, 255, 0.03);
		border: 1px solid rgba(100, 180, 255, 0.06);

		p {
			font-size: 13px;
			color: rgba(255, 255, 255, 0.8);
			line-height: 1.6;
			margin: 0 0 10px;

			&:last-child { margin-bottom: 0; }
		}

		ul {
			margin: 8px 0;
			padding-left: 18px;

			li {
				font-size: 12.5px;
				color: rgba(255, 255, 255, 0.75);
				line-height: 1.6;
				margin-bottom: 4px;

				strong { color: #88ccff; }
			}
		}
	}

	.feature-steps {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.step {
		display: flex;
		align-items: flex-start;
		gap: 10px;
		font-size: 13px;
		color: rgba(255, 255, 255, 0.8);
		line-height: 1.5;
	}

	.step-num {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 22px;
		height: 22px;
		border-radius: 50%;
		background: rgba(136, 204, 255, 0.15);
		color: #88ccff;
		font-size: 11px;
		font-weight: 700;
		flex-shrink: 0;
	}

	.highlight-box {
		margin-top: 12px;
		padding: 10px 14px;
		border-radius: 8px;
		background: rgba(136, 204, 255, 0.08);
		border: 1px solid rgba(136, 204, 255, 0.15);
		font-size: 12.5px;
		color: rgba(255, 255, 255, 0.85);
		line-height: 1.6;

		strong { color: #88ccff; }
	}

	/* ── Stats grid ── */
	.stats-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 8px;
	}

	.stat {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 10px;
		border-radius: 8px;
		background: rgba(100, 180, 255, 0.06);
	}

	.stat-label {
		font-size: 10px;
		font-weight: 600;
		color: rgba(136, 204, 255, 0.6);
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.stat-value {
		font-size: 16px;
		font-weight: 700;
		color: #ffffff;
		margin-top: 2px;
	}

	/* ── Tables ── */
	.info-table {
		width: 100%;
		border-collapse: collapse;
		margin: 10px 0;

		th {
			font-size: 11px;
			font-weight: 600;
			color: rgba(136, 204, 255, 0.6);
			text-transform: uppercase;
			letter-spacing: 0.3px;
			padding: 6px 10px;
			text-align: center;
			border-bottom: 1px solid rgba(100, 180, 255, 0.15);
		}

		td {
			font-size: 13px;
			font-weight: 600;
			color: rgba(255, 255, 255, 0.85);
			padding: 6px 10px;
			text-align: center;
			border-bottom: 1px solid rgba(100, 180, 255, 0.05);
		}

		&.compact td, &.compact th {
			padding: 4px 8px;
			font-size: 12px;
		}
	}

	/* ── Responsive ── */
	@media screen and (max-width: 500px) {
		.info-modal {
			width: 96vw;
			max-height: 88vh;
		}

		.content { padding: 14px 16px 20px; }

		.symbol-cell { min-width: unset; }
		.symbol-name { font-size: 11px; }
		.pay-table th { font-size: 9px; padding: 2px 4px; }
		.pay-table td { font-size: 10px; padding: 3px 4px; }
		.pay-table { min-width: 420px; }

		.stats-grid { grid-template-columns: repeat(2, 1fr); }
	}
</style>
