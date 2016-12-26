define('main', [
    'image'
], function(
    Image
) {
    'use strict';

    return {
        loadImages: function() {
            var imageElems = document.querySelectorAll('.js-img-preload');
            Image.loadProgressiveImages_v3(imageElems);
        }
    };
});