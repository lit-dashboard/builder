import { LitElement, html, css } from 'lit-element';
import store from '@lit-dashboard/lit-dashboard/store';
import { connect } from 'pwa-helpers';
import { map } from 'lodash';
import './widget-menu-item';
import '@vaadin/vaadin-accordion';

class WidgetMenu extends connect(store)(LitElement) {

  static get styles() {
    return css`

      vaadin-accordion {
        margin-left: 15px;
      }

      vaadin-accordion-panel {
        border: none;
      }

      widget-menu-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 20px;
        margin: 10px 5px;
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

  static get properties() { 
    return {
      categories: { type: Object }      
    };
  }

  stateChanged(state) {
    const { registered, categories } = state.widgets;
    this.categories = categories
      .sort()
      .map(category => ({
        label: category,
        types: map(registered, (type, name) => ({ ...type, widgetType: name }))
          .filter(widget => widget.category === category)
          .sort((widget1, widget2) => {
            let label1 = widget1.label.toLowerCase();
            let label2 = widget2.label.toLowerCase();
            if (label1 < label2) return -1;
            else if (label1 > label2) return 1;
            return 0;
          })
      }))
  }

  toggleExpand(ev) {
    const [expander] = ev.path;
    $(expander).closest('.expander').toggleClass('expanded');
  }

  render() {
    return html`
        ${this.categories.map(category => html`
          <div class="expander">
            <header @click="${this.toggleExpand}">
              <iron-icon icon="vaadin:angle-right"></iron-icon>
              <iron-icon icon="vaadin:angle-down"></iron-icon>
              ${category.label}
            </header>
            <div class="content">
              <vaadin-vertical-layout>
                ${category.types.map(type => html`
                  <widget-menu-item 
                    type="${type.widgetType}"
                    label="${type.label}"
                    image="${type.image}"
                    minx="${type.minX}"
                    miny="${type.minY}"
                  >
                  </widget-menu-item>
                `)}   
              </vaadin-vertical-layout>
            </div>
          </div>
        `)}
    `;
  }
}

customElements.define('widget-menu', WidgetMenu);