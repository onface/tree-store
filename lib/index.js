'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var __TreeStore = function () {
	function __TreeStore(props) {
		_classCallCheck(this, __TreeStore);

		this.data = props.data;
		this.uniquenessIdTest(); //检测id唯一性
	}
	//检测id唯一性


	_createClass(__TreeStore, [{
		key: 'uniquenessIdTest',
		value: function uniquenessIdTest() {
			var data = this.data;
			var rel_only_id = {};(function testOnlyId(data) {
				data.forEach(function (item) {
					if (typeof rel_only_id[item.id] != 'undefined') {
						console.warn('id => ' + item.id + '重复');
					}
					rel_only_id[item.id] = true;
					if (Array.isArray(item.child)) {
						testOnlyId(item.child);
					}
				});
			})(data);
		}
		//转化数字

	}, {
		key: 'idTestString',
		value: function idTestString(id) {
			if (typeof id == 'number') {
				console.warn(id + ' is number , its should be set to string');
				id = id.toString();
			}
			return id;
		}
		//关系表 - 数据信息

	}, {
		key: 'dataInfo',
		value: function dataInfo() {
			var data = this.data;
			var rel_dataInfo = {};(function getKeyValue(data) {
				data.forEach(function (item) {
					rel_dataInfo[item.id] = item;
					if (Array.isArray(item.child)) {
						getKeyValue(item.child);
					}
				});
			})(data);

			return rel_dataInfo;
		}
		//关系表 - 子元素id表

	}, {
		key: 'childIds',
		value: function childIds() {
			var data = this.data;
			var rel_childIds = {};(function getKeyValue(data) {
				data.forEach(function (item) {
					var childIds_list = [];
					if (Array.isArray(item.child)) {
						item.child.forEach(function (itemSub) {
							childIds_list.push(itemSub.id);
							if (Array.isArray(itemSub.child)) {
								getKeyValue(item.child);
							} else {
								rel_childIds[itemSub.id] = [];
							}
						});
					}
					rel_childIds[item.id] = childIds_list;
				});
			})(data);

			return rel_childIds;
		}
		//关系表 - 子孙元素id表

	}, {
		key: 'childAllIds',
		value: function childAllIds() {
			var data = this.data;
			var rel_childIds = this.childIds();
			var rel_childAllIds = JSON.parse(JSON.stringify(this.childIds())); //深复制 子元素关系表

			//得到 所有子孙元素表

			var _loop = function _loop(_index) {
				_index = _index.toString();
				var tempdata = rel_childAllIds[_index];(function allChildIds(tempdata) {
					tempdata.forEach(function (item) {
						if (Array.isArray(rel_childIds[item])) {
							rel_childAllIds[_index] = rel_childAllIds[_index].concat(rel_childIds[item]);
							allChildIds(rel_childIds[item]);
						}
					});
				})(tempdata);
				index = _index;
			};

			for (var index in rel_childAllIds) {
				_loop(index);
			}

			return rel_childAllIds;
		}
		//关系表 - 父元素id表

	}, {
		key: 'parentIds',
		value: function parentIds() {
			var rel_parentIds = {};
			var rel_childIds = this.childIds();

			var _loop2 = function _loop2(parent_id) {
				rel_childIds[parent_id].forEach(function (item) {
					rel_parentIds[item] = parent_id;
				});
			};

			for (var parent_id in rel_childIds) {
				_loop2(parent_id);
			}

			return rel_parentIds;
		}
		//关系表 - 所有祖父元素id

	}, {
		key: 'parentAllIds',
		value: function parentAllIds() {
			var rel_parentAllIds = {};
			var rel_parentIds = this.parentIds();

			var _loop3 = function _loop3(_sub) {
				_sub = _sub.toString();
				var parentIds_list = [];
				parentIds_list.push(rel_parentIds[_sub]);
				var parent_id = rel_parentIds[_sub];(function getAllParents(parent_id) {
					if (typeof rel_parentIds[parent_id] != 'undefined') {
						parentIds_list.push(rel_parentIds[parent_id]);
						var grandfather_id = rel_parentIds[parent_id];
						getAllParents(grandfather_id);
					}
				})(parent_id);
				rel_parentAllIds[_sub] = parentIds_list;
				sub = _sub;
			};

			for (var sub in rel_parentIds) {
				_loop3(sub);
			}

			return rel_parentAllIds;
		}
		//关系表 - 每个id的所有左树杈子孙元素id

	}, {
		key: 'childLeftBranchIds',
		value: function childLeftBranchIds() {
			var rel_childLeftBranchIds = {};
			var rel_childIds = this.childIds();

			var _loop4 = function _loop4(key) {
				rel_childLeftBranchIds[key] = [];
				if (rel_childIds[key].length > 0) {
					rel_childLeftBranchIds[key].push(rel_childIds[key]);
					var subkey = rel_childIds[key][0];(function firstChildIds(subkey) {
						if (typeof rel_childIds[subkey] != 'undefined') {
							if (rel_childIds[subkey].length > 0) {
								rel_childLeftBranchIds[key].push(rel_childIds[subkey]);
								var grandkey = rel_childIds[subkey][0];
								firstChildIds(grandkey);
							}
						}
					})(subkey);
				}
			};

			for (var key in rel_childIds) {
				_loop4(key);
			}

			return rel_childLeftBranchIds;
		}
	}]);

	return __TreeStore;
}();
//获取当前id所在item所有数据


__TreeStore.prototype.getData = function (id) {
	if (typeof id == 'undefined') {
		console.warn('id must not be null');
		return false;
	}
	//传入数组
	if (Array.isArray(id)) {
		var result = [];
		for (var i in id) {
			id[i] = this.idTestString(id[i]);
			result.push(this.dataInfo()[id[i]]);
		}
		return result;
	}
	//检测是否数字类型并转化
	id = this.idTestString(id);
	return this.dataInfo()[id];
};
//获取子元素ids
__TreeStore.prototype.getChildIds = function (id) {
	if (typeof id == 'undefined') {
		console.warn('id must not be null');
		return false;
	}
	//传入数组
	if (Array.isArray(id)) {
		var result = [];
		for (var i in id) {
			id[i] = this.idTestString(id[i]);
			result.push(this.childIds()[id[i]]);
		}
		return result;
	}
	//检测是否数字类型并转化
	id = this.idTestString(id);

	return this.childIds()[id];
};
//获取子孙元素ids
__TreeStore.prototype.getChildAllIds = function (id) {
	if (typeof id == 'undefined') {
		return this.childAllIds();
	}
	//传入数组
	if (Array.isArray(id)) {
		var result = [];
		for (var i in id) {
			id[i] = this.idTestString(id[i]);
			result.push(this.childAllIds()[id[i]]);
		}
		return result;
	}
	//检测是否数字类型并转化
	id = this.idTestString(id);

	return this.childAllIds()[id];
};
//获取所有祖父ids
__TreeStore.prototype.getParentAllIds = function (id) {
	if (typeof id == 'undefined') {
		console.warn('id must not be null');
		return false;
	}
	//传入数组
	if (Array.isArray(id)) {
		var result = [];
		for (var i in id) {
			id[i] = this.idTestString(id[i]);
			var list = this.parentAllIds()[id[i]] || [];
			result.push(list);
		}
		return result;
	}
	//检测是否数字类型并转化
	id = this.idTestString(id);
	return this.parentAllIds()[id] || [];
};
//所有左树杈ids
__TreeStore.prototype.getChildLeftBranchIds = function (id) {
	var _this = this;

	id = id || '';
	if (!/\S/.test(id)) {
		var _ret5 = function () {
			var ids = [[]];
			_this.data.forEach(function (item) {
				ids[0].push(item.id);
			});
			return {
				v: ids.concat(_this.childLeftBranchIds()[_this.data[0].id])
			};
		}();

		if ((typeof _ret5 === 'undefined' ? 'undefined' : _typeof(_ret5)) === "object") return _ret5.v;
	}
	//检测是否数字类型并转化
	id = this.idTestString(id);
	return this.childLeftBranchIds()[id];
};
//获取兄弟元素ids
__TreeStore.prototype.getSiblingIds = function (id) {
	var _this2 = this;

	var self = this;
	id = id || '';
	if (!/\S/.test(id) || typeof self.parentIds()[id] == 'undefined') {
		var _ret6 = function () {
			var list = [];
			_this2.data.forEach(function (item) {
				list.push(item.id);
			});
			return {
				v: list
			};
		}();

		if ((typeof _ret6 === 'undefined' ? 'undefined' : _typeof(_ret6)) === "object") return _ret6.v;
	}
	//检测是否数字类型并转化
	id = self.idTestString(id);
	return self.childIds()[self.parentIds()[id]];
};
//获取下拉框正确的选中id
__TreeStore.prototype.changeSelect = function (id) {
	var self = this;
	//检测是否数字类型并转化
	id = id || '';
	id = self.idTestString(id);
	var list = self.parentAllIds()[id] || [];
	list = list.reverse();
	list.push(id);
	var childList = self.childLeftBranchIds()[id] || [[]];
	childList.forEach(function (item) {
		list.push(item[0]);
	});
	return list;
};
//渲染级联下拉框
__TreeStore.prototype.renderSelect = function (settings) {
	var self = this;
	//检测checkIds必须为数组
	if (!Array.isArray(settings.checked)) {
		console.warn(settings.checked + 'must not be Array');
		return settings.checked;
	}
	//深复制checkIds
	var ids = JSON.parse(JSON.stringify(settings.checked));
	//遍历生成renderList
	var ids_list = [];
	ids.forEach(function (item, index) {
		item = self.idTestString(item);
		var sibling_ids = self.getSiblingIds(item) || [];
		var sibling_list = [];
		sibling_ids.forEach(function (sib_item) {
			sibling_list.push(self.dataInfo()[sib_item]);
		});
		ids_list.push(sibling_list);
	});
	//数据层数和级数不匹配时
	if (typeof settings.maxLength != 'undefined') {
		ids_list = ids_list.slice(0, settings.maxLength);
	}

	return ids_list;
};
//获取所有checked:true的id
__TreeStore.prototype.getChecked = function () {
	var ids = [];
	var rel_data_info = this.dataInfo();
	for (var i in rel_data_info) {
		if (rel_data_info[i].checked == true) {
			ids.push(rel_data_info[i].id);
		}
	}
	return ids;
};
//改变选中状态
__TreeStore.prototype.changeChecked = function (settings) {
	var _this3 = this;

	var data = this.data;
	var id = settings.id;
	var isChecked = settings.isChecked;
	var checkedIds = settings.checkedIds;
	// '1_1_1', true, [ '1' , '1_1' , '1_1_1' , '1_1_1_1' , '2' , '2_1' , '2_2' ]
	var result = {
		change: {
			unchecked_ids: [], //取消选中ids
			checked_ids: [] //选中ids
		},
		checked: []
	};
	if (isChecked) {
		(function () {
			//更新取消选中unchecked_ids并去除checked存在项
			var temp_ids = _this3.childAllIds()[id];
			temp_ids.push(id);
			var self = _this3
			//递归遍历所有需要去除的祖父ids
			;(function testParentChecked(id) {
				//找出除自己以外的兄弟ids
				var sibling_ids = [];
				var temp_sibling_ids = self.childIds()[self.parentIds()[id]] || [];
				var sibling_unchecked = temp_sibling_ids.length > 0 ? true : false; //判断兄弟ids是否是都取消状态
				// alert(temp_sibling_ids.length)
				if (temp_sibling_ids.length > 0) {
					//有兄弟ids
					temp_sibling_ids.forEach(function (item) {
						if (item != id) {
							sibling_ids.push(item);
						}
					});
					//判断兄弟ids是否是都取消状态
					checkedIds.forEach(function (item) {
						sibling_ids.forEach(function (sib_item) {
							if (item == sib_item) {
								sibling_unchecked = false;
							}
						});
					});
				}
				//兄弟ids都取消,则父元素取消
				if (sibling_unchecked) {
					var parent_id = self.parentIds()[id];
					temp_ids.push(parent_id);
					testParentChecked(parent_id);
				}
			})(id);

			result.change.unchecked_ids = temp_ids;

			//去除checked存在项
			checkedIds.forEach(function (item) {
				var unexist = true;
				temp_ids.forEach(function (sib_item) {
					if (item == sib_item) {
						unexist = false;
					}
				});
				if (unexist) {
					result.checked.push(item);
				}
			});
		})();
	} else {
		//添加选中checked_ids并去重checked
		var _temp_ids = this.childAllIds()[id];
		_temp_ids.push(id);
		_temp_ids = _temp_ids.concat(this.parentAllIds()[id]).sort();

		var temp_checked_ids = JSON.parse(JSON.stringify(checkedIds));
		temp_checked_ids = temp_checked_ids.concat(_temp_ids).sort();

		result.checked = require("uniq")(temp_checked_ids);

		result.change.checked_ids = _temp_ids;
	}
	return result;
};

function TreeStore(data, settings) {
	settings = settings || false;

	//深复制数据源
	var temp_data = JSON.parse(JSON.stringify(data));

	//数据key转换
	if (settings !== false) {
		var childName = settings.child || 'child';
		temp_data = TreeStore.treeMap(temp_data, childName, function (item) {
			for (var key in settings) {
				item[key] = item[settings[key]];
				delete item[settings[key]];
			}
			return item;
		});
	}

	settings = {
		data: temp_data //深复制数据源
	};

	return new __TreeStore(settings);
}

//拓展数据
TreeStore.extendChild = function (data, id, childData) {
	//检测是否数字类型并转化
	if (typeof id == 'number') {
		console.warn(id + ' is number , its should be set to string');
		id = id.toString();
	}
	if (!Array.isArray(childData)) {
		console.warn('childData must be Array');
		return;
	}
	;(function addData(data) {
		data.forEach(function (item) {
			if (Array.isArray(item.child)) {
				addData(item.child);
			}
			if (item.id == id) {
				if (Array.isArray(item.child)) {
					if (item.child.length > 0) {
						console.warn('The child properties of ' + item.id + ' is exist !');
					}
				}
				item.child = childData;
			}
		});
	})(data);
	return data;
};
//深层遍历
TreeStore.treeMap = function (data, childName, fn) {
	var temp_data = JSON.parse(JSON.stringify(data)) //深复制数据源
	;(function dataMap(temp_data) {
		temp_data.forEach(function (e) {
			if (Array.isArray(e[childName])) {
				dataMap(e[childName]);
			}
			fn(e);
		});
	})(temp_data);
	return temp_data;
};
//深层过滤
TreeStore.treeFilter = function (data, childName, fn) {
	var temp_data = JSON.parse(JSON.stringify(data)); //深复制数据源
	//深层递归过滤
	function filter(data, fn) {
		var deepFilter = function deepFilter(data, fn) {
			var output = [];
			data.map(function (item) {
				if (fn(item)) {
					if (Array.isArray(item[childName])) {
						item[childName] = deepFilter(item[childName], fn);
					}
					output.push(item);
				}
			});
			return output;
		};
		return deepFilter(data, fn);
	}
	var result_data = filter(temp_data, fn);

	return result_data;
};

module.exports = exports = TreeStore;