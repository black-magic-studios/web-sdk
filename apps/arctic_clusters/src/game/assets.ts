export default {
	background: {
		type: 'sprite',
		src: './assets/sprites/background/arctic_background_3840x2160.webp',
		preload: true,
	},
	studioLogo: {
		type: 'sprite',
		src: './assets/sprites/black_magic_studios_horizontal_logo_transparent.png',
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
		src: './assets/sprites/symbolsStatic/cool_clusters/symbols/arctic_clusters_bonus.png',
	},
	SS: {
		type: 'sprite',
		src: './assets/super.png',
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
		src: './assets/sprites/symbolsStatic/arctic_clusters_wild.png',
	},
	reelFrameEdge: {
		type: 'sprite',
		// Served from SvelteKit static/ in dev & production.
		src: './assets/sprites/reelsFrame/arctic_clusters_frame.png',
	},
	reelMask: {
		type: 'sprite',
		// Served from SvelteKit static/ in dev & production.
		src: './assets/sprites/reelsFrame/reel_mask/arctic_clusters_square_reel_mask.png',
	},
	cellBackground: {
		type: 'sprite',
		// Cell background for 7x7 grid - rendered behind multipliers and symbols
		src: './assets/sprites/reelsFrame/cell/arctic_clusters_cell.png',
	},
	// Multiplier grid symbol sprites (new design)
	multiGrid2x: {
		type: 'sprite',
		src: './assets/sprites/symbolsStatic/multiGrid/arctic_clusters_x2.png',
	},
	multiGrid4x: {
		type: 'sprite',
		src: './assets/sprites/symbolsStatic/multiGrid/arctic_clusters_x4.png',
	},
	multiGrid8x: {
		type: 'sprite',
		src: './assets/sprites/symbolsStatic/multiGrid/arctic_clusters_x8.png',
	},
	multiGrid16x: {
		type: 'sprite',
		src: './assets/sprites/symbolsStatic/multiGrid/arctic_clusters_x16.png',
	},
	multiGrid32x: {
		type: 'sprite',
		src: './assets/sprites/symbolsStatic/multiGrid/arctic_clusters_x32.png',
	},
	multiGrid64x: {
		type: 'sprite',
		src: './assets/sprites/symbolsStatic/multiGrid/arctic_clusters_x64.png',
	},
	multiGrid128x: {
		type: 'sprite',
		src: './assets/sprites/symbolsStatic/multiGrid/arctic_clusters_x128.png',
	},
	multiGrid256x: {
		type: 'sprite',
		src: './assets/sprites/symbolsStatic/multiGrid/arctic_clusters_x256.png',
	},
	multiGrid512x: {
		type: 'sprite',
		src: './assets/sprites/symbolsStatic/multiGrid/arctic_clusters_x512.png',
	},
	multiGrid1024x: {
		type: 'sprite',
		src: './assets/sprites/symbolsStatic/multiGrid/arctic_clusters_x1024.png',
	},
	multiplierFont: {
		type: 'font',
		src: new URL('../../assets/fonts/multiplierFont/multiplier.xml', import.meta.url).href,
	},
	multiplierFontHi: {
		type: 'font',
		src: new URL('../../assets/fonts/multiplierFont/multiplier_hi.xml', import.meta.url).href,
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
		src: new URL('../../assets/sprites/symbolsStatic/arctic_clusters_sprite_animations/clapping_paws_win_14x14_192f.json', import.meta.url).href,
	},
	h2WinAnimation: {
		type: 'spriteSheet',
		src: new URL('../../assets/sprites/symbolsStatic/arctic_clusters_sprite_animations/fox_win_14x14_192f.json', import.meta.url).href,
	},
	h3WinAnimation: {
		type: 'spriteSheet',
		src: new URL('../../assets/sprites/symbolsStatic/arctic_clusters_sprite_animations/narwhal_win_14x14_192f.json', import.meta.url).href,
	},
	h4WinAnimation: {
		type: 'spriteSheet',
		src: new URL('../../assets/sprites/symbolsStatic/arctic_clusters_sprite_animations/snowflake_spin_8x8_60f.json', import.meta.url).href,
	},
	symbolsStatic: {
		type: 'sprites',
		src: new URL('../../assets/sprites/symbolsStatic/symbolsStatic.json', import.meta.url).href,
	},
	sound: {
		type: 'audio',
		src: new URL('../../assets/audio/sounds.json', import.meta.url).href,
		preload: true,
	},
} as const;
