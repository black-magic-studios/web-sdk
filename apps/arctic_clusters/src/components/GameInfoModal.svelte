<script lang="ts">
	import PopupLight from './PopupLight.svelte';
	import { zIndex } from 'constants-shared/zIndex';
	import { stateI18nDerived, stateMeta, stateConfig } from 'state-shared';
	import { getContext } from '../game/context';
	import config from '../game/config';

	const context = getContext();
	const t = (key: string) => stateI18nDerived.translate(key);

	// ── Dynamic values from RGS config (with local fallbacks) ──
	const getRtp = () => stateConfig.betModes?.base?.rtp ?? config.rtp ?? 0.965;
	const getMaxWin = () => stateConfig.betModes?.base?.max_win ?? (config.betModes as any)?.base?.max_win ?? 25000;
	const getModeCost = (key: string) => {
		if (stateMeta.betModeMeta[key]?.costMultiplier != null) return stateMeta.betModeMeta[key].costMultiplier;
		if (stateConfig.betModes?.[key]?.cost != null) return stateConfig.betModes[key].cost;
		return (config.betModes as any)?.[key]?.cost ?? 1;
	};

	const rtpDisplay = $derived((getRtp() * 100).toFixed(2) + '%');
	const maxWinDisplay = $derived(getMaxWin().toLocaleString() + 'x');
	const anteCostDisplay = $derived(getModeCost('ante') + '×');
	const bonusCostDisplay = $derived(getModeCost('bonus') + '×');

	// Grid multiplier cost table — built dynamically
	const MULT_KEYS = ['M2X', 'M4X', 'M8X', 'M16X', 'M32X', 'M64X', 'M128X', 'M256X', 'M512X', 'M1024X'] as const;
	const gridCostTable = $derived(MULT_KEYS.map((key) => {
		const label = key.replace('M', '').replace('X', 'x');
		const cost = getModeCost(key);
		return { label, cost: cost + 'x' };
	}));

	type Props = {
		show: boolean;
		onclose: () => void;
	};

	const props: Props = $props();

	// Symbol image paths (served from SvelteKit static/)
	const SYMBOL_SHEET = './assets/sprites/symbolsStatic/symbolsStatic.png';
	const WILD_IMG = './assets/sprites/symbolsStatic/arctic_clusters_wild.png';
	const SCATTER_IMG = './assets/sprites/symbolsStatic/cool_clusters/symbols/arctic_clusters_bonus.png';
	const SUPER_IMG = './assets/super.png';

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

	// Paytable data - pays are multiplied by total bet
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
		paytable: t('Paytable'),
		features: t('Features'),
		controls: t('Controls'),
		rules: t('Rules'),
		modes: t('Bet Modes'),
		disclaimer: t('Disclaimer'),
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
						<h2>{t('Paytable')}</h2>
						<p class="subtitle">{t('All values shown are multiplied by the base bet.')} {t('A cluster must contain at least 5 matching symbols to pay.')}</p>

						<h3>{t('High Pay Symbols')}</h3>
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

						<h3>{t('Low Pay Symbols')}</h3>
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
									<p>{t('Substitutes for all paying symbols. Does not replace Bonus or Super Bonus symbols. Wilds only appear through the Aurora Feature.')}</p>
								</div>
							</div>
							<div class="special-row">
								<img src={SCATTER_IMG} alt="Bonus" class="special-icon" />
								<div class="special-info">
									<strong>Bonus</strong>
									<p>Landing 3 or more Bonus symbols anywhere on the grid triggers the Bonus Round. Bonus symbols do not need to form a cluster.</p>
								</div>
							</div>
							<div class="special-row">
								<img src={SUPER_IMG} alt="Super Bonus" class="special-icon" />
								<div class="special-info">
									<strong>Super Bonus</strong>
									<p>Counts as a Bonus symbol. When at least 1 Super Bonus symbol appears alongside 3 or more Bonus symbols, the Super Bonus Round is triggered instead of the standard Bonus Round.</p>
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
								<div class="step"><span class="step-num">1</span> {t('All clusters on the grid are evaluated and paid.')}</div>
								<div class="step"><span class="step-num">2</span> {t('Symbols that formed part of a paying cluster are removed.')}</div>
								<div class="step"><span class="step-num">3</span> {t('Remaining symbols fall downward to fill empty spaces.')}</div>
								<div class="step"><span class="step-num">4</span> {t('New symbols drop in from the top of each column.')}</div>
								<div class="step"><span class="step-num">5</span> {t('This repeats until no new paying clusters are formed.')}</div>
							</div>
						</div>
					</div>

					<div class="section">
						<h2>Cell Multipliers</h2>
						<div class="feature-block">
							<p>Every cell on the grid has a multiplier that starts inactive.</p>
							<ul>
								<li>When a cell is part of a winning cluster, it receives a <strong>2×</strong> multiplier. If the cell already has an active multiplier, it doubles with each additional winning tumble (<strong>2× → 4× → 8× → 16×</strong>, and so on, up to a maximum of <strong>1,024×</strong>).</li>
								<li>Wild symbols are the only symbols that can belong to more than one cluster at a time. Even so, a Wild's cell multiplier only increases <strong>once</strong> per tumble step, regardless of how many clusters it helps complete.</li>
								<li>Multipliers are <strong>positional</strong>. They stay at their cell location on the grid, not with the symbol.</li>
								<li>{t('When calculating a cluster\'s payout, the multipliers of all cells in that cluster with an active multiplier are added together, and the total is applied to the base pay. If no cells in the cluster have an active multiplier, only the base pay applies.')}</li>
							</ul>
							<div class="highlight-box">
								<strong>Base Game:</strong> All cell multipliers reset to inactive at the start of each spin.<br />
								<strong>Bonus &amp; Super Bonus:</strong> Cell multipliers carry over from the triggering base-game spin and continue accumulating across every spin in the round.
							</div>
						</div>
					</div>

					<div class="section">
						<h2>Aurora Feature</h2>
						<div class="feature-block">
							<div class="feature-visual">
								<svg viewBox="0 0 64 64" width="72" height="72" xmlns="http://www.w3.org/2000/svg">
									<defs>
										<filter id="auroraGlow" x="-50%" y="-50%" width="200%" height="200%">
											<feGaussianBlur stdDeviation="3" />
											<feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
										</filter>
									</defs>
									<polygon points="32,2 37,20 53.2,10.8 44,27 62,32 44,37 53.2,53.2 37,44 32,62 27,44 10.8,53.2 20,37 2,32 20,27 10.8,10.8 27,20" fill="#b44dff" stroke="#aa44ee" stroke-width="1.5" filter="url(#auroraGlow)" />
									<circle cx="32" cy="32" r="4" fill="#d4aaff" />
								</svg>
								<span class="feature-visual-label">Aurora Cell</span>
							</div>
							<p>At the start of each spin, <strong>0 to 5 Aurora cells</strong> are randomly assigned to positions on the grid.</p>
							<ul>
								<li>{t('When a paying cluster forms on a cell marked as Aurora, the Aurora cell activates and generates 1 to 3 Wild symbols as pending.')}</li>
								<li>Once activated, the Aurora cell is removed from the grid. Each Aurora cell can only activate once.</li>
								<li>{t('Pending Wilds are not placed immediately. Tumbles continue until no further clusters form, at which point all pending Wilds are placed onto the board, replacing paying symbols only.')}</li>
								<li>After placement, the tumble sequence resumes. If the placed Wilds create new clusters that overlap remaining Aurora cells, the process repeats.</li>
							</ul>
						</div>
					</div>

					<div class="section">
						<h2>Aurora Collection</h2>
						<p class="subtitle">Active during Bonus &amp; Super Bonus only</p>
						<div class="feature-block">
							<div class="feature-visual">
								<svg viewBox="0 0 80 95" width="88" height="104" xmlns="http://www.w3.org/2000/svg">
									<defs>
										<filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
											<feGaussianBlur stdDeviation="2" />
											<feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
										</filter>
									</defs>
									<g opacity="0.85">
										<polygon points="40,12 44.2,29.8 59.8,20.2 50.2,35.8 68,40 50.2,44.2 59.8,59.8 44.2,50.2 40,68 35.8,50.2 20.2,59.8 29.8,44.2 12,40 29.8,35.8 20.2,20.2 35.8,29.8" fill="none" stroke="#4de8ff" stroke-width="1" opacity="0.5" />
										<polygon points="40,21 53.4,26.6 59,40 53.4,53.4 40,59 26.6,53.4 21,40 26.6,26.6" fill="none" stroke="#4de8ff" stroke-width="1" opacity="0.5" />
										<line x1="40" y1="12" x2="40" y2="21" stroke="#4de8ff" stroke-width="1" opacity="0.5" />
										<line x1="59.8" y1="20.2" x2="53.4" y2="26.6" stroke="#4de8ff" stroke-width="1" opacity="0.5" />
										<line x1="68" y1="40" x2="59" y2="40" stroke="#4de8ff" stroke-width="1" opacity="0.5" />
										<line x1="59.8" y1="59.8" x2="53.4" y2="53.4" stroke="#4de8ff" stroke-width="1" opacity="0.5" />
										<line x1="40" y1="68" x2="40" y2="59" stroke="#4de8ff" stroke-width="1" opacity="0.5" />
										<line x1="20.2" y1="59.8" x2="26.6" y2="53.4" stroke="#4de8ff" stroke-width="1" opacity="0.5" />
										<line x1="12" y1="40" x2="21" y2="40" stroke="#4de8ff" stroke-width="1" opacity="0.5" />
										<line x1="20.2" y1="20.2" x2="26.6" y2="26.6" stroke="#4de8ff" stroke-width="1" opacity="0.5" />
										<circle cx="40" cy="12" r="2.5" fill="#4de8ff" filter="url(#nodeGlow)" />
										<circle cx="59.8" cy="20.2" r="2.5" fill="#4de8ff" filter="url(#nodeGlow)" />
										<circle cx="68" cy="40" r="2.5" fill="#4de8ff" filter="url(#nodeGlow)" />
										<circle cx="59.8" cy="59.8" r="2.5" fill="#4de8ff" filter="url(#nodeGlow)" />
										<circle cx="40" cy="68" r="2.5" fill="#4de8ff" filter="url(#nodeGlow)" />
										<circle cx="20.2" cy="59.8" r="2.5" fill="#4de8ff" filter="url(#nodeGlow)" />
										<circle cx="12" cy="40" r="2.5" fill="#4de8ff" filter="url(#nodeGlow)" />
										<circle cx="20.2" cy="20.2" r="2.5" fill="#4de8ff" filter="url(#nodeGlow)" />
										<circle cx="40" cy="40" r="2" fill="white" />
									</g>
									<text x="40" y="88" text-anchor="middle" fill="#4de8ff" font-family="Montserrat, Arial, sans-serif" font-size="10" font-weight="700" letter-spacing="1">WILDS: 0</text>
								</svg>
								<span class="feature-visual-label">Wild Meter</span>
							</div>
							<p>During Bonus or Super Bonus Rounds, an <strong>Aurora Collection</strong> tracker is displayed on screen.</p>
							<ul>
								<li>{t('When Aurora cells activate and place Wilds on the grid, any placed Wild that becomes part of a paying cluster is added to the collection.')}</li>
								<li>Wilds that do <strong>not</strong> form part of any cluster are <strong>not collected</strong> and are removed during the next tumble.</li>
								<li>{t('After all Bonus spins are completed, a Final Aurora Spin occurs: a fresh board is dealt using only paying symbols (no Bonus, Super Bonus, or Wild symbols can appear). The total number of wilds collected is then placed onto this board. Cell multipliers from the Bonus Round carry into this spin, and a full tumble sequence plays out.')}</li>
							</ul>
							<div class="highlight-box">
								<strong>Super Bonus:</strong> Aurora places 2 to 7 cells per spin instead of the standard 0 to 5.
							</div>
						</div>
					</div>

					<div class="section">
						<h2>Bonus Round</h2>
						<div class="feature-block">
							<p>Landing <strong>3 or more Bonus symbols</strong> anywhere on the grid triggers the Bonus Round.</p>
							<table class="info-table">
								<thead><tr><th>Bonus Symbols</th><th>Spins Awarded</th></tr></thead>
								<tbody>
									<tr><td>3</td><td>8</td></tr>
									<tr><td>4</td><td>11</td></tr>
									<tr><td>5+</td><td>14</td></tr>
								</tbody>
							</table>
							<p>Bonus symbols that land during the Bonus Round award additional spins (retrigger):</p>
							<table class="info-table compact">
								<thead><tr><th>Bonus Symbols</th><th>Extra Spins</th></tr></thead>
								<tbody>
									<tr><td>3</td><td>+5</td></tr>
									<tr><td>4</td><td>+8</td></tr>
									<tr><td>5</td><td>+11</td></tr>
									<tr><td>6</td><td>+14</td></tr>
									<tr><td>7</td><td>+17</td></tr>
									<tr><td>8+</td><td>+20</td></tr>
								</tbody>
							</table>
							<ul>
								<li>If the Aurora Collection has any Wilds at the end of the round, a Final Aurora Spin is played (see Aurora Collection above).</li>
							</ul>
						</div>
					</div>

					<div class="section">
						<h2>Super Bonus Round</h2>
						<div class="feature-block">
							<p>Landing <strong>3 or more Bonus symbols</strong> plus at least <strong>1 Super Bonus symbol</strong> on the same spin triggers the Super Bonus Round. Spins awarded equal the base Free Spin award plus a Super Bonus bonus: <strong>+2</strong> for 1 Super Bonus symbol, <strong>+4</strong> for 2 or more.</p>
							<table class="info-table">
								<thead><tr><th>Bonus Symbols</th><th>Super Bonus Symbols</th><th>Spins Awarded</th></tr></thead>
								<tbody>
									<tr><td>3</td><td>1</td><td>10</td></tr>
									<tr><td>3</td><td>2+</td><td>12</td></tr>
									<tr><td>4</td><td>1</td><td>13</td></tr>
									<tr><td>4</td><td>2+</td><td>15</td></tr>
									<tr><td>5+</td><td>1</td><td>16</td></tr>
									<tr><td>5+</td><td>2+</td><td>18</td></tr>
								</tbody>
							</table>
							<ul>
								<li>Aurora places <strong>2 to 7</strong> cells per spin.</li>
								<li>Aurora Collection is active. Collected Wilds are placed during the Final Aurora Spin at the end of the round.</li>
								<li>Bonus symbols that land during the Super Bonus Round award extra spins using the same retrigger table as the standard Bonus Round.</li>
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
								<img src="./assets/sprites/buttons_new/play_button.png" alt="Spin" class="control-btn-img" />
								<div class="control-info">
									<strong>Spin</strong>
									<p>{t('Starts a spin using the current bet amount. Press again during a spin to skip animations.')}</p>
								</div>
							</div>

							<div class="control-item">
								<div class="control-bet-arrows">
									<img src="./assets/sprites/buttons_new/increase_base.png" alt="Increase" class="control-btn-img-sm" />
									<img src="./assets/sprites/buttons_new/decrease_base.png" alt="Decrease" class="control-btn-img-sm" />
								</div>
								<div class="control-info">
									<strong>{t('Bet Adjust')}</strong>
									<p>{t('Increase or decrease the bet amount per spin. The total cost is shown in the bet display.')}</p>
								</div>
							</div>

							<div class="control-item">
								<img src="./assets/sprites/buttons_new/autoplay_base.png" alt="Autoplay" class="control-btn-img" />
								<div class="control-info">
									<strong>Autoplay</strong>
									<p>Automatically plays a set number of spins. Configure the number of rounds and optional stop conditions (e.g., on bonus trigger, on balance change).</p>
								</div>
							</div>

							<div class="control-item">
								<div class="turbo-speeds">
									<img src="./assets/sprites/buttons_new/play_bar_0002_turbo_normal.png" alt="Normal" class="turbo-speed-img" />
									<img src="./assets/sprites/buttons_new/play_bar_0002_turbo_turbo.png" alt="Turbo" class="turbo-speed-img" />
									<img src="./assets/sprites/buttons_new/play_bar_0002_turbo_super_turbo.png" alt="Super Turbo" class="turbo-speed-img" />
								</div>
								<div class="control-info">
									<strong>Spin Speed</strong>
									<p>Cycles through three speeds: Normal, Turbo, and Super Turbo. Each press advances to the next speed.</p>
								</div>
							</div>

							<div class="control-item">
								<img src="./assets/sprites/buttons_new/black_magic_studios_buy_button.png" alt="{t('Buy Feature')}" class="control-btn-img" />
								<div class="control-info">
									<strong>{t('Buy Feature')}</strong>
									<p>{t('Opens the feature menu where you can activate Extra Chance, select a grid multiplier, or buy directly into a bonus round.')}</p>
								</div>
							</div>

							<div class="control-item">
								<img src="./assets/sprites/buttons_new/menu_base.png" alt="Menu" class="control-btn-img" />
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
								<div class="control-label">{t('BET')}</div>
								<div class="control-info">
									<p>{t('Displays the total cost of the current spin, including any active bet mode modifiers.')}</p>
								</div>
							</div>
							<div class="control-item">
								<div class="control-label">WIN</div>
								<div class="control-info">
									<p>{t('Shows the total win amount for the current spin, including all tumble payouts.')}</p>
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
							<div class="stat"><span class="stat-label">RTP</span><span class="stat-value">{rtpDisplay}</span></div>
							<div class="stat"><span class="stat-label">Max Win</span><span class="stat-value">{maxWinDisplay}</span></div>
						</div>

						<div class="cluster-example">
							<p class="cluster-example-label">Winning Cluster Example</p>
							<p class="cluster-example-desc">{t('5 or more matching symbols connected horizontally or vertically form a paying cluster. Diagonal connections do not count.')}</p>
							<!-- svelte-ignore a11y_missing_attribute -->
							<svg class="cluster-svg" viewBox="0 0 250 200" xmlns="http://www.w3.org/2000/svg">
								<defs>
									<clipPath id="cell-0-0"><rect x="7" y="7" width="40" height="40" rx="4" /></clipPath>
									<clipPath id="cell-1-0"><rect x="55" y="7" width="40" height="40" rx="4" /></clipPath>
									<clipPath id="cell-2-0"><rect x="103" y="7" width="40" height="40" rx="4" /></clipPath>
									<clipPath id="cell-3-0"><rect x="151" y="7" width="40" height="40" rx="4" /></clipPath>
									<clipPath id="cell-4-0"><rect x="199" y="7" width="40" height="40" rx="4" /></clipPath>
									<clipPath id="cell-0-1"><rect x="7" y="55" width="40" height="40" rx="4" /></clipPath>
									<clipPath id="cell-1-1"><rect x="55" y="55" width="40" height="40" rx="4" /></clipPath>
									<clipPath id="cell-2-1"><rect x="103" y="55" width="40" height="40" rx="4" /></clipPath>
									<clipPath id="cell-3-1"><rect x="151" y="55" width="40" height="40" rx="4" /></clipPath>
									<clipPath id="cell-4-1"><rect x="199" y="55" width="40" height="40" rx="4" /></clipPath>
									<clipPath id="cell-0-2"><rect x="7" y="103" width="40" height="40" rx="4" /></clipPath>
									<clipPath id="cell-1-2"><rect x="55" y="103" width="40" height="40" rx="4" /></clipPath>
									<clipPath id="cell-2-2"><rect x="103" y="103" width="40" height="40" rx="4" /></clipPath>
									<clipPath id="cell-3-2"><rect x="151" y="103" width="40" height="40" rx="4" /></clipPath>
									<clipPath id="cell-4-2"><rect x="199" y="103" width="40" height="40" rx="4" /></clipPath>
									<clipPath id="cell-0-3"><rect x="7" y="151" width="40" height="40" rx="4" /></clipPath>
									<clipPath id="cell-1-3"><rect x="55" y="151" width="40" height="40" rx="4" /></clipPath>
									<clipPath id="cell-2-3"><rect x="103" y="151" width="40" height="40" rx="4" /></clipPath>
									<clipPath id="cell-3-3"><rect x="151" y="151" width="40" height="40" rx="4" /></clipPath>
									<clipPath id="cell-4-3"><rect x="199" y="151" width="40" height="40" rx="4" /></clipPath>
								</defs>
								<!-- Background grid cells -->
								{#each [0,1,2,3,4] as col}
									{#each [0,1,2,3] as row}
										<rect x={col * 48 + 5} y={row * 48 + 5} width="44" height="44" rx="6" fill="rgba(100,180,255,0.06)" stroke="rgba(100,180,255,0.12)" stroke-width="1" />
									{/each}
								{/each}
								<!-- Winning cluster highlight cells (H1 cluster of 7) -->
								<rect x="53" y="5" width="44" height="44" rx="6" fill="rgba(136,204,255,0.15)" stroke="#88ccff" stroke-width="1.5" />
								<rect x="53" y="53" width="44" height="44" rx="6" fill="rgba(136,204,255,0.15)" stroke="#88ccff" stroke-width="1.5" />
								<rect x="101" y="53" width="44" height="44" rx="6" fill="rgba(136,204,255,0.15)" stroke="#88ccff" stroke-width="1.5" />
								<rect x="101" y="101" width="44" height="44" rx="6" fill="rgba(136,204,255,0.15)" stroke="#88ccff" stroke-width="1.5" />
								<rect x="149" y="101" width="44" height="44" rx="6" fill="rgba(136,204,255,0.15)" stroke="#88ccff" stroke-width="1.5" />
								<rect x="149" y="53" width="44" height="44" rx="6" fill="rgba(136,204,255,0.15)" stroke="#88ccff" stroke-width="1.5" />
								<rect x="197" y="53" width="44" height="44" rx="6" fill="rgba(136,204,255,0.15)" stroke="#88ccff" stroke-width="1.5" />
								<!-- H1 symbols in winning cluster -->
								<image href={SYMBOL_SHEET} x={55 - 256 * 0 * (40/256)} y={7 - 0 * (40/256)} width={3 * 40} height={3 * 40} clip-path="url(#cell-1-0)" />
								<image href={SYMBOL_SHEET} x={55 - 256 * 0 * (40/256)} y={55 - 0 * (40/256)} width={3 * 40} height={3 * 40} clip-path="url(#cell-1-1)" />
								<image href={SYMBOL_SHEET} x={103 - 256 * 0 * (40/256)} y={55 - 0 * (40/256)} width={3 * 40} height={3 * 40} clip-path="url(#cell-2-1)" />
								<image href={SYMBOL_SHEET} x={103 - 256 * 0 * (40/256)} y={103 - 0 * (40/256)} width={3 * 40} height={3 * 40} clip-path="url(#cell-2-2)" />
								<image href={SYMBOL_SHEET} x={151 - 256 * 0 * (40/256)} y={103 - 0 * (40/256)} width={3 * 40} height={3 * 40} clip-path="url(#cell-3-2)" />
								<image href={SYMBOL_SHEET} x={151 - 256 * 0 * (40/256)} y={55 - 0 * (40/256)} width={3 * 40} height={3 * 40} clip-path="url(#cell-3-1)" />
								<image href={SYMBOL_SHEET} x={199 - 256 * 0 * (40/256)} y={55 - 0 * (40/256)} width={3 * 40} height={3 * 40} clip-path="url(#cell-4-1)" />
								<!-- Mixed other symbols in non-cluster cells -->
								<!-- L2 at (0,0) - sprite pos (0,256) -->
								<image href={SYMBOL_SHEET} x={7} y={7 - 256 * (40/256)} width={3 * 40} height={3 * 40} clip-path="url(#cell-0-0)" opacity="0.3" />
								<!-- H3 at (2,0) - sprite pos (512,0) -->
								<image href={SYMBOL_SHEET} x={103 - 512 * (40/256)} y={7} width={3 * 40} height={3 * 40} clip-path="url(#cell-2-0)" opacity="0.3" />
								<!-- L4 at (3,0) - sprite pos (512,256) -->
								<image href={SYMBOL_SHEET} x={151 - 512 * (40/256)} y={7 - 256 * (40/256)} width={3 * 40} height={3 * 40} clip-path="url(#cell-3-0)" opacity="0.3" />
								<!-- H2 at (4,0) - sprite pos (256,0) -->
								<image href={SYMBOL_SHEET} x={199 - 256 * (40/256)} y={7} width={3 * 40} height={3 * 40} clip-path="url(#cell-4-0)" opacity="0.3" />
								<!-- L3 at (0,1) - sprite pos (256,256) -->
								<image href={SYMBOL_SHEET} x={7 - 256 * (40/256)} y={55 - 256 * (40/256)} width={3 * 40} height={3 * 40} clip-path="url(#cell-0-1)" opacity="0.3" />
								<!-- H4 at (0,2) - sprite pos (0,512) -->
								<image href={SYMBOL_SHEET} x={7} y={103 - 512 * (40/256)} width={3 * 40} height={3 * 40} clip-path="url(#cell-0-2)" opacity="0.3" />
								<!-- L1 at (1,2) - sprite pos (256,512) -->
								<image href={SYMBOL_SHEET} x={55 - 256 * (40/256)} y={103 - 512 * (40/256)} width={3 * 40} height={3 * 40} clip-path="url(#cell-1-2)" opacity="0.3" />
								<!-- H2 at (4,2) - sprite pos (256,0) -->
								<image href={SYMBOL_SHEET} x={199 - 256 * (40/256)} y={103} width={3 * 40} height={3 * 40} clip-path="url(#cell-4-2)" opacity="0.3" />
								<!-- L2 at (0,3) - sprite pos (0,256) -->
								<image href={SYMBOL_SHEET} x={7} y={151 - 256 * (40/256)} width={3 * 40} height={3 * 40} clip-path="url(#cell-0-3)" opacity="0.3" />
								<!-- H3 at (1,3) - sprite pos (512,0) -->
								<image href={SYMBOL_SHEET} x={55 - 512 * (40/256)} y={151} width={3 * 40} height={3 * 40} clip-path="url(#cell-1-3)" opacity="0.3" />
								<!-- L4 at (2,3) - sprite pos (512,256) -->
								<image href={SYMBOL_SHEET} x={103 - 512 * (40/256)} y={151 - 256 * (40/256)} width={3 * 40} height={3 * 40} clip-path="url(#cell-2-3)" opacity="0.3" />
								<!-- L1 at (3,3) - sprite pos (256,512) -->
								<image href={SYMBOL_SHEET} x={151 - 256 * (40/256)} y={151 - 512 * (40/256)} width={3 * 40} height={3 * 40} clip-path="url(#cell-3-3)" opacity="0.3" />
								<!-- H4 at (4,3) - sprite pos (0,512) -->
								<image href={SYMBOL_SHEET} x={199} y={151 - 512 * (40/256)} width={3 * 40} height={3 * 40} clip-path="url(#cell-4-3)" opacity="0.3" />
							</svg>
						</div>
					</div>

					<div class="section">
						<h2>General Rules</h2>
						<div class="feature-block">
							<ul>
								<li>{t('Each paying symbol can only belong to one cluster. Wilds are the exception and can be shared across all adjacent clusters they connect.')}</li>
								<li>{t('Bonus and Super Bonus symbols are evaluated before tumbles begin. They do not need to form a cluster.')}</li>
								<li>{t('All payouts from a single spin, including tumbles and any triggered Bonus Round, are combined into one total amount.')}</li>
								<li>{t('The maximum payout per spin is capped at')} <strong>{maxWinDisplay}</strong> {t('the total bet. If this cap is reached during tumbles, remaining tumbles are skipped.')}</li>
								<li>{t('Cluster payouts use the paytable value for sizes up to 20. Clusters larger than 20 symbols use the same value as 20.')}</li>
							</ul>
						</div>
					</div>
				{/if}

				<!-- ═══════════════════════════════════════════ -->
				<!-- BET MODES                                  -->
				<!-- ═══════════════════════════════════════════ -->
				{#if (!isMobile && activeTab === 'modes') || (isMobile && currentTab === 'modes')}
					<div class="section">
						<h2>{t('Bet Modes')}</h2>

						<h3>{t('Standard')}</h3>
						<div class="feature-block">
							<p>{t('Default gameplay at the standard bet cost. All cell multipliers start at 1x. No additional modifiers are applied.')}</p>
						</div>

						<h3>{t('Extra Chance')}</h3>
						<div class="feature-block">
							<p>{t('Costs')} <strong>{anteCostDisplay}</strong> {t('the standard bet. Bonus symbols appear more frequently, and a Bonus symbol is guaranteed on the last reel each spin. This significantly increases the chance of triggering a Bonus Round.')}</p>
						</div>

						<h3>{t('Buy Bonus')}</h3>
						<div class="feature-block">
							<p>{t('Costs')} <strong>{bonusCostDisplay}</strong> {t('the standard bet. A trigger spin is played with 3 or more Bonus symbols guaranteed on the grid. The trigger spin plays out fully, including all tumbles, before entering the Bonus or Super Bonus Round. Spins awarded are determined by the standard trigger tables.')}</p>
						</div>

						<h3>Grid Multiplier Modes (M2X – M1024X)</h3>
						<div class="feature-block">
							<p>{t('These modes set a starting multiplier for every cell on the grid. The higher the starting multiplier, the higher the bet cost. In the base game, multipliers reset to the selected level at the start of each spin. In Bonus and Super Bonus Rounds, multipliers persist and accumulate from the selected starting level.')}</p>
							<table class="info-table">
								<thead>
									<tr><th>{t('Mode')}</th><th>{t('Starting Multiplier')}</th><th>{t('Bet Cost')}</th><th>{t('Description')}</th></tr>
								</thead>
								<tbody>
									{#each gridCostTable as row}
										<tr><td>M{row.label.replace('x','').toUpperCase()}X</td><td>{row.label}</td><td>{row.cost}</td><td>Every cell starts at {row.label} multiplier. All wins benefit from amplified multipliers from the first tumble.</td></tr>
									{/each}
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
							<p>{t('Malfunction voids all wins and bets. A consistent internet connection is required. In the event of a disconnection, reload the game to finish any uncompleted rounds. The expected return is calculated over many rounds. The game display is not representative of any physical device and is for illustrative purposes only. Winnings are settled according to the amount received from the Remote Game Server and not from events within the web browser.')} TM and &copy; 2026 Stake Engine.</p>
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
		overflow: hidden;

		button {
			flex: 1 1 0;
			min-width: 0;
			padding: 12px 4px;
			border: none;
			background: transparent;
			color: rgba(136, 204, 255, 0.6);
			font-family: 'Montserrat', Arial, sans-serif;
			font-size: clamp(7px, 1.3vw, 11px);
			font-weight: 600;
			letter-spacing: 0.2px;
			text-transform: uppercase;
			cursor: pointer;
			transition: all 0.2s;
			border-bottom: 2px solid transparent;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;

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
		overflow-x: hidden;
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

	.feature-visual {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
		margin-bottom: 14px;
		padding: 10px 0;
		border-radius: 8px;
		background: rgba(0, 0, 0, 0.2);
	}

	.feature-visual-label {
		font-size: 11px;
		font-weight: 600;
		color: rgba(136, 204, 255, 0.6);
		text-transform: uppercase;
		letter-spacing: 0.5px;
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

	/* ── Cluster example diagram ── */
	.cluster-example {
		margin-top: 16px;
		padding: 14px;
		border-radius: 10px;
		background: rgba(255, 255, 255, 0.03);
		border: 1px solid rgba(100, 180, 255, 0.08);
		text-align: center;
	}

	.cluster-example-label {
		font-family: 'Montserrat', Arial, sans-serif;
		font-size: 12px;
		font-weight: 600;
		color: rgba(136, 204, 255, 0.7);
		text-transform: uppercase;
		letter-spacing: 0.4px;
		margin: 0 0 4px;
	}

	.cluster-example-desc {
		font-size: 11.5px;
		color: rgba(255, 255, 255, 0.5);
		line-height: 1.5;
		margin: 0 0 12px;
	}

	.cluster-svg {
		width: 100%;
		max-width: 280px;
		height: auto;
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
		table-layout: fixed;
		word-wrap: break-word;

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
			overflow-wrap: break-word;
		}

		/* Allocate more space to the description column */
		th:last-child, td:last-child {
			width: 45%;
		}
		th:first-child, td:first-child {
			width: 15%;
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

		.stats-grid { grid-template-columns: repeat(3, 1fr); }

		.info-table {
			th, td {
				padding: 4px 4px;
				font-size: 10px;
			}
			th:last-child, td:last-child {
				width: 40%;
			}
		}
	}
</style>
