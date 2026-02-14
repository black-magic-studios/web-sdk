export default [
	{
		id: 1,
		payoutMultiplier: 69.3,
		events: [
			{
				index: 0,
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
						}
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
							scatter: true,
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
						}
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
						}
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
							scatter: true,
						},
						{
							name: 'L1',
						},
						{
							name: 'L4',
						}
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
						}
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
						}
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
							scatter: true,
						},
						{
							name: 'H4',
						},
						{
							name: 'L3',
						},
						{
							name: 'H1',
						}
					]
				],
				paddingPositions: [223, 169, 69, 213, 16, 261, 227],
				gameType: 'basegame',
				anticipation: [0, 0, 0, 0, 0, 0, 0]
			},
			{
				index: 1,
				type: 'updateGrid',
				gridMultipliers: [
					[1, 1, 1, 1, 1, 1, 1],
					[1, 1, 1, 1, 1, 1, 1],
					[1, 1, 1, 1, 1, 1, 1],
					[1, 1, 1, 1, 1, 1, 1],
					[1, 1, 1, 1, 1, 1, 1],
					[1, 1, 1, 1, 1, 1, 1],
					[1, 1, 1, 1, 1, 1, 1]
				]
			},
			{
				index: 2,
				type: 'freeSpinTrigger',
				totalFs: 8,
				positions: [
					{ reel: 1, row: 2 },
					{ reel: 3, row: 6 },
					{ reel: 6, row: 5 }
				]
			},
			{
				index: 3,
				type: 'glyphInit',
				glyphPositions: [
					{ reel: 0, row: 2 },
					{ reel: 0, row: 3 },
					{ reel: 0, row: 6 },
					{ reel: 1, row: 1 },
					{ reel: 1, row: 3 },
					{ reel: 3, row: 1 },
					{ reel: 3, row: 4 },
					{ reel: 3, row: 7 },
					{ reel: 4, row: 2 },
					{ reel: 5, row: 2 },
					{ reel: 5, row: 6 },
					{ reel: 5, row: 7 },
					{ reel: 6, row: 1 }
				],
				totalGlyphs: 13
			},
			{
				index: 4,
				type: 'updateFreeSpin',
				amount: 1,
				total: 1
			},
			{
				index: 5,
				type: 'reveal',
				board: [
					[
						{
							name: 'L1',
						},
						{
							name: 'L4',
						},
						{
							name: 'L4',
						},
						{
							name: 'L4',
						},
						{
							name: 'H4',
						},
						{
							name: 'H1',
						},
						{
							name: 'L2',
						},
						{
							name: 'L2',
						},
						{
							name: 'L3',
						}
					],
					[
						{
							name: 'L1',
						},
						{
							name: 'H2',
						},
						{
							name: 'L4',
						},
						{
							name: 'H4',
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
							name: 'L3',
						},
						{
							name: 'L1',
						}
					],
					[
						{
							name: 'H1',
						},
						{
							name: 'H3',
						},
						{
							name: 'W',
							wild: true,
						},
						{
							name: 'L4',
						},
						{
							name: 'L4',
						},
						{
							name: 'H2',
						},
						{
							name: 'H2',
						},
						{
							name: 'H2',
						},
						{
							name: 'L4',
						}
					],
					[
						{
							name: 'L3',
						},
						{
							name: 'H4',
						},
						{
							name: 'H4',
						},
						{
							name: 'H3',
						},
						{
							name: 'H3',
						},
						{
							name: 'L4',
						},
						{
							name: 'L4',
						},
						{
							name: 'L3',
						},
						{
							name: 'L2',
						}
					],
					[
						{
							name: 'H1',
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
							name: 'H4',
						},
						{
							name: 'H2',
						},
						{
							name: 'L4',
						},
						{
							name: 'L4',
						},
						{
							name: 'H3',
						}
					],
					[
						{
							name: 'L3',
						},
						{
							name: 'H1',
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
							name: 'H2',
						},
						{
							name: 'L1',
						},
						{
							name: 'H3',
						},
						{
							name: 'L4',
						}
					],
					[
						{
							name: 'L3',
						},
						{
							name: 'H2',
						},
						{
							name: 'H1',
						},
						{
							name: 'L3',
						},
						{
							name: 'L3',
						},
						{
							name: 'H3',
						},
						{
							name: 'H2',
						},
						{
							name: 'H2',
						},
						{
							name: 'H1',
						}
					]
				],
				paddingPositions: [7, 5, 176, 37, 187, 223, 284],
				gameType: 'freegame',
				anticipation: [0, 0, 0, 0, 0, 0, 0]
			},
			{
				index: 6,
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
							{ reel: 2, row: 4 }
						],
						meta: {
							globalMult: 1,
							clusterMult: 1,
							winWithoutMult: 30,
							overlay: { reel: 0, row: 1 }
						}
					}
				]
			},
			{
				index: 7,
				type: 'glyphActivation',
				position: { reel: 0, row: 2 },
				activatedCount: 1,
				totalGlyphs: 13
			},
			{
				index: 8,
				type: 'glyphActivation',
				position: { reel: 0, row: 3 },
				activatedCount: 2,
				totalGlyphs: 13
			},
			{
				index: 9,
				type: 'updateGrid',
				gridMultipliers: [
					[2, 2, 2, 1, 1, 1, 1],
					[1, 2, 1, 1, 1, 1, 1],
					[1, 2, 2, 2, 1, 1, 1],
					[1, 1, 1, 1, 1, 1, 1],
					[1, 1, 1, 1, 1, 1, 1],
					[1, 1, 1, 1, 1, 1, 1],
					[1, 1, 1, 1, 1, 1, 1]
				]
			},
			{
				index: 10,
				type: 'updateTumbleWin',
				amount: 30
			},
			{
				index: 11,
				type: 'tumbleBoard',
				newSymbols: [
					[
						{ name: 'H2' },
						{ name: 'H1' },
						{ name: 'H4' }
					],
					[
						{ name: 'L2' }
					],
					[
						{ name: 'H3' },
						{ name: 'H4' },
						{ name: 'H4' }
					],
					[
					],
					[
					],
					[
					],
					[
					]
				],
				explodingSymbols: [
					{ reel: 0, row: 1 },
					{ reel: 0, row: 2 },
					{ reel: 0, row: 3 },
					{ reel: 1, row: 2 },
					{ reel: 2, row: 2 },
					{ reel: 2, row: 3 },
					{ reel: 2, row: 4 }
				]
			},
			{
				index: 12,
				type: 'setWin',
				amount: 30,
				winLevel: 2
			},
			{
				index: 13,
				type: 'setTotalWin',
				amount: 30
			},
			{
				index: 14,
				type: 'winInfo',
				totalWin: 600,
				wins: [
					{
						symbol: 'H4',
						clusterSize: 8,
						win: 600,
						positions: [
							{ reel: 0, row: 3 },
							{ reel: 1, row: 3 },
							{ reel: 0, row: 4 },
							{ reel: 2, row: 3 },
							{ reel: 1, row: 4 },
							{ reel: 2, row: 2 },
							{ reel: 3, row: 2 },
							{ reel: 3, row: 1 }
						],
						meta: {
							globalMult: 1,
							clusterMult: 6,
							winWithoutMult: 100,
							overlay: { reel: 0, row: 3 }
						}
					}
				]
			},
			{
				index: 15,
				type: 'glyphActivation',
				position: { reel: 1, row: 3 },
				activatedCount: 3,
				totalGlyphs: 13
			},
			{
				index: 16,
				type: 'glyphActivation',
				position: { reel: 3, row: 1 },
				activatedCount: 4,
				totalGlyphs: 13
			},
			{
				index: 17,
				type: 'updateGrid',
				gridMultipliers: [
					[2, 2, 4, 2, 1, 1, 1],
					[1, 2, 2, 2, 1, 1, 1],
					[1, 4, 4, 2, 1, 1, 1],
					[2, 2, 1, 1, 1, 1, 1],
					[1, 1, 1, 1, 1, 1, 1],
					[1, 1, 1, 1, 1, 1, 1],
					[1, 1, 1, 1, 1, 1, 1]
				]
			},
			{
				index: 18,
				type: 'updateTumbleWin',
				amount: 630
			},
			{
				index: 19,
				type: 'tumbleBoard',
				newSymbols: [
					[
						{ name: 'H2' },
						{ name: 'L2' }
					],
					[
						{ name: 'L3' },
						{ name: 'L4' }
					],
					[
						{ name: 'H3' },
						{ name: 'H4' }
					],
					[
						{ name: 'H4' },
						{ name: 'L1' }
					],
					[
					],
					[
					],
					[
					]
				],
				explodingSymbols: [
					{ reel: 0, row: 3 },
					{ reel: 0, row: 4 },
					{ reel: 1, row: 3 },
					{ reel: 1, row: 4 },
					{ reel: 2, row: 2 },
					{ reel: 2, row: 3 },
					{ reel: 3, row: 1 },
					{ reel: 3, row: 2 }
				]
			},
			{
				index: 20,
				type: 'setWin',
				amount: 630,
				winLevel: 2
			},
			{
				index: 21,
				type: 'setTotalWin',
				amount: 630
			},
			{
				index: 22,
				type: 'updateFreeSpin',
				amount: 2,
				total: 3
			},
			{
				index: 23,
				type: 'reveal',
				board: [
					[
						{
							name: 'L1',
						},
						{
							name: 'L4',
						},
						{
							name: 'H3',
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
						{
							name: 'L4',
						},
						{
							name: 'L4',
						},
						{
							name: 'L1',
						}
					],
					[
						{
							name: 'S',
							scatter: true,
						},
						{
							name: 'L4',
						},
						{
							name: 'L1',
						},
						{
							name: 'H2',
						},
						{
							name: 'H4',
						},
						{
							name: 'H4',
						},
						{
							name: 'W',
							wild: true,
						},
						{
							name: 'L2',
						},
						{
							name: 'H3',
						}
					],
					[
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
							name: 'H4',
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
							name: 'H4',
						}
					],
					[
						{
							name: 'H4',
						},
						{
							name: 'L1',
						},
						{
							name: 'S',
							scatter: true,
						},
						{
							name: 'L2',
						},
						{
							name: 'W',
							wild: true,
						},
						{
							name: 'L3',
						},
						{
							name: 'L3',
						},
						{
							name: 'H4',
						},
						{
							name: 'L1',
						}
					],
					[
						{
							name: 'L2',
						},
						{
							name: 'H2',
						},
						{
							name: 'L3',
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
						{
							name: 'L2',
						},
						{
							name: 'H1',
						},
						{
							name: 'L3',
						}
					],
					[
						{
							name: 'L1',
						},
						{
							name: 'L1',
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
							name: 'H2',
						},
						{
							name: 'L3',
						},
						{
							name: 'H2',
						},
						{
							name: 'L4',
						}
					],
					[
						{
							name: 'L3',
						},
						{
							name: 'L4',
						},
						{
							name: 'W',
							wild: true,
						},
						{
							name: 'H3',
						},
						{
							name: 'H3',
						},
						{
							name: 'L4',
						},
						{
							name: 'L3',
						},
						{
							name: 'L3',
						},
						{
							name: 'L4',
						}
					]
				],
				paddingPositions: [3, 276, 268, 121, 116, 164, 47],
				gameType: 'freegame',
				anticipation: [0, 0, 0, 0, 0, 0, 0]
			},
			{
				index: 24,
				type: 'updateFreeSpin',
				amount: 3,
				total: 5
			},
			{
				index: 25,
				type: 'reveal',
				board: [
					[
						{
							name: 'L1',
						},
						{
							name: 'H1',
						},
						{
							name: 'L3',
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
							name: 'S',
							scatter: true,
						},
						{
							name: 'H3',
						},
						{
							name: 'L1',
						}
					],
					[
						{
							name: 'L2',
						},
						{
							name: 'L2',
						},
						{
							name: 'L4',
						},
						{
							name: 'L1',
						},
						{
							name: 'H2',
						},
						{
							name: 'H4',
						},
						{
							name: 'H4',
						},
						{
							name: 'W',
							wild: true,
						},
						{
							name: 'L2',
						}
					],
					[
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
							name: 'H2',
						},
						{
							name: 'H4',
						},
						{
							name: 'L3',
						},
						{
							name: 'L2',
						},
						{
							name: 'L4',
						},
						{
							name: 'L2',
						}
					],
					[
						{
							name: 'L3',
						},
						{
							name: 'H1',
						},
						{
							name: 'H4',
						},
						{
							name: 'H4',
						},
						{
							name: 'L3',
						},
						{
							name: 'H4',
						},
						{
							name: 'H4',
						},
						{
							name: 'L2',
						},
						{
							name: 'L2',
						}
					],
					[
						{
							name: 'L1',
						},
						{
							name: 'L4',
						},
						{
							name: 'H4',
						},
						{
							name: 'W',
							wild: true,
						},
						{
							name: 'L1',
						},
						{
							name: 'H1',
						},
						{
							name: 'H1',
						},
						{
							name: 'H2',
						},
						{
							name: 'H3',
						}
					],
					[
						{
							name: 'L1',
						},
						{
							name: 'L2',
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
							name: 'L1',
						},
						{
							name: 'L1',
						},
						{
							name: 'H1',
						},
						{
							name: 'L4',
						}
					],
					[
						{
							name: 'L3',
						},
						{
							name: 'H1',
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
						{
							name: 'L4',
						},
						{
							name: 'H2',
						},
						{
							name: 'H2',
						},
						{
							name: 'L4',
						}
					]
				],
				paddingPositions: [77, 275, 8, 86, 211, 23, 135],
				gameType: 'freegame',
				anticipation: [0, 0, 0, 0, 0, 0, 0]
			},
			{
				index: 26,
				type: 'winInfo',
				totalWin: 100,
				wins: [
					{
						symbol: 'H4',
						clusterSize: 5,
						win: 100,
						positions: [
							{ reel: 3, row: 2 },
							{ reel: 4, row: 2 },
							{ reel: 3, row: 3 },
							{ reel: 4, row: 3 },
							{ reel: 5, row: 3 }
						],
						meta: {
							globalMult: 1,
							clusterMult: 2,
							winWithoutMult: 50,
							overlay: { reel: 3, row: 2 }
						}
					}
				]
			},
			{
				index: 27,
				type: 'glyphActivation',
				position: { reel: 4, row: 2 },
				activatedCount: 5,
				totalGlyphs: 13
			},
			{
				index: 28,
				type: 'updateGrid',
				gridMultipliers: [
					[2, 2, 4, 2, 1, 1, 1],
					[1, 2, 2, 2, 1, 1, 1],
					[1, 4, 4, 2, 1, 1, 1],
					[2, 4, 2, 1, 1, 1, 1],
					[1, 2, 2, 1, 1, 1, 1],
					[1, 1, 2, 1, 1, 1, 1],
					[1, 1, 1, 1, 1, 1, 1]
				]
			},
			{
				index: 29,
				type: 'updateTumbleWin',
				amount: 730
			},
			{
				index: 30,
				type: 'tumbleBoard',
				newSymbols: [
					[
					],
					[
					],
					[
					],
					[
						{ name: 'L4' },
						{ name: 'L3' }
					],
					[
						{ name: 'L3' },
						{ name: 'L2' }
					],
					[
						{ name: 'L2' }
					],
					[
					]
				],
				explodingSymbols: [
					{ reel: 3, row: 2 },
					{ reel: 3, row: 3 },
					{ reel: 4, row: 2 },
					{ reel: 4, row: 3 },
					{ reel: 5, row: 3 }
				]
			},
			{
				index: 31,
				type: 'setWin',
				amount: 730,
				winLevel: 2
			},
			{
				index: 32,
				type: 'setTotalWin',
				amount: 730
			},
			{
				index: 33,
				type: 'updateFreeSpin',
				amount: 4,
				total: 7
			},
			{
				index: 34,
				type: 'reveal',
				board: [
					[
						{
							name: 'H1',
						},
						{
							name: 'H4',
						},
						{
							name: 'H3',
						},
						{
							name: 'W',
							wild: true,
						},
						{
							name: 'L4',
						},
						{
							name: 'S',
							scatter: true,
						},
						{
							name: 'L1',
						},
						{
							name: 'H3',
						},
						{
							name: 'L3',
						}
					],
					[
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
							name: 'L3',
						},
						{
							name: 'L3',
						},
						{
							name: 'H4',
						},
						{
							name: 'H3',
						},
						{
							name: 'L2',
						},
						{
							name: 'L2',
						}
					],
					[
						{
							name: 'H3',
						},
						{
							name: 'H3',
						},
						{
							name: 'H3',
						},
						{
							name: 'H3',
						},
						{
							name: 'L4',
						},
						{
							name: 'H4',
						},
						{
							name: 'L1',
						},
						{
							name: 'H2',
						},
						{
							name: 'L3',
						}
					],
					[
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
							name: 'L1',
						},
						{
							name: 'H4',
						},
						{
							name: 'L2',
						},
						{
							name: 'H4',
						},
						{
							name: 'H4',
						},
						{
							name: 'L3',
						}
					],
					[
						{
							name: 'H1',
						},
						{
							name: 'L4',
						},
						{
							name: 'L1',
						},
						{
							name: 'H4',
						},
						{
							name: 'H4',
						},
						{
							name: 'L2',
						},
						{
							name: 'W',
							wild: true,
						},
						{
							name: 'H2',
						},
						{
							name: 'L2',
						}
					],
					[
						{
							name: 'H4',
						},
						{
							name: 'L2',
						},
						{
							name: 'L2',
						},
						{
							name: 'L4',
						},
						{
							name: 'L4',
						},
						{
							name: 'L4',
						},
						{
							name: 'L3',
						},
						{
							name: 'S',
							scatter: true,
						},
						{
							name: 'H1',
						}
					],
					[
						{
							name: 'L1',
						},
						{
							name: 'H4',
						},
						{
							name: 'H4',
						},
						{
							name: 'L4',
						},
						{
							name: 'W',
							wild: true,
						},
						{
							name: 'H3',
						},
						{
							name: 'H3',
						},
						{
							name: 'L4',
						},
						{
							name: 'L4',
						}
					]
				],
				paddingPositions: [162, 67, 1, 112, 110, 202, 45],
				gameType: 'freegame',
				anticipation: [0, 0, 0, 0, 0, 0, 0]
			},
			{
				index: 35,
				type: 'winInfo',
				totalWin: 20,
				wins: [
					{
						symbol: 'L4',
						clusterSize: 5,
						win: 20,
						positions: [
							{ reel: 5, row: 3 },
							{ reel: 6, row: 3 },
							{ reel: 5, row: 4 },
							{ reel: 6, row: 4 },
							{ reel: 5, row: 5 }
						],
						meta: {
							globalMult: 1,
							clusterMult: 2,
							winWithoutMult: 10,
							overlay: { reel: 5, row: 3 }
						}
					}
				]
			},
			{
				index: 36,
				type: 'updateGrid',
				gridMultipliers: [
					[2, 2, 4, 2, 1, 1, 1],
					[1, 2, 2, 2, 1, 1, 1],
					[1, 4, 4, 2, 1, 1, 1],
					[2, 4, 2, 1, 1, 1, 1],
					[1, 2, 2, 1, 1, 1, 1],
					[1, 1, 4, 2, 2, 1, 1],
					[1, 1, 2, 2, 1, 1, 1]
				]
			},
			{
				index: 37,
				type: 'updateTumbleWin',
				amount: 750
			},
			{
				index: 38,
				type: 'tumbleBoard',
				newSymbols: [
					[
					],
					[
					],
					[
					],
					[
					],
					[
					],
					[
						{ name: 'H3' },
						{ name: 'H2' },
						{ name: 'W' }
					],
					[
						{ name: 'L3' },
						{ name: 'H2' }
					]
				],
				explodingSymbols: [
					{ reel: 5, row: 3 },
					{ reel: 5, row: 4 },
					{ reel: 5, row: 5 },
					{ reel: 6, row: 3 },
					{ reel: 6, row: 4 }
				]
			},
			{
				index: 39,
				type: 'setWin',
				amount: 750,
				winLevel: 2
			},
			{
				index: 40,
				type: 'setTotalWin',
				amount: 750
			},
			{
				index: 41,
				type: 'winInfo',
				totalWin: 680,
				wins: [
					{
						symbol: 'L2',
						clusterSize: 5,
						win: 80,
						positions: [
							{ reel: 3, row: 5 },
							{ reel: 4, row: 5 },
							{ reel: 5, row: 5 },
							{ reel: 4, row: 6 },
							{ reel: 5, row: 4 }
						],
						meta: {
							globalMult: 1,
							clusterMult: 4,
							winWithoutMult: 20,
							overlay: { reel: 3, row: 5 }
						}
					},
					{
						symbol: 'H4',
						clusterSize: 6,
						win: 600,
						positions: [
							{ reel: 3, row: 4 },
							{ reel: 4, row: 4 },
							{ reel: 4, row: 3 },
							{ reel: 5, row: 3 },
							{ reel: 6, row: 3 },
							{ reel: 6, row: 4 }
						],
						meta: {
							globalMult: 1,
							clusterMult: 10,
							winWithoutMult: 60,
							overlay: { reel: 3, row: 4 }
						}
					}
				]
			},
			{
				index: 42,
				type: 'glyphActivation',
				position: { reel: 3, row: 4 },
				activatedCount: 6,
				totalGlyphs: 13
			},
			{
				index: 43,
				type: 'updateGrid',
				gridMultipliers: [
					[2, 2, 4, 2, 1, 1, 1],
					[1, 2, 2, 2, 1, 1, 1],
					[1, 4, 4, 2, 1, 1, 1],
					[2, 4, 2, 2, 2, 1, 1],
					[1, 2, 4, 2, 2, 2, 1],
					[1, 1, 8, 4, 4, 1, 1],
					[1, 1, 4, 4, 1, 1, 1]
				]
			},
			{
				index: 44,
				type: 'updateTumbleWin',
				amount: 1430
			},
			{
				index: 45,
				type: 'tumbleBoard',
				newSymbols: [
					[
					],
					[
					],
					[
					],
					[
						{ name: 'L4' },
						{ name: 'L1' }
					],
					[
						{ name: 'L1' },
						{ name: 'H2' },
						{ name: 'L2' },
						{ name: 'L4' }
					],
					[
						{ name: 'H2' },
						{ name: 'L1' },
						{ name: 'L3' }
					],
					[
						{ name: 'L4' },
						{ name: 'L4' }
					]
				],
				explodingSymbols: [
					{ reel: 3, row: 4 },
					{ reel: 3, row: 5 },
					{ reel: 4, row: 3 },
					{ reel: 4, row: 4 },
					{ reel: 4, row: 5 },
					{ reel: 4, row: 6 },
					{ reel: 5, row: 3 },
					{ reel: 5, row: 4 },
					{ reel: 5, row: 5 },
					{ reel: 6, row: 3 },
					{ reel: 6, row: 4 }
				]
			},
			{
				index: 46,
				type: 'setWin',
				amount: 1430,
				winLevel: 2
			},
			{
				index: 47,
				type: 'setTotalWin',
				amount: 1430
			},
			{
				index: 48,
				type: 'updateFreeSpin',
				amount: 5,
				total: 9
			},
			{
				index: 49,
				type: 'reveal',
				board: [
					[
						{
							name: 'L4',
						},
						{
							name: 'H4',
						},
						{
							name: 'W',
							wild: true,
						},
						{
							name: 'H4',
						},
						{
							name: 'H2',
						},
						{
							name: 'W',
							wild: true,
						},
						{
							name: 'H3',
						},
						{
							name: 'H2',
						},
						{
							name: 'H1',
						}
					],
					[
						{
							name: 'L1',
						},
						{
							name: 'H1',
						},
						{
							name: 'H4',
						},
						{
							name: 'W',
							wild: true,
						},
						{
							name: 'L1',
						},
						{
							name: 'H1',
						},
						{
							name: 'H1',
						},
						{
							name: 'H1',
						},
						{
							name: 'H4',
						}
					],
					[
						{
							name: 'H4',
						},
						{
							name: 'H3',
						},
						{
							name: 'W',
							wild: true,
						},
						{
							name: 'L2',
						},
						{
							name: 'L3',
						},
						{
							name: 'H3',
						},
						{
							name: 'H3',
						},
						{
							name: 'H3',
						},
						{
							name: 'L4',
						}
					],
					[
						{
							name: 'H4',
						},
						{
							name: 'W',
							wild: true,
						},
						{
							name: 'H4',
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
							name: 'H1',
						},
						{
							name: 'H1',
						},
						{
							name: 'L2',
						}
					],
					[
						{
							name: 'H3',
						},
						{
							name: 'L1',
						},
						{
							name: 'H2',
						},
						{
							name: 'H1',
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
							name: 'L2',
						}
					],
					[
						{
							name: 'L2',
						},
						{
							name: 'H2',
						},
						{
							name: 'H2',
						},
						{
							name: 'W',
							wild: true,
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
							name: 'H4',
						},
						{
							name: 'L3',
						}
					],
					[
						{
							name: 'L3',
						},
						{
							name: 'H2',
						},
						{
							name: 'H4',
						},
						{
							name: 'H4',
						},
						{
							name: 'L1',
						},
						{
							name: 'L1',
						},
						{
							name: 'L4',
						},
						{
							name: 'L4',
						},
						{
							name: 'L1',
						}
					]
				],
				paddingPositions: [191, 294, 44, 243, 229, 215, 31],
				gameType: 'freegame',
				anticipation: [0, 0, 0, 0, 0, 0, 0]
			},
			{
				index: 50,
				type: 'winInfo',
				totalWin: 3679,
				wins: [
					{
						symbol: 'H4',
						clusterSize: 9,
						win: 2879,
						positions: [
							{ reel: 0, row: 1 },
							{ reel: 0, row: 2 },
							{ reel: 1, row: 2 },
							{ reel: 0, row: 3 },
							{ reel: 2, row: 2 },
							{ reel: 1, row: 3 },
							{ reel: 3, row: 2 },
							{ reel: 3, row: 1 },
							{ reel: 3, row: 3 }
						],
						meta: {
							globalMult: 1,
							clusterMult: 24,
							winWithoutMult: 120,
							overlay: { reel: 0, row: 1 }
						}
					},
					{
						symbol: 'H2',
						clusterSize: 5,
						win: 800,
						positions: [
							{ reel: 4, row: 2 },
							{ reel: 5, row: 2 },
							{ reel: 5, row: 1 },
							{ reel: 5, row: 3 },
							{ reel: 6, row: 1 }
						],
						meta: {
							globalMult: 1,
							clusterMult: 10,
							winWithoutMult: 80,
							overlay: { reel: 4, row: 2 }
						}
					}
				]
			},
			{
				index: 51,
				type: 'glyphActivation',
				position: { reel: 5, row: 2 },
				activatedCount: 7,
				totalGlyphs: 13
			},
			{
				index: 52,
				type: 'glyphActivation',
				position: { reel: 6, row: 1 },
				activatedCount: 8,
				totalGlyphs: 13
			},
			{
				index: 53,
				type: 'updateGrid',
				gridMultipliers: [
					[4, 4, 8, 2, 1, 1, 1],
					[1, 4, 4, 2, 1, 1, 1],
					[1, 8, 4, 2, 1, 1, 1],
					[4, 8, 4, 2, 2, 1, 1],
					[1, 4, 4, 2, 2, 2, 1],
					[2, 2, 16, 4, 4, 1, 1],
					[2, 1, 4, 4, 1, 1, 1]
				]
			},
			{
				index: 54,
				type: 'updateTumbleWin',
				amount: 5109
			},
			{
				index: 55,
				type: 'tumbleBoard',
				newSymbols: [
					[
						{ name: 'L2' },
						{ name: 'L3' },
						{ name: 'L2' }
					],
					[
						{ name: 'L4' },
						{ name: 'L1' }
					],
					[
						{ name: 'L2' }
					],
					[
						{ name: 'W' },
						{ name: 'H3' },
						{ name: 'H4' }
					],
					[
						{ name: 'L1' }
					],
					[
						{ name: 'W' },
						{ name: 'H3' },
						{ name: 'H2' }
					],
					[
						{ name: 'H4' }
					]
				],
				explodingSymbols: [
					{ reel: 0, row: 1 },
					{ reel: 0, row: 2 },
					{ reel: 0, row: 3 },
					{ reel: 1, row: 2 },
					{ reel: 1, row: 3 },
					{ reel: 2, row: 2 },
					{ reel: 3, row: 1 },
					{ reel: 3, row: 2 },
					{ reel: 3, row: 3 },
					{ reel: 4, row: 2 },
					{ reel: 5, row: 1 },
					{ reel: 5, row: 2 },
					{ reel: 5, row: 3 },
					{ reel: 6, row: 1 }
				]
			},
			{
				index: 56,
				type: 'setWin',
				amount: 5109,
				winLevel: 3
			},
			{
				index: 57,
				type: 'setTotalWin',
				amount: 5109
			},
			{
				index: 58,
				type: 'updateFreeSpin',
				amount: 6,
				total: 11
			},
			{
				index: 59,
				type: 'reveal',
				board: [
					[
						{
							name: 'H1',
						},
						{
							name: 'L2',
						},
						{
							name: 'L2',
						},
						{
							name: 'L2',
						},
						{
							name: 'H1',
						},
						{
							name: 'L3',
						},
						{
							name: 'L3',
						},
						{
							name: 'L3',
						},
						{
							name: 'L3',
						}
					],
					[
						{
							name: 'L1',
						},
						{
							name: 'H1',
						},
						{
							name: 'H4',
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
							name: 'L1',
						},
						{
							name: 'W',
							wild: true,
						},
						{
							name: 'L2',
						}
					],
					[
						{
							name: 'L4',
						},
						{
							name: 'H1',
						},
						{
							name: 'H3',
						},
						{
							name: 'H3',
						},
						{
							name: 'H2',
						},
						{
							name: 'H1',
						},
						{
							name: 'H3',
						},
						{
							name: 'H3',
						},
						{
							name: 'L1',
						}
					],
					[
						{
							name: 'L2',
						},
						{
							name: 'H3',
						},
						{
							name: 'S',
							scatter: true,
						},
						{
							name: 'H3',
						},
						{
							name: 'H2',
						},
						{
							name: 'H2',
						},
						{
							name: 'H3',
						},
						{
							name: 'L3',
						},
						{
							name: 'H3',
						}
					],
					[
						{
							name: 'H1',
						},
						{
							name: 'L1',
						},
						{
							name: 'H2',
						},
						{
							name: 'H3',
						},
						{
							name: 'H4',
						},
						{
							name: 'H3',
						},
						{
							name: 'H3',
						},
						{
							name: 'H2',
						},
						{
							name: 'L4',
						}
					],
					[
						{
							name: 'H3',
						},
						{
							name: 'H4',
						},
						{
							name: 'H3',
						},
						{
							name: 'L1',
						},
						{
							name: 'H1',
						},
						{
							name: 'W',
							wild: true,
						},
						{
							name: 'L3',
						},
						{
							name: 'H2',
						},
						{
							name: 'L4',
						}
					],
					[
						{
							name: 'H1',
						},
						{
							name: 'L1',
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
							name: 'W',
							wild: true,
						},
						{
							name: 'H4',
						},
						{
							name: 'H4',
						},
						{
							name: 'L3',
						}
					]
				],
				paddingPositions: [219, 211, 208, 218, 194, 138, 262],
				gameType: 'freegame',
				anticipation: [0, 0, 0, 0, 0, 0, 0]
			},
			{
				index: 60,
				type: 'winInfo',
				totalWin: 800,
				wins: [
					{
						symbol: 'H3',
						clusterSize: 7,
						win: 800,
						positions: [
							{ reel: 2, row: 6 },
							{ reel: 3, row: 6 },
							{ reel: 2, row: 7 },
							{ reel: 4, row: 6 },
							{ reel: 4, row: 5 },
							{ reel: 5, row: 5 },
							{ reel: 6, row: 5 }
						],
						meta: {
							globalMult: 1,
							clusterMult: 8,
							winWithoutMult: 100,
							overlay: { reel: 2, row: 6 }
						}
					}
				]
			},
			{
				index: 61,
				type: 'updateGrid',
				gridMultipliers: [
					[4, 4, 8, 2, 1, 1, 1],
					[1, 4, 4, 2, 1, 1, 1],
					[1, 8, 4, 2, 1, 2, 2],
					[4, 8, 4, 2, 2, 2, 1],
					[1, 4, 4, 2, 4, 4, 1],
					[2, 2, 16, 4, 8, 1, 1],
					[2, 1, 4, 4, 2, 1, 1]
				]
			},
			{
				index: 62,
				type: 'updateTumbleWin',
				amount: 5909
			},
			{
				index: 63,
				type: 'tumbleBoard',
				newSymbols: [
					[
					],
					[
					],
					[
						{ name: 'L1' },
						{ name: 'H2' }
					],
					[
						{ name: 'L2' }
					],
					[
						{ name: 'L1' },
						{ name: 'L2' }
					],
					[
						{ name: 'H2' }
					],
					[
						{ name: 'L3' }
					]
				],
				explodingSymbols: [
					{ reel: 2, row: 6 },
					{ reel: 2, row: 7 },
					{ reel: 3, row: 6 },
					{ reel: 4, row: 5 },
					{ reel: 4, row: 6 },
					{ reel: 5, row: 5 },
					{ reel: 6, row: 5 }
				]
			},
			{
				index: 64,
				type: 'setWin',
				amount: 5909,
				winLevel: 3
			},
			{
				index: 65,
				type: 'setTotalWin',
				amount: 5909
			},
			{
				index: 66,
				type: 'updateFreeSpin',
				amount: 7,
				total: 13
			},
			{
				index: 67,
				type: 'reveal',
				board: [
					[
						{
							name: 'L2',
						},
						{
							name: 'L2',
						},
						{
							name: 'L2',
						},
						{
							name: 'L2',
						},
						{
							name: 'L2',
						},
						{
							name: 'H1',
						},
						{
							name: 'L3',
						},
						{
							name: 'L3',
						},
						{
							name: 'L1',
						}
					],
					[
						{
							name: 'L2',
						},
						{
							name: 'L1',
						},
						{
							name: 'H2',
						},
						{
							name: 'H4',
						},
						{
							name: 'H4',
						},
						{
							name: 'W',
							wild: true,
						},
						{
							name: 'L2',
						},
						{
							name: 'H2',
						},
						{
							name: 'L1',
						}
					],
					[
						{
							name: 'H3',
						},
						{
							name: 'L2',
						},
						{
							name: 'L4',
						},
						{
							name: 'W',
							wild: true,
						},
						{
							name: 'L3',
						},
						{
							name: 'L3',
						},
						{
							name: 'L4',
						},
						{
							name: 'L4',
						},
						{
							name: 'H4',
						}
					],
					[
						{
							name: 'L2',
						},
						{
							name: 'H3',
						},
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
							name: 'W',
							wild: true,
						},
						{
							name: 'L1',
						},
						{
							name: 'H2',
						},
						{
							name: 'L1',
						}
					],
					[
						{
							name: 'L1',
						},
						{
							name: 'W',
							wild: true,
						},
						{
							name: 'L1',
						},
						{
							name: 'H1',
						},
						{
							name: 'H1',
						},
						{
							name: 'H2',
						},
						{
							name: 'H4',
						},
						{
							name: 'H4',
						},
						{
							name: 'L3',
						}
					],
					[
						{
							name: 'L2',
						},
						{
							name: 'H4',
						},
						{
							name: 'L1',
						},
						{
							name: 'L1',
						},
						{
							name: 'L1',
						},
						{
							name: 'H1',
						},
						{
							name: 'L3',
						},
						{
							name: 'H1',
						},
						{
							name: 'H1',
						}
					],
					[
						{
							name: 'L4',
						},
						{
							name: 'H1',
						},
						{
							name: 'H1',
						},
						{
							name: 'L4',
						},
						{
							name: 'L2',
						},
						{
							name: 'L3',
						},
						{
							name: 'L3',
						},
						{
							name: 'H4',
						},
						{
							name: 'H3',
						}
					]
				],
				paddingPositions: [218, 277, 13, 54, 213, 25, 175],
				gameType: 'freegame',
				anticipation: [0, 0, 0, 0, 0, 0, 0]
			},
			{
				index: 68,
				type: 'winInfo',
				totalWin: 1019,
				wins: [
					{
						symbol: 'L1',
						clusterSize: 5,
						win: 1019,
						positions: [
							{ reel: 3, row: 2 },
							{ reel: 4, row: 2 },
							{ reel: 5, row: 2 },
							{ reel: 5, row: 3 },
							{ reel: 5, row: 4 }
						],
						meta: {
							globalMult: 1,
							clusterMult: 34,
							winWithoutMult: 30,
							overlay: { reel: 3, row: 2 }
						}
					}
				]
			},
			{
				index: 69,
				type: 'updateGrid',
				gridMultipliers: [
					[4, 4, 8, 2, 1, 1, 1],
					[1, 4, 4, 2, 1, 1, 1],
					[1, 8, 4, 2, 1, 2, 2],
					[4, 16, 4, 2, 2, 2, 1],
					[1, 8, 4, 2, 4, 4, 1],
					[2, 4, 32, 8, 8, 1, 1],
					[2, 1, 4, 4, 2, 1, 1]
				]
			},
			{
				index: 70,
				type: 'updateTumbleWin',
				amount: 6930
			},
			{
				index: 71,
				type: 'tumbleBoard',
				newSymbols: [
					[
					],
					[
					],
					[
					],
					[
						{ name: 'H4' }
					],
					[
						{ name: 'L1' }
					],
					[
						{ name: 'H2' },
						{ name: 'L2' },
						{ name: 'L1' }
					],
					[
					]
				],
				explodingSymbols: [
					{ reel: 3, row: 2 },
					{ reel: 4, row: 2 },
					{ reel: 5, row: 2 },
					{ reel: 5, row: 3 },
					{ reel: 5, row: 4 }
				]
			},
			{
				index: 72,
				type: 'setWin',
				amount: 6930,
				winLevel: 3
			},
			{
				index: 73,
				type: 'setTotalWin',
				amount: 6930
			},
			{
				index: 74,
				type: 'updateFreeSpin',
				amount: 8,
				total: 15
			},
			{
				index: 75,
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
							name: 'H1',
						},
						{
							name: 'L4',
						},
						{
							name: 'H2',
						},
						{
							name: 'H3',
						},
						{
							name: 'L2',
						},
						{
							name: 'L1',
						}
					],
					[
						{
							name: 'H3',
						},
						{
							name: 'L3',
						},
						{
							name: 'L1',
						},
						{
							name: 'H1',
						},
						{
							name: 'H3',
						},
						{
							name: 'H2',
						},
						{
							name: 'L4',
						},
						{
							name: 'L4',
						},
						{
							name: 'H3',
						}
					],
					[
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
							name: 'H2',
						},
						{
							name: 'H3',
						},
						{
							name: 'H3',
						},
						{
							name: 'H2',
						},
						{
							name: 'H1',
						},
						{
							name: 'L2',
						}
					],
					[
						{
							name: 'L4',
						},
						{
							name: 'L1',
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
							name: 'L2',
						},
						{
							name: 'L3',
						},
						{
							name: 'L3',
						},
						{
							name: 'H3',
						}
					],
					[
						{
							name: 'L1',
						},
						{
							name: 'L1',
						},
						{
							name: 'L1',
						},
						{
							name: 'H1',
						},
						{
							name: 'H1',
						},
						{
							name: 'H1',
						},
						{
							name: 'L1',
						},
						{
							name: 'L1',
						},
						{
							name: 'L1',
						}
					],
					[
						{
							name: 'L1',
						},
						{
							name: 'H2',
						},
						{
							name: 'L4',
						},
						{
							name: 'L1',
						},
						{
							name: 'L3',
						},
						{
							name: 'L3',
						},
						{
							name: 'H1',
						},
						{
							name: 'L1',
						},
						{
							name: 'L4',
						}
					],
					[
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
							name: 'L3',
						},
						{
							name: 'L3',
						},
						{
							name: 'L1',
						},
						{
							name: 'H4',
						},
						{
							name: 'H3',
						},
						{
							name: 'L1',
						}
					]
				],
				paddingPositions: [124, 51, 114, 184, 69, 0, 22],
				gameType: 'freegame',
				anticipation: [0, 0, 0, 0, 0, 0, 0]
			},
			{
				index: 76,
				type: 'freeSpinEnd',
				amount: 6930,
				winLevel: 5
			},
			{
				index: 77,
				type: 'setTotalWin',
				amount: 6930
			},
			{
				index: 78,
				type: 'finalWin',
				amount: 6930
			}
		],
		criteria: 'freegame',
		baseGameWins: 0,
		freeGameWins: 0.693
	},
	{
		id: 2,
		payoutMultiplier: 151.7,
		events: [
			{
				index: 0,
				type: 'reveal',
				board: [
					[
						{
							name: 'H1',
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
							name: 'L3',
						},
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
							name: 'L4',
						}
					],
					[
						{
							name: 'H3',
						},
						{
							name: 'L4',
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
							name: 'S',
							scatter: true,
						},
						{
							name: 'L2',
						},
						{
							name: 'H3',
						},
						{
							name: 'L2',
						}
					],
					[
						{
							name: 'L4',
						},
						{
							name: 'L2',
						},
						{
							name: 'H1',
						},
						{
							name: 'L3',
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
							name: 'L3',
						}
					],
					[
						{
							name: 'L2',
						},
						{
							name: 'L2',
						},
						{
							name: 'L2',
						},
						{
							name: 'S',
							scatter: true,
						},
						{
							name: 'L4',
						},
						{
							name: 'H4',
						},
						{
							name: 'H3',
						},
						{
							name: 'H1',
						},
						{
							name: 'L1',
						}
					],
					[
						{
							name: 'W',
							wild: true,
						},
						{
							name: 'L4',
						},
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
							name: 'L4',
						},
						{
							name: 'L2',
						},
						{
							name: 'L4',
						},
						{
							name: 'L1',
						}
					],
					[
						{
							name: 'L2',
						},
						{
							name: 'L4',
						},
						{
							name: 'L2',
						},
						{
							name: 'L3',
						},
						{
							name: 'L4',
						},
						{
							name: 'L3',
						},
						{
							name: 'L4',
						},
						{
							name: 'L3',
						},
						{
							name: 'L2',
						}
					],
					[
						{
							name: 'L4',
						},
						{
							name: 'L1',
						},
						{
							name: 'H1',
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
							name: 'S',
							scatter: true,
						},
						{
							name: 'H1',
						},
						{
							name: 'L3',
						}
					]
				],
				paddingPositions: [56, 271, 259, 54, 42, 7, 44],
				gameType: 'basegame',
				anticipation: [0, 0, 0, 0, 0, 0, 0]
			},
			{
				index: 1,
				type: 'updateGrid',
				gridMultipliers: [
					[1, 1, 1, 1, 1, 1, 1],
					[1, 1, 1, 1, 1, 1, 1],
					[1, 1, 1, 1, 1, 1, 1],
					[1, 1, 1, 1, 1, 1, 1],
					[1, 1, 1, 1, 1, 1, 1],
					[1, 1, 1, 1, 1, 1, 1],
					[1, 1, 1, 1, 1, 1, 1]
				]
			},
			{
				index: 2,
				type: 'freeSpinTrigger',
				totalFs: 8,
				positions: [
					{ reel: 1, row: 5 },
					{ reel: 3, row: 3 },
					{ reel: 6, row: 6 }
				]
			},
			{
				index: 3,
				type: 'glyphInit',
				glyphPositions: [
					{ reel: 0, row: 2 },
					{ reel: 0, row: 3 },
					{ reel: 0, row: 4 },
					{ reel: 1, row: 6 },
					{ reel: 1, row: 7 },
					{ reel: 2, row: 1 },
					{ reel: 2, row: 2 },
					{ reel: 2, row: 6 },
					{ reel: 3, row: 7 },
					{ reel: 4, row: 7 },
					{ reel: 5, row: 1 },
					{ reel: 6, row: 3 },
					{ reel: 6, row: 6 }
				],
				totalGlyphs: 13
			},
			{
				index: 4,
				type: 'updateFreeSpin',
				amount: 1,
				total: 1
			},
			{
				index: 5,
				type: 'reveal',
				board: [
					[
						{
							name: 'L1',
						},
						{
							name: 'W',
							wild: true,
						},
						{
							name: 'L2',
						},
						{
							name: 'H3',
						},
						{
							name: 'L4',
						},
						{
							name: 'L2',
						},
						{
							name: 'L4',
						},
						{
							name: 'L4',
						},
						{
							name: 'L1',
						}
					],
					[
						{
							name: 'L4',
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
							name: 'H1',
						},
						{
							name: 'W',
							wild: true,
						},
						{
							name: 'L3',
						},
						{
							name: 'L3',
						}
					],
					[
						{
							name: 'L2',
						},
						{
							name: 'H3',
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
							name: 'H4',
						},
						{
							name: 'H4',
						},
						{
							name: 'H4',
						},
						{
							name: 'L4',
						}
					],
					[
						{
							name: 'L1',
						},
						{
							name: 'L1',
						},
						{
							name: 'L1',
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
							name: 'L3',
						},
						{
							name: 'H2',
						},
						{
							name: 'H1',
						}
					],
					[
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
							name: 'H4',
						},
						{
							name: 'L2',
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
							name: 'L4',
						}
					],
					[
						{
							name: 'L3',
						},
						{
							name: 'L4',
						},
						{
							name: 'L3',
						},
						{
							name: 'S',
							scatter: true,
						},
						{
							name: 'H3',
						},
						{
							name: 'H3',
						},
						{
							name: 'S',
							scatter: true,
						},
						{
							name: 'L3',
						},
						{
							name: 'L3',
						}
					],
					[
						{
							name: 'H4',
						},
						{
							name: 'S',
							scatter: true,
						},
						{
							name: 'H4',
						},
						{
							name: 'H4',
						},
						{
							name: 'L2',
						},
						{
							name: 'L2',
						},
						{
							name: 'H1',
						},
						{
							name: 'H2',
						},
						{
							name: 'L4',
						}
					]
				],
				paddingPositions: [148, 74, 100, 294, 141, 206, 253],
				gameType: 'freegame',
				anticipation: [0, 0, 0, 0, 0, 0, 0]
			},
			{
				index: 6,
				type: 'winInfo',
				totalWin: 40,
				wins: [
					{
						symbol: 'L1',
						clusterSize: 6,
						win: 40,
						positions: [
							{ reel: 2, row: 2 },
							{ reel: 3, row: 2 },
							{ reel: 3, row: 1 },
							{ reel: 3, row: 3 },
							{ reel: 3, row: 4 },
							{ reel: 2, row: 4 }
						],
						meta: {
							globalMult: 1,
							clusterMult: 1,
							winWithoutMult: 40,
							overlay: { reel: 2, row: 2 }
						}
					}
				]
			},
			{
				index: 7,
				type: 'glyphActivation',
				position: { reel: 2, row: 2 },
				activatedCount: 1,
				totalGlyphs: 13
			},
			{
				index: 8,
				type: 'updateGrid',
				gridMultipliers: [
					[1, 1, 1, 1, 1, 1, 1],
					[1, 1, 1, 1, 1, 1, 1],
					[1, 2, 1, 2, 1, 1, 1],
					[2, 2, 2, 2, 1, 1, 1],
					[1, 1, 1, 1, 1, 1, 1],
					[1, 1, 1, 1, 1, 1, 1],
					[1, 1, 1, 1, 1, 1, 1]
				]
			},
			{
				index: 9,
				type: 'updateTumbleWin',
				amount: 40
			},
			{
				index: 10,
				type: 'tumbleBoard',
				newSymbols: [
					[
					],
					[
					],
					[
						{ name: 'H4' },
						{ name: 'L4' }
					],
					[
						{ name: 'L2' },
						{ name: 'L2' },
						{ name: 'L3' },
						{ name: 'H1' }
					],
					[
					],
					[
					],
					[
					]
				],
				explodingSymbols: [
					{ reel: 2, row: 2 },
					{ reel: 2, row: 4 },
					{ reel: 3, row: 1 },
					{ reel: 3, row: 2 },
					{ reel: 3, row: 3 },
					{ reel: 3, row: 4 }
				]
			},
			{
				index: 11,
				type: 'setWin',
				amount: 40,
				winLevel: 2
			},
			{
				index: 12,
				type: 'setTotalWin',
				amount: 40
			},
			{
				index: 13,
				type: 'freeSpinRetrigger',
				totalFs: 13,
				positions: [
					{ reel: 5, row: 3 },
					{ reel: 5, row: 6 },
					{ reel: 6, row: 1 }
				]
			},
			{
				index: 14,
				type: 'updateFreeSpin',
				amount: 2,
				total: 4294967294
			},
			{
				index: 15,
				type: 'reveal',
				board: [
					[
						{
							name: 'L1',
						},
						{
							name: 'H4',
						},
						{
							name: 'L2',
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
							name: 'L1',
						},
						{
							name: 'L1',
						}
					],
					[
						{
							name: 'H4',
						},
						{
							name: 'L2',
						},
						{
							name: 'H2',
						},
						{
							name: 'L3',
						},
						{
							name: 'L3',
						},
						{
							name: 'L1',
						},
						{
							name: 'H1',
						},
						{
							name: 'H1',
						},
						{
							name: 'L4',
						}
					],
					[
						{
							name: 'H1',
						},
						{
							name: 'L4',
						},
						{
							name: 'L4',
						},
						{
							name: 'L4',
						},
						{
							name: 'L3',
						},
						{
							name: 'H2',
						},
						{
							name: 'H3',
						},
						{
							name: 'H3',
						},
						{
							name: 'H1',
						}
					],
					[
						{
							name: 'L4',
						},
						{
							name: 'H3',
						},
						{
							name: 'H3',
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
							name: 'H4',
						},
						{
							name: 'L2',
						}
					],
					[
						{
							name: 'L4',
						},
						{
							name: 'H3',
						},
						{
							name: 'L3',
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
							name: 'L3',
						},
						{
							name: 'L3',
						},
						{
							name: 'L4',
						}
					],
					[
						{
							name: 'L4',
						},
						{
							name: 'L3',
						},
						{
							name: 'L2',
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
							name: 'L1',
						},
						{
							name: 'L1',
						},
						{
							name: 'L4',
						}
					],
					[
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
							name: 'H4',
						},
						{
							name: 'H3',
						},
						{
							name: 'L3',
						},
						{
							name: 'H2',
						},
						{
							name: 'H2',
						},
						{
							name: 'L4',
						}
					]
				],
				paddingPositions: [246, 173, 112, 255, 39, 22, 25],
				gameType: 'freegame',
				anticipation: [0, 0, 0, 0, 0, 0, 0]
			},
			{
				index: 16,
				type: 'updateFreeSpin',
				amount: 3,
				total: 0
			},
			{
				index: 17,
				type: 'reveal',
				board: [
					[
						{
							name: 'L4',
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
							name: 'H4',
						},
						{
							name: 'H3',
						},
						{
							name: 'L4',
						},
						{
							name: 'L2',
						},
						{
							name: 'L1',
						}
					],
					[
						{
							name: 'L2',
						},
						{
							name: 'L3',
						},
						{
							name: 'L3',
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
							name: 'L1',
						},
						{
							name: 'L3',
						}
					],
					[
						{
							name: 'H3',
						},
						{
							name: 'L2',
						},
						{
							name: 'L3',
						},
						{
							name: 'H3',
						},
						{
							name: 'H1',
						},
						{
							name: 'L2',
						},
						{
							name: 'H3',
						},
						{
							name: 'H3',
						},
						{
							name: 'L3',
						}
					],
					[
						{
							name: 'L1',
						},
						{
							name: 'H1',
						},
						{
							name: 'L3',
						},
						{
							name: 'H4',
						},
						{
							name: 'H4',
						},
						{
							name: 'H4',
						},
						{
							name: 'L2',
						},
						{
							name: 'H4',
						},
						{
							name: 'L3',
						}
					],
					[
						{
							name: 'L4',
						},
						{
							name: 'H1',
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
							name: 'L2',
						},
						{
							name: 'H3',
						},
						{
							name: 'L2',
						},
						{
							name: 'H3',
						}
					],
					[
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
							name: 'H1',
						},
						{
							name: 'L1',
						},
						{
							name: 'L2',
						},
						{
							name: 'H1',
						},
						{
							name: 'H2',
						},
						{
							name: 'L2',
						}
					],
					[
						{
							name: 'H3',
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
							name: 'H3',
						},
						{
							name: 'H3',
						},
						{
							name: 'H1',
						},
						{
							name: 'H2',
						},
						{
							name: 'L3',
						}
					]
				],
				paddingPositions: [287, 113, 273, 4, 267, 292, 231],
				gameType: 'freegame',
				anticipation: [0, 0, 0, 0, 0, 0, 0]
			},
			{
				index: 18,
				type: 'winInfo',
				totalWin: 80,
				wins: [
					{
						symbol: 'L3',
						clusterSize: 5,
						win: 80,
						positions: [
							{ reel: 1, row: 1 },
							{ reel: 1, row: 2 },
							{ reel: 2, row: 2 },
							{ reel: 1, row: 3 },
							{ reel: 3, row: 2 }
						],
						meta: {
							globalMult: 1,
							clusterMult: 4,
							winWithoutMult: 20,
							overlay: { reel: 1, row: 1 }
						}
					}
				]
			},
			{
				index: 19,
				type: 'updateGrid',
				gridMultipliers: [
					[1, 1, 1, 1, 1, 1, 1],
					[2, 2, 2, 1, 1, 1, 1],
					[1, 4, 1, 2, 1, 1, 1],
					[2, 4, 2, 2, 1, 1, 1],
					[1, 1, 1, 1, 1, 1, 1],
					[1, 1, 1, 1, 1, 1, 1],
					[1, 1, 1, 1, 1, 1, 1]
				]
			},
			{
				index: 20,
				type: 'updateTumbleWin',
				amount: 120
			},
			{
				index: 21,
				type: 'tumbleBoard',
				newSymbols: [
					[
					],
					[
						{ name: 'L2' },
						{ name: 'L3' },
						{ name: 'H4' }
					],
					[
						{ name: 'H2' }
					],
					[
						{ name: 'L3' }
					],
					[
					],
					[
					],
					[
					]
				],
				explodingSymbols: [
					{ reel: 1, row: 1 },
					{ reel: 1, row: 2 },
					{ reel: 1, row: 3 },
					{ reel: 2, row: 2 },
					{ reel: 3, row: 2 }
				]
			},
			{
				index: 22,
				type: 'setWin',
				amount: 120,
				winLevel: 2
			},
			{
				index: 23,
				type: 'setTotalWin',
				amount: 120
			},
			{
				index: 24,
				type: 'updateFreeSpin',
				amount: 4,
				total: 2
			},
			{
				index: 25,
				type: 'reveal',
				board: [
					[
						{
							name: 'L1',
						},
						{
							name: 'H1',
						},
						{
							name: 'L3',
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
							name: 'S',
							scatter: true,
						},
						{
							name: 'H3',
						},
						{
							name: 'L1',
						}
					],
					[
						{
							name: 'L2',
						},
						{
							name: 'L2',
						},
						{
							name: 'L4',
						},
						{
							name: 'L1',
						},
						{
							name: 'H2',
						},
						{
							name: 'H4',
						},
						{
							name: 'H4',
						},
						{
							name: 'W',
							wild: true,
						},
						{
							name: 'L2',
						}
					],
					[
						{
							name: 'L3',
						},
						{
							name: 'H2',
						},
						{
							name: 'L3',
						},
						{
							name: 'H4',
						},
						{
							name: 'H1',
						},
						{
							name: 'L3',
						},
						{
							name: 'L3',
						},
						{
							name: 'L2',
						},
						{
							name: 'L4',
						}
					],
					[
						{
							name: 'H3',
						},
						{
							name: 'W',
							wild: true,
						},
						{
							name: 'H1',
						},
						{
							name: 'H1',
						},
						{
							name: 'H4',
						},
						{
							name: 'H4',
						},
						{
							name: 'L3',
						},
						{
							name: 'H4',
						},
						{
							name: 'L2',
						}
					],
					[
						{
							name: 'H4',
						},
						{
							name: 'L1',
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
							name: 'L1',
						},
						{
							name: 'L1',
						},
						{
							name: 'L3',
						},
						{
							name: 'L4',
						}
					],
					[
						{
							name: 'L2',
						},
						{
							name: 'L4',
						},
						{
							name: 'L4',
						},
						{
							name: 'L2',
						},
						{
							name: 'L2',
						},
						{
							name: 'L2',
						},
						{
							name: 'L2',
						},
						{
							name: 'L4',
						},
						{
							name: 'L3',
						}
					],
					[
						{
							name: 'L3',
						},
						{
							name: 'H3',
						},
						{
							name: 'H3',
						},
						{
							name: 'H1',
						},
						{
							name: 'H2',
						},
						{
							name: 'H2',
						},
						{
							name: 'H3',
						},
						{
							name: 'L2',
						},
						{
							name: 'L4',
						}
					]
				],
				paddingPositions: [77, 275, 182, 84, 101, 198, 234],
				gameType: 'freegame',
				anticipation: [0, 0, 0, 0, 0, 0, 0]
			},
			{
				index: 26,
				type: 'updateFreeSpin',
				amount: 5,
				total: 4
			},
			{
				index: 27,
				type: 'reveal',
				board: [
					[
						{
							name: 'L4',
						},
						{
							name: 'L4',
						},
						{
							name: 'L4',
						},
						{
							name: 'H3',
						},
						{
							name: 'H4',
						},
						{
							name: 'H4',
						},
						{
							name: 'L2',
						},
						{
							name: 'H2',
						},
						{
							name: 'L3',
						}
					],
					[
						{
							name: 'L3',
						},
						{
							name: 'L3',
						},
						{
							name: 'L3',
						},
						{
							name: 'H2',
						},
						{
							name: 'L1',
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
							name: 'L4',
						}
					],
					[
						{
							name: 'L1',
						},
						{
							name: 'H3',
						},
						{
							name: 'L3',
						},
						{
							name: 'H1',
						},
						{
							name: 'L4',
						},
						{
							name: 'L3',
						},
						{
							name: 'L3',
						},
						{
							name: 'L2',
						},
						{
							name: 'L2',
						}
					],
					[
						{
							name: 'L2',
						},
						{
							name: 'L2',
						},
						{
							name: 'W',
							wild: true,
						},
						{
							name: 'L3',
						},
						{
							name: 'L3',
						},
						{
							name: 'H4',
						},
						{
							name: 'W',
							wild: true,
						},
						{
							name: 'H2',
						},
						{
							name: 'H3',
						}
					],
					[
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
							name: 'L1',
						},
						{
							name: 'L3',
						},
						{
							name: 'L2',
						},
						{
							name: 'H2',
						},
						{
							name: 'L4',
						},
						{
							name: 'L4',
						}
					],
					[
						{
							name: 'H4',
						},
						{
							name: 'H4',
						},
						{
							name: 'H2',
						},
						{
							name: 'L2',
						},
						{
							name: 'L3',
						},
						{
							name: 'L3',
						},
						{
							name: 'L4',
						},
						{
							name: 'L4',
						},
						{
							name: 'L1',
						}
					],
					[
						{
							name: 'L3',
						},
						{
							name: 'L1',
						},
						{
							name: 'W',
							wild: true,
						},
						{
							name: 'L2',
						},
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
							name: 'H3',
						},
						{
							name: 'L4',
						}
					]
				],
				paddingPositions: [98, 149, 216, 123, 49, 114, 214],
				gameType: 'freegame',
				anticipation: [0, 0, 0, 0, 0, 0, 0]
			},
			{
				index: 28,
				type: 'winInfo',
				totalWin: 960,
				wins: [
					{
						symbol: 'L3',
						clusterSize: 9,
						win: 960,
						positions: [
							{ reel: 1, row: 1 },
							{ reel: 1, row: 2 },
							{ reel: 2, row: 2 },
							{ reel: 3, row: 2 },
							{ reel: 3, row: 3 },
							{ reel: 3, row: 4 },
							{ reel: 4, row: 4 },
							{ reel: 5, row: 4 },
							{ reel: 5, row: 5 }
						],
						meta: {
							globalMult: 1,
							clusterMult: 16,
							winWithoutMult: 60,
							overlay: { reel: 1, row: 1 }
						}
					}
				]
			},
			{
				index: 29,
				type: 'updateGrid',
				gridMultipliers: [
					[1, 1, 1, 1, 1, 1, 1],
					[4, 4, 2, 1, 1, 1, 1],
					[1, 8, 1, 2, 1, 1, 1],
					[2, 8, 4, 4, 1, 1, 1],
					[1, 1, 1, 2, 1, 1, 1],
					[1, 1, 1, 2, 2, 1, 1],
					[1, 1, 1, 1, 1, 1, 1]
				]
			},
			{
				index: 30,
				type: 'updateTumbleWin',
				amount: 1080
			},
			{
				index: 31,
				type: 'tumbleBoard',
				newSymbols: [
					[
					],
					[
						{ name: 'H4' },
						{ name: 'L1' }
					],
					[
						{ name: 'H4' }
					],
					[
						{ name: 'L3' },
						{ name: 'L4' },
						{ name: 'H3' }
					],
					[
						{ name: 'L2' }
					],
					[
						{ name: 'L4' },
						{ name: 'H4' }
					],
					[
					]
				],
				explodingSymbols: [
					{ reel: 1, row: 1 },
					{ reel: 1, row: 2 },
					{ reel: 2, row: 2 },
					{ reel: 3, row: 2 },
					{ reel: 3, row: 3 },
					{ reel: 3, row: 4 },
					{ reel: 4, row: 4 },
					{ reel: 5, row: 4 },
					{ reel: 5, row: 5 }
				]
			},
			{
				index: 32,
				type: 'setWin',
				amount: 1080,
				winLevel: 2
			},
			{
				index: 33,
				type: 'setTotalWin',
				amount: 1080
			},
			{
				index: 34,
				type: 'updateFreeSpin',
				amount: 6,
				total: 6
			},
			{
				index: 35,
				type: 'reveal',
				board: [
					[
						{
							name: 'L3',
						},
						{
							name: 'H3',
						},
						{
							name: 'L1',
						},
						{
							name: 'H2',
						},
						{
							name: 'L1',
						},
						{
							name: 'L3',
						},
						{
							name: 'L3',
						},
						{
							name: 'L3',
						},
						{
							name: 'L3',
						}
					],
					[
						{
							name: 'H4',
						},
						{
							name: 'H3',
						},
						{
							name: 'L4',
						},
						{
							name: 'L4',
						},
						{
							name: 'H4',
						},
						{
							name: 'W',
							wild: true,
						},
						{
							name: 'L2',
						},
						{
							name: 'W',
							wild: true,
						},
						{
							name: 'L1',
						}
					],
					[
						{
							name: 'H1',
						},
						{
							name: 'H1',
						},
						{
							name: 'H1',
						},
						{
							name: 'H4',
						},
						{
							name: 'H4',
						},
						{
							name: 'H4',
						},
						{
							name: 'H4',
						},
						{
							name: 'W',
							wild: true,
						},
						{
							name: 'L1',
						}
					],
					[
						{
							name: 'H1',
						},
						{
							name: 'H2',
						},
						{
							name: 'H2',
						},
						{
							name: 'L2',
						},
						{
							name: 'L2',
						},
						{
							name: 'L1',
						},
						{
							name: 'L1',
						},
						{
							name: 'W',
							wild: true,
						},
						{
							name: 'W',
							wild: true,
						}
					],
					[
						{
							name: 'H1',
						},
						{
							name: 'H4',
						},
						{
							name: 'L2',
						},
						{
							name: 'L1',
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
							name: 'L3',
						},
						{
							name: 'L3',
						}
					],
					[
						{
							name: 'H4',
						},
						{
							name: 'W',
							wild: true,
						},
						{
							name: 'H4',
						},
						{
							name: 'H4',
						},
						{
							name: 'H2',
						},
						{
							name: 'H1',
						},
						{
							name: 'H1',
						},
						{
							name: 'L3',
						},
						{
							name: 'L2',
						}
					],
					[
						{
							name: 'H1',
						},
						{
							name: 'H4',
						},
						{
							name: 'H2',
						},
						{
							name: 'H2',
						},
						{
							name: 'L3',
						},
						{
							name: 'H3',
						},
						{
							name: 'H1',
						},
						{
							name: 'H1',
						},
						{
							name: 'L3',
						}
					]
				],
				paddingPositions: [168, 252, 120, 141, 173, 253, 169],
				gameType: 'freegame',
				anticipation: [0, 0, 0, 0, 0, 0, 0]
			},
			{
				index: 36,
				type: 'winInfo',
				totalWin: 270,
				wins: [
					{
						symbol: 'H4',
						clusterSize: 5,
						win: 100,
						positions: [
							{ reel: 1, row: 4 },
							{ reel: 2, row: 4 },
							{ reel: 2, row: 3 },
							{ reel: 2, row: 5 },
							{ reel: 2, row: 6 }
						],
						meta: {
							globalMult: 1,
							clusterMult: 2,
							winWithoutMult: 50,
							overlay: { reel: 1, row: 4 }
						}
					},
					{
						symbol: 'H4',
						clusterSize: 5,
						win: 50,
						positions: [
							{ reel: 4, row: 1 },
							{ reel: 5, row: 1 },
							{ reel: 6, row: 1 },
							{ reel: 5, row: 2 },
							{ reel: 5, row: 3 }
						],
						meta: {
							globalMult: 1,
							clusterMult: 1,
							winWithoutMult: 50,
							overlay: { reel: 4, row: 1 }
						}
					},
					{
						symbol: 'L1',
						clusterSize: 5,
						win: 60,
						positions: [
							{ reel: 3, row: 5 },
							{ reel: 4, row: 5 },
							{ reel: 3, row: 6 },
							{ reel: 4, row: 4 },
							{ reel: 4, row: 3 }
						],
						meta: {
							globalMult: 1,
							clusterMult: 2,
							winWithoutMult: 30,
							overlay: { reel: 3, row: 5 }
						}
					},
					{
						symbol: 'L3',
						clusterSize: 9,
						win: 60,
						positions: [
							{ reel: 0, row: 5 },
							{ reel: 1, row: 5 },
							{ reel: 0, row: 6 },
							{ reel: 0, row: 7 },
							{ reel: 1, row: 7 },
							{ reel: 2, row: 7 },
							{ reel: 3, row: 7 },
							{ reel: 4, row: 7 },
							{ reel: 5, row: 7 }
						],
						meta: {
							globalMult: 1,
							clusterMult: 1,
							winWithoutMult: 60,
							overlay: { reel: 0, row: 5 }
						}
					}
				]
			},
			{
				index: 37,
				type: 'glyphActivation',
				position: { reel: 1, row: 7 },
				activatedCount: 2,
				totalGlyphs: 13
			},
			{
				index: 38,
				type: 'glyphActivation',
				position: { reel: 2, row: 6 },
				activatedCount: 3,
				totalGlyphs: 13
			},
			{
				index: 39,
				type: 'glyphActivation',
				position: { reel: 3, row: 7 },
				activatedCount: 4,
				totalGlyphs: 13
			},
			{
				index: 40,
				type: 'glyphActivation',
				position: { reel: 4, row: 7 },
				activatedCount: 5,
				totalGlyphs: 13
			},
			{
				index: 41,
				type: 'glyphActivation',
				position: { reel: 5, row: 1 },
				activatedCount: 6,
				totalGlyphs: 13
			},
			{
				index: 42,
				type: 'updateGrid',
				gridMultipliers: [
					[1, 1, 1, 1, 2, 2, 2],
					[4, 4, 2, 2, 2, 1, 2],
					[1, 8, 2, 4, 2, 2, 2],
					[2, 8, 4, 4, 2, 2, 2],
					[2, 1, 2, 4, 2, 1, 2],
					[2, 2, 2, 2, 2, 1, 2],
					[2, 1, 1, 1, 1, 1, 1]
				]
			},
			{
				index: 43,
				type: 'updateTumbleWin',
				amount: 1350
			},
			{
				index: 44,
				type: 'tumbleBoard',
				newSymbols: [
					[
						{ name: 'L4' },
						{ name: 'L4' },
						{ name: 'H1' }
					],
					[
						{ name: 'L1' },
						{ name: 'L1' },
						{ name: 'H3' }
					],
					[
						{ name: 'L1' },
						{ name: 'L1' },
						{ name: 'H3' },
						{ name: 'L1' },
						{ name: 'L1' }
					],
					[
						{ name: 'L1' },
						{ name: 'L1' },
						{ name: 'L3' }
					],
					[
						{ name: 'L1' },
						{ name: 'L1' },
						{ name: 'H2' },
						{ name: 'L3' },
						{ name: 'L1' }
					],
					[
						{ name: 'H2' },
						{ name: 'H3' },
						{ name: 'H1' },
						{ name: 'H2' }
					],
					[
						{ name: 'H2' }
					]
				],
				explodingSymbols: [
					{ reel: 0, row: 5 },
					{ reel: 0, row: 6 },
					{ reel: 0, row: 7 },
					{ reel: 1, row: 4 },
					{ reel: 1, row: 5 },
					{ reel: 1, row: 7 },
					{ reel: 2, row: 3 },
					{ reel: 2, row: 4 },
					{ reel: 2, row: 5 },
					{ reel: 2, row: 6 },
					{ reel: 2, row: 7 },
					{ reel: 3, row: 5 },
					{ reel: 3, row: 6 },
					{ reel: 3, row: 7 },
					{ reel: 4, row: 1 },
					{ reel: 4, row: 3 },
					{ reel: 4, row: 4 },
					{ reel: 4, row: 5 },
					{ reel: 4, row: 7 },
					{ reel: 5, row: 1 },
					{ reel: 5, row: 2 },
					{ reel: 5, row: 3 },
					{ reel: 5, row: 7 },
					{ reel: 6, row: 1 }
				]
			},
			{
				index: 45,
				type: 'setWin',
				amount: 1350,
				winLevel: 2
			},
			{
				index: 46,
				type: 'setTotalWin',
				amount: 1350
			},
			{
				index: 47,
				type: 'winInfo',
				totalWin: 1680,
				wins: [
					{
						symbol: 'L1',
						clusterSize: 8,
						win: 1680,
						positions: [
							{ reel: 1, row: 1 },
							{ reel: 2, row: 1 },
							{ reel: 1, row: 2 },
							{ reel: 3, row: 1 },
							{ reel: 2, row: 2 },
							{ reel: 4, row: 1 },
							{ reel: 3, row: 2 },
							{ reel: 4, row: 2 }
						],
						meta: {
							globalMult: 1,
							clusterMult: 28,
							winWithoutMult: 60,
							overlay: { reel: 1, row: 1 }
						}
					}
				]
			},
			{
				index: 48,
				type: 'glyphActivation',
				position: { reel: 2, row: 1 },
				activatedCount: 7,
				totalGlyphs: 13
			},
			{
				index: 49,
				type: 'updateGrid',
				gridMultipliers: [
					[1, 1, 1, 1, 2, 2, 2],
					[8, 8, 2, 2, 2, 1, 2],
					[2, 16, 2, 4, 2, 2, 2],
					[4, 16, 4, 4, 2, 2, 2],
					[4, 2, 2, 4, 2, 1, 2],
					[2, 2, 2, 2, 2, 1, 2],
					[2, 1, 1, 1, 1, 1, 1]
				]
			},
			{
				index: 50,
				type: 'updateTumbleWin',
				amount: 3030
			},
			{
				index: 51,
				type: 'tumbleBoard',
				newSymbols: [
					[
					],
					[
						{ name: 'H3' },
						{ name: 'H3' }
					],
					[
						{ name: 'L2' },
						{ name: 'L2' }
					],
					[
						{ name: 'L4' },
						{ name: 'H3' }
					],
					[
						{ name: 'W' },
						{ name: 'L2' }
					],
					[
					],
					[
					]
				],
				explodingSymbols: [
					{ reel: 1, row: 1 },
					{ reel: 1, row: 2 },
					{ reel: 2, row: 1 },
					{ reel: 2, row: 2 },
					{ reel: 3, row: 1 },
					{ reel: 3, row: 2 },
					{ reel: 4, row: 1 },
					{ reel: 4, row: 2 }
				]
			},
			{
				index: 52,
				type: 'setWin',
				amount: 3030,
				winLevel: 2
			},
			{
				index: 53,
				type: 'setTotalWin',
				amount: 3030
			},
			{
				index: 54,
				type: 'winInfo',
				totalWin: 1760,
				wins: [
					{
						symbol: 'H3',
						clusterSize: 6,
						win: 1760,
						positions: [
							{ reel: 0, row: 4 },
							{ reel: 1, row: 4 },
							{ reel: 1, row: 3 },
							{ reel: 2, row: 3 },
							{ reel: 1, row: 2 },
							{ reel: 1, row: 1 }
						],
						meta: {
							globalMult: 1,
							clusterMult: 22,
							winWithoutMult: 80,
							overlay: { reel: 0, row: 4 }
						}
					}
				]
			},
			{
				index: 55,
				type: 'glyphActivation',
				position: { reel: 0, row: 4 },
				activatedCount: 8,
				totalGlyphs: 13
			},
			{
				index: 56,
				type: 'updateGrid',
				gridMultipliers: [
					[1, 1, 1, 2, 2, 2, 2],
					[16, 16, 4, 4, 2, 1, 2],
					[2, 16, 4, 4, 2, 2, 2],
					[4, 16, 4, 4, 2, 2, 2],
					[4, 2, 2, 4, 2, 1, 2],
					[2, 2, 2, 2, 2, 1, 2],
					[2, 1, 1, 1, 1, 1, 1]
				]
			},
			{
				index: 57,
				type: 'updateTumbleWin',
				amount: 4790
			},
			{
				index: 58,
				type: 'tumbleBoard',
				newSymbols: [
					[
						{ name: 'H4' }
					],
					[
						{ name: 'L1' },
						{ name: 'H3' },
						{ name: 'H2' },
						{ name: 'H2' }
					],
					[
						{ name: 'H3' }
					],
					[
					],
					[
					],
					[
					],
					[
					]
				],
				explodingSymbols: [
					{ reel: 0, row: 4 },
					{ reel: 1, row: 1 },
					{ reel: 1, row: 2 },
					{ reel: 1, row: 3 },
					{ reel: 1, row: 4 },
					{ reel: 2, row: 3 }
				]
			},
			{
				index: 59,
				type: 'setWin',
				amount: 4790,
				winLevel: 2
			},
			{
				index: 60,
				type: 'setTotalWin',
				amount: 4790
			},
			{
				index: 61,
				type: 'updateFreeSpin',
				amount: 7,
				total: 8
			},
			{
				index: 62,
				type: 'reveal',
				board: [
					[
						{
							name: 'L4',
						},
						{
							name: 'L2',
						},
						{
							name: 'H1',
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
							name: 'H2',
						},
						{
							name: 'H2',
						},
						{
							name: 'L3',
						}
					],
					[
						{
							name: 'H3',
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
							name: 'L1',
						},
						{
							name: 'L2',
						},
						{
							name: 'L4',
						},
						{
							name: 'L1',
						},
						{
							name: 'L2',
						}
					],
					[
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
							name: 'L3',
						},
						{
							name: 'L3',
						}
					],
					[
						{
							name: 'L4',
						},
						{
							name: 'L3',
						},
						{
							name: 'H4',
						},
						{
							name: 'W',
							wild: true,
						},
						{
							name: 'H2',
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
						}
					],
					[
						{
							name: 'H1',
						},
						{
							name: 'H1',
						},
						{
							name: 'L1',
						},
						{
							name: 'L1',
						},
						{
							name: 'H2',
						},
						{
							name: 'L2',
						},
						{
							name: 'L2',
						},
						{
							name: 'L4',
						},
						{
							name: 'L2',
						}
					],
					[
						{
							name: 'L3',
						},
						{
							name: 'L4',
						},
						{
							name: 'L2',
						},
						{
							name: 'L2',
						},
						{
							name: 'L2',
						},
						{
							name: 'L2',
						},
						{
							name: 'L4',
						},
						{
							name: 'L4',
						},
						{
							name: 'H4',
						}
					],
					[
						{
							name: 'L4',
						},
						{
							name: 'H3',
						},
						{
							name: 'H2',
						},
						{
							name: 'H2',
						},
						{
							name: 'H3',
						},
						{
							name: 'L2',
						},
						{
							name: 'L2',
						},
						{
							name: 'L2',
						},
						{
							name: 'L1',
						}
					]
				],
				paddingPositions: [87, 271, 62, 126, 73, 199, 288],
				gameType: 'freegame',
				anticipation: [0, 0, 0, 0, 0, 0, 0]
			},
			{
				index: 63,
				type: 'winInfo',
				totalWin: 960,
				wins: [
					{
						symbol: 'L2',
						clusterSize: 10,
						win: 960,
						positions: [
							{ reel: 3, row: 6 },
							{ reel: 4, row: 6 },
							{ reel: 4, row: 5 },
							{ reel: 5, row: 5 },
							{ reel: 6, row: 5 },
							{ reel: 5, row: 4 },
							{ reel: 6, row: 6 },
							{ reel: 5, row: 3 },
							{ reel: 6, row: 7 },
							{ reel: 5, row: 2 }
						],
						meta: {
							globalMult: 1,
							clusterMult: 12,
							winWithoutMult: 80,
							overlay: { reel: 3, row: 6 }
						}
					}
				]
			},
			{
				index: 64,
				type: 'glyphActivation',
				position: { reel: 6, row: 6 },
				activatedCount: 9,
				totalGlyphs: 13
			},
			{
				index: 65,
				type: 'updateGrid',
				gridMultipliers: [
					[1, 1, 1, 2, 2, 2, 2],
					[16, 16, 4, 4, 2, 1, 2],
					[2, 16, 4, 4, 2, 2, 2],
					[4, 16, 4, 4, 2, 4, 2],
					[4, 2, 2, 4, 4, 2, 2],
					[2, 4, 4, 4, 4, 1, 2],
					[2, 1, 1, 1, 2, 2, 2]
				]
			},
			{
				index: 66,
				type: 'updateTumbleWin',
				amount: 5750
			},
			{
				index: 67,
				type: 'tumbleBoard',
				newSymbols: [
					[
					],
					[
					],
					[
					],
					[
						{ name: 'H4' }
					],
					[
						{ name: 'H4' },
						{ name: 'L1' }
					],
					[
						{ name: 'H4' },
						{ name: 'L4' },
						{ name: 'L1' },
						{ name: 'L1' }
					],
					[
						{ name: 'H4' },
						{ name: 'L2' },
						{ name: 'L2' }
					]
				],
				explodingSymbols: [
					{ reel: 3, row: 6 },
					{ reel: 4, row: 5 },
					{ reel: 4, row: 6 },
					{ reel: 5, row: 2 },
					{ reel: 5, row: 3 },
					{ reel: 5, row: 4 },
					{ reel: 5, row: 5 },
					{ reel: 6, row: 5 },
					{ reel: 6, row: 6 },
					{ reel: 6, row: 7 }
				]
			},
			{
				index: 68,
				type: 'setWin',
				amount: 5750,
				winLevel: 3
			},
			{
				index: 69,
				type: 'setTotalWin',
				amount: 5750
			},
			{
				index: 70,
				type: 'winInfo',
				totalWin: 1800,
				wins: [
					{
						symbol: 'L1',
						clusterSize: 8,
						win: 1800,
						positions: [
							{ reel: 1, row: 4 },
							{ reel: 2, row: 4 },
							{ reel: 3, row: 4 },
							{ reel: 2, row: 5 },
							{ reel: 4, row: 4 },
							{ reel: 5, row: 4 },
							{ reel: 4, row: 5 },
							{ reel: 5, row: 3 }
						],
						meta: {
							globalMult: 1,
							clusterMult: 30,
							winWithoutMult: 60,
							overlay: { reel: 1, row: 4 }
						}
					}
				]
			},
			{
				index: 71,
				type: 'updateGrid',
				gridMultipliers: [
					[1, 1, 1, 2, 2, 2, 2],
					[16, 16, 4, 8, 2, 1, 2],
					[2, 16, 4, 8, 4, 2, 2],
					[4, 16, 4, 8, 2, 4, 2],
					[4, 2, 2, 8, 8, 2, 2],
					[2, 4, 8, 8, 4, 1, 2],
					[2, 1, 1, 1, 2, 2, 2]
				]
			},
			{
				index: 72,
				type: 'updateTumbleWin',
				amount: 7550
			},
			{
				index: 73,
				type: 'tumbleBoard',
				newSymbols: [
					[
					],
					[
						{ name: 'L4' }
					],
					[
						{ name: 'L4' },
						{ name: 'H4' }
					],
					[
						{ name: 'H3' }
					],
					[
						{ name: 'L2' },
						{ name: 'L2' }
					],
					[
						{ name: 'H4' },
						{ name: 'L1' }
					],
					[
					]
				],
				explodingSymbols: [
					{ reel: 1, row: 4 },
					{ reel: 2, row: 4 },
					{ reel: 2, row: 5 },
					{ reel: 3, row: 4 },
					{ reel: 4, row: 4 },
					{ reel: 4, row: 5 },
					{ reel: 5, row: 3 },
					{ reel: 5, row: 4 }
				]
			},
			{
				index: 74,
				type: 'setWin',
				amount: 7550,
				winLevel: 3
			},
			{
				index: 75,
				type: 'setTotalWin',
				amount: 7550
			},
			{
				index: 76,
				type: 'winInfo',
				totalWin: 160,
				wins: [
					{
						symbol: 'L4',
						clusterSize: 5,
						win: 160,
						positions: [
							{ reel: 4, row: 7 },
							{ reel: 5, row: 7 },
							{ reel: 5, row: 6 },
							{ reel: 5, row: 5 },
							{ reel: 5, row: 4 }
						],
						meta: {
							globalMult: 1,
							clusterMult: 16,
							winWithoutMult: 10,
							overlay: { reel: 4, row: 7 }
						}
					}
				]
			},
			{
				index: 77,
				type: 'updateGrid',
				gridMultipliers: [
					[1, 1, 1, 2, 2, 2, 2],
					[16, 16, 4, 8, 2, 1, 2],
					[2, 16, 4, 8, 4, 2, 2],
					[4, 16, 4, 8, 2, 4, 2],
					[4, 2, 2, 8, 8, 2, 4],
					[2, 4, 8, 16, 8, 2, 4],
					[2, 1, 1, 1, 2, 2, 2]
				]
			},
			{
				index: 78,
				type: 'updateTumbleWin',
				amount: 7709
			},
			{
				index: 79,
				type: 'tumbleBoard',
				newSymbols: [
					[
					],
					[
					],
					[
					],
					[
					],
					[
						{ name: 'L2' }
					],
					[
						{ name: 'L3' },
						{ name: 'L3' },
						{ name: 'H2' },
						{ name: 'L3' }
					],
					[
					]
				],
				explodingSymbols: [
					{ reel: 4, row: 7 },
					{ reel: 5, row: 4 },
					{ reel: 5, row: 5 },
					{ reel: 5, row: 6 },
					{ reel: 5, row: 7 }
				]
			},
			{
				index: 80,
				type: 'setWin',
				amount: 7709,
				winLevel: 3
			},
			{
				index: 81,
				type: 'setTotalWin',
				amount: 7709
			},
			{
				index: 82,
				type: 'updateFreeSpin',
				amount: 8,
				total: 10
			},
			{
				index: 83,
				type: 'reveal',
				board: [
					[
						{
							name: 'L3',
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
							name: 'L2',
						},
						{
							name: 'L4',
						},
						{
							name: 'L4',
						},
						{
							name: 'L1',
						},
						{
							name: 'L4',
						}
					],
					[
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
							name: 'L1',
						},
						{
							name: 'L3',
						},
						{
							name: 'H4',
						},
						{
							name: 'H3',
						},
						{
							name: 'L2',
						},
						{
							name: 'L4',
						}
					],
					[
						{
							name: 'H3',
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
							name: 'H3',
						},
						{
							name: 'H1',
						},
						{
							name: 'L2',
						},
						{
							name: 'H3',
						},
						{
							name: 'L3',
						}
					],
					[
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
							name: 'L1',
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
							name: 'L1',
						},
						{
							name: 'L2',
						}
					],
					[
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
							name: 'L3',
						},
						{
							name: 'H4',
						},
						{
							name: 'W',
							wild: true,
						},
						{
							name: 'H4',
						}
					],
					[
						{
							name: 'L1',
						},
						{
							name: 'H1',
						},
						{
							name: 'W',
							wild: true,
						},
						{
							name: 'L3',
						},
						{
							name: 'H2',
						},
						{
							name: 'L3',
						},
						{
							name: 'L3',
						},
						{
							name: 'L1',
						},
						{
							name: 'H1',
						}
					],
					[
						{
							name: 'L2',
						},
						{
							name: 'L4',
						},
						{
							name: 'H1',
						},
						{
							name: 'L4',
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
						{
							name: 'L3',
						}
					]
				],
				paddingPositions: [275, 231, 272, 20, 281, 141, 67],
				gameType: 'freegame',
				anticipation: [0, 0, 0, 0, 0, 0, 0]
			},
			{
				index: 84,
				type: 'winInfo',
				totalWin: 1620,
				wins: [
					{
						symbol: 'L2',
						clusterSize: 6,
						win: 1620,
						positions: [
							{ reel: 0, row: 2 },
							{ reel: 1, row: 2 },
							{ reel: 2, row: 2 },
							{ reel: 3, row: 2 },
							{ reel: 2, row: 1 },
							{ reel: 3, row: 1 }
						],
						meta: {
							globalMult: 1,
							clusterMult: 54,
							winWithoutMult: 30,
							overlay: { reel: 0, row: 2 }
						}
					}
				]
			},
			{
				index: 85,
				type: 'glyphActivation',
				position: { reel: 0, row: 2 },
				activatedCount: 10,
				totalGlyphs: 13
			},
			{
				index: 86,
				type: 'updateGrid',
				gridMultipliers: [
					[1, 2, 1, 2, 2, 2, 2],
					[16, 32, 4, 8, 2, 1, 2],
					[4, 32, 4, 8, 4, 2, 2],
					[8, 32, 4, 8, 2, 4, 2],
					[4, 2, 2, 8, 8, 2, 4],
					[2, 4, 8, 16, 8, 2, 4],
					[2, 1, 1, 1, 2, 2, 2]
				]
			},
			{
				index: 87,
				type: 'updateTumbleWin',
				amount: 9330
			},
			{
				index: 88,
				type: 'tumbleBoard',
				newSymbols: [
					[
						{ name: 'H3' }
					],
					[
						{ name: 'L2' }
					],
					[
						{ name: 'H4' },
						{ name: 'L3' }
					],
					[
						{ name: 'H4' },
						{ name: 'H4' }
					],
					[
					],
					[
					],
					[
					]
				],
				explodingSymbols: [
					{ reel: 0, row: 2 },
					{ reel: 1, row: 2 },
					{ reel: 2, row: 1 },
					{ reel: 2, row: 2 },
					{ reel: 3, row: 1 },
					{ reel: 3, row: 2 }
				]
			},
			{
				index: 89,
				type: 'setWin',
				amount: 9330,
				winLevel: 3
			},
			{
				index: 90,
				type: 'setTotalWin',
				amount: 9330
			},
			{
				index: 91,
				type: 'updateFreeSpin',
				amount: 9,
				total: 12
			},
			{
				index: 92,
				type: 'reveal',
				board: [
					[
						{
							name: 'L4',
						},
						{
							name: 'L2',
						},
						{
							name: 'H2',
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
						{
							name: 'H2',
						},
						{
							name: 'L4',
						}
					],
					[
						{
							name: 'L2',
						},
						{
							name: 'H3',
						},
						{
							name: 'L2',
						},
						{
							name: 'L2',
						},
						{
							name: 'L2',
						},
						{
							name: 'W',
							wild: true,
						},
						{
							name: 'L2',
						},
						{
							name: 'L4',
						},
						{
							name: 'L1',
						}
					],
					[
						{
							name: 'L2',
						},
						{
							name: 'H4',
						},
						{
							name: 'H1',
						},
						{
							name: 'H2',
						},
						{
							name: 'L1',
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
							name: 'H1',
						}
					],
					[
						{
							name: 'H1',
						},
						{
							name: 'H3',
						},
						{
							name: 'H3',
						},
						{
							name: 'H2',
						},
						{
							name: 'H2',
						},
						{
							name: 'L2',
						},
						{
							name: 'L2',
						},
						{
							name: 'L1',
						},
						{
							name: 'L4',
						}
					],
					[
						{
							name: 'L1',
						},
						{
							name: 'L4',
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
							name: 'L3',
						},
						{
							name: 'L1',
						},
						{
							name: 'L2',
						},
						{
							name: 'L2',
						}
					],
					[
						{
							name: 'L3',
						},
						{
							name: 'H1',
						},
						{
							name: 'H1',
						},
						{
							name: 'H4',
						},
						{
							name: 'H4',
						},
						{
							name: 'H3',
						},
						{
							name: 'L2',
						},
						{
							name: 'L2',
						},
						{
							name: 'L2',
						}
					],
					[
						{
							name: 'H3',
						},
						{
							name: 'L2',
						},
						{
							name: 'L3',
						},
						{
							name: 'L3',
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
						{
							name: 'L2',
						},
						{
							name: 'L2',
						}
					]
				],
				paddingPositions: [293, 236, 224, 139, 55, 56, 6],
				gameType: 'freegame',
				anticipation: [0, 0, 0, 0, 0, 0, 0]
			},
			{
				index: 93,
				type: 'updateFreeSpin',
				amount: 10,
				total: 14
			},
			{
				index: 94,
				type: 'reveal',
				board: [
					[
						{
							name: 'L4',
						},
						{
							name: 'L4',
						},
						{
							name: 'L4',
						},
						{
							name: 'H4',
						},
						{
							name: 'H1',
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
							name: 'L4',
						}
					],
					[
						{
							name: 'L4',
						},
						{
							name: 'L4',
						},
						{
							name: 'L2',
						},
						{
							name: 'H2',
						},
						{
							name: 'L2',
						},
						{
							name: 'H2',
						},
						{
							name: 'L2',
						},
						{
							name: 'H3',
						},
						{
							name: 'L2',
						}
					],
					[
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
							name: 'L2',
						},
						{
							name: 'L1',
						},
						{
							name: 'L4',
						},
						{
							name: 'L4',
						},
						{
							name: 'L4',
						},
						{
							name: 'L2',
						}
					],
					[
						{
							name: 'L2',
						},
						{
							name: 'H1',
						},
						{
							name: 'L3',
						},
						{
							name: 'L1',
						},
						{
							name: 'H1',
						},
						{
							name: 'L2',
						},
						{
							name: 'L4',
						},
						{
							name: 'L4',
						},
						{
							name: 'L4',
						}
					],
					[
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
							name: 'L1',
						},
						{
							name: 'H1',
						},
						{
							name: 'H3',
						},
						{
							name: 'H3',
						},
						{
							name: 'L3',
						},
						{
							name: 'L1',
						}
					],
					[
						{
							name: 'H1',
						},
						{
							name: 'H4',
						},
						{
							name: 'H3',
						},
						{
							name: 'L2',
						},
						{
							name: 'L2',
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
							name: 'H1',
						}
					],
					[
						{
							name: 'L3',
						},
						{
							name: 'H1',
						},
						{
							name: 'L4',
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
						{
							name: 'H2',
						},
						{
							name: 'H4',
						}
					]
				],
				paddingPositions: [8, 157, 80, 176, 132, 59, 68],
				gameType: 'freegame',
				anticipation: [0, 0, 0, 0, 0, 0, 0]
			},
			{
				index: 95,
				type: 'winInfo',
				totalWin: 140,
				wins: [
					{
						symbol: 'L4',
						clusterSize: 5,
						win: 140,
						positions: [
							{ reel: 2, row: 5 },
							{ reel: 2, row: 6 },
							{ reel: 3, row: 6 },
							{ reel: 2, row: 7 },
							{ reel: 3, row: 7 }
						],
						meta: {
							globalMult: 1,
							clusterMult: 14,
							winWithoutMult: 10,
							overlay: { reel: 2, row: 5 }
						}
					}
				]
			},
			{
				index: 96,
				type: 'updateGrid',
				gridMultipliers: [
					[1, 2, 1, 2, 2, 2, 2],
					[16, 32, 4, 8, 2, 1, 2],
					[4, 32, 4, 8, 8, 4, 4],
					[8, 32, 4, 8, 2, 8, 4],
					[4, 2, 2, 8, 8, 2, 4],
					[2, 4, 8, 16, 8, 2, 4],
					[2, 1, 1, 1, 2, 2, 2]
				]
			},
			{
				index: 97,
				type: 'updateTumbleWin',
				amount: 9470
			},
			{
				index: 98,
				type: 'tumbleBoard',
				newSymbols: [
					[
					],
					[
					],
					[
						{ name: 'L4' },
						{ name: 'L4' },
						{ name: 'L2' }
					],
					[
						{ name: 'L2' },
						{ name: 'L1' }
					],
					[
					],
					[
					],
					[
					]
				],
				explodingSymbols: [
					{ reel: 2, row: 5 },
					{ reel: 2, row: 6 },
					{ reel: 2, row: 7 },
					{ reel: 3, row: 6 },
					{ reel: 3, row: 7 }
				]
			},
			{
				index: 99,
				type: 'setWin',
				amount: 9470,
				winLevel: 3
			},
			{
				index: 100,
				type: 'setTotalWin',
				amount: 9470
			},
			{
				index: 101,
				type: 'winInfo',
				totalWin: 2340,
				wins: [
					{
						symbol: 'L4',
						clusterSize: 5,
						win: 540,
						positions: [
							{ reel: 0, row: 1 },
							{ reel: 1, row: 1 },
							{ reel: 0, row: 2 },
							{ reel: 2, row: 1 },
							{ reel: 2, row: 2 }
						],
						meta: {
							globalMult: 1,
							clusterMult: 54,
							winWithoutMult: 10,
							overlay: { reel: 0, row: 1 }
						}
					},
					{
						symbol: 'L2',
						clusterSize: 8,
						win: 1800,
						positions: [
							{ reel: 0, row: 5 },
							{ reel: 0, row: 6 },
							{ reel: 1, row: 6 },
							{ reel: 2, row: 6 },
							{ reel: 2, row: 5 },
							{ reel: 2, row: 4 },
							{ reel: 1, row: 4 },
							{ reel: 2, row: 3 }
						],
						meta: {
							globalMult: 1,
							clusterMult: 36,
							winWithoutMult: 50,
							overlay: { reel: 0, row: 5 }
						}
					}
				]
			},
			{
				index: 102,
				type: 'glyphActivation',
				position: { reel: 1, row: 6 },
				activatedCount: 11,
				totalGlyphs: 13
			},
			{
				index: 103,
				type: 'updateGrid',
				gridMultipliers: [
					[2, 4, 1, 2, 4, 4, 2],
					[32, 32, 4, 16, 2, 2, 2],
					[8, 64, 8, 16, 16, 8, 4],
					[8, 32, 4, 8, 2, 8, 4],
					[4, 2, 2, 8, 8, 2, 4],
					[2, 4, 8, 16, 8, 2, 4],
					[2, 1, 1, 1, 2, 2, 2]
				]
			},
			{
				index: 104,
				type: 'updateTumbleWin',
				amount: 11810
			},
			{
				index: 105,
				type: 'tumbleBoard',
				newSymbols: [
					[
						{ name: 'L2' },
						{ name: 'L3' },
						{ name: 'H4' },
						{ name: 'L2' }
					],
					[
						{ name: 'L3' },
						{ name: 'H4' },
						{ name: 'H1' }
					],
					[
						{ name: 'L3' },
						{ name: 'H4' },
						{ name: 'L3' },
						{ name: 'H4' },
						{ name: 'H2' },
						{ name: 'H3' }
					],
					[
					],
					[
					],
					[
					],
					[
					]
				],
				explodingSymbols: [
					{ reel: 0, row: 1 },
					{ reel: 0, row: 2 },
					{ reel: 0, row: 5 },
					{ reel: 0, row: 6 },
					{ reel: 1, row: 1 },
					{ reel: 1, row: 4 },
					{ reel: 1, row: 6 },
					{ reel: 2, row: 1 },
					{ reel: 2, row: 2 },
					{ reel: 2, row: 3 },
					{ reel: 2, row: 4 },
					{ reel: 2, row: 5 },
					{ reel: 2, row: 6 }
				]
			},
			{
				index: 106,
				type: 'setWin',
				amount: 11810,
				winLevel: 4
			},
			{
				index: 107,
				type: 'setTotalWin',
				amount: 11810
			},
			{
				index: 108,
				type: 'updateFreeSpin',
				amount: 11,
				total: 16
			},
			{
				index: 109,
				type: 'reveal',
				board: [
					[
						{
							name: 'L4',
						},
						{
							name: 'H1',
						},
						{
							name: 'H2',
						},
						{
							name: 'H4',
						},
						{
							name: 'W',
							wild: true,
						},
						{
							name: 'H4',
						},
						{
							name: 'H2',
						},
						{
							name: 'W',
							wild: true,
						},
						{
							name: 'L4',
						}
					],
					[
						{
							name: 'L1',
						},
						{
							name: 'L1',
						},
						{
							name: 'L1',
						},
						{
							name: 'L1',
						},
						{
							name: 'H3',
						},
						{
							name: 'L2',
						},
						{
							name: 'L2',
						},
						{
							name: 'L1',
						},
						{
							name: 'H4',
						}
					],
					[
						{
							name: 'H1',
						},
						{
							name: 'L4',
						},
						{
							name: 'L3',
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
							name: 'H4',
						},
						{
							name: 'H1',
						},
						{
							name: 'H1',
						}
					],
					[
						{
							name: 'L1',
						},
						{
							name: 'H2',
						},
						{
							name: 'W',
							wild: true,
						},
						{
							name: 'H2',
						},
						{
							name: 'L4',
						},
						{
							name: 'L2',
						},
						{
							name: 'L3',
						},
						{
							name: 'L3',
						},
						{
							name: 'L2',
						}
					],
					[
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
							name: 'H2',
						},
						{
							name: 'L4',
						},
						{
							name: 'L4',
						},
						{
							name: 'L1',
						},
						{
							name: 'H2',
						},
						{
							name: 'L2',
						}
					],
					[
						{
							name: 'L4',
						},
						{
							name: 'L2',
						},
						{
							name: 'H1',
						},
						{
							name: 'H2',
						},
						{
							name: 'L4',
						},
						{
							name: 'L1',
						},
						{
							name: 'L3',
						},
						{
							name: 'L3',
						},
						{
							name: 'L1',
						}
					],
					[
						{
							name: 'L3',
						},
						{
							name: 'L3',
						},
						{
							name: 'W',
							wild: true,
						},
						{
							name: 'L3',
						},
						{
							name: 'W',
							wild: true,
						},
						{
							name: 'L4',
						},
						{
							name: 'L4',
						},
						{
							name: 'L4',
						},
						{
							name: 'L2',
						}
					]
				],
				paddingPositions: [189, 218, 219, 104, 189, 296, 198],
				gameType: 'freegame',
				anticipation: [0, 0, 0, 0, 0, 0, 0]
			},
			{
				index: 110,
				type: 'winInfo',
				totalWin: 1840,
				wins: [
					{
						symbol: 'L4',
						clusterSize: 8,
						win: 1840,
						positions: [
							{ reel: 3, row: 4 },
							{ reel: 4, row: 4 },
							{ reel: 5, row: 4 },
							{ reel: 4, row: 5 },
							{ reel: 6, row: 4 },
							{ reel: 6, row: 5 },
							{ reel: 6, row: 6 },
							{ reel: 6, row: 7 }
						],
						meta: {
							globalMult: 1,
							clusterMult: 46,
							winWithoutMult: 40,
							overlay: { reel: 3, row: 4 }
						}
					}
				]
			},
			{
				index: 111,
				type: 'updateGrid',
				gridMultipliers: [
					[2, 4, 1, 2, 4, 4, 2],
					[32, 32, 4, 16, 2, 2, 2],
					[8, 64, 8, 16, 16, 8, 4],
					[8, 32, 4, 16, 2, 8, 4],
					[4, 2, 2, 16, 16, 2, 4],
					[2, 4, 8, 32, 8, 2, 4],
					[2, 1, 1, 2, 4, 4, 4]
				]
			},
			{
				index: 112,
				type: 'updateTumbleWin',
				amount: 13650
			},
			{
				index: 113,
				type: 'tumbleBoard',
				newSymbols: [
					[
					],
					[
					],
					[
					],
					[
						{ name: 'L2' }
					],
					[
						{ name: 'H1' },
						{ name: 'H1' }
					],
					[
						{ name: 'L4' }
					],
					[
						{ name: 'H1' },
						{ name: 'H2' },
						{ name: 'H4' },
						{ name: 'L3' }
					]
				],
				explodingSymbols: [
					{ reel: 3, row: 4 },
					{ reel: 4, row: 4 },
					{ reel: 4, row: 5 },
					{ reel: 5, row: 4 },
					{ reel: 6, row: 4 },
					{ reel: 6, row: 5 },
					{ reel: 6, row: 6 },
					{ reel: 6, row: 7 }
				]
			},
			{
				index: 114,
				type: 'setWin',
				amount: 13650,
				winLevel: 4
			},
			{
				index: 115,
				type: 'setTotalWin',
				amount: 13650
			},
			{
				index: 116,
				type: 'winInfo',
				totalWin: 600,
				wins: [
					{
						symbol: 'L3',
						clusterSize: 6,
						win: 600,
						positions: [
							{ reel: 5, row: 6 },
							{ reel: 6, row: 6 },
							{ reel: 5, row: 7 },
							{ reel: 6, row: 5 },
							{ reel: 6, row: 7 },
							{ reel: 6, row: 4 }
						],
						meta: {
							globalMult: 1,
							clusterMult: 20,
							winWithoutMult: 30,
							overlay: { reel: 5, row: 6 }
						}
					}
				]
			},
			{
				index: 117,
				type: 'updateGrid',
				gridMultipliers: [
					[2, 4, 1, 2, 4, 4, 2],
					[32, 32, 4, 16, 2, 2, 2],
					[8, 64, 8, 16, 16, 8, 4],
					[8, 32, 4, 16, 2, 8, 4],
					[4, 2, 2, 16, 16, 2, 4],
					[2, 4, 8, 32, 8, 4, 8],
					[2, 1, 1, 4, 8, 8, 8]
				]
			},
			{
				index: 118,
				type: 'updateTumbleWin',
				amount: 14250
			},
			{
				index: 119,
				type: 'tumbleBoard',
				newSymbols: [
					[
					],
					[
					],
					[
					],
					[
					],
					[
					],
					[
						{ name: 'L4' },
						{ name: 'L1' }
					],
					[
						{ name: 'H4' },
						{ name: 'L2' },
						{ name: 'H3' },
						{ name: 'L3' }
					]
				],
				explodingSymbols: [
					{ reel: 5, row: 6 },
					{ reel: 5, row: 7 },
					{ reel: 6, row: 4 },
					{ reel: 6, row: 5 },
					{ reel: 6, row: 6 },
					{ reel: 6, row: 7 }
				]
			},
			{
				index: 120,
				type: 'setWin',
				amount: 14250,
				winLevel: 4
			},
			{
				index: 121,
				type: 'setTotalWin',
				amount: 14250
			},
			{
				index: 122,
				type: 'updateFreeSpin',
				amount: 12,
				total: 18
			},
			{
				index: 123,
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
							name: 'L1',
						},
						{
							name: 'L1',
						},
						{
							name: 'L3',
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
							name: 'L4',
						}
					],
					[
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
							name: 'L1',
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
							name: 'H1',
						},
						{
							name: 'L3',
						}
					],
					[
						{
							name: 'H3',
						},
						{
							name: 'L4',
						},
						{
							name: 'H1',
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
							name: 'H4',
						},
						{
							name: 'L2',
						},
						{
							name: 'L1',
						}
					],
					[
						{
							name: 'H4',
						},
						{
							name: 'H2',
						},
						{
							name: 'H3',
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
						{
							name: 'L2',
						},
						{
							name: 'H4',
						},
						{
							name: 'H3',
						}
					],
					[
						{
							name: 'H1',
						},
						{
							name: 'L4',
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
							name: 'L2',
						},
						{
							name: 'L2',
						},
						{
							name: 'H3',
						}
					],
					[
						{
							name: 'H3',
						},
						{
							name: 'L1',
						},
						{
							name: 'L3',
						},
						{
							name: 'L3',
						},
						{
							name: 'H1',
						},
						{
							name: 'L1',
						},
						{
							name: 'H3',
						},
						{
							name: 'L4',
						},
						{
							name: 'L3',
						}
					],
					[
						{
							name: 'L2',
						},
						{
							name: 'L3',
						},
						{
							name: 'L3',
						},
						{
							name: 'L3',
						},
						{
							name: 'L4',
						},
						{
							name: 'L4',
						},
						{
							name: 'L4',
						},
						{
							name: 'L2',
						},
						{
							name: 'S',
							scatter: true,
						}
					]
				],
				paddingPositions: [201, 115, 266, 222, 238, 2, 92],
				gameType: 'freegame',
				anticipation: [0, 0, 0, 0, 0, 0, 0]
			},
			{
				index: 124,
				type: 'winInfo',
				totalWin: 920,
				wins: [
					{
						symbol: 'L3',
						clusterSize: 5,
						win: 280,
						positions: [
							{ reel: 5, row: 2 },
							{ reel: 6, row: 2 },
							{ reel: 5, row: 3 },
							{ reel: 6, row: 1 },
							{ reel: 6, row: 3 }
						],
						meta: {
							globalMult: 1,
							clusterMult: 14,
							winWithoutMult: 20,
							overlay: { reel: 5, row: 2 }
						}
					},
					{
						symbol: 'L2',
						clusterSize: 5,
						win: 640,
						positions: [
							{ reel: 2, row: 5 },
							{ reel: 3, row: 5 },
							{ reel: 3, row: 6 },
							{ reel: 4, row: 6 },
							{ reel: 4, row: 7 }
						],
						meta: {
							globalMult: 1,
							clusterMult: 32,
							winWithoutMult: 20,
							overlay: { reel: 2, row: 5 }
						}
					}
				]
			},
			{
				index: 125,
				type: 'glyphActivation',
				position: { reel: 6, row: 3 },
				activatedCount: 12,
				totalGlyphs: 13
			},
			{
				index: 126,
				type: 'updateGrid',
				gridMultipliers: [
					[2, 4, 1, 2, 4, 4, 2],
					[32, 32, 4, 16, 2, 2, 2],
					[8, 64, 8, 16, 32, 8, 4],
					[8, 32, 4, 16, 4, 16, 4],
					[4, 2, 2, 16, 16, 4, 8],
					[2, 8, 16, 32, 8, 4, 8],
					[4, 2, 2, 4, 8, 8, 8]
				]
			},
			{
				index: 127,
				type: 'updateTumbleWin',
				amount: 15169
			},
			{
				index: 128,
				type: 'tumbleBoard',
				newSymbols: [
					[
					],
					[
					],
					[
						{ name: 'L4' }
					],
					[
						{ name: 'L2' },
						{ name: 'H3' }
					],
					[
						{ name: 'W' },
						{ name: 'L2' }
					],
					[
						{ name: 'L1' },
						{ name: 'H3' }
					],
					[
						{ name: 'W' },
						{ name: 'L3' },
						{ name: 'H2' }
					]
				],
				explodingSymbols: [
					{ reel: 2, row: 5 },
					{ reel: 3, row: 5 },
					{ reel: 3, row: 6 },
					{ reel: 4, row: 6 },
					{ reel: 4, row: 7 },
					{ reel: 5, row: 2 },
					{ reel: 5, row: 3 },
					{ reel: 6, row: 1 },
					{ reel: 6, row: 2 },
					{ reel: 6, row: 3 }
				]
			},
			{
				index: 129,
				type: 'setWin',
				amount: 15169,
				winLevel: 4
			},
			{
				index: 130,
				type: 'setTotalWin',
				amount: 15169
			},
			{
				index: 131,
				type: 'updateFreeSpin',
				amount: 13,
				total: 20
			},
			{
				index: 132,
				type: 'reveal',
				board: [
					[
						{
							name: 'H3',
						},
						{
							name: 'L4',
						},
						{
							name: 'L4',
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
						{
							name: 'L2',
						},
						{
							name: 'L1',
						},
						{
							name: 'L3',
						}
					],
					[
						{
							name: 'L4',
						},
						{
							name: 'L4',
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
							name: 'H1',
						},
						{
							name: 'H3',
						},
						{
							name: 'H2',
						},
						{
							name: 'L2',
						}
					],
					[
						{
							name: 'L4',
						},
						{
							name: 'L1',
						},
						{
							name: 'H4',
						},
						{
							name: 'S',
							scatter: true,
						},
						{
							name: 'H4',
						},
						{
							name: 'H4',
						},
						{
							name: 'H4',
						},
						{
							name: 'H2',
						},
						{
							name: 'L2',
						}
					],
					[
						{
							name: 'H1',
						},
						{
							name: 'H4',
						},
						{
							name: 'L4',
						},
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
							name: 'H4',
						},
						{
							name: 'L2',
						},
						{
							name: 'L3',
						}
					],
					[
						{
							name: 'L2',
						},
						{
							name: 'H4',
						},
						{
							name: 'W',
							wild: true,
						},
						{
							name: 'L1',
						},
						{
							name: 'H1',
						},
						{
							name: 'H1',
						},
						{
							name: 'H2',
						},
						{
							name: 'H4',
						},
						{
							name: 'H4',
						}
					],
					[
						{
							name: 'L2',
						},
						{
							name: 'H2',
						},
						{
							name: 'L2',
						},
						{
							name: 'L1',
						},
						{
							name: 'L3',
						},
						{
							name: 'H2',
						},
						{
							name: 'L3',
						},
						{
							name: 'H3',
						},
						{
							name: 'L2',
						}
					],
					[
						{
							name: 'L2',
						},
						{
							name: 'H4',
						},
						{
							name: 'L2',
						},
						{
							name: 'L3',
						},
						{
							name: 'L3',
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
						{
							name: 'H4',
						}
					]
				],
				paddingPositions: [182, 49, 252, 282, 212, 190, 5],
				gameType: 'freegame',
				anticipation: [0, 0, 0, 0, 0, 0, 0]
			},
			{
				index: 133,
				type: 'freeSpinEnd',
				amount: 15169,
				winLevel: 6
			},
			{
				index: 134,
				type: 'setTotalWin',
				amount: 15169
			},
			{
				index: 135,
				type: 'finalWin',
				amount: 15169
			}
		],
		criteria: 'freegame',
		baseGameWins: 0,
		freeGameWins: 1.517
	},
	{
		id: 3,
		payoutMultiplier: 139.7,
		events: [
			{
				index: 0,
				type: 'reveal',
				board: [
					[
						{
							name: 'L1',
						},
						{
							name: 'L1',
						},
						{
							name: 'L4',
						},
						{
							name: 'L4',
						},
						{
							name: 'L3',
						},
						{
							name: 'H1',
						},
						{
							name: 'H1',
						},
						{
							name: 'H1',
						},
						{
							name: 'L3',
						}
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
							name: 'L3',
						},
						{
							name: 'L1',
						},
						{
							name: 'L4',
						},
						{
							name: 'S',
							scatter: true,
						},
						{
							name: 'L1',
						},
						{
							name: 'L4',
						}
					],
					[
						{
							name: 'H4',
						},
						{
							name: 'H4',
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
							name: 'H4',
						},
						{
							name: 'H1',
						},
						{
							name: 'L4',
						},
						{
							name: 'L2',
						}
					],
					[
						{
							name: 'H4',
						},
						{
							name: 'H1',
						},
						{
							name: 'H3',
						},
						{
							name: 'S',
							scatter: true,
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
							name: 'H4',
						},
						{
							name: 'L1',
						}
					],
					[
						{
							name: 'L4',
						},
						{
							name: 'L1',
						},
						{
							name: 'L4',
						},
						{
							name: 'L4',
						},
						{
							name: 'H1',
						},
						{
							name: 'L2',
						},
						{
							name: 'L1',
						},
						{
							name: 'H3',
						},
						{
							name: 'L4',
						}
					],
					[
						{
							name: 'L3',
						},
						{
							name: 'H1',
						},
						{
							name: 'L4',
						},
						{
							name: 'L1',
						},
						{
							name: 'H1',
						},
						{
							name: 'L2',
						},
						{
							name: 'H3',
						},
						{
							name: 'L4',
						},
						{
							name: 'H4',
						}
					],
					[
						{
							name: 'L3',
						},
						{
							name: 'S',
							scatter: true,
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
							name: 'H3',
						},
						{
							name: 'L2',
						},
						{
							name: 'H3',
						},
						{
							name: 'H4',
						}
					]
				],
				paddingPositions: [22, 90, 114, 281, 49, 229, 89],
				gameType: 'basegame',
				anticipation: [0, 0, 0, 0, 0, 0, 0]
			},
			{
				index: 1,
				type: 'updateGrid',
				gridMultipliers: [
					[1, 1, 1, 1, 1, 1, 1],
					[1, 1, 1, 1, 1, 1, 1],
					[1, 1, 1, 1, 1, 1, 1],
					[1, 1, 1, 1, 1, 1, 1],
					[1, 1, 1, 1, 1, 1, 1],
					[1, 1, 1, 1, 1, 1, 1],
					[1, 1, 1, 1, 1, 1, 1]
				]
			},
			{
				index: 2,
				type: 'freeSpinTrigger',
				totalFs: 8,
				positions: [
					{ reel: 1, row: 6 },
					{ reel: 3, row: 3 },
					{ reel: 6, row: 1 }
				]
			},
			{
				index: 3,
				type: 'glyphInit',
				glyphPositions: [
					{ reel: 0, row: 1 },
					{ reel: 0, row: 3 },
					{ reel: 0, row: 7 },
					{ reel: 1, row: 1 },
					{ reel: 1, row: 6 },
					{ reel: 2, row: 7 },
					{ reel: 5, row: 1 },
					{ reel: 5, row: 5 },
					{ reel: 5, row: 7 },
					{ reel: 6, row: 2 },
					{ reel: 6, row: 4 },
					{ reel: 6, row: 5 },
					{ reel: 6, row: 6 }
				],
				totalGlyphs: 13
			},
			{
				index: 4,
				type: 'updateFreeSpin',
				amount: 1,
				total: 1
			},
			{
				index: 5,
				type: 'reveal',
				board: [
					[
						{
							name: 'L1',
						},
						{
							name: 'L4',
						},
						{
							name: 'L4',
						},
						{
							name: 'L4',
						},
						{
							name: 'H4',
						},
						{
							name: 'H1',
						},
						{
							name: 'L2',
						},
						{
							name: 'L2',
						},
						{
							name: 'L3',
						}
					],
					[
						{
							name: 'H3',
						},
						{
							name: 'H4',
						},
						{
							name: 'H4',
						},
						{
							name: 'L2',
						},
						{
							name: 'L3',
						},
						{
							name: 'L3',
						},
						{
							name: 'W',
							wild: true,
						},
						{
							name: 'L1',
						},
						{
							name: 'L4',
						}
					],
					[
						{
							name: 'L2',
						},
						{
							name: 'H4',
						},
						{
							name: 'H1',
						},
						{
							name: 'H2',
						},
						{
							name: 'L1',
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
							name: 'H1',
						}
					],
					[
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
							name: 'W',
							wild: true,
						},
						{
							name: 'L1',
						},
						{
							name: 'H2',
						},
						{
							name: 'L4',
						},
						{
							name: 'L4',
						},
						{
							name: 'L3',
						}
					],
					[
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
							name: 'L1',
						},
						{
							name: 'L3',
						},
						{
							name: 'L4',
						},
						{
							name: 'H2',
						},
						{
							name: 'L4',
						},
						{
							name: 'H1',
						}
					],
					[
						{
							name: 'L1',
						},
						{
							name: 'L1',
						},
						{
							name: 'L1',
						},
						{
							name: 'H1',
						},
						{
							name: 'L3',
						},
						{
							name: 'H1',
						},
						{
							name: 'L2',
						},
						{
							name: 'L4',
						},
						{
							name: 'L4',
						}
					],
					[
						{
							name: 'H3',
						},
						{
							name: 'L4',
						},
						{
							name: 'L4',
						},
						{
							name: 'L2',
						},
						{
							name: 'L3',
						},
						{
							name: 'L3',
						},
						{
							name: 'H4',
						},
						{
							name: 'H4',
						},
						{
							name: 'L4',
						}
					]
				],
				paddingPositions: [7, 27, 224, 56, 104, 27, 96],
				gameType: 'freegame',
				anticipation: [0, 0, 0, 0, 0, 0, 0]
			},
			{
				index: 6,
				type: 'winInfo',
				totalWin: 40,
				wins: [
					{
						symbol: 'L1',
						clusterSize: 6,
						win: 40,
						positions: [
							{ reel: 3, row: 2 },
							{ reel: 4, row: 2 },
							{ reel: 5, row: 2 },
							{ reel: 4, row: 1 },
							{ reel: 4, row: 3 },
							{ reel: 5, row: 1 }
						],
						meta: {
							globalMult: 1,
							clusterMult: 1,
							winWithoutMult: 40,
							overlay: { reel: 3, row: 2 }
						}
					}
				]
			},
			{
				index: 7,
				type: 'glyphActivation',
				position: { reel: 5, row: 1 },
				activatedCount: 1,
				totalGlyphs: 13
			},
			{
				index: 8,
				type: 'updateGrid',
				gridMultipliers: [
					[1, 1, 1, 1, 1, 1, 1],
					[1, 1, 1, 1, 1, 1, 1],
					[1, 1, 1, 1, 1, 1, 1],
					[1, 2, 1, 1, 1, 1, 1],
					[2, 2, 2, 1, 1, 1, 1],
					[2, 2, 1, 1, 1, 1, 1],
					[1, 1, 1, 1, 1, 1, 1]
				]
			},
			{
				index: 9,
				type: 'updateTumbleWin',
				amount: 40
			},
			{
				index: 10,
				type: 'tumbleBoard',
				newSymbols: [
					[
					],
					[
					],
					[
					],
					[
						{ name: 'L2' }
					],
					[
						{ name: 'L1' },
						{ name: 'H1' },
						{ name: 'L2' }
					],
					[
						{ name: 'H1' },
						{ name: 'L4' }
					],
					[
					]
				],
				explodingSymbols: [
					{ reel: 3, row: 2 },
					{ reel: 4, row: 1 },
					{ reel: 4, row: 2 },
					{ reel: 4, row: 3 },
					{ reel: 5, row: 1 },
					{ reel: 5, row: 2 }
				]
			},
			{
				index: 11,
				type: 'setWin',
				amount: 40,
				winLevel: 2
			},
			{
				index: 12,
				type: 'setTotalWin',
				amount: 40
			},
			{
				index: 13,
				type: 'updateFreeSpin',
				amount: 2,
				total: 3
			},
			{
				index: 14,
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
							name: 'W',
							wild: true,
						},
						{
							name: 'L3',
						},
						{
							name: 'H4',
						},
						{
							name: 'H3',
						},
						{
							name: 'L1',
						},
						{
							name: 'L2',
						},
						{
							name: 'L1',
						}
					],
					[
						{
							name: 'H4',
						},
						{
							name: 'H2',
						},
						{
							name: 'H4',
						},
						{
							name: 'H3',
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
							name: 'L1',
						},
						{
							name: 'L1',
						}
					],
					[
						{
							name: 'H1',
						},
						{
							name: 'L4',
						},
						{
							name: 'L3',
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
							name: 'H4',
						},
						{
							name: 'H1',
						},
						{
							name: 'H1',
						}
					],
					[
						{
							name: 'L3',
						},
						{
							name: 'L2',
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
							name: 'L4',
						}
					],
					[
						{
							name: 'L1',
						},
						{
							name: 'L3',
						},
						{
							name: 'H3',
						},
						{
							name: 'H3',
						},
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
							name: 'L2',
						},
						{
							name: 'L3',
						}
					],
					[
						{
							name: 'H1',
						},
						{
							name: 'H3',
						},
						{
							name: 'L3',
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
						{
							name: 'L3',
						},
						{
							name: 'L2',
						},
						{
							name: 'L3',
						}
					],
					[
						{
							name: 'H3',
						},
						{
							name: 'L1',
						},
						{
							name: 'W',
							wild: true,
						},
						{
							name: 'L3',
						},
						{
							name: 'W',
							wild: true,
						},
						{
							name: 'L3',
						},
						{
							name: 'W',
							wild: true,
						},
						{
							name: 'L4',
						},
						{
							name: 'H3',
						}
					]
				],
				paddingPositions: [110, 17, 219, 152, 0, 233, 196],
				gameType: 'freegame',
				anticipation: [0, 0, 0, 0, 0, 0, 0]
			},
			{
				index: 15,
				type: 'winInfo',
				totalWin: 439,
				wins: [
					{
						symbol: 'H3',
						clusterSize: 5,
						win: 359,
						positions: [
							{ reel: 3, row: 2 },
							{ reel: 4, row: 2 },
							{ reel: 4, row: 3 },
							{ reel: 5, row: 3 },
							{ reel: 4, row: 4 }
						],
						meta: {
							globalMult: 1,
							clusterMult: 6,
							winWithoutMult: 60,
							overlay: { reel: 3, row: 2 }
						}
					},
					{
						symbol: 'L3',
						clusterSize: 7,
						win: 80,
						positions: [
							{ reel: 5, row: 2 },
							{ reel: 6, row: 2 },
							{ reel: 6, row: 3 },
							{ reel: 6, row: 4 },
							{ reel: 6, row: 5 },
							{ reel: 6, row: 6 },
							{ reel: 5, row: 6 }
						],
						meta: {
							globalMult: 1,
							clusterMult: 2,
							winWithoutMult: 40,
							overlay: { reel: 5, row: 2 }
						}
					}
				]
			},
			{
				index: 16,
				type: 'glyphActivation',
				position: { reel: 6, row: 2 },
				activatedCount: 2,
				totalGlyphs: 13
			},
			{
				index: 17,
				type: 'glyphActivation',
				position: { reel: 6, row: 4 },
				activatedCount: 3,
				totalGlyphs: 13
			},
			{
				index: 18,
				type: 'glyphActivation',
				position: { reel: 6, row: 5 },
				activatedCount: 4,
				totalGlyphs: 13
			},
			{
				index: 19,
				type: 'glyphActivation',
				position: { reel: 6, row: 6 },
				activatedCount: 5,
				totalGlyphs: 13
			},
			{
				index: 20,
				type: 'updateGrid',
				gridMultipliers: [
					[1, 1, 1, 1, 1, 1, 1],
					[1, 1, 1, 1, 1, 1, 1],
					[1, 1, 1, 1, 1, 1, 1],
					[1, 4, 1, 1, 1, 1, 1],
					[2, 4, 4, 2, 1, 1, 1],
					[2, 4, 2, 1, 1, 2, 1],
					[1, 2, 2, 2, 2, 2, 1]
				]
			},
			{
				index: 21,
				type: 'updateTumbleWin',
				amount: 480
			},
			{
				index: 22,
				type: 'tumbleBoard',
				newSymbols: [
					[
					],
					[
					],
					[
					],
					[
						{ name: 'L4' }
					],
					[
						{ name: 'H1' },
						{ name: 'L2' },
						{ name: 'H4' }
					],
					[
						{ name: 'S' },
						{ name: 'H4' },
						{ name: 'H4' }
					],
					[
						{ name: 'L3' },
						{ name: 'H2' },
						{ name: 'H1' },
						{ name: 'L1' },
						{ name: 'L3' }
					]
				],
				explodingSymbols: [
					{ reel: 3, row: 2 },
					{ reel: 4, row: 2 },
					{ reel: 4, row: 3 },
					{ reel: 4, row: 4 },
					{ reel: 5, row: 2 },
					{ reel: 5, row: 3 },
					{ reel: 5, row: 6 },
					{ reel: 6, row: 2 },
					{ reel: 6, row: 3 },
					{ reel: 6, row: 4 },
					{ reel: 6, row: 5 },
					{ reel: 6, row: 6 }
				]
			},
			{
				index: 23,
				type: 'setWin',
				amount: 480,
				winLevel: 2
			},
			{
				index: 24,
				type: 'setTotalWin',
				amount: 480
			},
			{
				index: 25,
				type: 'updateFreeSpin',
				amount: 3,
				total: 5
			},
			{
				index: 26,
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
							name: 'L4',
						},
						{
							name: 'L4',
						},
						{
							name: 'H1',
						},
						{
							name: 'H1',
						},
						{
							name: 'L3',
						},
						{
							name: 'L3',
						},
						{
							name: 'L4',
						}
					],
					[
						{
							name: 'L4',
						},
						{
							name: 'L2',
						},
						{
							name: 'L2',
						},
						{
							name: 'W',
							wild: true,
						},
						{
							name: 'L2',
						},
						{
							name: 'L4',
						},
						{
							name: 'L2',
						},
						{
							name: 'L2',
						},
						{
							name: 'L3',
						}
					],
					[
						{
							name: 'L1',
						},
						{
							name: 'H3',
						},
						{
							name: 'H3',
						},
						{
							name: 'L4',
						},
						{
							name: 'H4',
						},
						{
							name: 'L1',
						},
						{
							name: 'H2',
						},
						{
							name: 'L3',
						},
						{
							name: 'L1',
						}
					],
					[
						{
							name: 'L2',
						},
						{
							name: 'H4',
						},
						{
							name: 'L2',
						},
						{
							name: 'L3',
						},
						{
							name: 'L3',
						},
						{
							name: 'L3',
						},
						{
							name: 'H3',
						},
						{
							name: 'H3',
						},
						{
							name: 'L2',
						}
					],
					[
						{
							name: 'L3',
						},
						{
							name: 'H2',
						},
						{
							name: 'H3',
						},
						{
							name: 'L3',
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
							name: 'L3',
						},
						{
							name: 'L3',
						}
					],
					[
						{
							name: 'H4',
						},
						{
							name: 'H4',
						},
						{
							name: 'H4',
						},
						{
							name: 'L3',
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
							name: 'L3',
						},
						{
							name: 'L1',
						}
					],
					[
						{
							name: 'H3',
						},
						{
							name: 'L2',
						},
						{
							name: 'W',
							wild: true,
						},
						{
							name: 'H2',
						},
						{
							name: 'H1',
						},
						{
							name: 'H2',
						},
						{
							name: 'H2',
						},
						{
							name: 'L3',
						},
						{
							name: 'H4',
						}
					]
				],
				paddingPositions: [73, 238, 2, 91, 38, 174, 121],
				gameType: 'freegame',
				anticipation: [0, 0, 0, 0, 0, 0, 0]
			},
			{
				index: 27,
				type: 'winInfo',
				totalWin: 229,
				wins: [
					{
						symbol: 'L4',
						clusterSize: 5,
						win: 10,
						positions: [
							{ reel: 0, row: 1 },
							{ reel: 0, row: 2 },
							{ reel: 0, row: 3 },
							{ reel: 1, row: 3 },
							{ reel: 2, row: 3 }
						],
						meta: {
							globalMult: 1,
							clusterMult: 1,
							winWithoutMult: 10,
							overlay: { reel: 0, row: 1 }
						}
					},
					{
						symbol: 'L3',
						clusterSize: 6,
						win: 179,
						positions: [
							{ reel: 3, row: 3 },
							{ reel: 4, row: 3 },
							{ reel: 3, row: 4 },
							{ reel: 5, row: 3 },
							{ reel: 3, row: 5 },
							{ reel: 5, row: 4 }
						],
						meta: {
							globalMult: 1,
							clusterMult: 6,
							winWithoutMult: 30,
							overlay: { reel: 3, row: 3 }
						}
					},
					{
						symbol: 'L3',
						clusterSize: 5,
						win: 40,
						positions: [
							{ reel: 4, row: 6 },
							{ reel: 5, row: 6 },
							{ reel: 4, row: 7 },
							{ reel: 5, row: 7 },
							{ reel: 6, row: 7 }
						],
						meta: {
							globalMult: 1,
							clusterMult: 2,
							winWithoutMult: 20,
							overlay: { reel: 4, row: 6 }
						}
					}
				]
			},
			{
				index: 28,
				type: 'glyphActivation',
				position: { reel: 0, row: 1 },
				activatedCount: 6,
				totalGlyphs: 13
			},
			{
				index: 29,
				type: 'glyphActivation',
				position: { reel: 0, row: 3 },
				activatedCount: 7,
				totalGlyphs: 13
			},
			{
				index: 30,
				type: 'glyphActivation',
				position: { reel: 5, row: 7 },
				activatedCount: 8,
				totalGlyphs: 13
			},
			{
				index: 31,
				type: 'updateGrid',
				gridMultipliers: [
					[2, 2, 2, 1, 1, 1, 1],
					[1, 1, 2, 1, 1, 1, 1],
					[1, 1, 2, 1, 1, 1, 1],
					[1, 4, 2, 2, 2, 1, 1],
					[2, 4, 8, 2, 1, 2, 2],
					[2, 4, 4, 2, 1, 4, 2],
					[1, 2, 2, 2, 2, 2, 2]
				]
			},
			{
				index: 32,
				type: 'updateTumbleWin',
				amount: 710
			},
			{
				index: 33,
				type: 'tumbleBoard',
				newSymbols: [
					[
						{ name: 'L2' },
						{ name: 'H4' },
						{ name: 'H2' }
					],
					[
						{ name: 'H2' }
					],
					[
						{ name: 'L2' }
					],
					[
						{ name: 'H3' },
						{ name: 'L2' },
						{ name: 'H3' }
					],
					[
						{ name: 'L2' },
						{ name: 'L2' },
						{ name: 'L2' }
					],
					[
						{ name: 'H3' },
						{ name: 'H1' },
						{ name: 'L1' },
						{ name: 'H1' }
					],
					[
						{ name: 'H3' }
					]
				],
				explodingSymbols: [
					{ reel: 0, row: 1 },
					{ reel: 0, row: 2 },
					{ reel: 0, row: 3 },
					{ reel: 1, row: 3 },
					{ reel: 2, row: 3 },
					{ reel: 3, row: 3 },
					{ reel: 3, row: 4 },
					{ reel: 3, row: 5 },
					{ reel: 4, row: 3 },
					{ reel: 4, row: 6 },
					{ reel: 4, row: 7 },
					{ reel: 5, row: 3 },
					{ reel: 5, row: 4 },
					{ reel: 5, row: 6 },
					{ reel: 5, row: 7 },
					{ reel: 6, row: 7 }
				]
			},
			{
				index: 34,
				type: 'setWin',
				amount: 710,
				winLevel: 2
			},
			{
				index: 35,
				type: 'setTotalWin',
				amount: 710
			},
			{
				index: 36,
				type: 'updateFreeSpin',
				amount: 4,
				total: 7
			},
			{
				index: 37,
				type: 'reveal',
				board: [
					[
						{
							name: 'L1',
						},
						{
							name: 'H4',
						},
						{
							name: 'H3',
						},
						{
							name: 'H2',
						},
						{
							name: 'L4',
						},
						{
							name: 'L4',
						},
						{
							name: 'H1',
						},
						{
							name: 'H1',
						},
						{
							name: 'L4',
						}
					],
					[
						{
							name: 'H3',
						},
						{
							name: 'H2',
						},
						{
							name: 'H4',
						},
						{
							name: 'H4',
						},
						{
							name: 'W',
							wild: true,
						},
						{
							name: 'L2',
						},
						{
							name: 'H2',
						},
						{
							name: 'L4',
						},
						{
							name: 'L2',
						}
					],
					[
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
							name: 'H4',
						},
						{
							name: 'H2',
						},
						{
							name: 'H2',
						},
						{
							name: 'H3',
						},
						{
							name: 'L3',
						},
						{
							name: 'H4',
						}
					],
					[
						{
							name: 'L4',
						},
						{
							name: 'L3',
						},
						{
							name: 'H4',
						},
						{
							name: 'W',
							wild: true,
						},
						{
							name: 'H2',
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
						}
					],
					[
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
							name: 'L4',
						},
						{
							name: 'L1',
						},
						{
							name: 'L1',
						},
						{
							name: 'H1',
						},
						{
							name: 'H1',
						},
						{
							name: 'L4',
						}
					],
					[
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
							name: 'L2',
						},
						{
							name: 'L4',
						},
						{
							name: 'L4',
						},
						{
							name: 'L2',
						}
					],
					[
						{
							name: 'H1',
						},
						{
							name: 'L3',
						},
						{
							name: 'L3',
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
						{
							name: 'L2',
						},
						{
							name: 'L2',
						},
						{
							name: 'L3',
						}
					]
				],
				paddingPositions: [36, 278, 142, 126, 262, 38, 7],
				gameType: 'freegame',
				anticipation: [0, 0, 0, 0, 0, 0, 0]
			},
			{
				index: 38,
				type: 'winInfo',
				totalWin: 500,
				wins: [
					{
						symbol: 'H4',
						clusterSize: 5,
						win: 500,
						positions: [
							{ reel: 1, row: 2 },
							{ reel: 1, row: 3 },
							{ reel: 2, row: 3 },
							{ reel: 3, row: 3 },
							{ reel: 3, row: 2 }
						],
						meta: {
							globalMult: 1,
							clusterMult: 10,
							winWithoutMult: 50,
							overlay: { reel: 1, row: 2 }
						}
					}
				]
			},
			{
				index: 39,
				type: 'updateGrid',
				gridMultipliers: [
					[2, 2, 2, 1, 1, 1, 1],
					[1, 2, 4, 1, 1, 1, 1],
					[1, 1, 4, 1, 1, 1, 1],
					[1, 8, 4, 2, 2, 1, 1],
					[2, 4, 8, 2, 1, 2, 2],
					[2, 4, 4, 2, 1, 4, 2],
					[1, 2, 2, 2, 2, 2, 2]
				]
			},
			{
				index: 40,
				type: 'updateTumbleWin',
				amount: 1210
			},
			{
				index: 41,
				type: 'tumbleBoard',
				newSymbols: [
					[
					],
					[
						{ name: 'L2' },
						{ name: 'H1' }
					],
					[
						{ name: 'L1' }
					],
					[
						{ name: 'L2' },
						{ name: 'L4' }
					],
					[
					],
					[
					],
					[
					]
				],
				explodingSymbols: [
					{ reel: 1, row: 2 },
					{ reel: 1, row: 3 },
					{ reel: 2, row: 3 },
					{ reel: 3, row: 2 },
					{ reel: 3, row: 3 }
				]
			},
			{
				index: 42,
				type: 'setWin',
				amount: 1210,
				winLevel: 2
			},
			{
				index: 43,
				type: 'setTotalWin',
				amount: 1210
			},
			{
				index: 44,
				type: 'winInfo',
				totalWin: 800,
				wins: [
					{
						symbol: 'H2',
						clusterSize: 6,
						win: 800,
						positions: [
							{ reel: 0, row: 3 },
							{ reel: 1, row: 3 },
							{ reel: 1, row: 4 },
							{ reel: 2, row: 4 },
							{ reel: 3, row: 4 },
							{ reel: 2, row: 5 }
						],
						meta: {
							globalMult: 1,
							clusterMult: 8,
							winWithoutMult: 100,
							overlay: { reel: 0, row: 3 }
						}
					}
				]
			},
			{
				index: 45,
				type: 'updateGrid',
				gridMultipliers: [
					[2, 2, 4, 1, 1, 1, 1],
					[1, 2, 8, 2, 1, 1, 1],
					[1, 1, 4, 2, 2, 1, 1],
					[1, 8, 4, 4, 2, 1, 1],
					[2, 4, 8, 2, 1, 2, 2],
					[2, 4, 4, 2, 1, 4, 2],
					[1, 2, 2, 2, 2, 2, 2]
				]
			},
			{
				index: 46,
				type: 'updateTumbleWin',
				amount: 2010
			},
			{
				index: 47,
				type: 'tumbleBoard',
				newSymbols: [
					[
						{ name: 'L3' }
					],
					[
						{ name: 'H3' },
						{ name: 'L2' }
					],
					[
						{ name: 'L4' },
						{ name: 'L2' }
					],
					[
						{ name: 'L4' }
					],
					[
					],
					[
					],
					[
					]
				],
				explodingSymbols: [
					{ reel: 0, row: 3 },
					{ reel: 1, row: 3 },
					{ reel: 1, row: 4 },
					{ reel: 2, row: 4 },
					{ reel: 2, row: 5 },
					{ reel: 3, row: 4 }
				]
			},
			{
				index: 48,
				type: 'setWin',
				amount: 2010,
				winLevel: 2
			},
			{
				index: 49,
				type: 'setTotalWin',
				amount: 2010
			},
			{
				index: 50,
				type: 'winInfo',
				totalWin: 480,
				wins: [
					{
						symbol: 'L1',
						clusterSize: 6,
						win: 480,
						positions: [
							{ reel: 2, row: 3 },
							{ reel: 2, row: 4 },
							{ reel: 2, row: 5 },
							{ reel: 3, row: 5 },
							{ reel: 4, row: 5 },
							{ reel: 4, row: 4 }
						],
						meta: {
							globalMult: 1,
							clusterMult: 12,
							winWithoutMult: 40,
							overlay: { reel: 2, row: 3 }
						}
					}
				]
			},
			{
				index: 51,
				type: 'updateGrid',
				gridMultipliers: [
					[2, 2, 4, 1, 1, 1, 1],
					[1, 2, 8, 2, 1, 1, 1],
					[1, 1, 8, 4, 4, 1, 1],
					[1, 8, 4, 4, 4, 1, 1],
					[2, 4, 8, 4, 2, 2, 2],
					[2, 4, 4, 2, 1, 4, 2],
					[1, 2, 2, 2, 2, 2, 2]
				]
			},
			{
				index: 52,
				type: 'updateTumbleWin',
				amount: 2490
			},
			{
				index: 53,
				type: 'tumbleBoard',
				newSymbols: [
					[
					],
					[
					],
					[
						{ name: 'L4' },
						{ name: 'L1' },
						{ name: 'H1' }
					],
					[
						{ name: 'H2' }
					],
					[
						{ name: 'H2' },
						{ name: 'L3' }
					],
					[
					],
					[
					]
				],
				explodingSymbols: [
					{ reel: 2, row: 3 },
					{ reel: 2, row: 4 },
					{ reel: 2, row: 5 },
					{ reel: 3, row: 5 },
					{ reel: 4, row: 4 },
					{ reel: 4, row: 5 }
				]
			},
			{
				index: 54,
				type: 'setWin',
				amount: 2490,
				winLevel: 2
			},
			{
				index: 55,
				type: 'setTotalWin',
				amount: 2490
			},
			{
				index: 56,
				type: 'updateFreeSpin',
				amount: 5,
				total: 9
			},
			{
				index: 57,
				type: 'reveal',
				board: [
					[
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
							name: 'L4',
						},
						{
							name: 'L4',
						},
						{
							name: 'H4',
						},
						{
							name: 'H1',
						},
						{
							name: 'L2',
						},
						{
							name: 'L1',
						}
					],
					[
						{
							name: 'L2',
						},
						{
							name: 'L1',
						},
						{
							name: 'L2',
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
							name: 'W',
							wild: true,
						},
						{
							name: 'L1',
						},
						{
							name: 'L1',
						}
					],
					[
						{
							name: 'L4',
						},
						{
							name: 'W',
							wild: true,
						},
						{
							name: 'L3',
						},
						{
							name: 'L3',
						},
						{
							name: 'L4',
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
						}
					],
					[
						{
							name: 'H1',
						},
						{
							name: 'L4',
						},
						{
							name: 'H4',
						},
						{
							name: 'W',
							wild: true,
						},
						{
							name: 'L2',
						},
						{
							name: 'L2',
						},
						{
							name: 'H4',
						},
						{
							name: 'L4',
						},
						{
							name: 'H4',
						}
					],
					[
						{
							name: 'H1',
						},
						{
							name: 'H4',
						},
						{
							name: 'L3',
						},
						{
							name: 'L3',
						},
						{
							name: 'L3',
						},
						{
							name: 'L3',
						},
						{
							name: 'L3',
						},
						{
							name: 'L2',
						},
						{
							name: 'L4',
						}
					],
					[
						{
							name: 'L2',
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
							name: 'L1',
						},
						{
							name: 'L1',
						},
						{
							name: 'H1',
						},
						{
							name: 'L3',
						},
						{
							name: 'H3',
						}
					],
					[
						{
							name: 'H4',
						},
						{
							name: 'L1',
						},
						{
							name: 'L4',
						},
						{
							name: 'L4',
						},
						{
							name: 'L4',
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
							name: 'H4',
						}
					]
				],
				paddingPositions: [6, 184, 15, 13, 247, 24, 275],
				gameType: 'freegame',
				anticipation: [0, 0, 0, 0, 0, 0, 0]
			},
			{
				index: 58,
				type: 'winInfo',
				totalWin: 1600,
				wins: [
					{
						symbol: 'L3',
						clusterSize: 8,
						win: 1600,
						positions: [
							{ reel: 2, row: 2 },
							{ reel: 2, row: 3 },
							{ reel: 3, row: 3 },
							{ reel: 4, row: 3 },
							{ reel: 4, row: 2 },
							{ reel: 4, row: 4 },
							{ reel: 4, row: 5 },
							{ reel: 4, row: 6 }
						],
						meta: {
							globalMult: 1,
							clusterMult: 32,
							winWithoutMult: 50,
							overlay: { reel: 2, row: 2 }
						}
					}
				]
			},
			{
				index: 59,
				type: 'updateGrid',
				gridMultipliers: [
					[2, 2, 4, 1, 1, 1, 1],
					[1, 2, 8, 2, 1, 1, 1],
					[1, 2, 16, 4, 4, 1, 1],
					[1, 8, 8, 4, 4, 1, 1],
					[2, 8, 16, 8, 4, 4, 2],
					[2, 4, 4, 2, 1, 4, 2],
					[1, 2, 2, 2, 2, 2, 2]
				]
			},
			{
				index: 60,
				type: 'updateTumbleWin',
				amount: 4090
			},
			{
				index: 61,
				type: 'tumbleBoard',
				newSymbols: [
					[
					],
					[
					],
					[
						{ name: 'H2' },
						{ name: 'L4' }
					],
					[
						{ name: 'H2' }
					],
					[
						{ name: 'L2' },
						{ name: 'L1' },
						{ name: 'H2' },
						{ name: 'L2' },
						{ name: 'H1' }
					],
					[
					],
					[
					]
				],
				explodingSymbols: [
					{ reel: 2, row: 2 },
					{ reel: 2, row: 3 },
					{ reel: 3, row: 3 },
					{ reel: 4, row: 2 },
					{ reel: 4, row: 3 },
					{ reel: 4, row: 4 },
					{ reel: 4, row: 5 },
					{ reel: 4, row: 6 }
				]
			},
			{
				index: 62,
				type: 'setWin',
				amount: 4090,
				winLevel: 2
			},
			{
				index: 63,
				type: 'setTotalWin',
				amount: 4090
			},
			{
				index: 64,
				type: 'winInfo',
				totalWin: 2400,
				wins: [
					{
						symbol: 'L4',
						clusterSize: 9,
						win: 2400,
						positions: [
							{ reel: 0, row: 2 },
							{ reel: 0, row: 3 },
							{ reel: 1, row: 3 },
							{ reel: 0, row: 4 },
							{ reel: 2, row: 3 },
							{ reel: 2, row: 2 },
							{ reel: 2, row: 4 },
							{ reel: 3, row: 2 },
							{ reel: 2, row: 5 }
						],
						meta: {
							globalMult: 1,
							clusterMult: 48,
							winWithoutMult: 50,
							overlay: { reel: 0, row: 2 }
						}
					}
				]
			},
			{
				index: 65,
				type: 'updateGrid',
				gridMultipliers: [
					[2, 4, 8, 2, 1, 1, 1],
					[1, 2, 16, 2, 1, 1, 1],
					[1, 4, 32, 8, 8, 1, 1],
					[1, 16, 8, 4, 4, 1, 1],
					[2, 8, 16, 8, 4, 4, 2],
					[2, 4, 4, 2, 1, 4, 2],
					[1, 2, 2, 2, 2, 2, 2]
				]
			},
			{
				index: 66,
				type: 'updateTumbleWin',
				amount: 6490
			},
			{
				index: 67,
				type: 'tumbleBoard',
				newSymbols: [
					[
						{ name: 'H4' },
						{ name: 'H3' },
						{ name: 'L1' }
					],
					[
						{ name: 'L1' }
					],
					[
						{ name: 'L2' },
						{ name: 'H2' },
						{ name: 'L2' },
						{ name: 'L3' }
					],
					[
						{ name: 'H3' }
					],
					[
					],
					[
					],
					[
					]
				],
				explodingSymbols: [
					{ reel: 0, row: 2 },
					{ reel: 0, row: 3 },
					{ reel: 0, row: 4 },
					{ reel: 1, row: 3 },
					{ reel: 2, row: 2 },
					{ reel: 2, row: 3 },
					{ reel: 2, row: 4 },
					{ reel: 2, row: 5 },
					{ reel: 3, row: 2 }
				]
			},
			{
				index: 68,
				type: 'setWin',
				amount: 6490,
				winLevel: 3
			},
			{
				index: 69,
				type: 'setTotalWin',
				amount: 6490
			},
			{
				index: 70,
				type: 'winInfo',
				totalWin: 600,
				wins: [
					{
						symbol: 'L1',
						clusterSize: 7,
						win: 600,
						positions: [
							{ reel: 0, row: 3 },
							{ reel: 0, row: 4 },
							{ reel: 1, row: 4 },
							{ reel: 1, row: 5 },
							{ reel: 1, row: 6 },
							{ reel: 1, row: 7 },
							{ reel: 2, row: 7 }
						],
						meta: {
							globalMult: 1,
							clusterMult: 12,
							winWithoutMult: 50,
							overlay: { reel: 0, row: 3 }
						}
					}
				]
			},
			{
				index: 71,
				type: 'glyphActivation',
				position: { reel: 1, row: 6 },
				activatedCount: 9,
				totalGlyphs: 13
			},
			{
				index: 72,
				type: 'glyphActivation',
				position: { reel: 2, row: 7 },
				activatedCount: 10,
				totalGlyphs: 13
			},
			{
				index: 73,
				type: 'updateGrid',
				gridMultipliers: [
					[2, 4, 16, 4, 1, 1, 1],
					[1, 2, 16, 4, 2, 2, 2],
					[1, 4, 32, 8, 8, 1, 2],
					[1, 16, 8, 4, 4, 1, 1],
					[2, 8, 16, 8, 4, 4, 2],
					[2, 4, 4, 2, 1, 4, 2],
					[1, 2, 2, 2, 2, 2, 2]
				]
			},
			{
				index: 74,
				type: 'updateTumbleWin',
				amount: 7090
			},
			{
				index: 75,
				type: 'tumbleBoard',
				newSymbols: [
					[
						{ name: 'H3' },
						{ name: 'L4' }
					],
					[
						{ name: 'H2' },
						{ name: 'L2' },
						{ name: 'L3' },
						{ name: 'H3' }
					],
					[
						{ name: 'H3' }
					],
					[
					],
					[
					],
					[
					],
					[
					]
				],
				explodingSymbols: [
					{ reel: 0, row: 3 },
					{ reel: 0, row: 4 },
					{ reel: 1, row: 4 },
					{ reel: 1, row: 5 },
					{ reel: 1, row: 6 },
					{ reel: 1, row: 7 },
					{ reel: 2, row: 7 }
				]
			},
			{
				index: 76,
				type: 'setWin',
				amount: 7090,
				winLevel: 3
			},
			{
				index: 77,
				type: 'setTotalWin',
				amount: 7090
			},
			{
				index: 78,
				type: 'updateFreeSpin',
				amount: 6,
				total: 11
			},
			{
				index: 79,
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
							name: 'H1',
						},
						{
							name: 'L4',
						},
						{
							name: 'H2',
						},
						{
							name: 'H3',
						},
						{
							name: 'L2',
						},
						{
							name: 'L1',
						}
					],
					[
						{
							name: 'L4',
						},
						{
							name: 'H1',
						},
						{
							name: 'L4',
						},
						{
							name: 'L2',
						},
						{
							name: 'H1',
						},
						{
							name: 'H1',
						},
						{
							name: 'H3',
						},
						{
							name: 'L1',
						},
						{
							name: 'L4',
						}
					],
					[
						{
							name: 'H4',
						},
						{
							name: 'L2',
						},
						{
							name: 'L1',
						},
						{
							name: 'L1',
						},
						{
							name: 'H1',
						},
						{
							name: 'H1',
						},
						{
							name: 'L4',
						},
						{
							name: 'L4',
						},
						{
							name: 'H4',
						}
					],
					[
						{
							name: 'H1',
						},
						{
							name: 'H2',
						},
						{
							name: 'H2',
						},
						{
							name: 'H2',
						},
						{
							name: 'H1',
						},
						{
							name: 'H1',
						},
						{
							name: 'H1',
						},
						{
							name: 'L1',
						},
						{
							name: 'L1',
						}
					],
					[
						{
							name: 'L4',
						},
						{
							name: 'H2',
						},
						{
							name: 'L2',
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
							name: 'L1',
						},
						{
							name: 'L3',
						}
					],
					[
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
							name: 'L3',
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
							name: 'L4',
						},
						{
							name: 'L4',
						}
					],
					[
						{
							name: 'H4',
						},
						{
							name: 'L3',
						},
						{
							name: 'L2',
						},
						{
							name: 'H4',
						},
						{
							name: 'H4',
						},
						{
							name: 'L4',
						},
						{
							name: 'W',
							wild: true,
						},
						{
							name: 'H3',
						},
						{
							name: 'H1',
						}
					]
				],
				paddingPositions: [124, 193, 107, 200, 64, 76, 43],
				gameType: 'freegame',
				anticipation: [0, 0, 0, 0, 0, 0, 0]
			},
			{
				index: 80,
				type: 'winInfo',
				totalWin: 6560,
				wins: [
					{
						symbol: 'L1',
						clusterSize: 6,
						win: 480,
						positions: [
							{ reel: 3, row: 7 },
							{ reel: 4, row: 7 },
							{ reel: 4, row: 6 },
							{ reel: 5, row: 6 },
							{ reel: 6, row: 6 },
							{ reel: 5, row: 5 }
						],
						meta: {
							globalMult: 1,
							clusterMult: 12,
							winWithoutMult: 40,
							overlay: { reel: 3, row: 7 }
						}
					},
					{
						symbol: 'L2',
						clusterSize: 5,
						win: 640,
						positions: [
							{ reel: 4, row: 2 },
							{ reel: 5, row: 2 },
							{ reel: 4, row: 3 },
							{ reel: 6, row: 2 },
							{ reel: 5, row: 1 }
						],
						meta: {
							globalMult: 1,
							clusterMult: 32,
							winWithoutMult: 20,
							overlay: { reel: 4, row: 2 }
						}
					},
					{
						symbol: 'H1',
						clusterSize: 8,
						win: 5440,
						positions: [
							{ reel: 1, row: 4 },
							{ reel: 2, row: 4 },
							{ reel: 1, row: 5 },
							{ reel: 3, row: 4 },
							{ reel: 2, row: 5 },
							{ reel: 3, row: 5 },
							{ reel: 4, row: 5 },
							{ reel: 3, row: 6 }
						],
						meta: {
							globalMult: 1,
							clusterMult: 34,
							winWithoutMult: 160,
							overlay: { reel: 1, row: 4 }
						}
					}
				]
			},
			{
				index: 81,
				type: 'glyphActivation',
				position: { reel: 5, row: 5 },
				activatedCount: 11,
				totalGlyphs: 13
			},
			{
				index: 82,
				type: 'updateGrid',
				gridMultipliers: [
					[2, 4, 16, 4, 1, 1, 1],
					[1, 2, 16, 8, 4, 2, 2],
					[1, 4, 32, 16, 16, 1, 2],
					[1, 16, 8, 8, 8, 2, 2],
					[2, 16, 32, 8, 8, 8, 4],
					[4, 8, 4, 2, 2, 8, 2],
					[1, 4, 2, 2, 2, 4, 2]
				]
			},
			{
				index: 83,
				type: 'updateTumbleWin',
				amount: 13650
			},
			{
				index: 84,
				type: 'tumbleBoard',
				newSymbols: [
					[
					],
					[
						{ name: 'L3' },
						{ name: 'L3' }
					],
					[
						{ name: 'H4' },
						{ name: 'L4' }
					],
					[
						{ name: 'H2' },
						{ name: 'L2' },
						{ name: 'L3' },
						{ name: 'L3' }
					],
					[
						{ name: 'H4' },
						{ name: 'L3' },
						{ name: 'L3' },
						{ name: 'L2' },
						{ name: 'L2' }
					],
					[
						{ name: 'H2' },
						{ name: 'H3' },
						{ name: 'L4' },
						{ name: 'L4' }
					],
					[
						{ name: 'L3' },
						{ name: 'H1' }
					]
				],
				explodingSymbols: [
					{ reel: 1, row: 4 },
					{ reel: 1, row: 5 },
					{ reel: 2, row: 4 },
					{ reel: 2, row: 5 },
					{ reel: 3, row: 4 },
					{ reel: 3, row: 5 },
					{ reel: 3, row: 6 },
					{ reel: 3, row: 7 },
					{ reel: 4, row: 2 },
					{ reel: 4, row: 3 },
					{ reel: 4, row: 5 },
					{ reel: 4, row: 6 },
					{ reel: 4, row: 7 },
					{ reel: 5, row: 1 },
					{ reel: 5, row: 2 },
					{ reel: 5, row: 5 },
					{ reel: 5, row: 6 },
					{ reel: 6, row: 2 },
					{ reel: 6, row: 6 }
				]
			},
			{
				index: 85,
				type: 'setWin',
				amount: 13650,
				winLevel: 4
			},
			{
				index: 86,
				type: 'setTotalWin',
				amount: 13650
			},
			{
				index: 87,
				type: 'updateFreeSpin',
				amount: 7,
				total: 13
			},
			{
				index: 88,
				type: 'reveal',
				board: [
					[
						{
							name: 'L4',
						},
						{
							name: 'H4',
						},
						{
							name: 'W',
							wild: true,
						},
						{
							name: 'H4',
						},
						{
							name: 'H2',
						},
						{
							name: 'W',
							wild: true,
						},
						{
							name: 'H3',
						},
						{
							name: 'H2',
						},
						{
							name: 'H1',
						}
					],
					[
						{
							name: 'L4',
						},
						{
							name: 'H2',
						},
						{
							name: 'H3',
						},
						{
							name: 'H4',
						},
						{
							name: 'H3',
						},
						{
							name: 'S',
							scatter: true,
						},
						{
							name: 'H1',
						},
						{
							name: 'L3',
						},
						{
							name: 'L4',
						}
					],
					[
						{
							name: 'H4',
						},
						{
							name: 'H1',
						},
						{
							name: 'L4',
						},
						{
							name: 'L3',
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
							name: 'H4',
						},
						{
							name: 'L4',
						}
					],
					[
						{
							name: 'L1',
						},
						{
							name: 'L1',
						},
						{
							name: 'L1',
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
							name: 'L3',
						},
						{
							name: 'H2',
						},
						{
							name: 'H1',
						}
					],
					[
						{
							name: 'L4',
						},
						{
							name: 'L3',
						},
						{
							name: 'L2',
						},
						{
							name: 'H2',
						},
						{
							name: 'L4',
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
							name: 'L3',
						}
					],
					[
						{
							name: 'L1',
						},
						{
							name: 'H4',
						},
						{
							name: 'H4',
						},
						{
							name: 'H2',
						},
						{
							name: 'H1',
						},
						{
							name: 'H1',
						},
						{
							name: 'L3',
						},
						{
							name: 'L3',
						},
						{
							name: 'L3',
						}
					],
					[
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
							name: 'W',
							wild: true,
						},
						{
							name: 'H4',
						},
						{
							name: 'H4',
						},
						{
							name: 'W',
							wild: true,
						},
						{
							name: 'L1',
						},
						{
							name: 'L2',
						}
					]
				],
				paddingPositions: [191, 107, 218, 294, 52, 254, 264],
				gameType: 'freegame',
				anticipation: [0, 0, 0, 0, 0, 0, 0]
			},
			{
				index: 89,
				type: 'updateFreeSpin',
				amount: 8,
				total: 15
			},
			{
				index: 90,
				type: 'reveal',
				board: [
					[
						{
							name: 'L4',
						},
						{
							name: 'H3',
						},
						{
							name: 'L2',
						},
						{
							name: 'H2',
						},
						{
							name: 'H1',
						},
						{
							name: 'L2',
						},
						{
							name: 'L1',
						},
						{
							name: 'L1',
						},
						{
							name: 'L2',
						}
					],
					[
						{
							name: 'L3',
						},
						{
							name: 'L3',
						},
						{
							name: 'H4',
						},
						{
							name: 'H3',
						},
						{
							name: 'L2',
						},
						{
							name: 'L2',
						},
						{
							name: 'L2',
						},
						{
							name: 'W',
							wild: true,
						},
						{
							name: 'L4',
						}
					],
					[
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
							name: 'L3',
						},
						{
							name: 'L1',
						},
						{
							name: 'L1',
						},
						{
							name: 'H2',
						},
						{
							name: 'L2',
						}
					],
					[
						{
							name: 'L2',
						},
						{
							name: 'L3',
						},
						{
							name: 'H3',
						},
						{
							name: 'H3',
						},
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
							name: 'W',
							wild: true,
						},
						{
							name: 'H3',
						}
					],
					[
						{
							name: 'L3',
						},
						{
							name: 'W',
							wild: true,
						},
						{
							name: 'H2',
						},
						{
							name: 'H2',
						},
						{
							name: 'W',
							wild: true,
						},
						{
							name: 'L4',
						},
						{
							name: 'L4',
						},
						{
							name: 'H3',
						},
						{
							name: 'L1',
						}
					],
					[
						{
							name: 'L3',
						},
						{
							name: 'L4',
						},
						{
							name: 'L3',
						},
						{
							name: 'S',
							scatter: true,
						},
						{
							name: 'H3',
						},
						{
							name: 'H3',
						},
						{
							name: 'S',
							scatter: true,
						},
						{
							name: 'L3',
						},
						{
							name: 'L3',
						}
					],
					[
						{
							name: 'L1',
						},
						{
							name: 'L2',
						},
						{
							name: 'W',
							wild: true,
						},
						{
							name: 'H4',
						},
						{
							name: 'L1',
						},
						{
							name: 'H2',
						},
						{
							name: 'H2',
						},
						{
							name: 'L1',
						},
						{
							name: 'L2',
						}
					]
				],
				paddingPositions: [129, 234, 70, 52, 9, 206, 294],
				gameType: 'freegame',
				anticipation: [0, 0, 0, 0, 0, 0, 0]
			},
			{
				index: 91,
				type: 'winInfo',
				totalWin: 320,
				wins: [
					{
						symbol: 'L2',
						clusterSize: 5,
						win: 320,
						positions: [
							{ reel: 0, row: 5 },
							{ reel: 1, row: 5 },
							{ reel: 1, row: 4 },
							{ reel: 1, row: 6 },
							{ reel: 1, row: 7 }
						],
						meta: {
							globalMult: 1,
							clusterMult: 16,
							winWithoutMult: 20,
							overlay: { reel: 0, row: 5 }
						}
					}
				]
			},
			{
				index: 92,
				type: 'updateGrid',
				gridMultipliers: [
					[2, 4, 16, 4, 2, 1, 1],
					[1, 2, 16, 16, 8, 4, 4],
					[1, 4, 32, 16, 16, 1, 2],
					[1, 16, 8, 8, 8, 2, 2],
					[2, 16, 32, 8, 8, 8, 4],
					[4, 8, 4, 2, 2, 8, 2],
					[1, 4, 2, 2, 2, 4, 2]
				]
			},
			{
				index: 93,
				type: 'updateTumbleWin',
				amount: 13969
			},
			{
				index: 94,
				type: 'tumbleBoard',
				newSymbols: [
					[
						{ name: 'H2' }
					],
					[
						{ name: 'L2' },
						{ name: 'L3' },
						{ name: 'H1' },
						{ name: 'L1' }
					],
					[
					],
					[
					],
					[
					],
					[
					],
					[
					]
				],
				explodingSymbols: [
					{ reel: 0, row: 5 },
					{ reel: 1, row: 4 },
					{ reel: 1, row: 5 },
					{ reel: 1, row: 6 },
					{ reel: 1, row: 7 }
				]
			},
			{
				index: 95,
				type: 'setWin',
				amount: 13969,
				winLevel: 4
			},
			{
				index: 96,
				type: 'setTotalWin',
				amount: 13969
			},
			{
				index: 97,
				type: 'freeSpinEnd',
				amount: 13969,
				winLevel: 6
			},
			{
				index: 98,
				type: 'setTotalWin',
				amount: 13969
			},
			{
				index: 99,
				type: 'finalWin',
				amount: 13969
			}
		],
		criteria: 'freegame',
		baseGameWins: 0,
		freeGameWins: 1.3969999999999998
	},
	{
		id: 4,
		payoutMultiplier: 7.5,
		events: [
			{
				index: 0,
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
							name: 'L2',
						},
						{
							name: 'L4',
						},
						{
							name: 'L3',
						},
						{
							name: 'L3',
						},
						{
							name: 'L3',
						},
						{
							name: 'L3',
						}
					],
					[
						{
							name: 'L3',
						},
						{
							name: 'L2',
						},
						{
							name: 'S',
							scatter: true,
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
						{
							name: 'L4',
						},
						{
							name: 'L2',
						},
						{
							name: 'L2',
						}
					],
					[
						{
							name: 'H4',
						},
						{
							name: 'H1',
						},
						{
							name: 'H4',
						},
						{
							name: 'H1',
						},
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
							name: 'L4',
						},
						{
							name: 'H1',
						}
					],
					[
						{
							name: 'L3',
						},
						{
							name: 'L2',
						},
						{
							name: 'S',
							scatter: true,
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
						{
							name: 'L2',
						},
						{
							name: 'L2',
						},
						{
							name: 'L4',
						}
					],
					[
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
						{
							name: 'H3',
						},
						{
							name: 'L2',
						},
						{
							name: 'L1',
						},
						{
							name: 'H4',
						}
					],
					[
						{
							name: 'L3',
						},
						{
							name: 'H1',
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
						{
							name: 'H1',
						},
						{
							name: 'L1',
						},
						{
							name: 'H1',
						},
						{
							name: 'L2',
						}
					],
					[
						{
							name: 'L2',
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
							name: 'L3',
						},
						{
							name: 'S',
							scatter: true,
						},
						{
							name: 'L1',
						},
						{
							name: 'L2',
						},
						{
							name: 'L3',
						}
					]
				],
				paddingPositions: [68, 274, 48, 93, 224, 54, 95],
				gameType: 'basegame',
				anticipation: [0, 0, 0, 0, 0, 0, 0]
			},
			{
				index: 1,
				type: 'updateGrid',
				gridMultipliers: [
					[1, 1, 1, 1, 1, 1, 1],
					[1, 1, 1, 1, 1, 1, 1],
					[1, 1, 1, 1, 1, 1, 1],
					[1, 1, 1, 1, 1, 1, 1],
					[1, 1, 1, 1, 1, 1, 1],
					[1, 1, 1, 1, 1, 1, 1],
					[1, 1, 1, 1, 1, 1, 1]
				]
			},
			{
				index: 2,
				type: 'freeSpinTrigger',
				totalFs: 8,
				positions: [
					{ reel: 1, row: 2 },
					{ reel: 3, row: 2 },
					{ reel: 6, row: 5 }
				]
			},
			{
				index: 3,
				type: 'glyphInit',
				glyphPositions: [
					{ reel: 0, row: 1 },
					{ reel: 0, row: 3 },
					{ reel: 0, row: 6 },
					{ reel: 1, row: 6 },
					{ reel: 2, row: 1 },
					{ reel: 2, row: 2 },
					{ reel: 2, row: 7 },
					{ reel: 3, row: 7 },
					{ reel: 4, row: 7 },
					{ reel: 5, row: 1 },
					{ reel: 5, row: 2 },
					{ reel: 5, row: 5 },
					{ reel: 6, row: 7 }
				],
				totalGlyphs: 13
			},
			{
				index: 4,
				type: 'updateFreeSpin',
				amount: 1,
				total: 1
			},
			{
				index: 5,
				type: 'reveal',
				board: [
					[
						{
							name: 'L1',
						},
						{
							name: 'W',
							wild: true,
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
						{
							name: 'L3',
						},
						{
							name: 'L1',
						},
						{
							name: 'L2',
						},
						{
							name: 'L1',
						}
					],
					[
						{
							name: 'L1',
						},
						{
							name: 'H4',
						},
						{
							name: 'H3',
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
							name: 'L1',
						},
						{
							name: 'L1',
						},
						{
							name: 'L4',
						}
					],
					[
						{
							name: 'H3',
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
							name: 'H3',
						},
						{
							name: 'H1',
						},
						{
							name: 'L2',
						},
						{
							name: 'H3',
						},
						{
							name: 'L3',
						}
					],
					[
						{
							name: 'H3',
						},
						{
							name: 'H3',
						},
						{
							name: 'H3',
						},
						{
							name: 'L4',
						},
						{
							name: 'L4',
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
						}
					],
					[
						{
							name: 'L4',
						},
						{
							name: 'H1',
						},
						{
							name: 'H3',
						},
						{
							name: 'H3',
						},
						{
							name: 'L3',
						},
						{
							name: 'L3',
						},
						{
							name: 'L2',
						},
						{
							name: 'H3',
						},
						{
							name: 'L2',
						}
					],
					[
						{
							name: 'H1',
						},
						{
							name: 'L2',
						},
						{
							name: 'L2',
						},
						{
							name: 'L1',
						},
						{
							name: 'W',
							wild: true,
						},
						{
							name: 'H1',
						},
						{
							name: 'H4',
						},
						{
							name: 'H3',
						},
						{
							name: 'L3',
						}
					],
					[
						{
							name: 'H1',
						},
						{
							name: 'H4',
						},
						{
							name: 'H4',
						},
						{
							name: 'L1',
						},
						{
							name: 'L1',
						},
						{
							name: 'L4',
						},
						{
							name: 'L4',
						},
						{
							name: 'H4',
						},
						{
							name: 'H1',
						}
					]
				],
				paddingPositions: [270, 18, 272, 39, 135, 48, 32],
				gameType: 'freegame',
				anticipation: [0, 0, 0, 0, 0, 0, 0]
			},
			{
				index: 6,
				type: 'updateFreeSpin',
				amount: 2,
				total: 3
			},
			{
				index: 7,
				type: 'reveal',
				board: [
					[
						{
							name: 'L4',
						},
						{
							name: 'H3',
						},
						{
							name: 'H4',
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
							name: 'H1',
						},
						{
							name: 'L1',
						}
					],
					[
						{
							name: 'L2',
						},
						{
							name: 'L3',
						},
						{
							name: 'H1',
						},
						{
							name: 'H1',
						},
						{
							name: 'H1',
						},
						{
							name: 'H1',
						},
						{
							name: 'H2',
						},
						{
							name: 'H3',
						},
						{
							name: 'L1',
						}
					],
					[
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
							name: 'L2',
						},
						{
							name: 'L4',
						}
					],
					[
						{
							name: 'L4',
						},
						{
							name: 'H2',
						},
						{
							name: 'L1',
						},
						{
							name: 'L1',
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
							name: 'L3',
						},
						{
							name: 'L1',
						}
					],
					[
						{
							name: 'L4',
						},
						{
							name: 'H3',
						},
						{
							name: 'L2',
						},
						{
							name: 'H2',
						},
						{
							name: 'H3',
						},
						{
							name: 'H3',
						},
						{
							name: 'L4',
						},
						{
							name: 'L4',
						},
						{
							name: 'L4',
						}
					],
					[
						{
							name: 'H4',
						},
						{
							name: 'L3',
						},
						{
							name: 'H3',
						},
						{
							name: 'H3',
						},
						{
							name: 'H2',
						},
						{
							name: 'H2',
						},
						{
							name: 'W',
							wild: true,
						},
						{
							name: 'L1',
						},
						{
							name: 'H1',
						}
					],
					[
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
							name: 'L3',
						},
						{
							name: 'L3',
						},
						{
							name: 'L1',
						},
						{
							name: 'H4',
						},
						{
							name: 'H3',
						},
						{
							name: 'L1',
						}
					]
				],
				paddingPositions: [24, 245, 128, 293, 272, 212, 22],
				gameType: 'freegame',
				anticipation: [0, 0, 0, 0, 0, 0, 0]
			},
			{
				index: 8,
				type: 'updateFreeSpin',
				amount: 3,
				total: 5
			},
			{
				index: 9,
				type: 'reveal',
				board: [
					[
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
							name: 'H1',
						},
						{
							name: 'H4',
						},
						{
							name: 'H1',
						},
						{
							name: 'H4',
						},
						{
							name: 'H3',
						},
						{
							name: 'L3',
						}
					],
					[
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
							name: 'L2',
						},
						{
							name: 'W',
							wild: true,
						},
						{
							name: 'L2',
						},
						{
							name: 'L4',
						},
						{
							name: 'L2',
						},
						{
							name: 'L2',
						}
					],
					[
						{
							name: 'L2',
						},
						{
							name: 'H4',
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
							name: 'H4',
						},
						{
							name: 'L4',
						},
						{
							name: 'L4',
						},
						{
							name: 'L4',
						}
					],
					[
						{
							name: 'H1',
						},
						{
							name: 'H2',
						},
						{
							name: 'H2',
						},
						{
							name: 'L2',
						},
						{
							name: 'L2',
						},
						{
							name: 'L1',
						},
						{
							name: 'L1',
						},
						{
							name: 'W',
							wild: true,
						},
						{
							name: 'W',
							wild: true,
						}
					],
					[
						{
							name: 'L1',
						},
						{
							name: 'L3',
						},
						{
							name: 'H3',
						},
						{
							name: 'H3',
						},
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
							name: 'L2',
						},
						{
							name: 'L3',
						}
					],
					[
						{
							name: 'H3',
						},
						{
							name: 'L3',
						},
						{
							name: 'H1',
						},
						{
							name: 'L1',
						},
						{
							name: 'H3',
						},
						{
							name: 'L4',
						},
						{
							name: 'L1',
						},
						{
							name: 'L2',
						},
						{
							name: 'L3',
						}
					],
					[
						{
							name: 'L4',
						},
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
							name: 'L3',
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
						}
					]
				],
				paddingPositions: [157, 237, 260, 141, 0, 4, 242],
				gameType: 'freegame',
				anticipation: [0, 0, 0, 0, 0, 0, 0]
			},
			{
				index: 10,
				type: 'winInfo',
				totalWin: 30,
				wins: [
					{
						symbol: 'L2',
						clusterSize: 6,
						win: 30,
						positions: [
							{ reel: 0, row: 1 },
							{ reel: 1, row: 1 },
							{ reel: 1, row: 2 },
							{ reel: 1, row: 3 },
							{ reel: 1, row: 4 },
							{ reel: 1, row: 5 }
						],
						meta: {
							globalMult: 1,
							clusterMult: 1,
							winWithoutMult: 30,
							overlay: { reel: 0, row: 1 }
						}
					}
				]
			},
			{
				index: 11,
				type: 'glyphActivation',
				position: { reel: 0, row: 1 },
				activatedCount: 1,
				totalGlyphs: 13
			},
			{
				index: 12,
				type: 'updateGrid',
				gridMultipliers: [
					[2, 1, 1, 1, 1, 1, 1],
					[2, 2, 2, 2, 2, 1, 1],
					[1, 1, 1, 1, 1, 1, 1],
					[1, 1, 1, 1, 1, 1, 1],
					[1, 1, 1, 1, 1, 1, 1],
					[1, 1, 1, 1, 1, 1, 1],
					[1, 1, 1, 1, 1, 1, 1]
				]
			},
			{
				index: 13,
				type: 'updateTumbleWin',
				amount: 30
			},
			{
				index: 14,
				type: 'tumbleBoard',
				newSymbols: [
					[
						{ name: 'L1' }
					],
					[
						{ name: 'L3' },
						{ name: 'L4' },
						{ name: 'L3' },
						{ name: 'H2' },
						{ name: 'L2' }
					],
					[
					],
					[
					],
					[
					],
					[
					],
					[
					]
				],
				explodingSymbols: [
					{ reel: 0, row: 1 },
					{ reel: 1, row: 1 },
					{ reel: 1, row: 2 },
					{ reel: 1, row: 3 },
					{ reel: 1, row: 4 },
					{ reel: 1, row: 5 }
				]
			},
			{
				index: 15,
				type: 'setWin',
				amount: 30,
				winLevel: 2
			},
			{
				index: 16,
				type: 'setTotalWin',
				amount: 30
			},
			{
				index: 17,
				type: 'updateFreeSpin',
				amount: 4,
				total: 7
			},
			{
				index: 18,
				type: 'reveal',
				board: [
					[
						{
							name: 'L3',
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
							name: 'L2',
						},
						{
							name: 'L1',
						},
						{
							name: 'H3',
						},
						{
							name: 'H1',
						}
					],
					[
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
							name: 'W',
							wild: true,
						},
						{
							name: 'L4',
						},
						{
							name: 'L4',
						},
						{
							name: 'H4',
						},
						{
							name: 'H3',
						}
					],
					[
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
							name: 'H3',
						},
						{
							name: 'W',
							wild: true,
						},
						{
							name: 'L2',
						},
						{
							name: 'L3',
						},
						{
							name: 'H3',
						},
						{
							name: 'H4',
						}
					],
					[
						{
							name: 'S',
							scatter: true,
						},
						{
							name: 'L4',
						},
						{
							name: 'L4',
						},
						{
							name: 'L2',
						},
						{
							name: 'L1',
						},
						{
							name: 'L1',
						},
						{
							name: 'H2',
						},
						{
							name: 'H3',
						},
						{
							name: 'L1',
						}
					],
					[
						{
							name: 'L3',
						},
						{
							name: 'H2',
						},
						{
							name: 'H3',
						},
						{
							name: 'L3',
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
							name: 'L3',
						},
						{
							name: 'L3',
						}
					],
					[
						{
							name: 'L1',
						},
						{
							name: 'L1',
						},
						{
							name: 'H2',
						},
						{
							name: 'L1',
						},
						{
							name: 'H1',
						},
						{
							name: 'W',
							wild: true,
						},
						{
							name: 'W',
							wild: true,
						},
						{
							name: 'W',
							wild: true,
						},
						{
							name: 'L2',
						}
					],
					[
						{
							name: 'H4',
						},
						{
							name: 'L2',
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
							name: 'L2',
						},
						{
							name: 'L2',
						},
						{
							name: 'L3',
						},
						{
							name: 'L3',
						}
					]
				],
				paddingPositions: [135, 133, 42, 234, 38, 182, 58],
				gameType: 'freegame',
				anticipation: [0, 0, 0, 0, 0, 0, 0]
			},
			{
				index: 19,
				type: 'winInfo',
				totalWin: 240,
				wins: [
					{
						symbol: 'L2',
						clusterSize: 7,
						win: 240,
						positions: [
							{ reel: 0, row: 4 },
							{ reel: 1, row: 4 },
							{ reel: 0, row: 5 },
							{ reel: 2, row: 4 },
							{ reel: 1, row: 3 },
							{ reel: 2, row: 5 },
							{ reel: 1, row: 2 }
						],
						meta: {
							globalMult: 1,
							clusterMult: 6,
							winWithoutMult: 40,
							overlay: { reel: 0, row: 4 }
						}
					}
				]
			},
			{
				index: 20,
				type: 'updateGrid',
				gridMultipliers: [
					[2, 1, 1, 2, 2, 1, 1],
					[2, 4, 4, 4, 2, 1, 1],
					[1, 1, 1, 2, 2, 1, 1],
					[1, 1, 1, 1, 1, 1, 1],
					[1, 1, 1, 1, 1, 1, 1],
					[1, 1, 1, 1, 1, 1, 1],
					[1, 1, 1, 1, 1, 1, 1]
				]
			},
			{
				index: 21,
				type: 'updateTumbleWin',
				amount: 270
			},
			{
				index: 22,
				type: 'tumbleBoard',
				newSymbols: [
					[
						{ name: 'L2' },
						{ name: 'H1' }
					],
					[
						{ name: 'H4' },
						{ name: 'H3' },
						{ name: 'W' }
					],
					[
						{ name: 'H3' },
						{ name: 'L3' }
					],
					[
					],
					[
					],
					[
					],
					[
					]
				],
				explodingSymbols: [
					{ reel: 0, row: 4 },
					{ reel: 0, row: 5 },
					{ reel: 1, row: 2 },
					{ reel: 1, row: 3 },
					{ reel: 1, row: 4 },
					{ reel: 2, row: 4 },
					{ reel: 2, row: 5 }
				]
			},
			{
				index: 23,
				type: 'setWin',
				amount: 270,
				winLevel: 2
			},
			{
				index: 24,
				type: 'setTotalWin',
				amount: 270
			},
			{
				index: 25,
				type: 'updateFreeSpin',
				amount: 5,
				total: 9
			},
			{
				index: 26,
				type: 'reveal',
				board: [
					[
						{
							name: 'L3',
						},
						{
							name: 'H4',
						},
						{
							name: 'H3',
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
							name: 'L2',
						},
						{
							name: 'H1',
						},
						{
							name: 'L3',
						}
					],
					[
						{
							name: 'L4',
						},
						{
							name: 'H1',
						},
						{
							name: 'H1',
						},
						{
							name: 'H2',
						},
						{
							name: 'H3',
						},
						{
							name: 'H3',
						},
						{
							name: 'L4',
						},
						{
							name: 'L4',
						},
						{
							name: 'L4',
						}
					],
					[
						{
							name: 'L3',
						},
						{
							name: 'H1',
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
						{
							name: 'L3',
						},
						{
							name: 'L4',
						},
						{
							name: 'H4',
						},
						{
							name: 'H4',
						}
					],
					[
						{
							name: 'H4',
						},
						{
							name: 'L2',
						},
						{
							name: 'L1',
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
							name: 'L1',
						},
						{
							name: 'L2',
						},
						{
							name: 'L4',
						}
					],
					[
						{
							name: 'L2',
						},
						{
							name: 'H1',
						},
						{
							name: 'L1',
						},
						{
							name: 'L1',
						},
						{
							name: 'H1',
						},
						{
							name: 'H1',
						},
						{
							name: 'H1',
						},
						{
							name: 'L1',
						},
						{
							name: 'L2',
						}
					],
					[
						{
							name: 'L3',
						},
						{
							name: 'H1',
						},
						{
							name: 'H1',
						},
						{
							name: 'H4',
						},
						{
							name: 'H4',
						},
						{
							name: 'H3',
						},
						{
							name: 'L2',
						},
						{
							name: 'L2',
						},
						{
							name: 'L2',
						}
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
							name: 'H2',
						},
						{
							name: 'H4',
						},
						{
							name: 'H1',
						},
						{
							name: 'H4',
						},
						{
							name: 'L1',
						}
					]
				],
				paddingPositions: [282, 248, 158, 21, 68, 56, 149],
				gameType: 'freegame',
				anticipation: [0, 0, 0, 0, 0, 0, 0]
			},
			{
				index: 27,
				type: 'winInfo',
				totalWin: 30,
				wins: [
					{
						symbol: 'L1',
						clusterSize: 5,
						win: 30,
						positions: [
							{ reel: 3, row: 2 },
							{ reel: 4, row: 2 },
							{ reel: 3, row: 3 },
							{ reel: 4, row: 3 },
							{ reel: 3, row: 4 }
						],
						meta: {
							globalMult: 1,
							clusterMult: 1,
							winWithoutMult: 30,
							overlay: { reel: 3, row: 2 }
						}
					}
				]
			},
			{
				index: 28,
				type: 'updateGrid',
				gridMultipliers: [
					[2, 1, 1, 2, 2, 1, 1],
					[2, 4, 4, 4, 2, 1, 1],
					[1, 1, 1, 2, 2, 1, 1],
					[1, 2, 2, 2, 1, 1, 1],
					[1, 2, 2, 1, 1, 1, 1],
					[1, 1, 1, 1, 1, 1, 1],
					[1, 1, 1, 1, 1, 1, 1]
				]
			},
			{
				index: 29,
				type: 'updateTumbleWin',
				amount: 300
			},
			{
				index: 30,
				type: 'tumbleBoard',
				newSymbols: [
					[
					],
					[
					],
					[
					],
					[
						{ name: 'L2' },
						{ name: 'H4' },
						{ name: 'L4' }
					],
					[
						{ name: 'H3' },
						{ name: 'H4' }
					],
					[
					],
					[
					]
				],
				explodingSymbols: [
					{ reel: 3, row: 2 },
					{ reel: 3, row: 3 },
					{ reel: 3, row: 4 },
					{ reel: 4, row: 2 },
					{ reel: 4, row: 3 }
				]
			},
			{
				index: 31,
				type: 'setWin',
				amount: 300,
				winLevel: 2
			},
			{
				index: 32,
				type: 'setTotalWin',
				amount: 300
			},
			{
				index: 33,
				type: 'updateFreeSpin',
				amount: 6,
				total: 11
			},
			{
				index: 34,
				type: 'reveal',
				board: [
					[
						{
							name: 'L1',
						},
						{
							name: 'L2',
						},
						{
							name: 'H2',
						},
						{
							name: 'H1',
						},
						{
							name: 'L2',
						},
						{
							name: 'L1',
						},
						{
							name: 'L1',
						},
						{
							name: 'H4',
						},
						{
							name: 'L3',
						}
					],
					[
						{
							name: 'L2',
						},
						{
							name: 'H1',
						},
						{
							name: 'H1',
						},
						{
							name: 'L2',
						},
						{
							name: 'H4',
						},
						{
							name: 'H2',
						},
						{
							name: 'L4',
						},
						{
							name: 'H4',
						},
						{
							name: 'L1',
						}
					],
					[
						{
							name: 'L1',
						},
						{
							name: 'L2',
						},
						{
							name: 'H1',
						},
						{
							name: 'H1',
						},
						{
							name: 'H2',
						},
						{
							name: 'L3',
						},
						{
							name: 'H2',
						},
						{
							name: 'L2',
						},
						{
							name: 'L4',
						}
					],
					[
						{
							name: 'H4',
						},
						{
							name: 'H2',
						},
						{
							name: 'H3',
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
						{
							name: 'L2',
						},
						{
							name: 'H4',
						},
						{
							name: 'H3',
						}
					],
					[
						{
							name: 'H1',
						},
						{
							name: 'L3',
						},
						{
							name: 'L1',
						},
						{
							name: 'H1',
						},
						{
							name: 'H1',
						},
						{
							name: 'L2',
						},
						{
							name: 'L2',
						},
						{
							name: 'H4',
						},
						{
							name: 'L3',
						}
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
							name: 'H3',
						},
						{
							name: 'H4',
						},
						{
							name: 'L1',
						},
						{
							name: 'L1',
						},
						{
							name: 'L3',
						}
					],
					[
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
							name: 'L4',
						},
						{
							name: 'H1',
						},
						{
							name: 'H4',
						},
						{
							name: 'L2',
						},
						{
							name: 'L1',
						},
						{
							name: 'L4',
						}
					]
				],
				paddingPositions: [130, 1, 283, 222, 126, 21, 109],
				gameType: 'freegame',
				anticipation: [0, 0, 0, 0, 0, 0, 0]
			},
			{
				index: 35,
				type: 'updateFreeSpin',
				amount: 7,
				total: 13
			},
			{
				index: 36,
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
							name: 'L3',
						},
						{
							name: 'L4',
						},
						{
							name: 'H1',
						},
						{
							name: 'H1',
						},
						{
							name: 'L4',
						},
						{
							name: 'H2',
						},
						{
							name: 'L1',
						}
					],
					[
						{
							name: 'L4',
						},
						{
							name: 'L1',
						},
						{
							name: 'H2',
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
							name: 'L4',
						},
						{
							name: 'L1',
						},
						{
							name: 'L2',
						}
					],
					[
						{
							name: 'L2',
						},
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
							name: 'H4',
						},
						{
							name: 'L1',
						},
						{
							name: 'L3',
						},
						{
							name: 'H2',
						},
						{
							name: 'L3',
						}
					],
					[
						{
							name: 'L3',
						},
						{
							name: 'L1',
						},
						{
							name: 'H1',
						},
						{
							name: 'L2',
						},
						{
							name: 'L4',
						},
						{
							name: 'L4',
						},
						{
							name: 'H3',
						},
						{
							name: 'L1',
						},
						{
							name: 'H4',
						}
					],
					[
						{
							name: 'H4',
						},
						{
							name: 'H2',
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
							name: 'L3',
						},
						{
							name: 'L1',
						},
						{
							name: 'H3',
						},
						{
							name: 'L2',
						}
					],
					[
						{
							name: 'H1',
						},
						{
							name: 'H2',
						},
						{
							name: 'L3',
						},
						{
							name: 'L3',
						},
						{
							name: 'H4',
						},
						{
							name: 'H3',
						},
						{
							name: 'H3',
						},
						{
							name: 'L2',
						},
						{
							name: 'L4',
						}
					],
					[
						{
							name: 'L2',
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
							name: 'L2',
						},
						{
							name: 'L2',
						},
						{
							name: 'L3',
						},
						{
							name: 'L3',
						},
						{
							name: 'L2',
						}
					]
				],
				paddingPositions: [122, 181, 26, 178, 18, 151, 59],
				gameType: 'freegame',
				anticipation: [0, 0, 0, 0, 0, 0, 0]
			},
			{
				index: 37,
				type: 'updateFreeSpin',
				amount: 8,
				total: 15
			},
			{
				index: 38,
				type: 'reveal',
				board: [
					[
						{
							name: 'L4',
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
							name: 'H4',
						},
						{
							name: 'H3',
						},
						{
							name: 'L4',
						},
						{
							name: 'L2',
						},
						{
							name: 'L1',
						}
					],
					[
						{
							name: 'L2',
						},
						{
							name: 'H3',
						},
						{
							name: 'L2',
						},
						{
							name: 'L2',
						},
						{
							name: 'L2',
						},
						{
							name: 'W',
							wild: true,
						},
						{
							name: 'L2',
						},
						{
							name: 'L4',
						},
						{
							name: 'L1',
						}
					],
					[
						{
							name: 'H1',
						},
						{
							name: 'L4',
						},
						{
							name: 'L4',
						},
						{
							name: 'L4',
						},
						{
							name: 'L3',
						},
						{
							name: 'H2',
						},
						{
							name: 'H3',
						},
						{
							name: 'H3',
						},
						{
							name: 'H1',
						}
					],
					[
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
							name: 'L2',
						},
						{
							name: 'L2',
						},
						{
							name: 'L1',
						},
						{
							name: 'L1',
						},
						{
							name: 'L1',
						},
						{
							name: 'H1',
						}
					],
					[
						{
							name: 'L1',
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
							name: 'L2',
						},
						{
							name: 'L1',
						},
						{
							name: 'L1',
						},
						{
							name: 'H4',
						},
						{
							name: 'H1',
						}
					],
					[
						{
							name: 'L4',
						},
						{
							name: 'H2',
						},
						{
							name: 'L2',
						},
						{
							name: 'H4',
						},
						{
							name: 'L2',
						},
						{
							name: 'H3',
						},
						{
							name: 'H3',
						},
						{
							name: 'L4',
						},
						{
							name: 'L3',
						}
					],
					[
						{
							name: 'S',
							scatter: true,
						},
						{
							name: 'L3',
						},
						{
							name: 'H4',
						},
						{
							name: 'H4',
						},
						{
							name: 'H1',
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
						{
							name: 'L1',
						}
					]
				],
				paddingPositions: [287, 236, 112, 18, 97, 101, 100],
				gameType: 'freegame',
				anticipation: [0, 0, 0, 0, 0, 0, 0]
			},
			{
				index: 39,
				type: 'winInfo',
				totalWin: 450,
				wins: [
					{
						symbol: 'L2',
						clusterSize: 6,
						win: 420,
						positions: [
							{ reel: 0, row: 3 },
							{ reel: 1, row: 3 },
							{ reel: 1, row: 2 },
							{ reel: 1, row: 4 },
							{ reel: 1, row: 5 },
							{ reel: 1, row: 6 }
						],
						meta: {
							globalMult: 1,
							clusterMult: 14,
							winWithoutMult: 30,
							overlay: { reel: 0, row: 3 }
						}
					},
					{
						symbol: 'L1',
						clusterSize: 5,
						win: 30,
						positions: [
							{ reel: 3, row: 5 },
							{ reel: 4, row: 5 },
							{ reel: 3, row: 6 },
							{ reel: 4, row: 6 },
							{ reel: 3, row: 7 }
						],
						meta: {
							globalMult: 1,
							clusterMult: 1,
							winWithoutMult: 30,
							overlay: { reel: 3, row: 5 }
						}
					}
				]
			},
			{
				index: 40,
				type: 'glyphActivation',
				position: { reel: 0, row: 3 },
				activatedCount: 2,
				totalGlyphs: 13
			},
			{
				index: 41,
				type: 'glyphActivation',
				position: { reel: 1, row: 6 },
				activatedCount: 3,
				totalGlyphs: 13
			},
			{
				index: 42,
				type: 'glyphActivation',
				position: { reel: 3, row: 7 },
				activatedCount: 4,
				totalGlyphs: 13
			},
			{
				index: 43,
				type: 'updateGrid',
				gridMultipliers: [
					[2, 1, 2, 2, 2, 1, 1],
					[2, 8, 8, 8, 4, 2, 1],
					[1, 1, 1, 2, 2, 1, 1],
					[1, 2, 2, 2, 2, 2, 2],
					[1, 2, 2, 1, 2, 2, 1],
					[1, 1, 1, 1, 1, 1, 1],
					[1, 1, 1, 1, 1, 1, 1]
				]
			},
			{
				index: 44,
				type: 'updateTumbleWin',
				amount: 750
			},
			{
				index: 45,
				type: 'tumbleBoard',
				newSymbols: [
					[
						{ name: 'L4' }
					],
					[
						{ name: 'L1' },
						{ name: 'L1' },
						{ name: 'L2' },
						{ name: 'L3' },
						{ name: 'L4' }
					],
					[
					],
					[
						{ name: 'L1' },
						{ name: 'L3' },
						{ name: 'H1' }
					],
					[
						{ name: 'L2' },
						{ name: 'L1' }
					],
					[
					],
					[
					]
				],
				explodingSymbols: [
					{ reel: 0, row: 3 },
					{ reel: 1, row: 2 },
					{ reel: 1, row: 3 },
					{ reel: 1, row: 4 },
					{ reel: 1, row: 5 },
					{ reel: 1, row: 6 },
					{ reel: 3, row: 5 },
					{ reel: 3, row: 6 },
					{ reel: 3, row: 7 },
					{ reel: 4, row: 5 },
					{ reel: 4, row: 6 }
				]
			},
			{
				index: 46,
				type: 'setWin',
				amount: 750,
				winLevel: 2
			},
			{
				index: 47,
				type: 'setTotalWin',
				amount: 750
			},
			{
				index: 48,
				type: 'freeSpinEnd',
				amount: 750,
				winLevel: 5
			},
			{
				index: 49,
				type: 'setTotalWin',
				amount: 750
			},
			{
				index: 50,
				type: 'finalWin',
				amount: 750
			}
		],
		criteria: 'freegame',
		baseGameWins: 0,
		freeGameWins: 0.075
	}
];
