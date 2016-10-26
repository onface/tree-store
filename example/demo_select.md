# 级联下拉框

<div id="demo_select"></div>

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
                "child" : [
                    {
                        "id" : "1_1_1",
                        "value" : "value-1_1_1",
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
                "child" : [
	                {
	                	"id" : "2_1_1",
	                	"value" : "value-2_1_1",
	                }
                ]
            },
            {
                "id" : "2_2",
                "value" : "value-2_2",
                "child" : [
	                {
	                	"id" : "2_1_2",
	                	"value" : "value-2_1_2",
	                }
                ]
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


class App extends Component {
	constructor ( props ) {
		super()
		var checked_ids = ['2','','']
		this.state = {
			data : TreeStore( propsData ).data,
			checked_ids : checked_ids , //选中的id
			lists : TreeStore( propsData ).renderSelect({checkedIds:checked_ids}).renderList || [[],[],[]],
		}
	}
	change ( value , index ) {
		var self = this
		var checked_ids = self.state.checked_ids
		checked_ids[index] = value
		var result = TreeStore( propsData ).renderSelect({
			index : index ,
			checkedIds : checked_ids
		})
		self.setState({
			checked_ids : result.checked,
			lists : result.renderList
		})
	}
	render () {
		let self = this
		let state = this.state
		return (
			<div>
				<select value={state.checked_ids[0]} onChange={function(e){
					self.change(e.target.value , 0)
				}}>
					<option value=''>请选择...</option>
				{
					state.lists[0].map(function(item , key){
						return (
							<option key={'first'+key} value={item} >{TreeStore(state.data).getValue(item)}</option>
						)
					})
				}
				</select>
				<select value={state.checked_ids[1]} onChange={function(e){
					self.change(e.target.value , 1)
				}}>
					<option value=''>请选择...</option>
				{
					state.lists[1].map(function(item , key){
						return (
							<option key={'second'+key} value={item}  >{TreeStore(state.data).getValue(item)}</option>
						)
					})
				}
				</select>
				<select value={state.checked_ids[2]} onChange={function(e){
					self.change(e.target.value , 2)
				}}>
					<option value=''>请选择...</option>
				{
					state.lists[2].map(function(item , key){
						return (
							<option key={'third'+key} value={item}  >{TreeStore(state.data).getValue(item)}</option>
						)
					})
				}
				</select>
			</div>
		)
	}
}
render(<App />, document.getElementById('demo_select'))

````