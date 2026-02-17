export default {
	background: {
		type: 'sprite',
		src: '/assets/sprites/background/arctic_clusters_background.png',
		preload: true,
	},
	loader: {
		type: 'spine',
		src: {
			atlas: new URL('../../assets/spines/loader/loader.atlas', import.meta.url).href,
			skeleton: new URL('../../assets/spines/loader/loader.json', import.meta.url).href,
			scale: 2,
		},
		preload: true,
	},
	pressToContinueText: {
		type: 'sprites',
		src: new URL('../../assets/sprites/pressToContinueText/MM_pressanywhere.json', import.meta.url).href,
		preload: true,
	},
	H1: {
		type: 'spine',
		src: {
			atlas: new URL('../../assets/spines/symbols/symbols.atlas', import.meta.url).href,
			skeleton: new URL('../../assets/spines/symbols/h1.json', import.meta.url).href,
			scale: 2,
		},
	},
	H2: {
		type: 'spine',
		src: {
			atlas: new URL('../../assets/spines/symbols/symbols.atlas', import.meta.url).href,
			skeleton: new URL('../../assets/spines/symbols/h2.json', import.meta.url).href,
			scale: 2,
		},
	},
	H3: {
		type: 'spine',
		src: {
			atlas: new URL('../../assets/spines/symbols/symbols.atlas', import.meta.url).href,
			skeleton: new URL('../../assets/spines/symbols/h3.json', import.meta.url).href,
			scale: 2,
		},
	},
	H4: {
		type: 'spine',
		src: {
			atlas: new URL('../../assets/spines/symbols/symbols.atlas', import.meta.url).href,
			skeleton: new URL('../../assets/spines/symbols/h4.json', import.meta.url).href,
			scale: 2,
		},
	},
	L1: {
		type: 'spine',
		src: {
			atlas: new URL('../../assets/spines/symbols/symbols.atlas', import.meta.url).href,
			skeleton: new URL('../../assets/spines/symbols/l1.json', import.meta.url).href,
			scale: 2,
		},
	},
	L2: {
		type: 'spine',
		src: {
			atlas: new URL('../../assets/spines/symbols/symbols.atlas', import.meta.url).href,
			skeleton: new URL('../../assets/spines/symbols/l2.json', import.meta.url).href,
			scale: 2,
		},
	},
	L3: {
		type: 'spine',
		src: {
			atlas: new URL('../../assets/spines/symbols/symbols.atlas', import.meta.url).href,
			skeleton: new URL('../../assets/spines/symbols/l3.json', import.meta.url).href,
			scale: 2,
		},
	},
	L4: {
		type: 'spine',
		src: {
			atlas: new URL('../../assets/spines/symbols/symbols.atlas', import.meta.url).href,
			skeleton: new URL('../../assets/spines/symbols/l4.json', import.meta.url).href,
			scale: 2,
		},
	},
	M: {
		type: 'spine',
		src: {
			atlas: new URL('../../assets/spines/symbols2/symbols2.atlas', import.meta.url).href,
			skeleton: new URL('../../assets/spines/symbols2/M.json', import.meta.url).href,
			scale: 2,
		},
	},
	S: {
		type: 'sprite',
		src: '/assets/sprites/symbolsStatic/cool_clusters/symbols/arctic_clusters_bonus.png',
	},
	explosion: {
		type: 'spine',
		src: {
			atlas: new URL('../../assets/spines/symbols3/symbols3.atlas', import.meta.url).href,
			skeleton: new URL('../../assets/spines/symbols3/explosion.json', import.meta.url).href,
			scale: 2,
		},
	},
	W: {
		type: 'sprite',
		src: '/assets/sprites/symbolsStatic/arctic_clusters_wild.png',
	},
	reelFrameEdge: {
		type: 'sprite',
		// Served from SvelteKit static/ in dev & production.
		src: '/assets/sprites/reelsFrame/arctic_clusters_frame.png',
	},
	reelMask: {
		type: 'sprite',
		// Served from SvelteKit static/ in dev & production.
		src: '/assets/sprites/reelsFrame/reel_mask/arctic_clusters_square_reel_mask.png',
	},
	cellBackground: {
		type: 'sprite',
		// Cell background for 7x7 grid - rendered behind multipliers and symbols
		src: '/assets/sprites/reelsFrame/cell/arctic_clusters_cell.png',
	},
	// Aurora-borealis gradient multiplier cells (pre-rendered for performance)
	// Each tier's gradient starts with the previous tier's end color for continuity
	multiplierCell2x: {
		type: 'sprite',
		src: '/assets/sprites/reelsFrame/cell/multipliers/multi_cell_2x.png',
	},
	multiplierCell4x: {
		type: 'sprite',
		src: '/assets/sprites/reelsFrame/cell/multipliers/multi_cell_4x.png',
	},
	multiplierCell8x: {
		type: 'sprite',
		src: '/assets/sprites/reelsFrame/cell/multipliers/multi_cell_8x.png',
	},
	multiplierCell16x: {
		type: 'sprite',
		src: '/assets/sprites/reelsFrame/cell/multipliers/multi_cell_16x.png',
	},
	multiplierCell32x: {
		type: 'sprite',
		src: '/assets/sprites/reelsFrame/cell/multipliers/multi_cell_32x.png',
	},
	multiplierCell64x: {
		type: 'sprite',
		src: '/assets/sprites/reelsFrame/cell/multipliers/multi_cell_64x.png',
	},
	multiplierCell128x: {
		type: 'sprite',
		src: '/assets/sprites/reelsFrame/cell/multipliers/multi_cell_128x.png',
	},
	multiplierCell256x: {
		type: 'sprite',
		src: '/assets/sprites/reelsFrame/cell/multipliers/multi_cell_256x.png',
	},
	multiplierCell512x: {
		type: 'sprite',
		src: '/assets/sprites/reelsFrame/cell/multipliers/multi_cell_512x.png',
	},
	multiplierCell1024x: {
		type: 'sprite',
		src: '/assets/sprites/reelsFrame/cell/multipliers/multi_cell_1024x.png',
	},
	// Multiplier grid symbol sprites (new design)
	multiGrid2x: {
		type: 'sprite',
		src: '/assets/sprites/symbolsStatic/multiGrid/arctic_clusters_x2.png',
	},
	multiGrid4x: {
		type: 'sprite',
		src: '/assets/sprites/symbolsStatic/multiGrid/arctic_clusters_x4.png',
	},
	multiGrid8x: {
		type: 'sprite',
		src: '/assets/sprites/symbolsStatic/multiGrid/arctic_clusters_x8.png',
	},
	multiGrid16x: {
		type: 'sprite',
		src: '/assets/sprites/symbolsStatic/multiGrid/arctic_clusters_x16.png',
	},
	multiGrid32x: {
		type: 'sprite',
		src: '/assets/sprites/symbolsStatic/multiGrid/arctic_clusters_x32.png',
	},
	multiGrid64x: {
		type: 'sprite',
		src: '/assets/sprites/symbolsStatic/multiGrid/arctic_clusters_x64.png',
	},
	multiGrid128x: {
		type: 'sprite',
		src: '/assets/sprites/symbolsStatic/multiGrid/arctic_clusters_x128.png',
	},
	multiGrid256x: {
		type: 'sprite',
		src: '/assets/sprites/symbolsStatic/multiGrid/arctic_clusters_x256.png',
	},
	multiGrid512x: {
		type: 'sprite',
		src: '/assets/sprites/symbolsStatic/multiGrid/arctic_clusters_x512.png',
	},
	multiGrid1024x: {
		type: 'sprite',
		src: '/assets/sprites/symbolsStatic/multiGrid/arctic_clusters_x1024.png',
	},
	payFrame: {
		type: 'sprite',
		src: new URL('../../assets/sprites/payFrame/payFrame.png', import.meta.url).href,
	},
	anticipation: {
		type: 'spine',
		src: {
			atlas: new URL('../../assets/spines/anticipation/anticipation.atlas', import.meta.url).href,
			skeleton: new URL('../../assets/spines/anticipation/anticipation.json', import.meta.url).href,
			scale: 2,
		},
	},
	goldFont: {
		type: 'font',
		src: new URL('../../assets/fonts/goldFont/mm_gold.xml', import.meta.url).href,
	},
	goldBlur: {
		type: 'font',
		src: new URL('../../assets/fonts/goldBlur/miningfont_gold_blur.xml', import.meta.url).href,
	},
	silverFont: {
		type: 'font',
		src: new URL('../../assets/fonts/silverFont/mm_silver.xml', import.meta.url).href,
	},
	purpleFont: {
		type: 'font',
		src: new URL('../../assets/fonts/purpleFont/mm_purple.xml', import.meta.url).href,
	},
	multiplierFont: {
		type: 'font',
		src: new URL('../../assets/fonts/multiplierFont/multiplier.xml', import.meta.url).href,
	},
	multiplierFontHi: {
		type: 'font',
		src: new URL('../../assets/fonts/multiplierFont/multiplier_hi.xml', import.meta.url).href,
	},
	bigwin: {
		type: 'spine',
		src: {
			atlas: new URL('../../assets/spines/bigwin/big_wins.atlas', import.meta.url).href,
			skeleton: new URL('../../assets/spines/bigwin/mm_bigwin.json', import.meta.url).href,
			scale: 2,
		},
	},
	globalMultiplier: {
		type: 'spine',
		src: {
			atlas: new URL('../../assets/spines/globalMultiplier/multiframe.atlas', import.meta.url).href,
			skeleton: new URL('../../assets/spines/globalMultiplier/multiframe.json', import.meta.url).href,
			scale: 2,
		},
	},
	fsIntro: {
		type: 'spine',
		src: {
			atlas: new URL('../../assets/spines/fsIntro/fs_screen.atlas', import.meta.url).href,
			skeleton: new URL('../../assets/spines/fsIntro/fs_screen.json', import.meta.url).href,
			scale: 2,
		},
	},
	fsIntroNumber: {
		type: 'spine',
		src: {
			atlas: new URL('../../assets/spines/fsIntro/fs_screen.atlas', import.meta.url).href,
			skeleton: new URL('../../assets/spines/fsIntro/fs_screen_number.json', import.meta.url).href,
			scale: 2,
		},
	},
	fsOutroNumber: {
		type: 'spine',
		src: {
			atlas: new URL('../../assets/spines/fsIntro/fs_screen.atlas', import.meta.url).href,
			skeleton: new URL('../../assets/spines/fsIntro/fs_total_number.json', import.meta.url).href,
			scale: 2,
		},
	},
	foregroundAnimation: {
		type: 'spine',
		src: {
			atlas: new URL('../../assets/spines/foregroundAnimation/mm_bg.atlas', import.meta.url).href,
			skeleton: new URL('../../assets/spines/foregroundAnimation/mm_bg.json', import.meta.url).href,
			scale: 2,
		},
		preload: true,
	},
	foregroundFeatureAnimation: {
		type: 'spine',
		src: {
			atlas: new URL('../../assets/spines/foregroundFeatureAnimation/mm_bg_feature.atlas', import.meta.url).href,
			skeleton: new URL('../../assets/spines/foregroundFeatureAnimation/mm_bg_feature.json', import.meta.url).href,
			scale: 2,
		},
		preload: true,
	},
	tumble_multiplier: {
		type: 'spine',
		src: {
			atlas: new URL('../../assets/spines/tumbleWin/tumble_win.atlas', import.meta.url).href,
			skeleton: new URL('../../assets/spines/tumbleWin/tumble_multiplier.json', import.meta.url).href,
			scale: 2,
		},
	},
	tumble_win: {
		type: 'spine',
		src: {
			atlas: new URL('../../assets/spines/tumbleWin/tumble_win.atlas', import.meta.url).href,
			skeleton: new URL('../../assets/spines/tumbleWin/tumble_win.json', import.meta.url).href,
			scale: 2,
		},
	},
	snowPuff: {
		type: 'spriteSheet',
		src: new URL('../../assets/spines/tumbleWin/starexplosion_spritesheet.json', import.meta.url).href,
	},
	snowPoof: {
		type: 'spriteSheet',
		src: new URL('../../assets/spines/tumbleWin/snow_poof_spritesheet.json', import.meta.url).href,
	},
	glowH1: {
		type: 'spriteSheet',
		src: new URL('../../assets/spines/tumbleWin/glow_H1_spritesheet.json', import.meta.url).href,
	},
	glowH2: {
		type: 'spriteSheet',
		src: new URL('../../assets/spines/tumbleWin/glow_H2_spritesheet.json', import.meta.url).href,
	},
	glowH3: {
		type: 'spriteSheet',
		src: new URL('../../assets/spines/tumbleWin/glow_H3_spritesheet.json', import.meta.url).href,
	},
	glowH4: {
		type: 'spriteSheet',
		src: new URL('../../assets/spines/tumbleWin/glow_H4_spritesheet.json', import.meta.url).href,
	},
	glowL1: {
		type: 'spriteSheet',
		src: new URL('../../assets/spines/tumbleWin/glow_L1_spritesheet.json', import.meta.url).href,
	},
	glowL2: {
		type: 'spriteSheet',
		src: new URL('../../assets/spines/tumbleWin/glow_L2_spritesheet.json', import.meta.url).href,
	},
	glowL3: {
		type: 'spriteSheet',
		src: new URL('../../assets/spines/tumbleWin/glow_L3_spritesheet.json', import.meta.url).href,
	},
	glowL4: {
		type: 'spriteSheet',
		src: new URL('../../assets/spines/tumbleWin/glow_L4_spritesheet.json', import.meta.url).href,
	},
	glowGeneric: {
		type: 'spriteSheet',
		src: new URL('../../assets/spines/tumbleWin/glow_generic_spritesheet.json', import.meta.url).href,
	},
	h1WinAnimation: {
		type: 'spriteSheet',
		src: new URL('../../assets/sprites/symbolsStatic/arctic_clusters_sprite_animations/polar_bear_sprite_centered_8x4_32f.json', import.meta.url).href,
	},
	reelhouse: {
		type: 'spine',
		src: {
			atlas: new URL('../../assets/spines/reelhouse/reelhouse_glow.atlas', import.meta.url).href,
			skeleton: new URL('../../assets/spines/reelhouse/reelhouse_glow.json', import.meta.url).href,
			scale: 2,
		},
	},
	progressBar: {
		type: 'sprites',
		src: new URL('../../assets/sprites/progressBar/progressBar.json', import.meta.url).href,
		preload: true,
	},
	freeSpins: {
		type: 'sprites',
		src: new URL('../../assets/sprites/freeSpins/freeSpins.json', import.meta.url).href,
	},
	winSmall: {
		type: 'sprites',
		src: new URL('../../assets/sprites/winSmall/MM_Localisation_winsmall.json', import.meta.url).href,
	},
	clusterWin: {
		type: 'spine',
		src: {
			atlas: new URL('../../assets/spines/clusterWin/clusterpay.atlas', import.meta.url).href,
			skeleton: new URL('../../assets/spines/clusterWin/clusterpay.json', import.meta.url).href,
			scale: 2,
		},
	},
	transition: {
		type: 'spine',
		src: {
			atlas: new URL('../../assets/spines/transition/transition.atlas', import.meta.url).href,
			skeleton: new URL('../../assets/spines/transition/transition.json', import.meta.url).href,
			scale: 2,
		},
	},
	symbolsStatic: {
		type: 'sprites',
		src: new URL('../../assets/sprites/symbolsStatic/symbolsStatic.json', import.meta.url).href,
	},
	coins: {
		type: 'spriteSheet',
		src: new URL('../../assets/sprites/coin/SD2_Coin.json', import.meta.url).href,
	},
	sound: {
		type: 'audio',
		src: new URL('../../assets/audio/sounds.json', import.meta.url).href,
		preload: true,
	},
} as const;
