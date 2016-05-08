import _ from 'lodash';

export default function(source,panelSize) {
  var bg = source;
  var bgStyle = {};
  if (bg === undefined) return bgStyle;

  //size
  if (!!bg.size) {
    if (panelSize !== undefined && (bg.size === 'leftHalf' || bg.size === 'rightHalf')) {
      bgStyle.backgroundSize = `${panelSize.width * 2}px ${panelSize.height}px`;
      bgStyle.backgroundPosition = bg.size === 'leftHalf' ? '0% 0%' : '100% 0%';
      //console.log(bgStyle);
    }
    else {
      bgStyle.backgroundSize = bg.size;
      if (!!bg.position) bgStyle.backgroundPosition = bg.position;
    }
  }
  //gradient
  var bgGradient = bg.gradient;
  if (bgGradient !== undefined) {
    //gradient
    if (bgGradient.stops !== undefined) {
      var gradientStops = _.reduce(bgGradient.stops, function (memo, stop) {
        return memo + ', ' + stop.color + ' ' + (stop.offset * 100) + '%'
      }, '');

      var orientation = bgGradient.orientation || 'top';
      var grandientType = bgGradient.orientation === 'center, ellipse cover' ? '-webkit-radial-gradient' : '-webkit-linear-gradient';
      bgStyle.background = grandientType + '(' + orientation + gradientStops + ')';
    }
  }

  //color
  var bgColor = bg.color;
  if (bgColor !== undefined) {
    if (!!bgColor.color) bgStyle.backgroundColor = bgColor.color;
    if (!!bgColor.alpha) bgStyle.opacity = bgColor.alpha / 100;
  }

  if (!!bg.image) bgStyle.backgroundImage = 'url(' + bg.image + ')';
  if (!!bg.repeat) bgStyle.backgroundRepeat = bg.repeat;
  if (!!bg.attachment) bgStyle.backgroundAttachment = bg.attachment;

  var filter = bg.filter || {};
  var cssFilter = '';
  if (!!filter.blur) cssFilter += ' blur(' + filter.blur + 'px)';
  if (!!filter.brightness) cssFilter += ' brightness(' + filter.brightness + '%)';
  if (!!filter.contrast) cssFilter += ' contrast(' + filter.contrast + '%)';
  if (!!filter.grayscale) cssFilter += ' grayscale(' + filter.grayscale + '%)';
  if (!!filter.hueRotate) cssFilter += ' hue-rotate(' + filter.hueRotate + 'deg)';
  if (!!filter.invert) cssFilter += ' invert(' + filter.invert + '%)';
  if (!!filter.opacity) cssFilter += ' opacity(' + filter.opacity + '%)';
  if (!!filter.saturate) cssFilter += ' saturate(' + filter.saturate + '%)';
  if (!!filter.sepia) cssFilter += ' sepia(' + filter.sepia + '%)';

  if (!!cssFilter) {
    bgStyle.WebkitFilter = cssFilter;
    bgStyle.filter = cssFilter;
  }
  //bgStyle.position = 'absolute';
  return bgStyle;
}
