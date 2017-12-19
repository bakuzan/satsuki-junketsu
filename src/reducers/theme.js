import { SET_THEME_CLASS } from 'actions/theme';
import Constants from 'constants/index';
import { getUserSettings, persistUserSettings } from 'utils/common';
import { createReducer } from './utils';

const getUserTheme = () => {
  const settings = getUserSettings();
  if (!settings || !settings.theme) return { ...Constants.themes[0] };
  return settings.theme;
};

const persistUserThemeChoice = (state, action) => {
  const updatedSettings = persistUserSettings({
    theme: { ...state, class: action.theme }
  });
  return updatedSettings.theme;
};

const theme = createReducer(getUserTheme(), {
  [SET_THEME_CLASS]: persistUserThemeChoice
});

export default theme;
