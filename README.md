# tree-store

> The methods of gaining valid data quickly based on the trees of data | 基于树形数据,能够快速获取有效数据的方法集

> 构建系统基于 https : //github.com/fast-flow/boot

- Online :  https : //fast-flow.github.io/tree-store/
- Other version :  https : //github.com/fast-flow/tree-store/releases

//filter

## 数据
> 所有id请保证唯一性,当 ID 出现重复时,组件会抛出错误
> **template.json** 是模块标准格式化数据

### 模板数据 标准格式

````js
window.template_data  =  [
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
                        "child" :  [
                            {
                                "id" :  "1_1_1_1",
                                "text" :  "text-1_1_1_1"
                            },
                            {
                                "id" :  "1_1_1_2",
                                "text" :  "text-1_1_1_2"
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
                "child" : []
            },
            {
                "id" : "2_2",
                "text" : "text-2_2",
                "child" : []
            },
        ]
    },
    {
        "id" : "3",
        "text" : "text-3",
        "child" : []
    }
]
````

### 事例数据源

````js
window.template_dataattr = [
    {
        "value" : 1,
        "name" : "name1",
        "node" : [
            {
                "value" : 11,
                "name" : "name11",
                "node" : [
                    {
                        "value" : 111,
                        "name" : "name111",
                        "node" :  []
                    }
                ]
            }
        ]
    },
    {
        "value" : 2,
        "name" : "name2",
        "node" : [
            {
                "value" : 21,
                "name" : "name21",
                "node" : []
            }
        ]
    },
    {
        "value" : 3,
        "name" : "name3",
        "node" : []
    }
]
````

## 数据处理

### 1. treeMap(Object)
> 提供map接口,可以遍历所有数据

|	name	|	type	|	description	|
|----|----|----|
| data	| object	|	数据源	|
|	childName|	string	|	下一层数据的key的命名	|
|	map	|	function	|	回调函数	|
|	filter	|	function	|	回调函数 ture 返回当前元素 ; false 不返回	|

````js
var treeMap = require('./lib/map.js')
var data = treeMap({
	data :  template_dataattr,
	childName :  'node',
	map :  function (item) {
		item.value = item.value.toString()
        return item
	},
	filter : function (item){
		return (/2/g.test(item.value))
	}
})
console.info(JSON.stringify(data))
/*	template_dataattr 数据中每个 value 转换成字符类型
[
    {
        "value" : "1",
        "name" : "name1",
        "node" : [
            {
                "value" : "11",
                "name" : "name11",
                "node" : [
                    {
                        "value" : "111",
                        "name" : "name111",
                        "node" :  []
                    }
                ]
            }
        ]
    },
    {
        "value" : "2",
        "name" : "name2",
        "node" : [
            {
                "value" : "21",
                "name" : "name21",
                "node" : []
            }
        ]
    },
    {
        "value" : "3",
        "name" : "name3",
        "node" : []
    }
]
*/
````
> 使用场景 :  有时候数据来源中 id/value 是 **number** 类型,而最终所需数据格式 id/value 应该为 **String**, 此时可以使用 treeMap() 遍历所有数据,自行回调处理

### 2. 基础使用

````js
var TreeStore = require('./index.js')
var demo = new TreeStore({
	data : template_data, //标准模板数据
})
````

### 3. dataAttr
> 将自定义数据的 key 和模板数据的 key 做绑定&数据转化成标准数据

````js
var TreeStore = require('./index.js')
var demo = new TreeStore({
	data : template_dataattr, //事例数据
	dataAttr :  { 
		id :  'value', //模板数据 id 对应 事例数据的 value
		text :  'name', //模板数据 text 对应 事例数据的 name 
		child :  'node' //模板数据 child 对应 事例数据的 node
	}
})
/*	事例数据经过处理后
[
    {
        "id" : "1",
        "text" : "name1",
        "child" : [
            {
                "id" : "11",
                "text" : "name11",
                "child" : [
                    {
                        "id" : "111",
                        "text" : "name111",
                        "child" :  []
                    }
                ]
            }
        ]
    },
    {
        "id" : "2",
        "text" : "name2",
        "child" : [
            {
                "id" : "21",
                "text" : "name21",
                "child" : []
            }
        ]
    },
    {
        "id" : "3",
        "text" : "name3",
        "child" : []
    }
]
*/
````
> 使用场景 : 项目数据已经成型,无法修改成模板标准数据时,可以使用 dataAttr 将数据转化成标准数据

## API
> 传入 id 如果是 number 也会被转换为string 
> 事例 :  https://github.com/fast-flow/tree-store/tree/master/example

### getChildIds(String)
> 获取id下一层的所有id

````js
var TreeStore = require('./index.js')
var demo1 = new TreeStore({
	data : template_data
})
console.log(demo1.getChildIds("2"))
//	["2_1","2_2"]
````
> 使用场景 : 操作第一级下拉框某一项时可以获取当前项的ID, 利用 `getChildIds()` 可快速找出下一层子元素id, 可以立即获取第二级下拉框需要元素, 配合 `getValue()` 完成显示内容的渲染

### getAllChildIds(String/Null) 
> 获取id下所有层级子孙元素 id 
>* 有参数 id 时,当前 id 下所有层级的子孙元素 id 
>* 没有参数id时,返回所有 id 下所有层级的子孙元素 id , 返回类型 object 


````js
var TreeStore = require('./index.js')
var demo2 = new TreeStore({
	data : template_data
})
console.log(demo2.getAllChildIds('1'))
//	["1_1","1_2","1_1_1","1_1_2","1_1_1_1","1_1_1_2","1_2_1","1_2_2"]
console.log(demo2.getAllChildIds())
/*
{
	"1":["1_1","1_2","1_1_1","1_1_2","1_1_1_1","1_1_1_2","1_2_1","1_2_2"],
	"2":["2_1","2_2"],
	"3":[],
	"1_1":["1_1_1","1_1_2","1_1_1_1","1_1_1_2"],
	"1_1_1":["1_1_1_1","1_1_1_2"],
	"1_1_2":[],
	"1_2":["1_2_1","1_2_2"],
	"2_1":[],
	"2_2":[]
}
*/
````
> 使用场景 : 操作某一项时可以获取当前项的ID, 利用 `getAllChildIds()` 可快速找出所有子孙元素id, 对这些子元素做全选或反选操作, 配合 `getValue()` 完成显示内容的渲染

### getData(String/Array)
> 获取当前 id 的所有数据
>* 参数单独一个id : getData(id)

>* 参数多个id : getData([id1,id2,...])

````js
var TreeStore = require('./index.js')
var demo3 = new TreeStore({
	data : template_data
})
console.log(demo3.getData('2'))
/*
{
	"id":"2",
	"text":"text-2",
	"child":[
		{
			"id":"2_1",
			"text":"text-2_1",
			"child":[]
		},
		{
			"id":"2_2",
			"text":"text-2_2",
			"child":[]
		}
	]
}
*/
console.log(demo3.getData(['3','2']))
/*
[
	{
		"id":"3",
		"text":"text-3",
		"child":[]
	},
	{
		"id":"2",
		"text":"text-2",
		"child":[
			{
				"id":"2_1",
				"text":"text-2_1",
				"child":[]
			},
			{
				"id":"2_2",
				"text":"text-2_2",
				"child":[]
			}
		]
	}
]
*/
````
> 使用场景 : 获取某项/某些项的ID时,可以利用 `getData()` 得到当前ID的其他数据,前提是你有其他数据
> 区分 : `getValue()` 只会得到ID对应的TEXT ; `getData()` 会得到ID所在的所有数据,包括TEXT,CHILD,...甚至ID本身

### getParent(String)
> 获取当前id的第一个最近父元素id 

````js
var TreeStore = require('./index.js')
var demo4 = new TreeStore({
	data : template_data
})
console.log(demo4.getParent('1_1_1_1'))
// "1_1_1"
````

### getAllParent(String)
> 获取当前id的所有祖父元素id

````js
var TreeStore = require('./index.js')
var demo5 = new TreeStore({
	data : template_data
})
console.log(demo5.getAllParent('1_2'))
// ["1_1","1"]
````
> 使用场景 : 对某一列某一项进行操作时, 可以获取当前项的ID, 此列有选择/全反选时, 利用 `getAllParent()` 可以快速获取所有祖父元素, 进行相应关联状态的改变


### getValue(String)
> 获取当前 id 所对应的 text 值

````js
var TreeStore = require('./index.js')
var demo6 = new TreeStore({
	data : template_data
})
console.log(demo6.getValue('1_1'))
// "text-1_1"
````
> 使用场景 : 操作某一项时可以获取当前项的ID, 利用 `getValue()` 方法获取其显示内容text, 将显示内容(重新)渲染出来

### getFristChildIds(String)
> 获取当前id的所有第一层子元素及首个子孙元素
>* 没有参数id时,默认取数据中第一层第一个id (当前模板数据中 第一层第一个id是 "1")

````js
var TreeStore = require('./index.js')
var demo7 = new TreeStore({
	data : template_data
})
console.log(demo7.getFristChildIds('1_1'))
/*
[
	["1_1_1","1_1_2"],
	["1_1_1_1","1_1_1_2"]
]
*/
console.log(demo7.getFristChildIds())
/*
[
	["1_1","1_2"],
	["1_1_1","1_1_2"],
	["1_1_1_1","1_1_1_2"]
]
*/
````
> 使用场景 : 在级联下拉框中, 操作某一项时可以获取当前项的ID, 利用 `getFristChildIds()` 方法可以快速获取后几级下拉框的默认渲染选项, 防止在无值时下拉框都是空白现象

## 参与开发 - development

```shell
npm i -g fis3 --registry=https : //registry.npm.taobao.org
# 安装依赖
npm run dep
# 服务器
npm run s
# 开发
npm run dev


# 构建 gh-pages 版本 到 output/
npm run gh
# 将 output/** 发布到 gh-pages 分支
npm run gh-push
# 构建 npm 要发布的代码到 output/
npm run npm
```

> For npm owner :  npm publish Need to be in ./output
