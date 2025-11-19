# 前言
## 名词解释

| 序号 | 名词     | 解释                                             |
| ---- | -------- | ------------------------------------------------ |
| 1    | ERP      | ERP EntERPrise Resource Planning 企业资源计划    |
| 2    | WMS      | Warehouse Management System 仓库管理系统         |
| 3    | Sign签名 | 保证数据的完整性，防止在网络传输的过程中篡改数据 |



# 接口规范

## 请求参数

请求参数包含URL 中带的系统参数和 BODY 中带的相关业务参数 ，系统参数如下：

| 参数        | 参数说明                                                     | 类型   | 约束 |
| ----------- | ------------------------------------------------------------ | ------ | ---- |
| appkey      | 接口公钥（由旺店通提供）                                     | string | true |
| appsecret   | 接口私钥（由旺店通提供），仅用于签名，调用接口时不传递该字段 | string | true |
| timestamp   | 当前时间，精确到秒，格式为YYYY-MM-DD HH:MM:SS                | string | true |
| sign        | 签名（参照[签名文档](https://www.yuque.com/huice-wiki/bhxv6e/gzkx6g)） | string | true |

## 响应参数

所有接口都有以下的公共响应参数，不同的业务接口可能会扩充，详情请看具体接口的出参规范：

| 参数    | 参数说明         | 类型   | 约束 |
| ------- | ---------------- | ------ | ---- |
| flag    | success\|failure | string | true |
| code    | 错误代码         | string | true |
| message | 返回状态描述     | string | true |

# 接口说明

## 商品同步接口

### 接口介绍

接口地址（method）：saintjay/productSync

调用方向：ERP→WMS

注：响应成功表示商品已经同步成功，而不仅仅是消息接收成功。

### 入参规范

```xml
<?xml version="1.0" encoding="utf-8"?>
<request>
  <actionType>add|update,必填</actionType>
  <warehouseCode>仓库编码,varchar(50)</warehouseCode>
  <item>
    <itemCode>商家编码(sid+itemCode一致传add也会识别为update),varchar(50),必填,商品唯一码</itemCode>
    <goodsCode>货品编号,varchar(50),注意：<actionType>字段传update时可不传该字段，若传该字段值不可为空</goodsCode>
    <itemName>货品名称,varchar(255),必填</itemName>
    <shortName>货品简称,varchar(255)</shortName>
	  <title>货品别名,varchar(255)</title>
    <barCode>条形码,varchar(100),必填</barCode> 
    <skuProperty>规格名称(如红色, XXL),varchar(200)</skuProperty>
    <spec_code>规格码,varchar(40)</spec_code>
    <stockUnit>基本单位,varchar(16)</stockUnit>
    <length>长(厘米),decimal(19,4)</length>
    <width>宽(厘米),decimal(19,4)</width>
    <height>高(厘米),decimal(19,4)</height>
    <volume>体积(升),decimal(19,4)</volume>
    <grossWeight>毛重(千克),decimal(19,4)</grossWeight>
    <categoryId>分类编号,varchar(50)</categoryId>  
    <categoryName>分类名称,varchar(100)</categoryName> 
    <itemType>商品类型(ZC=正常商品;BC=包材;只传英文编码),string (50),必填</itemType>
    <retailPrice>价格,decimal(19,4)</retailPrice>
    <brandName>品牌,string(50)</brandName>
    <brandCode>品牌编号,string(50)</brandCode>
    <isSNMgmt>启用序列号,Y/N (默认为 N),若为Y看系统配置传入为强序列号或弱序列号,tinyint(4)</isSNMgmt>                   
    <shelfLife>保质期(小时),decimal(19,4)</shelfLife>
    <isBatchMgmt>是否需要批次管理,Y/N (默认为 N),tinyint(4)</isBatchMgmt> 
    <pcs>箱规,decimal(19,4)</pcs>
    <originAddress>商品的原产地,varchar(64)</originAddress>
    <remark>备注,varchar(512)</remark>
    <size>尺寸,varchar(50)</size>
    <color>颜色,varchar(50)</color>
    <auxUnit>一级单位,varchar(16)</auxUnit>
    <auxUnitRatio>每包数量,int</auxUnitRatio> 
    <adventLifecycle>临期天数,int</adventLifecycle>
    <receiveDays>最佳收货天数,int</receiveDays>
    <extendProps>
      <imageUrl>图片,varchar(1024)</imageUrl>
      <specprop1>商品自定义属性1,varchar(255)</specprop1>
      <goodsprop1>货品自定义属性1,varchar(255)</goodsprop1>
      <specprop2>商品自定义属性2,varchar(255)</specprop2>
      <goodsprop2>货品自定义属性2,varchar(255)</goodsprop2>
      <specprop3>商品自定义属性3,varchar(255)</specprop3>
      <goodsprop3>货品自定义属性3,varchar(255)</goodsprop3>
      <specprop4>商品自定义属性4,varchar(255)</specprop4>
      <goodsprop4>货品自定义属性4,varchar(255)</goodsprop4>
      <specprop5>商品自定义属性5,varchar(255)</specprop5>
      <goodsprop5>货品自定义属性5,varchar(255)</goodsprop5>
      <specprop6>商品自定义属性6,varchar(255)</specprop6>
      <goodsprop6>货品自定义属性6,varchar(255)</goodsprop6>
      <boxVolume>箱体积（立方厘米）,decimal(19,4)</boxVolume>
      <boxWeight>箱重量（千克）,decimal(19,4)</boxWeight>
    </extendProps>
  </item>
</request>
```

### 出参规范

```json
{
  "code": 200,
  "total": null,
  "msg": "<?xml version=\"1.0\" encoding=\"utf-8\"?>\r\n<response><flag>success</flag><code>0</code><message>旺店通WMS返回：商品同步成功</message><itemId>13589</itemId></response>\r\n",
  "data": null
}
```

## 入库单创建接口

### 接口介绍

接口名称（method）：saintjay/stockInOrder

调用方向：ERP→WMS

注： ERP 调用创建接口后，WMS 的响应报文 success 说明 WMS 已经将该入库单创建成功，而不仅仅是消息接收成功。

### 入参规范

```xml
<?xml version="1.0" encoding="utf-8"?>
<request>
  <entryOrder>
    <entryOrderCode>入库单号,varchar(50),必填,唯一值</entryOrderCode>
    <warehouseCode>仓库编码,varchar(50),必填</warehouseCode>
    <orderType>入库类型(CGRK=采购入库;DBRK=调拨入库;QTRK=其他入库;B2BRK=B2B入库(唯品入库);SCRK=生产入库;只传英文编码),string,必填</orderType>
    <supplierCode>供应商编号(orderType=CGRK时接收该信息),varchar(30)</supplierCode>
    <supplierName>供应商(orderType=CGRK时接收该信息),varchar(100)</supplierName>
    <logisticsName>物流公司,varchar(40)</logisticsName>
    <expressCode>物流单号,varchar(40)</expressCode>
    <remark>单据备注,varchar(255)</remark>
    <senderInfo>
      <name>发货人姓名,varchar(40)</name>
      <tel>发货人固话,varchar(32)</tel>
      <mobil>发货人手机号,varchar(30)</mobil>
      <detailAddress>发货人地址,varchar(255)</detailAddress>
    </senderInfo>
    <extendProps>
	    <vphRefundNo>唯品会退货单号(orderType=B2BRK时必填),varchar(50)</vphRefundNo>
      <receipt_type>自定义属性1,varchar(255)</receipt_type>
      <prop2_code>自定义属性2,varchar(255)</prop2_code>
      <supplierMsg>自定义属性3,archar(255)</supplierMsg>
      <prop4_code>自定义属性4,archar(255)</prop4_code>
      <prop5_code>自定义属性5,archar(255)</prop5_code>
      <prop6_code>自定义属性6,archar(255)</prop6_code>
      <purchaserName>采购员(orderType=CGRK时接收该信息),varchar(40)</purchaserName>
    </extendProps>
  </entryOrder>
  <orderLines>
    <orderLine>
      <orderLineNo>单据行号(订单中同一货品有多条记录时必填,保证同一个货品的orderLineNo不同),varchar(50)</orderLineNo>
      <itemCode>商家编码,varchar(50),必填,</itemCode>
      <itemName>货品名称,varchar(255)</itemName>
      <planQty>开单数量,decimal(19,4),必填,</planQty>
      <purchasePrice>采购单价(orderType=CGRK时接收该信息),decimal(19,4)</purchasePrice>
      <inventoryType>是否正品(ZP=正品;CC=残次;默认为ZP,只传英文编码),string</inventoryType>
      <productDate>生产日期(YYYY-MM-DD HH:MM:SS),datetime</productDate>
      <expireDate>有效期(YYYY-MM-DD HH:MM:SS),datetime</expireDate>
      <batchCode>批次,varchar(50)</batchCode>
      <remark>货品备注,varchar(512)</remark>
      <extendProps>
	      <VpPackageNO>唯品会PO单号(orderType=B2BRK时必填),varchar(50)</VpPackageNO>
	      <VpBoxNO>唯品会入库箱号(orderType=B2BRK时必填),varchar(50)</VpBoxNO>
      </extendProps>
    </orderLine>
  </orderLines>
</request>
```

### 出参规范


```json
{
  "code": 200,
  "total": null,
  "msg": "<?xml version=\"1.0\" encoding=\"utf-8\"?>\r\n<response><flag>success</flag><code>0</code><message>旺店通WMS返回：商品同步成功</message><itemId>13589</itemId></response>\r\n",
  "data": null
}
```

[//]: # ()
[//]: # (## 入库单确认接口)

[//]: # ()
[//]: # (### 接口介绍)

[//]: # ()
[//]: # (接口名称（method）：WDT_WMS_ENTRYORDER_CONFIRM)

[//]: # ()
[//]: # (调用方向：WMS→ERP)

[//]: # ()
[//]: # (注：WMS 调用确认接口后，ERP 的响应报文 success 说明 ERP 已经将该入库单接收成功，而不仅仅是消息接收成功。)

[//]: # ()
[//]: # (### 入参规范)

[//]: # ()
[//]: # (```xml)

[//]: # (<?xml version="1.0" encoding="utf-8"?>)

[//]: # (<request>)

[//]: # (  <entryOrder>)

[//]: # (    <entryOrderCode>入库单号,varchar&#40;50&#41;,必填,唯一值</entryOrderCode>)

[//]: # (    <entryOrderId>仓储系统入库单ID,varchar&#40;50&#41;,必填</entryOrderId>)

[//]: # (    <warehouseCode>仓库编码,varchar&#40;50&#41;,必填</warehouseCode>)

[//]: # (    <entryOrderType>入库单类型&#40;CGRK=采购入库;DBRK=调拨入库;QTRK=其他入库;B2BRK=B2B入库&#40;唯品入库&#41;;SCRK=生产入库,只传英文编码&#41;,string&#40;50&#41;</entryOrderType>)

[//]: # (    <outBizCode>外部业务编码&#40;消息ID,用于去重,ISV对于同一请求分配一个唯一性的编码,用来保证因为网络等原因导致重复传输,请求不会被重复处理&#41;,string&#40;50&#41;,必填,实际回传入库单号entryOrderId的值重复</outBizCode>)

[//]: # (    <confirmType>支持出入库单多次收货&#40;多次收货后确认时:0=入库单最终状态确认,1=入库单中间状态确认;每次入库传入的数量为增量;特殊情况:同一入库单如果先收到0,后又收到1,允许修改收货的数量&#41;,int &#40;50&#41;,必填</confirmType>)

[//]: # (    <status>入库单状态&#40;PARTFULFILLED=部分收货完成,FULFILLED=收货完成,只传英文编码&#41;,tinyint&#40;1&#41;,必填</status>)

[//]: # (	  <operateTime>入库单审核时间也叫入库单完成时间，因为wms系统内部审核即入库完成&#40;YYYY-MM-DD HH:MM:SS&#41;,datetime</operateTime>)

[//]: # (    <remark>备注信息,varchar&#40;255&#41;</remark>)

[//]: # (  </entryOrder>)

[//]: # (  <orderLines>)

[//]: # (    <orderLine>)

[//]: # (      <itemCode>商家编码,varchar&#40;50&#41;,必填</itemCode>)

[//]: # (      <inventoryType>库存类型&#40;ZP=正品;CC=残次;默认为ZP,只传英文编码&#41;,tinyint&#40;4&#41;</inventoryType>)

[//]: # (      <actualQty>实收数量,decimal&#40;19,4&#41;,必填</actualQty>)

[//]: # (	    <orderLineNo>单据行号&#40;订单中一个货品有多条记录时必填,保证同一个货品的orderLineNo不同&#41;,varchar&#40;50&#41;<orderLineNo>)

[//]: # (	    <extendProps>)

[//]: # (		    <auxUnitRatio>每包数量,decimal&#40;19,4&#41;</auxUnitRatio>)

[//]: # (		    <unitRatio>每箱数量,decimal&#40;19,4&#41;</unitRatio>)

[//]: # (		    <VpPackageNO>唯品会PO单号&#40;orderType=B2BRK时必填&#41;,varchar&#40;50&#41;</VpPackageNO>)

[//]: # (		    <VpBoxNO>唯品会入库箱号&#40;orderType=B2BRK时必填&#41;,varchar&#40;50&#41;</VpBoxNO>)

[//]: # (        <prop1>自定义属性1</prop1>)

[//]: # (        <prop2>自定义属性2</prop2>)

[//]: # (        <prop3>自定义属性3</prop3>)

[//]: # (		  </extendProps>)

[//]: # (      <snList>)

[//]: # (        <sn>商品sn信息,archar&#40;80&#41;</sn>)

[//]: # (      </snList>)

[//]: # (      <batchs>)

[//]: # (        <batch>)

[//]: # (          <batchCode>批次编号,varchar&#40;50&#41;</batchCode>)

[//]: # (          <productDate>生产日期&#40;YYYY-MM-DD HH:MM:SS&#41;,datetime</productDate>)

[//]: # (          <expireDate>过期日期&#40;YYYY-MM-DD HH:MM:SS&#41;,datetime</expireDate>)

[//]: # (          <actualQty>实收数量响应参数&#40;要求batchs节点下所有的实收数量之和等于orderline中的实收数量&#41;,decimal&#40;19,4&#41;</actualQty>)

[//]: # (          <inventoryType>是否正品&#40;ZP=正品;CC=残次;默认为ZP,只传英文编码&#41;,tinyint&#40;4&#41;</inventoryType>)

[//]: # (		      <extendProps>)

[//]: # (		        <goods_remark>货品备注,varchar&#40;512&#41;</goods_remark>)

[//]: # (		      </extendProps>)

[//]: # (        </batch>)

[//]: # (      </batchs>)

[//]: # (      <remark>备注</remark>)

[//]: # (    </orderLine>)

[//]: # (  </orderLines>)

[//]: # (</request>)

[//]: # (```)

[//]: # ()
[//]: # (### 出参规范)

[//]: # ()
[//]: # (```xml)

[//]: # (<?xml version="1.0" encoding="utf-8"?>)

[//]: # (<response>)

[//]: # (  <flag>success|failure&#40;成功|失败&#41;,string,必填 </flag>)

[//]: # (  <code>错误代码,string,必填</code>)

[//]: # (  <msg>错误信息,string,必填</msg>)

[//]: # (</response>)

[//]: # (```)

## 出库单创建接口(非销售订单)

### 接口介绍

接口名称（method）：saintjay/notSaleDeliveryOrder

调用方向：ERP→WMS

注：1. 该接口和发货单的区别是，发货单创建是和订单相关的发货操作，而该接口是普通的货品出库，和订单无关；

​         2. ERP 调用创建接口后，WMS 的响应报文 success 说明 WMS 已经将该出库单创建成功，而不仅仅是消息接收成功。

### 入参规范

```xml
<?xml version="1.0" encoding="utf-8"?>
<request>
	<deliveryOrder>
		<deliveryOrderCode>出库单号,varchar(50),必填,唯一值</deliveryOrderCode>
		<warehouseCode>仓库编码,varchar(50),必填</warehouseCode>
		<createTime>出库单创建时间(YYYY-MM-DD HH:MM:SS),datetime</createTime>
		<orderType>出库单类型(PTCK=普通出库单;DBCK=调拨出库;B2BCK=B2B出库(唯品出库);QTCK=其他出库;CGTH=采购退货出库单;SCCK=生产出库,只传英文编码) ,tinyint(4),必填</orderType>
		<logisticsCode>物流公司编码,varchar(50),物流编码在仓库里做映射,接口推送后展示物流名称字段</logisticsCode>
    <VpExpressCode>物流单号,varchar(50)</VpExpressCode>
    <supplierCode>供应商编码,varchar(30)</supplierCode>
	  <supplierName>供应商名称,varchar(100)</supplierName>
    <totalAmount>订单金额,decimal(19,4)</totalAmount>
		<remark>备注,varchar(255)</remark>
		<receiverInfo>
			<name>姓名,varchar(40)</name>
			<tel>固定电话,varchar(32)</tel>
			<mobile>移动电话,varchar(30)</mobile>
      <province>省,varchar(50)</province>
      <city>市,varchar(50)</city>
      <area>区,varchar(50)</area>
      <receiver_area>,varchar(50)</receiver_area>
		  <detailAddress>详细地址,varchar(255),字段必传值可为空</detailAddress>
      <company>公司,varchar(40)</company>
		</receiverInfo>
		<extendProps>
			<VpExpressCode>物流单号,varchar(50)</VpExpressCode>
			<vipWarehouseCode>到货仓编码,varchar(50)</vipWarehouseCode>
			<VpStockInOrderNO>唯品会入库单号(orderType=B2BCK时必填),varchar(50)</VpStockInOrderNO>
			<VpPackageNO>唯品会PO号(orderType=B2BCK时必填),varchar(50)</VpPackageNO>
			<VpOutTime>客户端的到货时间,(YYYY-MM-DD HH:MM:SS),datetime</VpOutTime>
      <shipment_type>自定义属性1,varchar(255)</shipment_type>
      <platform_code>自定义属性2,varchar(255)</platform_code>
			<prop3_code>自定义属性3,varchar(255)</prop3_code>
		</extendProps>
	</deliveryOrder>
	<orderLines>
		<orderLine>
			<orderLineNo>单据行号(订单中一个货品有多条记录时必填,保证同一个货品的orderLineNo不同),varchar(50)</orderLineNo>
			<itemCode>商家编码,varchar(50),必填</itemCode>
			<itemId>商品id,varchar(50)</itemId>
			<itemName>商品名称,varchar(255)</itemName>
			<inventoryType>库存类型(ZP=正品;CC=残次;默认为ZP,只传英文编码),tinyint(4)</inventoryType>
			<batchCode>批次编码,varchar(50)</batchCode>
			<expireDate>过期日期(YYYY-MM-DD),datetime</expireDate>
			<productDate>生产日期(YYYY-MM-DD),datetime</productDate>
			<planQty>应发商品数量,decimal(19,4),必填</planQty>
      <remark>备注,varchar(255)</remark>
      <actualPrice>实际成交价, decimal(19,4)</actualPrice>
      <isGift>是否赠品,0表示非赠品，1 自动赠送，2表示手动赠送</isGift>
		</orderLine>
	</orderLines>
</request>
```

### 出参规范

```json
{
  "code": 200,
  "total": null,
  "msg": "<flag>success|failure(成功|失败),string,必填 </flag>
  <code>错误代码,string,必填</code>
  <message>错误信息,string,必填;若推送成功同时返回deliveryOrderId的值</message>
  <deliveryOrderId>WMS生成的仓储单号</deliveryOrderId>",
  "data": null
}
```

[//]: # ()
[//]: # (## 出库单确认接口)

[//]: # ()
[//]: # (### 接口介绍)

[//]: # ()
[//]: # (接口名称（method）：WDT_WMS_STOCKOUT_CONFIRM)

[//]: # ()
[//]: # (调用方向：WMS→ERP)

[//]: # ()
[//]: # (注：WMS 调用确认接口后，ERP 的响应报文 success 说明 ERP 已经将该出库单接收成功，而不仅仅是消息接收成功。)

[//]: # ()
[//]: # (### 入参规范)

[//]: # ()
[//]: # (```xml)

[//]: # (<?xml version="1.0" encoding="utf-8"?>)

[//]: # (<request>)

[//]: # (  <deliveryOrder>)

[//]: # (		<deliveryOrderCode>出库单号,varchar&#40;50&#41;,必填,唯一值</deliveryOrderCode>)

[//]: # (		<deliveryOrderId>仓储系统订单号,varchar&#40;50&#41;,必填</deliveryOrderId>)

[//]: # (		<outBizCode>外部业务编码&#40;消息ID,用于去重,ISV对于同一请求分配一个唯一性的编码,用来保证因为网络等原因导致重复传输,请求不会被重复处理&#41;,varchar&#40;50&#41;,必填,实际回传deliveryOrderId的值</outBizCode>)

[//]: # (		<warehouseCode>仓库编码,varchar&#40;50&#41;,必填 </warehouseCode>)

[//]: # (		<orderType>出库单类型&#40;PTCK=普通出库单;DBCK=调拨出库;B2BCK=B2B出库&#40;唯品出库&#41;;QTCK=其他出库;CGTH=采购退货出库单;SCCK=生产出库,只传英文编码&#41;,tinyint&#40;4&#41;,必填</orderType>)

[//]: # (		<status>出库单状态&#40;PARTDELIVERED=部分发货完成;DELIVERED=发货完成,只传英文编码&#41;,tinyint&#40;1&#41;</status>)

[//]: # (		<orderConfirmTime>订单完成时间&#40;YYYY-MM-DD HH:MM:SS&#41;,datetime,必填</orderConfirmTime>)

[//]: # (		<remark>备注,varchar&#40;255&#41; </remark>)

[//]: # (		<logisticsCode>物流公司编码,varchar&#40;50&#41;</logisticsCode>)

[//]: # (    <expressCode>运单号,varchar&#40;50&#41;</expressCode>)

[//]: # (	</deliveryOrder>)

[//]: # (  <packages>)

[//]: # (		  <package>)

[//]: # (		    <logisticsName>物流公司名称,varchar&#40;40&#41;</logisticsName>)

[//]: # (			  <logisticsCode>物流公司编码,varchar&#40;50&#41;</logisticsCode>)

[//]: # (			  <expressCode>运单号,varchar&#40;50&#41;</expressCode>)

[//]: # (			  <packageCode>包裹编号,varchar&#40;50&#41;</packageCode>)

[//]: # (			  <extendProps>)

[//]: # (			    <postage>邮费,decimal&#40;19,4&#41;</postage>)

[//]: # (			  </extendProps>)

[//]: # (			  <items>)

[//]: # (			    <item>)

[//]: # (				    <itemCode>商家编码,varchar&#40;50&#41;,必填</itemCode>)

[//]: # (					  <quantity>包裹内该商品的数量,decimal&#40;19,4&#41;,必填</quantity>)

[//]: # (				  </item>)

[//]: # (			  </items>)

[//]: # (		  </package>)

[//]: # (		</packages>)

[//]: # (	<orderLines>)

[//]: # (		<orderLine>)

[//]: # (		  <orderLineNo>单据行号&#40;订单中一个货品有多条记录时必填,保证同一个货品的orderLineNo不同&#41;,varchar&#40;50&#41;</orderLineNo>)

[//]: # (			<itemCode>商家编码,varchar&#40;50&#41;,必填</itemCode>)

[//]: # (			<inventoryType>库存类型&#40;ZP=正品;CC=残次;默认为ZP,只传英文编码&#41;,tinyint&#40;4&#41;,必填</inventoryType>)

[//]: # (			<actualQty>实发商品数量,decimal&#40;19,4&#41;,必填</actualQty>)

[//]: # (      <remark>备注,varchar&#40;255&#41;</remark>)

[//]: # (			<snList>)

[//]: # (			  <sn>商品sn信息,varchar&#40;80&#41;</sn>)

[//]: # (			</snList>)

[//]: # (			<batchs>)

[//]: # (			  <batch>)

[//]: # (			    <batchCode>批次编码,varchar&#40;50&#41;</batchCode>)

[//]: # (				  <expireDate>过期日期&#40;YYYY-MM-DD&#41;,datetime</expireDate>)

[//]: # (				  <productDate>生产日期&#40;YYYY-MM-DD&#41;,datetime</productDate>)

[//]: # (				  <actualQty>实发商品数量,decimal&#40;19,4&#41;,必填</actualQty>)

[//]: # (				  <inventoryType>库存类型&#40;ZP=正品;CC=残次;默认为ZP,只传英文编码&#41;,tinyint&#40;4&#41;</inventoryType>)

[//]: # (				  <extendProps>)

[//]: # (			      <goods_remark>备注,varchar&#40;255&#41;</goods_remark>)

[//]: # (			    </extendProps>)

[//]: # (			 </batch>)

[//]: # (			</batchs>)

[//]: # (		</orderLine>)

[//]: # (	</orderLines>)

[//]: # (</request>)

[//]: # (```)

[//]: # ()
[//]: # (### 出参规范)

[//]: # ()
[//]: # (```xml)

[//]: # (<?xml version="1.0" encoding="utf-8"?>)

[//]: # (<response>)

[//]: # (  <flag>success|failure&#40;成功|失败&#41;,string,必填 </flag>)

[//]: # (  <code>错误代码,string,必填</code>)

[//]: # (  <msg>错误信息,string,必填</msg>)

[//]: # (</response>)

[//]: # (```)

## 发货单创建接口(销售订单)

### 接口介绍

接口名称（method）：saintjay/deliveryOrder

调用方向：ERP→WMS

注：1. 该接口和出库单创建接口的区别是该接口处理订单引起的发货，而出库单只处理和订单无关的出库；

​        2. ERP 调用创建接口后，WMS 的响应报文 success 说明 WMS 已经将该发货单创建成功，而不仅仅是消息接收成功。

3.支持跨境业务，按以下字段传递

3.1识别request—>deliveryOrder—>extendProps—>foreignTrade，foreignTrade值为Y时，此订单为跨境订单

​     3.2pdf的物流面单的位置为request—>deliveryOrder—>extendProps—>expressPDF。

​     3.3当订单为跨境订单时，物流面单的打印取2中的值

### 入参规范

```xml
<?xml version="1.0" encoding="utf-8"?>
<request>
  <deliveryOrder>
    <deliveryOrderCode>出库单号,varchar(50),必填,唯一值</deliveryOrderCode>
    <preDeliveryOrderCode>原出库单号(ERP分配),varchar(50)</preDeliveryOrderCode>
	  <orderType>出库单类型(JYCK=一般交易出库单;HHCK=换货出库单;BFCK=补发出库单,只传英文编码),tinyint(4),必填</orderType>
    <warehouseCode>仓库编码,varchar(50),必填</warehouseCode>
	  <orderFlag>货到付款订单，可以使用的枚举值如下：COD=货到付款，只需要传递编码,非必填，varchar(50)</orderFlag>
    <sourcePlatformCode>订单来源平台编码(TB=淘宝;TMGJ=天猫国际;TM=天猫;JD=京东;PP=拍拍;AMAZON=亚马逊;YHD=1号店;DD=当当;GM=国美;PDD=拼多多; PDDDF=拼多多代发（代发业务，用 buyerNick 传递代打店铺 ID）;VANCL=凡客;SN=苏宁;WPH=唯品会;YX=易讯;JM=聚美;MGJ=蘑菇街;WPH_JITX=唯品会的JITX;YJ=云集;YZ=有赞;TMCS=天猫超市;DYXD=抖店;KS=快手小店;ZYPT=自有平台;MT=美团;HWSC=华为商城;DWZF=得物直发;DYGX=抖音供销;WXSPHXD=微信视频号;OTHER=其他,只传英文编码),tinyint(4)</sourcePlatformCode>
    <sourcePlatformName>订单来源平台名称,varchar(50)</sourcePlatformName>
    <createTime>发货单创建时间(YYYY-MM-DD HH:MM:SS),datetime,必填</createTime>
    <placeOrderTime>前台订单/店铺订单的创建时间/下单时间(YYYY-MM-DD HH:MM:SS),datetime,必填</placeOrderTime>
    <payTime>订单支付时间(YYYY-MM-DD HH:MM:SS),datetime</payTime>
	  <payNo>支付平台交易号,varchar(50)</payNo>
    <operateTime>操作(审核)时间(YYYY-MM-DD HH:MM:SS),datetime,必填</operateTime>
    <shopNick>店铺名称,varchar(40)</shopNick>
    <buyerNick>买家昵称（当 sourcePlatformCode=PDDDF时，表示拼多多代发业务，传递代打店铺 ID）,varchar(100)</buyerNick>
    <totalAmount>订单总金额(订单总金额=应收金额+已收金额=商品总金额-订单折扣金额+快递费用;单位元),decimal(19,4)</totalAmount>
    <itemAmount>商品总金额(元),decimal(19,4)</itemAmount>
    <discountAmount>订单折扣金额(元),decimal(19,4)</discountAmount>
    <freight>快递费用(元),decimal(18,2)</freight>
    <arAmount>应收金额,decimal(18,2)</arAmount>
    <gotAmount>已收金额(消费者已经支付多少;单位元),decimal(18,2)</gotAmount>
	  <serviceFee>COD服务费,decimal(18,2)</serviceFee>
    <logisticsCode>物流公司编码(对应wms仓库物流映射的“oms物流编码”),varchar(50),必填</logisticsCode>
    <logisticsName>物流公司名称,varchar(64)</logisticsName>
	  <expressCode>运单号,varchar(50)</expressCode>
	  <logisticsAreaCode>快递区域编码/大头笔/三段码,varchar(128)</logisticsAreaCode>
	  <invoiceFlag>是否需要发票,Y/N(默认为N),tinyint(4)</invoiceFlag>
    <deliveryRequirements>    <--发货要求列表-->
      <scheduleType>投递时延要求(1=工作日;2=节假日;101=当日达;102=次晨达;103=次日达;104=预约达;105=隔日达,只传数字编码),smallint(6)</scheduleType>
	    <scheduleDay>要求送达日期(YYYY-MM-DD),datetime</scheduleDay>
      <deliveryType>发货服务类型(PTPS:普通配送;LLPS:冷链配送;HBP:环保配),string (50)</deliveryType>
		  <scheduleStartTime>投递时间范围要求(开始时间;格式：HH:MM:SS),datetime</scheduleStartTime>
		  <scheduleEndTime>投递时间范围要求(结束时间;格式：HH:MM:SS),datetime</scheduleEndTime>
    </deliveryRequirements>
    <senderInfo>       <--发件人信息-->
      <company>公司名称,varchar(200)</company>
      <name>姓名,varchar(50),</name>
      <zipCode>邮编,varchar(20)</zipCode>
      <tel>固定电话,varchar(40)</tel>
      <mobile>移动电话,varchar(40),</mobile>
		  <email>电子邮箱,varchar(50)</email>
      <countryCode>国家二字码,varchar(4)</countryCode>
      <province>省份,varchar(50),</province>
      <city>城市,varchar(50),</city>
      <area>区域,varchar(50)</area>
      <detailAddress>详细地址,varchar(255),</detailAddress>
     </senderInfo>
     <receiverInfo>   <--收件人信息-->
       <name>姓名,varchar(50),必填</name>
       <zipCode>邮编,varchar(40)</zipCode>
       <tel>固定电话,varchar(40)</tel>
       <mobile>移动电话,varchar(40),必填</mobile>
	     <idType>收件人证件类型(1=身份证;2=军官证;3=护照;4=其他),tinyint(4)</idType>
		   <idNumber>收件人证件号码,varchar(40)</idNumber>
		   <countryCode>收件人国家二字码,varchar(4)</countryCode>
		   <province>省份,varchar(50),必填</province>
       <city>城市,varchar(50),必填</city>
       <area>区域,varchar(50)</area>
		   <town>乡镇,varchar(50)</town>
		   <detailAddress>详细地址,varchar(255),必填</detailAddress>
		   <oaid>淘系订单收件人oaid,varchar(50)</oaid>
     </receiverInfo>
	   <invoices>
	     <invoice>  <--发票信息，现仅支持一张发票, string (50) -->
		     <type>发票类型(INVOICE=普通发票;VINVOICE=增值税普通发票;EVINVOICE=电子增票;invoiceFlag=Y时必填),varchar(50)</type>
		     <header>发票抬头,varchar(255)</header>
		     <content>发票内容,varchar(255)</content>
		     <amount>发票总金额,decimal(18,2)</amount>
		   </invoice>
	   </invoices>
	 <buyerMessage>买家留言,varchar(1024)</buyerMessage>
	 <sellerMessage>卖家留言,varchar(1024)</sellerMessage>
	 <printRemark>打印备注,varchar(255)</printRemark>
    <remark>单据备注,varchar(255)</remark>
    <extendProps>
      <foreignTrade>是否为跨境订单，传Y则识别为跨境订单，非必填</foreignTrade>
      <expressPDF>若是跨境订单则传递面单PDF，非必填</expressPDF>
    </extendProps>
  </deliveryOrder>
  <orderLines>
    <orderLine>
	    <orderLineNo>单据行号(订单中一个货品有多条记录时必填,保证同一个货品的orderLineNo不同),varchar (50)</orderLineNo>
	    <sourceOrderCode>交易平台订单,varchar(128)</sourceOrderCode>
	    <subSourceOrderCode>交易平台子订单编码,varchar(128)</subSourceOrderCode>
	    <itemCode>商家编码,varchar(50),必填</itemCode>
	    <itemName>商品名称,varchar(255)</itemName>
	    <inventoryType>库存类型(ZP=正品,只传英文编码),tinyint(4)</inventoryType>
	    <planQty>应发商品数量,decimal(19,4),必填</planQty>
	    <retailPrice>零售价(零售价=实际成交价+单件商品折扣金额),decimal(19,4)</retailPrice>
	    <actualPrice>实际成交价,decimal(18,2)</actualPrice>
	    <discountAmount>单件商品折扣金额,decimal(19,4)</discountAmount>
	    <batchCode>批次编码,varchar(50)</batchCode>
	    <remark>货品备注,varchar(255)</remark>
      <extendProps>
        <isGift>是否赠品,0=非赠品,1=赠品,2=手动赠送</isGift>
      </extendProps>
	  </orderLine>
  </orderLines>
  <extendProps>
    <ConsolidationCode>集包地编码,varchar(10)</ConsolidationCode>
	  <ConsolidationName>集包地名称,varchar(40)</ConsolidationName>
	  <printData>组件加密信息,varchar(8192)</printData>
    <Position>位置,varchar(30)</Position>
    <SenderAdr>发货网点,varchar(50)</SenderAdr>
	  <QrCode>二维码,varchar(255)</QrCode>
	  <PositionNo>位置编号,varchar(50)</PositionNo>
	  <OriginalCode>源地址编号,varchar(50)</OriginalCode>
    <PostidCode>组合物流单号,varchar(40)</PostidCode>
    <DestinationCode>目的地,varchar(50)</DestinationCode>
	  <PrintInfo>水印,varchar(256)</PrintInfo>
    <businessModel>sourcePlatformCode=TMGJZY/TMGJ,传1/2,varchar(50)</businessModel>
	  <supplierId>供应商id,varchar(50)</supplierId>
  </extendProps>
</request>
```

### 出参规范


```json
{
  "code": 200,
  "total": null,
  "msg": "<?xml version="1.0" encoding="utf-8"?>
  <flag>success|failure(成功|失败),string,必填 </flag>
  <code>错误代码,string,必填</code>
  <message>错误信息,string,必填;若推送成功同时返回deliveryOrderId的值</message>
  <deliveryOrderId>WMS生成的仓储单号</deliveryOrderId>,
  "data": null
}
```

[//]: # ()
[//]: # (## 发货单确认接口)

[//]: # ()
[//]: # (### 接口介绍)

[//]: # ()
[//]: # (接口名称（method）：WDT_WMS_DELIVERYORDER_CONFIRM)

[//]: # ()
[//]: # (调用方向：WMS→ERP)

[//]: # ()
[//]: # (注：WMS 调用确认接口后，ERP 的响应报文 success 说明 ERP 已经将该发货单接收成功，而不仅仅是消息接收成功。)

[//]: # ()
[//]: # (### 入参规范)

[//]: # ()
[//]: # (```xml)

[//]: # (<?xml version="1.0" encoding="utf-8"?>)

[//]: # (<request>)

[//]: # (  <deliveryOrder>)

[//]: # (    <deliveryOrderCode>出库单号,varchar&#40;50&#41;,必填,唯一值</deliveryOrderCode>)

[//]: # (    <deliveryOrderId>仓储系统订单号,varchar&#40;50&#41;,必填</deliveryOrderId>)

[//]: # (    <warehouseCode>仓库编码,varchar&#40;50&#41;,必填</warehouseCode>)

[//]: # (    <orderType>出库单类型&#40;JYCK=一般交易出库;HHCK=换货出库;BFCK=补发出库,只传英文编码&#41;,tinyint&#40;4&#41;,必填</orderType>)

[//]: # (    <orderConfirmTime>订单完成时间&#40;YYYY-MM-DD HH:MM:SS&#41;,datetime &#40;50&#41;,必填</orderConfirmTime>)

[//]: # (    <outBizCode>外部业务编码&#40;消息ID,用于去重,ISV对于同一请求分配一个唯一性的编码,用来保证因为网络等原因导致重复传输,请求不会被重复处理&#41;,varchar&#40;50&#41;,必填</outBizCode>)

[//]: # (    <extendProps>)

[//]: # (      <logistics_flag>扩展字段：表示 WMS 预回传物流。1:预回传物流（该功能需要 WMS 配置后，配置后才回传该字段）；2:发货后修改物流再回传（对接 ERP 支持则能回传）。</logistics_flag>)

[//]: # (    </extendProps>)

[//]: # (  </deliveryOrder>)

[//]: # (  <packages>)

[//]: # (    <package>)

[//]: # (	    <logisticsCode>物流公司编码,varchar&#40;50&#41;,必填</logisticsCode>)

[//]: # (	    <expressCode>运单号,varchar&#40;50&#41;,必填</expressCode>)

[//]: # (	    <packageCode>包裹编号,varchar&#40;50&#41;</packageCode>)

[//]: # (	    <weight>包裹重量&#40;单位:千克&#41;,decimal&#40;19,4&#41;</weight>)

[//]: # (	    <extendProps>)

[//]: # (	      <postage>邮费，decimal&#40;19,4&#41;</postage>)

[//]: # (	    </extendProps>)

[//]: # (	    <items>   <--商品列表-->)

[//]: # (	       <item>)

[//]: # (	          <itemCode>商家编码,varchar&#40;50&#41;,必填</itemCode>)

[//]: # (	          <quantity>包裹内该商品的数量,decimal&#40;19,4&#41;,必填</quantity>)

[//]: # (	       </item>)

[//]: # (	    </items>)

[//]: # (	    <packageMaterialList>    <--包材信息列表--> )

[//]: # (         <packageMaterial>)

[//]: # (	           <type>包材型号,varchar&#40;50&#41;</type>)

[//]: # (		         <quantity>包材的数量,decimal&#40;19,4&#41;</quantity>)

[//]: # (         </packageMaterial>)

[//]: # (	    </packageMaterialList>)

[//]: # (	  </package>)

[//]: # (  </packages>)

[//]: # (  <orderLines>)

[//]: # (     <orderLine>)

[//]: # (	    <itemCode>商家编码,varchar&#40;50&#41;,必填</itemCode>)

[//]: # (		<inventoryType>库存类型&#40;ZP=正品,只传英文编码&#41;,tinyint&#40;4&#41;</inventoryType>)

[//]: # (		<actualQty>实发商品数量,decimal&#40;19,4&#41;</actualQty>)

[//]: # (		<orderLineNo>单据行号,varchar&#40;50&#41;</orderLineNo>)

[//]: # (		<remark>货品备注,varchar&#40;255&#41;</remark>)

[//]: # (		<snList>      <--SN码-->)

[//]: # (		   <sn>sn码信息,varchar&#40;80&#41;</sn>)

[//]: # (		</snList>)

[//]: # (		<batchs>)

[//]: # (		   <batch>)

[//]: # (		      <batchCode>批次编号,varchar&#40;50&#41;</batchCode>)

[//]: # (			  <expireDate>过期日期&#40;YYYY-MM-DD HH:MM:SS&#41;,datetime</expireDate>)

[//]: # (			  <productDate>生产日期&#40;YYYY-MM-DD HH:MM:SS&#41;,datetime</productDate>)

[//]: # (			  <productionDate>生产日期——历史原因仍然保留老字段忽略即可&#40;YYYY-MM-DD HH:MM:SS&#41;,datetime</productionDate>)

[//]: # (			  <actualQty>实发数量&#40;要求batchs节点下所有的实发数量之和等于orderline中的实发数量&#41;,decimal&#40;19,4&#41;</actualQty>)

[//]: # (			  <inventoryType>库存类型&#40;ZP=正品,只传英文编码&#41;,tinyint&#40;4&#41;</inventoryType>)

[//]: # (		   </batch>)

[//]: # (		</batchs>)

[//]: # (	 </orderLine>)

[//]: # (  </orderLines>)

[//]: # (</request>)

[//]: # (```)

[//]: # ()
[//]: # (### 出参规范)

[//]: # ()
[//]: # (```xml)

[//]: # (<?xml version="1.0" encoding="utf-8"?>)

[//]: # (<response>)

[//]: # (  <flag>success|failure&#40;成功|失败&#41;,string,必填 </flag>)

[//]: # (  <code>错误代码,string,必填</code>)

[//]: # (  <msg>错误信息,string,必填</msg>)

[//]: # (</response>)

[//]: # (```)

[//]: # ()
[//]: # (## 退货入库单创建接口)

[//]: # ()
[//]: # (### 接口介绍)

[//]: # ()
[//]: # (接口名称（method）：WDT_WMS_RETURNORDER_CREATE)

[//]: # ()
[//]: # (调用方向：ERP→WMS)

[//]: # ()
[//]: # (注：1. 该接口和入库单的区别就是该接口是从入库单接口中单独剥离出来的，专门处理退货引起的入库操作；)

[//]: # ()
[//]: # (​        2. ERP 调用创建接口后，WMS 的响应报文 success 说明 WMS 已经将该退货入库单创建成功，而不仅仅是消息接收成功。)

[//]: # ()
[//]: # (### 入参规范)

[//]: # ()
[//]: # (```xml)

[//]: # (<?xml version="1.0" encoding="utf-8"?>)

[//]: # (<request>)

[//]: # (	<returnOrder>)

[//]: # (		<returnOrderCode>ERP的退货入库单编码,varchar&#40;50&#41;,必填,唯一值</returnOrderCode>)

[//]: # (		<warehouseCode>仓库编码,varchar&#40;50&#41;,必填</warehouseCode>)

[//]: # (		<orderType>单据类型&#40;THRK=退货入库;HHRK=换货入库;只传英文编码&#41;,tinyint&#40;4&#41;,必填</orderType>)

[//]: # (		<preDeliveryOrderCode>原出库单号&#40;ERP分配&#41;,varchar&#40;50&#41;</preDeliveryOrderCode>)

[//]: # (		<logisticsName>物流公司名称,varchar&#40;64&#41;</logisticsName>)

[//]: # (		<expressCode>运单号,varchar&#40;50&#41;</expressCode>)

[//]: # (		<buyerNick>买家昵称,varchar&#40;100&#41;</buyerNick>)

[//]: # (		<shopNick>店铺名称,archar&#40;40&#41;</shopNick>)

[//]: # (		<remark>备注,varchar&#40;255&#41;</remark>)

[//]: # (    <extendProps>扩展属性,map</extendProps>)

[//]: # (		<senderInfo>)

[//]: # (			<name>姓名,varchar&#40;40&#41;</name>)

[//]: # (			<tel>固定电话,archar&#40;32&#41;</tel>)

[//]: # (			<mobile>移动电话,varchar&#40;30&#41;</mobile>)

[//]: # (			<detailAddress>详细地址,varchar&#40;255&#41;</detailAddress>)

[//]: # (		</senderInfo>)

[//]: # (	</returnOrder>)

[//]: # (	<orderLines>)

[//]: # (		<orderLine>)

[//]: # (			<orderLineNo>单据行号单据行号&#40;订单中一个货品有多条记录时必填,保证同一个货品的orderLineNo不同&#41;,varchar&#40;50&#41;</orderLineNo>)

[//]: # (			<sourceOrderCode>原订单的交易平台订单,varchar&#40;128&#41;</sourceOrderCode>)

[//]: # (      <itemCode>商家编码,varchar&#40;50&#41;,必填</itemCode>)

[//]: # (			<itemName>货品名称,varchar&#40;255&#41;</itemName>)

[//]: # (			<inventoryType>库存类型&#40;ZP=正品;CC=残次;默认为ZP,只传英文编码&#41;,tinyint&#40;4&#41;</inventoryType>)

[//]: # (			<planQty>应收商品数量,decimal&#40;19,4&#41;,必填</planQty>)

[//]: # (			<batchCode>批次编码,varchar&#40;50&#41;</batchCode>)

[//]: # (			<expireDate>过期日期&#40;YYYY-MM-DD&#41;,datetime</expireDate>)

[//]: # (			<productDate>生产日期&#40;YYYY-MM-DD&#41;,datetime</productDate>)

[//]: # (			<remark>货品备注,varchar&#40;255&#41;</remark>)

[//]: # (		</orderLine>)

[//]: # (	</orderLines>)

[//]: # (</request>)

[//]: # (```)

[//]: # ()
[//]: # (### 出参规范)

[//]: # ()
[//]: # (```xml)

[//]: # (<?xml version="1.0" encoding="utf-8"?>)

[//]: # (<response>)

[//]: # (  <flag>success|failure&#40;成功|失败&#41;,string,必填 </flag>)

[//]: # (  <code>错误代码,string,必填</code>)

[//]: # (  <msg>错误信息,string,必填;若推送成功同时返回returnOrderId的值</msg>)

[//]: # (  <returnOrderId>WMS生成的仓储单号</returnOrderId>)

[//]: # (</response>)

[//]: # (```)

[//]: # ()
[//]: # (## 仓内加工单创建接口)

[//]: # ()
[//]: # (### 接口介绍)

[//]: # ()
[//]: # (接口名称（method）：WDT_WMS_STOREPROCESS_CREATE)

[//]: # ()
[//]: # (调用方向：ERP→WMS)

[//]: # ()
[//]: # (注：ERP 调用该接口创建生产单)

[//]: # ()
[//]: # (### 入参规范)

[//]: # ()
[//]: # (```xml)

[//]: # (<?xml version="1.0" encoding="utf-8"?>)

[//]: # (<request>)

[//]: # (	<processOrderCode>加工单编码, string &#40;50&#41; , 必填</processOrderCode>)

[//]: # (	<warehouseCode>仓库编码, string &#40;50&#41;，必填 ，统仓统配等无需 ERP 指定仓储编码的情况填 OTHER</warehouseCode>)

[//]: # (	<orderType>单据类型 CNJG=仓内加工作业单, 必填</orderType>)

[//]: # (	<orderCreateTime>加工单创建时间, string &#40;19&#41; , YYYY-MM-DD HH:MM:SS, 必填</orderCreateTime>)

[//]: # (	<planTime>计划加工时间, string &#40;19&#41; , YYYY-MM-DD HH:MM:SS, 必填</planTime>)

[//]: # (	<serviceType>加工类型:1:仓内组合加工 2:仓内组合拆分, 必填</serviceType>)

[//]: # (	<planQty>计划加工后的产品数量</planQty>)

[//]: # (	<extendProps>)

[//]: # (		<key1>value1</key1>)

[//]: # (		<key2>value2</key2>)

[//]: # (	</extendProps>)

[//]: # (	<remark>备注, string &#40;500&#41; </remark>)

[//]: # (	<materialitems> 代加工的产品		<item>)

[//]: # (			<itemCode>erp 系统商品编码, string &#40;50&#41; , 必填</itemCode>)

[//]: # (			<itemId>仓储系统商品 ID, string &#40;50&#41; , 条件必填</itemId>)

[//]: # (			<ownerCode>货主编码，string&#40;50&#41;</ownerCode>)

[//]: # (			<inventoryType>库存类型，string &#40;50&#41; , ZP=正品, CC=残次,JS=机损, XS= 箱损，默认为 ZP, </inventoryType>)

[//]: # (			<quantity>数量, int，必填</quantity>)

[//]: # (			<ratioQty>配比数量</ ratioQty>)

[//]: # (			<productDate>商品生产日期 ，string（10），YYYY-MM-DD</productDate>)

[//]: # (			<expireDate>商品过期日期，string（10），YYYY-MM-DD</expireDate>)

[//]: # (			<produceCode>生产批号, string &#40;50&#41; </produceCode>)

[//]: # (			<remark>备注, string &#40;500&#41; </remark>)

[//]: # (		</item>)

[//]: # (	</materialitems>)

[//]: # (	<productitems> 加工后的产品		<item>)

[//]: # (			<itemCode>erp 系统商品编码, string &#40;50&#41; , 必填</itemCode>)

[//]: # (			<itemId>仓储系统商品 ID, string &#40;50&#41; ,条件必填</itemId>)

[//]: # (			<ownerCode>货主编码，string&#40;50&#41;</ownerCode>)

[//]: # (			<inventoryType>库存类型，string &#40;50&#41; , ZP=正品, CC=残次,JS=机损, XS= 箱损,，默认为 ZP, </inventoryType>)

[//]: # (			<quantity>数量, int，必填</quantity>)

[//]: # (			<ratioQty>配比数量</ ratioQty>)

[//]: # (			<productDate>商品生产日期 ，string（10），YYYY-MM-DD</productDate>)

[//]: # (			<expireDate>商品过期日期，string（10），YYYY-MM-DD</expireDate>)

[//]: # (			<produceCode>生产批号, string &#40;50&#41; </produceCode>)

[//]: # (			<remark>备注, string &#40;500&#41; </remark>)

[//]: # (		</item>)

[//]: # (	</productitems>)

[//]: # (</request>)

[//]: # (```)

[//]: # ()
[//]: # (### 出参规范)

[//]: # ()
[//]: # (```xml)

[//]: # (<?xml version="1.0" encoding="utf-8"?>)

[//]: # (<response>)

[//]: # (  <flag>success|failure&#40;成功|失败&#41;,string,必填 </flag>)

[//]: # (  <code>错误代码,string,必填</code>)

[//]: # (  <msg>错误信息,string,必填</msg>)

[//]: # (  <processOrderId>仓储系统处理单 ID</processOrderId>)

[//]: # (</response>)

[//]: # (```)

[//]: # ()
[//]: # (## 仓内加工单确认接口)

[//]: # ()
[//]: # (### 接口介绍)

[//]: # ()
[//]: # (接口名称（method）：WDT_WMS_STOREPROCESS_CONFIRM)

[//]: # ()
[//]: # (调用方向：WMS→ERP)

[//]: # ()
[//]: # (注：WMS 调用确认接口后，ERP 的响应报文 success 说明 ERP 已经将该单据接收成功，而不仅仅是消息接收成功。)

[//]: # ()
[//]: # (### 入参规范)

[//]: # ()
[//]: # (```xml)

[//]: # (<?xml version="1.0" encoding="utf-8"?>)

[//]: # (<request>)

[//]: # (	<ownerCode>货主编码，string&#40;50&#41;</ownerCode>)

[//]: # (	<processOrderCode>加工单编码, string &#40;50&#41; , 必填</processOrderCode>)

[//]: # (	<processOrderId>仓储系统加工单 ID, string &#40;50&#41; , 条件必填</processOrderId>)

[//]: # (	<outBizCode>外部业务编码, 一个合作伙伴中要求唯一多次确认时, 每次传入要求唯一&#40;一般传入 WMS 损益单据编码&#41; , 必填</outBizCode>)

[//]: # (	<orderType>单据类型 ，string&#40;50&#41;，CNJG=仓内加工作业单, 必填</orderType>)

[//]: # (	<orderCompleteTime>加工单完成时间, string &#40;19&#41; , YYYY-MM-DD HH:MM:SS, 必填</orderCompleteTime>)

[//]: # (	<actualQty>实际作业总数量</actualQty>)

[//]: # (	<extendProps>扩展属性		<key1>value1</key1>)

[//]: # (		<key2>value2</key2>)

[//]: # (	</extendProps>)

[//]: # (	<remark>备注, string &#40;500&#41; </remark>)

[//]: # (	<materialitems>)

[//]: # (		<item>)

[//]: # (			<itemCode>商品编码, string &#40;50&#41; , 必填</itemCode>)

[//]: # (			<itemId>仓储系统商品 ID,string（50），条件必填</itemId>)

[//]: # (			<inventoryType>库存类型，string &#40;50&#41; , ZP=正品, CC=残次,JS=机损, XS= 箱损，默认为 ZP, </inventoryType>)

[//]: # (			<quantity>数量, 必填</quantity>)

[//]: # (			<productDate>商品生产日期 YYYY-MM-DD</productDate>)

[//]: # (			<expireDate>商品过期日期 YYYY-MM-DD</expireDate>)

[//]: # (			<produceCode>生产批号, string &#40;50&#41; </produceCode>)

[//]: # (			<batchCode>批次编码, string &#40;50&#41; </batchCode>)

[//]: # (			<remark>备注, string &#40;500&#41; </remark>)

[//]: # (		</item>)

[//]: # (	</materialitems>)

[//]: # (	<productitems>)

[//]: # (		<item>)

[//]: # (			<itemCode>商品编码, string &#40;50&#41; , 必填</itemCode>)

[//]: # (			<itemId>仓储系统商品 ID,string&#40;50&#41;， 条件必填</itemId>)

[//]: # (			<inventoryType>库存类型，string &#40;50&#41; , ZP=正品, CC=残次,JS=机损, XS= 箱损，默认为 ZP, </inventoryType>)

[//]: # (			<quantity>数量, 必填</quantity>)

[//]: # (			<productDate>商品生产日期 YYYY-MM-DD</productDate>)

[//]: # (			<expireDate>商品过期日期 YYYY-MM-DD</expireDate>)

[//]: # (			<produceCode>生产批号, string &#40;50&#41; </produceCode>)

[//]: # (			<batchCode>批次编码, string &#40;50&#41; </batchCode>)

[//]: # (			<remark>备注, string &#40;500&#41; </remark>)

[//]: # (		</item>)

[//]: # (	</productitems>)

[//]: # (</request>)

[//]: # (```)

[//]: # ()
[//]: # (### 出参规范)

[//]: # ()
[//]: # (```xml)

[//]: # (<?xml version="1.0" encoding="utf-8"?>)

[//]: # (<response>)

[//]: # (  <flag>success|failure&#40;成功|失败&#41;,string,必填 </flag>)

[//]: # (  <code>错误代码,string,必填</code>)

[//]: # (  <msg>错误信息,string,必填</msg>)

[//]: # (</response>)

[//]: # (```)

[//]: # ()
[//]: # (## 退货入库单确认接口)

[//]: # ()
[//]: # (### 接口介绍)

[//]: # ()
[//]: # (接口名称（method）：WDT_WMS_RETURNORDER_CONFIRM)

[//]: # ()
[//]: # (调用方向：WMS→ERP)

[//]: # ()
[//]: # (注：WMS 调用确认接口后，ERP 的响应报文 success 说明 ERP 已经将该退货入库单接收成功，而不仅仅是消息接收成功。)

[//]: # ()
[//]: # (### 入参规范)

[//]: # ()
[//]: # (```xml)

[//]: # (<?xml version="1.0" encoding="utf-8"?>)

[//]: # (<request>)

[//]: # (  <returnOrder>)

[//]: # (    <returnOrderCode>ERP的退货入库单编码,varchar &#40;50&#41;,必填,唯一值</returnOrderCode>)

[//]: # (    <returnOrderId>wms的退货入库单单id,varchar&#40;20&#41;</returnOrderId>)

[//]: # (    <warehouseCode>仓库编码,varchar&#40;50&#41;,必填</warehouseCode>)

[//]: # (    <orderType>单据类型&#40;THRK=退货入库;HHRK=换货入库;只传英文编码&#41;,tinyint&#40;4&#41;,必填</orderType>)

[//]: # (	  <outBizCode>外部业务编码&#40;消息ID,用于去重,ISV对于同一请求分配一个唯一性的编码,用来保证因为网络等原因导致重复传输,请求不会被重复处理&#41;,varchar&#40;50&#41;,必填</outBizCode>)

[//]: # (	  <orderConfirmTime>订单完成时间&#40;YYYY-MM-DD HH:MM:SS&#41;,datetime,必填</orderConfirmTime>)

[//]: # (    <expressCode>运单号,varchar&#40;50&#41;</expressCode>)

[//]: # (    <remark>备注信息,varchar&#40;255&#41;</remark>)

[//]: # (    <senderInfo>   )

[//]: # (      <name>姓名,varchar&#40;40&#41;</name>)

[//]: # (      <mobile>电话,varchar&#40;30&#41;</mobile>)

[//]: # (      <province>省,varchar&#40;255&#41;</province>)

[//]: # (      <city>市,varchar&#40;255&#41;</city>)

[//]: # (      <detailAddress>详细地址,varchar&#40;255&#41;</detailAddress>)

[//]: # (    </senderInfo>)

[//]: # (    <extendProps>)

[//]: # (      <buyerNo>客户编码，varchar&#40;50&#41;</buyerNo>)

[//]: # (    </extendProps>)

[//]: # (  </returnOrder>)

[//]: # (  <orderLines>)

[//]: # (    <orderLine>)

[//]: # (      <itemCode>商家编码,varchar&#40;50&#41;,必填</itemCode>)

[//]: # (      <inventoryType>库存类型&#40;ZP=正品;CC=残次;默认为ZP,只传英文编码&#41;,tinyint&#40;4&#41;</inventoryType>)

[//]: # (      <actualQty>实收商品数量,tinyint&#40;4&#41;,必填</actualQty>)

[//]: # (	    <orderLineNo>单据行号,varchar&#40;50&#41;</orderLineNo>)

[//]: # (	    <remark>货品备注,varchar&#40;255&#41;</remark>)

[//]: # (      <snList>  )

[//]: # (         <sn>商品sn信息,varchar&#40;50&#41;</sn>)

[//]: # (      </snList>)

[//]: # (      <batchs>)

[//]: # (        <batch>)

[//]: # (          <batchCode>批次编号,string&#40;50&#41;</batchCode>)

[//]: # (          <productDate>生产日期&#40;YYYY-MM-DD HH:MM:SS&#41;,datetime</productDate>)

[//]: # (          <expireDate>过期日期&#40;YYYY-MM-DD HH:MM:SS&#41;,datetime</expireDate>)

[//]: # (          <actualQty>实收数量&#40;要求batchs节点下所有的实收数量之和等于orderline中的实收数量&#41;,tinyint&#40;4&#41;</actualQty>)

[//]: # (          <inventoryType>库存类型&#40;ZP=正品;CC=残次;默认为ZP,只传英文编码&#41;,tinyint&#40;4&#41;</inventoryType>)

[//]: # (		      <extendProps>)

[//]: # (		         <goods_remark>货品备注,varchar&#40;255&#41;</goods_remark>)

[//]: # (		      </extendProps>)

[//]: # (        </batch>)

[//]: # (      </batchs>)

[//]: # (    </orderLine>)

[//]: # (  </orderLines>)

[//]: # (</request>)

[//]: # (```)

[//]: # ()
[//]: # (### 出参规范)

[//]: # ()
[//]: # (```xml)

[//]: # (<?xml version="1.0" encoding="utf-8"?>)

[//]: # (<response>)

[//]: # (  <flag>success|failure&#40;成功|失败&#41;,string,必填 </flag>)

[//]: # (  <code>错误代码,string,必填</code>)

[//]: # (  <msg>错误信息,string,必填</msg>)

[//]: # (</response>)

[//]: # (```)

[//]: # ()
[//]: # (## 取消接口)

[//]: # ()
[//]: # (### 接口介绍)

[//]: # ()
[//]: # (接口名称（method）：WDT_WMS_ORDER_CANCEL)

[//]: # ()
[//]: # (调用方向：ERP→WMS)

[//]: # ()
[//]: # (注：ERP 主动发起取消某些创建的单据, 如入库单、出库单、退货单等所有的场景。)

[//]: # ()
[//]: # (### 入参规范)

[//]: # ()
[//]: # (```xml)

[//]: # (<?xml version="1.0" encoding="utf-8"?>)

[//]: # (<request>)

[//]: # (  <warehouseCode>仓库编码,varchar&#40;50&#41;,必填</warehouseCode>)

[//]: # (	<orderCode>单据编码,varchar&#40;50&#41;,必填</orderCode>)

[//]: # (	<orderType>单据类型&#40;JYCK=一般交易出库单;HHCK= 换货出库;PTCK=普通出库单;DBCK=调拨出库;B2BCK=B2B出库;QTCK=其他出库;CGTH=采购退货出库单;BFCK=补发出库;SCCK=生产出库;SCRK=生产入库;CGRK=采购入库;DBRK= 调拨入库;QTRK=其他入库;THRK=退货入库;HHRK= 换货入库;B2BRK=B2B入库,只传英文编码&#41;,tinyint&#40;4&#41;,必填</orderType>)

[//]: # (	<cancelReason>取消原因,varchar&#40;250&#41;</cancelReason>)

[//]: # (</request>)

[//]: # (```)

[//]: # ()
[//]: # (### 出参规范)

[//]: # ()
[//]: # (```xml)

[//]: # (<?xml version="1.0" encoding="utf-8"?>)

[//]: # (<response>)

[//]: # (  <flag>success|failure&#40;成功|失败&#41;,string,必填 </flag>)

[//]: # (  <code>错误代码,string,必填</code>)

[//]: # (  <msg>错误信息,string,必填;若取消成功返回取消成功信息,若取消失败则返回具体失败原因</msg>)

[//]: # (</response>)

[//]: # (```)

## 库存查询接口(多商品)

### 接口介绍

接口名称（method）：WDT_WMS_INVENTORY_QUERY

调用方向：ERP→WMS

注：ERP 主动查询WMS系统内商品的库存情况。

### 入参规范

```xml
<?xml version="1.0" encoding="utf-8"?>
<request>
	<criteriaList>   <--查询准则-->
		<criteria>
			<warehouseCode>仓库编码,varchar(50),必填</warehouseCode>
			<ownerCode>货主编码,varchar(50),必填</ownerCode>
			<itemCode>商家编码,varchar(50),必填</itemCode>
			<inventoryType>库存类型(ZP=正品;CC=残次。默认为查所有类型的库存,只传英文编码),tinyint(4)</inventoryType>
			<remark>备注,varchar(255)</remark>
		</criteria>
	</criteriaList>
	<remark>备注,varchar(255)</remark>
</request>
```

### 出参规范

```json
{
  "code": 200,
  "total": null,
  "msg": "查询成功",
  "data": {
    "flag": "success",
    "code": "0",
    "message": "旺店通WMS返回：库存查询成功",
    "items": [
      {
        "warehouseCode": "WarehouseNo1",
        "itemCode": "ITEM20240001",
        "itemId": "",
        "inventoryType": "ZP",
        "quantity": 50,
        "lockQuantity": 0,
        "batchCode": "20251018",
        "productDate": "2025-10-18",
        "expireDate": "2025-11-17",
        "produceCode": ""
      },
      {
        "warehouseCode": "WarehouseNo1",
        "itemCode": "ITEM20240001",
        "itemId": "",
        "inventoryType": "ZP",
        "quantity": 100,
        "lockQuantity": 0,
        "batchCode": "20251117",
        "productDate": "2025-11-17",
        "expireDate": "2026-01-06",
        "produceCode": ""
      }
    ]
  }
}
```

[//]: # ()
[//]: # (## 商品查询接口)

[//]: # ()
[//]: # (### 接口介绍)

[//]: # ()
[//]: # (接口名称（method）：WDT_WMS_SINGLEITEM_QUERY)

[//]: # ()
[//]: # (调用方向：ERP→WMS)

[//]: # ()
[//]: # (注：ERP 主动查询 WMS 系统内的商品详情。)

[//]: # ()
[//]: # (### 入参规范)

[//]: # ()
[//]: # (```xml)

[//]: # (<?xml version="1.0" encoding="utf-8"?>)

[//]: # (<request>)

[//]: # (	<ownerCode>货主编码,varchar&#40;50&#41;</ownerCode>)

[//]: # (	<itemCode>商家编码,varchar&#40;50&#41;,必填</itemCode>)

[//]: # (</request>)

[//]: # (```)

[//]: # ()
[//]: # (### 出参规范)

[//]: # ()
[//]: # (```xml)

[//]: # (<?xml version="1.0" encoding="utf-8"?>)

[//]: # (<response>)

[//]: # (  <flag>success|failure&#40;成功|失败&#41;,string,必填 </flag>)

[//]: # (  <code>错误代码,string,必填</code>)

[//]: # (  <msg>错误信息,string,必填;若查询失败则返回具体失败信息;若查询成功则返回商品信息</msg>)

[//]: # (	<item>)

[//]: # (		<itemCode>商家编码,varchar&#40;50&#41;,必填</itemCode>)

[//]: # (		<length>长&#40;厘米&#41;,Number</length>)

[//]: # (		<width>宽&#40;厘米&#41;,Number</width>)

[//]: # (		<height>高&#40;厘米&#41;,Number</height>)

[//]: # (		<volume>体积&#40;升&#41;,Number</volume>)

[//]: # (		<grossWeight>毛重&#40;千克&#41;,Number</grossWeight>)

[//]: # (		<netWeight>净重&#40;千克&#41;,Number</netWeight>)

[//]: # (		<packageMaterial>商品包装材料类型,varchar&#40;50&#41;</packageMaterial>)

[//]: # (		<remark>备注,varchar&#40;255&#41;</remark>)

[//]: # (	</item>)

[//]: # (</response>)

[//]: # (```)

[//]: # ()
[//]: # (## 单据挂起接口)

[//]: # ()
[//]: # (### 接口介绍)

[//]: # ()
[//]: # (接口名称（method）：WDT_WMS_ORDER_PENDING)

[//]: # ()
[//]: # (调用方向：ERP→WMS)

[//]: # ()
[//]: # (注：完结部分出入库状态的单据为已完成状态。)

[//]: # ()
[//]: # (### 入参规范)

[//]: # ()
[//]: # (```xml)

[//]: # (<?xml version="1.0" encoding="utf-8"?>)

[//]: # (<request>)

[//]: # (	<actionType>操作类型:pending=挂起,varchar&#40;50&#41;,必填</actionType>)

[//]: # (	<warehouseCode>仓库编码,varchar&#40;50&#41;,必填</warehouseCode>)

[//]: # (	<orderCode>单据编码,varchar&#40;50&#41;,必填</orderCode>)

[//]: # (	<orderType>单据类型&#40;CGTH=采购退货出库单;PTCK=普通出库单;DBCK=调拨出库;B2BCK=B2B出库;QTCK=其他出库;SCCK=生产出库;B2BRK=B2B入库;SCRK=生产入库;CGRK=采购入库;DBRK=调拨入库;QTRK=其他入库;XTRK=销退入库;THRK=退货入库;HHRK=换货入库;CGTH=采购退货出库单,只传英文编码&#41;,tinyint&#40;4&#41;,必填</orderType>)

[//]: # (	<reason>挂起原因,varchar&#40;250&#41;</reason>)

[//]: # (</request>)

[//]: # (```)

[//]: # ()
[//]: # (### 出参规范)

[//]: # ()
[//]: # (```xml)

[//]: # (<?xml version="1.0" encoding="utf-8"?>)

[//]: # (<response>)

[//]: # (  <flag>success|failure&#40;成功|失败&#41;,string,必填 </flag>)

[//]: # (  <code>错误代码,string,必填</code>)

[//]: # (  <msg>错误信息,string,必填</msg>)

[//]: # (</response>)

[//]: # (```)

[//]: # ()
[//]: # (## 单据流水查询接口)

[//]: # ()
[//]: # (### 接口介绍)

[//]: # ()
[//]: # (接口名称（method）：WDT_WMS_ORDER_PROCESS_QUERY)

[//]: # ()
[//]: # (调用方向：ERP→WMS)

[//]: # ()
[//]: # (注：查询发货单各个节点的状态：称重、打印、拣货、验货、打包、已发货。)

[//]: # ()
[//]: # (### 入参规范)

[//]: # ()
[//]: # (```xml)

[//]: # (<?xml version="1.0" encoding="utf-8"?>)

[//]: # (<request>)

[//]: # (	<warehouseCode>仓库编码,varchar&#40;50&#41;,必填</warehouseCode>)

[//]: # (	<orderCode>单据编码,varchar&#40;50&#41;,必填</orderCode>)

[//]: # (	<orderType>单据类型,JYCK=一般交易出库单,tinyint&#40;4&#41;,必填</orderType>)

[//]: # (</request>)

[//]: # (```)

[//]: # ()
[//]: # (### 出参规范)

[//]: # ()
[//]: # (```xml)

[//]: # (<?xml version="1.0" encoding="utf-8"?>)

[//]: # (<response>)

[//]: # (  <flag>success|failure&#40;成功|失败&#41;,string,必填 </flag>)

[//]: # (  <code>错误代码,string,必填</code>)

[//]: # (  <msg>错误信息,string,必填;若查询失败,则返回具体失败信息;若查询成功则返回订单流水信息</msg>)

[//]: # (	<orderProcess>)

[//]: # (		<orderCode>单据编码,varchar&#40;50&#41;,必填</orderCode>)

[//]: # (		<orderType>单据类型,JYCK=一般交易出库单,tinyint&#40;4&#41;,必填</orderType>)

[//]: # (		<warehouseCode>仓库编码,varchar&#40;50&#41;,必填</warehouseCode>)

[//]: # (		<processes>)

[//]: # (			<process>)

[//]: # (				<processStatus>单据状态&#40;NEW=新增;ACCEPT=仓库接单;PRINT=打印;PICK=捡货;CHECK=复核;PACKAGE=打包;WEIGH=称重;READY=待提货;DELIVERED=已发货;EXCEPTION=异常;CLOSED=关闭;CANCELED=取消;REJECT=仓库拒单;REFUSE=客户拒签;CANCELEDFAIL=取消失败;SIGN=签收;TMSCANCELED=快递拦截;TMSCANCELFAILED=快递拦截失败;PARTFULFILLED-部分收货完成;FULFILLED-收货完成;PARTDELIVERED=部分发货完成;OTHER=其他,只传英文编码&#41;,varchar&#40;50&#41;,必填</processStatus>)

[//]: # (				<operatorName>该状态操作员姓名,varchar&#40;50&#41;</operatorName>)

[//]: # (				<operateTime>该状态操作时间,varchar&#40;50&#41;</operateTime>)

[//]: # (			</process>)

[//]: # (		</processes>)

[//]: # (	</orderProcess>)

[//]: # (</response>)

[//]: # (```)

[//]: # ()
[//]: # (## 盘点单通知接口)

[//]: # ()
[//]: # (### 接口介绍)

[//]: # ()
[//]: # (接口名称（method）：WDT_WMS_INVENTORY_REPORT)

[//]: # ()
[//]: # (调用方向：WMS→ERP)

[//]: # ()
[//]: # (注：WMS 主动向 ERP 回传盘盈入库单、盘亏出库单。)

[//]: # ()
[//]: # (### 入参规范)

[//]: # ()
[//]: # (```xml)

[//]: # (<?xml version="1.0" encoding="utf-8"?>)

[//]: # (<request>)

[//]: # (  <totalPage>总页数,number,必填</totalPage>)

[//]: # (  <currentPage>当前页&#40;从1开始&#41;,number,必填</currentPage>)

[//]: # (  <pageSize>每页记录的条数,number,必填</pageSize>)

[//]: # (  <warehouseCode>仓库编码,varchar&#40;50&#41;,必填</warehouseCode>)

[//]: # (  <checkOrderCode>盘点单编码,varchar&#40;50&#41;,必填</checkOrderCode>)

[//]: # (  <checkOrderId>仓储系统的盘点单编码,varchar&#40;50&#41;</checkOrderId>)

[//]: # (  <pdType>盘点方案&#40;0=部分盘点;1=全部盘点;2=货位盘点;3=单品盘点;4=异常货位盘点,只传数字编码&#41;,tinyint&#40;4&#41;</pdType>)

[//]: # (  <ownerCode>货主编码,varchar&#40;50&#41;,必填</ownerCode>)

[//]: # (  <checkTime>盘点时间&#40;YYYY-MM-DD HH:MM:SS&#41;,datetime</checkTime>)

[//]: # (  <outBizCode>外部业务编码&#40;消息ID,用于去重,ISV对于同一请求分配一个唯一性的编码,用来保证因为网络等原因导致重复传输,请求不会被重复处理&#41;,tinyint&#40;4&#41;,必填</outBizCode>)

[//]: # (  <remark>备注,varchar&#40;255&#41;</remark>)

[//]: # (  <items>     <--商品库存信息列表-->)

[//]: # (    <item>)

[//]: # (	    <itemCode>商家编码,varchar&#40;50&#41;,必填</itemCode>)

[//]: # (		  <inventoryType>库存类型&#40;ZP=正品;CC=残次&#41;,tinyint&#40;4&#41;</inventoryType>)

[//]: # (		  <quantity>盘盈盘亏商品变化量&#40;盘盈为正数;盘亏为负数&#41;,decimal&#40;19,4&#41;,必填</quantity>)

[//]: # (		  <batchCode>批次编码,varchar&#40;50&#41;</batchCode>)

[//]: # (		  <expireDate>商品过期日期&#40;YYYY-MM-DD HH:MM:SS&#41;,datetime</expireDate>)

[//]: # (		  <remark>备注,varchar&#40;255&#41;</remark>)

[//]: # (		  <newNum>实际盘点量,decimal&#40;19,4&#41;</newNum>)

[//]: # (	  </item>)

[//]: # (  </items>)

[//]: # (</request>)

[//]: # (```)

[//]: # ()
[//]: # (### 出参规范)

[//]: # ()
[//]: # (```xml)

[//]: # (<?xml version="1.0" encoding="utf-8"?>)

[//]: # (<response>)

[//]: # (  <flag>success|failure&#40;成功|失败&#41;,string,必填 </flag>)

[//]: # (  <code>错误代码,string,必填</code>)

[//]: # (  <msg>错误信息,string,必填</msg>)

[//]: # (</response>)

[//]: # (```)

[//]: # ()
[//]: # (## 库存异动通知接口)

[//]: # ()
[//]: # (### 接口介绍)

[//]: # ()
[//]: # (接口名称（method）：WDT_WMS_STOCKCHANGE_REPORT)

[//]: # ()
[//]: # (调用方向：WMS→ERP)

[//]: # ()
[//]: # (注：WMS 主动发起的调拨单、智能退货入库单（预入库）、借调单、生产单、未知出入库单、纠错单等，通过该接口回传 ERP。)

[//]: # ()
[//]: # (### 入参规范)

[//]: # ()
[//]: # (```xml)

[//]: # (<?xml version="1.0" encoding="utf-8"?>)

[//]: # (<request>)

[//]: # (   <items>)

[//]: # (      <item>)

[//]: # (	     <ownerCode>货主编码,varchar&#40;50&#41;,必填</ownerCode>)

[//]: # (		   <warehouseCode>仓库编码,varchar&#40;50&#41;,必填</warehouseCode>)

[//]: # (		   <orderCode>引起异动的单据编码,varchar&#40;20&#41;,必填</orderCode>)

[//]: # (		   <srcOrderNo>引起异动的单据仓储单号,varchar&#40;50&#41;</srcOrderNo>)

[//]: # (		   <orderType>单据类型&#40;THYRK=智能退货入库;未知出入库/WMS开的调拨单/借调单/生产单=QTRK/QTCK,只传英文编码&#41;,tinyint&#40;4&#41;</orderType>)

[//]: # (		   <outBizCode>外部业务编码&#40;消息ID,用于去重,ISV对于同一请求分配一个唯一性的编码,用来保证因为网络等原因导致重复传输,请求不会被重复处理&#41;,tinyint&#40;4&#41;,必填</outBizCode>)

[//]: # (		   <remark>备注信息,varchar&#40;255&#41;</remark>)

[//]: # (		   <itemCode>商家编码,varchar&#40;50&#41;,必填</itemCode>)

[//]: # (		   <inventoryType>库存类型&#40;ZP=正品;CC=残次,只传英文编码&#41;,tinyint&#40;4&#41;</inventoryType>)

[//]: # (		   <quantity>商品变化数量&#40;可正可负,默认全为正数&#41;,decimal&#40;19,4&#41;,必填</quantity>)

[//]: # (		   <changeTime>异动时间&#40;YYYY-MM-DD HH:MM:SS&#41;,datetime</changeTime>)

[//]: # (       <goodsNo>货品编号,varchar&#40;50&#41;,必填</goodsNo>)

[//]: # (	  	 <batchs>)

[//]: # (		     <batch>)

[//]: # (			     <batchCode>批次编码,varchar&#40;50&#41;</batchCode>)

[//]: # (			     <productDate>商品生产日期&#40;YYYY-MM-DD HH:MM:SS&#41;,datetime</productDate>)

[//]: # (			     <expireDate>商品过期日期&#40;YYYY-MM-DD HH:MM:SS&#41;,datetime</expireDate>)

[//]: # (			     <quantity>异动数量,decimal&#40;19,4&#41;</quantity>)

[//]: # (			     <inventoryType>库存类型&#40;ZP=正品;CC=残次,只传英文编码&#41;,tinyint&#40;4&#41;</inventoryType>)

[//]: # (			     <extendProps>)

[//]: # (			        <goods_remark>货品备注,varchar&#40;255&#41;</goods_remark>)

[//]: # (			     </extendProps>)

[//]: # (			  </batch>)

[//]: # (	     </batchs>)

[//]: # (	  </item>)

[//]: # (   </items>)

[//]: # (   <extendProps>)

[//]: # (      <expressCode>物流单号&#40;orderType=THYRK时返回&#41;,varchar&#40;40&#41;</expressCode>)

[//]: # (	    <logisticsCode>物流公司编码&#40;orderType=THYRK时返回&#41;,varchar&#40;50&#41;</logisticsCode>)

[//]: # (	    <logisticsName>物流公司名字&#40;orderType=THYRK时返回,varchar&#40;64&#41;</logisticsName>)

[//]: # (	    <buyerNick>买家网名&#40;orderType=THYRK时返回&#41;,varchar&#40;100&#41;</buyerNick>)

[//]: # (	    <senderName>发货人名字&#40;orderType=THYRK时返回&#41;,varchar&#40;40&#41;</senderName>)

[//]: # (	    <senderMobile>发货人电话&#40;orderType=THYRK时返回&#41;,varchar&#40;30&#41;</senderMobile>)

[//]: # (	    <src_order_type>WMS开的借调单返回,varchar&#40;40&#41;</src_order_type>)

[//]: # (	    <wdtwms_src_order_no>WMS开的借调单返回,varchar&#40;40&#41;</wdtwms_src_order_no>)

[//]: # (	    <wdtwms_in_owner_no>WMS开的借调单返回,varchar&#40;40&#41;</wdtwms_in_owner_no>)

[//]: # (	    <wdtwms_in_warehouse_no>WMS开的借调单返回,varchar&#40;40&#41;</wdtwms_in_warehouse_no>)

[//]: # (     	<isWdtWmsType>WMS类型,varchar&#40;40&#41;</isWdtWmsType>)

[//]: # (			<process_num>实际生产次数（不回传默认为1）,int&#40;11&#41;</process_num>)

[//]: # (			<process_amount>生产实际费用,decimal&#40;19,4&#41; </process_amount>)

[//]: # (      <srcOrderNo>WMS开的库存操作业务单返回,varchar&#40;40&#41;</srcOrderNo>)

[//]: # (   </extendProps>)

[//]: # (</request>)

[//]: # (```)

[//]: # ()
[//]: # (### 出参规范)

[//]: # ()
[//]: # (```xml)

[//]: # (<?xml version="1.0" encoding="utf-8"?>)

[//]: # (<response>)

[//]: # (  <flag>success|failure&#40;成功|失败&#41;,string,必填 </flag>)

[//]: # (  <code>错误代码,string,必填</code>)

[//]: # (  <msg>错误信息,string,必填</msg>)

[//]: # (</response>)

[//]: # (```)

[//]: # ()
[//]: # (## **订单异常通知接口**)

[//]: # ()
[//]: # (### 接口介绍)

[//]: # ()
[//]: # (接口名称（method）：WDT_WMS_ORDEREXCEPTION_REPORT)

[//]: # ()
[//]: # (调用方向：WMS→ERP)

[//]: # ()
[//]: # (接口说明：仓库仓内操作异常状态回传给 ERP)

[//]: # ()
[//]: # (### 入参规范)

[//]: # ()
[//]: # (```xml)

[//]: # (<?xml version="1.0" encoding="utf-8"?>)

[//]: # (<request>)

[//]: # (  <messageId>异常消息 ID, string &#40;50&#41;，必填</messageId>)

[//]: # (  <warehouseCode>仓库编码, string &#40;50&#41;，必填</warehouseCode>)

[//]: # (  <deliveryOrderCode>出库单号, string &#40;50&#41; , 必填</deliveryOrderCode>)

[//]: # (  <orderType>出库单类型, string &#40;50&#41; , 必填, JYCK=一般交易出库单, HHCK=换货出库单, BFCK=补发出库单，QTCK=其他出库单</orderType>)

[//]: # (  <logisticsCode>物流公司编码, string &#40;50&#41; ,必填, &#40;只传英文编码&#41; </logisticsCode>)

[//]: # (  <expressCode>运单号, string &#40;50&#41; </expressCode>)

[//]: # (  <messageType>异常信息类型，101=系统报缺（有商品信息），102=实物报缺（有商品信息），201=配送延迟，202=拒收退件，203=包裹丢失，1778=疫情停发</messageType>)

[//]: # (  <messageDesc>异常消息描述, string &#40;50&#41; </messageDesc>)

[//]: # (  <createTime>发货单创建时间, string &#40;19&#41; , YYYY-MM-DD HH:MM:SS, 必填 </createTime>)

[//]: # (  <orderLines>)

[//]: # (    <orderLine>)

[//]: # (      <itemCode>商品编码, string &#40;50&#41; , 必填</itemCode>)

[//]: # (      <orderLineNo>单据行号，string（50）</orderLineNo>)

[//]: # (      <ownerCode>货主编号</ownerCode>)

[//]: # (      <inventoryType>库存类型，string &#40;50&#41; , ZP=正品, CC=残次,JS=机损, XS= 箱损, ZT=在途库存，DJ=冻结，默认为查所有类型的库存</inventoryType>)

[//]: # (      <actualQty>实发商品数量, int</actualQty>)

[//]: # (      <planQty>应发商品数量, int, 必填</planQty>)

[//]: # (      <outBizCode>string &#40;50&#41; , 外部业务编码, 消息 ID, 用于去重, ISV 对于同一请求，分配一个唯一性的编码。用来保证因为网络等原因导致重复传输，请求不会被重复处理，条件必填，条件为一单需要多次确认时 </outBizCode>)

[//]: # (      <itemId>仓储系统商品编码, string &#40;50&#41; ,条件必填</itemId>)

[//]: # (    </orderLine>)

[//]: # (  </orderLines>)

[//]: # (</request>)

[//]: # (```)

[//]: # ()
[//]: # (### 出参规范)

[//]: # ()
[//]: # (```xml)

[//]: # (<?xml version="1.0" encoding="utf-8"?>)

[//]: # (<response>)

[//]: # (  <flag>success|failure&#40;成功|失败&#41;,string,必填 </flag>)

[//]: # (  <code>错误代码,string,必填</code>)

[//]: # (  <msg>错误信息,string,必填</msg>)

[//]: # (</response>)

[//]: # (```)

