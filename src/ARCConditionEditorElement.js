import { html, LitElement } from 'lit-element';
import '@advanced-rest-client/arc-icons/arc-icon.js';
import '@anypoint-web-components/anypoint-switch/anypoint-switch.js';
import elementStyles from './styles/ArcConditionEditor.styles.js';
import cardStyles from './styles/Card.styles.js';
import tooltipStyles from './styles/Tooltip.styles.js';
import {
  dataSourceSelector,
  operatorTemplate,
  inputTemplate,
  dataSourceTypeSelector,
} from './CommonTemplates.js';

/** @typedef {import('@advanced-rest-client/arc-types').Actions.RequestDataSourceEnum} RequestDataSourceEnum */
/** @typedef {import('@advanced-rest-client/arc-types').Actions.ResponseDataSourceEnum} ResponseDataSourceEnum */
/** @typedef {import('@advanced-rest-client/arc-types').Actions.Condition} Condition */
/** @typedef {import('lit-html').TemplateResult} TemplateResult */

export const conditionValue = Symbol('conditionValue');
export const notifyChange = Symbol('notifyChange');

export class ARCConditionEditorElement extends LitElement {
  static get styles() {
    return [elementStyles, cardStyles, tooltipStyles];
  }

  static get properties() {
    return {
      /**
       * A list of response actions
       */
      condition: { type: Object },
      /**
       * Enables compatibility with the Anypoint theme
       */
      compatibility: { type: Boolean, reflect: true },
      /**
       * Enables outlined MD theme
       */
      outlined: { type: Boolean, reflect: true },

      /**
       * Whether or not the condition is enabled
       */
      enabled: { type: Boolean, reflect: true },
      /** 
       * The type of the condition that is being rendered.
       * Either `request` or `response`.
       * This is not the same as condition's model source type as in response action
       * can be executed with conditions for both request and response.
       */
      type: { type: String, reflect: true },
    };
  }

  /**
   * @return {Condition} A condition to render.
   */
  get condition() {
    return this[conditionValue];
  }

  /**
   * @param {Condition} value A condition to render.
   */
  set condition(value) {
    const old = this[conditionValue];
    if (old === value) {
      return;
    }
    this[conditionValue] = value;
    this.requestUpdate('condition', old);
  }

  get opened() {
    const { condition } = this;
    if (!condition) {
      return false;
    }
    const { view = {} } = condition;
    const { opened } = view;
    return !!opened;
  }

  constructor() {
    super();
    this.compatibility = false;
    this.outlined = false;
    /** 
     * @type {string}
     */
    this.type = undefined;
  }

  /**
   * Dispatches the `change` event with the name of the property that changed.
   * @param {string} prop Name of changed property.
   */
  [notifyChange](prop) {
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: {
          prop
        }
      })
    );
  }

  /**
   * A handler for the action enable switch.
   * @param {Event} e
   */
  _enabledHandler(e) {
    this.enabled = /** @type {HTMLInputElement} */ (e.target).checked;
    this[notifyChange]('enabled');
  }

  /**
   * The handler for the action always pass switch.
   * @param {Event} e
   */
  _alwaysPassHandler(e) {
    const enabled = /** @type {HTMLInputElement} */ (e.target).checked;
    const { condition  } = this;
    condition.alwaysPass = enabled;
    this[notifyChange]('condition');
    this.requestUpdate();
  }

  /**
   * A handler for the delete action button click. Dispatches the `remove`
   * custom event.
   */
  _deleteHandler() {
    this.dispatchEvent(new CustomEvent('remove'));
  }

  /**
   * A handler for the close action button click. Updates the `opened` value
   * on the `view` property.
   */
  _closeHandler() {
    const { condition } = this;
    if (!condition.view) {
      condition.view = {};
    }
    condition.view.opened = false;
    this[notifyChange]('condition');
    this.requestUpdate();
  }

  /**
   * A handler for the open action button click. Updates the `opened` value
   * on the `view` property.
   */
  _openedHandler() {
    const { condition } = this;
    if (!condition.view) {
      condition.view = {};
    }
    condition.view.opened = true;
    this[notifyChange]('condition');
    this.requestUpdate();
  }

  _dataSourceTypeHandler(e) {
    const { condition  } = this;
    condition.type = e.detail.value;
    this[notifyChange]('condition');
    this.requestUpdate();
  }

  _dataSourceHandler(e) {
    const { condition  } = this;
    condition.source = e.detail.value;
    this[notifyChange]('condition');
    this.requestUpdate();
  }

  _operatorHandler(e) {
    const { condition  } = this;
    condition.operator = e.detail.value;
    this[notifyChange]('condition');
  }

  _valueHandler(e) {
    const { condition  } = this;
    condition.predictedValue = e.target.value;
    this[notifyChange]('condition');
  }

  _pathHandler(e) {
    const { condition  } = this;
    condition.path = e.target.value;
    this[notifyChange]('condition');
  }

  render() {
    const { opened, condition } = this;
    if (!condition) {
      return '';
    }
    if (opened) {
      return this._renderEditor();
    }
    return this._renderSummary();
  }

  _renderEditor() {
    return html`
    <section class="action-card opened">
      <div class="opened-title">
        <div class="action-title">
          Condition editor
        </div>
        ${this._closeButtonTemplate()}
      </div>
      <div class="editor-contents">
        ${this._dataSourceTypeSelector()}
        ${this._dataSourceSelector()}
        ${this._dataPathTemplate()}
        ${this._operatorTemplate()}
        ${this._valueTemplate()}
      </div>
      <div class="action-footer">
        ${this._enableSwitchTemplate()}
        ${this._alwaysPassSwitchTemplate()}
        ${this._deleteButtonTemplate()}
        ${this._closeButtonTemplate()}
      </div>
    </section>`;
  }

  _renderSummary() {
    const { condition } = this;
    const { alwaysPass } = condition;
    return html`
    <section class="action-card closed">
      ${alwaysPass ? `Always execute the following:` : this._conditionExplained()}
      ${this._openButtonTemplate()}
    </section>`;
  }

  _conditionExplained() {
    const { condition } = this;
    const { type, source, path, predictedValue, operator } = condition;
    const parts = [];
    if (path && !['method', 'status'].includes(source)) {
      parts.push(html`When <strong>${type}.${source}.${path}</strong>`);
    } else {
      parts.push(html`When <strong>${type}.${source}</strong>`);
    }
    if (!['contains'].includes(operator)) {
      parts.push(html` is`);
    }
    parts.push(html` <strong>${operator}</strong>`);
    parts.push(html` <strong>${predictedValue}</strong> then:`);
    return parts;
  }

  _dataSourceTypeSelector() {
    const { type } = this;
    if (type === 'request') {
      // this can oly have the `request` as the source type.
      return '';
    }
    const { condition, outlined, compatibility } = this;
    return dataSourceTypeSelector({
      selected: condition.type,
      handler: this._dataSourceTypeHandler,
      outlined, 
      compatibility,
      disabled: !!condition.alwaysPass,
    });
  }

  _dataSourceSelector() {
    const { condition, outlined, compatibility, type } = this;
    const { type: cType, source } = condition;

    const requestOptions = type === 'request' ? true : cType === 'request';
    const responseOptions = !requestOptions && (type === 'response' ? true : cType === 'response');

    const input = dataSourceSelector(source, this._dataSourceHandler, {
      outlined, 
      compatibility,
      requestOptions,
      responseOptions,
      name: 'source',
      disabled: !!condition.alwaysPass,
    });
    return html`
    <div class="form-row">${input}</div>
    `;
  }

  _operatorTemplate() {
    const { condition, outlined, compatibility } = this;
    const { operator, alwaysPass } = condition;
    const input = operatorTemplate({
      handler: this._operatorHandler, 
      operator,
      outlined, compatibility,
      name: 'operator',
      disabled: !!alwaysPass,
    });
    return html`
    <div class="form-row">${input}</div>
    `;
  }

  _valueTemplate() {
    const { condition, outlined, compatibility } = this;
    const { predictedValue='', source, alwaysPass } = condition;
    const type = source === 'status' ? 'number' : 'text';
    const input = inputTemplate('predictedValue', String(predictedValue), 'Condition value', this._valueHandler, {
      outlined,
      compatibility,
      type,
      disabled: !!alwaysPass,
    });
    return html`
    <div class="form-row">${input}</div>
    `;
  }

  _dataPathTemplate() {
    const { condition, outlined, compatibility } = this;
    const { path, source, alwaysPass } = condition;
    if (['method', 'status'].indexOf(source) !== -1) {
      // these sources do not have path value.
      return '';
    }

    const help = 'Path to the property that contains the data to extract.';
    // @ts-ignore
    const input = inputTemplate('path', path, 'Path to the value', this._pathHandler, {
      outlined,
      compatibility,
      disabled: !!alwaysPass,
    });
    return html`
      <div class="form-row">
        ${input}
        <div class="tooltip">
          <arc-icon icon="helpOutline"></arc-icon>
          <span class="tooltiptext">
            ${help} Example: "data.property.subproperty".
          </span>
        </div>
      </div>
    `;
  }

  /**
   * @return {TemplateResult} The template for the enabled switch.
   */
  _enableSwitchTemplate() {
    const { compatibility, enabled } = this;
    return html`
      <anypoint-switch
        ?compatibility="${compatibility}"
        .checked="${enabled}"
        @change="${this._enabledHandler}"
      >Enabled</anypoint-switch>
    `;
  }

  /**
   * @return {TemplateResult|string} Template for the "always pass" which.
   */
  _alwaysPassSwitchTemplate() {
    const { compatibility, condition } = this;
    if (!condition) {
      return '';
    }
    return html`
      <anypoint-switch
        ?compatibility="${compatibility}"
        .checked="${condition.alwaysPass}"
        @change="${this._alwaysPassHandler}"
        title="When selected it ignores the configured condition and always passes the check"
      >Always pass</anypoint-switch>
    `;
  }

  /**
   * @return {TemplateResult} Template for the delete button.
   */
  _deleteButtonTemplate() {
    const { compatibility } = this;
    return html`
      <anypoint-button
        title="Removes this action"
        class="action-delete"
        ?compatibility="${compatibility}"
        @click="${this._deleteHandler}"
      >Delete</anypoint-button>
    `;
  }

  /**
   * @return {TemplateResult} Template for the close action button.
   */
  _closeButtonTemplate() {
    const { compatibility } = this;
    return html`
      <anypoint-button
        title="Closes the editor"
        ?compatibility="${compatibility}"
        @click="${this._closeHandler}"
      >Close</anypoint-button>
    `;
  }

  /**
   * @return {TemplateResult|string} Template for the open action button.
   */
  _openButtonTemplate() {
    const { compatibility } = this;
    return html`
      <anypoint-button
        title="Opens the editor"
        class="action-open"
        ?compatibility="${compatibility}"
        @click="${this._openedHandler}"
      >Open</anypoint-button>
    `;
  }
}
