import _ from 'lodash';

const COMPONENT_METADATA = {
	ObjectSchema: {
		metaData: {
			settings: {
				fields: {
					defaultData: {type: 'plainJsonEditor'},
					background: {type:'bgEditor'},
					pageOptions:{type:'pageOptionsEditor'},
					context: {
						fields:{
							intlData: {type: 'plainJsonEditor'},
							styles:{type:'widgetStyleEditor'},
							code:{type:'codeEditor'}
						}
					}
				}
			}
		}
	},
	Container:{
		metaData: {
			settings: {
				fields: {
					visibility: {type: 'boolean'},
					startOnNewPage: {type: 'boolean'},
					unbreakable: {type: 'boolean'}

				}
			}
		}
	},
	BackgroundContainer:{
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
	},
	Repeater:{
		metaData: {
			settings: {
				fields: {
					binding: {type: 'plainJsonEditor'},
					startOnNewPage: {type: 'boolean'},
					unbreakable: {type: 'boolean'}
				}
			}
		}
	},
	Grid:{
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
	},
	Cell:{
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
	}
};
const CONTAINER_KEYS = _.keys(COMPONENT_METADATA);

export {COMPONENT_METADATA as ContainerMetadata}
export {CONTAINER_KEYS as ContainerKeys}
