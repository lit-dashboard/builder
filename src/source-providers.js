import { isNull, kebabCase } from 'lodash';
import { ProviderSettings } from '@lit-dashboard/lit-dashboard';

const providerTypes = {};
const providers = {};


const getSettingsElementName = constructor => {
  const { settingsElement, typeName } = constructor;
  if (isNull(settingsElement) || isNull(typeName)) {
    return null;
  }
  const isProviderSettings = 
    Object.getPrototypeOf(settingsElement.constructor).name === 'ProviderSettings';

  if (!isProviderSettings) {
    return null;
  }

  return kebabCase(typeName) + '-settings'; 
};

export const addSourceProviderType = (constructor) => {
  
  const { typeName } = constructor;

  if (hasSourceProviderType(typeName)) {
    return;
  }

  if (Object.getPrototypeOf(constructor).name === 'SourceProvider') {

    providerTypes[typeName] = constructor;
    const settingsElementName = getSettingsElementName(constructor);
    if (!isNull(settingsElementName)) {

      const { settingsElement } = constructor;
      const settingsElementProperties = constructor.properties || {};

      Object.defineProperty(settingsElement, 'properties', {
        get() {
          return {
            ...settingsElementProperties,
            settings: {
              type: Object
            }
          }
        }
      });

      customElements.define(
        settingsElementName, 
        constructor.settingsElement
      );
    }
  }
}

export const hasSourceProviderType = (typeName) => {
  return typeName in providerTypes;
}

export const addSourceProvider = (type, name, settings = {}) => {
  
  if (typeof name !== 'string') {
    name = type;
  }

  if (!hasSourceProviderType(type) || hasSourceProvider(name)) {
    return null;
  }

  const SourceProvider = providerTypes[type];


  return providers[name] = new SourceProvider({
    ...SourceProvider.settingsDefaults,
    ...settings
  });
};

export const getSourceProvider = (providerName) => {
  return providers[providerName];
};

export const getSourceProviderNames = () => {
  return Object.keys(providers);
};

export const hasSourceProvider = (providerName) => {
  return providerName in providers;
};