import _ from 'lodash';

const convertToEmptyProps = function(children){
	var result = _.mapValues(children,function(){return undefined});
	for (var key in children) {
		var fields = children[key]['fields'];
		if (fields === undefined) continue;
		result[key] = convertToEmptyProps(fields);
	}
	return result;
}


export default function(metadataSettings){
	return convertToEmptyProps(metadataSettings.fields);
}
