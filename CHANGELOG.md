# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [1.2.1](https://github.com/bigcommerce/request-sender-js/compare/v1.2.0...v1.2.1) (2022-06-28)


### Bug Fixes

* **common:** FE-00 Update typescript config to remove sourcemap generation ([8381ece](https://github.com/bigcommerce/request-sender-js/commit/8381ece623827b2ab18cea734e887f7dc38d2778))

## [1.2.0](https://github.com/bigcommerce/request-sender-js/compare/v1.1.0...v1.2.0) (2020-07-13)


### Features

* **common:** RS-28 Publish as es5 ([#30](https://github.com/bigcommerce/request-sender-js/issues/30)) ([66ce65a](https://github.com/bigcommerce/request-sender-js/commit/66ce65ae4bed8381edc4bcf0ecadf563948de427))


### Bug Fixes

* **common:** CHP-00 remove esm folder on prebuild ([90b7258](https://github.com/bigcommerce/request-sender-js/commit/90b725894fd3bb09653b42b29efbb38762f47cab))

## [1.1.0](https://github.com/bigcommerce/request-sender-js/compare/v1.0.3...v1.1.0) (2020-06-10)


### Features

* **common:** RS-28 add ESM support ([#29](https://github.com/bigcommerce/request-sender-js/issues/29)) ([45a0d87](https://github.com/bigcommerce/request-sender-js/commit/45a0d879e6d7b95ac729f7a6d1a7271cbeb33ecc))

### [1.0.3](https://github.com/bigcommerce/request-sender-js/compare/v1.0.2...v1.0.3) (2020-05-29)


### Bug Fixes

* **common:** INT-2280 Allow removal of XSRF Token for remote API call ([3413456](https://github.com/bigcommerce/request-sender-js/commit/341345622fa3e22441b6d969fc5641026dc1cf42))

### [1.0.2](https://github.com/bigcommerce/request-sender-js/compare/v1.0.1...v1.0.2) (2020-05-14)


### Bug Fixes

* **common:** CHP-6524 query-string@6 doesn't support older browsers ([#26](https://github.com/bigcommerce/request-sender-js/issues/26)) ([eb82d08](https://github.com/bigcommerce/request-sender-js/commit/eb82d083b63b385ebd64f18efbab26e8ed646b5e))

### [1.0.1](https://github.com/bigcommerce/request-sender-js/compare/v1.0.0...v1.0.1) (2020-05-07)


### Bug Fixes

* **common:** CHP-6487 remove explicit unknown generic types ([#24](https://github.com/bigcommerce/request-sender-js/issues/24)) ([c763526](https://github.com/bigcommerce/request-sender-js/commit/c763526766f041348fe73d41d8a5b4c626088b95))

## [1.0.0](https://github.com/bigcommerce/request-sender-js/compare/v0.5.1...v1.0.0) (2020-05-06)


### ⚠ BREAKING CHANGES

* **common:** Requires `typescript` version 3.x.

### Features

* **request:** CHP-6487 change response types from any to unknown ([#23](https://github.com/bigcommerce/request-sender-js/issues/23)) ([18c0226](https://github.com/bigcommerce/request-sender-js/commit/18c02267e8c564bfd6b0c949afbd1d3dabbce8cb))


* **common:** CHP-6487 bump dependencies and fix breaking changes ([#22](https://github.com/bigcommerce/request-sender-js/issues/22)) ([a9f7d43](https://github.com/bigcommerce/request-sender-js/commit/a9f7d4367adefef820adc986d2be28907b4054bb))

<a name="0.5.1"></a>
## [0.5.1](https://github.com/bigcommerce/request-sender-js/compare/v0.5.0...v0.5.1) (2020-04-22)


### Bug Fixes

* **request:** CHECKOUT-4835 Stop automatically attaching CSRF token when requesting assets ([b24d0cf](https://github.com/bigcommerce/request-sender-js/commit/b24d0cf))



<a name="0.5.0"></a>
# [0.5.0](https://github.com/bigcommerce/request-sender-js/compare/v0.4.0...v0.5.0) (2020-02-06)


### Features

* **request:** CHP-6278 add request option to prevent param encoding ([4d13047](https://github.com/bigcommerce/request-sender-js/commit/4d13047))



<a name="0.4.0"></a>
# [0.4.0](https://github.com/bigcommerce/request-sender-js/compare/v0.3.0...v0.4.0) (2019-10-07)


### Features

* **request:** CHP-6060 adds optional cache functionality ([5f9eb73](https://github.com/bigcommerce/request-sender-js/commit/5f9eb73))



<a name="0.3.0"></a>
# [0.3.0](https://github.com/bigcommerce/request-sender-js/compare/v0.2.1...v0.3.0) (2019-06-05)


### Features

* **request:** CHECKOUT-4149 Transform URL encoded content if specified in request header ([512f740](https://github.com/bigcommerce/request-sender-js/commit/512f740))



<a name="0.2.1"></a>
## [0.2.1](https://github.com/bigcommerce/request-sender-js/compare/v0.2.0...v0.2.1) (2018-11-26)


### Bug Fixes

* **request:** CHECKOUT-3703 Only include content-type header if there is request body ([cb5fc62](https://github.com/bigcommerce/request-sender-js/commit/cb5fc62))



<a name="0.2.0"></a>
# [0.2.0](https://github.com/bigcommerce/request-sender-js/compare/v0.1.8...v0.2.0) (2018-08-30)


### Features

* **request:** CHECKOUT-3457 Configure `RequestSender` with host URL ([ca6df46](https://github.com/bigcommerce/request-sender-js/commit/ca6df46))



<a name="0.1.8"></a>
## [0.1.8](https://github.com/bigcommerce/request-sender-js/compare/v0.1.7...v0.1.8) (2018-07-12)



<a name="0.1.7"></a>
## [0.1.7](https://github.com/bigcommerce/request-sender-js/compare/v0.1.6...v0.1.7) (2018-07-05)


### Bug Fixes

* **core:** CHECKOUT-2899 Fix `Response` type ([660a457](https://github.com/bigcommerce/request-sender-js/commit/660a457))



<a name="0.1.6"></a>
## [0.1.6](https://github.com/bigcommerce/request-sender-js/compare/v0.1.5...v0.1.6) (2018-07-05)


### Bug Fixes

* **core:** CHECKOUT-2899 Fix TS definition exports ([c50836c](https://github.com/bigcommerce/request-sender-js/commit/c50836c))



<a name="0.1.5"></a>
## [0.1.5](https://github.com/bigcommerce/request-sender-js/compare/v0.1.4...v0.1.5) (2018-07-05)


### Bug Fixes

* **common:** CHECKOUT-2899 Fix based on feedback ([06dd790](https://github.com/bigcommerce/request-sender-js/commit/06dd790))



<a name="0.1.4"></a>
## [0.1.4](https://github.com/bigcommerce/request-sender-js/compare/v0.1.3...v0.1.4) (2018-05-28)


### Bug Fixes

* **common:** CHECKOUT-3191 Fix sourcemaps by enabling `inlineSources` ([aa05e94](https://github.com/bigcommerce/request-sender-js/commit/aa05e94))



<a name="0.1.3"></a>
## [0.1.3](https://github.com/bigcommerce/request-sender-js/compare/v0.1.2...v0.1.3) (2018-05-16)



<a name="0.1.2"></a>
## [0.1.2](https://github.com/bigcommerce/request-sender-js/compare/v0.1.1...v0.1.2) (2018-04-04)



<a name="0.1.1"></a>
## [0.1.1](https://github.com/bigcommerce/request-sender-js/compare/v0.1.0...v0.1.1) (2018-03-14)



<a name="0.1.0"></a>
# 0.1.0 (2017-12-27)


### Features

* **request:** CHECKOUT-2738 Add RequestSender ([8c953bd](https://github.com/bigcommerce/request-sender-js/commit/8c953bd))
