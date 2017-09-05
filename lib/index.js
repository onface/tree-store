const extend = require('extend');

class __TreeStore {
    constructor (props) {
        this.data = props.data
        this.uniquenessIdTest()//检测id唯一性
    }
    //检测id唯一性
    uniquenessIdTest () {
    	let data = this.data
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
    }
    //转化数字
    idTestString(id){
		if(typeof(id) == 'number'){
			console.warn(id+' is number , its should be set to string')
			id = id.toString()
		}
		return id
    }
    //关系表 - 数据信息
    dataInfo () {
    	let data = this.data
    	let rel_dataInfo = {}

    	;(function getKeyValue (data){
			data.forEach(function(item){
				rel_dataInfo[item.id] = item
				if(Array.isArray(item.child)){
					getKeyValue(item.child)
				}
			})
		})(data)

		return rel_dataInfo
    }
    //关系表 - 子元素id表
    childIds () {
    	let data = this.data
		let rel_childIds = {}

		;(function getKeyValue (data){
			data.forEach(function(item){
				let childIds_list = []
				if(Array.isArray(item.child)){
					item.child.forEach(function(itemSub){
						childIds_list.push(itemSub.id)
						if(Array.isArray(itemSub.child)){
							getKeyValue(item.child)
						}else{
							rel_childIds[itemSub.id] = []
						}
					})
				}
				rel_childIds[item.id] = childIds_list
			})
		})(data)

		return rel_childIds
    }
    //关系表 - 子孙元素id表
    childAllIds () {
    	let data = this.data
    	let rel_childIds = this.childIds()
		let rel_childAllIds = extend(true,{},this.childIds() )//深复制 子元素关系表

		//得到 所有子孙元素表
		for(let index in rel_childAllIds){
			index = index.toString()
			let tempdata = rel_childAllIds[index]
			;(function allChildIds(tempdata){
				tempdata.forEach(function(item){
					if(Array.isArray(rel_childIds[item])){
						rel_childAllIds[index] = rel_childAllIds[index].concat(rel_childIds[item])
						allChildIds(rel_childIds[item])
					}
				})
			})(tempdata)
		}

		return rel_childAllIds
    }
    //关系表 - 父元素id表
    parentIds () {
		let rel_parentIds = {}
		let rel_childIds = this.childIds()

		for(let parent_id in rel_childIds){
			rel_childIds[parent_id].forEach(function(item){
				rel_parentIds[item] = parent_id
			})
		}

		return rel_parentIds
    }
	//关系表 - 所有祖父元素id
    parentAllIds () {
	    let rel_parentAllIds = {}
	    let rel_parentIds = this.parentIds()

	    for(let sub in rel_parentIds){
			sub = sub.toString()
			let parentIds_list = []
			parentIds_list.push(rel_parentIds[sub])
			let parent_id = rel_parentIds[sub]
			;(function getAllParents(parent_id){
				if(typeof(rel_parentIds[parent_id]) != 'undefined'){
					parentIds_list.push(rel_parentIds[parent_id])
					let grandfather_id = rel_parentIds[parent_id]
					getAllParents(grandfather_id)
				}
			})(parent_id)
			rel_parentAllIds[sub] = parentIds_list
		}

		return rel_parentAllIds
    }
	//关系表 - 每个id的所有左树杈子孙元素id
    childLeftBranchIds () {
		let rel_childLeftBranchIds ={}
		let rel_childIds = this.childIds()

		for(let key in rel_childIds){
			rel_childLeftBranchIds[key] = []
			if(rel_childIds[key].length > 0){
				rel_childLeftBranchIds[key].push(rel_childIds[key])
				let subkey = rel_childIds[key][0]
				;(function firstChildIds(subkey){
					if(typeof rel_childIds[subkey] != 'undefined'){
						if(rel_childIds[subkey].length > 0){
							rel_childLeftBranchIds[key].push(rel_childIds[subkey])
							let grandkey = rel_childIds[subkey][0]
							firstChildIds(grandkey)
						}
					}
				})(subkey)
			}
		}

		return rel_childLeftBranchIds
    }
}
//获取当前id所在item所有数据
__TreeStore.prototype.getData = function (id) {
	if(typeof(id) == 'undefined'){
		console.warn('id must not be null')
		return this.dataInfo()
	}
	//传入数组
	if(Array.isArray(id)){
		let result = []
		for(let i in id){
			id[i] = this.idTestString(id[i])
			result.push(this.dataInfo()[id[i]])
		}
		return result
	}
	//检测是否数字类型并转化
	id = this.idTestString(id)
    return this.dataInfo()[id]
}
//获取子元素ids
__TreeStore.prototype.getChildIds = function (id) {
	if(typeof(id) == 'undefined'){
		console.warn('id must not be null')
		return false
	}
	//传入数组
	if(Array.isArray(id)){
		let result = []
		for(let i in id){
			id[i] = this.idTestString(id[i])
			result.push(this.childIds()[id[i]])
		}
		return result
	}
	//检测是否数字类型并转化
	id = this.idTestString(id)

    return this.childIds()[id]
}
//获取子孙元素ids
__TreeStore.prototype.getChildAllIds = function (id) {
	if(typeof(id) == 'undefined'){
		return this.childAllIds()
	}
	//传入数组
	if(Array.isArray(id)){
		let result = []
		for(let i in id){
			id[i] = this.idTestString(id[i])
			result.push(this.childAllIds()[id[i]])
		}
		return result
	}
	//检测是否数字类型并转化
	id = this.idTestString(id)

    return this.childAllIds()[id]
}
//获取所有祖父ids
__TreeStore.prototype.getParentAllIds = function (id) {
	if(typeof(id) == 'undefined'){
		console.warn('id must not be null')
		return false
	}
	//传入数组
	if(Array.isArray(id)){
		let result = []
		for(let i in id){
			id[i] = this.idTestString(id[i])
			let list = this.parentAllIds()[id[i]] || []
			result.push(list)
		}
		return result
	}
	//检测是否数字类型并转化
	id = this.idTestString(id)
    return this.parentAllIds()[id] || []
}
//所有左树杈ids
__TreeStore.prototype.getChildLeftBranchIds = function (id) {
	id = id || ''
	if(!/\S/.test(id)){
		let ids = [[]]
		this.data.forEach(function(item){
			ids[0].push(item.id)
		})
		return ids.concat(this.childLeftBranchIds()[this.data[0].id])
	}
	//检测是否数字类型并转化
	id = this.idTestString(id)
    return this.childLeftBranchIds()[id]
}
//获取兄弟元素ids
__TreeStore.prototype.getSiblingIds = function (id) {
	let self = this
	id = id || ''
	if(!/\S/.test(id) || typeof(self.parentIds()[id]) == 'undefined' ){
		let list = []
		this.data.forEach(function(item){
			list.push(item.id)
		})
		return list
	}
	//检测是否数字类型并转化
	id = self.idTestString(id)
    return self.childIds()[self.parentIds()[id]]
}
//获取下拉框正确的选中id
__TreeStore.prototype.changeSelect = function (id) {
	let  self = this
	//检测是否数字类型并转化
	id = id || ''
	id = self.idTestString(id)
	let list = self.parentAllIds()[id] || []
	list = list.reverse()
	list.push(id)
	let childList = self.childLeftBranchIds()[id] || [[]]
	childList.forEach(function(item){
		list.push(item[0])
	})
	return list
}
//渲染级联下拉框
__TreeStore.prototype.renderSelect = function (settings) {
	let self = this
	//检测checkIds必须为数组
	if(!Array.isArray(settings.checked)){
		console.warn(settings.checked+'must not be Array')
		return settings.checked
	}
	//深复制checkIds
	let ids = extend(true,[],settings.checked)
	//遍历生成renderList
	let ids_list = []
	ids.forEach(function(item,index){
		item = self.idTestString(item)
		let sibling_ids = self.getSiblingIds(item) || []
		let sibling_list = []
		sibling_ids.forEach(function(sib_item){
			sibling_list.push(self.dataInfo()[sib_item])
		})
		ids_list.push(sibling_list)
	})
	//数据层数和级数不匹配时
	if(typeof settings.maxLength != 'undefined'){
		ids_list = ids_list.slice(0,settings.maxLength)
	}

	return ids_list
}
//获取所有checked:true的id
__TreeStore.prototype.getChecked = function () {
	let ids = []
	let rel_data_info = this.dataInfo()
	for(let i in rel_data_info){
		if(rel_data_info[i].checked == true){
			ids.push(rel_data_info[i].id)
		}
	}
	return ids
}
//改变选中状态
__TreeStore.prototype.changeChecked = function (settings) {
	let self = this
	// 参数数据
	let data = this.data
	let id = settings.id
	let isChecked = settings.isChecked
	let checkedIds = settings.checkedIds
	let autoLink = settings.autoLink || {}
		autoLink.parent = typeof(autoLink.parent) == 'boolean' ?  autoLink.parent : true
		autoLink.child = typeof(autoLink.child) == 'boolean' ?  autoLink.child : true

	// 需要返回的数据
	let result = {
		change : {
			unchecked_ids : [] ,//取消选中ids
			checked_ids : [] //选中ids
		},
		checked : []
	}

	//更新取消选中unchecked_ids并去除checked存在项
	if(isChecked){
		let temp_ids = []

		// 判断是否关联子孙
		temp_ids = autoLink.child ? temp_ids.concat(this.childAllIds()[id]) : []

		temp_ids.push(id)

		// 判断是否关联祖父
		if(autoLink.parent){
			//递归遍历所有需要去除的祖父ids
			;(function testParentChecked (id) {
				//找出除自己以外的兄弟ids
				let sibling_ids = []
				let temp_sibling_ids = self.childIds()[self.parentIds()[id]] || []
				let sibling_unchecked = temp_sibling_ids.length > 0 ? true : false //判断兄弟ids是否是都取消状态
					// alert(temp_sibling_ids.length)
				if(temp_sibling_ids.length > 0 ){ //有兄弟ids
					temp_sibling_ids.forEach(function(item){
						if(item != id){
							sibling_ids.push(item)
						}
					})
					//判断兄弟ids是否是都取消状态
					checkedIds.forEach(function(item){
						sibling_ids.forEach(function(sib_item){
							if(item == sib_item){
								sibling_unchecked = false
							}
						})
					})
				}
				//兄弟ids都取消,则父元素取消
				if(sibling_unchecked){
					let parent_id = self.parentIds()[id]
					temp_ids.push(parent_id)
					testParentChecked(parent_id)
				}
			})(id)
		}

		result.change.unchecked_ids = temp_ids

		//去除checked存在项
		checkedIds.forEach(function(item){
			let unexist = true
			temp_ids.forEach(function(sib_item){
				if(item == sib_item){
					unexist = false
				}
			})
			if(unexist){
				result.checked.push(item)
			}
		})

	//添加选中checked_ids并去重checked
	}else{
		let temp_ids = []

		// 判断是否关联子孙
		temp_ids = autoLink.child ? temp_ids.concat(this.childAllIds()[id]) : []

		temp_ids.push(id)

		// 判断是否关联祖父
		temp_ids = autoLink.parent ? temp_ids.concat(this.parentAllIds()[id]).sort() : temp_ids

		let temp_checked_ids = extend(true,[],checkedIds)
		temp_checked_ids = temp_checked_ids.concat(temp_ids).sort()

		result.checked = require("uniq")(temp_checked_ids)

		result.change.checked_ids = temp_ids
	}
	return result
}

function TreeStore(data,settings) {
    settings = settings || false

    //深复制数据源
    let temp_data = extend(true,[],data)

    //数据key转换
    if(settings !== false){
    	let childName = settings.child || 'child'
    	temp_data = TreeStore.treeMap(temp_data,childName,function(item){
    		for(let key in settings){
    			item[key] = item[settings[key]]
    			delete item[settings[key]]
    		}
    		return item
    	})
    }

	settings = {
		data : temp_data//深复制数据源
	}

    return new __TreeStore(settings)
}

//拓展数据
TreeStore.extendChild = function (data,id,childData) {

	if(!Array.isArray(childData)){
		console.warn('childData must be Array')
		return
	}

    let extendFn = function(attrChildData) {
        // 以id标识 重复-覆盖,不存在-添加
        if(Array.isArray(attrChildData)){
            let originIdMap = {}
            attrChildData.forEach(function(originItem,originIndex){
                originIdMap[originItem.id] = originIndex
            })
            childData.forEach(function(outputItem){
                let exist = typeof originIdMap[outputItem.id] == 'undefined' ? false : true
                if(exist){
                    console.warn('The child properties of '+outputItem.id+' is overwritten !')
                    attrChildData[ originIdMap[outputItem.id] ] = extend(true,{},outputItem)
                }else{
                    attrChildData.push( extend(true,{},outputItem) )
                }
            })
            return attrChildData
        }else{
            return childData
        }
        // return attrChildData
    }

    // 顶层直接放置
    if(id === ''){
        return extendFn(data)
    }

	//检测是否数字类型并转化
	if(typeof(id) == 'number'){
		console.warn(id+' is number , its should be set to string')
		id = id.toString()
	}

	;(function addData (data){
		data.forEach(function(item){
			if(Array.isArray(item.child)){
				addData(item.child)
			}
			if(item.id == id){
                item.child = extendFn(item.child)
			}
		})
	})(data)
	return data
}
//深层遍历
TreeStore.treeMap = function (data,childName,fn,isReParent) {
    let temp_data = extend(true,[],data) //深复制数据源
	;(function dataMap(temp_data,parent_item){
		temp_data.forEach(function(e){
			if(isReParent){
				let parent_data = extend(true,{},parent_item)
				delete parent_data[childName]
				e['__TreeStore_parentArray'] = typeof parent_item == 'undefined' ? [] : parent_item['__TreeStore_parentArray'].concat(parent_data)
			}
			if(Array.isArray(e[childName])){
				dataMap(e[childName],e)
			}
			fn(e)
		})
	})(temp_data)
	return temp_data
}
//深层过滤
TreeStore.treeFilter = function (data,childName,fn) {
    let temp_data = extend(true,[],data)//深复制数据源
	//深层递归过滤
	function filter (data, fn) {
	    let deepFilter = function (data, fn) {
	        let output = []
	        data.map(function(item) {
	            if (fn(item)) {
	                if (Array.isArray(item[childName])) {
	                    item[childName] = deepFilter(item[childName], fn)
	                }
	                output.push(item)
	            }
	        })
	        return output
	    }
	    return deepFilter(data, fn)
	}
	let result_data = filter(temp_data, fn)


	return result_data
}


module.exports = exports = TreeStore;
