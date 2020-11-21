import { assert, fixture, html, nextFrame } from '@open-wc/testing';
import sinon from 'sinon';
import '../arc-action-editor.js'

/** @typedef {import('../index').ARCActionEditorElement} ARCActionEditorElement */
/** @typedef {import('@advanced-rest-client/arc-types').Actions.SetCookieConfig} SetCookieConfig */
/** @typedef {import('@anypoint-web-components/anypoint-listbox').AnypointListbox} AnypointListbox */

describe('ARCActionEditorElement', () => {
  describe('set-variable', () => {

    /**
     * @returns {Promise<ARCActionEditorElement>}
     */
    async function basicFixture() {
      return fixture(html`<arc-action-editor name="set-variable" type="request"></arc-action-editor>`);
    }

    /**
     * @returns {Promise<ARCActionEditorElement>}
     */
    async function basicOpenedFixture() {
      return fixture(html`<arc-action-editor name="set-variable" type="request" opened></arc-action-editor>`);
    }

    describe('closed basic setup', () => {
      let element = /** @type ARCActionEditorElement */ (null);
      beforeEach(async () => { element = await basicFixture() });

      it('renders the closed title', () => {
        const node = element.shadowRoot.querySelector('.closed-title');
        assert.ok(node);
      });

      it('has action title', () => {
        const node = element.shadowRoot.querySelector('.action-title');
        assert.equal(node.textContent.trim(), 'Set variable');
      });

      it('opens the action from the button click', () => {
        const node = /** @type HTMLElement */ (element.shadowRoot.querySelector('.action-open'));
        node.click();
        assert.isTrue(element.opened);
      });
    });
  
    describe('closed opened setup', () => {
      let element = /** @type ARCActionEditorElement */ (null);
      beforeEach(async () => { element = await basicOpenedFixture() });

      it('renders the variable name input', () => {
        const input = /** @type HTMLInputElement */ (element.shadowRoot.querySelector('[name="config.name"]'));
        assert.ok(input);
      });

      it('variable name input change changes the config object', () => {
        const input = /** @type HTMLInputElement */ (element.shadowRoot.querySelector('[name="config.name"]'));
        input.value = 'test-cookie';
        input.dispatchEvent(new CustomEvent('input'));
        const result = /** @type SetCookieConfig */ (element.config);
        assert.equal(result.name, 'test-cookie');
      });

      it('variable name input change dispatches the change event', () => {
        const spy = sinon.spy();
        element.addEventListener('change', spy);
        const input = /** @type HTMLInputElement */ (element.shadowRoot.querySelector('[name="config.name"]'));
        input.value = 'test-cookie';
        input.dispatchEvent(new CustomEvent('input'));
        assert.isTrue(spy.calledOnce);
      });

      it('does not render the source type selector for the request action', () => {
        const input = /** @type HTMLInputElement */ (element.shadowRoot.querySelector('[name="config.source.type"]'));
        assert.notOk(input);
      });

      it('renders the source selector', () => {
        const input = /** @type HTMLElement */ (element.shadowRoot.querySelector('[name="config.source.source"]'));
        assert.ok(input);
      });

      it('source change changes the config', () => {
        const input = /** @type HTMLElement */ (element.shadowRoot.querySelector('[name="config.source.source"] anypoint-item[data-value="method"]'));
        input.click();
        const result = /** @type SetCookieConfig */ (element.config);
        assert.equal(result.source.source, 'method');
      });

      it('source change dispatches the change event', () => {
        const spy = sinon.spy();
        element.addEventListener('change', spy);
        const input = /** @type HTMLElement */ (element.shadowRoot.querySelector('[name="config.source.source"] anypoint-item[data-value="method"]'));
        input.click();
        const result = /** @type SetCookieConfig */ (element.config);
        assert.equal(result.source.source, 'method');
        assert.isTrue(spy.calledOnce);
      });

      it('renders the source path input', () => {
        const input = /** @type HTMLInputElement */ (element.shadowRoot.querySelector('[name="config.source.path"]'));
        assert.ok(input);
      });

      it('source path input change changes the config object', () => {
        const input = /** @type HTMLInputElement */ (element.shadowRoot.querySelector('[name="config.source.path"]'));
        input.value = 'test-path';
        input.dispatchEvent(new CustomEvent('input'));
        const result = /** @type SetCookieConfig */ (element.config);
        assert.equal(result.source.path, 'test-path');
      });

      it('source path input change dispatches the change event', () => {
        const spy = sinon.spy();
        element.addEventListener('change', spy);
        const input = /** @type HTMLInputElement */ (element.shadowRoot.querySelector('[name="config.source.path"]'));
        input.value = 'test-path';
        input.dispatchEvent(new CustomEvent('input'));
        assert.isTrue(spy.calledOnce);
      });
    });

    describe('iterator configuration', () => {
      let element = /** @type ARCActionEditorElement */ (null);
      beforeEach(async () => { element = await basicOpenedFixture() });

      it('does not render the source iterator toggle for URL source selection', async () => {
        const option = /** @type HTMLElement */ (element.shadowRoot.querySelector('[name="config.source.source"] anypoint-item[data-value="url"]'));
        option.click();
        await nextFrame();
        const input = /** @type HTMLInputElement */ (element.shadowRoot.querySelector('[name="config.source.iteratorEnabled"]'));
        assert.notOk(input);
      });

      it('does not render the source iterator toggle for method source selection', async () => {
        const option = /** @type HTMLElement */ (element.shadowRoot.querySelector('[name="config.source.source"] anypoint-item[data-value="method"]'));
        option.click();
        await nextFrame();
        const input = /** @type HTMLInputElement */ (element.shadowRoot.querySelector('[name="config.source.iteratorEnabled"]'));
        assert.notOk(input);
      });

      it('does not render the source iterator toggle for headers source selection', async () => {
        const option = /** @type HTMLElement */ (element.shadowRoot.querySelector('[name="config.source.source"] anypoint-item[data-value="headers"]'));
        option.click();
        await nextFrame();
        const input = /** @type HTMLInputElement */ (element.shadowRoot.querySelector('[name="config.source.iteratorEnabled"]'));
        assert.notOk(input);
      });

      it('does not render the source iterator toggle for status source selection', async () => {
        element.type = 'response';
        element.config = { source: { type: 'response', source: 'status' } };
        await element.requestUpdate();
        const input = /** @type HTMLInputElement */ (element.shadowRoot.querySelector('[name="config.source.iteratorEnabled"]'));
        assert.notOk(input);
      });

      it('renders the source iterator toggle for request body source selection', async () => {
        const option = /** @type HTMLElement */ (element.shadowRoot.querySelector('[name="config.source.source"] anypoint-item[data-value="body"]'));
        option.click();
        await nextFrame();
        const input = /** @type HTMLInputElement */ (element.shadowRoot.querySelector('[name="config.source.iteratorEnabled"]'));
        assert.ok(input);
      });

      it('renders the source iterator toggle for response body source selection', async () => {
        element.type = 'response';
        element.config = { source: { type: 'response', source: 'body' } };
        await element.requestUpdate();
        const input = /** @type HTMLInputElement */ (element.shadowRoot.querySelector('[name="config.source.iteratorEnabled"]'));
        assert.ok(input);
      });
    });
  });
});
