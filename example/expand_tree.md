# 树形 伸缩展开 //关联子父级

````css
    .expand ul {
        padding-left: 0;
    }
    .expand ul,li {
        list-style-type:none;
    }
    .li-false {
        height:24px;
        overflow-y:hidden;
        padding-left: 18px;
        position: relative;
    }
    .li-true {
        height:auto;
        padding-left: 18px;
        position: relative;
    }
    .li-span{
        width:12px;
        height:12px;
        line-height:12px;
        font-size: 12px;
        position:absolute;
        top: 7px;
        left: 0;
        display:inline-block;
        vertical-align: middle;
    }
    .li-span:before {
        position:absolute;
        top:0px;
        left:0px;
        cursor:pointer;
        display:inline-block;
        border:1px solid black;
        height:100%;
        width:100%;
        text-align:center;
    }
    .li-false > .li-span:before{
        content:'+';
    }
    .li-true > .li-span:before{
        content:'-';
    }
````

<div 
    id="expand_tree"
    data-tree-value="2-2-2,1-2-2"
    data-tree-options="treeJSON" 
    data-tree-linkParent=false
    data-tree-linkChild=false
></div>

````js
var propsData = [
    {
        "label": "北京",
        "value": "1",
        "children": [
            {
                "label": "朝阳区",
                "value":"1-1",
                "children": [
                    {
                        "label": "黄泉路",
                        "value": "1-1-1"
                    }
                ]
            },
            {
                "label": "八宝山",
                "value":"1-2",
                "children": [
                    {
                        "label": "公墓",
                        "value":"1-2-1"
                    },
                    {
                        "label": "大门",
                        "value":"1-2-2"
                    }
                ]
            }
        ]
    },
    {
        "label": "上海",
        "value": "2",
        "children": [
            {
                "label": "黄埔区",
                "value": "2-1",
                "children": [
                    {
                        "label": "abc",
                        "value": "2-1-1"
                    },
                    {
                        "label": "def",
                        "value": "2-1-2"
                    }
                ]
            },
            {
                "label": "虹口区",
                "value": "2-2",
                "children": [
                    {
                        "label": "武进路",
                        "value": "2-2-1"
                    },
                    {
                        "label": "四平路",
                        "value": "2-2-2"
                    }
                ]
            },
            {
                "label": "没有子元素",
                "value": "2-3"
            }
        ]
    }
]
import TreeStore from "tree-store" ;
import { Component } from "react" ;
import { render } from "react-dom" ;
import classNames from "classnames" ;
import $ from 'jquery';

class TreeNode extends Component {
	render() {
        let self = this
		let props = this.props
		return (
			<ul>
				{
					props.data.map(function (item, key){
						var checked = false
						if(props.checked_ids.indexOf(item.id) != -1){
							checked = true
						}
						var node = null
                        var btn = null
						if (item.child) {
							node = (<TreeNode data={item.child} checked_ids={props.checked_ids} change={props.change} />)
                            btn = (
                                <span className={'li-span'} //onClick={function(){console.log('span')}}
                                ></span>
                            )
						}
                        // console.log(item.id+' '+checked)
						return (
							<li key={key} className={'li li-false'} >
                                {btn}
								<input type="checkbox" checked={checked} onChange={function (){
                                    // console.log('click')
									props.change(item.id,checked)
								}} />
								{item.id +'  '+ item.value}
								{node}
							</li>
						)
					})
				}
			</ul>
		)
	}
}

class TreeApp extends Component {
	constructor ( props ) {
		super(props)
        let store = TreeStore( props.data ,{
            id :  'value',
            child :  'children' ,
            value :  'label' ,
        })

        let checked_ids = []
        if(/\S/.test(props.value)){
            let isChecked = props.value.split(',')
            checked_ids = checked_ids.concat(isChecked)
            for(let key in isChecked){
                checked_ids = checked_ids.concat(store.getParentAllIds(isChecked[key]))
            }
        }

		this.state = {
            store : store ,
			data : store.data,
			checked_ids : checked_ids //已选中的id
		}
	}
    componentDidMount () {
        $('body').on('click','.li-span',function(){
            console.log('li-span')
            let $this = $(this)
            let $parent = $this.closest('.li')
            $parent.toggleClass('li-false')
            $parent.toggleClass('li-true')
        })
    }
	change ( id , checked ) {
		var self = this
		var result = self.state.store.changeChecked({
		    id : id ,
		    isChecked : checked ,
		    checkedIds : self.state.checked_ids,
            autoLink : {
                parent : self.props.linkParent ,
                child : self.props.linkChild 
            }
		})
		
		self.setState({
			checked_ids: result.checked
		})
	}
	render () {
		let self = this
		let state = this.state
		return (
			<div className="expand">
				<TreeNode data={state.data} checked_ids={state.checked_ids} change={this.change.bind(this)} />
                <input name={self.props.name} type="hidden" value={self.state.checked_ids.join(',')} />
			</div>
		)
	}
}
TreeApp.defaultProps = {
    data:[],
    name:'',
    value:'',
    linkParent:true,
    linkChild:true,
}

render(<TreeApp {...{
	data:propsData || [] ,
    name:"edit",
    value:"2-2-2,1-2-2",
    linkParent:false,
    linkChild:false,
}}/>, document.getElementById('expand_tree'))

````