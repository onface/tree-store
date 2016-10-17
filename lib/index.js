function TreeStore(setting){
	let data = []
	//复制数据源
	if (Array.isArray(setting.data)) {
		for(let key in setting.data){
			data[key] = setting.data[key]
		}
    }
    //转化数据
	if(typeof setting.dataAttr == 'object'){
		let dataAttr = {}
		for(let key in setting.dataAttr){
			dataAttr[key] = setting.dataAttr[key]
		}
		;(function getDataAttr(data){
			data.forEach(function(item){
				if(typeof dataAttr.id != 'undefined'){
					item.id = item[dataAttr.id]
					delete item[dataAttr.id]
				}
				if(typeof dataAttr.text != 'undefined'){
					item.text = item[dataAttr.text]
					delete item[dataAttr.text]
				}
				if(typeof dataAttr.child != 'undefined'){
					item.child = Array.isArray(item[dataAttr.child]) ? item[dataAttr.child] : []
					delete item[dataAttr.child]
				}
				if(Array.isArray(item.child)){
					getDataAttr(item.child)
				}
			})
		})(data)
	}else if(typeof setting.dataAttr != 'undefined'){
		console.warn('dataAttr配置错误')
	}
    this.data = data //数据源

    //关系表-键值表
    let rel_keyValue = {}
		/*
		{
			"1":"text=1",
			"2":"text=2",...
		}
		*/
    //关系表-数据信息
    let rel_dateInfo = {}
		/*
		{
			"1":{id:1,text:'text=1',child:[...]},
			"2":{id:2,text:'text=2',child:[...]},...
		}
		*/
	//关系表-第一层子元素id
	let rel_childIds = {}
		/*
		{
			"1":['1_1','1_2'],
			"2":['2_1'],...
		}
		*/
	//关系表-所有子孙元素id
	let rel_allChildIds = {}
		/*
		{
			"1":['1_1','1_2','1_1_1','1_1_2','1_1_1_1'],
			"1_1":['1_1_1','1_1_2','1_1_1_1'],...
		}
		*/
	//关系表-父元素id
	let rel_parent = {}
		/*
		{
			"1_1":'1',
			"1_2":'1',...
		}
		*/
	//关系表-所有祖父元素id
	let rel_allParent = {}
		/*
		{
			"1_1_1":['1_1',1],
			"1_1_1_2":['1_1_1','1_1','1'],....
		}
		*/
	//关系表-每个id的所有第一层子元素即首个子孙元素id
	let rel_fristChildIds ={}
		/*
		{
			"1":[
				['1-1','1-2'],
			    ['1-1-1','1-1-2'],
			    ['1-1-1-1','1-1-1-2'],
		    ],
		    "2":[
				['2_1','2_2'],
		    ],...
		}
		*/

	//检测id唯一性
	let rel_only_id = {}
	;(function testOnlyId (data){
		data.forEach(function(item){
			if(typeof rel_only_id[item.id] != 'undefined'){
				console.warn('id => '+item.id+'重复')
			}
			rel_only_id[item.id] = true
			if(Array.isArray(item.child)){
				testOnlyId(item.child)
			}
		})
	})(data)

	//得到 键值表,数据信息表,第一层子元素表
    ;(function getKeyValue (data){
		data.forEach(function(item){
			let childIds = []
			rel_dateInfo[item.id] = item
			rel_keyValue[item.id] = item.text
			rel_childIds[item.id] = childIds
			if(Array.isArray(item.child)){
				item.child.forEach(function(itemSub){
					itemSub.id = itemSub.id
					childIds.push(itemSub.id)
					rel_dateInfo[itemSub.id] = item
					rel_keyValue[itemSub.id] = itemSub.text
					if(Array.isArray(itemSub.child)){
						getKeyValue(item.child)
					}
				})
			}
		})
	})(data)

	//rel_allChildIds = rel_childIds -.-哼 传你妹的址
	//拷贝rel_childIds的值,避免传址
	for(let key in rel_childIds){
		key = key.toString()
		rel_allChildIds[key] = rel_childIds[key]
	}
	//得到 所有子孙元素表
	for(let index in rel_allChildIds){
		index = index.toString()
		let tempdata = rel_allChildIds[index]
		;(function allChildIds(tempdata){
			tempdata.forEach(function(item){
				if(Array.isArray(rel_childIds[item])){
					rel_allChildIds[index] = rel_allChildIds[index].concat(rel_childIds[item])
					allChildIds(rel_childIds[item])
				}
			})
		})(tempdata)
	}
	//得到 父元素表
	for(let parent_id in rel_childIds){
		rel_childIds[parent_id].forEach(function(item){
			rel_parent[item] = parent_id
		})
	}
	//得到 祖父元素表
	for(let sub in rel_parent){
		sub = sub.toString()
		let parent_ids = []
		parent_ids.push(rel_parent[sub])
		let parent_id = rel_parent[sub]
		;(function getAllParents(parent_id){
			if(typeof(rel_parent[parent_id]) != 'undefined'){
				parent_ids.push(rel_parent[parent_id])
				let grandfather_id = rel_parent[parent_id]
				getAllParents(grandfather_id)
			}
		})(parent_id)
		rel_allParent[sub] = parent_ids
	}
	//得到 每个id的所有第一层子元素即首个子孙元素id表
	for(let key in rel_childIds){
		rel_fristChildIds[key] = []
		if(rel_childIds[key].length > 0){
			rel_fristChildIds[key].push(rel_childIds[key])
			let subkey = rel_childIds[key][0]
			;(function firstChildIds(subkey){
				if(typeof rel_childIds[subkey] != 'undefined'){
					if(rel_childIds[subkey].length > 0){
						rel_fristChildIds[key].push(rel_childIds[subkey])
						let grandkey = rel_childIds[subkey][0]
						firstChildIds(grandkey)
					}
				}
			})(subkey)
		}
	}

	this.rel_dateInfo = rel_dateInfo //键值表表
	this.rel_keyValue = rel_keyValue //数据信息表
	this.rel_childIds = rel_childIds //第一层子元素id表
	this.rel_allChildIds = rel_allChildIds //所有子孙元素id表
	this.rel_parent = rel_parent //父元素id表
	this.rel_allParent = rel_allParent //所有祖父元素id表
	this.rel_fristChildIds = rel_fristChildIds //每个id的所有第一层子元素即首个子孙元素id表
};
TreeStore.prototype.getChildIds = function(id){
	if(typeof(id) == 'number'){
		console.warn(id+' is number , its should be set to string')
		id = id.toString()
	}
	return this.rel_childIds[id]
}
TreeStore.prototype.getAllChildIds = function(id){
	if(typeof(id) == 'number'){
		console.warn(id+' is number , its should be set to string')
		id = id.toString()
	}
	if(typeof(id) == 'undefined'){
		return this.rel_allChildIds
	}
	return this.rel_allChildIds[id]
}
TreeStore.prototype.getData = function(ids){
	if(typeof(ids) == 'number'){
		console.warn(ids+' is number , its should be set to string')
		ids = ids.toString()
	}
	if(Array.isArray(ids)){
		let ids_list = []
		for(let item in ids){
			let id = ids[item]
			id = id.toString()
			ids_list.push(this.rel_dateInfo[id])
		}
		return ids_list
	}
	return this.rel_dateInfo[ids]
}
TreeStore.prototype.getParent = function(id){
	if(typeof(id) == 'number'){
		console.warn(id+' is number , its should be set to string')
		id = id.toString()
	}
	return this.rel_parent[id]
}
TreeStore.prototype.getAllParent = function(id){
	if(typeof(id) == 'number'){
		console.warn(id+' is number , its should be set to string')
		id = id.toString()
	}
	return this.rel_allParent[id]
}
TreeStore.prototype.getValue = function(id){
	if(typeof(id) == 'number'){
		console.warn(id+' is number , its should be set to string')
		id = id.toString()
	}
	return this.rel_keyValue[id]
}
TreeStore.prototype.getFristChildIds = function(id){
	if(typeof(id) == 'number'){
		console.warn(id+' is number , its should be set to string')
		id = id.toString()
	}else if(typeof id == 'undefined'){
		if(typeof this.data[0] == 'undefined'){
			return []
		}
		id = this.data[0].id 
	}
	return this.rel_fristChildIds[id]

}

module.exports = exports = TreeStore;