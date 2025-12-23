export default {
  providerName: 'sample_provider',
  gameName: 'germs',
  gameID: '0_0_germs',
  rtp: 0.96,
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
    // --- SPECIALS ---
    W: {
      paytable: null,
      special_properties: ['wild'], // The "Mutagen"
    },
    S: {
      paytable: null,
      special_properties: ['scatter'], // The "Biohazard"
    },
    
    // --- LOW PAYS (The Culture) ---
    // Note: Values are tiny (0.002) because they get multiplied by Density (Ways)
    L4: { // formerly "Spore"
      paytable: [
        { '4': 0.002 }, 
        { '3': 0.001 },
      ],
    },
    L3: { // formerly "Amoeba"
      paytable: [
        { '4': 0.003 },
        { '3': 0.001 },
      ],
    },
    L2: { // formerly "Mold"
      paytable: [
        { '4': 0.004 },
        { '3': 0.002 },
      ],
    },
    L1: { // formerly "Yeast"
      paytable: [
        { '4': 0.005 },
        { '3': 0.002 },
      ],
    },

    // --- HIGH PAYS (The Pathogens) ---
    H5: { // formerly "Bacillus"
      paytable: [
        { '4': 0.008 },
        { '3': 0.004 },
      ],
    },
    H4: { // formerly "Spirillum"
      paytable: [
        { '4': 0.010 },
        { '3': 0.005 },
      ],
    },
    H3: { // formerly "Phage"
      paytable: [
        { '4': 0.012 },
        { '3': 0.006 },
      ],
    },
    H2: { // formerly "Superbug B"
      paytable: [
        { '4': 0.015 },
        { '3': 0.008 },
      ],
    },
    H1: { // formerly "Superbug A" (The Jackpot Symbol)
      paytable: [
        { '4': 0.020 }, // With 65,536 ways (Max Fracture), this pays ~1,300x
        { '3': 0.010 },
      ],
    },
  },

  paddingReels: {
    basegame: '',
    freegame: '',
    superspingame: '',
  },
};