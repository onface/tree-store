# tree-store

> The methods of gaining valid data quickly based on the trees of data | 基于树形数据,能够快速获取有效数据的方法集

> 构建系统基于 https://github.com/fast-flow/tree-store

- Online: https://fast-flow.github.io/tree-store/
- Other version: https://github.com/fast-flow/tree-store/releases


## 数据
> 所有id请保证唯一性,当 ID 出现重复时,组件会抛出错误
> **template.json** 是模块标准格式化数据

### 1. TreeMap提供map接口,可以遍历所有数据
> 有时候数据来源中 id/value 是 number 类型,而最终所需数据格式 id/value 应该为 String, 此时可以使用 mapAll 转换数据

````js
var TreeMap = require('./lib/map.js')
var template_dataattr = __inline('./example/template_dataattr.json');
var data = TreeMap({
	data: template_dataattr,
	childName: 'node',
	map: function (item) {
		item.value = item.value.toString()
	}
})
````

### 2. 数据名和模板数据不一致时可做数据名转化

````js
var TreeStore = require('./index.js')
var template_dataattr = __inline('./example/template_dataattr.json');
var demo = new TreeStore({
	data:template_dataattr, //自定义数据
	dataAttr: { 
		id: 'value', //模板数据 id 对应 自定义数据的 value
		text: 'name', //模板数据 text 对应 自定义数据的 name 
		child: 'node' //模板数据 child 对应 自定义数据的 node
	}
})
````

## API
> 传入 id 如果是 number 也会被转换为string 
> 并且加上 github 链接说明

### 1. 获取id下一层的所有id: getChildIds(id) Array
> getChildIds("2")
<div id="demo1"></div>

````js
var TreeStore = require('./index.js')
var template = __inline('./example/template.json');
var demo1 = new TreeStore({data:template})
document.getElementById('demo1').innerHTML = JSON.stringify(demo1.getChildIds("2"))
````

### 2. 获取id下所有层级的id: getAllChildIds(id) 
#### 2.1 有参数id时,当前id下所有层级的id Array
> getAllChildIds('1')
<div id="demo2_1"></div>

#### 2.2 没有参数id时,返回所有 object
> getAllChildIds()
<div id="demo2_2"></div>

````js
var TreeStore = require('./index.js')
var template = __inline('./example/template.json');
var demo2 = new TreeStore({data:template})
document.getElementById('demo2_1').innerHTML = JSON.stringify(demo2.getAllChildIds('1'))
document.getElementById('demo2_2').innerHTML = JSON.stringify(demo2.getAllChildIds())
````

### 3. 获取当前id下所有数据: getData
#### 3.1 参数单独一个id: getData(id)	返回 object
> getData('1')
<div id="demo3_1"></div>

#### 3.2 参数多个id: getData([id1,id2,...])	返回	Array
> getData(['1','2_1'])
<div id="demo3_2"></div>

````js
var TreeStore = require('./index.js')
var template = __inline('./example/template.json');
var demo3 = new TreeStore({data:template})
document.getElementById('demo3_1').innerHTML = JSON.stringify(demo3.getData('1'))
document.getElementById('demo3_2').innerHTML = JSON.stringify(demo3.getData(['1','2_1']))
````

### 4. 获取当前id的第一个父元素id: getParent String
> getParent('1_1_1_1')
<div id="demo4"></div>

````js
var TreeStore = require('./index.js')
var template = __inline('./example/template.json');
var demo4 = new TreeStore({data:template})
document.getElementById('demo4').innerHTML = JSON.stringify(demo4.getParent('1_1_1_1'))
````

### 5. 获取当前id的所有父元素id: getAllParent(id) Array
> getAllParent('1_2')
<div id="demo5"></div>

````js
var TreeStore = require('./index.js')
var template = __inline('./example/template.json');
var demo5 = new TreeStore({data:template})
document.getElementById('demo5').innerHTML = JSON.stringify(demo5.getAllParent('1_2'))
````

### 6. 获取当前id所对应的值: getValue(id) String
> getValue('1_1')
<div id="demo6"></div>

````js
var TreeStore = require('./index.js')
var template = __inline('./example/template.json');
var demo6 = new TreeStore({data:template})
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
var TreeStore = require('./index.js')
var template = __inline('./example/template.json');
var demo7 = new TreeStore({data:template})
document.getElementById('demo7_1').innerHTML = JSON.stringify(demo7.getFristChildIds('1_1'))
document.getElementById('demo7_2').innerHTML = JSON.stringify(demo7.getFristChildIds())
````

## 参与开发 - development

```shell
npm i -g fis3 --registry=https://registry.npm.taobao.org
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

> For npm owner: npm publish Need to be in ./output
