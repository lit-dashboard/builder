const { LitElement, html, css } = dashboard.lit;

class NumberSlider extends LitElement {

  static get properties() {
    return {
      value: { type: Number, attribute: false },
      min: { type: Number },
      max: { type: Number },
      blockIncrement: { type: Number, attribute: 'block-increment' }
    };
  }

  static get styles() {
    return css`

      :host {
        display: block;
      }

      .slider-container {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }

      input {
          width: 85%;
          max-width: calc(100% - 60px);
      }

      table-axis {
          width: calc(85% - 14px);
          max-width: calc(100% - 74px);
          display: block;
      }
    `;
  }

  constructor() {
    super();
    this.value = 0;
    this.min = -1;
    this.max = 1;
    this.blockIncrement = .05;
  }

  set value(value) {
    const oldValue = this._value;
    this._value = value;
    this.requestUpdate('value', oldValue);
  }

  get value() {
    return Math.clamp(this._value, this.min, this.max);
  }

  set min(value) {
    const oldValue = this._min;
    this._min = value;
    this.requestUpdate('min', oldValue);
  }

  get min() {
    return Math.min(this._min, this._max);
  }

  set max(value) {
    const oldValue = this._max;
    this._max = value;
    this.requestUpdate('max', oldValue);
  }

  get max() {
    return Math.max(this._min, this._max);
  }

  onChange(ev) {
    const value = parseFloat(ev.target.value);
    if (this.ntRoot) {
      NetworkTables.putValue(this.ntRoot, value);
    }
  }

  updated() {
    if (this.isNtType('number'))
      this.value = this.table;
  }


  render() {
    return html`
      <div class="slider-container">
        <input 
          id="slider"
          type="range" 
          min="${this.min}"
          max="${this.max}"
          .value="${this.value.toString()}"
          step="${this.blockIncrement}"
          @change="${this.onChange}"
        />

        <table-axis 
          ticks="5" 
          .range="${[this.min, this.max]}"
        ></table-axis>
      </div>
    `;
  }
}

dashboard.registerWidget('number-slider', {
  class: NumberSlider,
  label: 'Number Slider',
  category: 'Basic',
  acceptedTypes: ['number'],
  image: require.resolve('./number-slider.png')
});