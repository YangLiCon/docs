# 接口调用规范
## 通讯协议

- REST风格的API，使用HTTP(S)协议发送POST请求调用接口。注：测试环境使用HTTP协议，正式环境使用HTTPS协议
- 请求头类型为 Content-Type: application/json。



## 接口调用说明

1. 报文为UTF8编码，支持半角、中文、英文、数字、基本标点符号

注：请注意不要有表情符号等各种非法字符，会导致数据库写入失败。

1. 报文是一个 json 字符串，调用接口时，直接放到请求体内即可
2. 对接方需要支持 HTTP、HTTPS 的接口调用方式。
3. 接口文档中的公共请求参数（系统参数）需要用 & 符号拼接到 url 后再调用接口。
   比如，接口地址为 http(s)\://abc/trade.weight.php；系统参数有 k1、k2，值分为为 v1、v2。那么最终调用的接口为地址 http(s)\://abc/trade.weight.php?k1=v1&k2=v2。

注：不要将密钥即  appsecret/ app_secret   拼接到 URL 后传发送到互联网中，请求体不需要拼接在 url 后面。

1. 为了保证传输数据的安全性，WMS 会给接入客户分配 appkey、appsecret 等参数，接入客户需要用这些参数计算签名，并将签名（sign）拼接在 url 后调用接口。具体 sign 签名计算方法请见后文。

## 签名算法（定制接口）

采用的签名方式为MD5，且将md5的结果转成大写。

### 签名算法示例

- 假设请求体数据如下（实际数据参见具体接口文档）：

```json
{"stockout_no": "1 2 3"}
```

- 假设接口公共参数如下（实际数据参见具体接口文档）：

```properties
method=trade.weight
timestamp=2017-07-26 00:00:07
format=json
appkey=test
sign_method=md5
sid=wms_test
```

- 第一步：将公共参数的字段名字按字典序从小到大排序

```properties
appkey=test
format=json
method=trade.weight
sid=wms_test
sign_method=md5
timestamp=2017-07-26 00:00:07
```

- 第二步：拼接排序后的公共参数的 key、value

```plain
appkeytestformatjsonmethodtrade.weightsidwms_testsign_methodmd5timestamp2017-07-26 00:00:07
```

- 第三步：在第二步的结果后面拼接请求体

```plain
appkeytestformatjsonmethodtrade.weightsidwms_testsign_methodmd5timestamp2017-07-26 00:00:07{"stockout_no": "1 2 3"}
```

- 第四步：在第三步的结果的**【首尾】拼接 appsecret**，此处假设appsecret=xyz。

```plain
xyzappkeytestformatjsonmethodtrade.weightsidwms_testsign_methodmd5timestamp2017-07-26 00:00:07{"stockout_no": "1 2 3"}xyz
```

- 第五步：生成32位MD5大写签名值：

```php
strtoupper(md5('xyzappkeytestformatjsonmethodtrade.weightsidwms_testsign_methodmd5timestamp2017-07-26 00:00:07{"stockout_no": "1 2 3"}xyz'));
```

最终得到结果为：57FBABDBD18780323128F5C88217A9C8，该值即签名值（sign）。

### 代码示例

旺店通WMS提供了多种代码示例，请下载后参考。



[标准定制接口.zip](https://www.yuque.com/attachments/yuque/0/2022/zip/139697/1663746590771-c325b3d8-8160-4b84-a53f-f528d72ce380.zip)

### Postman 调用示例截图

![img](https://cdn.nlark.com/yuque/0/2022/png/139686/1660790642993-8eee1654-779f-41b1-8242-47dc88157032.png)



## 压缩算法（定制接口）

公共请求参数中 compress_response_body 为"1"时，会将响应体压缩后返回。采用的压缩算法为 ZLIB，并做 base64 编码。

### 压缩算法示例

假设响应体数据如下（实际数据参见具体接口文档）：

```json
{	"flag": "success",	"code": "",	"content": [{"stockout_no": "123"}],	"message": "",	"total": "1"}
```

- ZLIB 压缩后做 base64 编码操作

```php
base64_encode(gzcompress('{"flag": "success","code": "","content": [{"stockout_no": "123"}],"message": "","total": "1"}'));
```

最终得到的结果为：eJyrVkrLSUxXslJQKi5NTk4tLlbSUUrOT0kFiYCZeSWpeSVAXnS1UnFJfnJ2fmlJfF4+SNrQyFipNlZHKReoKzEdpqMkvyQxByytVAsATcccEg==，该值即为压缩后的最终数据

### 代码示例

旺店通WMS提供了多种代码示例：

```php
<?php

// 使用的是5.4.9版本的编译运行环境。
  
// 压缩
base64_encode(gzcompress($response_origin_str));

// 解压
gzuncompress(base64_decode($response_after_compress));
// jdk1.8

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Arrays;
import java.util.Base64;
import java.util.zip.Deflater;
import java.util.zip.Inflater;

public class GzCompress{
	// 示例
    public static void main(String[] args) {

        String encodeCompressd  = "eJyrVkrLSUxXslJQKi5NTk4tLlbSUUrOT0kFiYCZeSWpeSVAXnS1UnFJfnJ2fmlJfF4+SNrQyFipNlZHKReoKzEdpqMkvyQxByytVAsATcccEg==";
        byte[] compressd = Base64.getDecoder().decode( encodeCompressd );
        String origin  = new String( decompress(compressd) );
        System.out.println("origin: "+origin);
        byte[] _compressd = compress(origin.getBytes());
        byte[] _encodeCompress = Base64.getEncoder().encode(_compressd);
        System.out.println(new String(_encodeCompress));
    }
    
    public static byte[] decompress(byte[] data)  {

        byte[] output = new byte[0];

        Inflater decompresser = new Inflater();
        decompresser.reset();
        decompresser.setInput(data);

        ByteArrayOutputStream o = new ByteArrayOutputStream(data.length);
        try {
            byte[] buf = new byte[1024];
            while (!decompresser.finished()) {
                int i = decompresser.inflate(buf);
                o.write(buf, 0, i);
            }
            output = o.toByteArray();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                o.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        decompresser.end();
        return output;
    }

    public static byte[] compress( byte[] bytes ){

        byte[] output = new byte[1024];
        Deflater compresser = new Deflater();
        compresser.setInput(bytes);
        compresser.finish();
        int compressedDataLength = compresser.deflate(output);
        return Arrays.copyOf(output,compressedDataLength);
    }
}
// python版本为 3.x

// 压缩
base64.b64encode(zlib.compress(response_origin_str))

// 解压
zlib.decompress(base64.b64decode(response_after_compress))
```