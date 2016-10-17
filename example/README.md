# example

### 模板数据格式

````js
window.template_data  =  [
    {
        "id":"1",
        "text":"text-1",
        "child":[
            {
                "id":"1_1",
                "text":"text-1_1",
                "child":[
                    {
                        "id":"1_1_1",
                        "text":"text-1_1_1",
                        "child": [
                            {
                                "id": "1_1_1_1",
                                "text": "text-1_1_1_1"
                            },
                            {
                                "id": "1_1_1_2",
                                "text": "text-1_1_1_2"
                            }
                        ]
                    },
                    {
                        "id":"1_1_2",
                        "text":"text-1_1_2"
                    }
                ]
            },
            {
                "id":"1_2",
                "text":"text-1_2",
                "child":[
                    {
                        "id":"1_2_1",
                        "text":"text-1_2_1"
                    },
                    {
                        "id":"1_2_2",
                        "text":"text-1_2_2"
                    }
                ]
            }
        ]
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
            },
        ]
    },
    {
        "id":"3",
        "text":"text-3",
        "child":[]
    }
]
````
### 事例数据源

````js
window.template_dataattr = [
    {
        "value":1,
        "name":"name1",
        "node":[
            {
                "value":11,
                "name":"name11",
                "node":[
                    {
                        "value":111,
                        "name":"name111",
                        "node": [
                            {
                                "value":1111,
                                "name": "name1111"
                            },
                            {
                                "value":1112,
                                "name": "name1112"
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        "value":2,
        "name":"name2",
        "node":[
            {
                "value":21,
                "name":"name21",
                "node":[]
            },
            {
                "value":22,
                "name":"name22",
                "node":[]
            },
        ]
    },
    {
        "value":3,
        "name":"name3",
        "node":[]
    }
]
````

## 数据处理 
### 遍历 treeMap
<div id="data"></div>

````js
var treeMap = require('../lib/map.js')
var data = treeMap({
	data: template_dataattr,
	childName: 'node',
	map: function (item) {
		item.value = item.value.toString()
	}
})
    console.info('data')
    console.log(data)
````

### key转化 dataAttr
<div id="demo"></div>

````js
var TreeStore = require('../index.js')
var demo = new TreeStore({
	data:template_dataattr, //自定义数据
	dataAttr: { 
		id: 'value', //模板数据 id 对应 自定义数据的 value
		text: 'name', //模板数据 text 对应 自定义数据的 name 
		child: 'node' //模板数据 child 对应 自定义数据的 node
	}
})
    console.info('demo')
    console.log(demo)
````

## API
> 传入 id 如果是 number 也会被转换为string 
> 并且加上 github 链接说明

### 1. 获取id下一层的所有id: getChildIds(id) Array
> getChildIds("2")
<div id="demo1"></div>

````js
var TreeStore = require('../index.js')
var demo1 = new TreeStore({data:template_data})
document.getElementById('demo1').innerHTML = JSON.stringify(demo1.getChildIds("2"))
````

### 2. 获取id下所有层级的id: getAllChildIds(id) 
#### 2.1 有参数id时,当前id下所有层级的id
> getAllChildIds('1')
<div id="demo2_1"></div>

#### 2.2 没有参数id时,返回所有id下所有层级的id
> getAllChildIds()
<div id="demo2_2"></div>

````js
var TreeStore = require('../index.js')
var demo2 = new TreeStore({data:template_data})
document.getElementById('demo2_1').innerHTML = JSON.stringify(demo2.getAllChildIds('1'))
document.getElementById('demo2_2').innerHTML = JSON.stringify(demo2.getAllChildIds())
    console.info('demo2_2')
    console.log(demo2.getAllChildIds())
````

### 3. 获取当前id下所有数据: getData
#### 3.1 参数单独一个id: getData(id)
> getData('2')
<div id="demo3_1"></div>

#### 3.2 参数多个id: getData([id1,id2,...])
> getData(['3','2_1'])
<div id="demo3_2"></div>

````js
var TreeStore = require('../index.js')
var demo3 = new TreeStore({data:template_data})
document.getElementById('demo3_1').innerHTML = JSON.stringify(demo3.getData('2'))
    console.info('demo3_1')
    console.log(demo3.getData('2'))
document.getElementById('demo3_2').innerHTML = JSON.stringify(demo3.getData(['3','2_1']))
    console.info('demo3_2')
    console.log(demo3.getData(['3','2_1']))
````

### 4. 获取当前id的第一个父元素id: getParent String
> getParent('1_1_1_1')
<div id="demo4"></div>

````js
var TreeStore = require('../index.js')
var demo4 = new TreeStore({data:template_data})
document.getElementById('demo4').innerHTML = JSON.stringify(demo4.getParent('1_1_1_1'))
````

### 5. 获取当前id的所有父元素id: getAllParent(id) Array
> getAllParent('1_1_2')
<div id="demo5"></div>

````js
var TreeStore = require('../index.js')
var demo5 = new TreeStore({data:template_data})
document.getElementById('demo5').innerHTML = JSON.stringify(demo5.getAllParent('1_1_2'))
````

### 6. 获取当前id所对应的值: getValue(id) String
> getValue('1_1')
<div id="demo6"></div>

````js
var TreeStore = require('../index.js')
var demo6 = new TreeStore({data:template_data})
document.getElementById('demo6').innerHTML = JSON.stringify(demo6.getValue('1_1'))
````

### 7. 获取当前id的所有第一层子元素及首个子孙元素
#### 7.1 参数单独一个id: getFristChildIds(id) 返回 Array
> getFristChildIds('1_1')
<div id="demo7_1"></div>

#### 7.2 没有参数id时,默认取数据中第一层第一个id 返回 Array
> getFristChildIds()
<div id="demo7_2"></div>


````js
var TreeStore = require('../index.js')
var demo7 = new TreeStore({data:template_data})
document.getElementById('demo7_1').innerHTML = JSON.stringify(demo7.getFristChildIds('1_1'))
    console.info('demo7_1')
    console.log(demo7.getFristChildIds('1_1'))
document.getElementById('demo7_2').innerHTML = JSON.stringify(demo7.getFristChildIds())
    console.info('demo7_2')
    console.log(demo7.getFristChildIds())
````
