# 树形-模拟ajax获取数据

<div id="ajax_tree"></div>

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
							node = (<Node data={item.child} checked_ids={props.checked_ids} change={props.change} add={props.add}/>)
						}
						return (
							<li key={key}>
								<input type="checkbox" checked={checked} onChange={function (){
									props.change(item.id,checked)
								}} />
								<span onClick={function (){
									props.add(item.id)
								}}>{item.text}</span>
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
	add ( id ) {
		var self = this
		//模拟ajax获取到下一级数据 child_data
		let tempmath = Math.round( Math.random() * 10e6 ).toString()
		let child_data = [
			{
				id : tempmath,
				text : 'text-' + tempmath
			},
			{
				id : tempmath+'_2',
				text : 'text-' + tempmath+'_2'
			}
		]
		// 获取到的数据拓展到数据源中
		let data = TreeStore.extendChild(self.state.data,id,child_data)
		this.setState({
			data:data 
		})
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
				<Node data={state.data} checked_ids={state.checked_ids} change={self.change.bind(this)} add={self.add.bind(this)} />
			</div>
		)
	}
}
render(<App />, document.getElementById('ajax_tree'))

````