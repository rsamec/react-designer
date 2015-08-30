import DataTemplates from '../utilities/DataTemplateExamples.js';
import Widgets from '../components/WidgetFactory';
import _ from 'lodash';

var sharedShapeMetaData = {
    defaultColors: {
        fill: '#2409ba',
        stroke: '#E65243',
        strokeWidth: 20
    }
}

export default {
    ObjectSchema: {
        metaData: {
            props: {
                title: "",
                defaultData:{},
                dataTemplate:{},
                context:{
                    intlData: {},
                    styles:_.mapValues(Widgets,function(value,key,object){
                        var widget =object[key];
                        return widget && widget.metaData && widget.metaData.props || {}}
                    )

                },


            },
            settings: {
                fields: {
                    defaultData: {type: 'plainJsonEditor'},
                    defaultProps: {type: 'jsonEditor'},
                    dataTemplate:{type: 'dataTemplateEditor', settings:{templates:DataTemplates}},
                    context: {
                        fields: {intlData: {type: 'jsonEditor'}}
                    },
                    styles:{type:'jsonEditor'}
                }
            }
        }
    },
    Container:{
        metaData: {
            props: {
                visibility:{},
                startOnNewPage: false,
                unbreakable: false
            },
            settings: {
                fields: {
                    visibility: {type: 'bindingEditor'}
                }
            }
        }
    },
    Repeater:{
        metaData: {
            props: {
                binding: {},
                startOnNewPage: false,
                unbreakable: false
            },
            settings: {
                fields: {
                    binding: {type: 'bindingEditor'}
                }
            }
        }
    }
}
