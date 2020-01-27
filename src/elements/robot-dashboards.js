import { LitElement, html, css } from 'lit-element';
import './no-dashboard';
import { 
  getSourceProvider,
  getSourceProviderNames,
} from '../source-providers';
import { dirname } from 'path-webpack';
import { isElectron } from '../setup';
import { isDev } from 'electron-is-dev';
import { readFileSync, writeFileSync, existsSync, watch } from 'fs';
import { remote } from 'electron';
import { storage, store } from '@lit-dashboard/lit-dashboard';
import { notifyError, notifySuccess } from '../notifications';
import { onEvent } from '../events';
import { getPageX, getPageY } from '../mouse';

class RobotDashboards extends LitElement {

  static get styles() {
    return css`
      :host {
        position: relative;
        display: block;
      }

      no-dashboard {
        padding-left: 15px;
        padding-right: 15px;
        padding-top: 10px;
        padding-bottom: 10px;
        display: block;
      }

      robot-dashboard {
        display: block;
      }

      .selected-widget-rect {
        display: none;
      }

      .selected-widget-rect.show {
        display: block;
        position: absolute;
        left: var(--selected-widget-rect-left);
        top: var(--selected-widget-rect-top);
        width: var(--selected-widget-rect-width);
        height: var(--selected-widget-rect-height);
        pointer-events: none;
        background: cornflowerblue;
        opacity: .2;
      }
    `;
  }

  static get properties() { 
    return {
      selectedWidget: { type: String },
      sourceBeingAdded: { type: Boolean }
    }
  }

  constructor() {
    super();
    this.oldWidgetTypes = [];
    this.dashboardNode = null;
    this.widgets = {};
    this.selectedWidget = null;
    this.sourceBeingAdded = false;
  }

  async openSavedDashboard() {
    const options = {
      title: 'Open Layout',
      defaultPath: storage.getDashboardPath(),
      properties: ['openFile'],
      filters: [
        { name: 'Javascript files', extensions: ['js'] }
      ]
    };

    try {
      const { canceled, filePaths } = await remote.dialog.showOpenDialog(options);
      if (!canceled) {
        storage.setDashboardPath(filePaths[0]);
        window.location.reload();
      }
    }
    catch(e) {
      notifyError(`Failed to open Dashboard: ${e.message}`);
    }
  }

  getSavedDashboard() {
    try {
      if (storage.hasDashboardPath()) {
        const dashboardPath = storage.getDashboardPath();

        if (isElectron) {
          
          watch(dirname(dashboardPath), { recursive: true }, function (event, filename) {
            if (filename && filename !== 'dashboard-config.json') {
              window.location.reload();
            }
          });

          if (isDev) {
            watch(dirname(window.require.resolve('../widgets')), { recursive: true }, () => {
              window.location.reload();
            });
            
            watch(dirname(window.require.resolve('../source-providers')), { recursive: true }, () => {
              window.location.reload();
            });
          }
        }
        
        storage.setDashboardConfig(
          this.getSavedDashboardConfig()
        );

        window.require(dashboardPath);
      }
    }
    catch(e) {
      console.error('Error opening dashboard', e);
    }
    this.requestUpdate();
  }

  async saveDashboardConfig() {
    const config = {
      widgetSources: {},
      providerSettings: {}
    };

    for (let widgetId in this.widgets) {
      config.widgetSources[widgetId] = {
        key: this.widgets[widgetId].sourceKey,
        sourceProvider: this.widgets[widgetId].sourceProvider
      };
    }

    getSourceProviderNames().map(name => {
      const provider = getSourceProvider(name);
      config.providerSettings[name] = provider.settings;
    });

    const configPath = storage.getDashboardConfigPath();

    try {
      writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8');
      notifySuccess(`Layout saved to ${configPath}`); 
    }
    catch(e) {
      notifyError(`Failed to save layout: ${e.message}`);
    }
  }

  getSavedDashboardConfig() {

    const configPath = storage.getDashboardConfigPath();

    try {
      if (!existsSync(configPath)) {
        return {};
      }
      const config = JSON.parse(readFileSync(configPath, 'utf8'));
      return config;
    }
    catch(e) {
      notifyError(`Failed to open layout: ${e.message}`);
      return {};
    }
  }

  getWidgetTypes() {
    return Object
      .keys(store.getState().widgets.registered)
      .map(widgetType => widgetType.toLowerCase());
  }

  getSelectedWidgetType() {
    if (!this.selectedWidget) {
      return null;
    }

    const widgetNode = this.widgets[this.selectedWidget];
    return widgetNode.nodeName.toLowerCase();
  }

  setupWidget(widgetNode, widgetType) {
    const widgetId = widgetNode.getAttribute('widget-id');
    if (!widgetId) {
      // TODO: Make link that selects element in DOM?
      notifyError(`Widget of type ${widgetType} does not have a 'widget-id' attribute.`);
      return;
    }

    if (widgetId in this.widgets) {
      // TODO: Make link that selects element in DOM?
      notifyError(`Widget of type ${widgetType} with widget-id '${widgetId}' already exists!`);
      return;
    }

    this.widgets[widgetId] = widgetNode;
  }

  firstUpdated() {
    this.getSavedDashboard();

    onEvent('widgetAdded', node => {
      this.setupWidget(node, node.nodeName.toLowerCase());
    });

    $(window).on('mousemove drag', (ev) => {

      const x = getPageX();
      const y = getPageY();

      if (!this.selectedWidget) {
        for (let widget in this.widgets) {
          if (this.isPointInWidget(x, y, 0, widget)) {
            this.selectedWidget = widget;
            this.setSelectedWidgetRect();
            break;
          }
        }
      }
      else if (!this.isPointInWidget(x, y)) {
        this.selectedWidget = null;
      }
    });
  }

  dashboardExists() {
    return typeof customElements.get('robot-dashboard') !== 'undefined';
  }

  isPointInWidget(x, y, margin = 10, widget = this.selectedWidget) {
    const widgetNode = this.widgets[widget];

    if (!widgetNode) {
      return false;
    }

    const { left, top, right, bottom } = widgetNode.getBoundingClientRect();
    const { scrollY, scrollX } = window;
    return (
      left - margin + scrollX <= x &&
      x <= right + margin + scrollX &&
      top -margin + scrollY <= y &&
      y <= bottom + margin + scrollY
    );
  }

  setSelectedWidgetRect() {
    const widgetNode = this.widgets[this.selectedWidget];
    
    if (!widgetNode) {
      return;
    }

    const maxWidth = this.offsetWidth;
    const maxHeight = this.offsetHeight;

    const rectNode = this.shadowRoot.querySelector('.selected-widget-rect');

    const width = Math.min(widgetNode.offsetWidth, maxWidth);
    const height = Math.min(widgetNode.offsetHeight, maxHeight);

    const marginLeftRight = 10;
    const marginTopBottom = 10;


    rectNode.style.setProperty(
      '--selected-widget-rect-left', 
      `${widgetNode.offsetLeft - marginLeftRight}px`
    );

    rectNode.style.setProperty(
      '--selected-widget-rect-top', 
      `${widgetNode.offsetTop - marginTopBottom}px`
    );

    rectNode.style.setProperty(
      '--selected-widget-rect-width', 
      `${width + marginLeftRight * 2}px`
    );

    rectNode.style.setProperty(
      '--selected-widget-rect-height', 
      `${height + marginTopBottom * 2}px`
    );
  }

  setSourceKey(providerName, sourceKey) {
    const widgetNode = this.widgets[this.selectedWidget];

    if (!widgetNode) {
      notifyError(`
        Failed to add source. No widget at that position can be found.`
      );
      return;
    }

    widgetNode.sourceProvider = providerName;
    widgetNode.sourceKey = sourceKey;
  }

  render() {
    return html`
      ${this.dashboardExists() ? html`
        <robot-dashboard></robot-dashboard>
      ` : html`
        <no-dashboard></no-dashboard>
      `}
      <div 
        class="selected-widget-rect ${this.selectedWidget && this.sourceBeingAdded ? 'show' : ''}"
      >
      </div>
    `;
  }
}

customElements.define('robot-dashboards', RobotDashboards);