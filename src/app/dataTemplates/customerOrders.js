import _ from 'lodash';

export default {
    name: {
        pattern: 'companyName'
    },
    address1: {
        pattern: 'streetAddress'
    },
    city: {
        pattern: 'city'
    },
    state: {
        pattern: 'us_state_abbr'
    },
    zip: {
        pattern: 'zipCode'
    },
    employees: {
        min: 12,
        max: 150
    },
    orders: {
        min: 1,
        max: 2,
        template: {
            orderNbr: {
                format: '#######'
            },
            orderDate: {
                maxAge: 8,
                minAge: 4
            },
            products: {
                min: 1,
                max: 10,
                template: {
                    itemNbr: {
                        format: 'I-#####'
                    },
                    description: {
                        pattern: 'sentence'
                    },
                    unitPrice: {
                        min: 2.50,
                        max: 15,
                        decimal: 2
                    },
                    quantity: {
                        min: 1,
                        max: 100
                    },
                    extendedPrice: function() {
                        return Math.round((this.unitPrice * this.quantity) * 100) / 100;
                    }
                }
            },
            orderTotal: function() {
                var total;

                return total = _.reduce(this.products, function(memo, line) {
                    return memo + line.extendedPrice;
                }, 0);
            }
        }
    }
};
