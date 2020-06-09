import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig()
export const API = publicRuntimeConfig.PRODUCTION ? 'http://localhost:5000' : 'http://localhost:5000';
export const APP_NAME = publicRuntimeConfig.APP_NAME;
export const DOMAIN = publicRuntimeConfig.PRODUCTION ? publicRuntimeConfig.DOMAIN_PRODUCTION : publicRuntimeConfig.DOMAIN_DEVELOPMENT;
export const FB_APP_ID = publicRuntimeConfig.FACEBOOK_APP_ID;
export const DISQU_SHORTNAME = publicRuntimeConfig.DISQU_SHORTNAME;
export const GOOGLE_CLIENT_ID = publicRuntimeConfig.GOOGLE_CLIENT_ID;