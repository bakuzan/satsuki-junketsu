export const MATCH_NEW_LINE = /\n/g;
export const MATCH_DIGIT_DOT_SPACE = /\d\. /g;
export const MATCH_PGN_COMMENTS_PGN_GAME_RESULT = /\d\/\d-\d\/\d$|\d\/\d$|\{.*\}/g;

export const MATCH_EVERYTHING_UPTO_EQUALS = /.*=/;
export const MATCH_EVERYTHING_BEFORE_FILE_RANK_PAIR = /.*(?=[a-h]\d)/g;

export const MATCH_PGN_WITH_ADDITIONAL_FILE = /[a-h]x[a-h]|[a-h]{2}/;
