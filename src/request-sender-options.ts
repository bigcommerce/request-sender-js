import Cache from './cache';

export default interface RequestSenderOptions {
    cache?: Cache;
    host?: string;
}
