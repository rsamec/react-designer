import React from 'react';
import _ from 'lodash';
import * as md from 'react-icons/lib/md';
//import * as fa from 'react-icons/lib/fa';
//import * as ti from 'react-icons/lib/ti';
//import * as go from 'react-icons/lib/go';

const iconList = [
	{
		title:'Material Design Icons by Google',
		url:'https://www.google.com/design/icons/',
		license:{
			title:'CC-BY 4.0',
			url:'https://github.com/google/material-design-icons/blob/master/LICENSE'
		},
		iconKeys: _.rest(_.keys(md),1),
		icons:md
	}
	//{
	//	title:'Font Awesome by Dave Gandy',
	//	url:'http://fontawesome.io',
	//	license:{
	//		title:'SIL OFL 1.1',
	//		url:'http://scripts.sil.org/cms/scripts/page.php?site_id=nrsi&id=OFL'
	//	},
	//	iconKeys: _.rest(_.keys(fa),1),
	//	icons:fa
	//},
	//{
	//	title:'Typicons by Stephen Hutchings',
	//	url:'http://typicons.com',
	//	license:{
	//		title:'CC BY-SA',
	//		url:'http://creativecommons.org/licenses/by-sa/3.0/'
	//	},
	//	iconKeys: _.rest(_.keys(ti),1),
	//	icons:ti
	//},
	//{
	//	title:'Github Octicons icons by Github',
	//	url:'https://octicons.github.com/',
	//	license:{
	//		title:'SIL OFL 1.1',
	//		url:'http://scripts.sil.org/cms/scripts/page.php?site_id=nrsi&id=OFL'
	//	},
	//	iconKeys: _.rest(_.keys(go),1),
	//	icons:go
	//}
]
const iconsPerPage = 100;

class IconList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {currentPage: 1}
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.currentPage !== nextState.currentPage
  }

  render() {
    let {iconKeys, icons, title, url, license} = this.props;


    var pages = [];
    for (var i = 0; i < Math.ceil(iconKeys.length / iconsPerPage); i++) {
      pages.push({page: i + 1});
    }
    var items = iconKeys;
    if (this.state.currentPage !== undefined) {
      var start = (this.state.currentPage - 1) * iconsPerPage;
      items = iconKeys.slice(start, start + iconsPerPage);
    }
    var iconEls = items.map(function (item, i) {
      var addFce = ()=> {
        this.props.add({
          elementName: 'Core.Icon',
          props: {icon: item, width: 60, height: 60}
        })
      }
      return React.createElement(icons[item], {key: i, width: 60, height: 60, onClick: addFce})
    }, this);
    var pages = pages.map(function (page, i) {
      return (
        <a key={'page' + i} onClick={()=> {this.setState({currentPage:page.page})}}>{page.page}&nbsp;</a>
      );
    }, this);
    return (<div>
        <h3>{title}</h3>
        <h5><a href={url}>{url}</a></h5>
        <h5>licence:<a href={license.url}>{license.title}</a>
        </h5>
        <hr/>
        <div style={{display:'flex',flexWrap:'wrap'}}>
          {iconEls}
        </div>
        <div id="paging">
          {pages}
          <a onClick={()=> {this.setState({currentPage:undefined})}}>Show all</a>
        </div>

      </div>
    )
  }
}

let ToolBox = (props) => {
	return (
		<div>
			{iconList.map(function(item,i){
				return <IconList key={'l' + i} {...item} add={props.add}/>
			})}
		</div>
	)
}
export default ToolBox;
