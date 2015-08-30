import CustomerOrders from '../dataTemplates/customerOrders.js';

var leafTemplate = {
    min: 1,
    max: 5,
    template: {
        name: {
            pattern: 'lastName'
        }
    }
};

export default {
    CustomerOrders:CustomerOrders,
    StockNumbers: {
        data: {
            min: 20,
            max: 80,
            template: {
                title: {
                    pattern: 'brState'
                },
                a: {
                    min: 10000,
                    max: 100000,
                    places: 0
                },
                b: {
                    min: 50000,
                    max: 200000,
                    places: 0
                },
                c: {
                    min: 100000,
                    max: 300000,
                    places: 0
                }
            }
        }
    },
    StateTree: {
        name: {
            format: 'Root'
        },
        children: {
            min: 3,
            max: 6,
            template: {
                name: {pattern: 'brState'},
                children: leafTemplate
            }
        }
    }
}
