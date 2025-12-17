export default {
  providerName: 'sample_provider',
  gameName: 'germs', // Updated to your new title
  gameID: '0_0_germs',
  rtp: 0.96, // Tuned for High Volatility
  numReels: 4, // 4x4 Grid
  numRows: [4, 4, 4, 4], 
  
  betModes: {
    base: {
      cost: 1.0,
      feature: true,
      buyBonus: false,
      rtp: 0.96,
      max_win: 50000, 
    },
    bonus: {
      cost: 100.0,
      feature: false,
      buyBonus: true,
      rtp: 0.965,
      max_win: 50000,
    },
  },

  symbols: {
    W: {
      paytable: null,
      special_properties: ['wild'], // The "Mutagen"
    },
    S: {
      paytable: null,
      special_properties: ['scatter'], // The "Biohazard"
    },
    
    // --- LOW PAYS (L4 is lowest, L1 is highest low) ---
    L4: { // formerly "Spore"
      paytable: [
        { '4': 0.02 }, 
        { '3': 0.01 },
      ],
    },
    L3: { // formerly "Amoeba"
      paytable: [
        { '4': 0.03 },
        { '3': 0.01 },
      ],
    },
    L2: { // formerly "Mold"
      paytable: [
        { '4': 0.04 },
        { '3': 0.02 },
      ],
    },
    L1: { // formerly "Yeast"
      paytable: [
        { '4': 0.05 },
        { '3': 0.02 },
      ],
    },

    // --- HIGH PAYS (H5 is lowest high, H1 is Jackpot) ---
    H5: { // formerly "Bacillus"
      paytable: [
        { '4': 0.08 },
        { '3': 0.04 },
      ],
    },
    H4: { // formerly "Spirillum"
      paytable: [
        { '4': 0.10 },
        { '3': 0.05 },
      ],
    },
    H3: { // formerly "Phage"
      paytable: [
        { '4': 0.12 },
        { '3': 0.06 },
      ],
    },
    H2: { // formerly "Superbug B"
      paytable: [
        { '4': 0.15 },
        { '3': 0.08 },
      ],
    },
    H1: { // formerly "Superbug A" (The Jackpot Symbol)
      paytable: [
        { '4': 0.20 }, // With 65,536 ways, this pays ~13,000x
        { '3': 0.10 },
      ],
    },
  },

  paddingReels: {
    basegame: '',
    freegame: '',
    superspingame: '',
  },
};