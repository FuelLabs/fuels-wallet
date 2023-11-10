declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

// If using SCSS or LESS
declare module '*.module.scss' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.less' {
  const classes: { [key: string]: string };
  export default classes;
}
