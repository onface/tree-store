# tree-store

> The methods of gaining valid data quickly based on the trees of data | 基于树形数据,能够快速获取有效数据的方法集



<!--MARKRUN-HTML
<iframe src="https://ghbtns.com/github-btn.html?user=fast-flow&repo=tree-store&type=star&count=true" frameborder="0" scrolling="0" width="100px" height="30px"></iframe>
<iframe src="https://ghbtns.com/github-btn.html?user=fast-flow&repo=tree-store&type=watch&count=true&v=2" frameborder="0" scrolling="0" width="100px" height="30px">
-->

[🔗 Live demo](https://fast-flow.github.io/tree-store/)  
[🕐 Releases](https://github.com/fast-flow/tree-store/releases)

[![Build Status](https://api.travis-ci.org/fast-flow/tree-store.svg)](https://travis-ci.org/fast-flow/tree-store) [![NPM version](https://img.shields.io/npm/v/tree-store.svg?style=flat)](https://npmjs.org/package/tree-store) [![NPM downloads](http://img.shields.io/npm/dm/tree-store.svg?style=flat)](https://npmjs.org/package/tree-store)



## 数据
> 所有id请保证唯一性,当 ID 出现重复时,组件会抛出错误
> **template_data** 是模块标准格式化数据

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

### 示例数据源

````js
window.template_data_attr = [
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
                    },
                    {
                        "value" : 112,
                        "name" : "name112",
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
>### **注 : 所有的方法或API调用都不会直接对数据源进行任何改变**

### 1. TreeStore.treeMap(data,childName,fn)
> 可以遍历所有数据, 在 `fn(item)` 需要 `return item`

|	name	|	type	|	description	|
|----|----|----|
| data	| Object	|	数据源	|
|	childName|	String	|	下一层数据的key的命名	|
|	fn	|	function	|	回调函数	|

````js
var TreeStore = require('tree-store') ;
var data1 = TreeStore.treeMap( template_data_attr , 'node' , function ( item ) {
    item.value = 'id'+item.value.toString()
    return item
})
console.log(data1)
/*	template_data_attr 数据中每个 value 转换成字符类型 并添加id前缀
[
    {
        "value": "id1",
        "name": "name1",
        "node": [
            {
                "value": "id11",
                "name": "name11",
                "node": [
                    {
                        "value": "id111",
                        "name": "name111",
                        "node": []
                    },
                    {
                        "value" : 'id112',
                        "name" : "name112",
                        "node" :  []
                    }
                ]
            }
        ]
    },
    {
        "value": "id2",
        "name": "name2",
        "node": [
            {
                "value": "id21",
                "name": "name21",
                "node": []
            }
        ]
    },
    {
        "value": "id3",
        "name": "name3",
        "node": []
    }
]
*/
````
> 使用场景 :  有时候数据来源中 id/value 是 **number** 类型,而最终所需数据格式 id/value 应该为 **String**, 此时可以使用 treeMap() 遍历所有数据,自行回调处理


### 2. TreeStore.treeFilter(data,childName,fn)
> 遍历所有数据进行过滤, 在 `fn()` 需要 `return Boolean`

|   name    |   type    |   description |
|----|----|----|
| data  | Object    |   数据源 |
|   childName|  String  |   下一层数据的key的命名    |
|    fn  |   Function    |   回调函数 ( ture 返回当前元素 ; false 不返回当前元素 )   |

````js
var TreeStore = require('tree-store') ;
var data2 = TreeStore.treeFilter(template_data_attr,'node',function (item){
    return (!/2/g.test(item.value))
})
console.log(data2)
/*  template_data_attr 数据中每个 value 中匹配到`2`的都过滤掉
[
    {
        "value": 1,
        "name": "name1",
        "node": [
            {
                "value": 11,
                "name": "name11",
                "node": [
                    {
                        "value": 111,
                        "name": "name111",
                        "node": []
                    }
                ]
            }
        ]
    },
    {
        "value": 3,
        "name": "name3",
        "node": []
    }
]
*/
````

### 3. TreeStore(data)
>#### *基础使用*
> 数据源 需要符合两个条件
>* 3.1 数据格式一致
>* 3.2 三个主要**key**的命名一致: **id** **child**

>#### *返回一个实例*
>* 数据被存放在属性data中,请不要自行操作data

````js
var TreeStore = require('tree-store') ;
var data3 = TreeStore(template_data)
````

### 4. TreeStore(data,setting)
>#### *数据的转化*

```
TreeStore(data,{
    //模板数据 keyName 对应 示例数据的 DemokeyName
    keyName :  DemokeyName,
    keyName2 :  DemokeyName2 ,
    ...
})
```

> 倘若, 示例数据在 上述条件 只满足 3.1
> 那么, 将示例数据的 key 和模板数据的 key 做绑定
>##### 注:不会直接对示例数据源进行操作

````js
var TreeStore = require('tree-store') ;
var data4 = TreeStore(template_data_attr,{
    //模板数据 id 对应 示例数据的 value
    id :  'value',
    //模板数据 child 对应 示例数据的 node
    child :  'node' ,
})
console.log(data4.data)
/*	示例数据经过处理后
[
    {
        "id": 1,
        "name": "name1",
        "child": [
            {
                "id": 11,
                "name": "name11",
                "child": [
                    {
                        "id": 111,
                        "name": "name111",
                        "child": []
                    },
                    {
                        "id" : 112,
                        "name" : "name112",
                        "child" :  []
                    }
                ]
            }
        ]
    },
    {
        "id": 2,
        "name": "name2",
        "child": [
            {
                "id": 21,
                "name": "name21",
                "child": []
            }
        ]
    },
    {
        "id": 3,
        "name": "name3",
        "child": []
    }
]
*/
````
> 使用场景 : 项目数据已经成型,无法修改成模板标准数据时,添加第二个参数 将数据转化成标准数据


### 5. TreeStore.extendChild(data,id,childData)
> 将数组 `childData` 设置为某个 id 的 `child` 属性

|   name    |   type    |   description |
|----|----|----|
| data  | Array    |   数据源  |
| id  | String    |   某个id  |
|   childData  |  Array  |   将设置为child的数据    |

````js
var TreeStore = require('tree-store') ;
var data5 = TreeStore.extendChild(template_data,'1_1_2',[
    {
        id:'1_1_2_1',
        text:'text-1_1_2_1',
    },
    {
        id:'1_1_2_2',
        text:'text-1_1_2_2',
    }
])
console.log(data5)
/*
[
    {
        "id": "1",
        "text": "text-1",
        "child": [
            {
                "id": "1_1",
                "text": "text-1_1",
                "child": [
                    {
                        "id": "1_1_1",
                        "text": "text-1_1_1",
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
                        "id": "1_1_2",
                        "text": "text-1_1_2",
                        "child": [
                            {
                                "id": "1_1_2_1",
                                "text": "text-1_1_2_1"
                            },
                            {
                                "id": "1_1_2_2",
                                "text": "text-1_1_2_2"
                            }
                        ]
                    }
                ]
            },
            {
                "id": "1_2",
                "text": "text-1_2",
                "child": [
                    {
                        "id": "1_2_1",
                        "text": "text-1_2_1"
                    },
                    {
                        "id": "1_2_2",
                        "text": "text-1_2_2"
                    }
                ]
            }
        ]
    },
    {
        "id": "2",
        "text": "text-2",
        "child": [
            {
                "id": "2_1",
                "text": "text-2_1",
                "child": []
            },
            {
                "id": "2_2",
                "text": "text-2_2",
                "child": []
            }
        ]
    },
    {
        "id": "3",
        "text": "text-3",
        "child": []
    }
]
*/
````

## API
> 传入 id 如果是 number 也会被转换为string
> 事例 :  https://github.com/fast-flow/tree-store/tree/master/example

### TreeStore(data).getChildIds(String/Array)
> 获取id下一层的所有子元素id

````js
var TreeStore = require('tree-store') ;
var demo1 = TreeStore(template_data)
console.log(demo1.getChildIds("2"))
//	["2_1","2_2"]
console.log(demo1.getChildIds(["1_2","2"]))
/*
[
    ["1_2_1","1_2_2"],
    ["2_1","2_2"]
]
*/
````
> 使用场景 : 操作第一级下拉框某一项时可以获取当前项的ID, 利用 `getChildIds()` 可快速找出下一层子元素id, 可以立即获取第二级下拉框需要元素, 配合 `getData()` 完成显示内容的渲染

### TreeStore(data).getChildAllIds(String/Array/null)
> 获取id下所有层级子孙元素 id
>* 有参数 id 时,当前 id 下所有层级的子孙元素 id
>* 没有参数id时,返回所有 id 下所有层级的子孙元素 id , 返回类型 object


````js
var TreeStore = require('tree-store') ;
var demo2 = TreeStore(template_data)
console.log( demo2.getChildAllIds('1') )
//	["1_1","1_2","1_1_1","1_1_2","1_1_1_1","1_1_1_2","1_2_1","1_2_2"]
console.log( demo2.getChildAllIds( [ '1_2' , '1_1_1' ] ) )
/*
[
    ["1_2_1","1_2_2"],
    ["1_1_1_1","1_1_1_2"]
]
*/
console.log( demo2.getChildAllIds() )
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
> 使用场景 : 操作某一项时可以获取当前项的ID, 利用 `getChildAllIds()` 可快速找出所有子孙元素id, 对这些子元素做全选或反选操作, 配合 `getData()` 完成显示内容的渲染

### TreeStore(data).getData(String/Array)
> 获取当前 id 的所有数据 , 包括TEXT,CHILD,...甚至ID本身
>* 参数单独一个id : getData(id)
>* 参数多个id : getData([id1,id2,...])

````js
var TreeStore = require('tree-store') ;
var demo3 = TreeStore(template_data)
console.log(demo3.getData('2'))
/*
{
    "id": "2",
    "text": "text-2",
    "child": [
        {
            "id": "2_1",
            "text": "text-2_1",
            "child": []
        },
        {
            "id": "2_2",
            "text": "text-2_2",
            "child": []
        }
    ]
}
*/
console.log(demo3.getData(['3','2']))
/*
[
    {
        "id": "3",
        "text": "text-3",
        "child": []
    },
    {
        "id": "2",
        "text": "text-2",
        "child": [
            {
                "id": "2_1",
                "text": "text-2_1",
                "child": []
            },
            {
                "id": "2_2",
                "text": "text-2_2",
                "child": []
            }
        ]
    }
]
*/
````
> 使用场景 : 获取某项/某些项的ID时,可以利用 `getData()` 得到当前ID的其他数据,前提是你有其他数据

### TreeStore(data).getParentAllIds(String/Array)
> 获取当前id的所有祖父元素id
> Tip : 获取当前id的第一个最近父元素id,可以试试 `getParentAllIds(id)[0]`

````js
var TreeStore = require('tree-store') ;
var demo4 = TreeStore(template_data)
console.log(demo4.getParentAllIds('1_1_2'))
// ["1_1","1"]
console.log(demo4.getParentAllIds( [ '1_1_1_1' , '2_1' ] ) )
/*
[
    ["1_1_1","1_1","1"],
    ["2"]
]
*/
````
> 使用场景 : 对某一列某一项进行操作时, 可以获取当前项的ID, 此列有选择/全反选时, 利用 `getParentAllIds()` 可以快速获取所有祖父元素, 进行相应关联状态的改变


### TreeStore(data).getChildLeftBranchIds(String/null)
> 获取当前id的所有第一层子元素及首个子孙元素(即 此id的子元素 并 取左叉树的子元素id为新的id 取其子元素 以此类推)
>* 没有参数id时,所有元素及首个子孙元素

````js
var TreeStore = require('tree-store') ;
var demo6 = TreeStore(template_data)
console.log(demo6.getChildLeftBranchIds('1_1'))
/*
[
    ["1_1_1","1_1_2"],
    ["1_1_1_1","1_1_1_2"]
]
*/
console.log(demo6.getChildLeftBranchIds())
/*
[
    ["1","2","3"],
    ["1_1","1_2"],
    ["1_1_1","1_1_2"],
    ["1_1_1_1","1_1_1_2"]
]
*/
````
> 使用场景 : 在级联下拉框中, 操作某一项时可以获取当前项的ID, 利用 `getChildLeftBranchIds()` 方法可以快速获取后几级下拉框的默认渲染选项, 防止在无值时下拉框都是空白现象

### TreeStore(data).getSiblingIds(String/null)
> 获取当前id的所有兄弟元素id(包括当前id本身)
>* 没有参数id时,默认取数据的第一层所有id(多此一举,不建议调用此API传空值)
>* 传入数组时,如遇id是空字符串,则直接返回空数组

````js
var TreeStore = require('tree-store') ;
var demo7 = TreeStore(template_data)
console.log(demo7.getSiblingIds('1_1'))
// ["1_1","1_2"]
console.log(demo7.getSiblingIds())
// ["1", "2", "3"]
````
> 使用场景 : 在下拉框中, 有默认值时, 利用 `getSiblingIds()` 方法可以快速渲染出对应下拉框选项

## API--之树形业务
> 为什么将下面两个API独立出来?
> 因为它是对已有的API进行再次封装,使树形业务场景中的数据操作更简便

### 示例数据--之树形业务
> 相比之 模板数据 , 示例数据 添加了一个checked属性, 但不要求你的数据源必须有此属性


````js
window.template_data_tree  =  [
    {
        "id" : "1",
        "text" : "text-1",
        "child" : [
            {
                "id" : "1_1",
                "text" : "text-1_1",
                "checked":true,
                "child" : [
                    {
                        "id" : "1_1_1",
                        "text" : "text-1_1_1",
                        "checked":true,
                        "child" :  [
                            {
                                "id" :  "1_1_1_1",
                                "text" :  "text-1_1_1_1",
                                "checked":true,
                            },
                            {
                                "id" :  "1_1_1_2",
                                "text" :  "text-1_1_1_2",
                                "checked":true,
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
                "checked":true,
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

### TreeStore(data).getChecked()
> 找出数据源中所有checked属性为true的id并返回
> 此API使用前提 : 数据中有checked属性

````js
var TreeStore = require('tree-store') ;
var demo8 = TreeStore(template_data_tree).getChecked()
console.log(demo8)
// ["1_1","1_1_1","1_1_1_1","1_1_1_2","2_1"]
````

### TreeStore(data).changeChecked(Object)
> 改变任一id的选中状态,可以返回计算后的所有选中id
> 默认是父子都关联状态(即 id状态改变,其祖父id及子孙id跟随改变) [待开发]

```
treeStore( data ).changeChecked( {
    id : id,
    isChecked : Boolean ,
    checkedIds : [ id1 , id2 , ... ] ,
    type : {
        linkParent : true,
        linkchild : true
    }
} )
```

|    name   |   type    |    description   |
|------|------|------|
|    id   |    String   |   当前操作的id    |
|    isChecked   |    Boolean   |   当前操作id的是否选中状态(change前一刻状态)    |
|    checkedIds   |    Array   |    当前已选中的所有ID   |

````js
var TreeStore = require('tree-store') ;
var demo9 = TreeStore(template_data_tree).changeChecked({
    id : '1_1_1',
    isChecked : true,
    checkedIds : [ '1' , '1_1' , '1_1_1' , '1_1_1_1' , '2' , '2_1' , '2_2' ]
})
console.log(demo9)
/*
{
    "change":{
        "unchecked_ids":["1_1_1_1","1_1_1_2","1_1_1","1_1","1"],
        "checked_ids":[]
    },
    "checked":["2","2_1","2_2"]
}
*/
var demo10 = TreeStore(template_data_tree).changeChecked({
    id : '1_1_1',
    isChecked : false,
    checkedIds : [ '1' , '1_1' , '1_1_1' , '1_1_1_1' , '2' , '2_1' , '2_2' ]
})
console.log(demo10)
/*
{
    "change":{
        "unchecked_ids":[],
        "checked_ids":["1","1_1","1_1_1","1_1_1_1","1_1_1_2"]
    },
    "checked":["1","1_1","1_1_1","1_1_1_1","1_1_1_2","2","2_1","2_2"]
}
*/
````

## API--之级联下拉框
> 为什么将以下API独立出来?
> 因为它是对已有的API进行再次封装,使在级联下拉框业务场景中的数据操作更简便

### TreeStore(data).changeSelect(String)
> 根据传入的 id ,返回正确的选中id数组

````js
var TreeStore = require('tree-store') ;
var demo11 = TreeStore(template_data).changeSelect('1_2')
console.log(demo11)
// ["1", "1_2", "1_2_1"]
````


### TreeStore(data).renderSelect(Object)
> 返回当前所有下拉框渲染的数据

```
TreeStore( data ).renderSelect( {
    maxLength : Number,
    checked : [ id1 , id2 , ... ] ,
} )
```

|    name   |    type   |   description    |
|------|------|------|
|    maxLength   |    Number   |    返回结果数组的最长长度(即 渲染的下拉框最多个数) , 此参数可省略  |
|    checked   |    Array   |    已选中的id ( 传入数组长度,需要与渲染的级联下拉框个数相同,没有默认值id时,请传空字符串,保证数组长度 )   |


````js
var TreeStore = require('tree-store') ;
var demo12 = TreeStore(template_data).renderSelect({
    checked : ["1", "1_2", "1_2_1"] ,
})
console.log(demo12)
/*
[
        [
                {
                    "id" : "1",
                    "text" : "text-1",
                    "child" : [...]  //...是child中所有数据,为了更直观看到返回的数据结构,文档将其省略
                },
                {
                    "id" : "2",
                    "text" : "text-2",
                    "child" : [...]  //...是child中所有数据,为了更直观看到返回的数据结构,文档将其省略
                },
                {
                    "id" : "3",
                    "text" : "text-3",
                    "child" : []
                }
        ],
                [
                {
                    "id" : "1_1",
                    "text" : "text-1_1",
                    "child" : [...]  //...是child中所有数据,为了更直观看到返回的数据结构,文档将其省略
                },
                {
                    "id" : "1_2",
                    "text" : "text-1_2",
                    "child" : [...]  //...是child中所有数据,为了更直观看到返回的数据结构,文档将其省略
                }
        ],
        [
                {
                    "id" : "1_2_1",
                    "text" : "text-1_2_1"
                },
                {
                    "id" : "1_2_2",
                    "text" : "text-1_2_2"
                }
        ]
]
*/
````

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
