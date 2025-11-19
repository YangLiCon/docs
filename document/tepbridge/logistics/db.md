# 德邦物流开放平台对接记录

## 一、下单服务接口

> **业务约束**

 该接口注意事项：① 下单模式字段要传值正确； ② 产品类型请与我司业务确认清楚后进行传值，否则可能影响后端计费。
1、如用户有子母件需求(快递），需在上线前告知销售或网点负责人，我司在系统中配置子母件权限，否则按子母件下单方式下单时会退回；
2、散客电子面单不支持子母件，即orderType=1  
3、子母件下单方式仅适用于大客户下单模式，且运输方式为快递或者新零担：         
A、 同一渠道单号一次下单，德邦返回与“总件数”数量相等的运单号（单次下单总件数上限为30件，如果大于30请分多次下单），我司系统根据相同渠道单号将不同运单号建立子母件关联关系；
B、同一渠道单号多次下单，德邦每次返回不同的运单号，我司系统根据相同渠道单号将不同运单号建立子母件关联关系；散客电子面单多次下单会提示下单重复。
沙箱环境需要下子母件订单必须"客户编码 customerCode" 传值 219401；
4、老零担是一票多件模式，一个订单号无论多少件，仅会回传一个运单号，打印面单时客户需要拼接流水号生成条码；

### 1.1 下单服务接口请求参数

```json
{
  "companyCode": "EWBSJGZWLG",
  "custOrderNo": "QA20250521",
  "customerCode": "822017540",
  "logisticID": "RNUD20250521",
  "needTraceInfo": 1,
  "orderType": "2",
  "packageInfo": {
    "cargoName": "联想笔记本电脑",
    "deliveryType": "4",
    "totalNumber": 1,
    "totalVolume": 0.01,
    "totalWeight": 1,
    "packageService": "纸"
  },
  "receiver": {
    "address": "连云路169号",
    "city": "广州市",
    "companyName": "德邦快递",
    "county": "黄埔区",
    "mobile": "19292082784",
    "name": "张三",
    "province": "广东省",
    "town": "连云路"
  },
  "sender": {
    "address": "骏业路255号",
    "city": "广州市",
    "companyName": "德邦快递",
    "county": "黄埔区",
    "mobile": "15685585514",
    "name": "董航",
    "province": "广东省",
    "town": "骏业路"
  },
  "transportType": "PACKAGE",
  "gmtCommit": "2019-05-20 18:44:19",
  "payType": "1",
  "isOut": "N",
  "orderExtendFields": [
    {
      "key": "custewb_number",
      "value": "WP0000201101"
    },
    {
      "key": "notifyDeliver",
      "value": "N"
    },
    {
      "key": "pickupCode",
      "value": "2103"
    },
    {
      "key": "photoSigning",
      "value": "N"
    },
    {
      "key": "returnBillQty",
      "value": "1"
    }
  ]
}
```

### 1.2 返回报文

> 参数说明

- mailNo：运单号集合，如：DPK360000000000,DPK380000000001,DPK380000000002,生产环境一般DPK36开头为母单号且排在第一位，零担一个订单无论多少件仅会返回一个运单号
- result：请求成功标识
- reason：错误原因
- logisticID：失败返回订单号（对方下单的订单号）
- arrivedOrgSimpleName：目的站部门简称
- resultCode：结果代码
- uniquerRequestNumber：请求唯一编号

```json
{
	"result":"true",
	"reason":"成功",
	"mailNo":"DPK6234021100151",
	"logisticID":"RNUD20250521",
	"arrivedOrgSimpleName":"广东省广州市",
	"resultCode":"1000",
	"uniquerRequestNumber":"60480442125126211"
}
```

```json
{
	"result":"true",
	"reason":"成功",
	"mailNo":"DPK6420809545864",
	"logisticID":"RNUD20250522",
	"arrivedOrgSimpleName":"广东省广州市",
	"resultCode":"1000",
	"uniquerRequestNumber":"60482218629489145"
}
```

## 二、物流轨迹推送结果(德邦--->智桥erp)

``` java
params-{"track_list":[{"trace_list":[{"city":"广州市","description":"您的订单已被收件员揽收,【广州市黄埔区***营业部】库存中","site":"广州市转运中心/营业部/枢纽中心","status":"GOT","time":"2025-05-21 12:10:08"}],"tracking_number":"DPK6234021100151"}]}
digest-YmUyNmJhYzBkOGFlNjVkYTNmNzA0ZWVmMDE1MGZlMzE=
timestamp-1747817474304
companyCode-EWBSJGZWLG
params-{"track_list":[{"trace_list":[{"city":"广州市","description":"货物已到达【***营业部】部门","site":"【***】营业部","status":"ARRIVAL","time":"2025-05-21 17:10:08"}],"tracking_number":"DPK6234021100151"}]}
digest-NGYwZDI4MGNhOTY3NzhlZjhlZmFjZmY2ZTJkZWRkZjk=
timestamp-1747817605339
companyCode-EWBSJGZWLG
params-{"track_list":[{"trace_list":[{"city":"广州市","description":"运输中,离开【广州市转运中心】,下一站【***营业部】(出发到达对应多个)","site":"****转运中心/营业部/枢纽中心","status":"DEPARTURE","time":"2025-05-21 14:10:08"}],"tracking_number":"DPK6234021100151"}]}
digest-MjY5NGQ2ZTMyYTQwZDY4ODFjNjc3ZDY1MjQ1NTFkOGE=
timestamp-1747817611246
companyCode-EWBSJGZWLG
params-{"track_list":[{"trace_list":[{"city":"广州市","description":"派送中,派送人:**,派送人电话:***********","site":"【***】营业部","status":"SENT_SCAN","time":"2025-05-21 20:10:08"}],"tracking_number":"DPK6234021100151"}]}
digest-NTA4OTY4NDRlNWE0OTljNzIwMjQ1ZWU4MDg0ZDQyMDg=
timestamp-1747817614654
companyCode-EWBSJGZWLG
params-{"track_list":[{"trace_list":[{"city":"广州市","description":"正常签收,签收人类型:本人/同事/门卫 等","site":"【***】营业部","status":"SIGNED","time":"2025-05-21 23:10:08"}],"tracking_number":"DPK6234021100151"}]}
digest-ZGZmOTI0ODhiMzI3OWNkMTE1OGI0YzQ0OTE5ZWZlZWY=
timestamp-1747817619071
companyCode-EWBSJGZWLG
```

## 三、查询订单接口

> 返回报文字段

| 字段                                                         |     变量名     | 描述                                                         | 类型       | 长度        | 是否必填 |
| ------------------------------------------------------------ | :------------: | ------------------------------------------------------------ | ---------- | ----------- | -------- |
| logisticCompanyID                                            |   物流公司ID   | 为“DEPPON”                                                   | String     | 32          | Y        |
| logisticID                                                   |    渠道单号    | 由第三方接入商产生的订单号                                   | String     | 32          | Y        |
| mailNo                                                       |     运单号     | 德邦物流生成的运单号                                         | String     | 32          | N        |
| businessNetworkNo                                            |  出发部门编码  | 德邦物流营业部门编码                                         | String     | 32          | N        |
| toNetworkNo                                                  |  到达部门编码  | 德邦物流营业部门编码                                         | String     | 32          | N        |
| + sender发货人信息SenderYL companyName发货人公司String100NL name发货人名称String100YL postCode发货人邮编String10NL phone发货人电话String32YL mobile发货人手机String15YL province发货人省份String32YL city发货人城市String32YL address发货人详细地址String256YL street发货人街道String32N |                |                                                              |            |             |          |
| + receiver收货人信息ReceiverYL companyName收货人公司String100NL name收货人名称String100YL postCode收货人邮编String10NL phone收货人电话String32YL mobile收货人手机String15YL province收货人省份String32YL city收货人城市String32YL address收货人详细地址String256YL street收货人街道String32NL country收货人区县String32N |                |                                                              |            |             |          |
| cargoName                                                    |    货物名称    |                                                              | String     | 30          | Y        |
| totalNumber                                                  |     总件数     |                                                              | int        |             | Y        |
| totalWeight                                                  |     总重量     | 单位:kg,母单号显示母件加子件的重量总和,子单号则仅显示子单号单件重量 | double     | Double(5,2) | Y        |
| totalVolume                                                  |     总体积     | 单位:m³,母单号显示母件加子件的体积总和,子单号则仅显示子单号单件体积 | double     | Double(5,2) | Y        |
| payType                                                      |    支付方式    | 可能值：0或CH:发货人付款(现付)， 1或FC:收货人付款(到付)，2或CT:月结，3或OL:网上支付，4或CD:银行卡支付，5或DT:临时欠款，MP:移动支付 | String     | 1           | Y        |
| insuranceValue                                               |    保价金额    | 单位:元                                                      | BigDecimal |             | N        |
| codType                                                      |  代收货款类型  | 3：三日退 1：即日退 0：无代收                                | String     | 2           | N        |
| codValue                                                     |    代收货款    | 单位:元                                                      | BigDecimal |             | N        |
| codPrice                                                     |   代收货款费   | 单位:元,仅母单号显示费用,子单号默认0                         | BigDecimal |             | N        |
| vistReceive                                                  |    上门接货    | Y/N                                                          | String     | 1           | N        |
| deliveryType                                                 |    送货方式    | 0:自提 1:送货（不含上楼） 2:机场自提 3:送货上楼              | String     | 2           | N        |
| backSignBill                                                 |    签收回单    | NO_RETURN_SIGNED：无需返单； CUSTOMER_SIGNED_ORIGINAL：签收单原件返回；CUSTOMER_SIGNED_FAX:电子签收单 | String     | 2           | N        |
| packageService                                               |      包装      | 包装（直接用中文） ：纸、纤、木箱、木架、托膜、托木          | String     | 32          | N        |
| smsNotify                                                    |    短信通知    |                                                              | String     | 1           | N        |
| remark                                                       |      备注      |                                                              | String     | 100         | Y        |
| transportPrice                                               |    运输费用    | 单位:元,仅母单号显示费用,子单号默认0                         | BigDecimal |             | N        |
| totalPrice                                                   |     总价格     | 单位:元,仅母单号显示费用,子单号默认0                         | BigDecimal |             | N        |
| vistReceivePrice                                             |   上门接货费   | 单位:元,仅母单号显示费用,子单号默认0                         | BigDecimal |             | N        |
| deliveryPrice                                                |    送货费用    | 单位:元,仅母单号显示费用,子单号默认0                         | BigDecimal |             | N        |
| backSignBillPrice                                            |   签收回单费   | 单位:元,仅母单号显示费用,子单号默认0                         | BigDecimal |             | N        |
| packageServicePrice                                          |   包装服务费   | 单位:元,仅母单号显示费用,子单号默认0                         | BigDecimal |             | N        |
| smsNotifyPrice                                               |  短信通知费用  | 单位:元,仅母单号显示费用,子单号默认0                         | BigDecimal |             | N        |
| otherPrice                                                   |    其他费用    | 单位:元,仅母单号显示费用,子单号默认0                         | BigDecimal |             | N        |
| fuelSurcharge                                                |    燃油附加    | Y/N                                                          | String     | 1           | N        |
| fuelSurchargePrice                                           |   燃油附加费   | 单位:元,仅母单号显示费用,子单号默认0                         | BigDecimal |             | N        |
| statusType                                                   |    订单状态    | (返回的是文字)ACCEPT：已受理； GOT：已开单； SIGNSUCCESS：正常签收； SIGNFAILED：异常签收； RECEIPTING：接货中； CANCEL： 已撤销； GOBACK：已退回； FAILGOT：揽货失败；INVALID：已作废 | String     | 32          | N        |
| waitNotifySendPrice                                          | 等通知发货费用 | 单位:元,仅母单号显示费用,子单号默认0                         | BigDecimal |             | N        |
| waitNotifySend                                               | 是否等通知发货 |                                                              | String     | 32          | N        |
| Comments                                                     |    反馈原因    |                                                              | String     |             | N        |
| memberType                                                   |    会员类型    |                                                              | String     | 32          | N        |
| insurancePrice                                               |     保价费     | 单位:元,仅母单号显示费用,子单号默认0                         | BigDecimal |             | N        |
| transportType                                                |    运输方式    | 下单时对应下单运输方式；揽收后对应实际运输方式               | String     | 32          | N        |

> 返回结果

```json
{
	"result":"true",
	"reason":"",
	"resultCode":"1000",
	"responseParam":{
		"cargoName":"联想笔记本电脑",
		"codPrice":0.0,
		"codType":"0",
		"codValue":0.0,
		"insurancePrice":0.0,
		"insuranceValue":0.0,
		"logisticCompanyID":"DEPPON",
		"logisticID":"RNUD20250521",
		"mailNo":"DPK6234021100151",
		"packageService":"纸",
		"receiver":{
			"address":"连云路169号",
			"city":"广州市",
			"country":"黄埔区",
			"mobile":"19292082784",
			"name":"张三",
			"originalAddress":"",
			"postCode":"",
			"province":"广东省",
			"street":""
		},
		"sender":{
			"address":"骏业路255号",
			"city":"广州市",
			"country":"黄埔区",
			"mobile":"15685585514",
			"name":"董航",
			"originalAddress":"",
			"postCode":"",
			"province":"广东省",
			"street":""
		},
		"smsNotify":"YES",
		"statusType":"已开单",
		"totalNumber":1,
		"totalVolume":0.01,
		"totalWeight":1.0,
		"transportType":"PACKAGE",
		"vistReceive":"YES",
		"waitNotifySend":"NO"
	},
	"uniquerRequestNumber":"60503190258920446"
}
```



## 四、打印SDK案例

[//]: # (![image-20250521171825608]&#40;D:\其他\系统对接\德邦物流开放平台\JAVASDK\JAVASDK\image-20250521171825608.png&#41;)