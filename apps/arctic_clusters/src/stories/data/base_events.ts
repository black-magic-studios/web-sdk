export default {
	reveal: {
		type: 'reveal',
		board: [
			[
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
				{
					name: 'L2',
				},
			],
			[
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
				{
					name: 'L4',
				},
			],
			[
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
				{
					name: 'L4',
				},
			],
			[
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
				{
					name: 'H3',
				},
			],
			[
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
				{
					name: 'L2',
				},
			],
			[
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
				{
					name: 'L4',
				},
			],
			[
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
				{
					name: 'L3',
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
		totalWin: 30,
		wins: [
			{
				symbol: 'L3',
				clusterSize: 6,
				win: 30,
				positions: [
					{ reel: 0, row: 5 },
					{ reel: 1, row: 5 },
					{ reel: 0, row: 6 },
					{ reel: 2, row: 5 },
					{ reel: 1, row: 4 },
					{ reel: 1, row: 6 },
				],
				meta: {
					globalMult: 1,
					clusterMult: 1,
					winWithoutMult: 30,
					overlay: { reel: 0, row: 5 },
				},
			},
		],
	},
	winInfo_TEST_mult5: {
		type: 'winInfo',
		totalWin: 150,
		wins: [
			{
				symbol: 'L3',
				clusterSize: 6,
				win: 150,
				positions: [
					{ reel: 0, row: 5 },
					{ reel: 1, row: 5 },
					{ reel: 0, row: 6 },
					{ reel: 2, row: 5 },
					{ reel: 1, row: 4 },
					{ reel: 1, row: 6 },
				],
				meta: {
					globalMult: 5,
					clusterMult: 1,
					winWithoutMult: 30,
					overlay: { reel: 0, row: 5 },
				},
			},
		],
	},
	winInfo_TEST_center: {
		type: 'winInfo',
		totalWin: 150,
		wins: [
			{
				symbol: 'L3',
				clusterSize: 6,
				win: 150,
				positions: [
					{ reel: 0, row: 5 },
					{ reel: 1, row: 5 },
					{ reel: 0, row: 6 },
					{ reel: 2, row: 5 },
					{ reel: 1, row: 4 },
					{ reel: 1, row: 6 },
				],
				meta: {
					globalMult: 5,
					clusterMult: 1,
					winWithoutMult: 30,
					overlay: { reel: 3, row: 3 },
				},
			},
		],
	},
	updateTumbleWin: {
		type: 'updateTumbleWin',
		amount: 30,
	},
	updateTumbleWin_TEST_mult5: {
		type: 'updateTumbleWin',
		amount: 150,
	},
	tumbleBoard: {
		type: 'tumbleBoard',
		newSymbols: [
			[
				{ name: 'L1' },
				{ name: 'L1' },
			],
			[
				{ name: 'L2' },
				{ name: 'L2' },
				{ name: 'H3' },
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
			{ reel: 0, row: 5 },
			{ reel: 0, row: 6 },
			{ reel: 1, row: 4 },
			{ reel: 1, row: 5 },
			{ reel: 1, row: 6 },
			{ reel: 2, row: 5 },
		],
	},
	setWin: {
		type: 'setWin',
		amount: 30,
		winLevel: 2,
	},
	freeSpinTrigger: {
		type: 'freeSpinTrigger',
		totalFs: 8,
		positions: [
			{ reel: 1, row: 2 },
			{ reel: 3, row: 6 },
			{ reel: 6, row: 5 },
		],
	},
	updateFreeSpin: {
		type: 'updateFreeSpin',
		amount: 1,
		total: 1,
	},
	freeSpinEnd: {
		type: 'freeSpinEnd',
		amount: 6930,
		winLevel: 5,
	},
	freeSpinRetrigger: {
		type: 'freeSpinRetrigger',
		totalFs: 13,
		positions: [
			{ reel: 5, row: 3 },
			{ reel: 5, row: 6 },
			{ reel: 6, row: 1 },
		],
	},
	wincap: {
		type: 'wincap',
		amount: 10000,
	},
};

