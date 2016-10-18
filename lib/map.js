;var treeMap = function(setting){
	let data = setting.data
	let childName = setting.childName
	let map = setting.map || false
	let filter = setting.filter || false
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
	return data
}

module.exports = exports = treeMap;