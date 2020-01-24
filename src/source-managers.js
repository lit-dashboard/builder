import { camelCase } from 'lodash';
import { 
  hasSourceProvider, hasSourceProviderType,
} from './source-providers'
import store from '@lit-dashboard/lit-dashboard/store';
import { 
  initSources, removeSources 
} from '@lit-dashboard/lit-dashboard/actions';

let managers = {};

export const hasSourceManager = (providerName) => {
  return providerName in managers;
};

export const getSourceManager = (providerName) => {
  return managers[providerName];
};

export const addSourceManager = (providerType, providerName, settings) => {
  providerName = providerName || providerType;
  if (
    hasSourceManager(providerName) 
    || hasSourceProvider(providerName) 
    || !hasSourceProviderType(providerType)
  ) {
    return;
  }
  managers[providerName] = new SourceManager(providerType, providerName, settings);
  store.dispatch(initSources(providerName));
};

export const removeSourceManager = (providerName) => {
  if (!hasSourceManager(providerName)) {
    return;
  }
  const manager = getSourceManager(providerName);
  manager.disconnect();
  store.dispatch(removeSources(providerName));
  delete managers[providerName];
};

export const normalizeKey = (key) => {
  return key
    .split('/')
    .map(keyPart => camelCase(keyPart))
    .join('/');
};
