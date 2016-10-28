# 级联下拉框-模拟ajax获取数据

<div id="ajax_select"></div>

````js
//数据源
var propsData =  [
    {
        "id" : "1",
        "text" : "text-1",
    },
    {
        "id" : "2",
        "text" : "text-2",
    },
    {
        "id" : "3",
        "text" : "text-3",
    }
]

import TreeStore from "tree-store"
import { Component } from "react"
import { render } from "react-dom"

class App extends Component {
	constructor ( props ) {
		super()
		let tree = TreeStore( propsData )
		let checked_ids = [tree.data[0].id]
		this.state = {
			data : tree.data ,
			checked_ids : checked_ids , //选中的id
		}

	}
	change ( id ) {
		let self = this
		//模拟ajax获取到下一级数据 child_data
		let child_data = [
			{
				id : Math.round( Math.random() * 10e6 ).toString(),
				text : 'text-' + Math.round( Math.random() * 10e6 )
			},
			{
				id : Math.round( Math.random() * 10e6 ).toString(),
				text : 'text-' + Math.round( Math.random() * 10e6 )
			}
		]
		// 获取到的数据拓展到数据源中
		let data = TreeStore.extendChild(self.state.data,id,child_data)

		let new_data = TreeStore(data)
		// 更新选中的id
		let checked_ids = new_data.changeSelect(id)

		self.setState({
			data : data ,
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
render(<App />, document.getElementById('ajax_select'))

````