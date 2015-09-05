import Examples from '../utilities/DataTemplateExamples.js';

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
                title: undefined,
                defaultData:undefined,
                context:{
                    styles:undefined
                },
                template:undefined
            },
            settings: {
                fields: {
                    defaultData: {type: 'plainJsonEditor'},
                    context: {
                        fields:{
                            intlData: {type: 'plainJsonEditor'},
                            styles:{type:'widgetStyleEditor'}
                        }
                    },
                    template: {
                        type: 'dataTemplateEditor',
                        settings: {templates: Examples}
                    }
                }
            }
        }
    },
    Container:{
        metaData: {
            props: {
                visibility:undefined,
                startOnNewPage: false,
                unbreakable: false
            },
            settings: {
                fields: {
                    visibility: {type: 'bindingEditor'},
                    startOnNewPage: {type: 'boolean'},
                    unbreakable: {type: 'boolean'}

                }
            }
        }
    },
    Repeater:{
        metaData: {
            props: {
                binding: undefined,
                startOnNewPage: false,
                unbreakable: false
            },
            settings: {
                fields: {
                    binding: {type: 'bindingEditor'},
                    startOnNewPage: {type: 'boolean'},
                    unbreakable: {type: 'boolean'}
                }
            }
        }
    }
}
