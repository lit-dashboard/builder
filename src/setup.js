import { has } from 'lodash';

export const isElectron = has(window, 'process.versions.electron');