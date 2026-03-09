// Germs - Best Chain Win (no host infection)
// Book #405: payoutMultiplier = 19600  (196.00x)
// 3 consecutive mitosis/respin cycles

export default {
  "id": 405,
  "payoutMultiplier": 19600,
  "events": [
    {
      "type": "reveal",
      "index": 0,
      "board": [
        [
          {
            "name": "L4",
            "germs": 1
          },
          {
            "name": "BL",
            "germs": 1
          },
          {
            "name": "L4",
            "germs": 1
          },
          {
            "name": "L2",
            "germs": 1
          }
        ],
        [
          {
            "name": "L1",
            "germs": 1
          },
          {
            "name": "L3",
            "germs": 1
          },
          {
            "name": "L4",
            "germs": 1
          },
          {
            "name": "L2",
            "germs": 1
          }
        ],
        [
          {
            "name": "H2",
            "germs": 1
          },
          {
            "name": "H2",
            "germs": 1
          },
          {
            "name": "L2",
            "germs": 1
          },
          {
            "name": "L3",
            "germs": 1
          }
        ],
        [
          {
            "name": "L4",
            "germs": 1
          },
          {
            "name": "H1",
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
        ]
      ],
      "reelPositions": [
        21,
        21,
        2,
        25
      ],
      "gameType": "basegame",
      "anticipation": [
        0,
        0,
        0,
        0
      ],
      "hostCell": {
        "reel": 2,
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
      "totalWin": 40,
      "wins": [
        {
          "symbol": "L2",
          "matchingReels": 3,
          "win": 40,
          "positions": [
            {
              "reel": 0,
              "row": 3
            },
            {
              "reel": 1,
              "row": 3
            },
            {
              "reel": 2,
              "row": 2
            }
          ],
          "meta": {
            "basePay": 40,
            "germMultiplier": 1,
            "wayCount": 1
          }
        }
      ]
    },
    {
      "type": "updateRespinWin",
      "index": 3,
      "amount": 40
    },
    {
      "type": "mitosis",
      "index": 4,
      "mitosisPositions": [
        {
          "reel": 0,
          "row": 3,
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
          "row": 2,
          "germsBefore": 1,
          "germsAfter": 2
        }
      ],
      "germs": [
        [
          1,
          1,
          1,
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
      "type": "respin",
      "index": 5,
      "respinPositions": [
        {
          "reel": 0,
          "row": 3,
          "newSymbol": "L3"
        },
        {
          "reel": 1,
          "row": 3,
          "newSymbol": "H4"
        },
        {
          "reel": 2,
          "row": 2,
          "newSymbol": "L4"
        }
      ],
      "boardAfter": [
        [
          {
            "name": "L4",
            "germs": 1
          },
          {
            "name": "BL",
            "germs": 1
          },
          {
            "name": "L4",
            "germs": 1
          },
          {
            "name": "L3",
            "germs": 2
          }
        ],
        [
          {
            "name": "L1",
            "germs": 1
          },
          {
            "name": "L3",
            "germs": 1
          },
          {
            "name": "L4",
            "germs": 1
          },
          {
            "name": "H4",
            "germs": 2
          }
        ],
        [
          {
            "name": "H2",
            "germs": 1
          },
          {
            "name": "H2",
            "germs": 1
          },
          {
            "name": "L4",
            "germs": 2
          },
          {
            "name": "L3",
            "germs": 1
          }
        ],
        [
          {
            "name": "L4",
            "germs": 1
          },
          {
            "name": "H1",
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
        ]
      ]
    },
    {
      "type": "updateGerms",
      "index": 6,
      "germs": [
        [
          1,
          1,
          1,
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
      "index": 7,
      "totalWin": 360,
      "wins": [
        {
          "symbol": "L3",
          "matchingReels": 3,
          "win": 60,
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
            }
          ],
          "meta": {
            "basePay": 30,
            "germMultiplier": 2,
            "wayCount": 1
          }
        },
        {
          "symbol": "L4",
          "matchingReels": 4,
          "win": 150,
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
              "row": 2
            },
            {
              "reel": 3,
              "row": 0
            }
          ],
          "meta": {
            "basePay": 75,
            "germMultiplier": 2,
            "wayCount": 1
          }
        },
        {
          "symbol": "L4",
          "matchingReels": 4,
          "win": 150,
          "positions": [
            {
              "reel": 0,
              "row": 2
            },
            {
              "reel": 1,
              "row": 2
            },
            {
              "reel": 2,
              "row": 2
            },
            {
              "reel": 3,
              "row": 0
            }
          ],
          "meta": {
            "basePay": 75,
            "germMultiplier": 2,
            "wayCount": 1
          }
        }
      ]
    },
    {
      "type": "updateRespinWin",
      "index": 8,
      "amount": 400
    },
    {
      "type": "mitosis",
      "index": 9,
      "mitosisPositions": [
        {
          "reel": 0,
          "row": 0,
          "germsBefore": 1,
          "germsAfter": 2
        },
        {
          "reel": 0,
          "row": 2,
          "germsBefore": 1,
          "germsAfter": 2
        },
        {
          "reel": 0,
          "row": 3,
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
          "germsBefore": 1,
          "germsAfter": 2
        },
        {
          "reel": 2,
          "row": 2,
          "germsBefore": 2,
          "germsAfter": 4
        },
        {
          "reel": 2,
          "row": 3,
          "germsBefore": 1,
          "germsAfter": 2
        },
        {
          "reel": 3,
          "row": 0,
          "germsBefore": 1,
          "germsAfter": 2
        }
      ],
      "germs": [
        [
          2,
          1,
          2,
          4
        ],
        [
          1,
          2,
          2,
          2
        ],
        [
          1,
          1,
          4,
          2
        ],
        [
          2,
          1,
          1,
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
          "newSymbol": "L1"
        },
        {
          "reel": 0,
          "row": 2,
          "newSymbol": "L4"
        },
        {
          "reel": 0,
          "row": 3,
          "newSymbol": "H4"
        },
        {
          "reel": 1,
          "row": 1,
          "newSymbol": "H2"
        },
        {
          "reel": 1,
          "row": 2,
          "newSymbol": "H4"
        },
        {
          "reel": 2,
          "row": 2,
          "newSymbol": "H4"
        },
        {
          "reel": 2,
          "row": 3,
          "newSymbol": "H2"
        },
        {
          "reel": 3,
          "row": 0,
          "newSymbol": "L4"
        }
      ],
      "boardAfter": [
        [
          {
            "name": "L1",
            "germs": 2
          },
          {
            "name": "BL",
            "germs": 1
          },
          {
            "name": "L4",
            "germs": 2
          },
          {
            "name": "H4",
            "germs": 4
          }
        ],
        [
          {
            "name": "L1",
            "germs": 1
          },
          {
            "name": "H2",
            "germs": 2
          },
          {
            "name": "H4",
            "germs": 2
          },
          {
            "name": "H4",
            "germs": 2
          }
        ],
        [
          {
            "name": "H2",
            "germs": 1
          },
          {
            "name": "H2",
            "germs": 1
          },
          {
            "name": "H4",
            "germs": 4
          },
          {
            "name": "H2",
            "germs": 2
          }
        ],
        [
          {
            "name": "L4",
            "germs": 2
          },
          {
            "name": "H1",
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
        ]
      ]
    },
    {
      "type": "updateGerms",
      "index": 11,
      "germs": [
        [
          2,
          1,
          2,
          4
        ],
        [
          1,
          2,
          2,
          2
        ],
        [
          1,
          1,
          4,
          2
        ],
        [
          2,
          1,
          1,
          1
        ]
      ]
    },
    {
      "type": "winInfo",
      "index": 12,
      "totalWin": 19200,
      "wins": [
        {
          "symbol": "H4",
          "matchingReels": 4,
          "win": 9600,
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
              "row": 2
            },
            {
              "reel": 3,
              "row": 2
            }
          ],
          "meta": {
            "basePay": 300,
            "germMultiplier": 32,
            "wayCount": 1
          }
        },
        {
          "symbol": "H4",
          "matchingReels": 4,
          "win": 9600,
          "positions": [
            {
              "reel": 0,
              "row": 3
            },
            {
              "reel": 1,
              "row": 3
            },
            {
              "reel": 2,
              "row": 2
            },
            {
              "reel": 3,
              "row": 2
            }
          ],
          "meta": {
            "basePay": 300,
            "germMultiplier": 32,
            "wayCount": 1
          }
        }
      ]
    },
    {
      "type": "updateRespinWin",
      "index": 13,
      "amount": 19600
    },
    {
      "type": "mitosis",
      "index": 14,
      "mitosisPositions": [
        {
          "reel": 0,
          "row": 3,
          "germsBefore": 4,
          "germsAfter": 8
        },
        {
          "reel": 1,
          "row": 2,
          "germsBefore": 2,
          "germsAfter": 4
        },
        {
          "reel": 1,
          "row": 3,
          "germsBefore": 2,
          "germsAfter": 4
        },
        {
          "reel": 2,
          "row": 2,
          "germsBefore": 4,
          "germsAfter": 8
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
          2,
          8
        ],
        [
          1,
          2,
          4,
          4
        ],
        [
          1,
          1,
          8,
          2
        ],
        [
          2,
          1,
          2,
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
          "newSymbol": "L4"
        },
        {
          "reel": 1,
          "row": 2,
          "newSymbol": "L3"
        },
        {
          "reel": 1,
          "row": 3,
          "newSymbol": "H2"
        },
        {
          "reel": 2,
          "row": 2,
          "newSymbol": "BL"
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
            "name": "L1",
            "germs": 2
          },
          {
            "name": "BL",
            "germs": 1
          },
          {
            "name": "L4",
            "germs": 2
          },
          {
            "name": "L4",
            "germs": 8
          }
        ],
        [
          {
            "name": "L1",
            "germs": 1
          },
          {
            "name": "H2",
            "germs": 2
          },
          {
            "name": "L3",
            "germs": 4
          },
          {
            "name": "H2",
            "germs": 4
          }
        ],
        [
          {
            "name": "H2",
            "germs": 1
          },
          {
            "name": "H2",
            "germs": 1
          },
          {
            "name": "BL",
            "germs": 8
          },
          {
            "name": "H2",
            "germs": 2
          }
        ],
        [
          {
            "name": "L4",
            "germs": 2
          },
          {
            "name": "H1",
            "germs": 1
          },
          {
            "name": "L1",
            "germs": 2
          },
          {
            "name": "L1",
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
          2,
          1,
          2,
          8
        ],
        [
          1,
          2,
          4,
          4
        ],
        [
          1,
          1,
          8,
          2
        ],
        [
          2,
          1,
          2,
          1
        ]
      ]
    },
    {
      "type": "setWin",
      "index": 17,
      "amount": 19600,
      "winLevel": 3
    },
    {
      "type": "setTotalWin",
      "index": 18,
      "amount": 19600
    },
    {
      "type": "finalWin",
      "index": 19,
      "amount": 19600
    }
  ],
  "criteria": "basegame",
  "baseGameWins": 19600,
  "freeGameWins": 0,
  "mode": "base",
  "strain": "alpha",
  "anteBet": false
};
