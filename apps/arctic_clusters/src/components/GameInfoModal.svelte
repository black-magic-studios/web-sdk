<script lang="ts">
	import PopupLight from './PopupLight.svelte';
	import { zIndex } from 'constants-shared/zIndex';
	import { stateI18nDerived, stateUrlDerived } from 'state-shared';
	import { getContext } from '../game/context';

	const context = getContext();
	const t = (key: string) => stateI18nDerived.translate(key);
	const isSocial = $derived(stateUrlDerived.social());

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

	// Match the sizeRatios from game constants so symbols look proportionate
	const symbolScale: Record<string, number> = {
		H1: 1.1,
		H2: 1.5,
		H3: 1.6,
		H4: 1.2,
		L1: 1.0,
		L2: 1.0,
		L3: 1.0,
		L4: 1.0,
	};

	// Paytable data — pays are multiplied by total bet
	const highPay = [
		{ key: 'H1', pays: [1.0, 1.2, 1.4, 1.6, 1.9, 2.3, 2.8, 3.4, 4.2, 5.2, 6.5, 8.0, 9.8, 11.8, 14.0, 16.5] },
		{ key: 'H2', pays: [0.8, 1.0, 1.2, 1.4, 1.7, 2.1, 2.6, 3.1, 3.8, 4.6, 5.7, 6.9, 8.4, 10.0, 11.9, 14.0] },
		{ key: 'H3', pays: [0.6, 0.8, 1.0, 1.2, 1.4, 1.7, 2.1, 2.5, 3.0, 3.6, 4.3, 5.1, 6.0, 7.0, 8.1, 9.3] },
		{ key: 'H4', pays: [0.5, 0.6, 0.8, 1.0, 1.2, 1.4, 1.7, 2.0, 2.4, 2.9, 3.5, 4.1, 4.8, 5.6, 6.5, 7.5] },
	];

	const lowPay = [
		{ key: 'L1', pays: [0.3, 0.4, 0.5, 0.6, 0.8, 1.0, 1.2, 1.5, 1.8, 2.2, 2.7, 3.2, 3.8, 4.5, 5.3, 6.2] },
		{ key: 'L2', pays: [0.2, 0.3, 0.4, 0.5, 0.6, 0.8, 1.0, 1.2, 1.5, 1.8, 2.2, 2.6, 3.1, 3.6, 4.2, 4.9] },
		{ key: 'L3', pays: [0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.9, 1.1, 1.3, 1.6, 1.9, 2.3, 2.7, 3.2, 3.7, 4.3] },
		{ key: 'L4', pays: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.9, 1.1, 1.3, 1.6, 1.9, 2.2, 2.6, 3.0, 3.5] },
	];

	// Cluster sizes: 5 through 20+
	const allClusterSizes = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

	// Navigation tabs
	type Tab = 'paytable' | 'features' | 'controls' | 'rules' | 'modes' | 'disclaimer';
	let activeTab = $state<Tab>('paytable');
	const tabs: Tab[] = ['paytable', 'features', 'controls', 'rules', 'modes', 'disclaimer'];
	const tabLabels: Record<Tab, string> = $derived({
		paytable: 'Paytable',
		features: 'Features',
		controls: 'Controls',
		rules: 'Rules',
		modes: isSocial ? 'Play Modes' : 'Bet Modes',
		disclaimer: 'Disclaimer',
	});

	// For mobile, swipe pages
	let currentPage = $state(0);
	const totalPages = tabs.length;
	const nextPage = () => { if (currentPage < totalPages - 1) currentPage++; };
	const prevPage = () => { if (currentPage > 0) currentPage--; };

	// Detect mobile layout
	const isMobile = $derived(
		['portrait', 'tablet'].includes(context.stateLayoutDerived.layoutType())
	);

	// Current page tab (for mobile)
	const currentTab = $derived(tabs[currentPage]);
</script>

{#if props.show}
	<PopupLight zIndex={zIndex.modal} onclose={props.onclose}>
		<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
		<div class="info-modal" onclick={(e) => e.stopPropagation()}>
			<!-- Tab navigation (desktop only) -->
			{#if !isMobile}
			<nav class="tabs">
				{#each tabs as tab}
					<button class:active={activeTab === tab} onclick={() => (activeTab = tab)}>{tabLabels[tab]}</button>
				{/each}
			</nav>
			{/if}

			<!-- Mobile page navigation -->
			{#if isMobile}
				<div class="mobile-nav">
					<button class="nav-arrow" onclick={prevPage} disabled={currentPage === 0}>&#9664;</button>
					<span class="page-title">{tabLabels[currentTab]}</span>
					<button class="nav-arrow" onclick={nextPage} disabled={currentPage === totalPages - 1}>&#9654;</button>
				</div>
			{/if}

			<div class="content" class:mobile-content={isMobile}>
				<!-- ═══════════════════════════════════════════ -->
				<!-- PAYTABLE                                   -->
				<!-- ═══════════════════════════════════════════ -->
				{#if (!isMobile && activeTab === 'paytable') || (isMobile && currentTab === 'paytable')}
					<div class="section">
						<h2>Paytable</h2>
						<p class="subtitle">{isSocial ? 'All wins are multiplied by total play.' : 'All pays are multiplied by total bet.'} Minimum cluster size is 5 matching symbols.</p>

						<h3>High Pay Symbols</h3>
						{#each highPay as sym}
							<div class="pay-symbol-block">
								<div class="pay-vertical-layout">
									<div class="symbol-icon"
										style="background-image: url({SYMBOL_SHEET}); --sprite-col: {symbolPos[sym.key].x / 256}; --sprite-row: {symbolPos[sym.key].y / 256}; --scale: {symbolScale[sym.key] ?? 1};"
									></div>
									<div class="pay-rows">
										{#each sym.pays as pay, i}
											<div class="pay-row">
												<span class="cluster-size">{allClusterSizes[i]}{i === allClusterSizes.length - 1 ? '+' : ''}</span>
												<span class="pay-value">{pay.toFixed(1)}x</span>
											</div>
										{/each}
									</div>
								</div>
							</div>
						{/each}

						<h3>Low Pay Symbols</h3>
						{#each lowPay as sym}
							<div class="pay-symbol-block">
								<div class="pay-vertical-layout">
									<div class="symbol-icon"
										style="background-image: url({SYMBOL_SHEET}); --sprite-col: {symbolPos[sym.key].x / 256}; --sprite-row: {symbolPos[sym.key].y / 256}; --scale: {symbolScale[sym.key] ?? 1};"
									></div>
									<div class="pay-rows">
										{#each sym.pays as pay, i}
											<div class="pay-row">
												<span class="cluster-size">{allClusterSizes[i]}{i === allClusterSizes.length - 1 ? '+' : ''}</span>
												<span class="pay-value">{pay.toFixed(1)}x</span>
											</div>
										{/each}
									</div>
								</div>
							</div>
						{/each}

						<h3>Special Symbols</h3>
						<div class="special-symbols">
							<div class="special-row">
								<img src={WILD_IMG} alt="Wild" class="special-icon" />
								<div class="special-info">
									<strong>Wild</strong>
									<p>Substitutes for all paying symbols. Does not replace Bonus or Super Bonus symbols. Appears only through the Aurora feature.</p>
								</div>
							</div>
							<div class="special-row">
								<img src={SCATTER_IMG} alt="Bonus" class="special-icon" />
								<div class="special-info">
									<strong>Bonus</strong>
									<p>Landing 3 or more Bonus symbols anywhere on the grid triggers the Bonus round. Does not need to be part of a cluster.</p>
								</div>
							</div>
							<div class="special-row">
								<img src={SUPER_IMG} alt="Super Bonus" class="special-icon" />
								<div class="special-info">
									<strong>Super Bonus</strong>
									<p>Functions as a Bonus symbol. When 1 or more Super Bonus symbols appear alongside 3 or more Bonus symbols, the Super Bonus round is triggered instead of the standard Bonus round.</p>
								</div>
							</div>
						</div>
					</div>
				{/if}

				<!-- ═══════════════════════════════════════════ -->
				<!-- FEATURES                                   -->
				<!-- ═══════════════════════════════════════════ -->
				{#if (!isMobile && activeTab === 'features') || (isMobile && currentTab === 'features')}
					<div class="section">
						<h2>Tumble Feature</h2>
						<div class="feature-block">
							<div class="feature-steps">
								<div class="step"><span class="step-num">1</span> Winning clusters are evaluated and {isSocial ? 'won.' : 'paid out.'}</div>
								<div class="step"><span class="step-num">2</span> Winning symbols are removed from the grid.</div>
								<div class="step"><span class="step-num">3</span> Remaining symbols drop down to fill empty spaces.</div>
								<div class="step"><span class="step-num">4</span> New symbols appear from the top of each column.</div>
								<div class="step"><span class="step-num">5</span> This repeats until no new winning clusters are formed.</div>
							</div>
						</div>
					</div>

					<div class="section">
						<h2>Cell Multipliers</h2>
						<div class="feature-block">
							<p>Every cell on the grid has its own multiplier.</p>
							<ul>
								<li>When a cell is part of a winning cluster, it receives a <strong>2x</strong> multiplier after the win is paid.</li>
								<li>On subsequent tumbles, if the same cell is part of another win, its multiplier doubles (<strong>2x → 4x → 8x → 16x</strong>, and so on up to <strong>1024x</strong>).</li>
								<li>Multipliers are <strong>positional</strong> — they stay with the cell on the grid, not with the symbol. When symbols are removed and new ones fall in, the cell keeps its multiplier.</li>
								<li>If a cell is part of multiple winning clusters in the same tumble, it still only doubles <strong>once</strong> for that tumble.</li>
								<li>When calculating a cluster's payout, the multipliers of all cells in that cluster are summed.</li>
							</ul>
							<div class="highlight-box">
								<strong>Base Game:</strong> All multipliers reset at the start of each new spin.<br />
								<strong>Bonus &amp; Super Bonus:</strong> Multipliers carry over and continue building across every spin in the round.
							</div>
						</div>
					</div>

					<div class="section">
						<h2>Aurora Feature</h2>
						<div class="feature-block">
							<p>At the start of each spin, <strong>0–5 Aurora cells</strong> are randomly placed on the grid.</p>
							<ul>
								<li>When a winning cluster lands on an Aurora cell, the cell <strong>activates</strong> and produces <strong>1–3 Wild symbols</strong>.</li>
								<li>Wilds are held until no more wins remain, then placed on the board.</li>
								<li>Aurora cells are consumed on activation and removed from the grid.</li>
							</ul>
						</div>
					</div>

					<div class="section">
						<h2>Aurora Collection</h2>
						<div class="feature-block">
							<p>During Bonus or Super Bonus rounds, an <strong>Aurora collection</strong> tracker is shown on screen.</p>
							<ul>
								<li>When an Aurora cell activates, it places <strong>1–3 Wild symbols</strong> on the grid as usual.</li>
								<li>After the Wilds are placed, any Wild that is part of a <strong>winning cluster</strong> is collected into the Aurora collection.</li>
								<li>Wilds that are <strong>not</strong> part of any winning cluster are <strong>not collected</strong> and are removed normally.</li>
								<li>After all Bonus spins are finished, every collected Wild is placed <strong>randomly</strong> on the grid for one <strong>final Aurora Spin</strong>.</li>
							</ul>
							<div class="highlight-box">
								<strong>Super Bonus:</strong> Enhanced Aurora places 2–7 cells per spin, increasing the number of Wilds that can be collected.
							</div>
						</div>
					</div>

					<div class="section">
						<h2>Bonus Round</h2>
						<div class="feature-block">
							<p>Land <strong>3 or more Bonus symbols</strong> anywhere on the grid to trigger the Bonus round.</p>
							<table class="info-table">
								<thead><tr><th>Bonus Symbols</th><th>Spins Awarded</th></tr></thead>
								<tbody>
									<tr><td>3</td><td>8</td></tr>
									<tr><td>4</td><td>12</td></tr>
									<tr><td>5+</td><td>15</td></tr>
								</tbody>
							</table>
							<p>Additional Bonus symbols during the round award extra spins:</p>
							<table class="info-table compact">
								<thead><tr><th>Bonus Symbols</th><th>Extra Spins</th></tr></thead>
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
							<p>Land <strong>3 or more Bonus symbols</strong> plus at least <strong>1 Super Bonus symbol</strong> to trigger the Super Bonus.</p>
							<table class="info-table">
								<thead><tr><th>Bonus + Super</th><th>Spins Awarded</th></tr></thead>
								<tbody>
									<tr><td>3 + Super</td><td>10</td></tr>
									<tr><td>4 + Super</td><td>12</td></tr>
									<tr><td>5+ + Super</td><td>15</td></tr>
								</tbody>
							</table>
							<ul>
								<li>Enhanced Aurora: 2–7 cells per spin.</li>
								<li>Cell multipliers persist throughout all Super Bonus spins.</li>
								<li>Aurora Collection is active — collected Wilds are placed in a final Aurora Spin.</li>
							</ul>
						</div>
					</div>
				{/if}

				<!-- ═══════════════════════════════════════════ -->
				<!-- CONTROLS                                   -->
				<!-- ═══════════════════════════════════════════ -->
				{#if (!isMobile && activeTab === 'controls') || (isMobile && currentTab === 'controls')}
					<div class="section">
						<h2>Game Controls</h2>

						<div class="controls-list">
							<div class="control-item">
								<img src="/assets/sprites/buttons_new/play_button.png" alt="Spin" class="control-btn-img" />
								<div class="control-info">
									<strong>Spin</strong>
									<p>Starts a spin using the current {isSocial ? 'play' : 'bet'} amount. Press again during a spin to skip animations.</p>
								</div>
							</div>

							<div class="control-item">
								<div class="control-bet-arrows">
									<img src="/assets/sprites/buttons_new/increase_base.png" alt="Increase" class="control-btn-img-sm" />
									<img src="/assets/sprites/buttons_new/decrease_base.png" alt="Decrease" class="control-btn-img-sm" />
								</div>
								<div class="control-info">
									<strong>{isSocial ? 'Play' : 'Bet'} Adjust</strong>
									<p>Increase or decrease the {isSocial ? 'play' : 'bet'} amount per spin. The total {isSocial ? 'amount' : 'cost'} is shown in the {isSocial ? 'play' : 'bet'} display.</p>
								</div>
							</div>

							<div class="control-item">
								<img src="/assets/sprites/buttons_new/autoplay_base.png" alt="Autoplay" class="control-btn-img" />
								<div class="control-info">
									<strong>Autoplay</strong>
									<p>Automatically plays a set number of spins. Configure the number of rounds and optional stop conditions (e.g., on bonus trigger, on balance change).</p>
								</div>
							</div>

							<div class="control-item">
								<div class="turbo-speeds">
									<img src="/assets/sprites/buttons_new/play_bar_0002_turbo_normal.png" alt="Normal" class="turbo-speed-img" />
									<img src="/assets/sprites/buttons_new/play_bar_0002_turbo_turbo.png" alt="Turbo" class="turbo-speed-img" />
									<img src="/assets/sprites/buttons_new/play_bar_0002_turbo_super_turbo.png" alt="Super Turbo" class="turbo-speed-img" />
								</div>
								<div class="control-info">
									<strong>Spin Speed</strong>
									<p>Cycles through three speeds: Normal, Turbo, and Super Turbo. Each press advances to the next speed.</p>
								</div>
							</div>

							<div class="control-item">
								<img src="/assets/sprites/buttons_new/black_magic_studios_buy_button.png" alt="{isSocial ? 'Play' : 'Buy'} Feature" class="control-btn-img" />
								<div class="control-info">
									<strong>{isSocial ? 'Play' : 'Buy'} Feature</strong>
									<p>Opens the feature menu where you can activate Extra Chance, select a grid multiplier, or {isSocial ? 'play' : 'buy'} directly into a bonus round.</p>
								</div>
							</div>

							<div class="control-item">
								<img src="/assets/sprites/buttons_new/menu_base.png" alt="Menu" class="control-btn-img" />
								<div class="control-info">
									<strong>Menu</strong>
									<p>Opens the settings menu with options for sound control, game info, and game rules.</p>
								</div>
							</div>
						</div>
					</div>

					<div class="section">
						<h2>Display Information</h2>
						<div class="controls-list">
							<div class="control-item">
								<div class="control-label">BALANCE</div>
								<div class="control-info">
									<p>Shows your current account balance.</p>
								</div>
							</div>
							<div class="control-item">
								<div class="control-label">{isSocial ? 'PLAY' : 'BET'}</div>
								<div class="control-info">
									<p>Displays the total {isSocial ? 'amount' : 'cost'} of the current spin, including any active {isSocial ? 'play' : 'bet'} mode modifiers.</p>
								</div>
							</div>
							<div class="control-item">
								<div class="control-label">WIN</div>
								<div class="control-info">
									<p>Shows the total win amount for the current spin, including all tumble payouts.</p>
								</div>
							</div>
						</div>
					</div>
				{/if}

				<!-- ═══════════════════════════════════════════ -->
				<!-- RULES                                     -->
				<!-- ═══════════════════════════════════════════ -->
				{#if (!isMobile && activeTab === 'rules') || (isMobile && currentTab === 'rules')}
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
								<li>A winning cluster requires 5 or more matching symbols connected horizontally or vertically (not diagonally).</li>
								<li>Wild symbols substitute for all paying symbols but cannot replace Bonus symbols.</li>
								<li>Wild symbols may contribute to multiple clusters at once, but their cell multiplier only increases once per tumble.</li>
								<li>Bonus symbols are evaluated before tumbles begin.</li>
								<li>All wins from a single spin, including tumbles, are combined into one total payout.</li>
								<li>The maximum win per spin is capped at <strong>25,000x</strong> the {isSocial ? 'play' : 'bet'}. If the cap is reached, remaining tumbles are skipped.</li>
								<li>Cluster payouts are capped at a cluster size of 20. Clusters larger than 20 pay the same as 20.</li>
							</ul>
						</div>
					</div>
				{/if}

				<!-- ═══════════════════════════════════════════ -->
				<!-- BET MODES                                  -->
				<!-- ═══════════════════════════════════════════ -->
				{#if (!isMobile && activeTab === 'modes') || (isMobile && currentTab === 'modes')}
					<div class="section">
						<h2>{isSocial ? 'Play' : 'Bet'} Modes</h2>

						<h3>Standard</h3>
						<div class="feature-block">
							<p>Default gameplay at standard {isSocial ? 'play' : 'bet'} cost.</p>
						</div>

						<h3>Extra Chance</h3>
						<div class="feature-block">
							<p>{isSocial ? 'For' : 'Costs'} <strong>1.2x</strong> the standard {isSocial ? 'play' : 'bet'}. One Bonus symbol is guaranteed on the last reel each spin.</p>
						</div>

						<h3>{isSocial ? 'Get' : 'Buy'} Bonus</h3>
						<div class="feature-block">
							<p>{isSocial ? 'For' : 'Costs'} <strong>100x</strong> the standard {isSocial ? 'play' : 'bet'}. Immediately starts a Bonus round with <strong>8 spins</strong>.</p>
						</div>

						<h3>Grid Multiplier Modes</h3>
						<div class="feature-block">
							<p>Set every cell on the grid to a selected multiplier for an increased {isSocial ? 'play' : 'bet'} cost. The selected multiplier applies to all cells from the first tumble.</p>
							<table class="info-table">
								<thead>
									<tr><th>Starting Multiplier</th><th>{isSocial ? 'Play' : 'Bet'} Cost</th></tr>
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

				<!-- ═══════════════════════════════════════════ -->
				<!-- DISCLAIMER                                 -->
				<!-- ═══════════════════════════════════════════ -->
				{#if (!isMobile && activeTab === 'disclaimer') || (isMobile && currentTab === 'disclaimer')}
					<div class="section disclaimer-section">
						<h2 class="disclaimer-title">General Disclaimer</h2>
						<div class="disclaimer-block">
							<p>Malfunction voids all wins and plays. A consistent internet connection is required. In the event of a disconnection, reload the game to finish any uncompleted rounds.</p>
							<p>The expected return is calculated over many plays. The game display is not representative of any physical device and is for illustrative purposes only.</p>
							<p>Winnings are settled according to the amount received from the Remote Game Server and not from events within the web browser.</p>
							<p class="disclaimer-copyright">TM and &copy; {new Date().getFullYear()} Stake Engine.</p>
						</div>
					</div>
				{/if}
			</div>

			<!-- Mobile page dots -->
			{#if isMobile}
				<div class="page-dots">
					{#each tabs as _, i}
						<button
							class="dot"
							class:active={currentPage === i}
							onclick={() => (currentPage = i)}
						></button>
					{/each}
				</div>
			{/if}
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

	/* ── Tab navigation (desktop) ── */
	.tabs {
		display: flex;
		border-bottom: 1px solid rgba(100, 180, 255, 0.15);
		background: rgba(0, 0, 0, 0.3);
		flex-shrink: 0;

		button {
			flex: 1;
			padding: 12px 6px;
			border: none;
			background: transparent;
			color: rgba(136, 204, 255, 0.6);
			font-family: 'Montserrat', Arial, sans-serif;
			font-size: 12px;
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

	/* ── Mobile navigation ── */
	.mobile-nav {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 10px 16px;
		background: rgba(0, 0, 0, 0.3);
		border-bottom: 1px solid rgba(100, 180, 255, 0.15);
		flex-shrink: 0;
	}

	.nav-arrow {
		width: 36px;
		height: 36px;
		border: 1px solid rgba(136, 204, 255, 0.3);
		border-radius: 50%;
		background: rgba(136, 204, 255, 0.08);
		color: #88ccff;
		font-size: 14px;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: background 0.15s;

		&:hover:not(:disabled) {
			background: rgba(136, 204, 255, 0.15);
		}

		&:disabled {
			opacity: 0.25;
			cursor: not-allowed;
		}
	}

	.page-title {
		font-family: 'Montserrat', Arial, sans-serif;
		font-size: 14px;
		font-weight: 700;
		color: #88ccff;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.page-dots {
		display: flex;
		justify-content: center;
		gap: 6px;
		padding: 10px 0 14px;
		flex-shrink: 0;
	}

	.dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		border: 1px solid rgba(136, 204, 255, 0.3);
		background: transparent;
		cursor: pointer;
		padding: 0;
		transition: background 0.15s;

		&.active {
			background: #88ccff;
			border-color: #88ccff;
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
		font-family: 'Montserrat', Arial, sans-serif;
		font-size: 18px;
		font-weight: 700;
		color: #88ccff;
		margin: 0 0 12px;
		letter-spacing: 0.5px;
	}

	h3 {
		font-family: 'Montserrat', Arial, sans-serif;
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

	/* ── Paytable: vertical layout ── */
	.pay-symbol-block {
		margin-bottom: 14px;
		padding: 10px 12px;
		border-radius: 8px;
		background: rgba(255, 255, 255, 0.03);
	}

	.pay-vertical-layout {
		display: flex;
		gap: 14px;
		align-items: flex-start;
	}

	.symbol-icon {
		width: clamp(90px, 22vw, 130px);
		height: clamp(90px, 22vw, 130px);
		flex-shrink: 0;
		border-radius: 6px;
		image-rendering: auto;
		background-size: 300% 300%;
		background-position: calc(var(--sprite-col) * -100%) calc(var(--sprite-row) * -100%);
		transform: scale(var(--scale, 1));
		transform-origin: center center;
	}

	.pay-rows {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 3px 8px;
		flex: 1;
	}

	.pay-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 4px 8px;
		border-radius: 3px;
		background: rgba(100, 180, 255, 0.04);
	}

	.cluster-size {
		font-size: 13px;
		font-weight: 600;
		color: rgba(136, 204, 255, 0.5);
	}

	.pay-value {
		font-size: 14px;
		font-weight: 700;
		color: #ffffff;
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
		width: 64px;
		height: 64px;
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

	/* ── Controls page ── */
	.controls-list {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.control-item {
		display: flex;
		align-items: center;
		gap: 14px;
		padding: 10px 14px;
		border-radius: 8px;
		background: rgba(255, 255, 255, 0.03);
		border: 1px solid rgba(100, 180, 255, 0.06);
	}

	.control-btn-img {
		width: 42px;
		height: 42px;
		flex-shrink: 0;
		object-fit: contain;
		border-radius: 8px;
		filter: drop-shadow(0 0 4px rgba(100, 180, 255, 0.2));
	}

	.control-bet-arrows {
		display: flex;
		flex-direction: column;
		gap: 2px;
		flex-shrink: 0;
	}

	.control-btn-img-sm {
		width: 42px;
		height: 20px;
		object-fit: contain;
		filter: drop-shadow(0 0 4px rgba(100, 180, 255, 0.2));
	}

	.turbo-speeds {
		display: flex;
		gap: 4px;
		flex-shrink: 0;
	}

	.turbo-speed-img {
		width: 32px;
		height: 32px;
		object-fit: contain;
		border-radius: 6px;
		filter: drop-shadow(0 0 4px rgba(100, 180, 255, 0.2));
	}

	.control-icon {
		width: 40px;
		height: 40px;
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 8px;
		background: rgba(136, 204, 255, 0.1);
		border: 1px solid rgba(136, 204, 255, 0.2);
		color: #88ccff;
		font-size: 16px;
	}

	.control-label {
		min-width: 60px;
		flex-shrink: 0;
		font-family: 'Montserrat', Arial, sans-serif;
		font-size: 11px;
		font-weight: 700;
		color: #88ccff;
		letter-spacing: 0.5px;
		text-transform: uppercase;
		text-align: center;
		padding: 6px 8px;
		border-radius: 6px;
		background: rgba(136, 204, 255, 0.08);
		border: 1px solid rgba(136, 204, 255, 0.15);
	}

	.control-info {
		flex: 1;

		strong {
			font-size: 13px;
			font-weight: 700;
			color: #88ccff;
			display: block;
			margin-bottom: 2px;
		}

		p {
			font-size: 12px;
			color: rgba(255, 255, 255, 0.7);
			line-height: 1.5;
			margin: 0;
		}
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

	/* ── Disclaimer ── */
	.disclaimer-section {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		padding-top: 20px;
	}

	.disclaimer-title {
		color: #e6c54a;
		font-size: 20px;
		margin-bottom: 16px;
	}

	.disclaimer-block {
		padding: 16px 20px;
		border-radius: 10px;
		background: linear-gradient(180deg, rgba(60, 20, 20, 0.4) 0%, rgba(40, 15, 15, 0.6) 100%);
		border: 1px solid rgba(150, 80, 50, 0.2);
		max-width: 560px;

		p {
			font-size: 12.5px;
			color: rgba(255, 255, 255, 0.75);
			line-height: 1.7;
			margin: 0 0 8px;
			text-align: center;

			&:last-child { margin-bottom: 0; }
		}
	}

	.disclaimer-copyright {
		margin-top: 12px !important;
		font-weight: 600;
		color: rgba(255, 255, 255, 0.6) !important;
	}

	/* ── Responsive ── */
	@media screen and (max-width: 500px) {
		.info-modal {
			width: 96vw;
			max-height: 88vh;
		}

		.content { padding: 14px 16px 20px; }

		.pay-rows {
			grid-template-columns: repeat(2, 1fr);
		}

		.stats-grid { grid-template-columns: repeat(2, 1fr); }
	}
</style>
