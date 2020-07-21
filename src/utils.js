import createDebugger from 'debug';

export const debug = (namespace) => createDebugger(`xm:${namespace}`);

export const noop = () => {};
