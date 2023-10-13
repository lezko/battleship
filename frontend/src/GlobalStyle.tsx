import {createGlobalStyle} from 'styled-components';

const GlobalStyle = createGlobalStyle`
  *, *:before, *:after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }  
  li {
    list-style: none;
  }
`;

export default GlobalStyle;