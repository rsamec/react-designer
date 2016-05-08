import _ from 'lodash';
import WidgetFactory from 'react-photo-widget-factory';
import * as md from 'react-icons/lib/md';

import BackgroundContainer from './widgets/BackgroundContainer';
import Grid from './widgets/GridWrapper';
import Cell from './widgets/CellWrapper';
import RichText from './widgets/RichTextEditor';


export default {
  'BackgroundContainer':BackgroundContainer,
  'Grid':Grid,
  'Cell':Cell,

  'Core.RichTextContent':RichText,


  'Core.TextContent':WidgetFactory.TextContent,
  'Core.HtmlContent': WidgetFactory.HtmlContent,
  'Core.JsxContent': WidgetFactory.JsxContent,
  'Core.ArticleContent': WidgetFactory.ArticleContent,
  'Core.ListItemContent': WidgetFactory.ListItemContent,

  'Core.ImageBox': WidgetFactory.ImageBox,
  'Core.SmartImageBox': WidgetFactory.SmartImageBox,
  'Core.ATvImageBox':WidgetFactory.ATvImageBox,

  'Core.BackgroundBox': WidgetFactory.BackgroundBox,
  'Core.HtmlBox': WidgetFactory.HtmlBox,
  'Core.HtmlImageBox': WidgetFactory.HtmlImageBox,

  'Core.ImageFlexBox':WidgetFactory.ImageFlexBox,

  'Core.TextBoxInput':WidgetFactory.TextBoxInput,
  'Core.Icon':WidgetFactory.Icon,
  'Core.IconMorph':WidgetFactory.IconMorph

};

_.extend(BackgroundContainer,{
  metaData: {
    settings: {
      fields: {
        visibility: {type: 'boolean'},
        startOnNewPage: {type: 'boolean'},
        unbreakable: {type: 'boolean'},
        width: {type: 'number'},
        height: {type: 'number'},
        background: {type:'bgEditor'}
      }
    }
  }
});
_.extend(Grid,{
  metaData: {
    settings: {
      fields: {
        visibility: {type: 'boolean'},
        align: {
          type: 'select',
          settings: {options: ['top', 'center', 'bottom']}
        },
        hAlign: {
          type: 'select',
          settings: {options: ['left', 'center', 'right']}
        },
        gutter: {type: 'string'},
        flexCells:{type:'boolean'},
        background: {type:'bgEditor'},
        padding: {type: 'boxSizeEditor'},
        border: {type: 'borderEditor'}
      }
    }
  }
});
_.extend(Cell,{
  metaData: {
    settings: {
      fields: {
        align: {
          type: 'select',
          settings: {options: ['top', 'center', 'bottom']}
        },
        hAlign: {
          type: 'select',
          settings: {options: ['left', 'center', 'right']}
        },
        gutter: {type: 'string'},
        flex:{type:'boolean'},
        size:{type:'string'},
        background: {type:'bgEditor'},
        padding: {type: 'boxSizeEditor'},
        border: {type: 'borderEditor'}
      }
    }
  }
});

_.extend(WidgetFactory.HtmlContent,{metaData:{
  settings: {
    fields: {
      content: {type: 'htmlEditor'},
      font:{type:'fontEditor'}
    }
  }
}});

_.extend(WidgetFactory.ArticleContent,{  metaData: {
  settings: {
    fields: {
      content: {type: 'htmlEditor'},
      font:{type:'fontEditor'},
      columnCount:{type:'number'}
    }
  }
}});

_.extend(WidgetFactory.ListItemContent,{  metaData: {
  settings: {
    fields: {
      content: {type: 'htmlEditor'},
      font:{type:'fontEditor'},
      counterReset:{type:'number'}
    }
  }
}});

_.extend(WidgetFactory.ImageBox,{metaData: {
  settings: {
    fields: {
      url:{type:'string'},
      border:{type:'borderEditor'},
      objectFit: {
        type: 'select',
        settings: {options: ['cover', 'fill', 'contain']}
      },
      clipPath:{type:'string'},
      width: {type: 'number'},
      height: {type: 'number'}
    }
  }
} });
_.extend(WidgetFactory.ATvImageBox,{metaData: {
  settings: {
    fields: {
      front:{type:'string'},
      back:{type:'string'},
      border:{type:'borderEditor'},
      objectFit: {
        type: 'select',
        settings: {options: ['cover', 'fill', 'contain']}
      },
      clipPath:{type:'string'}
    }
  }
} });

_.extend(WidgetFactory.BackgroundBox,{  metaData: {
  settings: {
    fields: {
      background:{type:'bgEditor'},
      border: {type: 'borderEditor'},
      clipPath:{type:'string'}
    }
  }
}});

_.extend(WidgetFactory.HtmlBox,{  metaData: {
  settings: {
    fields: {
      content:{type:'htmlEditor'},
      font: {type: 'fontEditor'},
      padding: {type: 'boxSizeEditor'},
      border: {type: 'borderEditor'},
      background: {type: 'bgEditor'},
      clipPath:{type:'string'}
    }
  }
}});

_.extend(WidgetFactory.HtmlImageBox,{metaData:{
  settings: {
    fields: {
      content:{type:'htmlEditor'},
      font: {type: 'fontEditor'},
      padding: {type: 'boxSizeEditor'},
      border: {type: 'borderEditor'},
      background: {type: 'bgEditor'},
      clipPath:{type:'string'},
      imageAlign: {
        type: 'select',
        settings: {options: ['topLeft', 'topRight', 'bottomLeft', 'bottomRight']}
      },
      image: {
        fields: {
          url:{type:'string'},
          margin: {type: 'boxSizeEditor'},
          border: {type: 'borderEditor'},
          width: {type: 'number'},
          height: {type: 'number'}
        }
      }
    }
  }
}});
_.extend(WidgetFactory.SmartImageBox,{metaData: {
  settings: {
    fields: {
      url:{type:'string'},
      border:{type:'borderEditor'},
      objectFit: {
        type: 'select',
        settings: {options: ['cover', 'fill', 'contain']}
      },
      clipPath:{type:'string'},
      caption:{type:'string'},
      description:{type:'htmlEditor'}
    }
  }
} });

_.extend(WidgetFactory.TextBoxInput,{metaData: {
  settings: {
    fields: {
      value: {type: 'string'},
      placeholder: {type: 'string'},
      label: {type: 'string'}
    }
  }
}} );

_.extend(WidgetFactory.ImageFlexBox,{metaData: {
  settings: {
    fields: {
      flexDirection: {
        type: 'select',
        settings: {options: ['row', 'column', 'row-reverse','column-reverse']}
      },
      alignContent: {
        type: 'select',
        settings: {options: ['stretch', 'flex-start', 'flex-end','center','space-between','space-around']}
      },
      images:{type:'plainJsonEditor'},
      image: {
        fields: {
          width:{type:'number'},
          height:{type:'number'},
          border: {type: 'borderEditor'},
          objectFit: {
            type: 'select',
            settings: {options: ['cover', 'fill', 'contain']}
          },
          clipPath: {type: 'string'}
        }
      }
    }
  }
} });


var iconKeys = _.rest(_.keys(md),1);

var sharedFields = {
  fill: {type: 'colorPicker'},
  stroke: {type: 'colorPicker'},
  strokeWidth: {type: 'number'}
}

_.extend(WidgetFactory.Icon,{  metaData: {
  settings: {
    fields: _.extend({
      width:{type:'number'},
      height:{type:'number'},
      icon: {
        type: 'select',
        settings: {options: iconKeys}
      }
    },sharedFields)
  }
}});

_.extend(WidgetFactory.IconMorphTransition,{  metaData: {
  settings: {
    fields: _.extend({
      width:{type:'number'},
      height:{type:'number'},

      from: {
        type: 'select',
        settings: {options: iconKeys}
      },
      to: {
        type: 'select',
        settings: {options: iconKeys}
      },	duration:{type:'number'}
    },sharedFields)
  }
}});

_.extend(WidgetFactory.TextContent,{  metaData: {
  settings: {
    fields: {
      content: {type: 'string'},
      font:{type:'fontEditor'}
    }
  }
}});

_.extend(WidgetFactory.JsxContent,{  metaData: {
  settings: {
    fields: {
      data:{type:'plainJsonEditor'},
      content: {type: 'codeEditor'},
      font:{type:'fontEditor'}
    }
  }
}});


_.extend(RichText,{  metaData: {
  settings: {
    fields: {
      content: {type: 'jsonEditor'},
      font:{type:'fontEditor'}
    }
  }
}});

