export default function isPromise(promise: any): promise is Promise<any> {
    return !!promise &&
        (typeof promise === 'object' || typeof promise === 'function') &&
        typeof promise.then === 'function';
}
