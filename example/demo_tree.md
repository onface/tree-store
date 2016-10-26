# 树形

<div id="demo_tree"></div>

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
							node = (<Node data={item.child} checked_ids={props.checked_ids} change={props.change} />)
						}
						return (
							<li key={key} >
								<input type="checkbox" checked={checked} onChange={function (){
									props.change(item.id,checked)
								}} />
								{item.value}
								{node}
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
			checked_ids : TreeStore( propsData ).getChecked() || []//已选中的id
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
	render () {
		let self = this
		let state = this.state
		return (
			<div>
				<Node data={state.data} checked_ids={state.checked_ids} change={this.change.bind(this)} />
			</div>
		)
	}
}
render(<App />, document.getElementById('demo_tree'))
````