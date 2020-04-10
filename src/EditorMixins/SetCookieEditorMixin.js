import { html } from 'lit-element';
import {
  configInput,
  configCheckbox,
  dataSourceSelector,
  dataIteratorTplSymbol,
  iteratorTemplateSymbol,
} from './Utils.js';

export const renderSetCookieEditor = Symbol();

// Templates
const cnameTplSymbol = Symbol();
const cdomainTplSymbol = Symbol();
const cpathTplSymbol = Symbol();
const cexpiresTplSymbol = Symbol();
const chostOnlyTplSymbol = Symbol();
const chttpOnlyTplSymbol = Symbol();
const csecureTplSymbol = Symbol();
const csessionTplSymbol = Symbol();
const sourceTplSymbol = Symbol();
const arraySearchTplSymbol = Symbol();
const pathTplSymbol = Symbol();
const useRequestUrlTplSymbol = Symbol();
const failTplSymbol = Symbol();
/**
 * Mixin that adds support for set-cookie type action editor.
 *
 * @param {*} superClass
 * @return {*}
 * @mixin
 */
export const SetCookieEditorMixin = (superClass) => class extends superClass {
  [renderSetCookieEditor]() {
    const { config={} } = this;
    return html`
    ${this[cnameTplSymbol](config)}
    ${this[useRequestUrlTplSymbol](config)}
    ${this[cdomainTplSymbol](config)}
    ${this[cpathTplSymbol](config)}
    ${this[cexpiresTplSymbol](config)}
    ${this[chostOnlyTplSymbol](config)}
    ${this[chttpOnlyTplSymbol](config)}
    ${this[csecureTplSymbol](config)}
    ${this[csessionTplSymbol](config)}
    <div class="action-title">Value setting</div>
    ${this[sourceTplSymbol](config)}
    ${this[arraySearchTplSymbol](config)}
    ${this[pathTplSymbol](config)}
    ${this[failTplSymbol](this)}
    `;
  }

  /**
   * Renders a template for the `useRequestUrl` config property.
   *
   * @param {Object} config
   * @return {Object}
   */
  [useRequestUrlTplSymbol]({ useRequestUrl = false }) {
    const label = this.type === 'request' ?
     'Use the request URL' :
     'Use the final response URL';
    // @ts-ignore
    return this[configCheckbox]('config.useRequestUrl', useRequestUrl, label, {
      notify: 'config',
      render: 'true',
    });
  }

  /**
   * Renders a template for the cookie's name input.
   *
   * @param {Object} config
   * @return {Object}
   */
  [cnameTplSymbol]({ name = '' }) {
    // @ts-ignore
    return this[configInput]('config.name', name, 'Cookie name (required)', {
      required: true,
      autoValidate: true,
      notify: 'config',
    });
  }

  /**
   * Renders a template for the cookie's domain input.
   *
   * @param {Object} config
   * @return {Object|String} Empty string when `useRequestUrl` is set on the config.
   */
  [cdomainTplSymbol]({ useRequestUrl = false, domain = '' }) {
    if (useRequestUrl) {
      return '';
    }
    // @ts-ignore
    return this[configInput]('config.domain', domain, 'Domain (required)', {
      required: true,
      autoValidate: true,
      notify: 'config',
    });
  }

  /**
   * Renders a template for the cookie's path input.
   *
   * @param {Object} config
   * @return {Object|String} Empty string when `useRequestUrl` is set on the config.
   */
  [cpathTplSymbol]({ useRequestUrl = false, path = '/' }) {
    if (useRequestUrl) {
      return '';
    }
    // @ts-ignore
    return this[configInput]('config.path', path, 'Path (required)', {
      required: true,
      autoValidate: true,
      notify: 'config',
    });
  }

  /**
   * Renders a template for the "expires" input
   * @param {Object} config
   * @return {Object}
   */
  [cexpiresTplSymbol]({ expires = '' }) {
    // @ts-ignore
    return this[configInput]('config.expires', expires, 'Expires', {
      type: 'datetime-local',
      notify: 'config',
    });
  }

  /**
   * Renders a template for the "hostOnly" checkbox
   * @param {Object} config
   * @return {Object}
   */
  [chostOnlyTplSymbol]({ hostOnly = false }) {
    // @ts-ignore
    return this[configCheckbox]('config.hostOnly', hostOnly, 'Host only', {
      notify: 'config',
    });
  }

  /**
   * Renders a template for the "httpOnly" checkbox
   * @param {Object} config
   * @return {Object}
   */
  [chttpOnlyTplSymbol]({ httpOnly = false }) {
    // @ts-ignore
    return this[configCheckbox]('config.httpOnly', httpOnly, 'HTTP only', {
      notify: 'config',
    });
  }

  /**
   * Renders a template for the "secure" checkbox
   * @param {Object} config
   * @return {Object}
   */
  [csecureTplSymbol]({ secure = false }) {
    // @ts-ignore
    return this[configCheckbox]('config.secure', secure, 'Secure', {
      notify: 'config',
    });
  }

  /**
   * Renders a template for the "session" checkbox
   * @param {Object} config
   * @return {Object}
   */
  [csessionTplSymbol]({ session = false }) {
    // @ts-ignore
    return this[configCheckbox]('config.session', session, 'Session', {
      notify: 'config',
    });
  }

  /**
   * Renders a template for the data source seelctor.
   * @param {Object} config
   * @return {Object}
   */
  [sourceTplSymbol]({ source = {} }) {
    const { source: dataSource = '' } = source;
    // @ts-ignore
    return this[dataSourceSelector](dataSource);
  }

  /**
   * Renders a template for the array search editor
   * @param {Object} config
   * @return {Object}
   */
  [arraySearchTplSymbol]({ source = {} }) {
    // @ts-ignore
    const { iteratorEnabled = false, source: dataSource = '' } = source;
    if (dataSource !== 'request.body') {
      return '';
    }
    // @ts-ignore
    return html`${this[dataIteratorTplSymbol](iteratorEnabled)}
    ${iteratorEnabled ? this[iteratorTemplateSymbol](source.iterator) : ''}
    `;
  }

  /**
   * Renders a template for data source's path input.
   * @param {Object} config
   * @return {Object}
   */
  [pathTplSymbol]({ source = {} }) {
    const { iteratorEnabled = false, path = '', source: dataSource = '' } = source;
    if (['request.method'].indexOf(dataSource) !== -1) {
      return '';
    }
    const label = iteratorEnabled ? 'Array item\'s property for the value' : 'Path to the value';
    // @ts-ignore
    return this[configInput]('config.source.path', path, label, {
      notify: 'config',
    });
  }

  /**
   * Renders a template for "fail" checkbox.
   * @param {Object} config
   * @return {Object}
   */
  [failTplSymbol]({ failOnError = false }) {
    // @ts-ignore
    return this[configCheckbox]('failOnError', failOnError, 'Fail when data cannot be set', {
      notify: 'config',
    });
  }
}
