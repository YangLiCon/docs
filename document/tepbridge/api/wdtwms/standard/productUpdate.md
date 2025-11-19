# 货品信息更新接口
## 接口说明

| 接口描述：更新WMS货品的长宽高、重量、箱规等信息              |
| ------------------------------------------------------------ |
| 接口名称（method）：goods.info.update                        |
| 注意事项：商家编码和条码至少必填一个，都传则以传递的多个条件共同定位一条单品 |
| 客户端路径：货品→货品档案                                    |

## 公共参数说明

此处为语雀内容卡片，点击链接查看：https://www.yuque.com/huice-wiki/bhxv6e/enclt9

## 业务请求参数

| **业务请求参数说明** | **名称**** ** | **类型**** ** | **必须**** **                            | **描述**** ** |
| -------------------- | ------------- | ------------- | ---------------------------------------- | ------------- |
|                      | owner_no      | string        | true                                     | 货主编号      |
| spec_no              | string        | false         | 商家编码                                 |               |
| barcode              | string        | false         | 条形码（商品条码，支持主条码、非主条码） |               |
| length               | decimal       | false         | 长。单位cm                               |               |
| width                | decimal       | false         | 宽。单位cm                               |               |
| height               | decimal       | false         | 高。单位cm                               |               |
| volume               | decimal       | false         | 体积。单位cm3                            |               |
| gross_weight         | decimal       | false         | 毛重。单位kg                             |               |
| base_unit            | string        | false         | 基本单位                                 |               |
| unit_ratio           | decimal       | false         | 每箱数量                                 |               |
| box_weight           | decimal       | false         | 箱重量，Kg                               |               |
| box_volume           | decimal       | false         | 箱体积，cm³                              |               |
| modifier             | string        | false         | 更新人                                   |               |
| validity_days        | decimal       | false         | 保质期天数                               |               |
| expire_days          | decimal       | false         | 临期天数                                 |               |

## 业务响应参数

无

## 请求示例

```json
{
     "owner_no":"test",
     "spec_no":"ceshi01",
     "barcode":"",
     "length":"1",
	   "width":"10",
	   "height":"3",
	   "volume":"4",
	   "gross_weight":"0.1",
	   "base_unit":"",
	   "unit_ratio":"2",
	   "modifier":""
}
```

## 响应示例

### 正常响应示例

```json
{
     "flag":"success",
     "code":"",
     "message":"货品更新成功"
}
```

### 异常响应示例

```json
{
    "flag":"failure",
    "code":"client.protocol.invalid-argument",
    "message":"该接口【goods.info.update】未部署（暂不支持）"
}
```