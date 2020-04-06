import { html } from 'lit-html';
import { DemoPage } from '@advanced-rest-client/arc-demo-helper';
import '@advanced-rest-client/arc-demo-helper/arc-interactive-demo.js';
import '../request-actions-panel.js';

class ComponentDemo extends DemoPage {
  constructor() {
    super();
    this.initObservableProperties([
      'outlined',
    ]);
    this.componentName = 'arc-actions/request-actions-panel';
    this.demoStates = ['Filled', 'Outlined', 'Anypoint'];
    this._actionsChange = this._actionsChange.bind(this);
  }

  _demoStateHandler(e) {
    const state = e.detail.value;
    this.outlined = state === 1;
    this.compatibility = state === 2;
    this._updateCompatibility();
  }

  _actionsChange(e) {
    console.log(e.target.actions);
  }

  _demoTemplate() {
    const {
      demoStates,
      darkThemeActive,
      compatibility,
      outlined,
    } = this;
    return html`
      <section class="documentation-section">
        <h3>Interactive demo</h3>
        <p>
          This demo lets you preview the request actions panel element with various
          configuration options.
        </p>
        <arc-interactive-demo
          .states="${demoStates}"
          @state-chanegd="${this._demoStateHandler}"
          ?dark="${darkThemeActive}"
        >
          <request-actions-panel
            ?compatibility="${compatibility}"
            ?outlined="${outlined}"
            slot="content"
            @change="${this._actionsChange}"
          ></request-actions-panel>
        </arc-interactive-demo>
      </section>
    `;
  }

  contentTemplate() {
    return html`
      <h2>Requests actions panel</h2>
      ${this._demoTemplate()}
    `;
  }
}

const instance = new ComponentDemo();
instance.render();
window._demo = instance;
