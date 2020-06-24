(function () {
    var msEdgeMatch = /Edge\/([0-9]+)/i.exec(navigator.userAgent);
    if (msEdgeMatch) document.documentMode = parseInt(msEdgeMatch[1]);
})();
(function () {

    var touchesInAction = {};
    var useMiddleAsDk;

    /**
     * Add event listener in DOMElement
     *
     * @param {HTMLElement} obj HTMLElement which should be listen
     * @param {String} type Type of the event to listen
     * @param {Function} fn Callback function
     */
    function addEvent (obj, type, fn) {
        if (typeof obj.addEventListener === 'function') {
            obj.addEventListener(type, fn, true);
        } else if (obj.attachEvent) {
            obj['e' + type + fn] = fn;
            obj[type + fn] = function () {
                obj['e' + type + fn].call(obj, window.event);
            }
            obj.attachEvent('on' + type, obj[type + fn]);
        }
    }

    /**
     * Remove event listener in DOMElement
     *
     * @param {HTMLElement} obj HTMLElement which should be listen
     * @param {String} type Type of the event to listen
     * @param {Function} fn Callback function
     */
    function removeEvent (obj, type, fn) {
        if (typeof obj.removeEventListener === 'function') {
            obj.removeEventListener(type, fn, true);
        } else if (obj.detachEvent) {
            obj['e' + type + fn] = fn;
            obj[type + fn] = function () {
                obj['e' + type + fn].call(obj, window.event);
            }
            obj.detachEvent('on' + type, obj[type + fn]);
        }
    }

    /**
     * Add class in DOMElement
     *
     * @param {HTMLElement} obj HTMLElement where the class should be added
     * @param {String} clsName Name of the class to add
     */
    function addClass (obj, clsName) {
        if (obj.classList) {
            obj.classList.add(clsName);
        } else {
            obj.className += ' ' + clsName;
        }
    }

    /**
     * Remove class in DOMElement
     *
     * @param {HTMLElement} obj HTMLElement where the class should be removed
     * @param {String} clsName Name of the class to remove
     */
    function removeClass (obj, clsName) {
        if (obj.classList) {
            obj.classList.remove(clsName);
        } else {
            obj.className = obj.className.replace(new RegExp('(^|\\b)' + clsName.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
    }

    /**
     * Calculate the offsetTop
     *
     * @param {HTMLElements} elem HTMLElement
     */
    function calcOffsetTop (elem) {
        if (!elem) elem = this;
        var y = elem.offsetTop;
        while (elem = elem.offsetParent) {
            y += elem.offsetTop;
        }
        return y;
    }

    /**
     * Make the header always visible and fixed when scrolling
     *
     * @param {HTMLElements} el HTMLElement which should be always visible - the header
     * @param {Object} options Options of the ResponsiveTable
     */
    function headerFix (el, opt) {
        if (!opt.headerFixed || opt.headerFixed !== 1 || !Array.prototype.forEach) return;

        var offsetHeight = document.getElementById('adc_' + opt.instanceId).offsetHeight || document.getElementById('adc_' + opt.instanceId).height;
        var offsetHeightThead = document.getElementById('adc_' + opt.instanceId + '_thead-left').offsetHeight || document.getElementById('adc_' + opt.instanceId + '_thead-left').height;
        var offsetTop = calcOffsetTop(document.getElementById('adc_' + opt.instanceId));
        var scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
        var top = 0;
        if ((scrollTop >= offsetTop) && (scrollTop <= (offsetTop + offsetHeight - (offsetHeightThead + 10)))) {
            top = scrollTop - (offsetTop + 2);
        } else {
            top = 0;
        }
        var translate = 'translateY(' + top + 'px)';
        //if ((/MSIE 10/i.test(navigator.userAgent)) || (/MSIE 9/i.test(navigator.userAgent) || /rv:11.0/i.test(navigator.userAgent)) || (/Edge\/\d./i.test(navigator.userAgent))) {
        for (var i = 0; j = el.length, i < j; i++) {
            if (document.documentMode < 12) {
                el[i].style.msTransform = translate;
            } else {
                el[i].style.WebkitTransform = translate;
                el[i].style.WebkitTransition = 'all 0.2s';
                el[i].style.MozTransform = translate;
                el[i].style.MozTransition = 'all 0.2s';
                el[i].style.transform = translate;
                el[i].style.transition = 'all 0.2s';
            }
        }
        //}
        //document.getElementById('adc_' + opt.instanceId + '_thead').style.WebkitTransform = translate;
        //document.getElementById('adc_' + opt.instanceId + '_thead').style.WebkitTransition = 'all 0.2s'; // Code for Safari 3.1 to 6.0
        //document.getElementById('adc_' + opt.instanceId + '_thead').style.MozTransform = translate;
        //document.getElementById('adc_' + opt.instanceId + '_thead').style.MozTransition = 'all 0.2s'; // Code for Mozilla
        //document.getElementById('adc_' + opt.instanceId + '_thead').style.transform = translate;
        //document.getElementById('adc_' + opt.instanceId + '_thead').style.transition = 'all 0.2s';
    }


    /**
     * Manage the zoom of the pictures
     *
     * @param {String} strId Id of the zoom
     */
    function simplboxConstructorCall (strId) {
        var preLoadIconOn = function () {
                var newE = document.createElement('div');
                var newB = document.createElement('div');
                newE.setAttribute('id', 'simplbox-loading');
                newE.appendChild(newB);
                document.body.appendChild(newE);
            },
            preLoadIconOff = function () {
                var elE = document.getElementById('simplbox-loading');
                elE.parentNode.removeChild(elE);
            },
            overlayOn = function () {
                var newA = document.createElement('div');
                newA.setAttribute('id', 'simplbox-overlay');
                document.body.appendChild(newA);
            },
            overlayOff = function () {
                var elA = document.getElementById('simplbox-overlay');
                elA.parentNode.removeChild(elA);
            };
        var img = new SimplBox(document.querySelectorAll('[data-simplbox=\'' + strId + '\']'), {
            quitOnImageClick: true,
            quitOnDocumentClick: false,
            onStart: overlayOn,
            onEnd: overlayOff,
            onImageLoadStart: preLoadIconOn,
            onImageLoadEnd: preLoadIconOff
        });
        img.init();
    }

    /**
     * Apply material effect when swipe
     *
     * @param {Object} el imgContainer of the item
     */
    function materialEffect (el) {
        var circle, sizew, sizeh, x, y;

        circle = document.createElement('div');
        circle.setAttribute('class', 'circle');
        el.appendChild(circle);

        x = (el.offsetLeft - circle.offsetWidth / 2) - (el.offsetWidth / 2);
        y = (el.offsetTop - circle.offsetHeight / 2);

        sizew = el.offsetWidth;
        sizeh = el.offsetHeight;

        circle.style.top = y + 'px';
        circle.style.left = x + 'px';
        circle.style.width = sizew + 'px';
        circle.style.height = sizeh + 'px';
        circle.classList.add("animate");

        return setTimeout(function () {
            return circle.parentNode.removeChild(circle);
        }, 300);
    }

    /**
     * Move the item to the left or right
     *
     * @param {Object} rowContainer Container of the item to move
     * @param {String} dir direction to move the item (left or right)
     */
    function moveSwipe (rowContainer, dir, options) {

        if (useMiddleAsDk) {
          var leftElement = rowContainer.children[0];
          var midElement = rowContainer.children[1];
          var rightElement = rowContainer.children[2];
          var imgContainer = rowContainer.children[3];
        } else {
          var leftElement = rowContainer.children[0];
          var rightElement = rowContainer.children[1];
          var imgContainer = rowContainer.children[2];
        }

        imgContainer.style.msTransitionDuration = '0.2s';
        imgContainer.style.WebkitTransitionDuration = '0.2s';
        imgContainer.style.MozTransitionDuration = '0.2s';
        imgContainer.style.transitionDuration = '0.2s';

        removeClass(imgContainer, 'swipe-center');
        removeClass(imgContainer, 'swipe-left');
        removeClass(imgContainer, 'swipe-right');

        if (dir === 'right') {
            var toRight = (rightElement.offsetLeft + rightElement.offsetWidth) - (imgContainer.offsetLeft + imgContainer.offsetWidth);

            imgContainer.style.msTransform = 'translate(' + parseInt(toRight) + 'px,0)';
            imgContainer.style.WebkitTransform = 'translate(' + parseInt(toRight) + 'px,0)';
            imgContainer.style.MozTransform = 'translate(' + parseInt(toRight) + 'px,0)';
            imgContainer.style.transform = 'translate(' + parseInt(toRight) + 'px,0)';
            addClass(imgContainer, 'swipe-right');
            setTimeout(function () {
                materialEffect(imgContainer);
            }, 200);
        } else if (dir === 'left') {
            var toLeft = (leftElement.offsetLeft - imgContainer.offsetLeft);

            imgContainer.style.msTransform = 'translate(' + parseInt(toLeft) + 'px,0)';
            imgContainer.style.WebkitTransform = 'translate(' + parseInt(toLeft) + 'px,0)';
            imgContainer.style.MozTransform = 'translate(' + parseInt(toLeft) + 'px,0)';
            imgContainer.style.transform = 'translate(' + parseInt(toLeft) + 'px,0)';
            addClass(imgContainer, 'swipe-left');
            setTimeout(function () {
                materialEffect(imgContainer);
            }, 200);
        } else if (dir === 'middle') {
            var toMiddle = (midElement.offsetLeft - imgContainer.offsetLeft);

            imgContainer.style.msTransform = 'translate(' + parseInt(toMiddle) + 'px,0)';
            imgContainer.style.WebkitTransform = 'translate(' + parseInt(toMiddle) + 'px,0)';
            imgContainer.style.MozTransform = 'translate(' + parseInt(toMiddle) + 'px,0)';
            imgContainer.style.transform = 'translate(' + parseInt(toMiddle) + 'px,0)';
            addClass(imgContainer, 'swipe-center');
            setTimeout(function () {
                materialEffect(imgContainer);
            }, 200);
        }
    }

    /**
     * Move the item to the left
     *
     * @param {Object} rowContainer Container of the item to move
     */
    function changeDisplay (that, options) {
        var leftItems = document.getElementById('adc_' + that.instanceId).querySelectorAll('.swipe-left');
        var rightItems = document.getElementById('adc_' + that.instanceId).querySelectorAll('.swipe-right');
        var middleItems = document.getElementById('adc_' + that.instanceId).querySelectorAll('.swipe-center');
        var imgContainer;

        for (var il = 0, jl = leftItems.length; il < jl; il++) {
            var leftElement;
            if (useMiddleAsDk) {
              imgContainer = leftItems[il].parentElement.children[3];
              leftElement = leftItems[il].parentElement.children[0];
            } else {
              imgContainer = leftItems[il].parentElement.children[2];
              leftElement = leftItems[il].parentElement.children[0];
            }

            imgContainer.style.msTransitionDuration = '0.2s';
            imgContainer.style.WebkitTransitionDuration = '0.2s';
            imgContainer.style.MozTransitionDuration = '0.2s';
            imgContainer.style.transitionDuration = '0.2s';

            var toLeft = (leftElement.offsetLeft - imgContainer.offsetLeft);
            imgContainer.style.msTransform = 'translate(' + parseInt(toLeft) + 'px,0)';
            imgContainer.style.WebkitTransform = 'translate(' + parseInt(toLeft) + 'px,0)';
            imgContainer.style.MozTransform = 'translate(' + parseInt(toLeft) + 'px,0)';
            imgContainer.style.transform = 'translate(' + parseInt(toLeft) + 'px,0)';
        }
        for (var ir = 0, jr = rightItems.length; ir < jr; ir++) {
            var rightElement;
            if (useMiddleAsDk) {
              imgContainer = rightItems[ir].parentElement.children[3];
              rightElement = rightItems[ir].parentElement.children[2];
            } else {
              imgContainer = rightItems[ir].parentElement.children[2];
              rightElement = rightItems[ir].parentElement.children[1];
            }

            imgContainer.style.msTransitionDuration = '0.2s';
            imgContainer.style.WebkitTransitionDuration = '0.2s';
            imgContainer.style.MozTransitionDuration = '0.2s';
            imgContainer.style.transitionDuration = '0.2s';

            var toRight = (rightElement.offsetLeft + rightElement.offsetWidth) - (imgContainer.offsetLeft + imgContainer.offsetWidth);
            imgContainer.style.msTransform = 'translate(' + parseInt(toRight) + 'px,0)';
            imgContainer.style.WebkitTransform = 'translate(' + parseInt(toRight) + 'px,0)';
            imgContainer.style.MozTransform = 'translate(' + parseInt(toRight) + 'px,0)';
            imgContainer.style.transform = 'translate(' + parseInt(toRight) + 'px,0)';
        }

        if (useMiddleAsDk) {        
          for (var im = 0, jm = middleItems.length; im < jm; im++) {
              var midElement;
                imgContainer = middleItems[im].parentElement.children[3];
                midElement = middleItems[im].parentElement.children[1];

              imgContainer.style.msTransitionDuration = '0.2s';
              imgContainer.style.WebkitTransitionDuration = '0.2s';
              imgContainer.style.MozTransitionDuration = '0.2s';
              imgContainer.style.transitionDuration = '0.2s';

              var toMiddle = 0;
              imgContainer.style.msTransform = 'translate(' + parseInt(toMiddle) + 'px,0)';
              imgContainer.style.WebkitTransform = 'translate(' + parseInt(toMiddle) + 'px,0)';
              imgContainer.style.MozTransform = 'translate(' + parseInt(toMiddle) + 'px,0)';
              imgContainer.style.transform = 'translate(' + parseInt(toMiddle) + 'px,0)';
          }
        }

    }

    /**
     * Manage the click on the Label
     *
     * @param {Object} event Event of the click on the Label
     */
    function clickLabel (event, that) {
        var el = event.target || event.srcElement;

        if (el.nodeName === 'INPUT') {
            el = el.parentElement;
        }

        if (el.nodeName === 'LABEL' && el.className.indexOf('swipe-col-right') >= 0) {
            moveSwipe(el.parentElement, 'right', that);
        } else if (el.nodeName === 'LABEL' && el.className.indexOf('swipe-col-left') >= 0) {
            moveSwipe(el.parentElement, 'left', that);
        } else if (el.nodeName === 'LABEL' && el.className.indexOf('swipe-col-middle') >= 0) {
            moveSwipe(el.parentElement, 'middle', that);
        }
        if (window.askia &&
            window.arrLiveRoutingShortcut &&
            window.arrLiveRoutingShortcut.length > 0 &&
            window.arrLiveRoutingShortcut.indexOf(that.currentQuestion) >= 0) {
            askia.triggerAnswer();
        }
    }

    /**
     *
     */
    function touchStartHandler (event) {
        event.preventDefault;
        touchesInAction = {};
        var touches = event.changedTouches;
        var currentItem = event.currentTarget;

        if (touches.length > 1) return;

        /* store touch info on touchstart */
        touchesInAction[touches[0].identifier] = {

            identifier: touches[0].identifier,
            pageX: touches[0].pageX,
            pageY: touches[0].pageY,
            translateCurrentValue: currentItem.style.cssText.substring(currentItem.style.cssText.indexOf('(') + 1, currentItem.style.cssText.indexOf('px')) || 0
        };
    }

    /**
     *
     */
    function touchMoveHandler (event) {
        var touches = event.changedTouches;
        var distance = 0;
        var currentItem = event.currentTarget;
        var maxLeftDistance = parseFloat(currentItem.parentElement.children[0].offsetLeft) - parseFloat(currentItem.offsetLeft);
        var maxRightDistance = -maxLeftDistance;


        if (touches.length > 1) return;

        /* access stored touch info on touchend */
        var theTouchInfo = touchesInAction[touches[0].identifier];
        theTouchInfo.dx = touches[0].pageX - theTouchInfo.pageX; /* x-distance moved since touchstart */
        theTouchInfo.dy = touches[0].pageY - theTouchInfo.pageY; /* y-distance moved since touchstart */
        distance = parseFloat(theTouchInfo.dx) + parseFloat(theTouchInfo.translateCurrentValue);

        if (distance < 0 && distance < maxLeftDistance) {
            distance = maxLeftDistance;
        }

        if (distance > 0 && distance > maxRightDistance) {
            distance = maxRightDistance;
        }

        currentItem.style.msTransitionDuration = '0s';
        currentItem.style.WebkitTransitionDuration = '0s';
        currentItem.style.MozTransitionDuration = '0s';
        currentItem.style.transitionDuration = '0s';

        currentItem.style.msTransform = 'translate(' + parseInt(distance) + 'px,0)';
        currentItem.style.WebkitTransform = 'translate(' + parseInt(distance) + 'px,0)';
        currentItem.style.MozTransform = 'translate(' + parseInt(distance) + 'px,0)';
        currentItem.style.transform = 'translate(' + parseInt(distance) + 'px,0)';
    }

    /**
     *
     */
    function touchEndHandler (event) {
        var touches = event.changedTouches;
        var currentItem = event.currentTarget;
        if (touches.length > 1) return;
        var distance = 0;
        var minDistance = 30;
        var maxLeftDistance = parseFloat(currentItem.parentElement.children[0].offsetLeft) - parseFloat(currentItem.offsetLeft);
        var maxRightDistance;

        if (useMiddleAsDk) {
          maxRightDistance = (parseFloat(currentItem.parentElement.children[2].offsetLeft) + parseFloat(currentItem.parentElement.children[2].offsetWidth)) - (parseFloat(currentItem.offsetLeft) + parseFloat(currentItem.offsetWidth));
        } else {
          maxRightDistance = (parseFloat(currentItem.parentElement.children[1].offsetLeft) + parseFloat(currentItem.parentElement.children[1].offsetWidth)) - (parseFloat(currentItem.offsetLeft) + parseFloat(currentItem.offsetWidth));
        }

        /* access stored touch info on touchend */
        var theTouchInfo = touchesInAction[touches[0].identifier];
        theTouchInfo.dx = touches[0].pageX - theTouchInfo.pageX; /* x-distance moved since touchstart */
        theTouchInfo.dy = touches[0].pageY - theTouchInfo.pageY; /* y-distance moved since touchstart */
        distance = parseFloat(theTouchInfo.dx);

        if (distance >= -minDistance && distance <= minDistance) {
            distance = theTouchInfo.translateCurrentValue;
        }

        if (distance < -minDistance ) {
            distance = maxLeftDistance;
            removeClass(currentItem, 'swipe-center');
            removeClass(currentItem, 'swipe-left');
            removeClass(currentItem, 'swipe-right');
            addClass(currentItem, 'swipe-left');
            currentItem.parentElement.children[0].click();
        }

        if (distance > minDistance) {
            distance = maxRightDistance;
            removeClass(currentItem, 'swipe-center');
            removeClass(currentItem, 'swipe-left');
            removeClass(currentItem, 'swipe-right');
            addClass(currentItem, 'swipe-right');
            if (useMiddleAsDk) {
              currentItem.parentElement.children[2].click();
            } else {
              currentItem.parentElement.children[1].click();
            }
        }

        if (useMiddleAsDk & distance == 0) {
              removeClass(currentItem, 'swipe-center');
              removeClass(currentItem, 'swipe-left');
              removeClass(currentItem, 'swipe-right');
              addClass(currentItem, 'swipe-center');
              currentItem.parentElement.children[1].click();
        }


        currentItem.style.msTransitionDuration = '0.2s';
        currentItem.style.WebkitTransitionDuration = '0.2s';
        currentItem.style.MozTransitionDuration = '0.2s';
        currentItem.style.transitionDuration = '0.2s';

        currentItem.style.msTransform = 'translate(' + parseInt(distance) + 'px,0)';
        currentItem.style.WebkitTransform = 'translate(' + parseInt(distance) + 'px,0)';
        currentItem.style.MozTransform = 'translate(' + parseInt(distance) + 'px,0)';
        currentItem.style.transform = 'translate(' + parseInt(distance) + 'px,0)';

    }

    /**
     *
     */
    function mouseStartHandler (event) {
        event.preventDefault;
        touchesInAction = {};
        var touches = event;
        var currentItem = event.currentTarget;

        addEvent(currentItem, 'mousemove', mouseMoveHandler);
        addEvent(currentItem, 'mouseup', mouseEndHandler);
        addEvent(currentItem, 'mouseleave', mouseEndHandler);

        /* store touch info on touchstart */
        touchesInAction[0] = {

            identifier: 0,
            pageX: touches.pageX,
            pageY: touches.pageY,
            translateCurrentValue: currentItem.style.cssText.substring(currentItem.style.cssText.indexOf('(') + 1, currentItem.style.cssText.indexOf('px')) || 0
        };
    }

    /**
     *
     */
    function mouseMoveHandler (event) {
        var touches = event;
        var distance = 0;
        var currentItem = event.currentTarget;
        var maxLeftDistance = parseFloat(currentItem.parentElement.children[0].offsetLeft) - parseFloat(currentItem.offsetLeft);
        var maxRightDistance = -maxLeftDistance;

        var theTouchInfo = touchesInAction[0];
        theTouchInfo.dx = touches.pageX - theTouchInfo.pageX; /* x-distance moved since move start */
        theTouchInfo.dy = touches.pageY - theTouchInfo.pageY; /* y-distance moved since move start */
        distance = parseFloat(theTouchInfo.dx) + parseFloat(theTouchInfo.translateCurrentValue);

        if (distance < 0 && distance < maxLeftDistance) {
            distance = maxLeftDistance;
        }

        if (distance == 0) {
          distance = 0;
        }

        if (distance > 0 && distance > maxRightDistance) {
            distance = maxRightDistance;
        }

        currentItem.style.msTransitionDuration = '0s';
        currentItem.style.WebkitTransitionDuration = '0s';
        currentItem.style.MozTransitionDuration = '0s';
        currentItem.style.transitionDuration = '0s';

        currentItem.style.msTransform = 'translate(' + parseInt(distance) + 'px,0)';
        currentItem.style.WebkitTransform = 'translate(' + parseInt(distance) + 'px,0)';
        currentItem.style.MozTransform = 'translate(' + parseInt(distance) + 'px,0)';
        currentItem.style.transform = 'translate(' + parseInt(distance) + 'px,0)';
    }

    /**
     *
     */
    function mouseEndHandler (event) {
        var touches = event;
        var currentItem = event.currentTarget;
        removeEvent(currentItem, 'mousemove', mouseMoveHandler);
        removeEvent(currentItem, 'mouseup', mouseEndHandler);
        removeEvent(currentItem, 'mouseleave', mouseEndHandler);

        var distance = 0;
        var minDistance = 30;

        var maxLeftDistance = parseFloat(currentItem.parentElement.children[0].offsetLeft) - parseFloat(currentItem.offsetLeft);
        var maxRightDistance;

        if (useMiddleAsDk) {
          maxRightDistance = (parseFloat(currentItem.parentElement.children[2].offsetLeft) + parseFloat(currentItem.parentElement.children[2].offsetWidth)) - (parseFloat(currentItem.offsetLeft) + parseFloat(currentItem.offsetWidth));
        } else {
          maxRightDistance = (parseFloat(currentItem.parentElement.children[1].offsetLeft) + parseFloat(currentItem.parentElement.children[1].offsetWidth)) - (parseFloat(currentItem.offsetLeft) + parseFloat(currentItem.offsetWidth));
        }


        var theTouchInfo = touchesInAction[0];
        theTouchInfo.dx = touches.pageX - theTouchInfo.pageX; /* x-distance moved since move start */
        theTouchInfo.dy = touches.pageY - theTouchInfo.pageY; /* y-distance moved since move start */
        distance = parseFloat(theTouchInfo.dx);


        if (distance >= -minDistance && distance <= minDistance) {
            distance = theTouchInfo.translateCurrentValue;
        }

        if (distance < -minDistance) {
            distance = maxLeftDistance;
            removeClass(currentItem, 'swipe-center');
            removeClass(currentItem, 'swipe-left');
            removeClass(currentItem, 'swipe-right');
            addClass(currentItem, 'swipe-left');
            currentItem.parentElement.children[0].click();
        }

        if (distance > minDistance) {
            distance = maxRightDistance;
            removeClass(currentItem, 'swipe-center');
            removeClass(currentItem, 'swipe-left');
            removeClass(currentItem, 'swipe-right');
            addClass(currentItem, 'swipe-right');
            if (useMiddleAsDk) {
              currentItem.parentElement.children[2].click();
            } else {
              currentItem.parentElement.children[1].click();
            }
        }

        if (useMiddleAsDk & distance == 0) {
              removeClass(currentItem, 'swipe-center');
              removeClass(currentItem, 'swipe-left');
              removeClass(currentItem, 'swipe-right');
              addClass(currentItem, 'swipe-center');
              currentItem.parentElement.children[1].click();
        }


        currentItem.style.msTransitionDuration = '0.2s';
        currentItem.style.WebkitTransitionDuration = '0.2s';
        currentItem.style.MozTransitionDuration = '0.2s';
        currentItem.style.transitionDuration = '0.2s';

        currentItem.style.msTransform = 'translate(' + parseInt(distance) + 'px,0)';
        currentItem.style.WebkitTransform = 'translate(' + parseInt(distance) + 'px,0)';
        currentItem.style.MozTransform = 'translate(' + parseInt(distance) + 'px,0)';
        currentItem.style.transform = 'translate(' + parseInt(distance) + 'px,0)';

    }

    /**
     * Creates a new instance of the Swipe
     *
     * @param {Object} options Options of the Swipe
     * @param {String} options.instanceId=1 Id of the ADC instance
     */
    function Swipe (options) {
        this.options = options;
        this.instanceId = options.instanceId || 1;
        this.headerFixed = options.headerFixed || 0;
        this.currentQuestion = options.currentQuestion || '';
        this.middleAsDk = options.middleAsDk || 0;
        this.isAllowDK = options.isAllowDK;

        let isAllowDK = this.isAllowDK;

        useMiddleAsDk = this.middleAsDk;
        if (!isAllowDK) {
          useMiddleAsDk = 0;
        }

        addEvent(document.getElementById('adc_' + this.instanceId), 'change',
            (function (passedInElement) {
                return function (e) {
                    clickLabel(e, passedInElement);
                };
            }(this)));

        addEvent(window, 'resize',
            (function (passedInElement) {
                return function () {
                    changeDisplay(passedInElement, options);
                };
            }(this)));

        if (!document.querySelectorAll) return;

        var elements = document.querySelectorAll('#adc_' + options.instanceId + ' .swipe-value-block h2');
        addEvent(window, 'scroll', function () {
            headerFix(elements, options);
        });

        var zooms = document.getElementById('adc_' + options.instanceId).querySelectorAll('.swipe-image');
        for (var i = 0, j = zooms.length; i < j; i++) {
            simplboxConstructorCall(zooms[i].getAttribute('data-id'));
            zooms[i].addEventListener('touchstart', touchStartHandler, false);
            zooms[i].addEventListener('touchmove', touchMoveHandler, false);
            zooms[i].addEventListener('touchend', touchEndHandler, false);
            addEvent(zooms[i], 'mousedown', mouseStartHandler);
        }

        changeDisplay(this, options);

    }

    /**
     * Attach the Swipe to the window object
     */
    window.Swipe = Swipe;

}());
