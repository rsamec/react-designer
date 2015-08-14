import React from 'react';

export default class Tile extends React.Component
{
    handleClick(e){
        this.props.onClick(this.props.eventKey);
    }
    render() {

        return (<div className="Tile" onClick={this.handleClick.bind(this)}>{this.props.children}</div>);
    }
}
