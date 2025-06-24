---
layout: post
title: "ElasticSearch业务逻辑案例"
date: 2017-05-03
author: 大头
desc: "ElasticSearch业务逻辑案例..."
categories: ["数据库"]
tags: ["database","Elasticsearch"]
permalink: "/database/elastic-case.html"
--- 

# ElasticSearch业务逻辑案例

# 一.业务难题

我们有一个索引: `myindex/mytype`(为了方便,我们下文以`a/b`表示)

索引类型中的一个字段`group`之前是`a.b.c`(历史遗留问题), 我们查询是这样的:

```json
POST 127.0.0.1:9200/a/b/_search
{
	"query": {
		"constant_score": {
			"filter": {
				"bool": {
					"must": [
						{
							"regexp": {
								"group": "a.b.*"
							}
						}
					]
				}
			}
		}
	},
	"highlight": {
		"fields": {
			"*": {}
		}
	},
	"_source": {
		"include": [
			"group"
		]
	}
}
```

正则查询比较慢! 我们希望能够兼容之前查询, 并且优化它.

# 二.分析

我们分析了三种数据类型的区别, 在ES5中, 出现了两种数据类型`text`和`keyword`

ES5中的"text"相当于ES2中的"string", 而"keyword"相当于"text", 但分析器不进行分词索引, 等价于index设置为`not_analyze`

index这个参数可以控制字段应该怎样建索引，怎样查询。它有以下三个可用值：

1· `no`: 不把此字段添加到索引中，也就是不建索引，此字段不可查询
2· `not_analyze`:将字段的原始值放入索引中，作为一个独立的term，它是除string字段以外的所有字段的默认值。 ES5.0 type keyword使用这种
3· `analyzed`:string字段的默认值，会先进行分析后，再把分析的term结果存入索引中。

因为索引一旦建立, 就不能修改字段属性了, 所以我们要新建索引, 并且找时间进行迁移. 

其他优化:

因为ES可以动态加字段(可能手误), 我们不希望为这些字段进行索引, 所以设置`"dynamic": false`, 表示虽然保存这个数据但是不自动填加进mapping. 如果设置为strict, 表示如果检测到新字段, 马上报错. 同时, 对于某些字段, 我们进行mapping, 但是不希望检索, 所以index设置为no.

如果一个字段被设置为`keyword`, 然后传入值的时候传入`['a','b']`时, 这时这个字段为多值字段, 这是自动封箱的, 对于所有ES字段, 底层都是一个列表(分词).

补充(参见[http://www.cnblogs.com/ljhdo/p/4904430.html](http://www.cnblogs.com/ljhdo/p/4904430.html):

ES支持的数据：

```
long：64位存储 
integer：32位存储 
short：16位存储 
byte：8位存储 
double：64位双精度存储 
float：32位单精度存储 
```

初次之外还可以支持其他复杂的类型

1. 数组类型：没有明显的字段类型设置，任何一个字段的值，都可以被添加0个到多个，要求，他们的类型必须一致，当类型一直含有多个值存储到ES中会自动转化成数组类型
2. 对象类型：存储类似json具有层级的数据 
3. 嵌套类型：支持数组类型的对象Array[Object]，可层层嵌套 

对于数组类型的数据，是一个数组元素做一个数据单元，如果是分词的话也只是会依一个数组元素作为词源进行分词。不会是所有的数组元素整合到一起。在查询的时候如果数组里面的元素有一个能够命中那么将视为命中，被召回。

在ElasticSearch内部，嵌套的文档（Nested Documents）被索引为很多独立的隐藏文档（separate documents），这些隐藏文档只能通过嵌套查询（Nested Query）访问。每一个嵌套的文档都是嵌套字段（文档数组）的一个元素。嵌套文档的内部字段之间的关联被ElasticSearch引擎保留，而嵌套文档之间是相互独立的。在该例中，ElasticSearch引起保留Alice和White之间的关联，而John和White之间是没有任何关联的。

默认情况下，每个索引最多创建50个嵌套文档，可以通过索引设置选项：`index.mapping.nested_fields.limit` 修改默认的限制。

我们区分了`object`, `nested`, `text/keyword`的差别. `nested`主要针对对象数组(保留对象关联关系), "text/keyword"通过设置子属性可以实现对象数组(但关联关系丢失).

# 三.解决/测试

我们进行索引重建并且进行测试:

## 3.1.删除索引

```
DELETE /a
```

## 3.2新建索引

```json
PUT /a

{
	"mappings": {
		"jobs": {
			"include_in_all": false,
			"dynamic": false,
			"properties": {
				"group": {
					"type": "keyword"
				},
				"test1": {
					"properties": {
						"first": {
							"type": "keyword"
						},
						"last": {
							"type": "keyword"
						}
					}
				},
				"test2": {
					"type": "nested",
					"properties": {
						"first": {
							"type": "keyword"
						},
						"last": {
							"type": "keyword"
						}
					}
				},
				"run_detail": {
					"type": "text",
					"index": "no"
				}
			}
		}
	}
}
```

## 3.3.插入数据测试

```json
PUT /a/b/1

{
	"group": [
		"a",
		"b"
	],
	"test1": [
		{
			"first": "John",
			"last": "Smith"
		},
		{
			"first": "Alice",
			"last": "White"
		}
	],
	"test2": [
		{
			"first": "John",
			"last": "Smith"
		},
		{
			"first": "Alice",
			"last": "White"
		}
	]
}

```

test1是没关联的对象数组, 而test2是有关联的, 对于嵌套, 查询是这样的(对象扁平化了):

```json
POST /a/b/_search

{
	"query": {
		"nested": {
			"path": "test2",
			"query": {
				"bool": {
					"must": [
						{
							"match": {
								"test2.first": "Alice"
							}
						},
						{
							"match": {
								"test2.last": "White"
							}
						}
					]
				}
			}
		}
	}
}
```

我们开始测试`group`字段, 随机插入数据, id是自动生成的

```json
POST /a/b

{
	"group": "a.b.c.d"
}

POST /a/b
{
        "group": ["a","b"]
}
```

测试开始:

## 3.4.正则查询

```json
POST /a/b/_search

{
	"query": {
		"constant_score": {
			"filter": {
				"bool": {
					"must": [
						{
							"regexp": {
								"group": "a.b.*"
							}
						}
					]
				}
			}
		}
	},
	"highlight": {
		"fields": {
			"*": {}
		}
	},
	"_source": {
		"include": [
			"group"
		]
	}
}
```

这种方式比较慢, 对于group是单个值的, 那正则匹配单个值, 多个值的, 那么分别正则匹配, 有一个匹配到就返回.

## 3.5.terms查询

```json
POST /a/b/_search
{
	"query": {
		"constant_score": {
			"filter": {
				"bool": {
					"must": [
						{
							"terms": {
								"group": [
									"a",
									"b",
									"c"
								]
							}
						}
					]
				}
			}
		}
	},
	"highlight": {
		"fields": {
			"*": {}
		}
	},
	"_source": {
		"include": [
			"group"
		]
	}
}
```

这种方式较精确, 但是查询`["a","b","c"]`, 只要文档字段有符合其中一个, 那么就会返回, 是一种包含操作, 即我们返回的文档可能是["a"], 那么我们想只找"a","b","c"都有的文档, 怎么办?以下:

```json
POST /a/b/_search
{
	"query": {
		"constant_score": {
			"filter": {
				"bool": {
					"must": [
						{
							"term": {
								"group": "a"
							}
						},
						{
							"term": {
								"group": "b"
							}
						},
						{
							"term": {
								"group": "c"
							}
						}
					]
				}
			}
		}
	},
	"highlight": {
		"fields": {
			"*": {}
		}
	},
	"_source": {
		"include": [
			"group"
		]
	}
}
```

这下就精确了.

## 3.6.统计聚合

我们统计聚合如下:

```json
POST /a/b/_search
{
	"aggs": {
		"status": {
			"terms": {
				"field": "group"
			}
		}
	},
	"size": 0
}
```

# 四.批量翻页和插入scroll/bulk

```json
POST /a/b/_search?scroll=1m //第1次请求
{
        "query": {
        "bool": {
            "must_not": [
                {
                    "exists": {
                        "field": "job_type"
                    }
                }
            ]
        }
    },
    "sort" : ["first_create_at"],
    "size":  10
}
```

返回结果包含：`_scroll_id` ，`base-64编码的字符串`

```json
POST /_search/scroll  //后续请求
{
    "scroll": "1m",
    "scroll_id" : "cXVlcnlUaGVuRmV0Y2g7NTsxMDk5NDpkUmpiR2FjOFNhNnlCM1ZDMWpWYnRROzEwOTk1OmRSamJHYWM4U2E2eUIzVkMxalZidFE7MTA5OTM6ZFJqYkdhYzhTYTZ5QjNWQzFqVmJ0UTsxMTE5MDpBVUtwN2lxc1FLZV8yRGVjWlI2QUVBOzEwOTk2OmRSamJHYWM4U2E2eUIzVkMxalZidFE7MDs="
}
```

 然后处理增加字段后`/bulk`批量插回.

```json
POST /_bulk

{"update":{"_index":"a","_type":"b","_id":"%s"}}\n
{"doc":%s,"doc_as_upsert":true}\n
{"update":{"_index":"a","_type":"b","_id":"%s"}}\n
{"doc":%s,"doc_as_upsert":true}\n
```

# 五. 倒排索引

我们来进一步分析字段的索引!

请参考: [http://www.cnblogs.com/maybe2030/p/4791611.html](http://www.cnblogs.com/maybe2030/p/4791611.html)

以下图片较长, 请耐心等待加载

![](https://hunterhug.github.io/blog/picture/public/Lucene.png)