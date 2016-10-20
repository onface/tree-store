;var treeMap = function(setting){
	let data = setting.data
	let childName = setting.childName
	let map = setting.map || false
	let filter_fn = setting.filter || false
	let filter_result = []
	//map遍历
	if(map !== false){
		;(function dataMap(data){
			data.forEach(function(e){
				if(Array.isArray(e[childName])){
					dataMap(e[childName])
				}
				map(e)
			})
		})(data)
	}
	//深层递归过滤
	function filter (data, fn) {
	    let deepFilter = function (data, fn) {
	        let output = []
	        data.map(function(item) {
	            if (fn(item)) {
	                output.push(item)
	                if (Array.isArray(item.child)) {
	                    item.child = deepFilter(item.child, fn)
	                }
	            }
	        })
	        return output
	    }
	    return deepFilter(data, fn)
	}
	//如果用户有定义filter
	if(filter_fn){
		filter_result = filter(data, filter_fn)
		data = filter_result
	}

	return data
}

module.exports = exports = treeMap;