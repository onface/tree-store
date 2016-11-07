if (typeof TreeStore ==='undefined') {
    TreeStore = require('../index')
}
if (typeof expect ==='undefined') {
    expect = require('expect.js')
}

describe('TreeStore', function() {
    describe('Initial Tests', function() {
        it('TreeStore(data) 数据获取', function() {
        	var tree = TreeStore([
			    {
			        "id" : 1,
			        "name" : "name1",
			        "node" : [
			            {
			                "id" : 11,
			                "name" : "name11",
			                "node" : [
			                    {
			                        "id" : 111,
			                        "name" : "name111",
			                        "node" :  []
			                    }
			                ]
			            }
			        ]
			    },
			    {
			        "id" : 2,
			        "name" : "name2",
			        "node" : [
			            {
			                "id" : 21,
			                "name" : "name21",
			                "node" : []
			            }
			        ]
			    }
			])
        	expect(JSON.stringify(tree.data)).to.equal(JSON.stringify([
			    {
			        "id" : 1,
			        "name" : "name1",
			        "node" : [
			            {
			                "id" : 11,
			                "name" : "name11",
			                "node" : [
			                    {
			                        "id" : 111,
			                        "name" : "name111",
			                        "node" :  []
			                    }
			                ]
			            }
			        ]
			    },
			    {
			        "id" : 2,
			        "name" : "name2",
			        "node" : [
			            {
			                "id" : 21,
			                "name" : "name21",
			                "node" : []
			            }
			        ]
			    }
			]))
        })
        it('TreeStore(data,setting) 数据转换 (有id/child主key)', function() {
        	var tree = TreeStore([
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
			    }
			],{
				"id" : "value",
				"child" : "node"
			})
        	expect(JSON.stringify(tree.data)).to.equal(JSON.stringify([
			    {
			        "name" : "name1",
			        "id" : 1,
			        "child" : [
			            {
			                "name" : "name11",
			                "id" : 11,
			                "child" : [
			                    {
			                        "name" : "name111",
			                        "id" : 111,
			                        "child" :  []
			                    }
			                ]
			            }
			        ]
			    },
			    {
			        "name" : "name2",
			        "id" : 2,
			        "child" : [
			            {
			                "name" : "name21",
			                "id" : 21,
			                "child" : []
			            }
			        ]
			    }
			]))
        })
        it('TreeStore(data,setting) 数据转换 (elseKeyName)', function() {
        	var tree = TreeStore([
			    {
			        "id" : 1,
			        "name" : "name1",
			        "child" : [
			            {
			                "id" : 11,
			                "name" : "name11",
			                "else_check" : true ,
			                "child" : [
			                    {
			                        "id" : 111,
			                        "name" : "name111",
			                        "child" :  []
			                    }
			                ]
			            }
			        ]
			    },
			    {
			        "id" : 2,
			        "name" : "name2",
			        "else_check" : true ,
			        "child" : [
			            {
			                "id" : 21,
			                "name" : "name21",
			                "child" : []
			            }
			        ]
			    }
			],{
				"check" : "else_check",
			})
        	expect(JSON.stringify(tree.data)).to.equal(JSON.stringify([
			    {
			        "id" : 1,
			        "name" : "name1",
			        "child" : [
			            {
			                "id" : 11,
			                "name" : "name11",
			                "child" : [
			                    {
			                        "id" : 111,
			                        "name" : "name111",
			                        "child" :  []
			                    }
			                ],
			                "check" : true ,
			            }
			        ]
			    },
			    {
			        "id" : 2,
			        "name" : "name2",
			        "child" : [
			            {
			                "id" : 21,
			                "name" : "name21",
			                "child" : []
			            }
			        ],
			        "check" : true ,
			    }
			]))
        })
    })
    describe('Function Tests', function() {
        it('TreeStore.treeMap(data,childName,fn) 数据遍历', function() {
        	var tree = TreeStore.treeMap([
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
			    }
    		],'node',function ( item ) {
			    item.value = 'id'+item.value.toString()
			    return item
			})
        	expect(JSON.stringify(tree)).to.equal(JSON.stringify([
			    {
			        "value" : "id1",
			        "name" : "name1",
			        "node" : [
			            {
			                "value" : "id11",
			                "name" : "name11",
			                "node" : [
			                    {
			                        "value" : "id111",
			                        "name" : "name111",
			                        "node" :  []
			                    },
			                    {
			                        "value" : "id112",
			                        "name" : "name112",
			                        "node" :  []
			                    }
			                ]
			            }
			        ]
			    },
			    {
			        "value" : "id2",
			        "name" : "name2",
			        "node" : [
			            {
			                "value" : "id21",
			                "name" : "name21",
			                "node" : []
			            }
			        ]
			    }
			]))
        })
        it('TreeStore.treeFilter(data,childName,fn) 数据过滤', function() {
        	var tree = TreeStore.treeFilter([
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
			    }
    		],'node',function ( item ) {
			     return (!/2/g.test(item.value))
			})
        	expect(JSON.stringify(tree)).to.equal(JSON.stringify([
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
			    }
			]))
        })
        it('TreeStore.extendChild(data,id,childData) 数据拓展', function() {
        	var tree = TreeStore.extendChild([
			    {
			        "id" : 1,
			        "name" : "name1",
			        "child" : [
			            {
			                "id" : 11,
			                "name" : "name11",
			                "else_check" : true ,
			                "child" : [
			                    {
			                        "id" : 111,
			                        "name" : "name111",
			                        "child" :  []
			                    }
			                ]
			            }
			        ]
			    },
			    {
			        "id" : 2,
			        "name" : "name2",
			        "else_check" : true ,
			        "child" : [
			            {
			                "id" : 21,
			                "name" : "name21",
			                "child" : []
			            }
			        ]
			    }
			],'111',[
			    {
			        "id" : "1_1_2_1",
			        "text" : "text-1_1_2_1",
			    },
			    {
			        "id" : "1_1_2_2",
			        "text" : "text-1_1_2_2",
			    }
			])
        	expect(JSON.stringify(tree)).to.equal(JSON.stringify([
			    {
			        "id" : 1,
			        "name" : "name1",
			        "child" : [
			            {
			                "id" : 11,
			                "name" : "name11",
			                "else_check" : true ,
			                "child" : [
			                    {
			                        "id" : 111,
			                        "name" : "name111",
			                        "child" :  [
									    {
									        "id" : "1_1_2_1",
									        "text" : "text-1_1_2_1",
									    },
									    {
									        "id" : "1_1_2_2",
									        "text" : "text-1_1_2_2",
									    }
			                        ]
			                    }
			                ]
			            }
			        ]
			    },
			    {
			        "id" : 2,
			        "name" : "name2",
			        "else_check" : true ,
			        "child" : [
			            {
			                "id" : 21,
			                "name" : "name21",
			                "child" : []
			            }
			        ]
			    }
			]))
        })
    })
    describe('API Tests', function() {
    	var tree = TreeStore([
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
    	])
        it('TreeStore(data).getChildIds(String) - noChild', function() {
        	expect(JSON.stringify(tree.getChildIds('3'))).to.equal(JSON.stringify([]))
        })
        it('TreeStore(data).getChildIds(String) - existChild', function() {
        	expect(JSON.stringify(tree.getChildIds('1_1'))).to.equal(JSON.stringify(["1_1_1","1_1_2"]))
        })
        it('TreeStore(data).getChildIds(Array)', function() {
        	expect(JSON.stringify(tree.getChildIds(['1_1','2','3']))).to.equal(JSON.stringify([
        		["1_1_1","1_1_2"],
        		["2_1","2_2"],
        		[]
    		]))
        })
        it('TreeStore(data).getChildAllIds(String) - noDescendants', function() {
        	expect(JSON.stringify(tree.getChildAllIds('3'))).to.equal(JSON.stringify([ ]))
        })
        it('TreeStore(data).getChildAllIds(String) - existDescendants', function() {
        	expect(JSON.stringify(tree.getChildAllIds('1_1'))).to.equal(JSON.stringify(["1_1_1" , "1_1_2" , "1_1_1_1" , "1_1_1_2" ]))
        })
        it('TreeStore(data).getChildAllIds(Array)', function() {
        	expect(JSON.stringify(tree.getChildAllIds(['1_1','2','3']))).to.equal(JSON.stringify([
        		["1_1_1" , "1_1_2" , "1_1_1_1" , "1_1_1_2" ],
        		["2_1" , "2_2"],
        		[]
    		]))
        })
        it('TreeStore(data).getChildAllIds(null)', function() {
        	expect(JSON.stringify(tree.getChildAllIds())).to.equal(JSON.stringify({
				"1" : [ "1_1" , "1_2" , "1_1_1" , "1_1_2" , "1_1_1_1" , "1_1_1_2" , "1_2_1" , "1_2_2" ] ,
				"2" : [ "2_1" , "2_2" ] ,
				"3" : [] ,
				"1_1_1_1" : [] ,
				"1_1_1_2" : [] ,
				"1_1_1" : [ "1_1_1_1" , "1_1_1_2" ] ,
				"1_1_2" : [] ,
				"1_1" : [ "1_1_1" , "1_1_2" , "1_1_1_1" , "1_1_1_2" ] ,
				"1_2_1" : [] ,
				"1_2_2" : [] ,
				"1_2" : [ "1_2_1" , "1_2_2" ] ,
				"2_1" : [] ,
				"2_2" : []
        	}))
        })
        it('TreeStore(data).getData(String)', function() {
        	expect(JSON.stringify(tree.getData('1_1'))).to.equal(JSON.stringify({
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
        	}))
        })
        it('TreeStore(data).getData(Array)', function() {
        	expect(JSON.stringify(tree.getData(['3','2']))).to.equal(JSON.stringify([
			    {
			        "id" : "3",
			        "text" : "text-3",
			        "child" : []
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
			    }
        	]))
        })
        it('TreeStore(data).getParentAllIds(String) - noParent', function() {
        	expect(JSON.stringify(tree.getParentAllIds('2'))).to.equal(JSON.stringify([]))
        })
        it('TreeStore(data).getParentAllIds(String) - existParent', function() {
        	expect(JSON.stringify(tree.getParentAllIds('1_1_2'))).to.equal(JSON.stringify(["1_1" , "1"]))
        })
        it('TreeStore(data).getParentAllIds(Array)', function() {
        	expect(JSON.stringify(tree.getParentAllIds(['2','1_1_2']))).to.equal(JSON.stringify([
        		[],
        		["1_1" , "1"]
    		]))
        })
        it('TreeStore(data).getChildLeftBranchIds(String)', function() {
        	expect(JSON.stringify(tree.getChildLeftBranchIds('1'))).to.equal(JSON.stringify([
        		["1_1" , "1_2"],
        		["1_1_1" , "1_1_2"],
        		["1_1_1_1" , "1_1_1_2"]
    		]))
        })
        it('TreeStore(data).getChildLeftBranchIds(null)', function() {
        	expect(JSON.stringify(tree.getChildLeftBranchIds())).to.equal(JSON.stringify([
			    ["1","2","3"],
			    ["1_1","1_2"],
			    ["1_1_1","1_1_2"],
			    ["1_1_1_1","1_1_1_2"]
    		]))
        })
        it('TreeStore(data).getSiblingIds(String)', function() {
        	expect(JSON.stringify(tree.getSiblingIds('1_2'))).to.equal(JSON.stringify(["1_1" , "1_2"]))
        })
        it('TreeStore(data).getSiblingIds(null)', function() {
        	expect(JSON.stringify(tree.getSiblingIds())).to.equal(JSON.stringify(["1", "2", "3"]))
        })
    })
    describe('API-tree Tests', function() {
    	var tree = TreeStore([
		    {
		        "id" : "1",
		        "text" : "text-1",
                "checked":true,
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
		                "checked":true,
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
                "checked":true,
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
    	])
        it('TreeStore(data).getChecked()', function() {
        	expect(JSON.stringify(tree.getChecked())).to.equal(JSON.stringify(["1" , '2' , "1_1" , "1_1_1" , "1_1_1_1" , "1_2" , '2_1' ]))
        })
        it('TreeStore(data).changeChecked(Object) - isChecked(true)', function() {
        	expect(JSON.stringify(tree.changeChecked({
			    id : '1_1_1',
			    isChecked : true,
			    checkedIds : [ '1' , '1_1' , '1_1_1' , '1_1_1_1' , "1_2"  , '2' , '2_1' , '2_2' ]
        	}))).to.equal(JSON.stringify({
			    "change":{
			        "unchecked_ids":["1_1_1_1","1_1_1_2","1_1_1","1_1"],
			        "checked_ids":[]
			    },
			    "checked":[ '1' , '1_2' , '2' , '2_1' , '2_2' ]
			}))
        })
        it('TreeStore(data).changeChecked(Object) - isChecked(false)', function() {
        	expect(JSON.stringify(tree.changeChecked({
			    id : '1_2',
			    isChecked : false,
			    checkedIds : [ '1' , '1_1' , '1_1_1' , '1_1_1_1' , '2' , '2_1' , '2_2' ]
        	}))).to.equal(JSON.stringify({
			    "change":{
			        "unchecked_ids":[],
			        "checked_ids":["1" , "1_2" , "1_2_1" , "1_2_2"]
			    },
			    "checked":["1" , "1_1" , "1_1_1" , "1_1_1_1" , "1_2" , "1_2_1" , "1_2_2" , "2" , "2_1" , "2_2"]
			}))
        })
        it('TreeStore(data).changeChecked(Object) - autoLink(parent:false,child:false)', function() {
        	expect(JSON.stringify(tree.changeChecked({
			    id : '1_2',
			    isChecked : false,
			    checkedIds : [ '1' , '1_1' , '1_1_1' , '1_1_1_1' , '2' , '2_1' , '2_2' ],
			    autoLink:{
			    	parent:false,
			    	child:false,
			    }
        	}))).to.equal(JSON.stringify({
			    "change":{
			        "unchecked_ids":[],
			        "checked_ids":["1_2"]
			    },
			    "checked":[ "1" , "1_1" , "1_1_1" , "1_1_1_1" , "1_2" , "2" , "2_1" , "2_2" ],
			}))
        })
        it('TreeStore(data).changeChecked(Object) - autoLink(parent:false,child:true)', function() {
        	expect(JSON.stringify(tree.changeChecked({
			    id : '1_2',
			    isChecked : false,
			    checkedIds : [ '1_1' , '1_1_1' , '1_1_1_1' , '2' , '2_1' , '2_2' ],
			    autoLink:{
			    	parent:false,
			    	child:true,
			    }
        	}))).to.equal(JSON.stringify({
			    "change":{
			        "unchecked_ids":[],
			        "checked_ids":[ "1_2_1" , "1_2_2" ,"1_2" ]
			    },
			    "checked":["1_1" , "1_1_1" , "1_1_1_1" , "1_2" , "1_2_1" , "1_2_2" , "2" , "2_1" , "2_2"]
			}))
        })
        it('TreeStore(data).changeChecked(Object) - autoLink(parent:true,child:false)', function() {
        	expect(JSON.stringify(tree.changeChecked({
			    id : '1_2',
			    isChecked : false,
			    checkedIds : [ '1_1' , '1_1_1' , '1_1_1_1' , '2' , '2_1' , '2_2' ],
			    autoLink:{
			    	parent:true,
			    	child:false,
			    }
        	}))).to.equal(JSON.stringify({
			    "change":{
			        "unchecked_ids":[],
			        "checked_ids":["1" , "1_2" ]
			    },
			    "checked":[ '1' , '1_1' , '1_1_1' , '1_1_1_1' , "1_2" , '2' , '2_1' , '2_2' ]
			}))
        })
        it('TreeStore(data).changeChecked(Object) - autoLink(parent:true,child:true)', function() {
        	expect(JSON.stringify(tree.changeChecked({
			    id : '1_2',
			    isChecked : false,
			    checkedIds : [ '1_1'  , '1_1_1_1' , '2' , '2_1' , '2_2' ],
			    autoLink:{
			    	parent:false,
			    	child:false,
			    }
        	}))).to.equal(JSON.stringify({
			    "change":{
			        "unchecked_ids":[],
			        "checked_ids":["1_2"]
			    },
			    "checked":[ '1_1'  , '1_1_1_1' , '1_2', '2' , '2_1' , '2_2' ],
			}))
        })
    })
    describe('API-select Tests', function() {
    	var tree = TreeStore([
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
		                                "text" :  "text-1_1_1_1",
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
    	])
        it('TreeStore(data).changeSelect(String)', function() {
        	expect(JSON.stringify(tree.changeSelect('1_2'))).to.equal(JSON.stringify(["1", "1_2", "1_2_1"]))
        })
        it('TreeStore(data).renderSelect(Object) - checked', function() {
        	expect(JSON.stringify(tree.renderSelect({
			    checked :  ["1", "1_2", "1_2_1"] ,
			}))).to.equal(JSON.stringify([
	        	[
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
				                                "text" :  "text-1_1_1_1",
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
	        	],
	        	[
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
		                                "text" :  "text-1_1_1_1",
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
			]))
        })
    })
})
