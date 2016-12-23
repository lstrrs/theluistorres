define([
    'util'
], function(
    Utils
) {
    'use strict';

    var Image = {
        loadProgressiveImages_v3: function(imageElems) {
            var length = imageElems.length;

            for (var i = 0; i < length; i++) {
                Utils.addEvent(imageElems[i], 'load', function handler() {
                    if (this.dataset.loaded === 'small') {
                        this.className += ' loaded';
                        this.dataset.loaded = 'medium';

                        this.src = this.dataset.large;
                    } else if (this.dataset.loaded === 'medium') {
                        this.dataset.loaded = 'large';
                        Utils.removeEvent(this, 'load', handler);
                    }
                });

                imageElems[i].src = imageElems[i].dataset.medium;
            }
        }
    };

    return Image;
});