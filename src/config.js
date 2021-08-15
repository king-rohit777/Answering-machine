export const apiBase = process.env.REACT_APP_SYMBL_CUSTOM_DOMAIN || 'https://api.symbl.ai';
export const symblAppId = process.env.REACT_APP_SYMBL_APP_ID;
export const symblAppSecret = process.env.REACT_APP_SYMBL_APP_SECRET;
export const summaryEmails = process.env.REACT_APP_SUMMARY_EMAIL_LIST ? process.env.REACT_APP_SUMMARY_EMAIL_LIST.replace(/\s/g, '').split(",") : [];

export const intents = [{intent: 'answering_machine'}, {intent: 'interested'}, {intent: 'not_interested'}, {intent: 'do_not_call'}];
