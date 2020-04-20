import { html } from 'lit-element';
import {
  configInput,
  configCheckbox,
  dataSourceSelector,
  dataIteratorTplSymbol,
  iteratorTemplateSymbol,
  dataSourcePathTplSymbol
} from './Utils.js';

export const renderSetCookieEditor = Symbol();

// Templates
const cnameTplSymbol = Symbol();
const curlTplSymbol = Symbol();
const cexpiresTplSymbol = Symbol();
const chostOnlyTplSymbol = Symbol();
const chttpOnlyTplSymbol = Symbol();
const csecureTplSymbol = Symbol();
const csessionTplSymbol = Symbol();
const sourceTplSymbol = Symbol();
const arraySearchTplSymbol = Symbol();
const useRequestUrlTplSymbol = Symbol();
const failTplSymbol = Symbol();

/** @typedef {import('lit-html').TemplateResult} TemplateResult */
/** @typedef {import('../ActionEditor.js').DataSourceConfiguration} DataSourceConfiguration */

/**
 * @typedef {Object} SetCookieConfig
 * @property {?boolean} useRequestUrl When set it uses request URL instead of defined URL in the action
 * @property {?string} url An URL associated with the cookie
 * @property {string} name Name of the cookie
 * @property {?string} expires The cookie expiration time
 * @property {?boolean} hostOnly Whather the cookie is host only
 * @property {?boolean} httpOnly Whather the cookie is HTTP only
 * @property {?boolean} secure Whather the cookie is HTTPS only
 * @property {?boolean} session Whather the cookie is a session cookie
 * @property {DataSourceConfiguration} source Source of the cookie value
 */

/**
 * Mixin that adds support for set-cookie type action editor.
 *
 * @param {*} superClass
 * @return {*}
 * @mixin
 */
export const SetCookieEditorMixin = (superClass) =>
  class extends superClass {
    [renderSetCookieEditor]() {
      const { config = {} } = this;
      // @ts-ignore
      const dataSourceTemplate = this[dataSourcePathTplSymbol](config);
      return html`
        ${this[cnameTplSymbol](config)} ${this[useRequestUrlTplSymbol](config)} ${this[curlTplSymbol](config)}
        ${this[cexpiresTplSymbol](config)} ${this[chostOnlyTplSymbol](config)} ${this[chttpOnlyTplSymbol](config)}
        ${this[csecureTplSymbol](config)} ${this[csessionTplSymbol](config)}
        <div class="action-title">Value setting</div>
        ${this[sourceTplSymbol](config)} ${this[arraySearchTplSymbol](config)} ${dataSourceTemplate}
        ${this[failTplSymbol](this)}
      `;
    }

    /**
     * Renders a template for the `useRequestUrl` config property.
     *
     * @param {Object} config
     * @return {TemplateResult}
     */
    [useRequestUrlTplSymbol]({ useRequestUrl = false }) {
      const label = this.type === 'request' ? 'Use the request URL' : 'Use the final response URL';
      // @ts-ignore
      return this[configCheckbox]('config.useRequestUrl', useRequestUrl, label, {
        notify: 'config',
        render: 'true'
      });
    }

    /**
     * Renders a template for the cookie's name input.
     *
     * @param {Object} config
     * @return {TemplateResult}
     */
    [cnameTplSymbol]({ name = '' }) {
      // @ts-ignore
      return this[configInput]('config.name', name, 'Cookie name (required)', {
        required: true,
        autoValidate: true,
        notify: 'config'
      });
    }

    /**
     * Renders a template for the cookie's URL input.
     *
     * @param {SetCookieConfig} config
     * @return {TemplateResult|String} Empty string when `useRequestUrl` is set on the config.
     */
    [curlTplSymbol]({ useRequestUrl = false, url = '' }) {
      if (useRequestUrl) {
        return '';
      }
      // @ts-ignore
      return this[configInput]('config.url', url, 'Cookie URL (required)', {
        required: true,
        autoValidate: true,
        notify: 'config'
      });
    }

    /**
     * Renders a template for the "expires" input
     * @param {SetCookieConfig} config
     * @return {TemplateResult}
     */
    [cexpiresTplSymbol]({ expires = '' }) {
      // @ts-ignore
      return this[configInput]('config.expires', expires, 'Expires', {
        type: 'datetime-local',
        notify: 'config'
      });
    }

    /**
     * Renders a template for the "hostOnly" checkbox
     * @param {SetCookieConfig} config
     * @return {TemplateResult}
     */
    [chostOnlyTplSymbol]({ hostOnly = false }) {
      // @ts-ignore
      return this[configCheckbox]('config.hostOnly', hostOnly, 'Host only', {
        notify: 'config'
      });
    }

    /**
     * Renders a template for the "httpOnly" checkbox
     * @param {SetCookieConfig} config
     * @return {TemplateResult}
     */
    [chttpOnlyTplSymbol]({ httpOnly = false }) {
      // @ts-ignore
      return this[configCheckbox]('config.httpOnly', httpOnly, 'HTTP only', {
        notify: 'config'
      });
    }

    /**
     * Renders a template for the "secure" checkbox
     * @param {SetCookieConfig} config
     * @return {TemplateResult}
     */
    [csecureTplSymbol]({ secure = false }) {
      // @ts-ignore
      return this[configCheckbox]('config.secure', secure, 'Secure', {
        notify: 'config'
      });
    }

    /**
     * Renders a template for the "session" checkbox
     * @param {SetCookieConfig} config
     * @return {TemplateResult}
     */
    [csessionTplSymbol]({ session = false }) {
      // @ts-ignore
      return this[configCheckbox]('config.session', session, 'Session', {
        notify: 'config'
      });
    }

    /**
     * Renders a template for the data source seelctor.
     * @param {SetCookieConfig} config
     * @return {TemplateResult}
     */
    [sourceTplSymbol](config) {
      const configSource = /** @type {DataSourceConfiguration} */ (config.source || {});
      const { source } = configSource;
      // @ts-ignore
      return this[dataSourceSelector](source);
    }

    /**
     * Renders a template for the array search editor
     * @param {SetCookieConfig} config
     * @return {TemplateResult|string}
     */
    [arraySearchTplSymbol](config) {
      const configSource = /** @type {DataSourceConfiguration} */ (config.source || {});
      // @ts-ignore
      const { iteratorEnabled = false, iterator, source = '' } = configSource;
      if (source !== 'request.body') {
        return '';
      }
      // @ts-ignore
      const itTpl = iteratorEnabled ? this[iteratorTemplateSymbol](iterator) : '';
      // @ts-ignore
      return html`
        ${this[dataIteratorTplSymbol](iteratorEnabled)} ${itTpl}
      `;
    }

    /**
     * Renders a template for "fail" checkbox.
     * @param {Object} config
     * @return {TemplateResult}
     */
    [failTplSymbol]({ failOnError = false }) {
      // @ts-ignore
      return this[configCheckbox]('failOnError', failOnError, 'Fail when data cannot be set', {
        notify: 'config'
      });
    }
  };
