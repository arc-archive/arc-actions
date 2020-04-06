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
.action-open {
  margin-left: auto;
}

.closed-title {
  display: flex;
  align-items: center;
}

.iterator-block {
  padding-left: 8px;
  border-left: 1px #FFA031 solid;
  margin-left: 12px;
}
`;
