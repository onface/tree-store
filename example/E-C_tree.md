# expand/collapse tree 展开/收缩 树形


<div id="EC_tree"></div>


````js
//数据源
var propsData =  [
    {
        "id" : "1",
        "value" : "value-1",
        "child" : [
            {
                "id" : "1_1",
                "value" : "value-1_1",
                "checked":true,
                "child" : [
                    {
                        "id" : "1_1_1",
                        "value" : "value-1_1_1",
		                "checked":true,
                        "child" :  [
                            {
                                "id" :  "1_1_1_1",
                                "value" :  "value-1_1_1_1"
                            },
                            {
                                "id" :  "1_1_1_2",
                                "value" :  "value-1_1_1_2"
                            }
                        ]
                    },
                    {
                        "id" : "1_1_2",
                        "value" : "value-1_1_2"
                    }
                ]
            },
            {
                "id" : "1_2",
                "value" : "value-1_2",
                "child" : [
                    {
                        "id" : "1_2_1",
                        "value" : "value-1_2_1"
                    },
                    {
                        "id" : "1_2_2",
                        "value" : "value-1_2_2"
                    }
                ]
            }
        ]
    },
    {
        "id" : "2",
        "value" : "value-2",
        "child" : [
            {
                "id" : "2_1",
                "value" : "value-2_1",
                "child" : []
            },
            {
                "id" : "2_2",
                "value" : "value-2_2",
                "child" : []
            },
        ]
    },
    {
        "id" : "3",
        "value" : "value-3",
        "child" : []
    }
]

import TreeStore from "tree-store"
import { Component } from "react"
import { render } from "react-dom"
import  cls  from "classnames"

class Node extends Component {
	render() {
		let props = this.props
		return (
			<ol>
				{
					props.data.map(function (item, key){
						var checked = false
						for(let i in props.checked_ids){
							if(item.id == props.checked_ids[i]){
								checked = true
							}
						}
						var node = null
						if (item.child) {
							node = (<Node data={item.child} checked_ids={props.checked_ids} open_ids={props.open_ids} change={props.change} open={props.open} />)
						}
						var icon = 'nochild'
						if(Array.isArray(item.child)){
							icon = item.child.length > 0 ? '+' : icon
						}
						for(let j in props.open_ids){
							if(item.id == props.open_ids[j]){
								icon = '-'
							}
						}
						return (
							<li key={key} >
								<span className={cls({
									"label":true,
									"hide" : icon == 'nochild'
								})} onClick={function (){
									props.open(item.id)
								}} >{icon}</span>
								<input type="checkbox" checked={checked} onChange={function (){
									props.change(item.id,checked)
								}} />
								{item.value}
								<span className={cls({
									"hide" : icon == '+'
								})}>{node}</span>
							</li>
						)
					})
				}
			</ol>
		)
	}
}

class App extends Component {
	constructor ( props ) {
		super()
		this.state = {
			data : TreeStore( propsData ).data,
			checked_ids : TreeStore( propsData ).getChecked() || [] , //已选中的id
			open_ids : [], //展开的id
		}
	}
	change ( id , checked ) {
		var self = this
		var result = TreeStore( self.state.data ).changeChecked({
		    id : id ,
		    isChecked : checked ,
		    checkedIds : self.state.checked_ids
		})
		
		this.setState({
			checked_ids: result.checked
		})
	}
	open ( id ) {
		let self = this
		let noexist = true
		let list = []
		id = id.toString()
		self.state.open_ids.forEach(function(item){
			if(item == id){
				noexist = false
			}else{
				list.push(item)
			}
		})
		if(noexist){
			list.push(id)
		}
		self.setState({
			open_ids:list
		})
	}
	render () {
		let self = this
		let state = this.state
		return (
			<div>
				<Node data={state.data} checked_ids={state.checked_ids} open_ids={state.open_ids} change={this.change.bind(this)} open={this.open.bind(this)} />
			</div>
		)
	}
}
render(<App />, document.getElementById('EC_tree'))
````


````css
.label{
	background-color: rgba(0,0,0,0.5);
}
.label:hover{
	cursor: pointer;
}
.hide{
	display:none !important;
}
````