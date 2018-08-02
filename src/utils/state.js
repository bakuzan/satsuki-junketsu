export default function upgradeSavedGameState(state) {
  let upgradedState = { ...state };

  if (!state.hasOwnProperty('vsComputer')) {
    upgradedState = {
      ...upgradedState,
      vsComputer: {
        isComputer: false,
        isComputerBlack: true
      }
    };
  }

  return upgradedState;
}
