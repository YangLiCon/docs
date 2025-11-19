# 单品信息增量查询接口
## 接口说明

| 接口描述：获取WMS的单品档案资料                              |
| ------------------------------------------------------------ |
| 接口名称（method）：goods.spec.query.step                    |
| 增量获取：按照旺店通WMS内单品信息最后修改时间增量获取数据，请求时输入start_time和end_time作为时间跨度的筛选条件 |
| 时间跨度：start_time和end_time最大跨度为1小时                |
| 客户端路径： 货品→单品列表                                   |

## 公共参数说明

此处为语雀内容卡片，点击链接查看：https://www.yuque.com/huice-wiki/bhxv6e/enclt9

## 业务请求参数

| **业务请求参数说明** | **名称**  | **类型** | **是否必须**                                            | **描述** |
| -------------------- | --------- | -------- | ------------------------------------------------------- | -------- |
|                      | owner_no  | string   | true                                                    | 货主编号 |
| start_time           | timestamp | true     | 开始时间（**单品**修改时间）                            |          |
| end_time             | timestamp | true     | 结束时间（**单品**修改时间）开始、结束时间跨度为1个小时 |          |
| page_size            | int       | false    | 分页大小，默认为10，一页最大30                          |          |
| page_no              | int       | false    | 页号，从0开始，默认为0                                  |          |

## 业务响应参数

| **业务响应参数说明** | **名称** | **类型** | **必须**                                                     | **描述**     |
| ------------------- | -------- | -------- | ------------------------------------------------------------ | ------------ |
|                     | content  | []       | true                                                         | 返回详细信息 |
|                     | total    | int      | true                                                         | 只在page_no = 0 时返回       |
| **一级子节点说明**   |          |          |                                                              |              |
| content             | spec_no  | string   | true                                                         | 商家编码     |
|               | goods_no | string   | true                                                         | 货品编号     |
|               | img_url  | string   | true                                                         | 单品图片URL  |              
|               | spec_name | string  | true                                                         | 规格名称     |             
|               | goods_type | int    | true                                                         | 货品类别。枚举值如下。 0: 其它 1: 销售货品 2: 原材料 3: 包装物 4: 周转材料 5: 虚拟商品 6: 固定资产 7: 私密货品 |
|               | goods_name | string | true                                                         | 货品名称     |             
|               | length   | decimal  | true                                                         | 商品长度，单位cm |           
|               | width    | decimal  | true                                                         | 商品宽度，单位cm |           
|               | height   | decimal  | true                                                         | 商品高度，单位cm |           
|              | volume   | string   | true                                                         | 体积。单位ml |               
|              | gross_weight | decimal | true                                                      | 商品毛重，单位kg |         
|              | box_volume | decimal | false                                                       | 箱体积。单位ml |             
|              | box_weight | decimal | false                                                       | 箱重量。单位kg |             
|              | remark   | string   | true                                                         | 单品备注     |             
|              | is_sn_enable | int  | true                                                         | 是否启用 SN：0：不启用序列号1：强序列号2：弱序列号 |
|              | unit_ratio | decimal | true                                                       | 箱规         |             
|              | aux_unit_ratio | decimal | true                                                     | 每包数量     |             
|              | barcode  | string   | true                                                         | 主条码       |             
|              | brand_name | string | true                                                         | 品牌名字     |             
|              | pick_score | string | true                                                         | 拣货积分     |             
|              | pack_score | string | true                                                         | 打包积分     |             
|              | examine_score | string | true                                                      | 验货积分     |             
|              | stock_in_score | string | true                                                     | 入库积分     |             
|              | putaway_score | string | true                                                      | 上架积分     |             
|              | validity_days | string | true                                                      | 保质期天数   |             
|              | expire_days | string | true                                                        | 临期天数     |             
|              | receive_days | string | true                                                       | 最佳收货天数 |             
|              | price    | decimal  | true                                                         | 价格         |             
|              | class_name | string | false                                                        | 分类名称     |             
|              | short_name | string | false                                                        | 货品简称     |             
|              | base_unit | string  | false                                                        | 基本单位     |             
|              | spec_prop1 | string | true                                                         | 单品自定义属性 |           
|              | spec_prop2 | string | true                                                         | 单品自定义属性 |           
|              | spec_prop3 | string | true                                                         | 单品自定义属性 |           
|              | spec_prop4 | string | true                                                         | 单品自定义属性 |           
|              | spec_prop5 | string | true                                                         | 单品自定义属性 |           
|              | spec_prop6 | string | true                                                         | 单品自定义属性 |           
|              | all_barcode | []    | true                                                         | 包含主条码在内的所有条码 |   
| **二级子节点说明**   |          |          |                                                              |              |
| all_barcode         | barcode  | string   | string                                                       | 条码         |



## 请求示例

```json
{
    "owner_no": "123",
    "start_time": "2021-04-14 11:00:38",
    "end_time": "2021-04-14 11:50:54",
    "page_no": "0",
    "page_size": "1"
}
```

## 响应示例

### 正常响应示例

```json
{
    "flag": "success",
    "code": "",
    "content": [
        {
            "spec_no": "qhl_postman条码测试1",
            "img_url": "",
            "spec_name": "",
            "goods_name": "122",
            "length": "0.0000",
            "width": "0.0000",
            "height": "0.0000",
            "volume": "0.0000",
            "gross_weight": "0.0000",
            "remark": "pdcs货品档案",
            "unit_ratio": "0.0000",
            "barcode": "qhl_postman条码测试_1561945892",
            "brand_name": "EHOME",
            "pick_score": "112345.0000",
            "pack_score": "123345.0000",
            "examine_score": "1112345.0000",
            "stock_in_score": "11112345.0000",
            "putaway_score": "111112345.0000",
            "validity_days": "0.0000",
            "expire_days": "0.0000",
            "receive_days": "0.0000",
            "price": "0.0000",
            "spec_prop1": "自定义单品属性1",
            "spec_prop2": "",
            "spec_prop3": "",
            "spec_prop4": "",
            "spec_prop5": "",
            "spec_prop6": "",
            "all_barcode": [
                {
                    "barcode": "qhl_postman条码测试"
                },
                {
                    "barcode": "qhl_postman条码测试_1561945892"
                }
            ]
        }
    ],
    "message": ""
}
```

### 异常响应示例

```json
{
    "flag":"failure",
    "code":"client.protocol.invalid-argument",
    "message":"该接口【goods.spec.query.step】未部署（暂不支持）"
}
```

