import { html } from 'lit-html';
import { DemoPage } from '@advanced-rest-client/arc-demo-helper';
import '@advanced-rest-client/arc-demo-helper/arc-interactive-demo.js';
import '../arc-actions.js';

const cacheKeys = Object.freeze({
  request: 'cache.request.actions',
  response: 'cache.response.actions'
});

class ComponentDemo extends DemoPage {
  constructor() {
    super();
    this.initObservableProperties(['outlined', 'requestActions', 'responseActions']);
    this.componentName = 'arc-actions';
    this.demoStates = ['Filled', 'Outlined', 'Anypoint'];
    this._actionsChange = this._actionsChange.bind(this);
    this.requestActions = null;
    this.responseActions = null;
    this.renderViewControls = true;
    this._restoreCache();
  }

  _demoStateHandler(e) {
    const state = e.detail.value;
    this.outlined = state === 1;
    this.compatibility = state === 2;
    this._updateCompatibility();
  }

  _actionsChange(e) {
    const { type } = e.detail;
    const { target } = e;
    const list = type === 'request' ? target.requestActions : target.responseActions;
    const key = type === 'request' ? 'requestActions' : 'responseActions';
    this[key] = list;
    console.log(`${type} actions:`, list);
    this._cacheActions(type, list);
  }

  _cacheActions(type, list) {
    let data = '';
    if (Array.isArray(list) && list.length) {
      data = JSON.stringify(list);
    }
    const key = cacheKeys[type];
    localStorage.setItem(key, data);
  }

  _restoreCache() {
    this._restoreCacheValue('request', localStorage.getItem(cacheKeys.request));
    this._restoreCacheValue('response', localStorage.getItem(cacheKeys.response));
  }

  _restoreCacheValue(type, value) {
    if (!value) {
      return;
    }
    let list;
    try {
      list = JSON.parse(value);
    } catch (_) {
      return;
    }
    if (!list) {
      return;
    }
    const key = type === 'request' ? 'requestActions' : 'responseActions';
    this[key] = list;
  }

  _demoTemplate() {
    const { demoStates, darkThemeActive, compatibility, outlined, requestActions, responseActions } = this;
    return html`
      <section class="documentation-section">
        <h3>Interactive demo</h3>
        <p>
          This demo lets you preview the request actions panel element with various configuration options.
        </p>
        <arc-interactive-demo
          .states="${demoStates}"
          @state-chanegd="${this._demoStateHandler}"
          ?dark="${darkThemeActive}"
        >
          <arc-actions
            .requestActions="${requestActions}"
            .responseActions="${responseActions}"
            ?compatibility="${compatibility}"
            ?outlined="${outlined}"
            slot="content"
            @actionchange="${this._actionsChange}"
          ></arc-actions>
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
