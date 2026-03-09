// Arctic Clusters — Bonus mode storybook: Retrigger on first free spin
// Book 3009: 22.6x payout, retrigger awards +5 spins on spin 1
// Event [19] freeSpinRetrigger occurs immediately after first free spin tumbles

export default [
	{
		baseGameWins: 0,
		criteria: 'freegame',
		events: [
			{
				cost: 10000,
				index: 0,
				totalFs: 8,
				type: 'buyBonusTrigger',
			},
			{
				anticipation: [
					0,
					0,
					0,
					0,
					0,
					1,
					0,
				],
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
							name: 'L4',
						},
						{
							name: 'L4',
						},
						{
							name: 'H2',
						},
						{
							aurora: true,
							name: 'L4',
						},
						{
							name: 'S',
							scatter: true,
						},
						{
							name: 'L1',
						},
					],
					[
						{
							name: 'L1',
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
							name: 'L4',
						},
						{
							name: 'L1',
						},
						{
							name: 'L3',
						},
						{
							aurora: true,
							name: 'L4',
						},
						{
							name: 'L1',
						},
					],
					[
						{
							name: 'L1',
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
							name: 'S',
							scatter: true,
						},
						{
							name: 'H4',
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
					],
					[
						{
							name: 'L1',
						},
						{
							aurora: true,
							name: 'L1',
						},
						{
							name: 'L4',
						},
						{
							name: 'H4',
						},
						{
							aurora: true,
							name: 'L2',
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
							name: 'L1',
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
							name: 'H3',
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
							name: 'L1',
						},
						{
							name: 'H4',
						},
						{
							name: 'L1',
						},
					],
					[
						{
							name: 'L1',
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
							name: 'L3',
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
							name: 'L1',
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
							name: 'L3',
						},
						{
							name: 'L3',
						},
						{
							name: 'H2',
						},
						{
							name: 'S',
							scatter: true,
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
					],
				],
				gameType: 'basegame',
				index: 1,
				paddingPositions: [
					189,
					46,
					5,
					122,
					153,
					161,
					94,
				],
				type: 'reveal',
			},
			{
				index: 2,
				positions: [
					{
						reel: 0,
						row: 6,
					},
					{
						reel: 1,
						row: 7,
					},
					{
						reel: 3,
						row: 1,
					},
					{
						reel: 3,
						row: 4,
					},
				],
				type: 'auroraReveal',
			},
			{
				index: 3,
				positions: [
					{
						reel: 0,
						row: 7,
					},
					{
						reel: 2,
						row: 4,
					},
					{
						reel: 6,
						row: 5,
					},
				],
				totalFs: 8,
				type: 'freeSpinTrigger',
			},
			{
				amount: 0,
				index: 4,
				type: 'setTotalWin',
			},
			{
				amount: 1,
				index: 5,
				total: 13,
				type: 'updateFreeSpin',
			},
			{
				anticipation: [
					0,
					0,
					0,
					0,
					0,
					0,
					1,
				],
				board: [
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
							name: 'H4',
						},
						{
							name: 'L1',
						},
					],
					[
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
							name: 'H3',
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
							name: 'L1',
						},
					],
					[
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
							name: 'H3',
						},
						{
							name: 'L3',
						},
						{
							aurora: true,
							name: 'L1',
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
					],
					[
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
						},
						{
							name: 'L3',
						},
						{
							aurora: true,
							name: 'L1',
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
					],
					[
						{
							name: 'L1',
						},
						{
							name: 'H1',
						},
						{
							name: 'S',
							scatter: true,
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
							name: 'H1',
						},
						{
							name: 'H1',
						},
						{
							name: 'L1',
						},
					],
					[
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
							name: 'H1',
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
							aurora: true,
							name: 'L1',
						},
						{
							name: 'L1',
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
							name: 'H2',
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
							name: 'L2',
						},
						{
							name: 'L2',
						},
						{
							name: 'L1',
						},
					],
				],
				gameType: 'freegame',
				index: 6,
				paddingPositions: [
					246,
					12,
					63,
					92,
					120,
					56,
					54,
				],
				type: 'reveal',
			},
			{
				index: 7,
				positions: [
					{
						reel: 2,
						row: 5,
					},
					{
						reel: 3,
						row: 5,
					},
					{
						reel: 5,
						row: 7,
					},
				],
				type: 'auroraReveal',
			},
			{
				gridMultipliers: [
					[
						1,
						1,
						1,
						1,
						1,
						1,
						1,
					],
					[
						1,
						1,
						1,
						1,
						1,
						1,
						1,
					],
					[
						1,
						1,
						1,
						1,
						1,
						1,
						1,
					],
					[
						1,
						1,
						1,
						1,
						1,
						1,
						1,
					],
					[
						1,
						1,
						1,
						1,
						1,
						1,
						1,
					],
					[
						1,
						1,
						1,
						1,
						1,
						1,
						1,
					],
					[
						1,
						1,
						1,
						1,
						1,
						1,
						1,
					],
				],
				index: 8,
				type: 'updateGrid',
			},
			{
				index: 9,
				totalWin: 140,
				type: 'winInfo',
				wins: [
					{
						clusterSize: 7,
						meta: {
							clusterMult: 1,
							globalMult: 1,
							overlay: {
								reel: 0,
								row: 3,
							},
							winWithoutMult: 140,
						},
						positions: [
							{
								reel: 0,
								row: 3,
							},
							{
								reel: 1,
								row: 3,
							},
							{
								reel: 0,
								row: 4,
							},
							{
								reel: 1,
								row: 2,
							},
							{
								reel: 0,
								row: 5,
							},
							{
								reel: 1,
								row: 1,
							},
							{
								reel: 0,
								row: 6,
							},
						],
						symbol: 'H1',
						win: 140,
					},
				],
			},
			{
				gridMultipliers: [
					[
						1,
						1,
						2,
						2,
						2,
						2,
						1,
					],
					[
						2,
						2,
						2,
						1,
						1,
						1,
						1,
					],
					[
						1,
						1,
						1,
						1,
						1,
						1,
						1,
					],
					[
						1,
						1,
						1,
						1,
						1,
						1,
						1,
					],
					[
						1,
						1,
						1,
						1,
						1,
						1,
						1,
					],
					[
						1,
						1,
						1,
						1,
						1,
						1,
						1,
					],
					[
						1,
						1,
						1,
						1,
						1,
						1,
						1,
					],
				],
				index: 10,
				type: 'updateGrid',
			},
			{
				amount: 140,
				index: 11,
				type: 'updateTumbleWin',
			},
			{
				explodingSymbols: [
					{
						reel: 0,
						row: 3,
					},
					{
						reel: 1,
						row: 3,
					},
					{
						reel: 0,
						row: 4,
					},
					{
						reel: 1,
						row: 2,
					},
					{
						reel: 0,
						row: 5,
					},
					{
						reel: 1,
						row: 1,
					},
					{
						reel: 0,
						row: 6,
					},
				],
				index: 12,
				newSymbols: [
					[
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
					],
					[
						{
							name: 'H1',
						},
						{
							name: 'H1',
						},
						{
							name: 'H3',
						},
					],
					[],
					[],
					[],
					[],
					[],
				],
				type: 'tumbleBoard',
			},
			{
				gridMultipliers: [
					[
						1,
						1,
						2,
						2,
						2,
						2,
						1,
					],
					[
						2,
						2,
						2,
						1,
						1,
						1,
						1,
					],
					[
						1,
						1,
						1,
						1,
						1,
						1,
						1,
					],
					[
						1,
						1,
						1,
						1,
						1,
						1,
						1,
					],
					[
						1,
						1,
						1,
						1,
						1,
						1,
						1,
					],
					[
						1,
						1,
						1,
						1,
						1,
						1,
						1,
					],
					[
						1,
						1,
						1,
						1,
						1,
						1,
						1,
					],
				],
				index: 13,
				type: 'updateGrid',
			},
			{
				index: 14,
				totalWin: 800,
				type: 'winInfo',
				wins: [
					{
						clusterSize: 5,
						meta: {
							clusterMult: 8,
							globalMult: 1,
							overlay: {
								reel: 0,
								row: 2,
							},
							winWithoutMult: 100,
						},
						positions: [
							{
								reel: 0,
								row: 2,
							},
							{
								reel: 1,
								row: 2,
							},
							{
								reel: 0,
								row: 3,
							},
							{
								reel: 1,
								row: 1,
							},
							{
								reel: 0,
								row: 4,
							},
						],
						symbol: 'H1',
						win: 800,
					},
				],
			},
			{
				gridMultipliers: [
					[
						1,
						2,
						4,
						4,
						2,
						2,
						1,
					],
					[
						4,
						4,
						2,
						1,
						1,
						1,
						1,
					],
					[
						1,
						1,
						1,
						1,
						1,
						1,
						1,
					],
					[
						1,
						1,
						1,
						1,
						1,
						1,
						1,
					],
					[
						1,
						1,
						1,
						1,
						1,
						1,
						1,
					],
					[
						1,
						1,
						1,
						1,
						1,
						1,
						1,
					],
					[
						1,
						1,
						1,
						1,
						1,
						1,
						1,
					],
				],
				index: 15,
				type: 'updateGrid',
			},
			{
				amount: 940,
				index: 16,
				type: 'updateTumbleWin',
			},
			{
				explodingSymbols: [
					{
						reel: 0,
						row: 2,
					},
					{
						reel: 1,
						row: 2,
					},
					{
						reel: 0,
						row: 3,
					},
					{
						reel: 1,
						row: 1,
					},
					{
						reel: 0,
						row: 4,
					},
				],
				index: 17,
				newSymbols: [
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
					],
					[
						{
							name: 'S',
							scatter: true,
						},
						{
							name: 'L2',
						},
					],
					[],
					[],
					[],
					[],
					[],
				],
				type: 'tumbleBoard',
			},
			{
				amount: 940,
				index: 18,
				type: 'setWin',
				winLevel: 0,
			},
			{
				index: 19,
				positions: [
					{
						reel: 1,
						row: 1,
					},
					{
						reel: 1,
						row: 5,
					},
					{
						reel: 4,
						row: 2,
					},
				],
				totalFs: 5,
				type: 'freeSpinRetrigger',
			},
			{
				amount: 940,
				index: 20,
				type: 'setTotalWin',
			},
			{
				amount: 2,
				index: 21,
				total: 13,
				type: 'updateFreeSpin',
			},
			{
				anticipation: [
					0,
					0,
					0,
					0,
					0,
					0,
					0,
				],
				board: [
					[
						{
							name: 'L1',
						},
						{
							name: 'H4',
						},
						{
							multiplier: 2,
							name: 'L2',
						},
						{
							multiplier: 4,
							name: 'H1',
						},
						{
							multiplier: 4,
							name: 'H3',
						},
						{
							multiplier: 2,
							name: 'L4',
						},
						{
							multiplier: 2,
							name: 'H2',
						},
						{
							name: 'H2',
						},
						{
							name: 'L1',
						},
					],
					[
						{
							name: 'L1',
						},
						{
							multiplier: 4,
							name: 'L1',
						},
						{
							multiplier: 4,
							name: 'L3',
						},
						{
							multiplier: 2,
							name: 'L4',
						},
						{
							aurora: true,
							name: 'H1',
						},
						{
							name: 'L3',
						},
						{
							aurora: true,
							name: 'L3',
						},
						{
							name: 'H1',
						},
						{
							name: 'L1',
						},
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
							name: 'S',
							scatter: true,
						},
						{
							name: 'H1',
						},
						{
							aurora: true,
							name: 'H4',
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
					],
					[
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
							aurora: true,
							name: 'L3',
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
							name: 'H3',
						},
						{
							name: 'L1',
						},
					],
					[
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
							name: 'H1',
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
							name: 'L1',
						},
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
							name: 'H1',
						},
						{
							name: 'L3',
						},
						{
							aurora: true,
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
					],
					[
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
							name: 'H2',
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
						},
						{
							name: 'L1',
						},
					],
				],
				gameType: 'freegame',
				index: 22,
				paddingPositions: [
					141,
					132,
					167,
					92,
					138,
					154,
					210,
				],
				type: 'reveal',
			},
			{
				index: 23,
				positions: [
					{
						reel: 1,
						row: 4,
					},
					{
						reel: 1,
						row: 6,
					},
					{
						reel: 2,
						row: 5,
					},
					{
						reel: 3,
						row: 3,
					},
					{
						reel: 5,
						row: 5,
					},
				],
				type: 'auroraReveal',
			},
			{
				amount: 940,
				index: 24,
				type: 'setTotalWin',
			},
			{
				amount: 3,
				index: 25,
				total: 13,
				type: 'updateFreeSpin',
			},
			{
				anticipation: [
					0,
					0,
					0,
					0,
					0,
					0,
					0,
				],
				board: [
					[
						{
							name: 'L1',
						},
						{
							name: 'H1',
						},
						{
							multiplier: 2,
							name: 'H3',
						},
						{
							multiplier: 4,
							name: 'H1',
						},
						{
							multiplier: 4,
							name: 'H4',
						},
						{
							multiplier: 2,
							name: 'L4',
						},
						{
							multiplier: 2,
							name: 'L2',
						},
						{
							name: 'H1',
						},
						{
							name: 'L1',
						},
					],
					[
						{
							name: 'L1',
						},
						{
							aurora: true,
							multiplier: 4,
							name: 'L1',
						},
						{
							multiplier: 4,
							name: 'L2',
						},
						{
							multiplier: 2,
							name: 'L1',
						},
						{
							aurora: true,
							name: 'L1',
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
							name: 'L1',
						},
					],
					[
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
							name: 'L1',
						},
						{
							name: 'S',
							scatter: true,
						},
						{
							name: 'L3',
						},
						{
							name: 'H3',
						},
						{
							aurora: true,
							name: 'H1',
						},
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
					],
					[
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
							name: 'H3',
						},
						{
							name: 'H1',
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
					],
					[
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
							name: 'H3',
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
							name: 'L1',
						},
					],
					[
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
							name: 'L1',
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
							name: 'H2',
						},
						{
							name: 'L1',
						},
					],
				],
				gameType: 'freegame',
				index: 26,
				paddingPositions: [
					78,
					122,
					30,
					36,
					53,
					16,
					117,
				],
				type: 'reveal',
			},
			{
				index: 27,
				positions: [
					{
						reel: 1,
						row: 1,
					},
					{
						reel: 1,
						row: 4,
					},
					{
						reel: 3,
						row: 4,
					},
				],
				type: 'auroraReveal',
			},
			{
				amount: 940,
				index: 28,
				type: 'setTotalWin',
			},
			{
				amount: 4,
				index: 29,
				total: 13,
				type: 'updateFreeSpin',
			},
			{
				anticipation: [
					0,
					0,
					0,
					0,
					0,
					0,
					0,
				],
				board: [
					[
						{
							name: 'L1',
						},
						{
							name: 'S',
							scatter: true,
						},
						{
							multiplier: 2,
							name: 'L1',
						},
						{
							multiplier: 4,
							name: 'H4',
						},
						{
							multiplier: 4,
							name: 'L2',
						},
						{
							multiplier: 2,
							name: 'H4',
						},
						{
							multiplier: 2,
							name: 'H1',
						},
						{
							name: 'H1',
						},
						{
							name: 'L1',
						},
					],
					[
						{
							name: 'L1',
						},
						{
							multiplier: 4,
							name: 'H3',
						},
						{
							multiplier: 4,
							name: 'H4',
						},
						{
							multiplier: 2,
							name: 'H3',
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
							aurora: true,
							name: 'H1',
						},
						{
							name: 'L1',
						},
					],
					[
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
							name: 'L3',
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
							name: 'L4',
						},
						{
							name: 'L1',
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
							name: 'L2',
						},
						{
							name: 'H2',
						},
						{
							aurora: true,
							name: 'L3',
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
							name: 'H1',
						},
						{
							name: 'L1',
						},
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
					],
					[
						{
							name: 'L1',
						},
						{
							name: 'H3',
						},
						{
							name: 'H1',
						},
						{
							aurora: true,
							name: 'L1',
						},
						{
							name: 'L4',
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
							name: 'L1',
						},
					],
				],
				gameType: 'freegame',
				index: 30,
				paddingPositions: [
					34,
					8,
					54,
					215,
					141,
					234,
					74,
				],
				type: 'reveal',
			},
			{
				index: 31,
				positions: [
					{
						reel: 1,
						row: 7,
					},
					{
						reel: 3,
						row: 4,
					},
					{
						reel: 6,
						row: 3,
					},
				],
				type: 'auroraReveal',
			},
			{
				gridMultipliers: [
					[
						1,
						2,
						4,
						4,
						2,
						2,
						1,
					],
					[
						4,
						4,
						2,
						1,
						1,
						1,
						1,
					],
					[
						1,
						1,
						1,
						1,
						1,
						1,
						1,
					],
					[
						1,
						1,
						1,
						1,
						1,
						1,
						1,
					],
					[
						1,
						1,
						1,
						1,
						1,
						1,
						1,
					],
					[
						1,
						1,
						1,
						1,
						1,
						1,
						1,
					],
					[
						1,
						1,
						1,
						1,
						1,
						1,
						1,
					],
				],
				index: 32,
				type: 'updateGrid',
			},
			{
				index: 33,
				totalWin: 200,
				type: 'winInfo',
				wins: [
					{
						clusterSize: 5,
						meta: {
							clusterMult: 2,
							globalMult: 1,
							overlay: {
								reel: 0,
								row: 6,
							},
							winWithoutMult: 100,
						},
						positions: [
							{
								reel: 0,
								row: 6,
							},
							{
								reel: 1,
								row: 6,
							},
							{
								reel: 0,
								row: 7,
							},
							{
								reel: 1,
								row: 5,
							},
							{
								reel: 1,
								row: 7,
							},
						],
						symbol: 'H1',
						win: 200,
					},
				],
			},
			{
				gridMultipliers: [
					[
						1,
						2,
						4,
						4,
						2,
						4,
						2,
					],
					[
						4,
						4,
						2,
						1,
						2,
						2,
						2,
					],
					[
						1,
						1,
						1,
						1,
						1,
						1,
						1,
					],
					[
						1,
						1,
						1,
						1,
						1,
						1,
						1,
					],
					[
						1,
						1,
						1,
						1,
						1,
						1,
						1,
					],
					[
						1,
						1,
						1,
						1,
						1,
						1,
						1,
					],
					[
						1,
						1,
						1,
						1,
						1,
						1,
						1,
					],
				],
				index: 34,
				type: 'updateGrid',
			},
			{
				amount: 200,
				index: 35,
				type: 'updateTumbleWin',
			},
			{
				cellsCollected: 1,
				index: 36,
				meterTotal: 1,
				type: 'auroraMeterUpdate',
			},
			{
				index: 37,
				positions: [
					{
						reel: 1,
						row: 7,
					},
				],
				type: 'auroraExplode',
			},
			{
				explodingSymbols: [
					{
						reel: 0,
						row: 6,
					},
					{
						reel: 1,
						row: 6,
					},
					{
						reel: 0,
						row: 7,
					},
					{
						reel: 1,
						row: 5,
					},
					{
						reel: 1,
						row: 7,
					},
				],
				index: 38,
				newSymbols: [
					[
						{
							name: 'L1',
						},
						{
							name: 'H4',
						},
					],
					[
						{
							name: 'H4',
						},
						{
							name: 'H3',
						},
						{
							name: 'H3',
						},
					],
					[],
					[],
					[],
					[],
					[],
				],
				type: 'tumbleBoard',
			},
			{
				index: 39,
				isRelease: false,
				meterAfter: 0,
				meterBefore: 0,
				position: {
					reel: 5,
					row: 7,
				},
				type: 'auroraWildPlace',
			},
			{
				index: 40,
				isRelease: false,
				meterAfter: 0,
				meterBefore: 0,
				position: {
					reel: 3,
					row: 2,
				},
				type: 'auroraWildPlace',
			},
			{
				index: 41,
				isRelease: false,
				meterAfter: 0,
				meterBefore: 0,
				position: {
					reel: 1,
					row: 4,
				},
				type: 'auroraWildPlace',
			},
			{
				amount: 200,
				index: 42,
				type: 'setWin',
				winLevel: 0,
			},
			{
				amount: 1140,
				index: 43,
				type: 'setTotalWin',
			},
			{
				amount: 5,
				index: 44,
				total: 13,
				type: 'updateFreeSpin',
			},
			{
				anticipation: [
					0,
					0,
					0,
					0,
					0,
					0,
					0,
				],
				board: [
					[
						{
							name: 'L1',
						},
						{
							name: 'L1',
						},
						{
							multiplier: 2,
							name: 'H4',
						},
						{
							multiplier: 4,
							name: 'L2',
						},
						{
							multiplier: 4,
							name: 'H4',
						},
						{
							multiplier: 2,
							name: 'H1',
						},
						{
							multiplier: 4,
							name: 'H1',
						},
						{
							multiplier: 2,
							name: 'L2',
						},
						{
							name: 'L1',
						},
					],
					[
						{
							name: 'L1',
						},
						{
							multiplier: 4,
							name: 'H2',
						},
						{
							multiplier: 4,
							name: 'L1',
						},
						{
							multiplier: 2,
							name: 'H2',
						},
						{
							name: 'H1',
						},
						{
							multiplier: 2,
							name: 'H4',
						},
						{
							multiplier: 2,
							name: 'L2',
						},
						{
							multiplier: 2,
							name: 'H4',
						},
						{
							name: 'L1',
						},
					],
					[
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
							name: 'H2',
						},
						{
							aurora: true,
							name: 'H4',
						},
						{
							name: 'H3',
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
					],
					[
						{
							name: 'L1',
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
							name: 'H2',
						},
						{
							name: 'H3',
						},
						{
							aurora: true,
							name: 'H2',
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
							name: 'L1',
						},
						{
							name: 'L4',
						},
						{
							name: 'H3',
						},
						{
							aurora: true,
							name: 'H2',
						},
						{
							name: 'H2',
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
							name: 'L1',
						},
					],
					[
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
							aurora: true,
							name: 'H3',
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
							aurora: true,
							name: 'H3',
						},
						{
							name: 'L1',
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
							name: 'H1',
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
							name: 'L3',
						},
						{
							name: 'L2',
						},
						{
							name: 'L1',
						},
					],
				],
				gameType: 'freegame',
				index: 45,
				paddingPositions: [
					35,
					241,
					160,
					81,
					58,
					239,
					64,
				],
				type: 'reveal',
			},
			{
				index: 46,
				positions: [
					{
						reel: 2,
						row: 4,
					},
					{
						reel: 3,
						row: 6,
					},
					{
						reel: 4,
						row: 3,
					},
					{
						reel: 5,
						row: 3,
					},
					{
						reel: 5,
						row: 7,
					},
				],
				type: 'auroraReveal',
			},
			{
				amount: 1140,
				index: 47,
				type: 'setTotalWin',
			},
			{
				amount: 6,
				index: 48,
				total: 13,
				type: 'updateFreeSpin',
			},
			{
				anticipation: [
					0,
					0,
					0,
					0,
					0,
					0,
					0,
				],
				board: [
					[
						{
							name: 'L1',
						},
						{
							name: 'H4',
						},
						{
							multiplier: 2,
							name: 'L2',
						},
						{
							aurora: true,
							multiplier: 4,
							name: 'L4',
						},
						{
							multiplier: 4,
							name: 'H3',
						},
						{
							multiplier: 2,
							name: 'H1',
						},
						{
							multiplier: 4,
							name: 'L2',
						},
						{
							multiplier: 2,
							name: 'H2',
						},
						{
							name: 'L1',
						},
					],
					[
						{
							name: 'L1',
						},
						{
							multiplier: 4,
							name: 'S',
							scatter: true,
						},
						{
							multiplier: 4,
							name: 'L2',
						},
						{
							multiplier: 2,
							name: 'H3',
						},
						{
							name: 'H4',
						},
						{
							multiplier: 2,
							name: 'L1',
						},
						{
							multiplier: 2,
							name: 'H2',
						},
						{
							multiplier: 2,
							name: 'L2',
						},
						{
							name: 'L1',
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
							name: 'L4',
						},
						{
							aurora: true,
							name: 'H2',
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
							name: 'H4',
						},
						{
							name: 'L1',
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
							name: 'H3',
						},
						{
							aurora: true,
							name: 'H2',
						},
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
							name: 'L3',
						},
						{
							name: 'L1',
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
							name: 'L1',
						},
						{
							name: 'L2',
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
							name: 'L1',
						},
						{
							name: 'L1',
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
							name: 'H2',
						},
						{
							aurora: true,
							name: 'H1',
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
							name: 'L2',
						},
						{
							name: 'L1',
						},
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
							name: 'H1',
						},
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
							name: 'L1',
						},
					],
				],
				gameType: 'freegame',
				index: 49,
				paddingPositions: [
					213,
					16,
					181,
					165,
					211,
					252,
					101,
				],
				type: 'reveal',
			},
			{
				index: 50,
				positions: [
					{
						reel: 0,
						row: 3,
					},
					{
						reel: 2,
						row: 3,
					},
					{
						reel: 3,
						row: 3,
					},
					{
						reel: 5,
						row: 3,
					},
				],
				type: 'auroraReveal',
			},
			{
				amount: 1140,
				index: 51,
				type: 'setTotalWin',
			},
			{
				amount: 7,
				index: 52,
				total: 13,
				type: 'updateFreeSpin',
			},
			{
				anticipation: [
					0,
					0,
					0,
					0,
					0,
					0,
					0,
				],
				board: [
					[
						{
							name: 'L1',
						},
						{
							name: 'H1',
						},
						{
							multiplier: 2,
							name: 'H1',
						},
						{
							multiplier: 4,
							name: 'L3',
						},
						{
							multiplier: 4,
							name: 'H2',
						},
						{
							multiplier: 2,
							name: 'H1',
						},
						{
							multiplier: 4,
							name: 'L2',
						},
						{
							multiplier: 2,
							name: 'L2',
						},
						{
							name: 'L1',
						},
					],
					[
						{
							name: 'L1',
						},
						{
							multiplier: 4,
							name: 'H2',
						},
						{
							multiplier: 4,
							name: 'H3',
						},
						{
							aurora: true,
							multiplier: 2,
							name: 'H1',
						},
						{
							name: 'L3',
						},
						{
							multiplier: 2,
							name: 'L2',
						},
						{
							multiplier: 2,
							name: 'L1',
						},
						{
							multiplier: 2,
							name: 'H2',
						},
						{
							name: 'L1',
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
							name: 'L3',
						},
						{
							name: 'H3',
						},
						{
							name: 'L2',
						},
						{
							aurora: true,
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
					],
					[
						{
							name: 'L1',
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
							aurora: true,
							name: 'H1',
						},
						{
							name: 'L1',
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
							name: 'H3',
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
							name: 'H2',
						},
						{
							name: 'L1',
						},
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
							name: 'H4',
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
							name: 'S',
							scatter: true,
						},
						{
							name: 'L1',
						},
					],
					[
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
							aurora: true,
							name: 'L1',
						},
						{
							aurora: true,
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
							name: 'L1',
						},
					],
				],
				gameType: 'freegame',
				index: 53,
				paddingPositions: [
					9,
					235,
					216,
					98,
					233,
					136,
					26,
				],
				type: 'reveal',
			},
			{
				index: 54,
				positions: [
					{
						reel: 1,
						row: 3,
					},
					{
						reel: 2,
						row: 5,
					},
					{
						reel: 3,
						row: 7,
					},
					{
						reel: 6,
						row: 3,
					},
					{
						reel: 6,
						row: 4,
					},
				],
				type: 'auroraReveal',
			},
			{
				amount: 1140,
				index: 55,
				type: 'setTotalWin',
			},
			{
				amount: 8,
				index: 56,
				total: 13,
				type: 'updateFreeSpin',
			},
			{
				anticipation: [
					0,
					0,
					0,
					0,
					0,
					0,
					0,
				],
				board: [
					[
						{
							name: 'L1',
						},
						{
							name: 'H1',
						},
						{
							multiplier: 2,
							name: 'H4',
						},
						{
							multiplier: 4,
							name: 'L4',
						},
						{
							multiplier: 4,
							name: 'L2',
						},
						{
							aurora: true,
							multiplier: 2,
							name: 'H1',
						},
						{
							multiplier: 4,
							name: 'H1',
						},
						{
							multiplier: 2,
							name: 'L1',
						},
						{
							name: 'L1',
						},
					],
					[
						{
							name: 'L1',
						},
						{
							multiplier: 4,
							name: 'H3',
						},
						{
							multiplier: 4,
							name: 'H3',
						},
						{
							multiplier: 2,
							name: 'H4',
						},
						{
							name: 'H2',
						},
						{
							aurora: true,
							multiplier: 2,
							name: 'H1',
						},
						{
							multiplier: 2,
							name: 'L3',
						},
						{
							multiplier: 2,
							name: 'H1',
						},
						{
							name: 'L1',
						},
					],
					[
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
							name: 'H4',
						},
						{
							name: 'L3',
						},
						{
							aurora: true,
							name: 'L2',
						},
						{
							name: 'H3',
						},
						{
							name: 'L1',
						},
						{
							name: 'L1',
						},
					],
					[
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
							name: 'H1',
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
							name: 'H4',
						},
						{
							name: 'L1',
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
							name: 'L4',
						},
						{
							name: 'L4',
						},
						{
							name: 'L1',
						},
					],
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
						},
						{
							name: 'L3',
						},
						{
							name: 'L1',
						},
					],
				],
				gameType: 'freegame',
				index: 57,
				paddingPositions: [
					80,
					70,
					100,
					157,
					244,
					160,
					190,
				],
				type: 'reveal',
			},
			{
				index: 58,
				positions: [
					{
						reel: 0,
						row: 5,
					},
					{
						reel: 1,
						row: 5,
					},
					{
						reel: 2,
						row: 5,
					},
				],
				type: 'auroraReveal',
			},
			{
				gridMultipliers: [
					[
						1,
						2,
						4,
						4,
						2,
						4,
						2,
					],
					[
						4,
						4,
						2,
						1,
						2,
						2,
						2,
					],
					[
						1,
						1,
						1,
						1,
						1,
						1,
						1,
					],
					[
						1,
						1,
						1,
						1,
						1,
						1,
						1,
					],
					[
						1,
						1,
						1,
						1,
						1,
						1,
						1,
					],
					[
						1,
						1,
						1,
						1,
						1,
						1,
						1,
					],
					[
						1,
						1,
						1,
						1,
						1,
						1,
						1,
					],
				],
				index: 59,
				type: 'updateGrid',
			},
			{
				index: 60,
				totalWin: 20,
				type: 'winInfo',
				wins: [
					{
						clusterSize: 5,
						meta: {
							clusterMult: 1,
							globalMult: 1,
							overlay: {
								reel: 5,
								row: 1,
							},
							winWithoutMult: 20,
						},
						positions: [
							{
								reel: 5,
								row: 1,
							},
							{
								reel: 5,
								row: 2,
							},
							{
								reel: 5,
								row: 3,
							},
							{
								reel: 5,
								row: 4,
							},
							{
								reel: 5,
								row: 5,
							},
						],
						symbol: 'L3',
						win: 20,
					},
				],
			},
			{
				gridMultipliers: [
					[
						1,
						2,
						4,
						4,
						2,
						4,
						2,
					],
					[
						4,
						4,
						2,
						1,
						2,
						2,
						2,
					],
					[
						1,
						1,
						1,
						1,
						1,
						1,
						1,
					],
					[
						1,
						1,
						1,
						1,
						1,
						1,
						1,
					],
					[
						1,
						1,
						1,
						1,
						1,
						1,
						1,
					],
					[
						2,
						2,
						2,
						2,
						2,
						1,
						1,
					],
					[
						1,
						1,
						1,
						1,
						1,
						1,
						1,
					],
				],
				index: 61,
				type: 'updateGrid',
			},
			{
				amount: 20,
				index: 62,
				type: 'updateTumbleWin',
			},
			{
				explodingSymbols: [
					{
						reel: 5,
						row: 1,
					},
					{
						reel: 5,
						row: 2,
					},
					{
						reel: 5,
						row: 3,
					},
					{
						reel: 5,
						row: 4,
					},
					{
						reel: 5,
						row: 5,
					},
				],
				index: 63,
				newSymbols: [
					[],
					[],
					[],
					[],
					[],
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
							name: 'L3',
						},
						{
							name: 'L4',
						},
					],
					[],
				],
				type: 'tumbleBoard',
			},
			{
				amount: 20,
				index: 64,
				type: 'setWin',
				winLevel: 0,
			},
			{
				amount: 1160,
				index: 65,
				type: 'setTotalWin',
			},
			{
				amount: 9,
				index: 66,
				total: 13,
				type: 'updateFreeSpin',
			},
			{
				anticipation: [
					0,
					0,
					0,
					0,
					0,
					0,
					0,
				],
				board: [
					[
						{
							name: 'L1',
						},
						{
							name: 'H4',
						},
						{
							multiplier: 2,
							name: 'H1',
						},
						{
							multiplier: 4,
							name: 'H2',
						},
						{
							multiplier: 4,
							name: 'H2',
						},
						{
							multiplier: 2,
							name: 'H4',
						},
						{
							multiplier: 4,
							name: 'H1',
						},
						{
							multiplier: 2,
							name: 'H2',
						},
						{
							name: 'L1',
						},
					],
					[
						{
							name: 'L1',
						},
						{
							aurora: true,
							multiplier: 4,
							name: 'H1',
						},
						{
							multiplier: 4,
							name: 'L2',
						},
						{
							multiplier: 2,
							name: 'H1',
						},
						{
							name: 'H1',
						},
						{
							multiplier: 2,
							name: 'H1',
						},
						{
							multiplier: 2,
							name: 'H3',
						},
						{
							multiplier: 2,
							name: 'L3',
						},
						{
							name: 'L1',
						},
					],
					[
						{
							name: 'L1',
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
							name: 'L3',
						},
						{
							name: 'S',
							scatter: true,
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
							name: 'H2',
						},
						{
							name: 'H2',
						},
						{
							name: 'L1',
						},
						{
							aurora: true,
							name: 'L2',
						},
						{
							name: 'L1',
						},
						{
							name: 'L1',
						},
					],
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
							name: 'H4',
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
					],
					[
						{
							name: 'L1',
						},
						{
							multiplier: 2,
							name: 'L3',
						},
						{
							multiplier: 2,
							name: 'H4',
						},
						{
							multiplier: 2,
							name: 'L2',
						},
						{
							multiplier: 2,
							name: 'L1',
						},
						{
							multiplier: 2,
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
					],
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
							aurora: true,
							name: 'H2',
						},
						{
							name: 'L1',
						},
					],
				],
				gameType: 'freegame',
				index: 67,
				paddingPositions: [
					179,
					185,
					165,
					150,
					128,
					0,
					5,
				],
				type: 'reveal',
			},
			{
				index: 68,
				positions: [
					{
						reel: 1,
						row: 1,
					},
					{
						reel: 3,
						row: 6,
					},
					{
						reel: 6,
						row: 7,
					},
				],
				type: 'auroraReveal',
			},
			{
				amount: 1160,
				index: 69,
				type: 'setTotalWin',
			},
			{
				amount: 10,
				index: 70,
				total: 13,
				type: 'updateFreeSpin',
			},
			{
				anticipation: [
					0,
					0,
					0,
					0,
					0,
					0,
					0,
				],
				board: [
					[
						{
							name: 'L1',
						},
						{
							name: 'L1',
						},
						{
							multiplier: 2,
							name: 'H1',
						},
						{
							multiplier: 4,
							name: 'H1',
						},
						{
							multiplier: 4,
							name: 'L3',
						},
						{
							multiplier: 2,
							name: 'L2',
						},
						{
							aurora: true,
							multiplier: 4,
							name: 'L4',
						},
						{
							multiplier: 2,
							name: 'L1',
						},
						{
							name: 'L1',
						},
					],
					[
						{
							name: 'L1',
						},
						{
							multiplier: 4,
							name: 'H1',
						},
						{
							aurora: true,
							multiplier: 4,
							name: 'L3',
						},
						{
							multiplier: 2,
							name: 'H2',
						},
						{
							name: 'L1',
						},
						{
							multiplier: 2,
							name: 'H4',
						},
						{
							multiplier: 2,
							name: 'H1',
						},
						{
							multiplier: 2,
							name: 'H1',
						},
						{
							name: 'L1',
						},
					],
					[
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
							name: 'L4',
						},
						{
							name: 'H2',
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
							name: 'L1',
						},
					],
					[
						{
							name: 'L1',
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
							name: 'H3',
						},
						{
							name: 'H1',
						},
						{
							aurora: true,
							name: 'H1',
						},
						{
							name: 'L3',
						},
						{
							name: 'L1',
						},
					],
					[
						{
							name: 'L1',
						},
						{
							aurora: true,
							name: 'H1',
						},
						{
							name: 'H2',
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
							name: 'H3',
						},
						{
							name: 'H2',
						},
						{
							name: 'L1',
						},
					],
					[
						{
							name: 'L1',
						},
						{
							multiplier: 2,
							name: 'H1',
						},
						{
							multiplier: 2,
							name: 'H3',
						},
						{
							multiplier: 2,
							name: 'L4',
						},
						{
							multiplier: 2,
							name: 'H1',
						},
						{
							multiplier: 2,
							name: 'H3',
						},
						{
							name: 'H1',
						},
						{
							aurora: true,
							name: 'L1',
						},
						{
							name: 'L1',
						},
					],
					[
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
							name: 'L2',
						},
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
							name: 'L3',
						},
						{
							name: 'L1',
						},
					],
				],
				gameType: 'freegame',
				index: 71,
				paddingPositions: [
					158,
					63,
					180,
					230,
					35,
					107,
					183,
				],
				type: 'reveal',
			},
			{
				index: 72,
				positions: [
					{
						reel: 0,
						row: 6,
					},
					{
						reel: 1,
						row: 2,
					},
					{
						reel: 3,
						row: 6,
					},
					{
						reel: 4,
						row: 1,
					},
					{
						reel: 5,
						row: 7,
					},
				],
				type: 'auroraReveal',
			},
			{
				amount: 1160,
				index: 73,
				type: 'setTotalWin',
			},
			{
				amount: 11,
				index: 74,
				total: 13,
				type: 'updateFreeSpin',
			},
			{
				anticipation: [
					0,
					0,
					0,
					0,
					0,
					0,
					0,
				],
				board: [
					[
						{
							name: 'L1',
						},
						{
							name: 'H2',
						},
						{
							multiplier: 2,
							name: 'H4',
						},
						{
							multiplier: 4,
							name: 'H1',
						},
						{
							multiplier: 4,
							name: 'H2',
						},
						{
							multiplier: 2,
							name: 'H3',
						},
						{
							multiplier: 4,
							name: 'L4',
						},
						{
							multiplier: 2,
							name: 'H1',
						},
						{
							name: 'L1',
						},
					],
					[
						{
							name: 'L1',
						},
						{
							multiplier: 4,
							name: 'L1',
						},
						{
							aurora: true,
							multiplier: 4,
							name: 'H2',
						},
						{
							multiplier: 2,
							name: 'L4',
						},
						{
							name: 'H4',
						},
						{
							multiplier: 2,
							name: 'H1',
						},
						{
							multiplier: 2,
							name: 'L4',
						},
						{
							multiplier: 2,
							name: 'H1',
						},
						{
							name: 'L1',
						},
					],
					[
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
							name: 'H4',
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
							name: 'L1',
						},
						{
							name: 'L1',
						},
					],
					[
						{
							name: 'L1',
						},
						{
							aurora: true,
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
							name: 'L2',
						},
						{
							name: 'H1',
						},
						{
							aurora: true,
							name: 'H4',
						},
						{
							name: 'L1',
						},
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
							name: 'H2',
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
							name: 'H4',
						},
						{
							name: 'L1',
						},
					],
					[
						{
							name: 'L1',
						},
						{
							multiplier: 2,
							name: 'H3',
						},
						{
							multiplier: 2,
							name: 'H2',
						},
						{
							multiplier: 2,
							name: 'L2',
						},
						{
							multiplier: 2,
							name: 'H1',
						},
						{
							multiplier: 2,
							name: 'H2',
						},
						{
							name: 'H3',
						},
						{
							name: 'H1',
						},
						{
							name: 'L1',
						},
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
							aurora: true,
							name: 'H4',
						},
						{
							name: 'H1',
						},
						{
							name: 'H4',
						},
						{
							aurora: true,
							name: 'H1',
						},
						{
							name: 'L1',
						},
					],
				],
				gameType: 'freegame',
				index: 75,
				paddingPositions: [
					192,
					223,
					100,
					170,
					136,
					26,
					59,
				],
				type: 'reveal',
			},
			{
				index: 76,
				positions: [
					{
						reel: 1,
						row: 2,
					},
					{
						reel: 3,
						row: 1,
					},
					{
						reel: 3,
						row: 7,
					},
					{
						reel: 6,
						row: 4,
					},
					{
						reel: 6,
						row: 7,
					},
				],
				type: 'auroraReveal',
			},
			{
				amount: 1160,
				index: 77,
				type: 'setTotalWin',
			},
			{
				amount: 12,
				index: 78,
				total: 13,
				type: 'updateFreeSpin',
			},
			{
				anticipation: [
					0,
					0,
					0,
					0,
					0,
					0,
					0,
				],
				board: [
					[
						{
							name: 'L1',
						},
						{
							name: 'L3',
						},
						{
							multiplier: 2,
							name: 'H1',
						},
						{
							multiplier: 4,
							name: 'H4',
						},
						{
							multiplier: 4,
							name: 'H3',
						},
						{
							aurora: true,
							multiplier: 2,
							name: 'L2',
						},
						{
							multiplier: 4,
							name: 'H1',
						},
						{
							multiplier: 2,
							name: 'H1',
						},
						{
							name: 'L1',
						},
					],
					[
						{
							name: 'L1',
						},
						{
							multiplier: 4,
							name: 'H4',
						},
						{
							multiplier: 4,
							name: 'H1',
						},
						{
							multiplier: 2,
							name: 'L3',
						},
						{
							name: 'H1',
						},
						{
							multiplier: 2,
							name: 'H1',
						},
						{
							multiplier: 2,
							name: 'H1',
						},
						{
							multiplier: 2,
							name: 'H3',
						},
						{
							name: 'L1',
						},
					],
					[
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
							name: 'H4',
						},
						{
							name: 'L2',
						},
						{
							name: 'H2',
						},
						{
							name: 'L1',
						},
						{
							aurora: true,
							name: 'H1',
						},
						{
							name: 'L1',
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
							name: 'H2',
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
							name: 'H2',
						},
						{
							name: 'L3',
						},
						{
							name: 'L1',
						},
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
							name: 'H4',
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
							name: 'H4',
						},
						{
							name: 'L1',
						},
					],
					[
						{
							name: 'L1',
						},
						{
							multiplier: 2,
							name: 'L2',
						},
						{
							multiplier: 2,
							name: 'H3',
						},
						{
							multiplier: 2,
							name: 'H4',
						},
						{
							multiplier: 2,
							name: 'H2',
						},
						{
							multiplier: 2,
							name: 'H3',
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
					],
					[
						{
							name: 'L1',
						},
						{
							aurora: true,
							name: 'L2',
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
							aurora: true,
							name: 'L1',
						},
						{
							aurora: true,
							name: 'L3',
						},
						{
							name: 'L1',
						},
					],
				],
				gameType: 'freegame',
				index: 79,
				paddingPositions: [
					49,
					141,
					185,
					252,
					82,
					7,
					190,
				],
				type: 'reveal',
			},
			{
				index: 80,
				positions: [
					{
						reel: 0,
						row: 5,
					},
					{
						reel: 2,
						row: 7,
					},
					{
						reel: 6,
						row: 1,
					},
					{
						reel: 6,
						row: 6,
					},
					{
						reel: 6,
						row: 7,
					},
				],
				type: 'auroraReveal',
			},
			{
				gridMultipliers: [
					[
						1,
						2,
						4,
						4,
						2,
						4,
						2,
					],
					[
						4,
						4,
						2,
						1,
						2,
						2,
						2,
					],
					[
						1,
						1,
						1,
						1,
						1,
						1,
						1,
					],
					[
						1,
						1,
						1,
						1,
						1,
						1,
						1,
					],
					[
						1,
						1,
						1,
						1,
						1,
						1,
						1,
					],
					[
						2,
						2,
						2,
						2,
						2,
						1,
						1,
					],
					[
						1,
						1,
						1,
						1,
						1,
						1,
						1,
					],
				],
				index: 81,
				type: 'updateGrid',
			},
			{
				index: 82,
				totalWin: 1100,
				type: 'winInfo',
				wins: [
					{
						clusterSize: 5,
						meta: {
							clusterMult: 10,
							globalMult: 1,
							overlay: {
								reel: 0,
								row: 6,
							},
							winWithoutMult: 100,
						},
						positions: [
							{
								reel: 0,
								row: 6,
							},
							{
								reel: 1,
								row: 6,
							},
							{
								reel: 0,
								row: 7,
							},
							{
								reel: 1,
								row: 5,
							},
							{
								reel: 1,
								row: 4,
							},
						],
						symbol: 'H1',
						win: 1000,
					},
					{
						clusterSize: 5,
						meta: {
							clusterMult: 2,
							globalMult: 1,
							overlay: {
								reel: 3,
								row: 5,
							},
							winWithoutMult: 50,
						},
						positions: [
							{
								reel: 3,
								row: 5,
							},
							{
								reel: 4,
								row: 5,
							},
							{
								reel: 4,
								row: 4,
							},
							{
								reel: 4,
								row: 3,
							},
							{
								reel: 5,
								row: 3,
							},
						],
						symbol: 'H4',
						win: 100,
					},
				],
			},
			{
				gridMultipliers: [
					[
						1,
						2,
						4,
						4,
						2,
						8,
						4,
					],
					[
						4,
						4,
						2,
						2,
						4,
						4,
						2,
					],
					[
						1,
						1,
						1,
						1,
						1,
						1,
						1,
					],
					[
						1,
						1,
						1,
						1,
						2,
						1,
						1,
					],
					[
						1,
						1,
						2,
						2,
						2,
						1,
						1,
					],
					[
						2,
						2,
						4,
						2,
						2,
						1,
						1,
					],
					[
						1,
						1,
						1,
						1,
						1,
						1,
						1,
					],
				],
				index: 83,
				type: 'updateGrid',
			},
			{
				amount: 1100,
				index: 84,
				type: 'updateTumbleWin',
			},
			{
				explodingSymbols: [
					{
						reel: 0,
						row: 6,
					},
					{
						reel: 1,
						row: 6,
					},
					{
						reel: 0,
						row: 7,
					},
					{
						reel: 1,
						row: 5,
					},
					{
						reel: 1,
						row: 4,
					},
					{
						reel: 3,
						row: 5,
					},
					{
						reel: 4,
						row: 5,
					},
					{
						reel: 4,
						row: 4,
					},
					{
						reel: 4,
						row: 3,
					},
					{
						reel: 5,
						row: 3,
					},
				],
				index: 85,
				newSymbols: [
					[
						{
							name: 'H1',
						},
						{
							name: 'H4',
						},
					],
					[
						{
							name: 'H1',
						},
						{
							name: 'L3',
						},
						{
							name: 'H1',
						},
					],
					[],
					[
						{
							name: 'H2',
						},
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
					],
					[
						{
							name: 'H3',
						},
					],
					[],
				],
				type: 'tumbleBoard',
			},
			{
				amount: 1100,
				index: 86,
				type: 'setWin',
				winLevel: 0,
			},
			{
				amount: 2260,
				index: 87,
				type: 'setTotalWin',
			},
			{
				amount: 13,
				index: 88,
				total: 13,
				type: 'updateFreeSpin',
			},
			{
				anticipation: [
					0,
					0,
					0,
					0,
					0,
					0,
					0,
				],
				board: [
					[
						{
							name: 'L1',
						},
						{
							name: 'L1',
						},
						{
							multiplier: 2,
							name: 'H1',
						},
						{
							multiplier: 4,
							name: 'H4',
						},
						{
							multiplier: 4,
							name: 'L2',
						},
						{
							aurora: true,
							multiplier: 2,
							name: 'H1',
						},
						{
							multiplier: 8,
							name: 'H3',
						},
						{
							multiplier: 4,
							name: 'L4',
						},
						{
							name: 'L1',
						},
					],
					[
						{
							name: 'L1',
						},
						{
							multiplier: 4,
							name: 'L2',
						},
						{
							multiplier: 4,
							name: 'H3',
						},
						{
							multiplier: 2,
							name: 'H4',
						},
						{
							multiplier: 2,
							name: 'L1',
						},
						{
							multiplier: 4,
							name: 'H1',
						},
						{
							multiplier: 4,
							name: 'H2',
						},
						{
							multiplier: 2,
							name: 'L1',
						},
						{
							name: 'L1',
						},
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
							name: 'H4',
						},
						{
							name: 'L4',
						},
						{
							name: 'H2',
						},
						{
							name: 'L3',
						},
						{
							name: 'L1',
						},
					],
					[
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
							aurora: true,
							name: 'H2',
						},
						{
							multiplier: 2,
							name: 'H2',
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
					],
					[
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
							multiplier: 2,
							name: 'H1',
						},
						{
							multiplier: 2,
							name: 'L3',
						},
						{
							multiplier: 2,
							name: 'H2',
						},
						{
							name: 'H3',
						},
						{
							name: 'L1',
						},
						{
							name: 'L1',
						},
					],
					[
						{
							name: 'L1',
						},
						{
							multiplier: 2,
							name: 'H4',
						},
						{
							aurora: true,
							multiplier: 2,
							name: 'H3',
						},
						{
							multiplier: 4,
							name: 'H1',
						},
						{
							multiplier: 2,
							name: 'H4',
						},
						{
							multiplier: 2,
							name: 'L1',
						},
						{
							name: 'H4',
						},
						{
							name: 'H1',
						},
						{
							name: 'L1',
						},
					],
					[
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
							name: 'H3',
						},
						{
							name: 'L3',
						},
						{
							aurora: true,
							name: 'H4',
						},
						{
							name: 'L2',
						},
						{
							name: 'L1',
						},
					],
				],
				gameType: 'freegame',
				index: 89,
				paddingPositions: [
					139,
					201,
					178,
					149,
					0,
					182,
					137,
				],
				type: 'reveal',
			},
			{
				index: 90,
				positions: [
					{
						reel: 0,
						row: 5,
					},
					{
						reel: 3,
						row: 4,
					},
					{
						reel: 5,
						row: 2,
					},
					{
						reel: 6,
						row: 6,
					},
				],
				type: 'auroraReveal',
			},
			{
				amount: 2260,
				index: 91,
				type: 'setTotalWin',
			},
			{
				amount: 2260,
				index: 92,
				totalWilds: 0,
				type: 'freeSpinEnd',
				winLevel: 1,
			},
			{
				amount: 2260,
				index: 93,
				type: 'finalWin',
			},
		],
		freeGameWins: 2260,
		id: 3009,
		payoutMultiplier: 2260,
		_label: 'bonus_retrigger_on_first_free_spin',
	},
];
