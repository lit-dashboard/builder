import { LitElement, html, css } from 'lit-element';
import './widget-menu';
import './sources-view';
import '@vaadin/vaadin-tabs';
import store from '@lit-dashboard/lit-dashboard/store';
import { connect } from 'pwa-helpers';
import '@vaadin/vaadin-lumo-styles';


class SidePanel extends connect(store)(LitElement) {

  static get properties() {
    return {
      selectedTab: { type: Number },
      providerNames: { type: Array }
    };
  }

  static get styles() {
    return css`
      .tab-body {
        position: relative;
        display: block;
      }

      .expander {
        margin-bottom: 10px;
      }

      .expander header {
        padding-left: 15px;
        cursor: pointer;
        margin-bottom: 10px;
      }

      .expander .content {
        display: none;
      }

      .expander [icon] {
        width: 15px;
        color: gray;
      }

      .expander [icon="vaadin:angle-right"] {
        display: inline-block;
      }

      .expander [icon="vaadin:angle-down"] {
        display: none;
      }

      .expander.expanded .content {
        display: block;
      }

      .expander.expanded [icon="vaadin:angle-right"] {
        display: none;
      }

      .expander.expanded [icon="vaadin:angle-down"] {
        display: inline-block;
      }
    `;
  }

  constructor() {
    super();
    this.selectedTab = 0;
    this.providerNames = [];
  }

  toggleExpand(ev) {
    const [expander] = ev.path;
    $(expander).closest('.expander').toggleClass('expanded');
  }

  render() {
    return html`
      <div class="tab-body">
        ${this.selectedTab === 0 ? html`
          ${this.providerNames.length > 0 ? html`
            ${this.providerNames.map(providerName => html`
              <div class="expander">
                <header @click="${this.toggleExpand}">
                  <iron-icon icon="vaadin:angle-right"></iron-icon>
                  <iron-icon icon="vaadin:angle-down"></iron-icon>
                  ${providerName}
                </header>
                <div class="content">
                  <sources-view provider-name="${providerName}"></sources-view>
                </div>
              </div>
            `)}
          ` : ''}
        ` : html`
          <widget-menu></widget-menu>
        `}
      </div>
    `;
  }

  stateChanged(state) {
    this.providerNames = Object.keys(state.sources);
  }
}

customElements.define('side-panel', SidePanel);