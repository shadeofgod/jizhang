import createDebugger from 'debug';

const debug = (namespace) => createDebugger(`xm:${namespace}`);

export default debug;
