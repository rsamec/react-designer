import _ from 'lodash';

export default class ChartAdapter{
    adaptTo(props){
        var nextProps = _.deepClone(props)
        return nextProps;
    }
}
