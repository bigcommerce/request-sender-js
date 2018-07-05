import Timeout from './timeout';

export default function createTimeout(delay?: number): Timeout {
    return new Timeout(delay);
}
