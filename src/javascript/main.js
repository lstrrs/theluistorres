define([
    'image'
], function(
    Image
) {
    'use strict';

    var imageElems = document.querySelectorAll('.js-img-preload');
    Image.loadProgressiveImages_v3(imageElems);
});