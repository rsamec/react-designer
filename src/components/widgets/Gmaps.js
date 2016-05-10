import React from 'react';
import {Gmaps, Marker, InfoWindow, Circle} from 'react-gmaps';

let Renderer = (props) => {

  return (
    <Gmaps {...props}
      params={{v: '3.exp'}}
      onMapCreated={() => {
			//map.setOptions({disableDefaultUI: true})
			}}>
      <Marker
        lat={props.lat}
        lng={props.lng}
        draggable={true}/>
      <InfoWindow
        lat={props.lat}
        lng={props.lng}
        content={props.content}/>
      <Circle
        lat={props.lat}
        lng={props.lng}
        radius={500}/>
    </Gmaps>
  );
}

Renderer.defaultProps = {width:800, height:600,zoom:12, lat: 51.5258541,lng: -0.08040660000006028, content:'type your location'};
export default Renderer;



