# 接口调用规范
## 通讯协议

1. REST风格的API，使用HTTP(S)协议发送POST请求调用接口。注：测试环境使用HTTP协议，正式环境使用HTTPS协议
2. 通用接口请求头类型为 `Content-Type：application/json`。 

## 接口调用说明

1. 报文为UTF8编码，支持半角、中文、英文、数字、基本标点符号。

​        注：不要有表情符号等各种非法字符，会导致数据库写入失败。

1. 报文是一个 `JSON` 对象，调用接口时，直接放到请求体内即可。
2. 对接方需要支持 HTTP、HTTPS 的接口调用方式。
​        
3. 注：不要将【**密钥****appsecret**】拼接到 URL 后传发送到互联网中，请求体不需要拼接在 url 后面。

## 签名算法
### 🔐 签名生成过程
### 📋 前置条件
- appkey: 应用标识（如：test_app）
-  appsecret: 应用密钥（如：test_appsecret_2024）
#### 🛠️  实现步骤
#### 第1步：收集请求参数
```properties
- 获取除'sign'外的所有请求参数，包括：
- 公共参数：appkey, timestamp, nonce, version
- 业务参数：如userId, name等
```
#### 步骤2: 过滤无效参数
```properties
// 移除空值和sign参数
Map<String, String> filteredParams = new HashMap<>(params);
filteredParams.remove("sign");

// 示例参数：
{
"appkey": "test_app",
"timestamp": "1640995200000",
"nonce": "abc123def456ghi7",
"version": "1.0",
"userId": "12345"
}
```

#### 步骤3: 参数排序
```properties
按照参数名的ASCII码从小到大排序（字典序）

排序前：
- z=3
- a=1
- m=2

排序后：
- a=1
- m=2
- z=3
```

#### 步骤4：URL键值对拼接
```properties
格式：key1=value1&key2=value2value2&key3=value3

示例：
原始参数：{"b":"2","a":"1","c":"3"}
排序后：["a","b","c"]
拼接结果："a=1&b=2&c=3"
```

#### 步骤5：附加密钥
```properties
在拼接好的字符串末尾加上'appsecret'

格式：{sorted_string}&key={appsecret}

示例：
"a=1&b=2&c=3&key=test_appsecret_2024"
```

#### 步骤6：生成签名摘要
```properties
支持的加密方式：

1. MD5加密（推荐）：
input → MD5 → 32位小写hex字符串

2. HMAC-SHA256加密：
input → HMAC-SHA256 → 64位小写hex字符串
```
### ⚡ 快速示例演示
#### 输入参数：
```json
{
    "appkey": "test_app",
    "timestamp": "1640995200000",
    "nonce": "abc123def456ghi7",
    "name": "张三",
    "age": "25"
}
```

### 逐步计算
| 步骤	| 操作	| 结果 |
| --- | --- | --- |
| ① 原始 原始参数 | `{"appkey":"test_app","timestamp":"1640995200000","nonce":"abc123def456ghi7","name":"张三","age":"25"}` | - |
| ② 按键名排序 | `{"appkey":"test_app","timestamp":"1640995200000","nonce":"abc123def456ghi7","name":"张三","age":"25"}` | - |
| ③ URL键值对拼接 | `"age=25&appkey=test_app&name=张三&nonce=abc123def456ghi7&timestamp=1640995200000"` | - |
| ④ 附加密钥 | `"age=25&appkey=test_app&name=张三&nonce=abc123def456ghi7&timestamp=1640995200000&key=test_appsecret_2024"` | - |
| ⑤ MD⑤ MD5加密 | `"5d7e9f12a34567890abcdef12345678"` | - |

## ✅ 签名验证流程
### 服务端验证步骤：
#### 第1步：基本参数检查
```java
必须包含的参数：
✅ appkey      - 应用标识
✅ timestamp   - 时间戳
✅ nonce       - 随机数
✅ sign        - 客户端生成的签名
```

#### 第2步：时间戳检查
```java
long timestamp = Long.parseLong(params.get("timestamp"));
long currentTime = System.currentTimeMillis();

// 允许±5分钟的误差
boolean isValid = Math.abs(currentTime - timestamp) <= 300000;
```

#### 第3步：防重放攻击
```java
String nonce = params.get("nonce");

// 检查该nonce是否已被使用过
if (usedNonusedNonces.contains(nonce)) {
    return false; // 拒绝重复请求
}
usedNonces.add(nonce); // 记录已使用的nonce
```

#### 第4步：重新计算签名
```java
// 与服务端存储的appsecret配对
String storedAppsecret = getAppsecretFromDB(appkey);

// 严格按照相同的算法重新生成签名
String serverSign = generateMD5Signature(params, storedAppsecret);

// 比对签名一致性
return serverSign.equalsIgnoreCase(clientSign);
```