import business from '../data/business.json';

/**
 * NAP_PENDING-safe phone values. business.json keeps the sentinel until the
 * verified GBP data lands; components must never render the raw placeholder
 * into visible text, tel: links, or schema.
 */
export const phoneDisplay = business.phone === 'NAP_PENDING' ? '(555) 000-0000' : business.phone;
export const phoneTel = business.phoneTel === 'NAP_PENDING' ? '+15550000000' : business.phoneTel;
