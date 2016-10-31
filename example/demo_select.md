# 级联下拉框

<div id="demo_select"></div>

````js
//数据源
var propsData =  [
    {
        "id" : "1",
        "text" : "text-1",
        "child" : [
            {
                "id" : "1_1",
                "text" : "text-1_1",
                "child" : [
                    {
                        "id" : "1_1_1",
                        "text" : "text-1_1_1",
                        "child" : [
                        	{
                        		"id" : "1_1_1_1",
                        		"text" : "text1_1_1_1",
                        	}
                        ]
                    },
                    {
                        "id" : "1_1_2",
                        "text" : "text-1_1_2"
                    }
                ]
            },
            {
                "id" : "1_2",
                "text" : "text-1_2",
                "child" : [
                    {
                        "id" : "1_2_1",
                        "text" : "text-1_2_1"
                    },
                    {
                        "id" : "1_2_2",
                        "text" : "text-1_2_2"
                    }
                ]
            }
        ]
    },
    {
        "id" : "2",
        "text" : "text-2",
        "child" : [
            {
                "id" : "2_1",
                "text" : "text-2_1",
                "child" : [
	                {
	                	"id" : "2_1_1",
	                	"text" : "text-2_1_1",
	                }
                ]
            },
            {
                "id" : "2_2",
                "text" : "text-2_2",
                "child" : [
	                {
	                	"id" : "2_1_2",
	                	"text" : "text-2_1_2",
	                }
                ]
            },
        ]
    },
    {
        "id" : "3",
        "text" : "text-3",
        "child" : []
    }
]
var propsCheckedIds = ['2','2_1']

import TreeStore from "tree-store"
import { Component } from "react"
import { render } from "react-dom"


class App extends Component {
	constructor ( props ) {
		super()
		this.state = {
			data : TreeStore( propsData ).data,
			checked_ids : propsCheckedIds , //选中的id
		}
	}
	change ( id ) {
		let self = this
		let checked_ids = TreeStore( propsData ).changeSelect(id)
		this.setState({
			checked_ids : checked_ids ,
		})
	}
	render () {
		let self = this
		let state = this.state
		let list = TreeStore( state.data ).renderSelect({checked:state.checked_ids})
		return (
			<div>
			{
				list.map(function(item,key){
					return (
						<select value={state.checked_ids[key]} key={key} onChange={function(e){
							self.change(e.target.value)
						}} >
						{
							item.map(function(sub_item,sub_key){
								return (
									<option key={sub_key} value={sub_item.id}>{sub_item.text}</option>
								)
							})
						}
						</select>
					)
				})
			}
			</div>
		)
	}
}
render(<App />, document.getElementById('demo_select'))

````