
import Module from './add.js';

const wrapped_add = await Module().then(addModule => {
    console.log(Object.getOwnPropertyNames(addModule));
    return addModule.cwrap("add", "number", ["number", "number"]);
});

export function add_test(a, b) {
    return wrapped_add(a, b);
}