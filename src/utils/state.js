export default function upgradeSavedGameState(state) {
  if (state.hasOwnProperty('vsComputer')) return state;

  return {
    ...state,
    vsComputer: {
      isComputer: false,
      isComputerBlack: true
    }
  };
}
