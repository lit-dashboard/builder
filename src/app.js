import './menu';
import './styles.css';
import './elements/components';
import './elements/dashboard-app';
import store from '@lit-dashboard/lit-dashboard/store';
import { registerWidget } from '@lit-dashboard/lit-dashboard/actions';
import toastr from 'toastr';
import 'toastr/build/toastr.css';
import { getPageX, getPageY } from './mouse';
import {
  addSourceProviderType,
  hasSourceProviderType,
  addSourceProvider,
  getSourceProvider,
  getSourceProviderNames,
  hasSourceProvider
} from './source-providers';
import {
  hasSourceManager,
  getSourceManager,
  addSourceManager,
  removeSourceManager,
  normalizeKey
} from './source-managers';
import { onEvent, triggerEvent } from './events';
import * as setup from './setup';

window.$ = window.jQuery = require('jquery');
window.d3 = require('d3');

window.dashboardApp = {
  ...window.dashboardApp,
  getPageX, 
  getPageY,
  addSourceProviderType,
  hasSourceProviderType,
  addSourceProvider,
  getSourceProvider,
  getSourceProviderNames,
  hasSourceProvider,
  hasSourceManager,
  getSourceManager,
  addSourceManager,
  removeSourceManager,
  normalizeKey,
  onEvent, 
  triggerEvent,
  toastr,
  setup,
  store,
  registerWidget: function(tagName, config) {
    const { widgets } = store.getState();
    const widgetExists = tagName in widgets.registered;
    if (config.class && !widgetExists) {
      store.dispatch(registerWidget(tagName, config));
    }
  },
};