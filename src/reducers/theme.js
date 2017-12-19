import { SET_THEME_CLASS, TOGGLE_TIMED_THEME } from 'actions/theme';
import Constants from 'constants';
import { getUserSettings, persistUserSettings } from 'utils/common';
import { createReducer } from './utils';

const getUserTheme = () => {
  const settings = getUserSettings();
  if (!settings || !settings.theme)
    return { ...Constants.themes[0], isTimed: false };
  return settings.theme;
};

const persistUserThemeChoice = (state, action) => {
  const updatedSettings = persistUserSettings({
    theme: { ...state, class: action.theme }
  });
  return updatedSettings.theme;
};

const persistUserTimedSetting = (state, action) => {
  const updatedSettings = persistUserSettings({
    theme: { ...state, isTimed: !state.isTimed }
  });
  return updatedSettings.theme;
};

const theme = createReducer(getUserTheme(), {
  [SET_THEME_CLASS]: persistUserThemeChoice,
  [TOGGLE_TIMED_THEME]: persistUserTimedSetting
});

export default theme;
