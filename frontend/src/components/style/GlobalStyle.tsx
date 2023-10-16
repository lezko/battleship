import {createGlobalStyle} from 'styled-components';
import {AppTheme} from 'AppTheme';

const GlobalStyle = createGlobalStyle<{theme: AppTheme}>`
  *, *:before, *:after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }  
  body {
    color: ${props => props.theme.color.text};
    background-color: ${props => props.theme.color.bg};
    font-family: sans-serif;
    font-size: 1.1rem;
  }
  button {
    cursor: pointer;
  }
  input {
    padding: 5px;
  }
  button, input {
    color: inherit;
    background-color: inherit;
    border: none;
    font-size: inherit;
  }
  li {
    list-style: none;
  }
  .ant-select-selector {
    border-color: inherit !important;
  }
  .ant-select-selection-item, .ant-select-arrow {
    color: inherit !important;
  }
`;

export default GlobalStyle;