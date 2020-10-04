import { css } from 'lit-element';

export default css`
:host {
  display: block;
}

anypoint-input {
  width: auto;
  max-width: 700px;
  margin: 0px 8px 20px 8px;
}

anypoint-input[compatibility] {
  margin-top: 20px;
}

.action-card {
  margin: 8px 12px;
}

:host([opened]) .action-card {
  box-shadow: var(--box-shadow-2dp);
  padding: 8px;
}

.action-title {
  margin: 8px 12px;
  font-weight: 500;
  font-size: 1rem;
}

.action-footer {
  display: flex;
  align-items: center;
  padding-top: 20px;
}

.action-delete,
.action-open,
.action-help {
  margin-left: auto;
}

.closed-title,
.opened-title {
  display: flex;
  align-items: center;
}

.iterator-block {
  padding-left: 8px;
  border-left: 1px #FFA031 solid;
  margin-left: 12px;
}

.form-row,
.help-hint-block {
  display: flex;
  align-items: center;
}

.form-row > anypoint-input {
  flex: 1;
}

.icon {
  width: 24px;
  height: 24px;
  display: inline-block;
  fill: currentColor;
}

.icon.help {
  color: var(--primary-color);
  cursor: help;
}
`;
