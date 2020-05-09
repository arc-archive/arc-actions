import { html } from 'lit-element';
import { configCheckbox, configInput } from './Utils.js';

export const renderDeleteCookieEditor = Symbol('renderDeleteCookieEditor');
// Templates
const useRequestUrlTplSymbol = Symbol('useRequestUrlTplSymbol');
const urlTplSymbol = Symbol('urlTplSymbol');
const removeAllTplSymbol = Symbol('removeAllTplSymbol');
const nameTplSymbol = Symbol('nameTplSymbol');

/** @typedef {import('lit-html').TemplateResult} TemplateResult */

/**
 * @typedef {Object} DeleteCookieConfig
 * @property {boolean=} useRequestUrl When set it uses request URL instead of defined URL in the action
 * @property {string=} url An URL associated with the cookie
 * @property {boolean=} removeAll When set it removes all cookies associated wit the URL
 * @property {string=} name Name of the cookie to remove.
 */

/**
 * Mixin that adds support for delete-cookie type action editor.
 *
 * @param {*} superClass
 * @return {*}
 * @mixin
 */
export const DeleteCookieEditorMixin = (superClass) =>
  class extends superClass {
    [renderDeleteCookieEditor]() {
      const { config = {} } = this;
      return html`
        ${this[useRequestUrlTplSymbol](config)} ${this[urlTplSymbol](config)} ${this[removeAllTplSymbol](config)}
        ${this[nameTplSymbol](config)}
      `;
    }

    /**
     * Template for `useRequestUrl` configuration property.
     * @param {DeleteCookieConfig} useRequestUrl
     * @return {TemplateResult}
     */
    [useRequestUrlTplSymbol]({ useRequestUrl = false }) {
      // @ts-ignore
      return this[configCheckbox]('config.useRequestUrl', useRequestUrl, 'Use request URL', {
        notify: 'config',
        render: 'true'
      });
    }

    /**
     * Template for `url` configuration property.
     * @param {DeleteCookieConfig} useRequestUrl
     * @return {TemplateResult|string}
     */
    [urlTplSymbol]({ useRequestUrl = false, url = '' }) {
      if (useRequestUrl) {
        return '';
      }
      // @ts-ignore
      return this[configInput]('config.url', url, 'Cookie URL (required)', {
        required: true,
        autoValidate: true,
        type: 'url',
        infoMessage: 'The URL associatied with the cookie.',
        notify: 'config'
      });
    }

    /**
     * Template for `removeAll` configuration property.
     * @param {DeleteCookieConfig} useRequestUrl
     * @return {TemplateResult}
     */
    [removeAllTplSymbol]({ removeAll = false }) {
      // @ts-ignore unique symbol
      return this[configCheckbox]('config.removeAll', removeAll, 'Remove all cookies', {
        notify: 'config',
        render: 'true'
      });
    }

    /**
     * Template for `name` configuration property.
     * @param {DeleteCookieConfig} useRequestUrl
     * @return {TemplateResult|string}
     */
    [nameTplSymbol]({ removeAll = false, name = '' }) {
      if (removeAll) {
        return '';
      }
      // @ts-ignore unique symbol
      return this[configInput]('config.name', name, 'Cookie name (required)', {
        required: true,
        autoValidate: true,
        invalidMessage: 'Cookie name is required.',
        notify: 'config'
      });
    }
  };
