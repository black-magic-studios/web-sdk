export default {
	reveal: {
		type: 'reveal',
		board: [
			[
				{
					name: 'L1',
				},
				{
					name: 'L3',
				},
				{
					name: 'L4',
				},
				{
					name: 'H1',
				},
				{
					name: 'L1',
				},
				{
					name: 'L2',
				},
				{
					name: 'L3',
				},
				{
					name: 'L1',
				},
				{
					name: 'L3',
				},
			],
			[
				{
					name: 'L2',
				},
				{
					name: 'L1',
				},
				{
					name: 'S',
				},
				{
					name: 'H3',
				},
				{
					name: 'H4',
				},
				{
					name: 'L1',
				},
				{
					name: 'L2',
				},
				{
					name: 'H4',
				},
				{
					name: 'H3',
				},
			],
			[
				{
					name: 'L4',
				},
				{
					name: 'L2',
				},
				{
					name: 'H4',
				},
				{
					name: 'L3',
				},
				{
					name: 'L1',
				},
				{
					name: 'L4',
				},
				{
					name: 'L1',
				},
				{
					name: 'H3',
				},
				{
					name: 'L1',
				},
			],
			[
				{
					name: 'H3',
				},
				{
					name: 'H1',
				},
				{
					name: 'L4',
				},
				{
					name: 'H1',
				},
				{
					name: 'L3',
				},
				{
					name: 'L2',
				},
				{
					name: 'L2',
				},
				{
					name: 'H3',
				},
				{
					name: 'H1',
				},
			],
			[
				{
					name: 'H3',
				},
				{
					name: 'H4',
				},
				{
					name: 'L3',
				},
				{
					name: 'L4',
				},
				{
					name: 'L1',
				},
				{
					name: 'L1',
				},
				{
					name: 'L2',
				},
				{
					name: 'L2',
				},
				{
					name: 'H3',
				},
			],
			[
				{
					name: 'H1',
				},
				{
					name: 'L2',
				},
				{
					name: 'L3',
				},
				{
					name: 'L2',
				},
				{
					name: 'H1',
				},
				{
					name: 'L2',
				},
				{
					name: 'H1',
				},
				{
					name: 'H3',
				},
				{
					name: 'H4',
				},
			],
			[
				{
					name: 'H3',
				},
				{
					name: 'L1',
				},
				{
					name: 'H4',
				},
				{
					name: 'L1',
				},
				{
					name: 'H4',
				},
				{
					name: 'L1',
				},
				{
					name: 'H3',
				},
				{
					name: 'S',
				},
				{
					name: 'H4',
				},
			],
		],
		paddingPositions: [208, 220, 7, 166, 220, 62, 226],
		gameType: 'basegame',
		anticipation: [0, 0, 0, 0, 0, 0, 0],
	},
	updateGrid: {
		type: 'updateGrid',
		gridMultipliers: [
			[1, 1, 1, 1, 1, 1, 1],
			[1, 1, 1, 1, 1, 1, 1],
			[1, 1, 1, 1, 1, 1, 1],
			[1, 1, 1, 1, 1, 1, 1],
			[1, 1, 1, 1, 1, 1, 1],
			[1, 1, 1, 1, 1, 1, 1],
			[1, 1, 1, 1, 1, 1, 1],
		],
	},
	setTotalWin: {
		type: 'setTotalWin',
		amount: 0,
	},
	finalWin: {
		type: 'finalWin',
		amount: 0,
	},
	winInfo: {
		type: 'winInfo',
		totalWin: 1.7999999999999998,
		wins: [
			{
				symbol: 'L3',
				clusterSize: 6,
				win: 1.7999999999999998,
				positions: [
					{ reel: 0, row: 4 },
					{ reel: 1, row: 4 },
					{ reel: 0, row: 5 },
					{ reel: 2, row: 4 },
					{ reel: 1, row: 3 },
					{ reel: 1, row: 5 },
				],
				meta: {
					globalMult: 1,
					clusterMult: 6,
					winWithoutMult: 0.3,
					overlay: { reel: 0, row: 4 },
				},
			},
		],
	},
	updateTumbleWin: {
		type: 'updateTumbleWin',
		amount: 1.7999999999999998,
	},
	tumbleBoard: {
		type: 'tumbleBoard',
		newSymbols: [
			[
				{ name: 'L1' },
				{ name: 'L1' },
			],
			[
				{ name: 'H3' },
				{ name: 'L2' },
				{ name: 'L2' },
			],
			[
				{ name: 'L4' },
			],
			[
			],
			[
			],
			[
			],
			[
			],
		],
		explodingSymbols: [
			{ reel: 0, row: 4 },
			{ reel: 0, row: 5 },
			{ reel: 1, row: 3 },
			{ reel: 1, row: 4 },
			{ reel: 1, row: 5 },
			{ reel: 2, row: 4 },
		],
	},
	setWin: {
		type: 'setWin',
		amount: 1.7999999999999998,
		winLevel: 2,
	},
	freeSpinTrigger: {
		type: 'freeSpinTrigger',
		totalFs: 8,
		positions: [
			{ reel: 1, row: 1 },
			{ reel: 3, row: 5 },
			{ reel: 6, row: 4 },
		],
	},
	updateFreeSpin: {
		type: 'updateFreeSpin',
		amount: 1,
		total: 1,
	},
	freeSpinEnd: {
		type: 'freeSpinEnd',
		amount: 86.7,
		winLevel: 5,
	},
	freeSpinRetrigger: {
		type: 'freeSpinRetrigger',
		totalFs: 13,
		positions: [
			{ reel: 5, row: 2 },
			{ reel: 5, row: 5 },
			{ reel: 6, row: 0 },
		],
	},
	wincap: {
		type: 'wincap',
		amount: 10000,
	},
};

