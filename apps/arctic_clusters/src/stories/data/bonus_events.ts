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
					name: 'L1',
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
				{
					name: 'L1',
				},
				{
					name: 'L4',
				},
				{
					name: 'L2',
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
					name: 'S',
				},
				{
					name: 'L1',
				},
				{
					name: 'H4',
				},
				{
					name: 'L4',
				},
				{
					name: 'L3',
				},
				{
					name: 'L1',
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
					name: 'L3',
				},
				{
					name: 'L4',
				},
				{
					name: 'H1',
				},
				{
					name: 'H4',
				},
				{
					name: 'L1',
				},
				{
					name: 'L3',
				},
				{
					name: 'H4',
				},
				{
					name: 'L3',
				},
			],
			[
				{
					name: 'L3',
				},
				{
					name: 'H3',
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
					name: 'L2',
				},
				{
					name: 'S',
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
					name: 'L2',
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
					name: 'L2',
				},
				{
					name: 'L1',
				},
				{
					name: 'H1',
				},
				{
					name: 'L1',
				},
				{
					name: 'H4',
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
					name: 'L2',
				},
				{
					name: 'L3',
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
					name: 'L2',
				},
			],
			[
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
				{
					name: 'H1',
				},
			],
		],
		paddingPositions: [223, 169, 69, 213, 16, 261, 227],
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
	freeSpinTrigger: {
		type: 'freeSpinTrigger',
		totalFs: 8,
		positions: [
			{ reel: 1, row: 2 },
			{ reel: 3, row: 6 },
			{ reel: 6, row: 5 },
		],
	},
	winInfo: {
		type: 'winInfo',
		totalWin: 30,
		wins: [
			{
				symbol: 'L4',
				clusterSize: 7,
				win: 30,
				positions: [
					{ reel: 0, row: 1 },
					{ reel: 0, row: 2 },
					{ reel: 1, row: 2 },
					{ reel: 0, row: 3 },
					{ reel: 2, row: 2 },
					{ reel: 2, row: 3 },
					{ reel: 2, row: 4 },
				],
				meta: {
					globalMult: 1,
					clusterMult: 1,
					winWithoutMult: 30,
					overlay: { reel: 0, row: 1 },
				},
			},
		],
	},
	tumbleBoard: {
		type: 'tumbleBoard',
		newSymbols: [
			[
				{ name: 'H2' },
				{ name: 'H1' },
				{ name: 'H4' },
			],
			[
				{ name: 'L2' },
			],
			[
				{ name: 'H3' },
				{ name: 'H4' },
				{ name: 'H4' },
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
			{ reel: 0, row: 1 },
			{ reel: 0, row: 2 },
			{ reel: 0, row: 3 },
			{ reel: 1, row: 2 },
			{ reel: 2, row: 2 },
			{ reel: 2, row: 3 },
			{ reel: 2, row: 4 },
		],
	},
	freeSpinEnd: {
		type: 'freeSpinEnd',
		amount: 6930,
		winLevel: 5,
	}
};
