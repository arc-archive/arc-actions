import { html } from 'lit-element';
import { configCheckbox, configInput } from './Utils.js';

export const renderDeleteCookieEditor = Symbol();
// Templates
const useRequestUrlTplSymbol = Symbol();
const urlTplSymbol = Symbol();
const removeAllTplSymbol = Symbol();
const nameTplSymbol = Symbol();

/**
 * Mixin that adds support for delete-cookie type action editor.
 *
 * @param {*} superClass
 * @return {*}
 * @mixin
 */
export const DeleteCookieEditorMixin = (superClass) => class extends superClass {

  [renderDeleteCookieEditor]() {
    const { config={} } = this;
    return html`
      ${this[useRequestUrlTplSymbol](config)}
      ${this[urlTplSymbol](config)}
      ${this[removeAllTplSymbol](config)}
      ${this[nameTplSymbol](config)}
    `;
  }

  [useRequestUrlTplSymbol]({ useRequestUrl = false }) {
    return this[configCheckbox]('config.useRequestUrl', useRequestUrl, 'Use request URL', {
      notify: 'config',
      render: 'true',
    });
  }

  [urlTplSymbol]({ useRequestUrl = false, url = '' }) {
    if (useRequestUrl) {
      return '';
    }
    return this[configInput]('config.url', url, 'Cookie URL (required)', {
      required: true,
      autoValidate: true,
      type: 'url',
      infoMessage: 'The URL associatied with the cookie.',
      notify: 'config',
    });
  }

  [removeAllTplSymbol]({ removeAll = false }) {
    return this[configCheckbox]('config.removeAll', removeAll, 'Remove all cookies', {
      notify: 'config',
      render: 'true',
    });
  }

  [nameTplSymbol]({ removeAll = false, name = '' }) {
    if (removeAll) {
      return '';
    }
    return this[configInput]('config.name', name, 'Cookie name (required)', {
      required: true,
      autoValidate: true,
      invalidMessage: 'Cookie name is required.',
      notify: 'config',
    });
  }
}
