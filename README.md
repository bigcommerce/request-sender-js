# RequestSender

A simple library for sending HTTP requests.

## Usage

To send a HTTP request.

```js
import { createRequestSender } from '@bigcommerce/request-sender';

const requestSender = createRequestSender();

// GET request
requestSender.get('/foobars')
    .then(({ body }) => console.log(body));

// POST request
requestSender.post('/foobars', { body: { name: 'Foobar' } })
    .then(({ body }) => console.log(body));
```

To cancel a pending request

```js
import { createRequestSender, createTimeout } from '@bigcommerce/request-sender';

const timeout = createTimeout(100);
const requestSender = createRequestSender();

requestSender.get('/foobars', { timeout })
    .catch(({ status }) => console.log(status));

timeout.cancel();
```

## API

### createRequestSender()

To create a new instance of `RequestSender`.

### createTimeout(delay: number?)

To create a new instance of `Timeout`. If `delay` is defined, the instance will automatically timeout after the specified period. Otherwise, it remains inactive until `complete()` is called.

### RequestSender
#### sendRequest(url: string, options: RequestOptions): Promise<Response>
#### get(url: string, options: RequestOptions): Promise<Response>
#### post(url: string, options: RequestOptions): Promise<Response>
#### put(url: string, options: RequestOptions): Promise<Response>
#### patch(url: string, options: RequestOptions): Promise<Response>
#### delete(url: string, options: RequestOptions): Promise<Response>

To submit a HTTP request using `GET`, `POST`, `PUT`, `PATCH` or `DELETE` method. Alternatively, you can call `sendRequest` and specify the request method as an argument.

### Timeout
#### complete(): void;

To manually complete a timeout.

### RequestOptions
#### body: any?
Request payload.
Default: `null`

#### headers: Object?
Request headers.
Default: `{
    'Accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
}`

#### params: Object?
URL parameters. They get serialized as a query string.
Default: `null`

#### method: string?
Request method. It's ignored if calling one of the convenience methods (`get`, `post` etc...).
Default: `GET`

#### credentials: boolean?
Same as `XMLHttpRequest.withCredentials`.
Default: `true`

#### timeout: Timeout?
Define if wish to timeout a request.
Default: `null`

### Response

#### body: any
Response body.
Default: `null`

#### headers: Object
Response headers.
Default: `{}`

#### status: number?
Response status code. Return `0` if the request is cancelled.
Default: `undefined`

#### statusText: string?
Response status text.
Default: `undefined`

## Development

Some useful commands

```sh
# To test
npm test

# To lint
npm run lint

# To release
npm run release
```

For more commands, please see `package.json`

## License

MIT
