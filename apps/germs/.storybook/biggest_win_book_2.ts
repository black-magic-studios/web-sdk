// Germs - Consecutive Wins Only (no features)
// Book #6109: payoutMultiplier = 96820  (968.20x)
// 7 consecutive mitosis/respin cycles

export default {
  "id": 6109,
  "payoutMultiplier": 96820,
  "events": [
    {
      "type": "reveal",
      "index": 0,
      "board": [
        [
          {
            "name": "L1",
            "germs": 1
          },
          {
            "name": "H4",
            "germs": 1
          },
          {
            "name": "H1",
            "germs": 1
          },
          {
            "name": "L3",
            "germs": 1
          }
        ],
        [
          {
            "name": "L2",
            "germs": 1
          },
          {
            "name": "H2",
            "germs": 1
          },
          {
            "name": "L1",
            "germs": 1
          },
          {
            "name": "L1",
            "germs": 1
          }
        ],
        [
          {
            "name": "H2",
            "germs": 1
          },
          {
            "name": "L2",
            "germs": 1
          },
          {
            "name": "H4",
            "germs": 1
          },
          {
            "name": "L1",
            "germs": 1
          }
        ],
        [
          {
            "name": "H3",
            "germs": 1
          },
          {
            "name": "L3",
            "germs": 1
          },
          {
            "name": "L1",
            "germs": 1
          },
          {
            "name": "L2",
            "germs": 1
          }
        ]
      ],
      "reelPositions": [
        6,
        18,
        27,
        2
      ],
      "gameType": "basegame",
      "anticipation": [
        0,
        0,
        0,
        0
      ],
      "hostCell": {
        "reel": 1,
        "row": 0
      }
    },
    {
      "type": "updateGerms",
      "index": 1,
      "germs": [
        [
          1,
          1,
          1,
          1
        ],
        [
          1,
          1,
          1,
          1
        ],
        [
          1,
          1,
          1,
          1
        ],
        [
          1,
          1,
          1,
          1
        ]
      ]
    },
    {
      "type": "winInfo",
      "index": 2,
      "totalWin": 400,
      "wins": [
        {
          "symbol": "L1",
          "matchingReels": 4,
          "win": 200,
          "positions": [
            {
              "reel": 0,
              "row": 0
            },
            {
              "reel": 1,
              "row": 2
            },
            {
              "reel": 2,
              "row": 3
            },
            {
              "reel": 3,
              "row": 2
            }
          ],
          "meta": {
            "basePay": 200,
            "germMultiplier": 1,
            "wayCount": 1
          }
        },
        {
          "symbol": "L1",
          "matchingReels": 4,
          "win": 200,
          "positions": [
            {
              "reel": 0,
              "row": 0
            },
            {
              "reel": 1,
              "row": 3
            },
            {
              "reel": 2,
              "row": 3
            },
            {
              "reel": 3,
              "row": 2
            }
          ],
          "meta": {
            "basePay": 200,
            "germMultiplier": 1,
            "wayCount": 1
          }
        }
      ]
    },
    {
      "type": "updateRespinWin",
      "index": 3,
      "amount": 400
    },
    {
      "type": "mitosis",
      "index": 4,
      "mitosisPositions": [
        {
          "reel": 0,
          "row": 0,
          "germsBefore": 1,
          "germsAfter": 2
        },
        {
          "reel": 1,
          "row": 2,
          "germsBefore": 1,
          "germsAfter": 2
        },
        {
          "reel": 1,
          "row": 3,
          "germsBefore": 1,
          "germsAfter": 2
        },
        {
          "reel": 2,
          "row": 3,
          "germsBefore": 1,
          "germsAfter": 2
        },
        {
          "reel": 3,
          "row": 2,
          "germsBefore": 1,
          "germsAfter": 2
        }
      ],
      "germs": [
        [
          2,
          1,
          1,
          1
        ],
        [
          1,
          1,
          2,
          2
        ],
        [
          1,
          1,
          1,
          2
        ],
        [
          1,
          1,
          2,
          1
        ]
      ]
    },
    {
      "type": "respin",
      "index": 5,
      "respinPositions": [
        {
          "reel": 0,
          "row": 0,
          "newSymbol": "H2"
        },
        {
          "reel": 1,
          "row": 2,
          "newSymbol": "H2"
        },
        {
          "reel": 1,
          "row": 3,
          "newSymbol": "L1"
        },
        {
          "reel": 2,
          "row": 3,
          "newSymbol": "L3"
        },
        {
          "reel": 3,
          "row": 2,
          "newSymbol": "L3"
        }
      ],
      "boardAfter": [
        [
          {
            "name": "H2",
            "germs": 2
          },
          {
            "name": "H4",
            "germs": 1
          },
          {
            "name": "H1",
            "germs": 1
          },
          {
            "name": "L3",
            "germs": 1
          }
        ],
        [
          {
            "name": "L2",
            "germs": 1
          },
          {
            "name": "H2",
            "germs": 1
          },
          {
            "name": "H2",
            "germs": 2
          },
          {
            "name": "L1",
            "germs": 2
          }
        ],
        [
          {
            "name": "H2",
            "germs": 1
          },
          {
            "name": "L2",
            "germs": 1
          },
          {
            "name": "H4",
            "germs": 1
          },
          {
            "name": "L3",
            "germs": 2
          }
        ],
        [
          {
            "name": "H3",
            "germs": 1
          },
          {
            "name": "L3",
            "germs": 1
          },
          {
            "name": "L3",
            "germs": 2
          },
          {
            "name": "L2",
            "germs": 1
          }
        ]
      ]
    },
    {
      "type": "updateGerms",
      "index": 6,
      "germs": [
        [
          2,
          1,
          1,
          1
        ],
        [
          1,
          1,
          2,
          2
        ],
        [
          1,
          1,
          1,
          2
        ],
        [
          1,
          1,
          2,
          1
        ]
      ]
    },
    {
      "type": "winInfo",
      "index": 7,
      "totalWin": 900,
      "wins": [
        {
          "symbol": "H2",
          "matchingReels": 3,
          "win": 300,
          "positions": [
            {
              "reel": 0,
              "row": 0
            },
            {
              "reel": 1,
              "row": 1
            },
            {
              "reel": 2,
              "row": 0
            }
          ],
          "meta": {
            "basePay": 150,
            "germMultiplier": 2,
            "wayCount": 1
          }
        },
        {
          "symbol": "H2",
          "matchingReels": 3,
          "win": 600,
          "positions": [
            {
              "reel": 0,
              "row": 0
            },
            {
              "reel": 1,
              "row": 2
            },
            {
              "reel": 2,
              "row": 0
            }
          ],
          "meta": {
            "basePay": 150,
            "germMultiplier": 4,
            "wayCount": 1
          }
        }
      ]
    },
    {
      "type": "updateRespinWin",
      "index": 8,
      "amount": 1300
    },
    {
      "type": "mitosis",
      "index": 9,
      "mitosisPositions": [
        {
          "reel": 0,
          "row": 0,
          "germsBefore": 2,
          "germsAfter": 4
        },
        {
          "reel": 1,
          "row": 1,
          "germsBefore": 1,
          "germsAfter": 2
        },
        {
          "reel": 1,
          "row": 2,
          "germsBefore": 2,
          "germsAfter": 4
        },
        {
          "reel": 2,
          "row": 0,
          "germsBefore": 1,
          "germsAfter": 2
        }
      ],
      "germs": [
        [
          4,
          1,
          1,
          1
        ],
        [
          1,
          2,
          4,
          2
        ],
        [
          2,
          1,
          1,
          2
        ],
        [
          1,
          1,
          2,
          1
        ]
      ]
    },
    {
      "type": "respin",
      "index": 10,
      "respinPositions": [
        {
          "reel": 0,
          "row": 0,
          "newSymbol": "L4"
        },
        {
          "reel": 1,
          "row": 1,
          "newSymbol": "L3"
        },
        {
          "reel": 1,
          "row": 2,
          "newSymbol": "L4"
        },
        {
          "reel": 2,
          "row": 0,
          "newSymbol": "H2"
        }
      ],
      "boardAfter": [
        [
          {
            "name": "L4",
            "germs": 4
          },
          {
            "name": "H4",
            "germs": 1
          },
          {
            "name": "H1",
            "germs": 1
          },
          {
            "name": "L3",
            "germs": 1
          }
        ],
        [
          {
            "name": "L2",
            "germs": 1
          },
          {
            "name": "L3",
            "germs": 2
          },
          {
            "name": "L4",
            "germs": 4
          },
          {
            "name": "L1",
            "germs": 2
          }
        ],
        [
          {
            "name": "H2",
            "germs": 2
          },
          {
            "name": "L2",
            "germs": 1
          },
          {
            "name": "H4",
            "germs": 1
          },
          {
            "name": "L3",
            "germs": 2
          }
        ],
        [
          {
            "name": "H3",
            "germs": 1
          },
          {
            "name": "L3",
            "germs": 1
          },
          {
            "name": "L3",
            "germs": 2
          },
          {
            "name": "L2",
            "germs": 1
          }
        ]
      ]
    },
    {
      "type": "updateGerms",
      "index": 11,
      "germs": [
        [
          4,
          1,
          1,
          1
        ],
        [
          1,
          2,
          4,
          2
        ],
        [
          2,
          1,
          1,
          2
        ],
        [
          1,
          1,
          2,
          1
        ]
      ]
    },
    {
      "type": "winInfo",
      "index": 12,
      "totalWin": 1200,
      "wins": [
        {
          "symbol": "L3",
          "matchingReels": 4,
          "win": 400,
          "positions": [
            {
              "reel": 0,
              "row": 3
            },
            {
              "reel": 1,
              "row": 1
            },
            {
              "reel": 2,
              "row": 3
            },
            {
              "reel": 3,
              "row": 1
            }
          ],
          "meta": {
            "basePay": 100,
            "germMultiplier": 4,
            "wayCount": 1
          }
        },
        {
          "symbol": "L3",
          "matchingReels": 4,
          "win": 800,
          "positions": [
            {
              "reel": 0,
              "row": 3
            },
            {
              "reel": 1,
              "row": 1
            },
            {
              "reel": 2,
              "row": 3
            },
            {
              "reel": 3,
              "row": 2
            }
          ],
          "meta": {
            "basePay": 100,
            "germMultiplier": 8,
            "wayCount": 1
          }
        }
      ]
    },
    {
      "type": "updateRespinWin",
      "index": 13,
      "amount": 2500
    },
    {
      "type": "mitosis",
      "index": 14,
      "mitosisPositions": [
        {
          "reel": 0,
          "row": 3,
          "germsBefore": 1,
          "germsAfter": 2
        },
        {
          "reel": 1,
          "row": 1,
          "germsBefore": 2,
          "germsAfter": 4
        },
        {
          "reel": 2,
          "row": 3,
          "germsBefore": 2,
          "germsAfter": 4
        },
        {
          "reel": 3,
          "row": 1,
          "germsBefore": 1,
          "germsAfter": 2
        },
        {
          "reel": 3,
          "row": 2,
          "germsBefore": 2,
          "germsAfter": 4
        }
      ],
      "germs": [
        [
          4,
          1,
          1,
          2
        ],
        [
          1,
          4,
          4,
          2
        ],
        [
          2,
          1,
          1,
          4
        ],
        [
          1,
          2,
          4,
          1
        ]
      ]
    },
    {
      "type": "respin",
      "index": 15,
      "respinPositions": [
        {
          "reel": 0,
          "row": 3,
          "newSymbol": "H2"
        },
        {
          "reel": 1,
          "row": 1,
          "newSymbol": "L1"
        },
        {
          "reel": 2,
          "row": 3,
          "newSymbol": "L4"
        },
        {
          "reel": 3,
          "row": 1,
          "newSymbol": "L2"
        },
        {
          "reel": 3,
          "row": 2,
          "newSymbol": "L1"
        }
      ],
      "boardAfter": [
        [
          {
            "name": "L4",
            "germs": 4
          },
          {
            "name": "H4",
            "germs": 1
          },
          {
            "name": "H1",
            "germs": 1
          },
          {
            "name": "H2",
            "germs": 2
          }
        ],
        [
          {
            "name": "L2",
            "germs": 1
          },
          {
            "name": "L1",
            "germs": 4
          },
          {
            "name": "L4",
            "germs": 4
          },
          {
            "name": "L1",
            "germs": 2
          }
        ],
        [
          {
            "name": "H2",
            "germs": 2
          },
          {
            "name": "L2",
            "germs": 1
          },
          {
            "name": "H4",
            "germs": 1
          },
          {
            "name": "L4",
            "germs": 4
          }
        ],
        [
          {
            "name": "H3",
            "germs": 1
          },
          {
            "name": "L2",
            "germs": 2
          },
          {
            "name": "L1",
            "germs": 4
          },
          {
            "name": "L2",
            "germs": 1
          }
        ]
      ]
    },
    {
      "type": "updateGerms",
      "index": 16,
      "germs": [
        [
          4,
          1,
          1,
          2
        ],
        [
          1,
          4,
          4,
          2
        ],
        [
          2,
          1,
          1,
          4
        ],
        [
          1,
          2,
          4,
          1
        ]
      ]
    },
    {
      "type": "winInfo",
      "index": 17,
      "totalWin": 1280,
      "wins": [
        {
          "symbol": "L4",
          "matchingReels": 3,
          "win": 1280,
          "positions": [
            {
              "reel": 0,
              "row": 0
            },
            {
              "reel": 1,
              "row": 2
            },
            {
              "reel": 2,
              "row": 3
            }
          ],
          "meta": {
            "basePay": 20,
            "germMultiplier": 64,
            "wayCount": 1
          }
        }
      ]
    },
    {
      "type": "updateRespinWin",
      "index": 18,
      "amount": 3780
    },
    {
      "type": "mitosis",
      "index": 19,
      "mitosisPositions": [
        {
          "reel": 0,
          "row": 0,
          "germsBefore": 4,
          "germsAfter": 8
        },
        {
          "reel": 1,
          "row": 2,
          "germsBefore": 4,
          "germsAfter": 8
        },
        {
          "reel": 2,
          "row": 3,
          "germsBefore": 4,
          "germsAfter": 8
        }
      ],
      "germs": [
        [
          8,
          1,
          1,
          2
        ],
        [
          1,
          4,
          8,
          2
        ],
        [
          2,
          1,
          1,
          8
        ],
        [
          1,
          2,
          4,
          1
        ]
      ]
    },
    {
      "type": "respin",
      "index": 20,
      "respinPositions": [
        {
          "reel": 0,
          "row": 0,
          "newSymbol": "L1"
        },
        {
          "reel": 1,
          "row": 2,
          "newSymbol": "H2"
        },
        {
          "reel": 2,
          "row": 3,
          "newSymbol": "L4"
        }
      ],
      "boardAfter": [
        [
          {
            "name": "L1",
            "germs": 8
          },
          {
            "name": "H4",
            "germs": 1
          },
          {
            "name": "H1",
            "germs": 1
          },
          {
            "name": "H2",
            "germs": 2
          }
        ],
        [
          {
            "name": "L2",
            "germs": 1
          },
          {
            "name": "L1",
            "germs": 4
          },
          {
            "name": "H2",
            "germs": 8
          },
          {
            "name": "L1",
            "germs": 2
          }
        ],
        [
          {
            "name": "H2",
            "germs": 2
          },
          {
            "name": "L2",
            "germs": 1
          },
          {
            "name": "H4",
            "germs": 1
          },
          {
            "name": "L4",
            "germs": 8
          }
        ],
        [
          {
            "name": "H3",
            "germs": 1
          },
          {
            "name": "L2",
            "germs": 2
          },
          {
            "name": "L1",
            "germs": 4
          },
          {
            "name": "L2",
            "germs": 1
          }
        ]
      ]
    },
    {
      "type": "updateGerms",
      "index": 21,
      "germs": [
        [
          8,
          1,
          1,
          2
        ],
        [
          1,
          4,
          8,
          2
        ],
        [
          2,
          1,
          1,
          8
        ],
        [
          1,
          2,
          4,
          1
        ]
      ]
    },
    {
      "type": "winInfo",
      "index": 22,
      "totalWin": 4800,
      "wins": [
        {
          "symbol": "H2",
          "matchingReels": 3,
          "win": 4800,
          "positions": [
            {
              "reel": 0,
              "row": 3
            },
            {
              "reel": 1,
              "row": 2
            },
            {
              "reel": 2,
              "row": 0
            }
          ],
          "meta": {
            "basePay": 150,
            "germMultiplier": 32,
            "wayCount": 1
          }
        }
      ]
    },
    {
      "type": "updateRespinWin",
      "index": 23,
      "amount": 8580
    },
    {
      "type": "mitosis",
      "index": 24,
      "mitosisPositions": [
        {
          "reel": 0,
          "row": 3,
          "germsBefore": 2,
          "germsAfter": 4
        },
        {
          "reel": 1,
          "row": 2,
          "germsBefore": 8,
          "germsAfter": 16
        },
        {
          "reel": 2,
          "row": 0,
          "germsBefore": 2,
          "germsAfter": 4
        }
      ],
      "germs": [
        [
          8,
          1,
          1,
          4
        ],
        [
          1,
          4,
          16,
          2
        ],
        [
          4,
          1,
          1,
          8
        ],
        [
          1,
          2,
          4,
          1
        ]
      ]
    },
    {
      "type": "respin",
      "index": 25,
      "respinPositions": [
        {
          "reel": 0,
          "row": 3,
          "newSymbol": "H2"
        },
        {
          "reel": 1,
          "row": 2,
          "newSymbol": "H4"
        },
        {
          "reel": 2,
          "row": 0,
          "newSymbol": "H2"
        }
      ],
      "boardAfter": [
        [
          {
            "name": "L1",
            "germs": 8
          },
          {
            "name": "H4",
            "germs": 1
          },
          {
            "name": "H1",
            "germs": 1
          },
          {
            "name": "H2",
            "germs": 4
          }
        ],
        [
          {
            "name": "L2",
            "germs": 1
          },
          {
            "name": "L1",
            "germs": 4
          },
          {
            "name": "H4",
            "germs": 16
          },
          {
            "name": "L1",
            "germs": 2
          }
        ],
        [
          {
            "name": "H2",
            "germs": 4
          },
          {
            "name": "L2",
            "germs": 1
          },
          {
            "name": "H4",
            "germs": 1
          },
          {
            "name": "L4",
            "germs": 8
          }
        ],
        [
          {
            "name": "H3",
            "germs": 1
          },
          {
            "name": "L2",
            "germs": 2
          },
          {
            "name": "L1",
            "germs": 4
          },
          {
            "name": "L2",
            "germs": 1
          }
        ]
      ]
    },
    {
      "type": "updateGerms",
      "index": 26,
      "germs": [
        [
          8,
          1,
          1,
          4
        ],
        [
          1,
          4,
          16,
          2
        ],
        [
          4,
          1,
          1,
          8
        ],
        [
          1,
          2,
          4,
          1
        ]
      ]
    },
    {
      "type": "winInfo",
      "index": 27,
      "totalWin": 1200,
      "wins": [
        {
          "symbol": "H4",
          "matchingReels": 3,
          "win": 1200,
          "positions": [
            {
              "reel": 0,
              "row": 1
            },
            {
              "reel": 1,
              "row": 2
            },
            {
              "reel": 2,
              "row": 2
            }
          ],
          "meta": {
            "basePay": 75,
            "germMultiplier": 16,
            "wayCount": 1
          }
        }
      ]
    },
    {
      "type": "updateRespinWin",
      "index": 28,
      "amount": 9780
    },
    {
      "type": "mitosis",
      "index": 29,
      "mitosisPositions": [
        {
          "reel": 0,
          "row": 1,
          "germsBefore": 1,
          "germsAfter": 2
        },
        {
          "reel": 1,
          "row": 2,
          "germsBefore": 16,
          "germsAfter": 32
        },
        {
          "reel": 2,
          "row": 2,
          "germsBefore": 1,
          "germsAfter": 2
        }
      ],
      "germs": [
        [
          8,
          2,
          1,
          4
        ],
        [
          1,
          4,
          32,
          2
        ],
        [
          4,
          1,
          2,
          8
        ],
        [
          1,
          2,
          4,
          1
        ]
      ]
    },
    {
      "type": "respin",
      "index": 30,
      "respinPositions": [
        {
          "reel": 0,
          "row": 1,
          "newSymbol": "L4"
        },
        {
          "reel": 1,
          "row": 2,
          "newSymbol": "WD"
        },
        {
          "reel": 2,
          "row": 2,
          "newSymbol": "L3"
        }
      ],
      "boardAfter": [
        [
          {
            "name": "L1",
            "germs": 8
          },
          {
            "name": "L4",
            "germs": 2
          },
          {
            "name": "H1",
            "germs": 1
          },
          {
            "name": "H2",
            "germs": 4
          }
        ],
        [
          {
            "name": "L2",
            "germs": 1
          },
          {
            "name": "L1",
            "germs": 4
          },
          {
            "name": "WD",
            "germs": 32
          },
          {
            "name": "L1",
            "germs": 2
          }
        ],
        [
          {
            "name": "H2",
            "germs": 4
          },
          {
            "name": "L2",
            "germs": 1
          },
          {
            "name": "L3",
            "germs": 2
          },
          {
            "name": "L4",
            "germs": 8
          }
        ],
        [
          {
            "name": "H3",
            "germs": 1
          },
          {
            "name": "L2",
            "germs": 2
          },
          {
            "name": "L1",
            "germs": 4
          },
          {
            "name": "L2",
            "germs": 1
          }
        ]
      ]
    },
    {
      "type": "updateGerms",
      "index": 31,
      "germs": [
        [
          8,
          2,
          1,
          4
        ],
        [
          1,
          4,
          32,
          2
        ],
        [
          4,
          1,
          2,
          8
        ],
        [
          1,
          2,
          4,
          1
        ]
      ]
    },
    {
      "type": "winInfo",
      "index": 32,
      "totalWin": 87040,
      "wins": [
        {
          "symbol": "H2",
          "matchingReels": 3,
          "win": 76800,
          "positions": [
            {
              "reel": 0,
              "row": 3
            },
            {
              "reel": 1,
              "row": 2
            },
            {
              "reel": 2,
              "row": 0
            }
          ],
          "meta": {
            "basePay": 150,
            "germMultiplier": 512,
            "wayCount": 1
          }
        },
        {
          "symbol": "L4",
          "matchingReels": 3,
          "win": 10240,
          "positions": [
            {
              "reel": 0,
              "row": 1
            },
            {
              "reel": 1,
              "row": 2
            },
            {
              "reel": 2,
              "row": 3
            }
          ],
          "meta": {
            "basePay": 20,
            "germMultiplier": 512,
            "wayCount": 1
          }
        }
      ]
    },
    {
      "type": "updateRespinWin",
      "index": 33,
      "amount": 96820
    },
    {
      "type": "mitosis",
      "index": 34,
      "mitosisPositions": [
        {
          "reel": 0,
          "row": 1,
          "germsBefore": 2,
          "germsAfter": 4
        },
        {
          "reel": 0,
          "row": 3,
          "germsBefore": 4,
          "germsAfter": 8
        },
        {
          "reel": 1,
          "row": 2,
          "germsBefore": 32,
          "germsAfter": 64
        },
        {
          "reel": 2,
          "row": 0,
          "germsBefore": 4,
          "germsAfter": 8
        },
        {
          "reel": 2,
          "row": 3,
          "germsBefore": 8,
          "germsAfter": 16
        }
      ],
      "germs": [
        [
          8,
          4,
          1,
          8
        ],
        [
          1,
          4,
          64,
          2
        ],
        [
          8,
          1,
          2,
          16
        ],
        [
          1,
          2,
          4,
          1
        ]
      ]
    },
    {
      "type": "respin",
      "index": 35,
      "respinPositions": [
        {
          "reel": 0,
          "row": 1,
          "newSymbol": "H3"
        },
        {
          "reel": 0,
          "row": 3,
          "newSymbol": "H2"
        },
        {
          "reel": 1,
          "row": 2,
          "newSymbol": "H4"
        },
        {
          "reel": 2,
          "row": 0,
          "newSymbol": "L3"
        },
        {
          "reel": 2,
          "row": 3,
          "newSymbol": "L4"
        }
      ],
      "boardAfter": [
        [
          {
            "name": "L1",
            "germs": 8
          },
          {
            "name": "H3",
            "germs": 4
          },
          {
            "name": "H1",
            "germs": 1
          },
          {
            "name": "H2",
            "germs": 8
          }
        ],
        [
          {
            "name": "L2",
            "germs": 1
          },
          {
            "name": "L1",
            "germs": 4
          },
          {
            "name": "H4",
            "germs": 64
          },
          {
            "name": "L1",
            "germs": 2
          }
        ],
        [
          {
            "name": "L3",
            "germs": 8
          },
          {
            "name": "L2",
            "germs": 1
          },
          {
            "name": "L3",
            "germs": 2
          },
          {
            "name": "L4",
            "germs": 16
          }
        ],
        [
          {
            "name": "H3",
            "germs": 1
          },
          {
            "name": "L2",
            "germs": 2
          },
          {
            "name": "L1",
            "germs": 4
          },
          {
            "name": "L2",
            "germs": 1
          }
        ]
      ]
    },
    {
      "type": "updateGerms",
      "index": 36,
      "germs": [
        [
          8,
          4,
          1,
          8
        ],
        [
          1,
          4,
          64,
          2
        ],
        [
          8,
          1,
          2,
          16
        ],
        [
          1,
          2,
          4,
          1
        ]
      ]
    },
    {
      "type": "setWin",
      "index": 37,
      "amount": 96820,
      "winLevel": 3
    },
    {
      "type": "setTotalWin",
      "index": 38,
      "amount": 96820
    },
    {
      "type": "finalWin",
      "index": 39,
      "amount": 96820
    }
  ],
  "criteria": "basegame",
  "baseGameWins": 96820,
  "freeGameWins": 0,
  "mode": "base",
  "strain": "alpha",
  "anteBet": false
};
