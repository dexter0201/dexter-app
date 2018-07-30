// shape expected
// key, error message
function customErrorShape(data={}) {
    return Promise.reject(data);
}

export {
    customErrorShape
};