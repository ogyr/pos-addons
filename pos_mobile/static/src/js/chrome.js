odoo.define('pos_mobile.chrome', function (require) {
    "use strict";
    if (!odoo.is_mobile) {
        return;
    }

    var screens = require('pos_mobile.screens');
    var chrome = require('point_of_sale.chrome');

    chrome.Chrome.include({
        // This method instantiates all the screens, widgets, etc.
        build_widgets: function() {
            this._super();

            $('.pos').addClass('mobile');

            // horizontal swiper
            this.swiperH = new window.Swiper('.swiper-container-h', {
                spaceBetween: 0,
            });

            // vertical swiper
            this.swiperV = new window.Swiper('.swiper-container-v', {
                direction: 'vertical',
                slidesPerView: 'auto',
                spaceBetween: 0,
            });

            // remove all events for vertical swiper
            this.swiperV.destroy(false , false);

            // move some widgets and screens from screen block to slide blocks
            var products = $('.rightpane .content-row');
            products.detach();
            $(".slide-products").append(products);

            var order = $('.leftpane .order-container');
            order.detach();
            $('.slide-order').append(order);

            var summary = $('.pos.mobile .order-container .summary.clearfix');
            summary.detach();
            $('.pos.mobile .order-container').append(summary);

            var pads = $('.leftpane .pads');
            pads.detach();
            $('.slide-numpad').append(pads);

            var breadcrumbs = $('.breadcrumbs');
            breadcrumbs.detach();
            $('.slide-categories').prepend(breadcrumbs);

            var search = $('.rightpane-header');
            search.detach();
            $('.slide-search').append(search);

            var buttons = $('.control-buttons');
            if (!buttons.hasClass('oe_hidden')) {
                this.swiperH[1].appendSlide('<div class="swiper-slide slide-buttons"></div>');
                buttons.detach();
                $('.slide-buttons').append(buttons);
            }
        },
    });

    chrome.OrderSelectorWidget.include({
        order_click_handler: function(event,$el) {
            this._super(event,$el);
            var order = this.get_order_by_uid($el.data('uid'));
            if (order) {
                this.chrome.swiperH[0].slideTo(0, 0);
            }
        },
        neworder_click_handler: function(event, $el) {
            this._super(event,$el);
            this.chrome.swiperH[0].slideTo(0, 0);
        },
        deleteorder_click_handler: function(event, $el) {
            this._super(event,$el);
            this.chrome.swiperH[0].slideTo(0, 0);
        },
    });

    chrome.HeaderButtonWidget.include({
        renderElement: function(){
            var self = this;
            this._super();
            if(this.action){
                this.$el.click(function(){
                    self.change_action();
                });
            }
        },
        change_action: function() {
            var cancel_button = '<img src="/pos_mobile/static/src/img/svg/close.svg"/>';
            var confirm_cancel_button = '<img src="/pos_mobile/static/src/img/svg/confirm.svg"/>';
            var self = this;
            if (!this.confirmed_change) {
                this.$el.text('');
                this.$el.append(confirm_cancel_button);
                this.confirmed_change = setTimeout(function(){
                    self.$el.text('');
                    self.$el.append(cancel_button);
                    self.confirmed_change = false;
                },2000);
            }
        },
    });

    return chrome;
});
