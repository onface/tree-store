;var treeMap = function(setting){
	let data = setting.data
	let childName = setting.childName
	let map = setting.map
	;(function dataMap(data){
		data.forEach(function(e){
			map(e)
			if(Array.isArray(e[childName])){
				dataMap(e[childName])
			}
		})
	})(data)
	return data
}

module.exports = exports = treeMap;