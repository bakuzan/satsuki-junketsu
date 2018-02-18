import { SET_APP_THEME, SET_BOARD_THEME } from 'actions/theme';
import Constants from 'constants/index';
import { getUserSettings, persistUserSettings } from 'utils/common';
import { createReducer } from './utils';

const getUserTheme = () => {
  const settings = getUserSettings();
  if (!settings || !settings.theme)
    return {
      app: Constants.themes[0].class,
      board: Constants.boardThemes[0].class
    };
  return settings.theme;
};

const persistUserThemeChoice = themeType => (state, action) => {
  const updatedSettings = persistUserSettings({
    theme: { ...state, [themeType]: action.theme }
  });
  return updatedSettings.theme;
};

const theme = createReducer(getUserTheme(), {
  [SET_APP_THEME]: persistUserThemeChoice('app'),
  [SET_BOARD_THEME]: persistUserThemeChoice('board')
});

export default theme;
