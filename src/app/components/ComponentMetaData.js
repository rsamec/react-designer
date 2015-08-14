export default {
    ObjectSchema: {
        metaData: {
            props: {
                title: "",
                dataSource: {
                    type: '',
                    template: {}
                },
                businessRules: {},
                input: false,
                intlData: {},
                defaultData:{}
            },
            settings: {
                fields: {
                    defaultData: {type: 'plainJsonEditor'},
                    businessRules: {type: 'jsonEditor'},
                    intlData: {type: 'jsonEditor'},
                    dataSource: {
                        fields: {
                            type: {type: 'select', settings: {options: ['template', 'raw']}},
                            template: {type: 'dataTemplateEditor'}
                        }
                    }
                }
            }
        }
    },
    Container:{
        metaData: {
            props: {
                Visibility: {
                    Path: '',
                    Mode: 'OneWay'
                },
                startOnNewPage: false,
                unbreakable: false
            },
            settings: {
                fields: {
                    Visibility: {type: 'bindingEditor'}
                }
            }
        }
    },
    Repeater:{
        metaData: {
            props: {
                Binding: {
                    Path: '',
                    Mode: 'OneWay'
                },
                startOnNewPage: false,
                unbreakable: false
            },
            settings: {
                fields: {
                    Visibility: {type: 'bindingEditor'}
                }
            }
        }
    }
}
