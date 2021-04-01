# lazyLoadImage JS

lazyLoadImage — is the simplest way to load pictures assets asynchronously.

Features:

* Async loading for `<img>` tags.
* Async loading `background-image` for `css`.
* Start loading when element's boundary is in viewport.
* Support updating tracking elements list when changing DOM happens.
* Support element's boundary offset for start loading before element will be in viewport.
* Support binding element's boundary to its parent.

### Usage

> All elements with `data-src` attribute will be added to **lazyLoadImage** tracking list **automatically** after starting **lazyLoadImage** tracking. It works with `MutationObserver`, so it tracks when new elements will be created or some elements will be removed.

**You don't need start tracking more than one time after script import.**

1. Download and import [lazyLoadImage](./lazyLoadImage.js) to page with: `<script type="text/javascript" src="lazyLoadImage.js"></script>`.
2. Then start **lazyLoadImage** tracking with executing: `lazyLoadImage.start()`.
3. To make element visible for **lazyLoadImage**, add `data-src` attribute to element instead of `src` or `background-image`.
4. To use all features, check [options](#options) below.

### Options

To control way for loading items you should set some attributes.


#### `data-src`
* Default attribute for indicating to track and handle element with **lazyLoadImage**, all items with only this attribute will start loading after `DOMContentLoaded` event. 
* By default this attribute will start load item like `<img>` tag with `src` attribute, to change it → check `data-css` attribute below.

#### `data-viewport`
* Attribute that will start load element when its boundary box (according to Y axis) will be in the user viewport.
* If you want to use **parent** element boundary box → to check if is in viewport, then set `data-viewport` attribute to **value: `parent`**.

#### `data-offset`
* Attribute that add offset for element boundary box (when `data-viewport` is used). 
* You should use it if wanna make element loading start before will be in viewport. 

* To make element loading start when element will be in a viewport after 400px of page scroll, set **value: `-400`**.

#### `data-css`
* Attribute that changes method of loading to → `background-image` for `css`.

### Example

You can check source of example using all features of **lazyLoadImage** in `example` directory → [example page](example/index.html).