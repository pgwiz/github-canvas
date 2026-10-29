export interface TechIconDef {
  name: string;
  category: 'Languages' | 'Frontend' | 'Backend' | 'Databases' | 'DevOps & Tools';
  color: string;
  svgPath: string; // viewBox "0 0 24 24"
}

export const TECH_CATALOG: TechIconDef[] = [
  // ==========================================
  // PROGRAMMING LANGUAGES (70+ Languages)
  // ==========================================
  {
    name: 'TypeScript',
    category: 'Languages',
    color: '#3178c6',
    svgPath: 'M3 3h18v18H3V3zm10.7 8.5v1.8h2.3c.7 0 1.2.2 1.5.5.4.3.5.7.5 1.3 0 .7-.3 1.2-.8 1.6-.5.4-1.2.6-2.1.6-1 0-1.8-.2-2.5-.7v2c.8.4 1.7.6 2.7.6 1.6 0 2.9-.4 3.8-1.2.9-.8 1.3-1.8 1.3-3.1 0-1-.3-1.8-.9-2.4-.6-.6-1.5-1-2.7-1H13.7zm-6.2 0v7.3H9.7v-7.3h2.3V9.7H5.2v1.8h2.3z'
  },
  {
    name: 'JavaScript',
    category: 'Languages',
    color: '#f1e05a',
    svgPath: 'M3 3h18v18H3V3zm12.5 13.5c.5.8 1.2 1.3 2.1 1.3 1 0 1.6-.5 1.6-1.5 0-1-.7-1.4-1.8-1.9l-.6-.3c-1.8-.8-3-1.8-3-3.8 0-2 1.5-3.5 3.8-3.5 1.7 0 2.9.6 3.7 2.1l-1.9 1.2c-.4-.7-.9-1-1.8-1-.8 0-1.4.5-1.4 1.2 0 .8.5 1.2 1.6 1.7l.6.3c2.1.9 3.3 1.9 3.3 4.1 0 2.3-1.8 3.7-4.2 3.7-2.3 0-3.8-1.2-4.5-2.7l2.1-1.2zm-7.3.2c.4.7.8 1.2 1.5 1.2.7 0 1.2-.3 1.2-1.4V9.7h2.4v6.7c0 2.2-1.3 3.3-3.3 3.3-1.8 0-2.8-1-3.4-2.2l1.6-1.1z'
  },
  {
    name: 'Python',
    category: 'Languages',
    color: '#3572a5',
    svgPath: 'M11.9 2c-3.1 0-5.1 1.4-5.1 4.1v3h5.2v.7H4.7c-2.7 0-4.7 1.9-4.7 5.1s1.9 5.1 4.7 5.1h2.2v-2.7c0-2.3 2-4.3 4.3-4.3h5.2v-.7H16V6.1C16 3.4 14.6 2 11.9 2zm-1.8 1.9a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm1.9 18.1c3.1 0 5.1-1.4 5.1-4.1v-3h-5.2v-.7h7.3c2.7 0 4.7-1.9 4.7-5.1s-1.9-5.1-4.7-5.1h-2.2v2.7c0 2.3-2 4.3-4.3 4.3H7.6v.7H8v6.2c0 2.7 1.4 4.1 4.1 4.1zm1.8-1.9a1 1 0 1 1 0-2 1 1 0 0 1 0 2z'
  },
  {
    name: 'Rust',
    category: 'Languages',
    color: '#dea584',
    svgPath: 'M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm1 14.5h-2v-5H9v-2h6v2h-2v5z'
  },
  {
    name: 'Go',
    category: 'Languages',
    color: '#00add8',
    svgPath: 'M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm3.8 13.5h-4.3c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5c1.4 0 2.6.8 3.1 2h-1.9c-.3-.4-.7-.6-1.2-.6-1 0-1.8.8-1.8 1.8s.8 1.8 1.8 1.8h2.3v-1.2h-2.3v-1.4h4v4.6z'
  },
  {
    name: 'C++',
    category: 'Languages',
    color: '#f34b7d',
    svgPath: 'M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-3.5 13.8c-2.1 0-3.8-1.7-3.8-3.8s1.7-3.8 3.8-3.8c1.3 0 2.4.6 3 1.6l-1.4 1c-.3-.6-.9-.9-1.6-.9-1.2 0-2.1.9-2.1 2.1s.9 2.1 2.1 2.1c.7 0 1.3-.3 1.6-.9l1.4 1c-.6 1-1.7 1.6-3 1.6zm6-3.2v-1.5h1.5v1.5h1.5v1.5H16v1.5h-1.5V14H13v-1.4h1.5zm4 0v-1.5h1.5v1.5h1.5v1.5H20v1.5h-1.5V14H17v-1.4h1.5z'
  },
  {
    name: 'C',
    category: 'Languages',
    color: '#555555',
    svgPath: 'M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 15.5c-3 0-5.5-2.5-5.5-5.5S9 6.5 12 6.5c2 0 3.7 1.1 4.6 2.7l-2.1 1.2c-.6-1.1-1.5-1.7-2.5-1.7-1.8 0-3.3 1.5-3.3 3.3s1.5 3.3 3.3 3.3c1 0 1.9-.6 2.5-1.7l2.1 1.2c-.9 1.6-2.6 2.7-4.6 2.7z'
  },
  {
    name: 'C#',
    category: 'Languages',
    color: '#178600',
    svgPath: 'M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1.5 13.8c-2.1 0-3.8-1.7-3.8-3.8s1.7-3.8 3.8-3.8c1.3 0 2.4.6 3 1.6l-1.4 1c-.3-.6-.9-.9-1.6-.9-1.2 0-2.1.9-2.1 2.1s.9 2.1 2.1 2.1c.7 0 1.3-.3 1.6-.9l1.4 1c-.6 1-1.7 1.6-3 1.6zm8.5-4.2h-1.2l.3-1.5h-1.1l-.3 1.5h-1.3l.3-1.5h-1.1l-.3 1.5H13v1.1h1.1l-.3 1.5H12.7v1.1h1.1l-.3 1.5h1.1l.3-1.5h1.3l-.3 1.5h1.1l.3-1.5h1.2v-1.1h-1.2l.3-1.5H19v-1.1z'
  },
  {
    name: 'Java',
    category: 'Languages',
    color: '#b07219',
    svgPath: 'M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm1.8 14.5c-2.5.3-4.2-.8-4.2-.8s1.3-.3 2.1-.5c.8-.2 1.3-.4 1.3-.4s-.7-.5-1.9-.3c-1.3.3-2.7 1.4-2.7 1.4s1.6.4 3 .2c1.4-.2 2.4-.6 2.4-.6v1zm1.2-3.8c.8.5.5 1.3.5 1.3s-.5-.4-1.4-.4c-.9 0-1.6.3-1.6.3s1.1-.3 2-.7c.9-.4.5-.5.5-.5z'
  },
  {
    name: 'PHP',
    category: 'Languages',
    color: '#777bb4',
    svgPath: 'M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-5.5 13.5l1.2-6.5h2.8c1.3 0 2.1.8 1.8 2.2-.3 1.5-1.5 2.2-2.7 2.2H8.3l-.5 2.1H6.5zm8 0l1.2-6.5h2.8c1.3 0 2.1.8 1.8 2.2-.3 1.5-1.5 2.2-2.7 2.2h-1.3l-.5 2.1h-1.3z'
  },
  {
    name: 'Ruby',
    category: 'Languages',
    color: '#cc342d',
    svgPath: 'M12 2L2 7l10 15 10-15-10-5zm0 3.3L18.4 8H5.6L12 5.3zM4.9 9.5h5.4L8.5 17 4.9 9.5zm7.1 7.7l1.7-7.7h4.4l-6.1 7.7zm2.3-7.7L12 7l-2.3 2.5h4.6z'
  },
  {
    name: 'Swift',
    category: 'Languages',
    color: '#f05138',
    svgPath: 'M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm6.2 13.8c-3.1 3-7.8 2.5-10.7-.7 2.2.8 4.7.4 6.7-.8-1.5-.2-2.8-1-3.6-2.2 1.3.2 2.6-.2 3.5-.9-1.8-.6-3-2.2-3-4.1.8.4 1.7.5 2.6.4-2.1-1.4-2.7-4.1-1.4-6.3 2.3 2.8 5.7 4.5 9.4 4.7-.2-.9 0-1.8.5-2.5 1.4-1.6 3.9-1.7 5.5-.3.8-.2 1.5-.5 2.2-.9-.3.8-.8 1.4-1.5 1.8.7-.1 1.4-.3 2-.6-.5.7-1.1 1.3-1.8 1.8-.4 3.7-1.5 7.1-3.9 9.7z'
  },
  {
    name: 'Kotlin',
    category: 'Languages',
    color: '#A97BFF',
    svgPath: 'M2 2h20L12 12 2 22V2zm10 10l10 10H12l-5-5 5-5z'
  },
  {
    name: 'Dart',
    category: 'Languages',
    color: '#00B4AB',
    svgPath: 'M4 4h7l9 9-7 7-9-9V4zm5.5 1.5L5.5 9.5l7 7 4-4-7-7z'
  },
  {
    name: 'Solidity',
    category: 'Languages',
    color: '#AA6746',
    svgPath: 'M12 2L6 12l6 10 6-10L12 2zm0 3.8l3.7 6.2H8.3L12 5.8zm-3.7 7.7h7.4L12 19.3l-3.7-5.8z'
  },
  {
    name: 'Zig',
    category: 'Languages',
    color: '#ec915c',
    svgPath: 'M3 5h18l-9 14h6v2H3l9-14H6V5z'
  },
  {
    name: 'Julia',
    category: 'Languages',
    color: '#9558B2',
    svgPath: 'M7 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zm10 0a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zm-5-8.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z'
  },
  {
    name: 'R',
    category: 'Languages',
    color: '#198CE7',
    svgPath: 'M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm1.5 14h-2.5l-2-4H7.5v4H5.5V6.5h5c2.5 0 4 1.5 4 3.5 0 1.6-.9 2.8-2.2 3.3l2.7 4.7zm-2.5-6c1.1 0 1.8-.6 1.8-1.5s-.7-1.5-1.8-1.5H7.5V10h3.5z'
  },
  {
    name: 'Scala',
    category: 'Languages',
    color: '#c22d40',
    svgPath: 'M4 4c6 0 12 2 16 5v4c-5-2-11-3-16-3V4zm0 6c6 0 12 2 16 5v4c-5-2-11-3-16-3v-6zm0 6c6 0 12 2 16 5v4c-5-2-11-3-16-3v-6z'
  },
  {
    name: 'Elixir',
    category: 'Languages',
    color: '#6e4a7e',
    svgPath: 'M12 2C8 7 6 11 6 15c0 3.3 2.7 6 6 6s6-2.7 6-6c0-4-2-8-6-13zm0 17c-2.2 0-4-1.8-4-4 0-2.4 1.5-5.3 4-8.8 2.5 3.5 4 6.4 4 8.8 0 2.2-1.8 4-4 4z'
  },
  {
    name: 'Erlang',
    category: 'Languages',
    color: '#a90533',
    svgPath: 'M4 5h16v3H7v3h12v3H7v3h13v3H4V5z'
  },
  {
    name: 'Clojure',
    category: 'Languages',
    color: '#5881d8',
    svgPath: 'M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1 14.5c-2.5 0-4.5-2-4.5-4.5S8.5 7.5 11 7.5s4.5 2 4.5 4.5-2 4.5-4.5 4.5zm5.5-2c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5-.7 1.5-1.5 1.5z'
  },
  {
    name: 'Haskell',
    category: 'Languages',
    color: '#5e5086',
    svgPath: 'M2 3l6 9-6 9h3.5l4.5-6.8L8.5 3H2zm5.5 0l6 9-6 9h3.5l4.5-6.8 4.5 6.8H23l-7.5-11.2L20.5 3H17l-4 6-4-6H7.5zm10 8l2 3h4.5v-3h-6.5zm2 5l2 3h2.5v-3h-4.5z'
  },
  {
    name: 'Lua',
    category: 'Languages',
    color: '#000080',
    svgPath: 'M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1 14.5c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5zm5.5-7c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5-.7 1.5-1.5 1.5z'
  },
  {
    name: 'Perl',
    category: 'Languages',
    color: '#0298c3',
    svgPath: 'M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm2 15h-4v-2h4v2zm0-4h-4V7h4v6z'
  },
  {
    name: 'Groovy',
    category: 'Languages',
    color: '#4298b8',
    svgPath: 'M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm3 13.5c-1.5 1-3.5 1-5 0-1.8-1.2-2.5-3.5-1.8-5.5.8-2 2.8-3.5 5-3.5 1.5 0 3 .6 4 1.8l-1.5 1.5c-.7-.8-1.6-1.2-2.5-1.2-1.5 0-2.8 1-3.3 2.4-.5 1.4 0 3 1.1 3.8 1.1.8 2.6.8 3.7 0v-1.5h-2.5V11H15v4.5z'
  },
  {
    name: 'F#',
    category: 'Languages',
    color: '#b845fc',
    svgPath: 'M5 3h14v3H8v5h9v3H8v7H5V3z'
  },
  {
    name: 'OCaml',
    category: 'Languages',
    color: '#ef7a08',
    svgPath: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm-2.5 13.5c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4zm6-3.5l3 3.5h-2.2l-2-2.5-1 1v1.5H12V8.5h1.3v4.2l2.7-3.2h2.2l-2.7 3.2z'
  },
  {
    name: 'Nim',
    category: 'Languages',
    color: '#ffc200',
    svgPath: 'M12 2L4 7v10l8 5 8-5V7l-8-5zm0 3l6 3.8v7.4L12 20l-6-3.8V8.8L12 5z'
  },
  {
    name: 'Mojo',
    category: 'Languages',
    color: '#ff4500',
    svgPath: 'M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm5 14h-2.5l-2.5-4.5L9.5 16H7V8h2.5l2.5 4.5L14.5 8H17v8z'
  },
  {
    name: 'Crystal',
    category: 'Languages',
    color: '#000100',
    svgPath: 'M12 2L3 7v10l9 5 9-5V7l-9-5zm0 2.5l6.5 3.7-6.5 3.7-6.5-3.7L12 4.5zM4.8 8.8l6.2 3.5v7.2L4.8 16V8.8zm8.2 10.7v-7.2l6.2-3.5V16l-6.2 3.5z'
  },
  {
    name: 'V',
    category: 'Languages',
    color: '#4f87c4',
    svgPath: 'M3 3h4l5 12 5-12h4L14 21h-4L3 3z'
  },
  {
    name: 'D',
    category: 'Languages',
    color: '#ba595e',
    svgPath: 'M5 3h7c4.4 0 8 3.6 8 8s-3.6 8-8 8H5V3zm3.5 13H12c2.8 0 5-2.2 5-5s-2.2-5-5-5H8.5v10z'
  },
  {
    name: 'Fortran',
    category: 'Languages',
    color: '#734f96',
    svgPath: 'M4 3h16v3.5H9v4.5h9v3.5H9V21H4V3z'
  },
  {
    name: 'COBOL',
    category: 'Languages',
    color: '#005ca5',
    svgPath: 'M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm1 14h-4v-8h4v2h-2v1h2v2h-2v1h2v2z'
  },
  {
    name: 'Pascal',
    category: 'Languages',
    color: '#e3dcce',
    svgPath: 'M5 3h7c3.3 0 6 2.7 6 6s-2.7 6-6 6H8.5V21H5V3zm3.5 9H12c1.7 0 3-1.3 3-3s-1.3-3-3-3H8.5v6z'
  },
  {
    name: 'Delphi',
    category: 'Languages',
    color: '#ee1f35',
    svgPath: 'M4 3h7c4.4 0 8 3.6 8 8s-3.6 8-8 8H4V3zm3.5 13H11c2.8 0 5-2.2 5-5s-2.2-5-5-5H7.5v10z'
  },
  {
    name: 'Ada',
    category: 'Languages',
    color: '#02f88c',
    svgPath: 'M12 2L4 21h4.5l1.8-4.5h7.4l1.8 4.5H24L16 2h-4zm0 5.2l2.3 5.8H9.7L12 7.2z'
  },
  {
    name: 'Prolog',
    category: 'Languages',
    color: '#74283c',
    svgPath: 'M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm1 14.5h-2v-4H9v-2h2V9h2v1.5h2v2h-2v4z'
  },
  {
    name: 'Lisp',
    category: 'Languages',
    color: '#0055ff',
    svgPath: 'M6 4c-2.2 0-4 1.8-4 4v8c0 2.2 1.8 4 4 4h2v-2H6c-1.1 0-2-.9-2-2V8c0-1.1.9-2 2-2h2V4H6zm12 0h-2v2h2c1.1 0 2 .9 2 2v8c0 1.1-.9 2-2 2h-2v2h2c2.2 0 4-1.8 4-4V8c0-2.2-1.8-4-4-4z'
  },
  {
    name: 'Assembly',
    category: 'Languages',
    color: '#6E4C13',
    svgPath: 'M4 4h4v3H6v10h2v3H4V4zm12 0h4v16h-4v-3h2V7h-2V4zm-6 4h4v2h-4V8zm0 6h4v2h-4v-2z'
  },
  {
    name: 'WebAssembly',
    category: 'Languages',
    color: '#654ff0',
    svgPath: 'M3 3h18v18H3V3zm3.5 13.5h2.2l1.8-6.2 1.8 6.2h2.2l2.8-9h-2.2l-1.7 6.2-1.8-6.2h-2.2l-1.8 6.2-1.7-6.2H6.5l2.8 9z'
  },
  {
    name: 'Bash',
    category: 'Languages',
    color: '#89e051',
    svgPath: 'M3 4h18v16H3V4zm3 4l4 4-4 4v-2l2-2-2-2V8zm6 6h6v2h-6v-2z'
  },
  {
    name: 'PowerShell',
    category: 'Languages',
    color: '#012456',
    svgPath: 'M3 4h18v16H3V4zm3 4.5l5 3.5-5 3.5V13l2.5-1.5L6 10V8.5zm7 7h5v1.5h-5v-1.5z'
  },
  {
    name: 'SQL',
    category: 'Languages',
    color: '#e38c00',
    svgPath: 'M12 2C6.5 2 2 3.8 2 6v12c0 2.2 4.5 4 10 4s10-1.8 10-4V6c0-2.2-4.5-4-10-4zm0 2c4.4 0 8 1.3 8 2s-3.6 2-8 2-8-1.3-8-2 3.6-2 8-2zm0 16c-4.4 0-8-1.3-8-2v-2.2c1.9 1 5 1.7 8 1.7s6.1-.7 8-1.7V18c0 .7-3.6 2-8 2zm0-5c-4.4 0-8-1.3-8-2V10.8c1.9 1 5 1.7 8 1.7s6.1-.7 8-1.7V13c0 .7-3.6 2-8 2z'
  },
  {
    name: 'GraphQL',
    category: 'Languages',
    color: '#e535ab',
    svgPath: 'M12 2L3 7v10l9 5 9-5V7l-9-5zm0 2.2l6.8 3.8v7.6L12 19.4 5.2 15.6V8L12 4.2zm-4 5.3a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm8 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm-4 5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z'
  },
  {
    name: 'Elm',
    category: 'Languages',
    color: '#60b5cc',
    svgPath: 'M2 2h20v20H2V2zm4 4v12h12V6H6zm2 2h8v8H8V8z'
  },

  // ==========================================
  // FRONTEND & MOBILE
  // ==========================================
  {
    name: 'React',
    category: 'Frontend',
    color: '#61dafb',
    svgPath: 'M12 9.5c1.4 0 2.5 1.1 2.5 2.5s-1.1 2.5-2.5 2.5-2.5-1.1-2.5-2.5 1.1-2.5 2.5-2.5zm0-7.5C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 16.5c-4.1 0-6.9-1.7-6.9-3.8 0-1.8 2.1-3.3 5.3-3.7-.2.6-.3 1.3-.3 2 0 .5.1 1 .2 1.5-1.9.3-3.2 1.1-3.2 2 0 1.2 2.6 2.3 4.9 2.3s4.9-1.1 4.9-2.3c0-.9-1.3-1.7-3.2-2 .1-.5.2-1 .2-1.5 0-.7-.1-1.4-.3-2 3.2.4 5.3 1.9 5.3 3.7 0 2.1-2.8 3.8-6.9 3.8z'
  },
  {
    name: 'Vue',
    category: 'Frontend',
    color: '#41b883',
    svgPath: 'M2 3h3.5L12 14.5 18.5 3H22L12 21 2 3zm4.5 0h3L12 7.5 14.5 3h3L12 12 6.5 3z'
  },
  {
    name: 'Next.js',
    category: 'Frontend',
    color: '#ffffff',
    svgPath: 'M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm3.8 14.3l-5.3-7.2v7.2H8.8V7.7h1.9l5.4 7.3V7.7h1.7v8.6h-2z'
  },
  {
    name: 'Svelte',
    category: 'Frontend',
    color: '#ff3e00',
    svgPath: 'M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm4.8 6.5l-1.9 1.1c.3.5.5 1 .5 1.6 0 1.4-1.1 2.5-2.5 2.5h-1.4l1.2-2.1c.3-.5.1-1.2-.4-1.5-.5-.3-1.2-.1-1.5.4l-2 3.5c-.3.5-.1 1.2.4 1.5.2.1.4.2.6.2h3.1c2.6 0 4.7-2.1 4.7-4.7 0-1-.3-1.9-.9-2.5z'
  },
  {
    name: 'Tailwind',
    category: 'Frontend',
    color: '#38bdf8',
    svgPath: 'M12 6c-3 0-4.8 1.5-5.4 4.5 1.2-1.5 2.7-2.1 4.5-1.8 1 .2 1.8 1 2.6 1.8C15 11.8 16.6 13.5 20 13.5c3 0 4.8-1.5 5.4-4.5-1.2 1.5-2.7 2.1-4.5 1.8-1-.2-1.8-1-2.6-1.8C17 7.7 15.4 6 12 6zM6 12c-3 0-4.8 1.5-5.4 4.5 1.2-1.5 2.7-2.1 4.5-1.8 1 .2 1.8 1 2.6 1.8C9 17.8 10.6 19.5 14 19.5c3 0 4.8-1.5 5.4-4.5-1.2 1.5-2.7 2.1-4.5 1.8-1-.2-1.8-1-2.6-1.8C11 13.7 9.4 12 6 12z'
  },
  {
    name: 'Flutter',
    category: 'Frontend',
    color: '#02569B',
    svgPath: 'M14 2L4 12l3 3 13-13h-6zm-4 12l-6 6 3 3 9-9-6-6z'
  },
  {
    name: 'Angular',
    category: 'Frontend',
    color: '#dd0031',
    svgPath: 'M12 2L2 5.5l1.6 12.5L12 22l8.4-4L22 5.5 12 2zm0 3.2l5.5 11.3h-2.1l-1.2-2.8H9.8l-1.2 2.8H6.5L12 5.2zm-1.4 6.7h2.8L12 8.5l-1.4 3.4z'
  },
  {
    name: 'HTML5',
    category: 'Frontend',
    color: '#e34c26',
    svgPath: 'M3 3l1.6 16.5L12 22l7.4-2.5L21 3H3zm14.3 4.4l-.2 2.2H8.6l.2 2.2h8.1l-.6 6.3-4.3 1.2-4.3-1.2-.3-3.4h2.2l.2 1.7 2.2.6 2.2-.6.2-2.5H6.3L5.6 7.4h11.7z'
  },
  {
    name: 'CSS3',
    category: 'Frontend',
    color: '#264de4',
    svgPath: 'M3 3l1.6 16.5L12 22l7.4-2.5L21 3H3zm14.3 4.4H6.8l.2 2.2h9.9l-.6 6.3-4.3 1.2-4.3-1.2-.3-3.4h2.2l.2 1.7 2.2.6 2.2-.6.3-3.6H6.1L5.6 7.4h11.7z'
  },

  // ==========================================
  // BACKEND & APIS
  // ==========================================
  {
    name: 'FastAPI',
    category: 'Backend',
    color: '#009688',
    svgPath: 'M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm1 14.5l-4.5-5h3V6.5l4.5 5h-3v5z'
  },
  {
    name: 'Django',
    category: 'Backend',
    color: '#092e20',
    svgPath: 'M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1.8 14.5H8.5V7.5h1.7v9zm5.3 0h-1.7V7.5h1.7v9zm-1.7-4.5h-1.9V10h1.9v2z'
  },
  {
    name: 'Laravel',
    category: 'Backend',
    color: '#ff2d20',
    svgPath: 'M12 2L3 7v10l9 5 9-5V7l-9-5zm0 2.2l6.8 3.8-3 1.7L9 5.9l3-1.7zM5 8.3l6 3.3v6.7l-6-3.3V8.3zm8 10V11.6l6-3.3v6.7l-6 3.3z'
  },
  {
    name: 'Node.js',
    category: 'Backend',
    color: '#339933',
    svgPath: 'M12 2L3.5 7v10L12 22l8.5-5V7L12 2zm0 2.3l6.5 3.8v7.6L12 19.5 5.5 15.7V8.1L12 4.3zm-1.5 5.2v5h3v-1.5h-1.5v-2h1.5V9.5h-3z'
  },
  {
    name: 'Express',
    category: 'Backend',
    color: '#ffffff',
    svgPath: 'M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm3.5 13.5l-2.3-3.2-2.3 3.2H8.8l3-4.2-2.8-3.8h2.1l2 2.8 2-2.8h2.1l-2.8 3.8 3 4.2h-2.1z'
  },
  {
    name: 'Spring',
    category: 'Backend',
    color: '#6db33f',
    svgPath: 'M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1 15c-3 0-5-2-5-5s2-5 5-5 5 2 5 5-2 5-5 5z'
  },

  // ==========================================
  // DATABASES
  // ==========================================
  {
    name: 'PostgreSQL',
    category: 'Databases',
    color: '#4169e1',
    svgPath: 'M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm3 14.5c-1.5 0-2.8-.8-3.4-2-.6 1.2-1.9 2-3.4 2-2.1 0-3.7-1.7-3.7-3.7 0-2.8 3-5.3 7.1-5.3s7.1 2.5 7.1 5.3c0 2-1.6 3.7-3.7 3.7z'
  },
  {
    name: 'MongoDB',
    category: 'Databases',
    color: '#47a248',
    svgPath: 'M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm.8 16.5v-3.7c1.8-.4 3.2-2 3.2-3.8 0-2.2-1.8-4-4-4s-4 1.8-4 4c0 1.8 1.4 3.4 3.2 3.8v3.7c-2.8-.6-5-3.1-5-6.5 0-3.6 2.9-6.5 6.5-6.5s6.5 2.9 6.5 6.5c0 3.4-2.2 5.9-5 6.5z'
  },
  {
    name: 'Redis',
    category: 'Databases',
    color: '#dc382d',
    svgPath: 'M12 2L2 7l10 5 10-5-10-5zm0 7.3L5.5 6 12 2.8 18.5 6 12 9.3zM2 9.5l10 5 10-5v2.5l-10 5-10-5V9.5zm0 5l10 5 10-5v2.5l-10 5-10-5v-2.5z'
  },
  {
    name: 'MySQL',
    category: 'Databases',
    color: '#4479a1',
    svgPath: 'M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm4.5 13.5h-2l-1.5-3.5-1.5 3.5h-2l2.5-5.5-2.2-4.5h2l1.2 3 1.2-3h2l-2.2 4.5 2.5 5.5z'
  },
  {
    name: 'MariaDB',
    category: 'Databases',
    color: '#003545',
    svgPath: 'M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm2 14.5l-2-4-2 4H8.5l3-5.5-2.8-5h1.8l2 3.8 2-3.8h1.8l-2.8 5 3 5.5H14z'
  },
  {
    name: 'SQLite',
    category: 'Databases',
    color: '#003b57',
    svgPath: 'M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm3.5 13.5h-7v-1.8h7v1.8zm0-3.5h-7v-1.8h7v1.8zm0-3.5h-7V6.7h7v1.8z'
  },
  {
    name: 'Supabase',
    category: 'Databases',
    color: '#3ecf8e',
    svgPath: 'M12 2L4 13h7l-2 9 11-12h-8l2-8z'
  },

  // ==========================================
  // DEVOPS & TOOLS
  // ==========================================
  {
    name: 'Docker',
    category: 'DevOps & Tools',
    color: '#2496ed',
    svgPath: 'M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm7.2 9.5c-.2 0-.4 0-.6.1-.3-.7-1-1.1-1.7-1.1-.3 0-.6.1-.9.2-.5-.8-1.4-1.3-2.4-1.3-.2 0-.4 0-.6.1V8.5h-2V10h-2V8.5h-2V10H7v1.5H5.5c-1 0-1.8.8-1.8 1.8 0 2.5 2 4.5 4.5 4.5h8.5c2.2 0 4-1.8 4-4 0-.9-.7-1.7-1.5-2.3z'
  },
  {
    name: 'Linux',
    category: 'DevOps & Tools',
    color: '#fcc624',
    svgPath: 'M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm1 4.5c.8 0 1.5.7 1.5 1.5s-.7 1.5-1.5 1.5-1.5-.7-1.5-1.5.7-1.5 1.5-1.5zm-2 0c.8 0 1.5.7 1.5 1.5s-.7 1.5-1.5 1.5-1.5-.7-1.5-1.5.7-1.5 1.5-1.5zm1 11c-2.2 0-4-1.8-4-4 0-1.5.8-2.8 2-3.5.5-.3 1.2-.5 2-.5s1.5.2 2 .5c1.2.7 2 2 2 3.5 0 2.2-1.8 4-4 4z'
  },
  {
    name: 'Nginx',
    category: 'DevOps & Tools',
    color: '#009639',
    svgPath: 'M12 2L3 7v10l9 5 9-5V7l-9-5zm0 2.2l6.8 3.8v7.6L12 19.4 5.2 15.6V8L12 4.2zm-2.8 4.6v6.4l5.6-6.4v6.4h-1.6V9.8l-5.6 6.4V8.8h1.6z'
  },
  {
    name: 'Git',
    category: 'DevOps & Tools',
    color: '#f05032',
    svgPath: 'M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm5.7 10.7l-4.4 4.4c-.4.4-1 .4-1.4 0l-4.4-4.4c-.4-.4-.4-1 0-1.4l4.4-4.4c.4-.4 1-.4 1.4 0l4.4 4.4c.4.4.4 1 0 1.4z'
  },
  {
    name: 'Cloudflare',
    category: 'DevOps & Tools',
    color: '#f38020',
    svgPath: 'M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm5.5 13.5H7.8c-1.3 0-2.3-1-2.3-2.3 0-1.1.8-2 1.9-2.2.3-1.6 1.7-2.8 3.4-2.8 1.4 0 2.6.8 3.1 2 .4-.2.8-.3 1.2-.3 1.4 0 2.5 1.1 2.5 2.5 0 .2 0 .4-.1.6.8.5 1.3 1.4 1.3 2.5 0 1.3-1 2.3-2.3 2.3z'
  },
  {
    name: 'Kubernetes',
    category: 'DevOps & Tools',
    color: '#326ce5',
    svgPath: 'M12 2L3 7v10l9 5 9-5V7l-9-5zm0 2.2l6.8 3.8v7.6L12 19.4 5.2 15.6V8L12 4.2zm0 3.3a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9zm0 2a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5z'
  },
  {
    name: 'Android',
    category: 'Frontend',
    color: '#3ddc84',
    svgPath: 'M17.5 9.2l1.6-2.8c.2-.3.1-.7-.2-.9s-.7-.1-.9.2L16.3 8.6C15 8 13.5 7.7 12 7.7s-3 .3-4.3.9L6 5.7c-.2-.3-.6-.4-.9-.2s-.4.6-.2.9l1.6 2.8C3.9 10.9 2 13.8 2 17.2h20c0-3.4-1.9-6.3-4.5-8zm-8.5 4.3c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm6 0c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1z'
  },
  {
    name: 'Firebase',
    category: 'Databases',
    color: '#ffca28',
    svgPath: 'M3.9 14.5L6.3 3.4c.1-.4.6-.5.8-.2l3.4 6.3-6.6 5zm14.6 2.4L16.2 4.2c-.1-.4-.6-.5-.8-.1l-4.2 8 7.3 4.8zm-14.8-1.4l7.8 4.4c.3.2.7.2 1 0l7.8-4.4-4.8-9.1-11.8 9.1z'
  },
  {
    name: 'GitHub',
    category: 'DevOps & Tools',
    color: '#ffffff',
    svgPath: 'M12 2C6.5 2 2 6.5 2 12c0 4.4 2.9 8.2 6.8 9.5.5.1.7-.2.7-.5v-1.8c-2.8.6-3.4-1.3-3.4-1.3-.5-1.1-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.6.3-1.1.6-1.3-2.2-.3-4.6-1.1-4.6-4.9 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.8 1 .8-.2 1.7-.3 2.5-.3.8 0 1.7.1 2.5.3 2-1.3 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.8-2.4 4.6-4.6 4.9.4.3.7.9.7 1.8v2.7c0 .3.2.6.7.5 4-1.3 6.8-5.1 6.8-9.5 0-5.5-4.5-10-10-10z'
  },
  {
    name: 'GitHub Actions',
    category: 'DevOps & Tools',
    color: '#2088ff',
    svgPath: 'M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm1 14.8v-3.3l3.2-3.2-1.4-1.4-2.8 2.8V6.5h-2v4.8L7.2 8.5 5.8 9.9l3.2 3.2v3.7h4z'
  },
  {
    name: 'DigitalOcean',
    category: 'DevOps & Tools',
    color: '#0080ff',
    svgPath: 'M12 2C6.5 2 2 6.5 2 12c0 4.6 3.1 8.5 7.4 9.6v-3.7H7.7V16H9.4v-2.2h2V16h2.2v1.9h-2.2v3.9c5-.7 8.8-5 8.8-10 0-5.5-4.5-10-10-10z'
  },
  {
    name: 'JWT',
    category: 'Backend',
    color: '#d63aff',
    svgPath: 'M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 14.5h-2v-5h2zm-1-6.5a1.2 1.2 0 1 1 1.2-1.2A1.2 1.2 0 0 1 12 10z'
  },
  {
    name: 'OAuth',
    category: 'Backend',
    color: '#eb5424',
    svgPath: 'M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 4a3.5 3.5 0 1 1-3.5 3.5A3.5 3.5 0 0 1 12 6zm4.5 11h-9v-1.5c0-2 3-3.1 4.5-3.1s4.5 1.1 4.5 3.1z'
  },
  {
    name: 'SSL/TLS',
    category: 'DevOps & Tools',
    color: '#0095d5',
    svgPath: 'M12 2L4 5.5v6.2c0 5.2 3.4 10.1 8 11.3 4.6-1.2 8-6.1 8-11.3V5.5L12 2zm3 11h-1.5v1.8c0 .8-.7 1.4-1.5 1.4s-1.5-.6-1.5-1.4V13H9v-3.5h6V13zm-2-1.5h-2V10c0-.6.4-1 1-1s1 .4 1 1v1.5z'
  },
  {
    name: 'Postman',
    category: 'DevOps & Tools',
    color: '#ff6c37',
    svgPath: 'M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm4.5 11.2l-3.3 1.8a2.5 2.5 0 0 1-3.6-2.2 2.5 2.5 0 0 1 1.3-2.2l3.3-1.8a2.5 2.5 0 0 1 3.6 2.2 2.5 2.5 0 0 1-1.3 2.2z'
  },
  {
    name: 'VS Code',
    category: 'DevOps & Tools',
    color: '#007acc',
    svgPath: 'M17.5 2L7 11.5l3.5 3L17.5 2zm-13 8.3L2 12l2.5 1.7 4-3.7-4-3.7zm13 11.7l-7-9.5 3.5-3 7 12.5h-3.5zM22 6.5v11l-3.5-2.5V9L22 6.5z'
  },
  {
    name: 'Hugging Face',
    category: 'Backend',
    color: '#ffd21e',
    svgPath: 'M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm-3.5 7.5a1.5 1.5 0 1 1-1.5 1.5 1.5 1.5 0 0 1 1.5-1.5zm7 0a1.5 1.5 0 1 1-1.5 1.5 1.5 1.5 0 0 1 1.5-1.5zM12 17.5c-2.3 0-4.2-1.6-4.7-3.8h9.4c-.5 2.2-2.4 3.8-4.7 3.8z'
  },
  {
    name: 'LangChain',
    category: 'Backend',
    color: '#00a67e',
    svgPath: 'M12 2L4 6v12l8 4 8-4V6l-8-4zm-1 14.5l-4-2V8.5l4 2v6zm6-2l-4 2V10.5l4-2v6z'
  },
  {
    name: 'AWS',
    category: 'DevOps & Tools',
    color: '#ff9900',
    svgPath: 'M18.8 14.2c-2.8 1.9-6.9 2.9-10.4 1.8-1.5-.5-2.8-1.3-3.9-2.3-.3-.3-.3-.7 0-1 .3-.3.8-.3 1.1 0 .9.8 2.1 1.5 3.3 1.9 2.9.9 6.4 0 8.7-1.5.3-.2.8-.2 1.1.1.3.3.3.8.1 1zm-10-4.8l-1.6 4.7H5.6L8 5.7h2.1l2.4 8.4h-1.6l-.7-2.1H8.8zm.5-1.5h1.7l-.8-2.6-.9 2.6zm6.8 6.2h-1.6V5.7h1.6v8.4z'
  },
  {
    name: 'Azure',
    category: 'DevOps & Tools',
    color: '#0078d4',
    svgPath: 'M13.2 2.5L5.8 16.2h5.5l1.9-4.2 3.8 9.5H22L13.2 2.5zM3 18.5h6.2L7.3 21.5H2l1-3z'
  },
  {
    name: 'Google Cloud',
    category: 'DevOps & Tools',
    color: '#4285f4',
    svgPath: 'M19.4 10.5c-.3-2.6-2.5-4.5-5.2-4.5-2 0-3.8 1.1-4.7 2.8-1.8.2-3.2 1.8-3.2 3.7 0 2.1 1.7 3.8 3.8 3.8h9.1c1.9 0 3.5-1.6 3.5-3.5 0-1.8-1.4-3.3-3.3-3.3z'
  },
  {
    name: 'Oracle Cloud',
    category: 'DevOps & Tools',
    color: '#f80000',
    svgPath: 'M16.5 6H7.5C4.5 6 2 8.5 2 11.5S4.5 17 7.5 17h9c3 0 5.5-2.5 5.5-5.5S19.5 6 16.5 6zm0 8.5h-9c-1.7 0-3-1.3-3-3s1.3-3 3-3h9c1.7 0 3 1.3 3 3s-1.3 3-3 3z'
  },
];

// Common language & technology aliases
const TECH_ALIASES: Record<string, string> = {
  js: 'javascript',
  ts: 'typescript',
  py: 'python',
  rs: 'rust',
  golang: 'go',
  cpp: 'c++',
  'c++': 'c++',
  'c#': 'c#',
  cs: 'c#',
  csharp: 'c#',
  'c-sharp': 'c#',
  rb: 'ruby',
  kt: 'kotlin',
  sh: 'bash',
  shell: 'bash',
  ps: 'powershell',
  ps1: 'powershell',
  wasm: 'webassembly',
  asm: 'assembly',
  sol: 'solidity',
  postgres: 'postgresql',
  pgsql: 'postgresql',
  psql: 'postgresql',
  mongo: 'mongodb',
  k8s: 'kubernetes',
  reactjs: 'react',
  vuejs: 'vue',
  next: 'next.js',
  nextjs: 'next.js',
  node: 'node.js',
  nodejs: 'node.js',
  tailwind: 'tailwind',
  tailwindcss: 'tailwind',
  android: 'android',
  firebase: 'firebase',
  github: 'github',
  'github actions': 'github actions',
  actions: 'github actions',
  'gh-actions': 'github actions',
  digitalocean: 'digitalocean',
  do: 'digitalocean',
  jwt: 'jwt',
  oauth: 'oauth',
  auth0: 'oauth',
  'ssl/tls': 'ssl/tls',
  ssl: 'ssl/tls',
  tls: 'ssl/tls',
  postman: 'postman',
  'vs code': 'vs code',
  vscode: 'vs code',
  'visual studio code': 'vs code',
  'hugging face': 'hugging face',
  huggingface: 'hugging face',
  hf: 'hugging face',
  langchain: 'langchain',
  aws: 'aws',
  azure: 'azure',
  'google cloud': 'google cloud',
  googlecloud: 'google cloud',
  gcp: 'google cloud',
  'oracle cloud': 'oracle cloud',
  oracle: 'oracle cloud',
  oci: 'oracle cloud',
};

export const TECH_ICON_MAP: Record<string, TechIconDef> = TECH_CATALOG.reduce((acc, icon) => {
  acc[icon.name.toLowerCase()] = icon;
  return acc;
}, {} as Record<string, TechIconDef>);

// Deterministic vibrant color generator for any arbitrary custom language
function hashStringToColor(str: string): string {
  const palette = [
    '#3178c6', '#3572a5', '#dea584', '#00add8', '#f1e05a', 
    '#f34b7d', '#b07219', '#A97BFF', '#00B4AB', '#AA6746', 
    '#ec915c', '#9558B2', '#198CE7', '#c22d40', '#6e4a7e',
    '#ff4500', '#009688', '#e535ab', '#41b883', '#ff3e00'
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % palette.length;
  return palette[index];
}

export function getTechIcon(name: string): TechIconDef {
  const cleanName = (name || '').trim();
  const lower = cleanName.toLowerCase();
  
  // 1. Direct map lookup
  if (TECH_ICON_MAP[lower]) {
    return TECH_ICON_MAP[lower];
  }
  
  // 2. Alias lookup
  const aliased = TECH_ALIASES[lower];
  if (aliased && TECH_ICON_MAP[aliased]) {
    return TECH_ICON_MAP[aliased];
  }

  // 3. Normalized alphanumeric search in catalog
  const normalized = lower.replace(/[^a-z0-9]/g, '');
  const found = TECH_CATALOG.find(
    (item) => item.name.toLowerCase().replace(/[^a-z0-9]/g, '') === normalized
  );
  if (found) {
    return found;
  }

  // 4. Fallback: generate a clean, deterministic vector monogram tile
  const color = hashStringToColor(cleanName);
  return {
    name: cleanName,
    category: 'Languages',
    color,
    // Universal code brackets vector icon
    svgPath: 'M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z'
  };
}
