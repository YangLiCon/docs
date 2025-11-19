# 中通物流开放平台测试记录

## 一、基础

### 调用方法
>
> 中通接口目前均只支持`POST`

---

### 🛡️关于鉴权
>
> 鉴权方式使用简单鉴权，在请求的头部报文中加入自定义 header 中，键值为 apikey 即可。

``` html
curl -XPOST -H "content-type:application/json" -H "x-appKey:a227a62c216cdc328273d" -H "x-dataDigest:7Ih1zjVdgQEFBzdITreegg==" -d '{"pageNo1":33,"pageSize2":23,"data":"test"}' https://japi-test.zto.com/zto.open-platform.getNoticePageList
```

---

### 常见问题

```
❓：什么是全网件？
A：全网件场景一般是下单人和中通业务员沟通好固定接货时间。

❓：什么是预约件？
A：预约件场景是下单人未和中通业务员线下沟通，需要系统分配快递员。
```

---

### 文字符号

---

### 返回信息代码含义

#### 错误码描述

`系统错误信息是指在调用接口时发生无法解析的JSON，非法的数字签名，非法的参数以及系统发生重大错误时，直接返回错误编码。`

#### 公共错误码对照表

| 错误编码 | http状态码 | 返回信息           | 错误描述                       |
| -------- | ---------- | ------------------ | ------------------------------ |
| S200     | 200        | 请求超时           | 后端服务调用超时               |
| S202     | 200        | 发生错误           | 后端服务调用抛出异常           |
| S203     | 200        | 服务暂不可用       | 服务暂不可用                   |
| S206     | 200        | api qos limit      | API调用次数达到每分钟/小时限制 |
| S207     | 200        | API不存在          | 请求的API不存在                |
| S208     | 200        | XX不能为空         | 没有传必须参数                 |
| S210     | 200        | 无权限访问         | 未绑定服务关系                 |
| S211     | 200        | 签名错误           | 签名不正确                     |
| S212     | 200        | IP黑白名单限制     | IP黑白名单限制                 |
| S214     | 200        | 时间戳非法         | 时间戳非法                     |
| S221     | 200        | api qps flow limit | API流控限制                    |

#### 公共数据鉴权错误码对照表

| 错误编码 | http状态码 | 返回信息                                 | 错误描述                           |
| -------- | ---------- | ---------------------------------------- | ---------------------------------- |
| E404     | 200        | 鉴权失败,未绑定电子面单账号              | 请绑定缺失的电子面单账号           |
| E409     | 200        | 鉴权失败,收寄人电话号码校验不一致        | 请使用正确的收件人、寄件人电话号码 |
| E413     | 200        | 鉴权失败,请输入收寄人任一方电话号码后4位 | 请输入收件人、寄件人电话号码后4位  |
| E416     | 200        | 不符合中通运单号规则校验                 | 请使用正确的中通运单号             |
| E418     | 200        | 鉴权失败,不存在对应的网点授权            | 请授权缺失的网点权限               |

---

### SDK使用示例-JAVA

github地址：<https://github.com/ZTO-Express/zopsdk-java>

相关压缩包如下：

[zopsdk-java-0.9.tar.gz](https://fscdn.zto.com/fs21/M03/C8/B6/CgRRhGPA0JuAVScdAAApzC1lkaY0064.gz)

[zopsdk-java-0.9.zip](https://fscdn.zto.com/fs21/M03/C8/B8/CgRRhGPA0WKAc9vDAAA_telkr0s303.zip)

下载源码后，请本地打包install或上传本地私服

以下是调用示例：

``` java
String appKey = "这里是appKey";
String appSecret = "这里是appSecret";
ZopClient client = new ZopClient(appKey, appSecret);
ZopPublicRequest request = new ZopPublicRequest();
String body = "这里是请求body";
request.setBody(body);
request.setUrl("https://japi-test.zto.com/zto.open.createOrder");
System.out.println(client.execute(request))
```

---

## 二、物流接口
>
> 接口地址
>>
>> - 测试环境：<https://japi-test.zto.com>
>> - 正式环境：<https://japi.zto.com>

> Headers参数
>>
>> - x-appKey：应用配置参数（在控制台-应用详情查看）
>> - x-dataDigest：数据签名[点击这里查看](https://open.zto.com/#/documents?menuId=4)

### 1.订单创建接口

接口地址：`zto.open.createOrder`

::: warning 注意
> 中通不需预下单
:::

#### 请求参数

<script setup>
import ztoTable from '/views/tepbridge/logistics/zto/zto-table.vue'
import ztoReqestBatchCloudPrintTable from '/views/tepbridge/logistics/zto/zto-request-batchCloudPrint-table.vue'
</script>
<ztoTable />
> #### 完整请求body示例

```json
{
  "partnerType": "2",
  "orderType": "1",
  "partnerOrderCode": "SJ20250806",
  "accountInfo": {
    "accountId": "test",
    "accountPassword": "ZTO123",
    "type": 1,
    "customerId": ""
  },
  "billCode": "",
  "senderInfo": {
    "senderId": "",
    "senderName": "杨犁",
    "senderPhone": "010-22226789",
    "senderMobile": "15685585514",
    "senderProvince": "广东省",
    "senderCity": "广州市",
    "senderDistrict": "黄埔区",
    "senderAddress": "骏业路255号"
  },
  "receiveInfo": {
    "receiverName": "董航",
    "receiverPhone": "021-87654321",
    "receiverMobile": "13500000000",
    "receiverProvince": "上海",
    "receiverCity": "上海市",
    "receiverDistrict": "闵行区",
    "receiverAddress": "申贵路1500号"
  },
  "orderVasList": [
    {
      "vasType": "COD",
      "vasAmount": 100000,
      "vasPrice": 0,
      "vasDetail": "",
      "accountNo": ""
    }
  ],
  "hallCode": "",
  "siteCode": "",
  "siteName": "",
  "summaryInfo": {
    "size": "50,50,50",
    "quantity": 3,
    "price": 10,
    "freight": 10,
    "premium": 10,
    "startTime": "2025-05-22 11:00:00",
    "endTime": "2025-05-22 12:00:00"
  },
  "remark": "盛捷物流供应链下单",
  "orderItems": [
    {
      "name": "联想笔记本电脑",
      "category": "电子产品",
      "material": "全金属",
      "size": "50,50,50",
      "weight": 500,
      "unitprice": 50000,
      "quantity": 3,
      "remark": "联想笔记本电脑"
    }
  ],
  "cabinet": {
    "address": "",
    "specification": 0,
    "code": ""
  }
}
```

> #### Java代码示例

```java
ZopClient client = new ZopClient("72089d3deb0ae445cdd35", "11109419708e0cc91fd0a1b9369d64c4");
ZopPublicRequest request = new ZopPublicRequest();
request.setBody("{\"partnerType\":\"2\",\"orderType\":\"1\",\"partnerOrderCode\":\"SJ20250522\",\"accountInfo\":{\"accountId\":\"test\",\"accountPassword\":\"ZTO123\",\"type\":1,\"customerId\":\"\"},\"billCode\":\"\",\"senderInfo\":{\"senderId\":\"\",\"senderName\":\"杨犁\",\"senderPhone\":\"010-22226789\",\"senderMobile\":\"15685585514\",\"senderProvince\":\"广东省\",\"senderCity\":\"广州市\",\"senderDistrict\":\"黄埔区\",\"senderAddress\":\"骏业路255号\"},\"receiveInfo\":{\"receiverName\":\"董航\",\"receiverPhone\":\"021-87654321\",\"receiverMobile\":\"13500000000\",\"receiverProvince\":\"上海\",\"receiverCity\":\"上海市\",\"receiverDistrict\":\"闵行区\",\"receiverAddress\":\"申贵路1500号\"},\"orderVasList\":[{\"vasType\":\"COD\",\"vasAmount\":100000,\"vasPrice\":0,\"vasDetail\":\"\",\"accountNo\":\"\"}],\"hallCode\":\"\",\"siteCode\":\"\",\"siteName\":\"\",\"summaryInfo\":{\"size\":\"50,50,50\",\"quantity\":3,\"price\":10,\"freight\":10,\"premium\":10,\"startTime\":\"2025-05-22 11:00:00\",\"endTime\":\"2025-05-22 12:00:00\"},\"remark\":\"盛捷物流供应链下单\",\"orderItems\":[{\"name\":\"联想笔记本电脑\",\"category\":\"电子产品\",\"material\":\"全金属\",\"size\":\"50,50,50\",\"weight\":500,\"unitprice\":50000,\"quantity\":3,\"remark\":\"联想笔记本电脑\"}],\"cabinet\":{\"address\":\"\",\"specification\":0,\"code\":\"\"}}");
request.setUrl("https://japi-test.zto.com/zto.open.createOrder");
request.setBase64(true);
request.setEncryptionType(MD5);
request.setTimestamp(null);
System.out.println(client.execute(request));
```

> #### 响应示例

```json
{
  "result": {
    "bigMarkInfo": {
      "bagAddr": "沪西",
      "mark": "300- H12 09"
    },
    "verifyCode": null,
    "siteCode": "02100",
    "signBillInfo": null,
    "siteName": "上海",
    "billCode": "73100196611386",
    "orderCode": "250522000006047100",
    "partnerOrderCode": "SJ20250522"
  },
  "message": "成功",
  "status": true,
  "statusCode": "0000"
}
```

### 2、物流轨迹订阅/推送

- 物流轨迹订阅测试地址：<https://japi-test.zto.com/zto.merchant.waybill.track.subsrcibe>
- 物流轨迹订阅正式环境：<https://japi.zto.com/zto.merchant.waybill.track.subsrcibe>

#### 2.1. 物流轨迹订阅

##### (SDK使用示例)

```java
ZopClient client = new ZopClient("72089d3deb0ae445cdd35", "11109419708e0cc91fd0a1b9369d64c4");
ZopPublicRequest request = new ZopPublicRequest();
request.setBody("{\"billCode\":\"73100196611386\",\"mobilePhone\":\"5514\"}");
request.setUrl("https://japi-test.zto.com/zto.merchant.waybill.track.subsrcibe");
request.setBase64(true);
request.setEncryptionType(MD5);
request.setTimestamp(null);
System.out.println(client.execute(request));
```

##### 请求参数

```json
{
  "billCode": "73100196611386",
  "mobilePhone": "5514"
}
```

##### 响应参数

```json
{
  "result": null,
  "message": "操作成功",
  "statusCode": "SYS000",
  "status": true
}
```

#### 2.2 物流轨迹推送(中通----->智桥ERP)

```java
2025-05-22 15:08:30.936 [http-nio-9009-exec-1-93918] INFO 
                requestId= [receivingLogisticsTrack,28] c.i.c.z.ZTOOrdersTraceMsgPushController -中通物流轨迹推送：{data_digest=STm5woOKLcMxbqnTvPC6rg==, company_id=72089d3deb0ae445cdd35, data={"actionTime":"2025-05-22 15:08:27","facilityContactPhone":"027-59767205","city":"攀枝花市","dist":"江夏区","billCode":"73100196611386","courierPhone":"027-59767205","action":"DEPARTURE_SIGNED","facilityName":"渣渣","comName":"兔喜生活","comCode":"1022","desc":"【武汉市】已签收，签收人凭取货码签收，如有疑问请联系：027-59767205/ 027-59767205。感谢使用中通快递，期待再次为您服务！"}, msg_type=Traces, token=}
2025-05-22 15:08:56.627 [http-nio-9009-exec-3-93918] INFO 
                requestId= [receivingLogisticsTrack,28] c.i.c.z.ZTOOrdersTraceMsgPushController -中通物流轨迹推送：{data_digest=lTdJ2Y+P4ye1DVCQq+kBlw==, company_id=72089d3deb0ae445cdd35, data={"actionTime":"2025-05-22 15:08:53","address":"文一西路588号","facilityContactPhone":"027-59767205","city":"黔南布依族苗族自治州","dist":"江夏区","billCode":"73100196611386","action":"INBOUND","facilityName":"常州景泰家园南门商铺2_10店","comName":"菜鸟","comCode":"1014","desc":"【武汉市】快件已被【常州景泰家园南门商铺2_10店】代收，如有问题请联系 (027-59767205)，感谢使用中通快递，期待再次为您服务！"}, msg_type=Traces, token=}
2025-05-22 15:08:57.662 [http-nio-9009-exec-4-93918] INFO 
                requestId= [receivingLogisticsTrack,28] c.i.c.z.ZTOOrdersTraceMsgPushController -中通物流轨迹推送：{data_digest=921DwNGakCP8qZJpaTAtKA==, company_id=72089d3deb0ae445cdd35, data={"actionTime":"2025-05-22 15:08:53","facilityContactPhone":"027-59767205","city":"黔南布依族苗族自治州","action":"HANDOVERSCAN_SIGNED","dist":"江夏区","billCode":"73100196611386","facilityName":"常州景泰家园南门商铺2_10店","desc":"【武汉市】快件已投递【常州景泰家园南门商铺2_10店】，如有问题请电联 (027-59767205)，感谢使用中通快递，期待再次为您服务！"}, msg_type=Traces, token=}
2025-05-22 15:09:28.074 [http-nio-9009-exec-6-93918] INFO 
                requestId= [receivingLogisticsTrack,28] c.i.c.z.ZTOOrdersTraceMsgPushController -中通物流轨迹推送：{data_digest=gokmEXw/lnwJDcbAzqxmTw==, company_id=72089d3deb0ae445cdd35, data={"facilityCode":"02729","actionTime":"2025-05-22 15:08:47","city":"武汉市","facilityContactPhone":"027-59767205","dist":"江夏区","billCode":"73100196611386","courier":"","action":"DISPATCH","courierPhone":"13916794407","facilityName":"武汉藏龙岛","desc":"【武汉市】【武汉藏龙岛】（027-59767205）的业务员（13916794407）正在派件【95720为中通快递员外呼专属号码，请放心接听】小哥今日体温正常，将佩戴口罩为您投递，也可以联系小哥将您的快递，放到您指定的代收点，祝您身体健康！"}, msg_type=Traces, token=}
2025-05-22 15:09:57.265 [http-nio-9009-exec-8-93918] INFO 
                requestId= [receivingLogisticsTrack,28] c.i.c.z.ZTOOrdersTraceMsgPushController -中通物流轨迹推送：{data_digest=WBWoEJ77wl9X5cZypTk1Jw==, company_id=72089d3deb0ae445cdd35, data={"facilityCode":"37131","actionTime":"2025-05-22 15:09:54","city":"郑州市","facilityContactPhone":"0371-67584463","dist":"中原区","billCode":"73100196611386","courier":"梅宇兵","action":"SIGNED","courierPhone":"90000000000","facilityName":"郑州高新区","expressSigner":"王五","desc":"【郑州市】快件已由【王五】签收，签收网点：【郑州高新区】。如有疑问请电联：90000000000，投诉电话：0371-67584463。感谢使用中通快递，期待再次为您服务！"}, msg_type=Traces, token=}
2025-05-22 15:15:12.346 [http-nio-9009-exec-10-93918] INFO 
                requestId= [receivingLogisticsTrack,28] c.i.c.z.ZTOOrdersTraceMsgPushController -中通物流轨迹推送：{data_digest=y6wOxWh+nqRtJjpMOIFrCA==, company_id=72089d3deb0ae445cdd35, data={"billCode":"73100196611386","actionTime":"2025-05-22 15:07:55","address":"高沟镇快递服务点","facilityContactPhone":"15712345741","city":"邯郸市","action":"INBOUND","facilityName":"淮安市涟水县高沟镇今世缘酒业","desc":"【武汉市】快件已被【淮安市涟水县高沟镇今世缘酒业】代收，如有问题请电联 (15712345741)，感谢使用中通快递，期待再次为您服务！"}, msg_type=Traces}
2025-05-22 15:15:12.928 [http-nio-9009-exec-1-93918] INFO 
                requestId= [receivingLogisticsTrack,28] c.i.c.z.ZTOOrdersTraceMsgPushController -中通物流轨迹推送：{data_digest=V7PYG70wn/g9w4m0C7SdGQ==, company_id=72089d3deb0ae445cdd35, data={"billCode":"73100196611386","facilityCode":"37131","actionTime":"2025-05-22 15:08:06","city":"郑州市","facilityContactPhone":"0371-60127587","courier":"李四","action":"SIGNED","courierPhone":"18212345741","facilityName":"郑州高新区","expressSigner":"王五","desc":"【郑州市】快件已由【王五】签收，签收网点：【郑州高新区】。如有疑问请电联：18212345741，投诉电话：0371-60127587，您的快递已经妥投，风里来雨里去，只为客官您满意。上有老下有小，赏个好评好不好？"}, msg_type=Traces}
2025-05-22 15:15:13.019 [http-nio-9009-exec-2-93918] INFO 
                requestId= [receivingLogisticsTrack,28] c.i.c.z.ZTOOrdersTraceMsgPushController -中通物流轨迹推送：{data_digest=dyCx2odSAY4Y7dGu6mDmSQ==, company_id=72089d3deb0ae445cdd35, data={"billCode":"73100196611386","facilityCode":"37131","actionTime":"2025-05-22 15:07:46","city":"郑州市","action":"ARRIVAL","facilityName":"郑州高新区","desc":"【郑州市】快件已到达【郑州高新区】"}, msg_type=Traces}
2025-05-22 15:15:13.470 [http-nio-9009-exec-3-93918] INFO 
                requestId= [receivingLogisticsTrack,28] c.i.c.z.ZTOOrdersTraceMsgPushController -中通物流轨迹推送：{data_digest=IjrMHQntv0cBopxcxVXD+g==, company_id=72089d3deb0ae445cdd35, data={"billCode":"73100196611386","facilityCode":"02191","actionTime":"2025-05-22 15:06:35","facilityContactPhone":"15712345741","city":"上海市","courier":"张三","action":"GOT","courierPhone":"021-60556935、021-60556935","facilityName":"青浦华新","desc":"【上海市】【青浦华新】(021-60556935、021-60556935)的业务员张三(15712345741)已揽收"}, msg_type=Traces}
2025-05-22 15:15:13.522 [http-nio-9009-exec-4-93918] INFO 
                requestId= [receivingLogisticsTrack,28] c.i.c.z.ZTOOrdersTraceMsgPushController -中通物流轨迹推送：{data_digest=tPAvWCj2zRbmniC7w+pLGQ==, company_id=72089d3deb0ae445cdd35, data={"billCode":"73100196611386","facilityCode":"02191","actionTime":"2025-05-22 15:07:35","facilityContactPhone":"15712345741","city":"上海市","courier":"张三","action":"GOT","courierPhone":"021-60556935、021-60556935","facilityName":"青浦华新","desc":"【上海市】【青浦华新】(021-60556935、021-60556935)的业务员张三(15712345741)已揽收"}, msg_type=Traces}
2025-05-22 15:15:15.020 [http-nio-9009-exec-5-93918] INFO 
                requestId= [receivingLogisticsTrack,28] c.i.c.z.ZTOOrdersTraceMsgPushController -中通物流轨迹推送：{data_digest=HQqH3P3pLmbJssrh3tSyoQ==, company_id=72089d3deb0ae445cdd35, data={"billCode":"73100196611386","facilityCode":"02191","nextNodeCode":"37131","nextCity":"郑州市","actionTime":"2025-05-22 15:07:42","city":"上海市","nextNodeName":"郑州高新区","action":"DEPARTURE","facilityName":"青浦华新","desc":"【上海市】快件离开【青浦华新】发往郑州高新区"}, msg_type=Traces}
2025-05-22 15:15:15.133 [http-nio-9009-exec-6-93918] INFO 
                requestId= [receivingLogisticsTrack,28] c.i.c.z.ZTOOrdersTraceMsgPushController -中通物流轨迹推送：{data_digest=xuYQSkfW7qXMG2EuhsINkQ==, company_id=72089d3deb0ae445cdd35, data={"billCode":"73100196611386","facilityCode":"37131","actionTime":"2025-05-22 15:07:50","facilityContactPhone":"17812345632","city":"郑州市","courier":"李四","action":"DISPATCH","courierPhone":"18212345741","facilityName":"郑州高新区","desc":"【郑州市】【郑州高新区】（17812345632）的业务员李四（18212345741）正在派件【95720为中通快递员外呼专属号码，请放心接听】！"}, msg_type=Traces}
2025-05-22 15:15:15.625 [http-nio-9009-exec-7-93918] INFO 
                requestId= [receivingLogisticsTrack,28] c.i.c.z.ZTOOrdersTraceMsgPushController -中通物流轨迹推送：{data_digest=YyV1aHSEsav4sIKuv4xk0A==, company_id=72089d3deb0ae445cdd35, data={"billCode":"73100196611386","actionTime":"2025-05-22 15:08:02","facilityContactPhone":"15712345741","city":"武汉市","action":"DEPARTURE_SIGNED","courierPhone":"15712345741","facilityName":"淮安市涟水县高沟镇今世缘酒业","desc":"【武汉市】已签收，签收人凭取货码签收，如有疑问请电联：15712345741，您的快递已经妥投，风里来雨里去，只为客官您满意。上有老下有小，赏个好评好不好？"}, msg_type=Traces}

```

### 3.订单取消接口

**接口地址：** `zto.open.cancelPreOrder`
::: warning 注意
1.zto.open.cancelPreOrder（取消订单接口）只支持取消同一appKey下的预约件订单

2.全网件单号不支持手动取消，获取单号后无扫描记录，30-60天后系统自动回收
:::

#### 请求参数

| 名称 | 类型 |   最大长度   | 是否必须   | 示例值                  | 描述 |
| ---------- | ------ | ---- | ---- | ------------------ | ------------------------------------------------------------ |
| cancelType | string |      | 是   | 1                  | 取消类型 1不想寄了,2下错单,3重复下单,4运费太贵,5无人联系,6取件太慢,7态度差 |
| orderCode  | string |      | 否   | 200824000005397109 | 预约件订单号（orderCode与billCode必传其一）                  |
| billCode   | string |      | 否   | 73110263178916     | 运单号（orderCode与billCode必传其一）                        |

#### 完整请求body示例

``` json
{
  "cancelType": "2",
  "orderCode": "",
  "billCode": "73567696585xxx"
}
```

#### Java代码示例

``` java
 String body = "{\n" +
                "  \"cancelType\": \"2\",\n" +
                "  \"orderCode\": \"\",\n" +
                "  \"billCode\": \"73567696585xxx\",\n" +
                "}";
        // 以下中通SDK使用的是jar引入方式,放在了resources/lib/zto下
        // 测试环境
//        ZopClient client = new ZopClient("72089d3deb0ae445cdd35", "11109419708e0cc91fd0a1b9369d64c4");
        // 生产环境
        ZopClient client = new ZopClient("6c3cxxx5821ef", "e152baxxx03554021d6");
        ZopPublicRequest request = new ZopPublicRequest();
        request.setBody(body);
        // 测试环境
//        request.setUrl("https://japi-test.zto.com/zto.print.batchCloudPrint");
        // 生产环境
        request.setUrl("https://japi.zto.com/zto.open.cancelPreOrder");
        request.setBase64(true);
        request.setEncryptionType(MD5);
        request.setTimestamp(null);
        System.out.println(client.execute(request));
```

#### 响应示例

``` json
{
  "result":{},
  "message":"请求成功",
  "status":true,
  "statusCode":"SYS000"
}
```

### 4.批量云打印

**接口地址：** `zto.print.batchCloudPrint`
::: warning 注意:
云打印批量打印面单接口（测试环境不支持打印）

开放平台上使用到的接口均已上线
:::

#### 请求参数

<ztoReqestBatchCloudPrintTable/>

#### 完整请求body示例

``` json
{
  "printerId": "HPRT N51 (副本 1)",
  "deviceId": "8C:32:23:21:9C:xx",
  "qrcodeId": "",
  "printChannel": "ZOP",
  "printInfos": [
    {
      "partnerCode": "202520036914037xxx",
      "printParam": {
        "paramType": "ELEC_MARK",
        "mailNo": "73567696585xxx",
        "elecAccount": "",
        "elecPwd": "",
        "printMark": "300- F9 09",
        "printBagaddr": "沪西",
        "paiMan": "015",
        "fourCode": ""
      },
      "sender": {
        "name": "杨犁",
        "mobile": "15685585xxx",
        "prov": "广东省",
        "city": "广州市",
        "county": "黄埔区",
        "address": "骏业路255号"
      },
      "receiver": {
        "name": "巴拉巴拉",
        "mobile": "19292082xxx",
        "prov": "上海",
        "city": "上海市",
        "county": "闵行区",
        "address": "申贵路1500号"
      },
      "repetition": false,
      "goods": {
        "goodsName": "",
        "weight": 1000,
        "freight": 0,
        "remark": ""
      },
      "checked": true,
      "staffCode": "",
      "payType": "CASH",
      "sheetMode": "PRINT_SHEET",
      "appreciationDTOS": [
        {
          "type": 2,
          "amount": 0,
          "backBillCode": "",
          "takingEmpCode": "",
          "tenantName": "",
          "partnerId": "",
          "realName": "0"
        }
      ]
    }
  ]
}
```

#### java代码示例

``` java
String body = "{\n" +
                "  \"printerId\": \"HPRT N51 (副本 1)\",\n" +
                "  \"deviceId\": \"8C:32:23:21:9C:xx\",\n" +
                "  \"qrcodeId\": \"\",\n" +
                "  \"printChannel\": \"ZOP\",\n" +
                "  \"printInfos\": [\n" +
                "    {\n" +
                "      \"partnerCode\": \"202520036914037103\",\n" +
                "      \"printParam\": {\n" +
                "        \"paramType\": \"ELEC_MARK\",\n" +
                "        \"mailNo\": \"73567696585919\",\n" +
                "        \"elecAccount\": \"\",\n" +
                "        \"elecPwd\": \"\",\n" +
                "        \"printMark\": \"300- F9 09\",\n" +
                "        \"printBagaddr\": \"沪西\",\n" +
                "        \"paiMan\": \"015\",\n" +
                "        \"fourCode\": \"\"\n" +
                "      },\n" +
                "      \"sender\": {\n" +
                "        \"name\": \"杨犁\",\n" +
                "        \"mobile\": \"15685585514\",\n" +
                "        \"prov\": \"广东省\",\n" +
                "        \"city\": \"广州市\",\n" +
                "        \"county\": \"黄埔区\",\n" +
                "        \"address\": \"骏业路255号\"\n" +
                "      },\n" +
                "      \"receiver\": {\n" +
                "        \"name\": \"巴拉巴拉\",\n" +
                "        \"mobile\": \"19292082784\",\n" +
                "        \"prov\": \"上海\",\n" +
                "        \"city\": \"上海市\",\n" +
                "        \"county\": \"闵行区\",\n" +
                "        \"address\": \"申贵路1500号\"\n" +
                "      },\n" +
                "      \"repetition\": false,\n" +
                "      \"goods\": {\n" +
                "        \"goodsName\": \"\",\n" +
                "        \"weight\": 1000,\n" +
                "        \"freight\": 0,\n" +
                "        \"remark\": \"\"\n" +
                "      },\n" +
                "      \"checked\": true,\n" +
                "      \"staffCode\": \"\",\n" +
                "      \"payType\": \"CASH\",\n" +
                "      \"sheetMode\": \"PRINT_SHEET\",\n" +
                "      \"appreciationDTOS\": [\n" +
                "        {\n" +
                "          \"type\": 2,\n" +
                "          \"amount\": 0,\n" +
                "          \"backBillCode\": \"\",\n" +
                "          \"takingEmpCode\": \"\",\n" +
                "          \"tenantName\": \"\",\n" +
                "          \"partnerId\": \"\",\n" +
                "          \"realName\": 0\n" +
                "        }\n" +
                "      ]\n" +
                "    }\n" +
                "  ]\n" +
                "}";
        // 以下中通SDK使用的是jar引入方式,放在了resources/lib/zto下
        ZopClient client = new ZopClient("72089d3deb0ae445cdxxx", "11109419708e0cc91fd0a1b9369d6xxx");
        ZopPublicRequest request = new ZopPublicRequest();
        request.setBody(body);
        // 测试环境
//        request.setUrl("https://japi-test.zto.com/zto.print.batchCloudPrint");
        // 生产环境
        request.setUrl("https://japi.zto.com/zto.print.batchCloudPrint");
        request.setBase64(true);
        request.setEncryptionType(MD5);
        request.setTimestamp(null);
        System.out.println(client.execute(request));
    }

```

#### 响应示例

```json
{
  "result": {
    "printSuccessList": [
      {
        "partnerCode": "202520036914037103",
        "billCode": "73567696585919"
      }
    ],
    "printErrorList": []
  },
  "message": "操作成功",
  "statusCode": "SYS000",
  "status": true
}
```

## 三、面单打印

### 面单打印规范

**电子面单是承载客户包裹收寄信息、帮助中转运输的重要载体，请您认真阅读以下说明。**

#### 1、面单模板说明

1、 面单尺寸大小：76mm*130mm

2、 面单取值说明

![img](https://huzhou-oss.zto.com/object/openplatform/huzhou?id=openplatform.huzhou:wuxingclusterM:fb8fcba033af1a4e8137bc226ddfa7ce_202303_1635576996508196864_:0&appId=open-platform.zto&signature=45BA8CBEFBCB8A1636421E621B8EB4D181A341BA&timestamp=1678786918)

vastype：增值类型

mark：大头笔

billcode：运单号

bagAddr：集包地

QR Code：二维码，需要使用二维码生成工具生成，具体链接为：<https://q.zto.com/c/idx?channel=ydy> 。该链接生成的二维码可用微信/支付宝扫码打开中通快递小程序。

#### 2、 打印工具选择

1、 使用开放平台提供的[商家自主打单](https://open.zto.com/#/abilityDetail?code=PRINTING_SERVICE)服务。

2、 使用第三方提供的打印工具，如旺店通等三方打单软件。

3、 根据自身需求，按照中通电子面单打印规则，自主研发打印功能。

#### 3、详细打印规则

为规范快递信息的填写，提高发件的效率和准确性，打印前请仔细阅读模板规范，按照打印规则打印合适的电子面单。点击下载[《电子面单打印规则》](https://fscdn.zto.com/GetPublicFile/DFS1580107224708513793/1708411372741d905-电子面单模板规则与增值产品清单20240220.xlsx)。

云打印使用说明

### 云打印使用说明

#### STEP1.下载安装

进入[云打印官网](http://eprint.zto.com/official/)，下载客户端，安装到电脑。

![img](https://huzhou-oss.zto.com/object/openplatform/huzhou?id=openplatform.huzhou:wuxingclusterH:95bae16b43be90e0eb7e5edcd8ac7fcd_202103_1374542011882672128_&appId=open-platform.zto&signature=2F55F17E84092EA992650FA17D4BCB86C1E4AD67&timestamp=1616551355)

#### STEP2.注册云打印账号

打开云打印软件，登录模块->注册账号；

![img](https://huzhou-oss.zto.com/object/openplatform/huzhou?id=openplatform.huzhou:wuxingclusterI3:0206fb7d7d2463a6173e5d67ae0fe926_202103_1374542626692960256_&appId=open-platform.zto&signature=9DDDC078E3E3BFF217A861D1D361A15467671071&timestamp=1616551489)

#### STEP3.云打印绑定电子面单账号

点击新版中通云打印软件界面右上角的用户信息，选择电子面单设置；进入云打印管理系统，在界面左侧使用云打印账号密码验证登录；登录成功后，云打印管理系统界面左侧展示电子面单账号设置信息；

a.线下电子面单账号 使用线下电子面单账号的商家ID和秘钥绑定（商家ID和秘钥请联系合作网点提供），若输入业务员编号则直接分单至该业务员。 绑定的线下电子面单账号内电子面单余额不足，将无法正常打印出面单。

b.业务员账号 输入业务员编号进行绑定（业务员编号的绑定手机号必须与当前登录云打印的手机号一致）

c.普通账号 不绑定电子面单账号，云打印软件仅作为打印工具，打单时使用对接方系统内绑定的电子面单账号余额

![img](https://huzhou-oss.zto.com/object/openplatform/huzhou?id=openplatform.huzhou:wuxingclusterK4:9be26cbce268b2d49e4df30b4b8091d6_202103_1374544323335475200_&appId=open-platform.zto&signature=2E2126ABDE9B950A7D12536B569CC09182101034&timestamp=1616551887)

![img](https://huzhou-oss.zto.com/object/openplatform/huzhou?id=openplatform.huzhou:wuxingclusterK1:793febdb84bd010579a2d5e2718113cb_202103_1374544359392677888_&appId=open-platform.zto&signature=0B9EDDA1B682D0CBDC25BA364227EF4BD99B0597&timestamp=1616551915)

![img](https://huzhou-oss.zto.com/object/openplatform/huzhou?id=openplatform.huzhou:wuxingclusterK4:96c1c457f912f93455b64f0e65749361_202103_1374544675143258112_&appId=open-platform.zto&signature=BA7FD694EF3AAE58B4CF04A4CDA1FC2B6A9C50D0&timestamp=1616551963)

#### STEP4.维护设备名称

点击新版中通云打印软件界面左上角的选项，选择修改设备名，输入新设备名后点击确认

![img](https://huzhou-oss.zto.com/object/openplatform/huzhou?id=openplatform.huzhou:wuxingclusterK1:dfb336afcb0152a0203f752ba29f613e_202103_1374545054486548480_&appId=open-platform.zto&signature=881C4B1ED4BF9FCBC97B3F9178DDCC91988A9BAE&timestamp=1616552061)

#### STEP5.生成云打印二维码

选择打印机后，选择需要使用的打印模板并点击设置为当前打印模板，点击生成设备二维码（建议设置谷歌浏览器为默认浏览器）

![img](https://huzhou-oss.zto.com/object/openplatform/huzhou?id=openplatform.huzhou:wuxingclusterK3:5d2d011fc9100f5754e3cdc28590bb00_202103_1374545157062037504_&appId=open-platform.zto&signature=9B46A79BE29E881942ED92B604F2DC333B6917B2&timestamp=1616552092)

#### STEP6.连接云打印设备，执行打印

调用云打印接口时根据上传指定的云打印设备二维码url中的参数，传送打印任务到打印机，执行打印。

#### 常见问题解答

a.使用云打印PC端生成的云打印机二维码进行打印，必须保证：1.打印机正常连接电脑且能打印出打印机测试页，2.云打印PC端正在运行；

b.打开云打印软件时显示无可用打印机，请在电脑上连接热敏打印机；

c.如何切换云打印的打印模板：选择打印机和要使用的打印模板，点击设置为打印模板，重新生成二维码，然后重新扫码绑定；

d.扫描云打印二维码绑定成功后，打印机不出纸：1.在云打印软件界面，重新选择对应的打印机，生成新的二维码，重新扫码绑定打印  看下是否出纸；2.电脑控制面板-设备与打印机界面找到对应的打印机，右键选择打印机属性-打印测试页，看下打印机测试页是否能正常打印，如果不能正常打印，联系打印机售后处理；

e.面单打印出来不完整，或面单不全内容偏移：在控制面板-查看设备和打印机-选择对应的打印机-右键选择打印机首选项-设置尺寸或设置一下偏移；

f.更多问题可访问[云打印官网](https://eprint.zto.com/official/html/help.html)；
<!-- 
![image-20250522160646772](D:\其他\系统对接\中通物流开放平台\image-20250522160646772.png) -->
