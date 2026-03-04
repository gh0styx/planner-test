import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    font-size: 16px;
    -webkit-text-size-adjust: 100%;
  }

  body {
    font-family: ${({ theme }) => theme.font.sans};
    background: ${({ theme }) => theme.colors.bg};
    color: ${({ theme }) => theme.colors.textPrimary};
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
  }

  button {
    cursor: pointer;
    border: none;
    background: none;
    font: inherit;
    color: inherit;
    padding: 0;
  }

  input, textarea {
    font: inherit;
    color: inherit;
    border: none;
    outline: none;
    background: none;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  ::-webkit-scrollbar-track {
    background: transparent;
  }
  ::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
`;
