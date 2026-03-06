// Book 113: base mode, tumble-triggered free spins + wild release
// Demonstrates corrected wild release ordering (natural wins before wild placement)
// Payout: 71.00x

export const book113 = {
  baseGameWins: 20,
  criteria: 'freegame',
  events: [
    {
      anticipation: [0, 0, 0, 0, 0, 0, 1],
      board: [
        [
          {
            name: 'L1'
          },
          {
            name: 'L3'
          },
          {
            name: 'L4'
          },
          {
            name: 'L4'
          },
          {
            name: 'L4'
          },
          {
            name: 'H1'
          },
          {
            name: 'L4'
          },
          {
            name: 'L4'
          },
          {
            name: 'L1'
          }
        ],
        [
          {
            name: 'L1'
          },
          {
            name: 'L1'
          },
          {
            name: 'L1'
          },
          {
            name: 'H2'
          },
          {
            name: 'L2'
          },
          {
            name: 'L2'
          },
          {
            name: 'L1'
          },
          {
            name: 'L4'
          },
          {
            name: 'L1'
          }
        ],
        [
          {
            name: 'L1'
          },
          {
            name: 'H4'
          },
          {
            name: 'H4'
          },
          {
            name: 'L2'
          },
          {
            aurora: true,
            name: 'L2'
          },
          {
            name: 'L4'
          },
          {
            name: 'L2'
          },
          {
            name: 'H4'
          },
          {
            name: 'L1'
          }
        ],
        [
          {
            name: 'L1'
          },
          {
            name: 'H1'
          },
          {
            name: 'S',
            scatter: true
          },
          {
            name: 'L2'
          },
          {
            name: 'H2'
          },
          {
            name: 'H1'
          },
          {
            name: 'L2'
          },
          {
            aurora: true,
            name: 'L2'
          },
          {
            name: 'L1'
          }
        ],
        [
          {
            name: 'L1'
          },
          {
            name: 'H4'
          },
          {
            name: 'H4'
          },
          {
            name: 'L3'
          },
          {
            name: 'L3'
          },
          {
            name: 'L2'
          },
          {
            aurora: true,
            name: 'H4'
          },
          {
            name: 'H1'
          },
          {
            name: 'L1'
          }
        ],
        [
          {
            name: 'L1'
          },
          {
            name: 'L1'
          },
          {
            name: 'S',
            scatter: true
          },
          {
            name: 'L3'
          },
          {
            name: 'H3'
          },
          {
            name: 'H1'
          },
          {
            name: 'L4'
          },
          {
            name: 'L4'
          },
          {
            name: 'L1'
          }
        ],
        [
          {
            name: 'L1'
          },
          {
            name: 'L2'
          },
          {
            aurora: true,
            name: 'H1'
          },
          {
            name: 'L2'
          },
          {
            name: 'H2'
          },
          {
            name: 'H2'
          },
          {
            name: 'L4'
          },
          {
            name: 'H4'
          },
          {
            name: 'L1'
          }
        ]
      ],
      gameType: 'basegame',
      index: 0,
      paddingPositions: [189, 192, 18, 141, 191, 128, 87],
      type: 'reveal'
    },
    {
      index: 1,
      positions: [
        {
          reel: 2,
          row: 4
        },
        {
          reel: 3,
          row: 7
        },
        {
          reel: 4,
          row: 6
        },
        {
          reel: 6,
          row: 2
        }
      ],
      type: 'auroraReveal'
    },
    {
      gridMultipliers: [
        [1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1]
      ],
      index: 2,
      type: 'updateGrid'
    },
    {
      index: 3,
      totalWin: 20,
      type: 'winInfo',
      wins: [
        {
          clusterSize: 5,
          meta: {
            clusterMult: 1,
            globalMult: 1,
            overlay: {
              reel: 1,
              row: 4
            },
            winWithoutMult: 20
          },
          positions: [
            {
              reel: 1,
              row: 4
            },
            {
              reel: 2,
              row: 4
            },
            {
              reel: 1,
              row: 5
            },
            {
              reel: 2,
              row: 3
            },
            {
              reel: 3,
              row: 3
            }
          ],
          symbol: 'L2',
          win: 20
        }
      ]
    },
    {
      gridMultipliers: [
        [1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 2, 2, 1, 1],
        [1, 1, 2, 2, 1, 1, 1],
        [1, 1, 2, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1]
      ],
      index: 4,
      type: 'updateGrid'
    },
    {
      amount: 20,
      index: 5,
      type: 'updateTumbleWin'
    },
    {
      cellsCollected: 1,
      index: 6,
      meterTotal: 1,
      type: 'auroraMeterUpdate'
    },
    {
      index: 7,
      positions: [
        {
          reel: 2,
          row: 4
        }
      ],
      type: 'auroraExplode'
    },
    {
      explodingSymbols: [
        {
          reel: 1,
          row: 4
        },
        {
          reel: 2,
          row: 4
        },
        {
          reel: 1,
          row: 5
        },
        {
          reel: 2,
          row: 3
        },
        {
          reel: 3,
          row: 3
        }
      ],
      index: 8,
      newSymbols: [
        [],
        [
          {
            name: 'L1'
          },
          {
            name: 'H2'
          }
        ],
        [
          {
            name: 'H4'
          },
          {
            name: 'L2'
          }
        ],
        [
          {
            name: 'S',
            scatter: true
          }
        ],
        [],
        [],
        []
      ],
      type: 'tumbleBoard'
    },
    {
      index: 9,
      isRelease: false,
      meterAfter: 0,
      meterBefore: 0,
      position: {
        reel: 2,
        row: 3
      },
      type: 'auroraWildPlace'
    },
    {
      index: 10,
      isRelease: false,
      meterAfter: 0,
      meterBefore: 0,
      position: {
        reel: 5,
        row: 7
      },
      type: 'auroraWildPlace'
    },
    {
      amount: 20,
      index: 11,
      type: 'setWin',
      winLevel: 0
    },
    {
      index: 12,
      positions: [
        {
          reel: 3,
          row: 1
        },
        {
          reel: 3,
          row: 3
        },
        {
          reel: 5,
          row: 2
        }
      ],
      totalFs: 8,
      type: 'freeSpinTrigger'
    },
    {
      amount: 20,
      index: 13,
      type: 'setTotalWin'
    },
    {
      amount: 1,
      index: 14,
      total: 8,
      type: 'updateFreeSpin'
    },
    {
      anticipation: [0, 0, 0, 0, 0, 0, 0],
      board: [
        [
          {
            name: 'L1'
          },
          {
            name: 'H1'
          },
          {
            name: 'H2'
          },
          {
            name: 'H4'
          },
          {
            name: 'L1'
          },
          {
            name: 'L2'
          },
          {
            aurora: true,
            name: 'H3'
          },
          {
            name: 'L1'
          },
          {
            name: 'L1'
          }
        ],
        [
          {
            name: 'L1'
          },
          {
            name: 'H1'
          },
          {
            name: 'L1'
          },
          {
            name: 'L1'
          },
          {
            multiplier: 2,
            name: 'L1'
          },
          {
            multiplier: 2,
            name: 'H1'
          },
          {
            name: 'L3'
          },
          {
            name: 'H1'
          },
          {
            name: 'L1'
          }
        ],
        [
          {
            name: 'L1'
          },
          {
            name: 'H1'
          },
          {
            aurora: true,
            name: 'L2'
          },
          {
            multiplier: 2,
            name: 'H2'
          },
          {
            multiplier: 2,
            name: 'H1'
          },
          {
            name: 'H4'
          },
          {
            name: 'H4'
          },
          {
            name: 'L2'
          },
          {
            name: 'L1'
          }
        ],
        [
          {
            name: 'L1'
          },
          {
            name: 'H2'
          },
          {
            name: 'L2'
          },
          {
            multiplier: 2,
            name: 'L4'
          },
          {
            name: 'H1'
          },
          {
            name: 'L3'
          },
          {
            name: 'H3'
          },
          {
            name: 'H1'
          },
          {
            name: 'L1'
          }
        ],
        [
          {
            name: 'L1'
          },
          {
            name: 'H4'
          },
          {
            name: 'H1'
          },
          {
            name: 'L1'
          },
          {
            name: 'H1'
          },
          {
            name: 'L3'
          },
          {
            name: 'L1'
          },
          {
            aurora: true,
            name: 'H3'
          },
          {
            name: 'L1'
          }
        ],
        [
          {
            name: 'L1'
          },
          {
            name: 'L3'
          },
          {
            name: 'L2'
          },
          {
            name: 'L3'
          },
          {
            name: 'L4'
          },
          {
            name: 'H3'
          },
          {
            name: 'L3'
          },
          {
            name: 'L2'
          },
          {
            name: 'L1'
          }
        ],
        [
          {
            name: 'L1'
          },
          {
            name: 'S',
            scatter: true
          },
          {
            name: 'H2'
          },
          {
            name: 'H1'
          },
          {
            name: 'H2'
          },
          {
            name: 'H1'
          },
          {
            name: 'L2'
          },
          {
            name: 'H2'
          },
          {
            name: 'L1'
          }
        ]
      ],
      gameType: 'freegame',
      index: 15,
      paddingPositions: [119, 138, 110, 248, 251, 231, 9],
      type: 'reveal'
    },
    {
      index: 16,
      positions: [
        {
          reel: 0,
          row: 6
        },
        {
          reel: 2,
          row: 2
        },
        {
          reel: 4,
          row: 7
        }
      ],
      type: 'auroraReveal'
    },
    {
      amount: 20,
      index: 17,
      type: 'setTotalWin'
    },
    {
      amount: 2,
      index: 18,
      total: 8,
      type: 'updateFreeSpin'
    },
    {
      anticipation: [0, 0, 0, 0, 0, 0, 0],
      board: [
        [
          {
            name: 'L1'
          },
          {
            name: 'H4'
          },
          {
            name: 'H3'
          },
          {
            name: 'L3'
          },
          {
            name: 'H2'
          },
          {
            name: 'H2'
          },
          {
            name: 'H1'
          },
          {
            name: 'L1'
          },
          {
            name: 'L1'
          }
        ],
        [
          {
            name: 'L1'
          },
          {
            name: 'H3'
          },
          {
            aurora: true,
            name: 'L4'
          },
          {
            name: 'L2'
          },
          {
            multiplier: 2,
            name: 'H2'
          },
          {
            multiplier: 2,
            name: 'H3'
          },
          {
            name: 'H3'
          },
          {
            name: 'H2'
          },
          {
            name: 'L1'
          }
        ],
        [
          {
            name: 'L1'
          },
          {
            name: 'H1'
          },
          {
            name: 'L1'
          },
          {
            multiplier: 2,
            name: 'H4'
          },
          {
            multiplier: 2,
            name: 'H1'
          },
          {
            name: 'L4'
          },
          {
            name: 'L4'
          },
          {
            name: 'L1'
          },
          {
            name: 'L1'
          }
        ],
        [
          {
            name: 'L1'
          },
          {
            name: 'L4'
          },
          {
            name: 'L2'
          },
          {
            multiplier: 2,
            name: 'H2'
          },
          {
            name: 'L2'
          },
          {
            name: 'L4'
          },
          {
            name: 'H1'
          },
          {
            name: 'L3'
          },
          {
            name: 'L1'
          }
        ],
        [
          {
            name: 'L1'
          },
          {
            aurora: true,
            name: 'H3'
          },
          {
            name: 'H3'
          },
          {
            name: 'L3'
          },
          {
            name: 'H1'
          },
          {
            name: 'H3'
          },
          {
            name: 'L1'
          },
          {
            name: 'H3'
          },
          {
            name: 'L1'
          }
        ],
        [
          {
            name: 'L1'
          },
          {
            name: 'L3'
          },
          {
            name: 'H3'
          },
          {
            name: 'H3'
          },
          {
            aurora: true,
            name: 'H2'
          },
          {
            name: 'L4'
          },
          {
            name: 'H3'
          },
          {
            name: 'H2'
          },
          {
            name: 'L1'
          }
        ],
        [
          {
            name: 'L1'
          },
          {
            name: 'L1'
          },
          {
            name: 'L1'
          },
          {
            name: 'H1'
          },
          {
            name: 'H1'
          },
          {
            name: 'H1'
          },
          {
            name: 'H1'
          },
          {
            name: 'H4'
          },
          {
            name: 'L1'
          }
        ]
      ],
      gameType: 'freegame',
      index: 19,
      paddingPositions: [189, 15, 146, 246, 138, 109, 16],
      type: 'reveal'
    },
    {
      index: 20,
      positions: [
        {
          reel: 1,
          row: 2
        },
        {
          reel: 4,
          row: 1
        },
        {
          reel: 5,
          row: 4
        }
      ],
      type: 'auroraReveal'
    },
    {
      amount: 20,
      index: 21,
      type: 'setTotalWin'
    },
    {
      amount: 3,
      index: 22,
      total: 8,
      type: 'updateFreeSpin'
    },
    {
      anticipation: [0, 0, 0, 0, 0, 0, 1],
      board: [
        [
          {
            name: 'L1'
          },
          {
            name: 'H2'
          },
          {
            aurora: true,
            name: 'H4'
          },
          {
            name: 'L1'
          },
          {
            aurora: true,
            name: 'L2'
          },
          {
            name: 'H3'
          },
          {
            name: 'L1'
          },
          {
            name: 'H2'
          },
          {
            name: 'L1'
          }
        ],
        [
          {
            name: 'L1'
          },
          {
            name: 'L4'
          },
          {
            name: 'H2'
          },
          {
            name: 'H1'
          },
          {
            multiplier: 2,
            name: 'H1'
          },
          {
            multiplier: 2,
            name: 'H3'
          },
          {
            name: 'S',
            scatter: true
          },
          {
            aurora: true,
            name: 'H2'
          },
          {
            name: 'L1'
          }
        ],
        [
          {
            name: 'L1'
          },
          {
            aurora: true,
            name: 'L1'
          },
          {
            name: 'L1'
          },
          {
            multiplier: 2,
            name: 'L3'
          },
          {
            multiplier: 2,
            name: 'H4'
          },
          {
            name: 'L1'
          },
          {
            name: 'L2'
          },
          {
            name: 'L3'
          },
          {
            name: 'L1'
          }
        ],
        [
          {
            name: 'L1'
          },
          {
            name: 'H2'
          },
          {
            name: 'L4'
          },
          {
            multiplier: 2,
            name: 'L2'
          },
          {
            name: 'H1'
          },
          {
            name: 'H3'
          },
          {
            name: 'H2'
          },
          {
            name: 'H1'
          },
          {
            name: 'L1'
          }
        ],
        [
          {
            name: 'L1'
          },
          {
            name: 'L3'
          },
          {
            name: 'L2'
          },
          {
            name: 'H4'
          },
          {
            name: 'S',
            scatter: true
          },
          {
            name: 'L3'
          },
          {
            name: 'L2'
          },
          {
            aurora: true,
            name: 'L2'
          },
          {
            name: 'L1'
          }
        ],
        [
          {
            name: 'L1'
          },
          {
            name: 'H1'
          },
          {
            name: 'H3'
          },
          {
            name: 'L2'
          },
          {
            name: 'H4'
          },
          {
            name: 'H1'
          },
          {
            name: 'H4'
          },
          {
            name: 'L3'
          },
          {
            name: 'L1'
          }
        ],
        [
          {
            name: 'L1'
          },
          {
            name: 'H1'
          },
          {
            name: 'H4'
          },
          {
            name: 'L3'
          },
          {
            name: 'H1'
          },
          {
            name: 'L3'
          },
          {
            name: 'H4'
          },
          {
            name: 'H4'
          },
          {
            name: 'L1'
          }
        ]
      ],
      gameType: 'freegame',
      index: 23,
      paddingPositions: [120, 186, 215, 228, 162, 60, 134],
      type: 'reveal'
    },
    {
      index: 24,
      positions: [
        {
          reel: 0,
          row: 2
        },
        {
          reel: 0,
          row: 4
        },
        {
          reel: 1,
          row: 7
        },
        {
          reel: 2,
          row: 1
        },
        {
          reel: 4,
          row: 7
        }
      ],
      type: 'auroraReveal'
    },
    {
      amount: 20,
      index: 25,
      type: 'setTotalWin'
    },
    {
      amount: 4,
      index: 26,
      total: 8,
      type: 'updateFreeSpin'
    },
    {
      anticipation: [0, 0, 0, 0, 0, 0, 0],
      board: [
        [
          {
            name: 'L1'
          },
          {
            name: 'H1'
          },
          {
            name: 'H1'
          },
          {
            name: 'L1'
          },
          {
            name: 'H2'
          },
          {
            name: 'H2'
          },
          {
            name: 'L4'
          },
          {
            aurora: true,
            name: 'L3'
          },
          {
            name: 'L1'
          }
        ],
        [
          {
            name: 'L1'
          },
          {
            name: 'L1'
          },
          {
            name: 'L1'
          },
          {
            aurora: true,
            name: 'H1'
          },
          {
            multiplier: 2,
            name: 'L4'
          },
          {
            multiplier: 2,
            name: 'H2'
          },
          {
            name: 'H1'
          },
          {
            name: 'H1'
          },
          {
            name: 'L1'
          }
        ],
        [
          {
            name: 'L1'
          },
          {
            name: 'L1'
          },
          {
            name: 'H1'
          },
          {
            multiplier: 2,
            name: 'H4'
          },
          {
            multiplier: 2,
            name: 'H3'
          },
          {
            name: 'L2'
          },
          {
            name: 'H3'
          },
          {
            name: 'H1'
          },
          {
            name: 'L1'
          }
        ],
        [
          {
            name: 'L1'
          },
          {
            name: 'H2'
          },
          {
            name: 'L2'
          },
          {
            multiplier: 2,
            name: 'H4'
          },
          {
            name: 'H2'
          },
          {
            name: 'H1'
          },
          {
            name: 'L4'
          },
          {
            name: 'H2'
          },
          {
            name: 'L1'
          }
        ],
        [
          {
            name: 'L1'
          },
          {
            name: 'H4'
          },
          {
            name: 'H4'
          },
          {
            name: 'L1'
          },
          {
            name: 'L2'
          },
          {
            name: 'H1'
          },
          {
            name: 'H1'
          },
          {
            aurora: true,
            name: 'H1'
          },
          {
            name: 'L1'
          }
        ],
        [
          {
            name: 'L1'
          },
          {
            name: 'H1'
          },
          {
            name: 'H1'
          },
          {
            name: 'H1'
          },
          {
            name: 'H3'
          },
          {
            name: 'L3'
          },
          {
            name: 'L2'
          },
          {
            name: 'L4'
          },
          {
            name: 'L1'
          }
        ],
        [
          {
            name: 'L1'
          },
          {
            name: 'L2'
          },
          {
            name: 'H2'
          },
          {
            name: 'L1'
          },
          {
            name: 'L1'
          },
          {
            name: 'H1'
          },
          {
            name: 'H1'
          },
          {
            name: 'H1'
          },
          {
            name: 'L1'
          }
        ]
      ],
      gameType: 'freegame',
      index: 27,
      paddingPositions: [216, 183, 164, 41, 201, 91, 14],
      type: 'reveal'
    },
    {
      index: 28,
      positions: [
        {
          reel: 0,
          row: 7
        },
        {
          reel: 1,
          row: 3
        },
        {
          reel: 4,
          row: 7
        }
      ],
      type: 'auroraReveal'
    },
    {
      amount: 20,
      index: 29,
      type: 'setTotalWin'
    },
    {
      amount: 5,
      index: 30,
      total: 8,
      type: 'updateFreeSpin'
    },
    {
      anticipation: [0, 0, 0, 0, 0, 0, 0],
      board: [
        [
          {
            name: 'L1'
          },
          {
            name: 'H2'
          },
          {
            name: 'H1'
          },
          {
            name: 'L1'
          },
          {
            name: 'L1'
          },
          {
            name: 'H4'
          },
          {
            name: 'L1'
          },
          {
            name: 'H1'
          },
          {
            name: 'L1'
          }
        ],
        [
          {
            name: 'L1'
          },
          {
            name: 'H4'
          },
          {
            name: 'H1'
          },
          {
            name: 'L1'
          },
          {
            multiplier: 2,
            name: 'H1'
          },
          {
            multiplier: 2,
            name: 'H1'
          },
          {
            name: 'L1'
          },
          {
            name: 'L1'
          },
          {
            name: 'L1'
          }
        ],
        [
          {
            name: 'L1'
          },
          {
            name: 'L1'
          },
          {
            name: 'L1'
          },
          {
            multiplier: 2,
            name: 'L1'
          },
          {
            multiplier: 2,
            name: 'L3'
          },
          {
            name: 'H4'
          },
          {
            name: 'L1'
          },
          {
            name: 'L2'
          },
          {
            name: 'L1'
          }
        ],
        [
          {
            name: 'L1'
          },
          {
            name: 'H2'
          },
          {
            name: 'H2'
          },
          {
            aurora: true,
            multiplier: 2,
            name: 'H2'
          },
          {
            name: 'H1'
          },
          {
            name: 'H3'
          },
          {
            name: 'L4'
          },
          {
            name: 'H3'
          },
          {
            name: 'L1'
          }
        ],
        [
          {
            name: 'L1'
          },
          {
            name: 'H1'
          },
          {
            name: 'H3'
          },
          {
            name: 'H2'
          },
          {
            aurora: true,
            name: 'H2'
          },
          {
            name: 'H3'
          },
          {
            name: 'H1'
          },
          {
            name: 'H3'
          },
          {
            name: 'L1'
          }
        ],
        [
          {
            name: 'L1'
          },
          {
            name: 'H3'
          },
          {
            name: 'L3'
          },
          {
            name: 'H2'
          },
          {
            name: 'L2'
          },
          {
            name: 'H3'
          },
          {
            name: 'H2'
          },
          {
            name: 'L1'
          },
          {
            name: 'L1'
          }
        ],
        [
          {
            name: 'L1'
          },
          {
            name: 'L2'
          },
          {
            name: 'H1'
          },
          {
            name: 'H3'
          },
          {
            name: 'H1'
          },
          {
            name: 'H4'
          },
          {
            name: 'H1'
          },
          {
            name: 'H1'
          },
          {
            name: 'L1'
          }
        ]
      ],
      gameType: 'freegame',
      index: 31,
      paddingPositions: [12, 240, 214, 49, 194, 210, 156],
      type: 'reveal'
    },
    {
      index: 32,
      positions: [
        {
          reel: 3,
          row: 3
        },
        {
          reel: 4,
          row: 4
        }
      ],
      type: 'auroraReveal'
    },
    {
      gridMultipliers: [
        [1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 2, 2, 1, 1],
        [1, 1, 2, 2, 1, 1, 1],
        [1, 1, 2, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1]
      ],
      index: 33,
      type: 'updateGrid'
    },
    {
      index: 34,
      totalWin: 280,
      type: 'winInfo',
      wins: [
        {
          clusterSize: 6,
          meta: {
            clusterMult: 2,
            globalMult: 1,
            overlay: {
              reel: 3,
              row: 1
            },
            winWithoutMult: 100
          },
          positions: [
            {
              reel: 3,
              row: 1
            },
            {
              reel: 3,
              row: 2
            },
            {
              reel: 3,
              row: 3
            },
            {
              reel: 4,
              row: 3
            },
            {
              reel: 5,
              row: 3
            },
            {
              reel: 4,
              row: 4
            }
          ],
          symbol: 'H2',
          win: 200
        },
        {
          clusterSize: 6,
          meta: {
            clusterMult: 2,
            globalMult: 1,
            overlay: {
              reel: 0,
              row: 3
            },
            winWithoutMult: 40
          },
          positions: [
            {
              reel: 0,
              row: 3
            },
            {
              reel: 1,
              row: 3
            },
            {
              reel: 0,
              row: 4
            },
            {
              reel: 2,
              row: 3
            },
            {
              reel: 2,
              row: 2
            },
            {
              reel: 2,
              row: 1
            }
          ],
          symbol: 'L1',
          win: 80
        }
      ]
    },
    {
      gridMultipliers: [
        [1, 1, 2, 2, 1, 1, 1],
        [1, 1, 2, 2, 2, 1, 1],
        [2, 2, 4, 2, 1, 1, 1],
        [2, 2, 4, 1, 1, 1, 1],
        [1, 1, 2, 2, 1, 1, 1],
        [1, 1, 2, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1]
      ],
      index: 35,
      type: 'updateGrid'
    },
    {
      amount: 280,
      index: 36,
      type: 'updateTumbleWin'
    },
    {
      cellsCollected: 2,
      index: 37,
      meterTotal: 3,
      type: 'auroraMeterUpdate'
    },
    {
      index: 38,
      positions: [
        {
          reel: 3,
          row: 3
        },
        {
          reel: 4,
          row: 4
        }
      ],
      type: 'auroraExplode'
    },
    {
      explodingSymbols: [
        {
          reel: 3,
          row: 1
        },
        {
          reel: 3,
          row: 2
        },
        {
          reel: 3,
          row: 3
        },
        {
          reel: 4,
          row: 3
        },
        {
          reel: 5,
          row: 3
        },
        {
          reel: 4,
          row: 4
        },
        {
          reel: 0,
          row: 3
        },
        {
          reel: 1,
          row: 3
        },
        {
          reel: 0,
          row: 4
        },
        {
          reel: 2,
          row: 3
        },
        {
          reel: 2,
          row: 2
        },
        {
          reel: 2,
          row: 1
        }
      ],
      index: 39,
      newSymbols: [
        [
          {
            name: 'H1'
          },
          {
            name: 'L1'
          }
        ],
        [
          {
            name: 'H1'
          }
        ],
        [
          {
            name: 'L1'
          },
          {
            name: 'L1'
          },
          {
            name: 'L3'
          }
        ],
        [
          {
            name: 'H2'
          },
          {
            name: 'H2'
          },
          {
            name: 'H1'
          }
        ],
        [
          {
            name: 'H3'
          },
          {
            name: 'H2'
          }
        ],
        [
          {
            name: 'L3'
          }
        ],
        []
      ],
      type: 'tumbleBoard'
    },
    {
      index: 40,
      isRelease: false,
      meterAfter: 0,
      meterBefore: 0,
      position: {
        reel: 5,
        row: 2
      },
      type: 'auroraWildPlace'
    },
    {
      index: 41,
      isRelease: false,
      meterAfter: 0,
      meterBefore: 0,
      position: {
        reel: 2,
        row: 4
      },
      type: 'auroraWildPlace'
    },
    {
      index: 42,
      isRelease: false,
      meterAfter: 0,
      meterBefore: 0,
      position: {
        reel: 3,
        row: 7
      },
      type: 'auroraWildPlace'
    },
    {
      index: 43,
      isRelease: false,
      meterAfter: 0,
      meterBefore: 0,
      position: {
        reel: 4,
        row: 5
      },
      type: 'auroraWildPlace'
    },
    {
      index: 44,
      isRelease: false,
      meterAfter: 0,
      meterBefore: 0,
      position: {
        reel: 2,
        row: 3
      },
      type: 'auroraWildPlace'
    },
    {
      index: 45,
      isRelease: false,
      meterAfter: 0,
      meterBefore: 0,
      position: {
        reel: 1,
        row: 4
      },
      type: 'auroraWildPlace'
    },
    {
      gridMultipliers: [
        [1, 1, 2, 2, 1, 1, 1],
        [1, 1, 2, 2, 2, 1, 1],
        [2, 2, 4, 2, 1, 1, 1],
        [2, 2, 4, 1, 1, 1, 1],
        [1, 1, 2, 2, 1, 1, 1],
        [1, 1, 2, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1]
      ],
      index: 46,
      type: 'updateGrid'
    },
    {
      index: 47,
      totalWin: 4160,
      type: 'winInfo',
      wins: [
        {
          clusterSize: 9,
          meta: {
            clusterMult: 20,
            globalMult: 1,
            overlay: {
              reel: 0,
              row: 4
            },
            winWithoutMult: 190
          },
          positions: [
            {
              reel: 0,
              row: 4
            },
            {
              reel: 1,
              row: 4
            },
            {
              reel: 2,
              row: 4
            },
            {
              reel: 1,
              row: 3
            },
            {
              reel: 1,
              row: 5
            },
            {
              reel: 3,
              row: 4
            },
            {
              reel: 2,
              row: 3
            },
            {
              reel: 3,
              row: 3
            },
            {
              reel: 4,
              row: 3
            }
          ],
          symbol: 'H1',
          win: 3800
        },
        {
          clusterSize: 5,
          meta: {
            clusterMult: 12,
            globalMult: 1,
            overlay: {
              reel: 2,
              row: 1
            },
            winWithoutMult: 30
          },
          positions: [
            {
              reel: 2,
              row: 1
            },
            {
              reel: 2,
              row: 2
            },
            {
              reel: 2,
              row: 3
            },
            {
              reel: 2,
              row: 4
            },
            {
              reel: 1,
              row: 4
            }
          ],
          symbol: 'L1',
          win: 360
        }
      ]
    },
    {
      gridMultipliers: [
        [1, 1, 2, 4, 1, 1, 1],
        [1, 1, 4, 4, 4, 1, 1],
        [4, 4, 8, 4, 1, 1, 1],
        [2, 2, 8, 2, 1, 1, 1],
        [1, 1, 4, 2, 1, 1, 1],
        [1, 1, 2, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1]
      ],
      index: 48,
      type: 'updateGrid'
    },
    {
      amount: 4440,
      index: 49,
      type: 'updateTumbleWin'
    },
    {
      explodingSymbols: [
        {
          reel: 0,
          row: 4
        },
        {
          reel: 1,
          row: 4
        },
        {
          reel: 2,
          row: 4
        },
        {
          reel: 1,
          row: 3
        },
        {
          reel: 1,
          row: 5
        },
        {
          reel: 3,
          row: 4
        },
        {
          reel: 2,
          row: 3
        },
        {
          reel: 3,
          row: 3
        },
        {
          reel: 4,
          row: 3
        },
        {
          reel: 2,
          row: 1
        },
        {
          reel: 2,
          row: 2
        }
      ],
      index: 50,
      newSymbols: [
        [
          {
            name: 'L1'
          }
        ],
        [
          {
            name: 'L1'
          },
          {
            name: 'H1'
          },
          {
            name: 'H1'
          }
        ],
        [
          {
            name: 'H4'
          },
          {
            name: 'L1'
          },
          {
            name: 'L2'
          },
          {
            name: 'L3'
          }
        ],
        [
          {
            name: 'H3'
          },
          {
            name: 'L4'
          }
        ],
        [
          {
            name: 'H2'
          }
        ],
        [],
        []
      ],
      type: 'tumbleBoard'
    },
    {
      amount: 4440,
      index: 51,
      type: 'setWin',
      winLevel: 1
    },
    {
      amount: 4460,
      index: 52,
      type: 'setTotalWin'
    },
    {
      consumedPositions: [
        {
          reel: 2,
          row: 4
        },
        {
          reel: 2,
          row: 3
        },
        {
          reel: 1,
          row: 4
        }
      ],
      delta: 3,
      index: 53,
      meterAfter: 3,
      meterBefore: 0,
      type: 'wildMeterUpdate'
    },
    {
      amount: 6,
      index: 54,
      total: 8,
      type: 'updateFreeSpin'
    },
    {
      anticipation: [0, 0, 0, 0, 0, 0, 0],
      board: [
        [
          {
            name: 'L1'
          },
          {
            name: 'L2'
          },
          {
            name: 'H2'
          },
          {
            aurora: true,
            multiplier: 2,
            name: 'H3'
          },
          {
            multiplier: 4,
            name: 'H1'
          },
          {
            name: 'L2'
          },
          {
            name: 'H1'
          },
          {
            name: 'H1'
          },
          {
            name: 'L1'
          }
        ],
        [
          {
            name: 'L1'
          },
          {
            name: 'H1'
          },
          {
            aurora: true,
            name: 'L1'
          },
          {
            multiplier: 4,
            name: 'L4'
          },
          {
            multiplier: 4,
            name: 'H4'
          },
          {
            multiplier: 4,
            name: 'H3'
          },
          {
            name: 'H2'
          },
          {
            name: 'H3'
          },
          {
            name: 'L1'
          }
        ],
        [
          {
            name: 'L1'
          },
          {
            multiplier: 4,
            name: 'L4'
          },
          {
            multiplier: 4,
            name: 'H3'
          },
          {
            multiplier: 8,
            name: 'L1'
          },
          {
            multiplier: 4,
            name: 'L3'
          },
          {
            name: 'H3'
          },
          {
            name: 'L1'
          },
          {
            name: 'L1'
          },
          {
            name: 'L1'
          }
        ],
        [
          {
            name: 'L1'
          },
          {
            multiplier: 2,
            name: 'H4'
          },
          {
            multiplier: 2,
            name: 'H1'
          },
          {
            multiplier: 8,
            name: 'H1'
          },
          {
            multiplier: 2,
            name: 'H3'
          },
          {
            aurora: true,
            name: 'L1'
          },
          {
            name: 'H2'
          },
          {
            name: 'L2'
          },
          {
            name: 'L1'
          }
        ],
        [
          {
            name: 'L1'
          },
          {
            name: 'H2'
          },
          {
            name: 'H1'
          },
          {
            multiplier: 4,
            name: 'L3'
          },
          {
            multiplier: 2,
            name: 'H1'
          },
          {
            name: 'H2'
          },
          {
            name: 'H1'
          },
          {
            name: 'H2'
          },
          {
            name: 'L1'
          }
        ],
        [
          {
            name: 'L1'
          },
          {
            name: 'H1'
          },
          {
            name: 'H4'
          },
          {
            multiplier: 2,
            name: 'H2'
          },
          {
            name: 'H1'
          },
          {
            name: 'H4'
          },
          {
            name: 'L1'
          },
          {
            name: 'H3'
          },
          {
            name: 'L1'
          }
        ],
        [
          {
            name: 'L1'
          },
          {
            name: 'H2'
          },
          {
            name: 'H1'
          },
          {
            name: 'L2'
          },
          {
            name: 'H2'
          },
          {
            name: 'L1'
          },
          {
            name: 'L1'
          },
          {
            name: 'H1'
          },
          {
            name: 'L1'
          }
        ]
      ],
      gameType: 'freegame',
      index: 55,
      paddingPositions: [49, 110, 209, 238, 56, 19, 12],
      type: 'reveal'
    },
    {
      index: 56,
      positions: [
        {
          reel: 0,
          row: 3
        },
        {
          reel: 1,
          row: 2
        },
        {
          reel: 3,
          row: 5
        }
      ],
      type: 'auroraReveal'
    },
    {
      amount: 4460,
      index: 57,
      type: 'setTotalWin'
    },
    {
      amount: 7,
      index: 58,
      total: 8,
      type: 'updateFreeSpin'
    },
    {
      anticipation: [0, 0, 0, 0, 0, 0, 0],
      board: [
        [
          {
            name: 'L1'
          },
          {
            name: 'L1'
          },
          {
            name: 'L4'
          },
          {
            multiplier: 2,
            name: 'L4'
          },
          {
            aurora: true,
            multiplier: 4,
            name: 'H1'
          },
          {
            name: 'H4'
          },
          {
            name: 'H2'
          },
          {
            name: 'L1'
          },
          {
            name: 'L1'
          }
        ],
        [
          {
            name: 'L1'
          },
          {
            name: 'H4'
          },
          {
            name: 'H1'
          },
          {
            multiplier: 4,
            name: 'H3'
          },
          {
            multiplier: 4,
            name: 'H3'
          },
          {
            multiplier: 4,
            name: 'H2'
          },
          {
            name: 'H1'
          },
          {
            name: 'H2'
          },
          {
            name: 'L1'
          }
        ],
        [
          {
            name: 'L1'
          },
          {
            multiplier: 4,
            name: 'H3'
          },
          {
            multiplier: 4,
            name: 'L3'
          },
          {
            aurora: true,
            multiplier: 8,
            name: 'H3'
          },
          {
            multiplier: 4,
            name: 'L2'
          },
          {
            aurora: true,
            name: 'H1'
          },
          {
            name: 'H4'
          },
          {
            name: 'H3'
          },
          {
            name: 'L1'
          }
        ],
        [
          {
            name: 'L1'
          },
          {
            multiplier: 2,
            name: 'H2'
          },
          {
            multiplier: 2,
            name: 'H2'
          },
          {
            multiplier: 8,
            name: 'H1'
          },
          {
            multiplier: 2,
            name: 'H3'
          },
          {
            name: 'L4'
          },
          {
            name: 'H3'
          },
          {
            name: 'H4'
          },
          {
            name: 'L1'
          }
        ],
        [
          {
            name: 'L1'
          },
          {
            name: 'H3'
          },
          {
            name: 'L3'
          },
          {
            multiplier: 4,
            name: 'H1'
          },
          {
            multiplier: 2,
            name: 'H3'
          },
          {
            name: 'L1'
          },
          {
            name: 'H3'
          },
          {
            name: 'H2'
          },
          {
            name: 'L1'
          }
        ],
        [
          {
            name: 'L1'
          },
          {
            name: 'H1'
          },
          {
            name: 'H1'
          },
          {
            multiplier: 2,
            name: 'H3'
          },
          {
            name: 'H2'
          },
          {
            name: 'L4'
          },
          {
            name: 'H2'
          },
          {
            name: 'L1'
          },
          {
            name: 'L1'
          }
        ],
        [
          {
            name: 'L1'
          },
          {
            aurora: true,
            name: 'L2'
          },
          {
            name: 'L3'
          },
          {
            name: 'H1'
          },
          {
            name: 'H4'
          },
          {
            aurora: true,
            name: 'L2'
          },
          {
            name: 'L3'
          },
          {
            name: 'H3'
          },
          {
            name: 'L1'
          }
        ]
      ],
      gameType: 'freegame',
      index: 59,
      paddingPositions: [91, 173, 187, 50, 139, 151, 185],
      type: 'reveal'
    },
    {
      index: 60,
      positions: [
        {
          reel: 0,
          row: 4
        },
        {
          reel: 2,
          row: 3
        },
        {
          reel: 2,
          row: 5
        },
        {
          reel: 6,
          row: 1
        },
        {
          reel: 6,
          row: 5
        }
      ],
      type: 'auroraReveal'
    },
    {
      amount: 4460,
      index: 61,
      type: 'setTotalWin'
    },
    {
      amount: 8,
      index: 62,
      total: 8,
      type: 'updateFreeSpin'
    },
    {
      anticipation: [0, 0, 0, 0, 0, 0, 0],
      board: [
        [
          {
            name: 'L1'
          },
          {
            name: 'H3'
          },
          {
            aurora: true,
            name: 'L1'
          },
          {
            multiplier: 2,
            name: 'H2'
          },
          {
            aurora: true,
            multiplier: 4,
            name: 'L4'
          },
          {
            name: 'H3'
          },
          {
            name: 'L1'
          },
          {
            name: 'H2'
          },
          {
            name: 'L1'
          }
        ],
        [
          {
            name: 'L1'
          },
          {
            name: 'L2'
          },
          {
            name: 'L1'
          },
          {
            multiplier: 4,
            name: 'L1'
          },
          {
            multiplier: 4,
            name: 'H3'
          },
          {
            multiplier: 4,
            name: 'H2'
          },
          {
            name: 'H2'
          },
          {
            name: 'H1'
          },
          {
            name: 'L1'
          }
        ],
        [
          {
            name: 'L1'
          },
          {
            multiplier: 4,
            name: 'H1'
          },
          {
            multiplier: 4,
            name: 'H2'
          },
          {
            multiplier: 8,
            name: 'L2'
          },
          {
            multiplier: 4,
            name: 'H1'
          },
          {
            name: 'H4'
          },
          {
            name: 'H1'
          },
          {
            name: 'H4'
          },
          {
            name: 'L1'
          }
        ],
        [
          {
            name: 'L1'
          },
          {
            multiplier: 2,
            name: 'H2'
          },
          {
            multiplier: 2,
            name: 'H2'
          },
          {
            multiplier: 8,
            name: 'H2'
          },
          {
            aurora: true,
            multiplier: 2,
            name: 'H1'
          },
          {
            name: 'H3'
          },
          {
            name: 'L4'
          },
          {
            name: 'H3'
          },
          {
            name: 'L1'
          }
        ],
        [
          {
            name: 'L1'
          },
          {
            name: 'H1'
          },
          {
            name: 'H1'
          },
          {
            multiplier: 4,
            name: 'L3'
          },
          {
            multiplier: 2,
            name: 'L4'
          },
          {
            name: 'L4'
          },
          {
            name: 'L4'
          },
          {
            name: 'L1'
          },
          {
            name: 'L1'
          }
        ],
        [
          {
            name: 'L1'
          },
          {
            name: 'H1'
          },
          {
            name: 'L2'
          },
          {
            multiplier: 2,
            name: 'L4'
          },
          {
            name: 'H1'
          },
          {
            name: 'L2'
          },
          {
            name: 'H4'
          },
          {
            name: 'L1'
          },
          {
            name: 'L1'
          }
        ],
        [
          {
            name: 'L1'
          },
          {
            name: 'L1'
          },
          {
            aurora: true,
            name: 'H1'
          },
          {
            name: 'L2'
          },
          {
            name: 'L4'
          },
          {
            name: 'H3'
          },
          {
            name: 'H4'
          },
          {
            name: 'H1'
          },
          {
            name: 'L1'
          }
        ]
      ],
      gameType: 'freegame',
      index: 63,
      paddingPositions: [124, 156, 135, 49, 181, 254, 143],
      type: 'reveal'
    },
    {
      index: 64,
      positions: [
        {
          reel: 0,
          row: 2
        },
        {
          reel: 0,
          row: 4
        },
        {
          reel: 3,
          row: 4
        },
        {
          reel: 6,
          row: 2
        }
      ],
      type: 'auroraReveal'
    },
    {
      amount: 4460,
      index: 65,
      type: 'setTotalWin'
    },
    {
      anticipation: [0, 0, 0, 0, 0, 0, 0],
      board: [
        [
          {
            name: 'L1'
          },
          {
            name: 'L1'
          },
          {
            name: 'H1'
          },
          {
            multiplier: 2,
            name: 'H1'
          },
          {
            multiplier: 4,
            name: 'H1'
          },
          {
            name: 'H1'
          },
          {
            name: 'L3'
          },
          {
            name: 'L1'
          },
          {
            name: 'L1'
          }
        ],
        [
          {
            name: 'L1'
          },
          {
            name: 'H3'
          },
          {
            name: 'H1'
          },
          {
            multiplier: 4,
            name: 'L3'
          },
          {
            multiplier: 4,
            name: 'L2'
          },
          {
            multiplier: 4,
            name: 'L3'
          },
          {
            name: 'H3'
          },
          {
            name: 'L4'
          },
          {
            name: 'L1'
          }
        ],
        [
          {
            name: 'L1'
          },
          {
            multiplier: 4,
            name: 'H3'
          },
          {
            multiplier: 4,
            name: 'L3'
          },
          {
            multiplier: 8,
            name: 'L2'
          },
          {
            multiplier: 4,
            name: 'H1'
          },
          {
            name: 'H2'
          },
          {
            name: 'H2'
          },
          {
            name: 'L3'
          },
          {
            name: 'L1'
          }
        ],
        [
          {
            name: 'L1'
          },
          {
            multiplier: 2,
            name: 'L2'
          },
          {
            multiplier: 2,
            name: 'L2'
          },
          {
            multiplier: 8,
            name: 'L1'
          },
          {
            multiplier: 2,
            name: 'L1'
          },
          {
            name: 'H4'
          },
          {
            name: 'L2'
          },
          {
            name: 'H3'
          },
          {
            name: 'L1'
          }
        ],
        [
          {
            name: 'L1'
          },
          {
            name: 'H1'
          },
          {
            name: 'H1'
          },
          {
            multiplier: 4,
            name: 'L2'
          },
          {
            multiplier: 2,
            name: 'H1'
          },
          {
            name: 'H2'
          },
          {
            name: 'L1'
          },
          {
            name: 'H3'
          },
          {
            name: 'L1'
          }
        ],
        [
          {
            name: 'L1'
          },
          {
            name: 'H2'
          },
          {
            name: 'H4'
          },
          {
            multiplier: 2,
            name: 'H2'
          },
          {
            name: 'H1'
          },
          {
            name: 'H1'
          },
          {
            name: 'L1'
          },
          {
            name: 'H1'
          },
          {
            name: 'L1'
          }
        ],
        [
          {
            name: 'L1'
          },
          {
            name: 'L2'
          },
          {
            name: 'H3'
          },
          {
            name: 'L1'
          },
          {
            name: 'H3'
          },
          {
            name: 'L1'
          },
          {
            name: 'H3'
          },
          {
            name: 'L3'
          },
          {
            name: 'L1'
          }
        ]
      ],
      gameType: 'freegame_wild_release',
      index: 66,
      paddingPositions: [224, 50, 65, 125, 50, 197, 190],
      type: 'reveal'
    },
    {
      gridMultipliers: [
        [1, 1, 2, 4, 1, 1, 1],
        [1, 1, 4, 4, 4, 1, 1],
        [4, 4, 8, 4, 1, 1, 1],
        [2, 2, 8, 2, 1, 1, 1],
        [1, 1, 4, 2, 1, 1, 1],
        [1, 1, 2, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1]
      ],
      index: 67,
      type: 'updateGrid'
    },
    {
      index: 68,
      totalWin: 600,
      type: 'winInfo',
      wins: [
        {
          clusterSize: 5,
          meta: {
            clusterMult: 6,
            globalMult: 1,
            overlay: {
              reel: 0,
              row: 2
            },
            winWithoutMult: 100
          },
          positions: [
            {
              reel: 0,
              row: 2
            },
            {
              reel: 1,
              row: 2
            },
            {
              reel: 0,
              row: 3
            },
            {
              reel: 0,
              row: 4
            },
            {
              reel: 0,
              row: 5
            }
          ],
          symbol: 'H1',
          win: 600
        }
      ]
    },
    {
      gridMultipliers: [
        [1, 2, 4, 8, 2, 1, 1],
        [1, 2, 4, 4, 4, 1, 1],
        [4, 4, 8, 4, 1, 1, 1],
        [2, 2, 8, 2, 1, 1, 1],
        [1, 1, 4, 2, 1, 1, 1],
        [1, 1, 2, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1]
      ],
      index: 69,
      type: 'updateGrid'
    },
    {
      amount: 600,
      index: 70,
      type: 'updateTumbleWin'
    },
    {
      explodingSymbols: [
        {
          reel: 0,
          row: 2
        },
        {
          reel: 1,
          row: 2
        },
        {
          reel: 0,
          row: 3
        },
        {
          reel: 0,
          row: 4
        },
        {
          reel: 0,
          row: 5
        }
      ],
      index: 71,
      newSymbols: [
        [
          {
            name: 'H2'
          },
          {
            name: 'H1'
          },
          {
            name: 'H1'
          },
          {
            name: 'H1'
          }
        ],
        [
          {
            name: 'H2'
          }
        ],
        [],
        [],
        [],
        [],
        []
      ],
      type: 'tumbleBoard'
    },
    {
      index: 72,
      totalWildsCollected: 3,
      type: 'auroraSpinStart'
    },
    {
      index: 73,
      type: 'wildRelease',
      wildsToPlace: 3
    },
    {
      index: 74,
      isRelease: true,
      meterAfter: 2,
      meterBefore: 3,
      position: {
        reel: 3,
        row: 4
      },
      type: 'auroraWildPlace'
    },
    {
      index: 75,
      isRelease: true,
      meterAfter: 1,
      meterBefore: 2,
      position: {
        reel: 3,
        row: 6
      },
      type: 'auroraWildPlace'
    },
    {
      index: 76,
      isRelease: true,
      meterAfter: 0,
      meterBefore: 1,
      position: {
        reel: 3,
        row: 5
      },
      type: 'auroraWildPlace'
    },
    {
      gridMultipliers: [
        [1, 2, 4, 8, 2, 1, 1],
        [1, 2, 4, 4, 4, 1, 1],
        [4, 4, 8, 4, 1, 1, 1],
        [2, 2, 8, 2, 1, 1, 1],
        [1, 1, 4, 2, 1, 1, 1],
        [1, 1, 2, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1]
      ],
      index: 77,
      type: 'updateGrid'
    },
    {
      index: 78,
      totalWin: 1840,
      type: 'winInfo',
      wins: [
        {
          clusterSize: 7,
          meta: {
            clusterMult: 8,
            globalMult: 1,
            overlay: {
              reel: 2,
              row: 4
            },
            winWithoutMult: 140
          },
          positions: [
            {
              reel: 2,
              row: 4
            },
            {
              reel: 3,
              row: 4
            },
            {
              reel: 4,
              row: 4
            },
            {
              reel: 3,
              row: 5
            },
            {
              reel: 5,
              row: 4
            },
            {
              reel: 3,
              row: 6
            },
            {
              reel: 5,
              row: 5
            }
          ],
          symbol: 'H1',
          win: 1120
        },
        {
          clusterSize: 6,
          meta: {
            clusterMult: 2,
            globalMult: 1,
            overlay: {
              reel: 2,
              row: 5
            },
            winWithoutMult: 100
          },
          positions: [
            {
              reel: 2,
              row: 5
            },
            {
              reel: 3,
              row: 5
            },
            {
              reel: 2,
              row: 6
            },
            {
              reel: 4,
              row: 5
            },
            {
              reel: 3,
              row: 4
            },
            {
              reel: 3,
              row: 6
            }
          ],
          symbol: 'H2',
          win: 200
        },
        {
          clusterSize: 5,
          meta: {
            clusterMult: 2,
            globalMult: 1,
            overlay: {
              reel: 3,
              row: 7
            },
            winWithoutMult: 60
          },
          positions: [
            {
              reel: 3,
              row: 7
            },
            {
              reel: 4,
              row: 7
            },
            {
              reel: 3,
              row: 6
            },
            {
              reel: 3,
              row: 5
            },
            {
              reel: 3,
              row: 4
            }
          ],
          symbol: 'H3',
          win: 120
        },
        {
          clusterSize: 6,
          meta: {
            clusterMult: 10,
            globalMult: 1,
            overlay: {
              reel: 3,
              row: 3
            },
            winWithoutMult: 40
          },
          positions: [
            {
              reel: 3,
              row: 3
            },
            {
              reel: 3,
              row: 4
            },
            {
              reel: 3,
              row: 5
            },
            {
              reel: 3,
              row: 6
            },
            {
              reel: 4,
              row: 6
            },
            {
              reel: 5,
              row: 6
            }
          ],
          symbol: 'L1',
          win: 400
        }
      ]
    },
    {
      gridMultipliers: [
        [1, 2, 4, 8, 2, 1, 1],
        [1, 2, 4, 4, 4, 1, 1],
        [4, 4, 8, 8, 2, 2, 1],
        [2, 2, 16, 4, 2, 2, 2],
        [1, 1, 4, 4, 2, 2, 2],
        [1, 1, 2, 2, 2, 2, 1],
        [1, 1, 1, 1, 1, 1, 1]
      ],
      index: 79,
      type: 'updateGrid'
    },
    {
      amount: 2440,
      index: 80,
      type: 'updateTumbleWin'
    },
    {
      explodingSymbols: [
        {
          reel: 2,
          row: 4
        },
        {
          reel: 3,
          row: 4
        },
        {
          reel: 4,
          row: 4
        },
        {
          reel: 3,
          row: 5
        },
        {
          reel: 5,
          row: 4
        },
        {
          reel: 3,
          row: 6
        },
        {
          reel: 5,
          row: 5
        },
        {
          reel: 2,
          row: 5
        },
        {
          reel: 2,
          row: 6
        },
        {
          reel: 4,
          row: 5
        },
        {
          reel: 3,
          row: 7
        },
        {
          reel: 4,
          row: 7
        },
        {
          reel: 3,
          row: 3
        },
        {
          reel: 4,
          row: 6
        },
        {
          reel: 5,
          row: 6
        }
      ],
      index: 81,
      newSymbols: [
        [],
        [],
        [
          {
            name: 'L3'
          },
          {
            name: 'L2'
          },
          {
            name: 'H1'
          }
        ],
        [
          {
            name: 'L3'
          },
          {
            name: 'L1'
          },
          {
            name: 'L1'
          },
          {
            name: 'H4'
          },
          {
            name: 'L2'
          }
        ],
        [
          {
            name: 'H1'
          },
          {
            name: 'L2'
          },
          {
            name: 'H1'
          },
          {
            name: 'H2'
          }
        ],
        [
          {
            name: 'H4'
          },
          {
            name: 'H3'
          },
          {
            name: 'H1'
          }
        ],
        []
      ],
      type: 'tumbleBoard'
    },
    {
      gridMultipliers: [
        [1, 2, 4, 8, 2, 1, 1],
        [1, 2, 4, 4, 4, 1, 1],
        [4, 4, 8, 8, 2, 2, 1],
        [2, 2, 16, 4, 2, 2, 2],
        [1, 1, 4, 4, 2, 2, 2],
        [1, 1, 2, 2, 2, 2, 1],
        [1, 1, 1, 1, 1, 1, 1]
      ],
      index: 82,
      type: 'updateGrid'
    },
    {
      index: 83,
      totalWin: 200,
      type: 'winInfo',
      wins: [
        {
          clusterSize: 5,
          meta: {
            clusterMult: 10,
            globalMult: 1,
            overlay: {
              reel: 2,
              row: 6
            },
            winWithoutMult: 20
          },
          positions: [
            {
              reel: 2,
              row: 6
            },
            {
              reel: 3,
              row: 6
            },
            {
              reel: 3,
              row: 5
            },
            {
              reel: 3,
              row: 7
            },
            {
              reel: 4,
              row: 7
            }
          ],
          symbol: 'L2',
          win: 200
        }
      ]
    },
    {
      gridMultipliers: [
        [1, 2, 4, 8, 2, 1, 1],
        [1, 2, 4, 4, 4, 1, 1],
        [4, 4, 8, 8, 2, 4, 1],
        [2, 2, 16, 4, 4, 4, 4],
        [1, 1, 4, 4, 2, 2, 4],
        [1, 1, 2, 2, 2, 2, 1],
        [1, 1, 1, 1, 1, 1, 1]
      ],
      index: 84,
      type: 'updateGrid'
    },
    {
      amount: 2640,
      index: 85,
      type: 'updateTumbleWin'
    },
    {
      explodingSymbols: [
        {
          reel: 2,
          row: 6
        },
        {
          reel: 3,
          row: 6
        },
        {
          reel: 3,
          row: 5
        },
        {
          reel: 3,
          row: 7
        },
        {
          reel: 4,
          row: 7
        }
      ],
      index: 86,
      newSymbols: [
        [],
        [],
        [
          {
            name: 'H1'
          }
        ],
        [
          {
            name: 'H3'
          },
          {
            name: 'L1'
          },
          {
            name: 'H3'
          }
        ],
        [
          {
            name: 'L1'
          }
        ],
        [],
        []
      ],
      type: 'tumbleBoard'
    },
    {
      amount: 2640,
      index: 87,
      type: 'setWin',
      winLevel: 1
    },
    {
      amount: 7100,
      index: 88,
      type: 'setTotalWin'
    },
    {
      amount: 7080,
      index: 89,
      totalWilds: 6,
      type: 'freeSpinEnd',
      winLevel: 2
    },
    {
      amount: 7100,
      index: 90,
      type: 'finalWin'
    }
  ],
  freeGameWins: 7080,
  id: 113,
  payoutMultiplier: 7100
};
