# 顺丰物流开放平台对接记录(沙箱环境)

## 一、下订单接口

#### 下订单接口-速运类API（国内件、大陆港澳台互寄件）

------

###### 1. 功能描述

- 下订单接口根据客户需要,可提供以下五个功能:

  ● 客户系统向顺丰下发订单（大陆寄往大陆、港澳台，港澳台寄往大陆或港澳台），其他国际流向请对接[国际API](https://open.sf-express.com/Api?category=101&apiClassify=1)

  ● 为订单分配运单号。

  ● 筛单。

  ● 云打印面单推送（可选）。
  提供给用户自主打单的服务，打印好的面单会直接推送到用户配置的地址

  ● 路由轨迹，对接路由推送接口后下单，有路由轨迹数据产生会自动推送到路由推送接口配置的URL地址

注：专线对接客户请提前联系客户经理确认对接方案后再进行对接。

##### 2. 接口定义

###### 2.1. 公共参数

| 名称         | 值                                            |
| ------------ | --------------------------------------------- |
| 接口服务代码 | EXP_RECE_CREATE_ORDER                         |
| 生产环境地址 | https://bspgw.sf-express.com/std/service      |
| 香港生产环境 | https://sfapi-hk.sf-express.com/std/service   |
| 沙箱环境地址 | https://sfapi-sbox.sf-express.com/std/service |
| 批量交易     | 不支持                                        |
| 接口类型     | 接入                                          |
| 报文类型     | JSON                                          |

###### 2.2. 公共请求参数

| 序号 | 参数列表    | 类型        | 是否必传 | 含义                                                         |
| :--: | :---------- | :---------- | :------: | :----------------------------------------------------------- |
|  1   | partnerID   | String(64)  |    是    | 合作伙伴编码（即顾客编码）                                   |
|  2   | requestID   | String(40)  |    是    | 请求唯一号UUID                                               |
|  3   | serviceCode | String(50)  |    是    | 接口服务代码                                                 |
|  4   | timestamp   | long        |    是    | 调用接口时间戳                                               |
|  5   | msgDigest   | String(128) |   条件   | 数字签名,使用数字签名方式认证时必填，不可与accessToken字段同时传参 签名方法参考：[数字签名认证说明](https://open.sf-express.com/developSupport/976720?authId=1) |
|  6   | accessToken | String      |   条件   | 访问令牌，使用OAuth2方式认证时必填，不可与msgDigest同时传参 获取方法参考：[OAuth2认证说明](https://open.sf-express.com/developSupport/976720?authId=0) |
|  7   | msgData     | String      |    是    | 业务数据报文                                                 |

###### 2.3. 请求参数`msgData`

<!-- ###### 2.3.1 元素<请求> Order -->
###### 2.3.1 元素`请求` Order

| 序号 | 属性名                      | 类型(约束)   | 必填 | 默认值              | 描述                                                         |
| ---- | --------------------------- | ------------ | ---- | ------------------- | ------------------------------------------------------------ |
| 1    | language                    | String(10)   | 是   |                     | 响应报文的语言， 缺省值为zh-CN，目前支持以下值zh-CN 表示中文简体， zh-TW或zh-HK或 zh-MO表示中文繁体， en表示英文 |
| 2    | orderId                     | String(64)   | 是   |                     | 客户订单号，**重复使用订单号时返回第一次下单成功时的运单信息** |
| 3    | waybillNoInfoList           | List         | 否   |                     | 顺丰运单号                                                   |
| 4    | customsInfo                 | CustomsInfo  | 否   |                     | 报关信息，查看[《海关配置流程指引》](https://open.sf-express.com/developSupport/195960?activeIndex=644140) |
| 5    | cargoDetails                | List         | 是   |                     | 托寄物信息                                                   |
| 6    | cargoDesc                   | String(20)   | 否   |                     | 拖寄物类型描述,如： 文件，电子产品，衣服等                   |
| 7    | extraInfoList               | List         | 否   |                     | 扩展属性                                                     |
| 8    | serviceList                 | List         | 否   |                     | 增值服务信息，支持附录： [《增值服务产品表》](https://open.sf-express.com/developSupport/734349?activeIndex=313317) |
| 9    | contactInfoList             | List         | 是   |                     | 收寄双方信息                                                 |
| 10   | monthlyCard                 | String(20)   | 条件 |                     | 顺丰月结卡号 月结支付时传值，现结不需传值；沙箱联调可使用测试月结卡号7551234567（非正式，无须绑定，仅支持联调使用） |
| 11   | payMethod                   | Number(2)    | 否   | 1                   | 付款方式，支持以下值： 1:寄方付 2:收方付 3:第三方付          |
| 12   | expressTypeId               | Number(5)    | 是   | 1                   | 快件产品类别， 支持附录 [《快件产品类别表》](https://open.sf-express.com/developSupport/734349?activeIndex=324604) 的产品编码值，仅可使用与顺丰销售约定的快件产品 |
| 13   | parcelQty                   | Number(5)    | 否   | 1                   | 包裹数，一个包裹对应一个运单号；若包裹数大于1，则返回一个母运单号和N-1个子运单号 |
| 14   | totalLength                 | Number(16,5) | 否   |                     | 客户订单货物总长，单位厘米， 精确到小数点后3位， 包含子母件  |
| 15   | totalWidth                  | Number(16,5) | 否   |                     | 客户订单货物总宽，单位厘米， 精确到小数点后3位， 包含子母件  |
| 16   | totalHeight                 | Number(16,5) | 否   |                     | 客户订单货物总高，单位厘米， 精确到小数点后3位， 包含子母件  |
| 17   | totalVolume                 | Number(16,5) | 否   |                     | 订单货物总体积，单位立方厘米, 精确到小数点后3位，会用于计抛 (是否计抛具体商务沟通中 双方约定) |
| 18   | totalWeight                 | Number(17,5) | 条件 |                     | 订单货物总重量（郑州空港海关必填）， 若为子母件必填， 单位千克， 精确到小数点后3位，如果提供此值， 必须>0 (子母件需>6) |
| 19   | totalNetWeight              | Number(17,5) | 否   |                     | 商品总净重                                                   |
| 20   | sendStartTm                 | Date         | 否   | 接收 到报 文的 时间 | 要求上门取件开始时间， 格式： YYYY-MM-DD HH24:MM:SS， 示例： 2012-7-30 09:30:00 （预约单传预约截止时间，不赋值默认按当前时间下发，1小时内取件） |
| 21   | isDocall                    | Number(1)    | 否   | 0                   | 是否通过手持终端 通知顺丰收派 员上门收件，支持以下值： 1：要求 0：不要求 |
| 22   | isSignBack                  | Number(1)    | 否   | 0                   | 是否返回签回单 （签单返还）的运单号， 支持以下值： 1：要求 0：不要求 |
| 23   | custReferenceNo             | String(100)  | 否   |                     | 客户参考编码：如客户原始订单号                               |
| 24   | temperatureRange            | Number(2)    | 条件 |                     | 温度范围类型，当 express_type为12 医药温控件 时必填，支持以下值： 1:冷藏 3：冷冻 |
| 25   | orderSource                 | String(50)   | 否   |                     | 订单平台类型 （对于平台类客户， 如果需要在订单中 区分订单来源， 则可使用此字段） 天猫:tmall， 拼多多：pinduoduo， 京东 : jd 等平台类型编码 |
| 27   | remark                      | String(100)  | 否   |                     | 备注                                                         |
| 28   | isOneselfPickup             | Number(1)    | 否   | 0                   | 快件自取，支持以下值： 1：客户同意快件自取 0：客户不同意快件自取 |
| 29   | filterField                 | String       | 否   |                     | 筛单特殊字段用来人工筛单                                     |
| 30   | isReturnQRCode              | Number(1)    | 否   | 0                   | 是否返回用来退货业务的 二维码URL， 支持以下值： 1：返回二维码 0：不返回二维码 |
| 31   | specialDeliveryTypeCode     | String(3)    | 否   |                     | 当EXPRESS_TYPE=235 2：极效前置单（当日达） 5：极效前置小时达 当EXPRESS_TYPE=265 4：预售电标 |
| 32   | specialDeliveryValue        | String(100)  | 否   |                     | 特殊派件具体表述 证件类型: 证件后8位如： 1:09296231（1 表示身份证， 暂不支持其他证件） |
| 33   | merchantPayOrderNo          | String(100)  | 否   |                     | 商户支付订单号                                               |
| 34   | isReturnSignBackRoute label | Number(1)    | 否   | 0                   | 是否返回签回单路由标签： 默认0， 1：返回路由标签， 0：不返回 |
| 35   | isReturnRoutelabel          | Number(1)    | 是   | 1                   | 是否返回路由标签： 默认1， 1：返回路由标签， 0：不返回；除部分特殊用户外，其余用户都默认返回 |
| 36   | isUnifiedWaybillNo          | Number(1)    | 否   | 0                   | 是否使用国家统一面单号 1：是（建议使用，返回SF开头的15位运单号）， 0：否(特殊诉求才用，返回12位的运单号) |
| 37   | podModelAddress             | String(1024) | 否   |                     | 签单返还范本地址                                             |
| 38   | inProcessWaybillNo          | String(100)  | 否   |                     | 头程运单号（郑州空港海关必填）                               |
| 39   | isGenWaybillNo              | Number(1)    | 否   | 1                   | 是否需求分配运单号1：分配 0：不分配（若带单号下单，请传值0） |

###### 2.3.2 元素`请求`Order/List`**ContactInfo**`

| #    | 属性名        | 类型(约束)   | 必填 | 描述                                                         |
| ---- | ------------- | ------------ | ---- | ------------------------------------------------------------ |
| 1    | contactType   | Number(1)    | 是   | 地址类型： 1，寄件方信息 2，到件方信息                       |
| 2    | company       | String(100)  | 条件 | 公司名称                                                     |
| 3    | contact       | String(100)  | 条件 | 联系人                                                       |
| 4    | tel           | String(20)   | 条件 | 联系电话（tel和mobile字段必填其中一个）                      |
| 5    | mobile        | String(20)   | 条件 | 手机（tel和mobile字段必填其中一个）                          |
| 6    | country       | String(30)   | 是   | 国家或地区代码 例如：内地件CN 香港852                        |
| 7    | province      | String(30)   | 否   | 所在省级行政区名称，必须是标准的省级行政区名称如：北 京、广东省、广西壮族自治区等；此字段影响原寄地代码识 别，建议尽可能传该字段的值 |
| 8    | city          | String(100)  | 否   | 所在地级行政区名称，必须是标准的城市称谓 如：北京市、 深圳市、大理白族自治州等； 此字段影响原寄地代码识别， 建议尽可能传该字段的值 |
| 9    | county        | String(30)   | 否   | 所在县/区级行政区名称，必须 是标准的县/区称谓，如：福田区，南涧彝族自治县、准格尔旗等 |
| 10   | address       | String(200)  | 是   | 详细地址，若有四级行政区划，如镇/街道等信息可拼接至此字段，格式样例：镇/街道+详细地址。若province/city 字段的值不传，此字段必须包含省市信息，避免影响原寄地代码识别，如：广东省深圳市福田区新洲十一街万基商务大厦10楼；此字段地址必须详细，否则会影响目的地中转识别； |
| 11   | postCode      | String(25)   | 条件 | 邮编，跨境件必填（中国内地， 港澳台互寄除外）                |
| 12   | email         | String(200)  | 否   | 邮箱地址                                                     |
| 13   | taxNo         | String(100)  | 否   | 税号                                                         |
| 14   | contactRemark | String(100)  | 否   | 联系人属性（01：个人件，02：公司件,跨境件或国际件需要)       |
| 15   | certType      | String(200)  | 否   | 证件类型(跨境件或国际件需要)，参考 [《证件类型说明》](https://open.sf-express.com/developSupport/734349?activeIndex=720345) |
| 16   | certNo        | String(1000) | 否   | 证件号码(跨境件或国际件需要)，参考[《证件类型说明》](https://open.sf-express.com/developSupport/734349?activeIndex=720345) |

<!-- ###### 2.3.3 元素<请求>Order/List<**CargoDetail**> -->
###### 2.3.3 元素`<请求>`Order/List`<**CargoDetail**>`

| #    | 属性名                        | 类型(约束)    | 必填 | 描述                                                         |
| ---- | ----------------------------- | ------------- | ---- | ------------------------------------------------------------ |
| 1    | name                          | String(128)   | 是   | 货物名称，如果需要生成电子 运单，则为必填                    |
| 2    | count                         | Number(5)     | 条件 | 货物数量 跨境件报关需要填写                                  |
| 3    | unit                          | String(30)    | 条件 | 货物单位，如：个、台、本， 跨境件报关需要填写                |
| 4    | weight                        | Number(16,3)  | 条件 | 订单货物单位重量，包含子母件， 单位千克，精确到小数点后3位 跨境件报关需要填写 |
| 5    | amount                        | Number(17,3)  | 条件 | 货物单价，精确到小数点后3位， 跨境件报关需要填写             |
| 6    | currency                      | String(5)     | 条件 | 货物单价的币别： 参照附录[《国际件币别表》](https://open.sf-express.com/developSupport/734349?activeIndex=482730) |
| 7    | sourceArea                    | String(5)     | 条件 | 原产地国别， 跨境件报关需要填写                              |
| 8    | productRecordNo               | String(18)    | 否   | 货物产品国检备案编号                                         |
| 9    | goodPrepardNo                 | String(100)   | 否   | 商品海关备案号                                               |
| 10   | taxNo                         | String(100)   | 否   | 商品行邮税号                                                 |
| 11   | hsCode                        | String(100)   | 否   | 海关编码                                                     |
| 12   | goodsCode                     | String(60)    | 否   | 商品编号                                                     |
| 13   | brand                         | String(60)    | 否   | 货物品牌                                                     |
| 14   | specifications                | String(60)    | 否   | 货物规格型号                                                 |
| 15   | manufacturer                  | String(100)   | 否   | 生产厂家                                                     |
| 16   | shipmentWeight                | Double (16,3) | 否   | 托寄物毛重                                                   |
| 17   | length                        | Double (16,3) | 否   | 托寄物长                                                     |
| 18   | width                         | Double (16,3) | 否   | 托寄物宽                                                     |
| 19   | height                        | Double (16,3) | 否   | 托寄物高                                                     |
| 20   | volume                        | Double (16,2) | 否   | 托寄物体积                                                   |
| 21   | cargoDeclaredValue            | Double (16,5) | 否   | 托寄物声明价值（杭州口岸必填）                               |
| 22   | declaredValueDeclaredCurrency | String(5)     | 否   | 托寄物声明价值币别（杭州口岸必填）                           |
| 23   | cargoId                       | String(60)    | 否   | 货物id（逆向物流）                                           |
| 24   | intelligentInspection         | Number(1)     | 否   | 智能验货标识(1-是,0-否) （逆向物流）                         |
| 25   | snCode                        | String(4000)  | 否   | 货物标识码（逆向物流）                                       |
| 26   | stateBarCode                  | String(50)    | 否   | 国条码                                                       |

<!-- ###### 2.3.4 元素<请求>Order/List<**Service**> -->
###### 2.3.4 元素`<请求>`Order/List`<**Service**>`

| #    | 属性名 | 类型(约束) | 必填 | 默认值 | 描述                                                         |
| ---- | ------ | ---------- | ---- | ------ | ------------------------------------------------------------ |
| 1    | name   | String(20) | 是   |        | 增值服务名，如COD等，支持附录： [《增值服务产品表》](https://open.sf-express.com/developSupport/734349?activeIndex=313317) |
| 2    | value  | String(30) | 条件 |        | 增值服务扩展属性，参考增值 服务传值说明                      |
| 3    | value1 | String(30) | 条件 |        | 增值服务扩展属性                                             |
| 4    | value2 | String(30) | 条件 |        | 增值服务扩展属性2                                            |
| 5    | value3 | String(30) | 条件 |        | 增值服务扩展属性3                                            |
| 6    | value4 | String(30) | 条件 |        | 增值服务扩展属性4                                            |

<!-- ###### 2.3.5 元素<请求>Order/CustomsInfo -->
###### 2.3.5 元素`<请求>`Order/CustomsInfo

| #    | 属性名                | 类型(约束)    | 必填 | 默认值                          | 描述                                                         |
| ---- | --------------------- | ------------- | ---- | ------------------------------- | ------------------------------------------------------------ |
| 1    | declaredValue         | Number(16, 5) | 条件 |                                 | 客户订单货物总声明价值， 包含子母件，精确到小数点 后3位。如果是跨境件，则必填 |
| 2    | declaredValueCurrency | String(5)     | 否   | 中国内地 默认CNY， 否则 默认USD | 货物声明价值币别，跨境 件报关需要填写 参照附录币别代码附件   |
| 3    | customsBatchs         | String(20)    | 否   |                                 | 报关批次                                                     |
| 4    | taxPayMethod          | Number(2)     | 否   |                                 | 税金付款方式，支持以下值： 1:寄付 2：到付 3. 第三方付        |
| 5    | taxSettleAccounts     | String(30)    | 否   |                                 | 税金结算账号                                                 |
| 6    | paymentTool           | String(100)   | 否   |                                 | 支付工具                                                     |
| 7    | paymentNumber         | String(100)   | 否   |                                 | 支付号码                                                     |
| 8    | orderName             | String(100)   | 否   |                                 | 客户订单下单人姓名                                           |
| 9    | tax                   | String(10)    | 否   |                                 | 税款                                                         |

<!-- ###### 2.3.6 元素<请求>Order/List<**WaybillNoInfo**> -->
###### 2.3.6 元素`<请求>`Order/List`<**WaybillNoInfo**>`

| #    | 属性名      | 类型(约束)    | 必填 | 默认值 | 描述                                 |
| ---- | ----------- | ------------- | ---- | ------ | ------------------------------------ |
| 1    | waybillType | Number (1)    | 否   |        | 运单号类型1：母单 2 :子单 3 : 签回单 |
| 2    | waybillNo   | String(15)    | 否   |        | 运单号                               |
| 3    | boxNo       | String(64)    | 否   |        | 箱号                                 |
| 4    | length      | Number (16,3) | 否   |        | 长(cm)                               |
| 5    | width       | Number (16,3) | 否   |        | 宽(cm)                               |
| 6    | height      | Number (16,2) | 否   |        | 高(cm)                               |
| 7    | weight      | Number (16,2) | 否   |        | 重量(kg)                             |
| 9    | volume      | Number (16,2) | 否   |        | 体积（立方厘米）                     |

<!-- ###### 2.3.7 元素<请求>Order/List<**ExtraInfo**> -->
###### 2.3.7 元素`<请求>`Order/List`<**ExtraInfo**>`

| #    | 属性名   | 类型(约束)   | 必填 | 默认值 | 描述                                                         |
| ---- | -------- | ------------ | ---- | ------ | ------------------------------------------------------------ |
| 1    | attrName | String(256)  | 否   |        | 扩展字段说明：attrName为字段定义， 具体如下表，value存在attrVal |
| 2    | attrVal  | String(1024) | 否   |        | 扩展字段值                                                   |

###### 2.3.7.1 扩展字段备注

| attrName            | attrVal                                                      |
| ------------------- | ------------------------------------------------------------ |
| attr001             | 物品件数（杭州口岸必填）                                     |
| attr002             | 物品净重，郑州空港口岸, 郑州综保税必须字段，最多保留小数点后四位，单位Kg |
| attr003             | 进出口时间（郑州空港口岸必须字段格式：yyyy-MM-dd hh:mm:ss）  |
| attr005             | 商品运输费用,无则填0（郑州综保,杭州海关,重庆口岸 要求字段）  |
| attr006             | 报关批次（杭州口岸必填，yyyy-dd-mm）                         |
| attr007             | 商品保险费用，无则填0（郑州综保,杭州海关,重庆口岸 要求字段） |
| attr009             | 杭州海关版本代码：03                                         |
| attr010             | 电商企业十位编码，郑州综保字段                               |
| attr014             | 签回单标识，对应值为“singBackInfo”                           |
| attr015             | 签回单标识，结合attr014使用，英文逗号分隔，对应值attrVal：1:签名，2:盖章，3:登记身份证号，4:收取身份证复印件，5、【收取派件存根】(香港专用） 【其他文件】(香港专用）7、【签收日期】8、【电话号码】，英文逗号分隔 |
| channelCode         | 渠道编码，仅限ISV商家传值，报文示例"extraInfoList" : [ {“attrName” : “channelCode”,“attrVal” : “B0101020070191”}] |
| haDeliveryOrderId   | 医管局方主键，用作与顺丰沟通用途。与医管局沟通订单状态时，首要使用字段。 |
| haGoVerifyNum       | 派送时核对客人独有的IDhaDeliveryLabelNums                    |
| haDeliveryLabelNums | 揽收时凭核对HA_deliveryLabelNums子单的编号，多个用竖划线分隔，如1234567893-N01\|1234567893-D02 |
| haOthers            | JOSN格式用作储存参考资料，地区以大数据方式捞取数据，每日产出派送结果报表明细 |
| monthlyCustomerId   | 下单月结卡号，用于标识下单客户的月结卡号，不用于结算，应用场景：到付折扣 |
| subsidySource       | 国补标识，dy为抖音；sn为苏宁；tb为淘天；pdd为拼多多；ks为快手；wph为唯品会；dw为得物；xhs为小红书；sph为视频号；merchant为商家自营国补; cancel为取消标识； |
| wpMerchantCode      | 微派商户编码，微派会给每个接入客户提供一个唯一编码           |
| wpServiceCode       | 微派任务编码，类型为手机，传ProXXXXX，类型为平板，传ProXXXXX，需与微派申请任务编码 |
| wpExtJson           | “{“sn”:“123456”,“imei”:“123456”}” —sn为sn编码，只支持一个，imei为手机/平板emei号，只支持一个 |

**国补不传入sn/imei示例**
“extraInfoList”: [{“attrVal”: “merchant”,“attrName”: “subsidySource”},{“attrVal”: “B20211111111”,“attrName”: “wpMerchantCode”},{“attrVal”: “Pro2501111111”,“attrName”: “wpServiceCode”},{“attrVal”: “{\“imei\”: \”\",\“sn\”: \"\"}",“attrName”: “wpExtJson”}]
**国补需传入sn/imei示例**
“extraInfoList”: [{“attrVal”: “merchant”,“attrName”: “subsidySource”},{“attrVal”: “B202111111”,“attrName”: “wpMerchantCode”},{“attrVal”: “Pro2511111111”,“attrName”: “wpServiceCode”},{“attrVal”: “{\“imei\”: \“8621111111192\”,\“sn\”: \“2MH11111112368\”}”,“attrName”: “wpExtJson”}]
**说明：**
①国补传值要求sn/imei是否传入参考业务场景定义，原则上3C品类国补必传。
②沙箱环境直传入字段即可触发，可以使用示例报文请求验证

###### 2.4 公共响应参数

| #    | 属性名    | 类型(约束) | 必填 | 默认值 | 描述                          |
| ---- | --------- | ---------- | ---- | ------ | ----------------------------- |
| 1    | success   | String     | 是   |        | true 请求成功，false 请求失败 |
| 2    | errorCode | String     | 是   |        | 错误编码，S0000成功           |
| 3    | errorMsg  | String     | 是   |        | 错误描述                      |
| 4    | msgData   | String     | 是   |        | 返回的详细数据                |

<!-- ###### 2.5. 响应参数<msgData> -->
###### 2.5. 响应参数 `<msgData>`

###### 2.5.1 元素`<响应>` OrderResponse

| #    | 属性名                    | 类型(约束)  | 必填 | 描述                                                         |
| ---- | ------------------------- | ----------- | ---- | ------------------------------------------------------------ |
| 1    | orderId                   | String(64)  | 是   | 客户订单号                                                   |
| 2    | originCode                | String(10)  | 否   | 原寄地区域代码，可用于顺丰 电子运单标签打印                  |
| 3    | destCode                  | String(10)  | 否   | 目的地区域代码，可用于顺丰 电子运单标签打印                  |
| 4    | filterResult              | Number(2)   | 否   | 筛单结果： 1：人工确认 2：可收派 3：不可以收派               |
| 5    | remark                    | String(100) | 条件 | 如果filter_result=3时为必填， 不可以收派的原因代码： 1：收方超范围 2：派方超范围 3：其它原因 高峰管控提示信息 【数字】：【高峰管控提示信息】 (如 4：温馨提示 ，1：春运延时) |
| 6    | url                       | Number(200) | 否   | 二维码URL （用于CX退货操作的URL）                            |
| 7    | paymentLink               | String(200) | 否   | 用于第三方支付运费的URL                                      |
| 8    | isUpstairs                | String(1)   | 否   | 是否送货上楼 1:是                                            |
| 9    | isSpecialWarehouseService | String(4)   | 否   | true 包含特殊仓库增值服务                                    |
| 10   | serviceList               | List        | 否   | 下单补充的增值服务信息                                       |
| 11   | returnExtraInfoList       | List        | 否   | 返回信息扩展属性                                             |
| 12   | waybillNoInfoList         | List        | 否   | 顺丰运单号                                                   |
| 13   | routeLabelInfo            | List        | 是   | 路由标签，除少量特殊场景用户外，其余均会返回                 |

###### 2.5.2 元素`<响应>` OrderResponse/routeLabelInfo

| #    | 属性名         | 类型(约束)     | 必填 | 描述                                                     |
| ---- | -------------- | -------------- | ---- | -------------------------------------------------------- |
| 1    | code           | String(30)     | 是   | 返回调用结果，1000：调用成功； 其他调用失败              |
| 2    | routeLabelData | routeLabelData | 是   | 路由标签数据详细数据，除少量特殊场景用户外，其余均会返回 |
| 3    | message        | String(1000)   | 否   | 失败异常描述                                             |

###### 2.5.3 元素`<响应>` OrderResponse/routeLabelInfo/routeLabelData

| #    | 属性名              | 类型(约束)   | 必填 | 描述                                                         |
| ---- | ------------------- | ------------ | ---- | ------------------------------------------------------------ |
| 1    | waybillNo           | String(30)   | 否   | 运单号                                                       |
| 2    | sourceTransferCode  | String(60)   | 否   | 原寄地中转场                                                 |
| 3    | sourceCityCode      | String(60)   | 否   | 原寄地城市代码                                               |
| 4    | sourceDeptCode      | String(60)   | 否   | 原寄地网点代码                                               |
| 5    | sourceTeamCode      | String(60)    | 否   | 原寄地单元区域                                               |
| 6    | destCityCode        | String(60)   | 否   | 目的地城市代码, eg:755                                       |
| 7    | destDeptCode        | String(60)   | 否   | 目的地网点代码, eg:755AQ                                     |
| 8    | destDeptCodeMapping | String(60)   | 否   | 目的地网点代码映射码                                         |
| 9    | destTeamCode        | String(60)   | 否   | 目的地单元区域, eg:001                                       |
| 10   | destTeamCodeMapping | String(60)   | 否   | 目的地单元区域映射码                                         |
| 11   | destTransferCode    | String(60)   | 否   | 目的地中转场                                                 |
| 12   | destRouteLabel      | String(200)  | 是   | 若返回路由标签，则此项必会返回。如果手打是一段码，检查是否地址异常。打单时的路由标签信息如果是大网的路由标签,这里的值是目的地网点代码,如果 是同城配的路由标签,这里的值是根据同城配的设置映射出来的值,不同的配置结果会不一样,不能根据-符号切分(如:上海同城配,可能是:集散点-目的地网点-接驳点,也有可能是目的地网点代码-集散点-接驳点) |
| 13   | proName             | String(60)   | 否   | 产品名称 对应RLS:pro_name                                    |
| 14   | cargoTypeCode       | String(30)   | 否   | 快件内容: 如:C816、SP601                                     |
| 15   | limitTypeCode       | String(30)   | 否   | 时效代码, 如:T4                                              |
| 16   | expressTypeCode     | String(30)   | 否   | 产品类型,如:B1                                               |
| 17   | codingMapping       | String(60)   | 是   | 入港映射码 eg:S10 地址详细必会返回                           |
| 18   | codingMappingOut    | String(60)   | 否   | 出港映射码                                                   |
| 19   | xbFlag              | String(30)   | 否   | XB标志 0:不需要打印XB 1:需要打印XB                           |
| 20   | printFlag           | String(60)   | 否   | 打印标志 返回值总共有9位,每位只 有0和1两种,0表示按丰密 面单默认的规则,1是显示, 顺序如下,如111110000 表示打印寄方姓名、寄方 电话、寄方公司名、寄方 地址和重量,收方姓名、收 方电话、收方公司和收方 地址按丰密面单默认规则 1:寄方姓名 2:寄方电话 3:寄方公司名 4:寄方地址 5:重量 6:收方姓名 7:收方电话 8:收方公司名 9:收方地址 |
| 21   | twoDimensionCode    | String(600)  | 否   | 二维码 根据规则生成字符串信息, 格式为MMM={`k1`:`(目的 地中转场代码)`,`k2`:`(目的 地原始网点代码)`,`k3`:`(目 的地单元区域)`,`k4`:`(附件 通过三维码(express_type_code、 limit_type_code、 cargo_type_code)映射时效类型)`,`k5`:`(运单 号)`,`k6`:`(AB标识)`,`k7`:`( 校验码)`} |
| 22   | proCode             | String(30)   | 否   | 时效类型: 值为二维码中的K4                                   |
| 23   | printIcon           | String(100)  | 否   | 打印图标,根据托寄物判断需 要打印的图标(重货,蟹类,生鲜,易碎，Z标) 返回值有8位，每一位只有0和1两种， 0表示按运单默认的规则， 1表示显示。后面两位默认0备用。 顺序如下：重货,蟹类,生鲜,易碎,医药类,Z标,酒标,0 如：00000000表示不需要打印重货，蟹类，生鲜，易碎 ,医药,Z标,酒标,备用 |
| 24   | abFlag              | String(30)   | 否   | AB标                                                         |
| 25   | waybillIconList     | List         | 否   | 面单图标                                                     |
| 25   | errMsg              | String(1000) | 否   | 查询出现异常时返回信息。 返回代码: 0 系统异常 1 未找到面单   |
| 26   | destPortCode        | String(100)  | 否   | 目的地口岸代码                                               |
| 27   | destCountry         | String(50)   | 否   | 目的国别(国别代码如:JP)                                      |
| 28   | destPostCode        | String(100)  | 否   | 目的地邮编                                                   |
| 29   | goodsValueTotal     | String(30)   | 否   | 总价值(保留两位小数,数字类型,可补位)                         |
| 30   | currencySymbol      | String(30)   | 否   | 币种                                                         |
| 31   | goodsNumber         | String(20)   | 否   | 件数                                                         |
| 32   | destAddrKeyWord     | String(100)  | 否   | 目的地地址关键词                                             |
| 33   | noToDoorPayment     | String(1)    | 否   | 乡村件不上门标签                                             |

###### 2.6. 请求示例\应用场景(JSON)示例

请求报文:（msgData字段）:

```
{
    "cargoDetails":[
        {          
            "count":2.365,
			"unit":"个",
			"weight":2.1,
			"amount":10000.5111,
            "currency":"HKD",
            "name":"联想笔记本电脑",           
            "sourceArea":"CNY"          
        }],
    "contactInfoList":	[
        {
            "address":"广东省广州市黄埔区骏业路255号",
            "contact":"杨犁",
            "contactType":1,
            "country":"CN",
            "province":"广东省",
            "city":"广州市",
            "county":"黄埔区",
            "postCode":"510000",
            "mobile":"15685585514"
        },
        {
            "address":"广东省广州市黄埔区连云路169号",
            "company":"顺丰速运",
            "contact":"张三",
            "contactType":2,
            "country":"CN",
            "province":"广东省",
            "city":"广州市",
            "county":"黄埔区",
            "postCode":"510000",
            "mobile":"19292082784"
        }],
    "language":"zh_CN",
    "orderId":"OrderNum20250523"
}
```

###### 2.7. 返回示例\应用场景(JSON)示例

响应报文:

- 成功响应:

```
{
  "apiErrorMsg": "",
  "apiResponseID": "000196FAD4593D3FEF4C75AEBF9CAA3F",
  "apiResultCode": "A1000",
  "apiResultData": {
    "success": true,
    "errorCode": "S0000",
    "errorMsg": null,
    "msgData": {
      "orderId": "OrderNum20250523",
      "originCode": "020",
      "destCode": "020",
      "filterResult": 2,
      "remark": "",
      "url": null,
      "paymentLink": null,
      "isUpstairs": null,
      "isSpecialWarehouseService": null,
      "mappingMark": null,
      "agentMailno": null,
      "returnExtraInfoList": null,
      "waybillNoInfoList": [
        {
          "waybillType": 1,
          "waybillNo": "SF7444496931331",
          "boxNo": null,
          "length": null,
          "width": null,
          "height": null,
          "weight": null,
          "volume": null
        }
      ],
      "routeLabelInfo": [
        {
          "code": "1000",
          "routeLabelData": {
            "waybillNo": "SF7444496931331",
            "sourceTransferCode": "020W",
            "sourceCityCode": "020",
            "sourceDeptCode": "020",
            "sourceTeamCode": "",
            "destCityCode": "020",
            "destDeptCode": "020CK",
            "destDeptCodeMapping": "F0",
            "destTeamCode": "",
            "destTeamCodeMapping": "",
            "destTransferCode": "020W",
            "destRouteLabel": "020W-F0-CK",
            "proName": "",
            "cargoTypeCode": "C201",
            "limitTypeCode": "T4",
            "expressTypeCode": "B1",
            "codingMapping": "K35",
            "codingMappingOut": "",
            "xbFlag": "0",
            "printFlag": "000000000",
            "twoDimensionCode": "MMM={'k1':'020W','k2':'020CK','k3':'','k4':'T801','k5':'SF7444496931331','k6':'','k7':'fe62b871'}",
            "proCode": "特快",
            "printIcon": "00010000",
            "abFlag": "",
            "destPortCode": "",
            "destCountry": "",
            "destPostCode": "",
            "goodsValueTotal": "",
            "currencySymbol": "",
            "cusBatch": "",
            "goodsNumber": "",
            "errMsg": "",
            "checkCode": "fe62b871",
            "proIcon": "",
            "fileIcon": "",
            "fbaIcon": "",
            "icsmIcon": "",
            "destGisDeptCode": "020CK",
            "newIcon": null,
            "sendAreaCode": null,
            "destinationStationCode": null,
            "sxLabelDestCode": null,
            "sxDestTransferCode": null,
            "sxCompany": null,
            "newAbFlag": null,
            "destAddrKeyWord": "",
            "rongType": null,
            "waybillIconList": null
          },
          "message": "SF7444496931331:"
        }
      ],
      "contactInfoList": null,
      "sendStartTm": null,
      "customerRights": null,
      "expressTypeId": null
    }
  }
}
```

## 二、订单状态/清单运用推送信息

>  ##### 订单状态推送信息

``` java
2025-05-23 15:12:33.364 [http-nio-9009-exec-1-351582] INFO 
                requestId= [sfOrderStatusPush,60] c.i.c.s.SFReceivePushMsgController -
收到顺丰订单状态推送:
请求唯一标识ID(requestId): 39f6e3095bc849c68fedd98f0ce35adb
时间戳(timestamp): 1747984353248
订单状态信息(orderState):
--------------------------------
客户订单号(orderNo): OrderNum20250523
顺丰运单号(waybillNo): SF7444496931331
订单状态代码(orderStateCode): 04-40001
订单状态描述(orderStateDesc): 调度成功/收派员信息
员工工号(empCode): 500003
员工电话(empPhone): 13600000003
网点代码(netCode): 755FG
最后更新时间(lastTime): 2025-05-23 15:12:33
预约时间(bookTime): 
承运商代码(carrierCode): SF
创建时间(createTm): 2025-05-23 15:12:33

2025-05-23 15:12:58.650 [http-nio-9009-exec-2-351582] INFO 
                requestId= [sfOrderStatusPush,60] c.i.c.s.SFReceivePushMsgController -
收到顺丰订单状态推送:
请求唯一标识ID(requestId): 34d1c4fa7672407cb9a1a16a5cb4780d
时间戳(timestamp): 1747984378614
订单状态信息(orderState):
--------------------------------
客户订单号(orderNo): OrderNum20250523
顺丰运单号(waybillNo): SF7444496931331
订单状态代码(orderStateCode): 04-40037
订单状态描述(orderStateDesc): 下单已接收
员工工号(empCode): 500007
员工电话(empPhone): 13600000007
网点代码(netCode): 755FG
最后更新时间(lastTime): 
预约时间(bookTime): 
承运商代码(carrierCode): SF
创建时间(createTm): 2025-05-23 15:12:58

2025-05-23 15:13:13.722 [http-nio-9009-exec-3-351582] INFO 
                requestId= [sfOrderStatusPush,60] c.i.c.s.SFReceivePushMsgController -
收到顺丰订单状态推送:
请求唯一标识ID(requestId): ccb4c13e138e4b08a4b2ff21eb2593e5
时间戳(timestamp): 1747984393683
订单状态信息(orderState):
--------------------------------
客户订单号(orderNo): OrderNum20250523
顺丰运单号(waybillNo): SF7444496931331
订单状态代码(orderStateCode): 05-40003
订单状态描述(orderStateDesc): 已正常收件状态
员工工号(empCode): 500963
员工电话(empPhone): 13698785169
网点代码(netCode): 755FG
最后更新时间(lastTime): 2025-05-23 15:13:13
预约时间(bookTime): 
承运商代码(carrierCode): SF
创建时间(createTm): 2025-05-23 15:13:13
```

> ##### 清单费用推送信息

``` java
2025-05-23 15:47:04.177 [http-nio-9009-exec-1-356335] INFO 
                requestId= [receWaybillsFeeResponse,141] c.i.c.s.SFReceivePushMsgController -
========== 顺丰运费推送信息 ==========
【基础信息】
运单号: SF7444496931331
客户账号: 7551234567
订单号: OrderNum20250523
计费重量: 2.2kg
包裹数量: 1
产品类型: null

【费用明细】
--------------------------------
费用类型: 主运费
金额: 12.0元
结算方式: 月结
付款方式: 寄付
业务地区: null
录入时间: 1747986424070

2025-05-23 15:47:20.251 [http-nio-9009-exec-2-356335] INFO 
                requestId= [receWaybillsFeeResponse,141] c.i.c.s.SFReceivePushMsgController -
========== 顺丰运费推送信息 ==========
【基础信息】
运单号: SF7444496931331
客户账号: null
订单号: OrderNum20250523
计费重量: 1.0kg
包裹数量: 1
产品类型: 顺丰标快

【费用明细】
--------------------------------
费用类型: 未知费用(59)
金额: 1.0元
结算方式: 现结
付款方式: 寄付
业务地区: 576WBD05A
录入时间: 1709117558000
--------------------------------
费用类型: 主运费
金额: 18.0元
结算方式: 现结
付款方式: 寄付
业务地区: 576WBD05A
录入时间: 1709100760000
--------------------------------
费用类型: 保费
金额: 1.0元
结算方式: 现结
付款方式: 寄付
业务地区: 576WBD05A
录入时间: 1747986440197

2025-05-23 15:47:36.726 [http-nio-9009-exec-3-356335] INFO 
                requestId= [receWaybillsFeeResponse,141] c.i.c.s.SFReceivePushMsgController -
========== 顺丰运费推送信息 ==========
【基础信息】
运单号: SF7444496931331
客户账号: 7551234567
订单号: OrderNum20250523
计费重量: 1.3kg
包裹数量: 1
产品类型: 顺丰标快

【费用明细】
--------------------------------
费用类型: 未知费用(67)
金额: 3.0元
结算方式: 月结
付款方式: 第三方付
业务地区: 791BE
录入时间: 1747986456694
--------------------------------
费用类型: 主运费
金额: 20.0元
结算方式: 月结
付款方式: 第三方付
业务地区: 791BE
录入时间: 1747986456694
--------------------------------
费用类型: 未知费用(23)
金额: 50.0元
结算方式: 月结
付款方式: 第三方付
业务地区: 791BE
录入时间: 1709032125000

2025-05-23 15:47:41.447 [http-nio-9009-exec-4-356335] INFO 
                requestId= [receWaybillsFeeResponse,141] c.i.c.s.SFReceivePushMsgController -
========== 顺丰运费推送信息 ==========
【基础信息】
运单号: SF7444496931331
客户账号: 7551234567
订单号: OrderNum20250523
计费重量: 1.0kg
包裹数量: 1
产品类型: 顺丰标快

【费用明细】
--------------------------------
费用类型: 未知费用(8)
金额: 8.0元
结算方式: 月结
付款方式: 第三方付
业务地区: 573PD
录入时间: 1747986461393
--------------------------------
费用类型: 主运费
金额: 0.0元
结算方式: 月结
付款方式: 第三方付
业务地区: 573PD
录入时间: 1747986461393
```



## 三、路由轨迹推送(物流轨迹推送)

``` java
2025-05-26 09:55:52.449 [http-nio-9009-exec-1-751049] INFO 
                requestId= [receivingRouteInfo,71] c.i.c.s.SFReceivePushMsgController -收到顺丰路由信息推送:
2025-05-26 09:55:52.474 [http-nio-9009-exec-1-751049] INFO 
                requestId= [receivingRouteInfo,81] c.i.c.s.SFReceivePushMsgController -路由信息:
运单号(mailno): SF7444496931331
路由发生地点(acceptAddress): 深圳市
路由操作原因名称(reasonName): null
客户订单号(orderid): OrderNum20250523
路由发生时间(acceptTime): 2025-05-26 09:55:52
路由说明(remark): 顺丰速运 已收取快件
路由操作码(opCode): 50
路由记录ID(id): 363636015985819
路由操作原因代码(reasonCode): null
--------------------------------
2025-05-26 09:56:14.460 [http-nio-9009-exec-2-751049] INFO 
                requestId= [receivingRouteInfo,71] c.i.c.s.SFReceivePushMsgController -收到顺丰路由信息推送:
2025-05-26 09:56:14.460 [http-nio-9009-exec-2-751049] INFO 
                requestId= [receivingRouteInfo,81] c.i.c.s.SFReceivePushMsgController -路由信息:
运单号(mailno): SF7444496931331
路由发生地点(acceptAddress): 深圳市
路由操作原因名称(reasonName): null
客户订单号(orderid): OrderNum20250523
路由发生时间(acceptTime): 2025-05-26 09:56:14
路由说明(remark): 快件在【深圳南山科技园中区营业部】完成分拣,准备发往下一站
路由操作码(opCode): 30
路由记录ID(id): 326012138800580
路由操作原因代码(reasonCode): null
--------------------------------
2025-05-26 09:56:25.610 [http-nio-9009-exec-3-751049] INFO 
                requestId= [receivingRouteInfo,71] c.i.c.s.SFReceivePushMsgController -收到顺丰路由信息推送:
2025-05-26 09:56:25.611 [http-nio-9009-exec-3-751049] INFO 
                requestId= [receivingRouteInfo,81] c.i.c.s.SFReceivePushMsgController -路由信息:
运单号(mailno): SF7444496931331
路由发生地点(acceptAddress): 郑州市
路由操作原因名称(reasonName): null
客户订单号(orderid): OrderNum20250523
路由发生时间(acceptTime): 2025-05-26 09:56:25
路由说明(remark): 快件到达 【郑州园博中转场】
路由操作码(opCode): 31
路由记录ID(id): 915984826754107
路由操作原因代码(reasonCode): null
--------------------------------
2025-05-26 09:56:35.593 [http-nio-9009-exec-4-751049] INFO 
                requestId= [receivingRouteInfo,71] c.i.c.s.SFReceivePushMsgController -收到顺丰路由信息推送:
2025-05-26 09:56:35.594 [http-nio-9009-exec-4-751049] INFO 
                requestId= [receivingRouteInfo,81] c.i.c.s.SFReceivePushMsgController -路由信息:
运单号(mailno): SF7444496931331
路由发生地点(acceptAddress): 深圳市
路由操作原因名称(reasonName): null
客户订单号(orderid): OrderNum20250523
路由发生时间(acceptTime): 2025-05-26 09:56:35
路由说明(remark): 我们正在为您的快件分配最合适的快递员，请您稍等。
路由操作码(opCode): 44
路由记录ID(id): 096882865300085
路由操作原因代码(reasonCode): null
--------------------------------
2025-05-26 09:56:46.500 [http-nio-9009-exec-5-751049] INFO 
                requestId= [receivingRouteInfo,71] c.i.c.s.SFReceivePushMsgController -收到顺丰路由信息推送:
2025-05-26 09:56:46.500 [http-nio-9009-exec-5-751049] INFO 
                requestId= [receivingRouteInfo,81] c.i.c.s.SFReceivePushMsgController -路由信息:
运单号(mailno): SF7444496931331
路由发生地点(acceptAddress): null
路由操作原因名称(reasonName): null
客户订单号(orderid): OrderNum20250523
路由发生时间(acceptTime): 2025-05-26 09:56:46
路由说明(remark): 您的快件已签收，如有疑问请电联快递员【000212，电话：18600000001】，感谢您使用顺丰，期待再次为您服务。（主单总件数：1件）
路由操作码(opCode): 80
路由记录ID(id): 220976123348837
路由操作原因代码(reasonCode): null
--------------------------------
```



## 四、打印模板预览

<!-- ![image-20250526145731712](D:\其他\系统对接\顺丰物流开放平台\image-20250526145731712.png) -->

