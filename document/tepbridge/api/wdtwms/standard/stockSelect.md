# 库存查询接口
## 接口说明

| 接口描述：需要以货主、仓库、商家编码为维度获取WMS单品（sku）的库存量 |
| ------------------------------------------------------------ |
| 接口名称（method）：inventoryQuery                              |
| 客户端路径：库存→库存管理                                    |


## 业务请求参数

| **业务请求参数说明** | **名称** | **类型** | **必须**                                          | **描述**                                 |
| -------------------- | -------- | -------- | ------------------------------------------------- | ---------------------------------------- |
|                      | owner_no | string   | true                                              | 货主编码                                 |
| warehouse_no         | string   | true     | 仓库编码                                          |                                          |
| is_position          | int      | false    | 是否需要返回货位信息，1:是，0:否。默认否。        |                                          |
| goods                | []       | true     | 货品信息集合，一次最多50个货品                    |                                          |
| **一级子节点说明**   |          |          |                                                   |                                          |
| goods                | spec_no  | string   | false                                             | 货品商品编码：商家编码和批次不能同时为空 |
| batch_no             | string   | false    | 批次；批次和商家编码不能同时为空                  |                                          |
| inventory_type       | string   | false    | 库存类型，ZP=正品, CC=残次 默认查询所有类型的货品 |                                          |

## 业务响应参数

| **业务响应参数说明** | **名称**     | **类型** | **必须**                                                     | **描述**     |
| -------------------- | ------------ | -------- | ------------------------------------------------------------ | ------------ |
|                      | content      | []       | true                                                         | 货品信息集合 |
| **一级子节点说明**   |              |          |                                                              |              |
| content              | warehouse_no | string   | true                                                         | 仓库编码     |
| spec_no              | string       | true     | 货品商家编码，货品唯一标识                                   |              |
| spec_name            | string       | false    | 货品规格名称                                                 |              |
| goods_name           | string       | false    | 货品名字                                                     |              |
| inventory_type       | string       | true     | 库存类型，ZP=正品, CC=残次                                   |              |
| quantity             | decimal      | true     | 库存数量                                                     |              |
| sending_num          | decimal      | true     | 待发货量。已审核未发货的数量，不限于当前批次效期。           |              |
| order_num            | decimal      | true     | 待审核量。所有待审核的量，不限于当前批次效期                 |              |
| available_num        | decimal      | true     | 可发库存                                                     |              |
| batch_no             | string       | false    | 批次编码                                                     |              |
| product_date         | timestamp    | false    | 商品生产日期 yyyy-MM-dd HH:mm:ss                             |              |
| expire_date          | timestamp    | false    | 商品过期日期 yyyy-MM-dd HH:mm:ss                             |              |
| position_no          | string       | false    | is_position=1时返回。货位编号                                |              |
| zone_no              | string       | false    | is_position=1时返回。货区编号                                |              |
| zone_type            | int          | false    | is_position=1时返回。 货区类型  1 : 暂存区 2 : 拣货区 3 : 备货区 4 : 残品区0: 其它区（此时货位为：未知货位, 发货暂存位, 盘点暂存位, 移位暂存位, 补货暂存位） |              |

## 请求示例

```json
{
  "owner_no": "owner",
  "warehouse_no": "warehouse",
  "goods": [
    {
      "spec_no": "123",
      "inventory_type": "ZP"
    }
  ]
}
```

## 响应示例

### 正常响应示例

```json
{
  "code": 200,
  "total": null,
  "msg": "查询成功",
  "data": {
    "flag": "success",
    "code": "",
    "message": "",
    "content": [
      {
        "warehouse_no": "WarehouseNo1",
        "spec_no": "ITEM20240001",
        "spec_name": "蓝色钛金属, 256GB",
        "inventory_type": "ZP",
        "quantity": 50,
        "batch_no": "20251018",
        "product_date": "2025-10-18T00:00:00.000+08:00",
        "expire_date": "2025-11-17T00:00:00.000+08:00"
      },
      {
        "warehouse_no": "WarehouseNo1",
        "spec_no": "ITEM20240001",
        "spec_name": "蓝色钛金属, 256GB",
        "inventory_type": "ZP",
        "quantity": 100,
        "batch_no": "20251117",
        "product_date": "2025-11-17T00:00:00.000+08:00",
        "expire_date": "2026-01-06T00:00:00.000+08:00"
      }
    ]
  }
}
```

### 异常响应示例

```json
{
    "flag":"failure",
    "code":"client.protocol.invalid-argument",
    "message":"该接口【stock.query】未部署（暂不支持）"
}
```