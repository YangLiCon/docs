# 京东开放平台接口测试结果(预发环境)

## 一、预下单接口

- ### 1.1. Java后台代码

``` java
package com.interfacetest.sdk.jd;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.security.GeneralSecurityException;
import java.security.MessageDigest;
import java.time.LocalDateTime;
import java.time.OffsetTime;
import java.time.format.DateTimeFormatter;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import static java.nio.charset.StandardCharsets.UTF_8;
  public class Main {    
    private static final String HEX_CHARACTERS = "0123456789ABCDEF";
    private static final DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    public static void main(String[] args) throws GeneralSecurityException, IOException {
      
      String baseUri = "https://uat-api.jdl.com";
      String appKey = "226c7c52c9714eecad7c833a9bf3e6f6";
      String appSecret = "a4026b915ecb49c880e9546656862e51";
      String accessToken = "c417840be135471ca626ae93bde84926";
      String domain = "ECAP";
      String path = "/ecap/v1/orders/precheck";
      String method = "POST";
      String algorithm = "md5-salt";
      String body = "[{\"senderContact\":{\"name\":\"董航\",\"mobile\":\"19292082784\",\"fullAddress\":\"广东省广州市黄埔区骏业路255号\",\"warehouseCode\":\"GZCDC\"},\"receiverContact\":{\"name\":\"杨犁\",\"mobile\":\"15685585514\",\"fullAddress\":\"广东省广州市\"},\"orderOrigin\":\"1\",\"customerCode\":\"020K2565222\",\"cargoes\":[{\"name\":\"联想笔记本电脑\",\"quantity\":\"10\",\"weight\":\"5\",\"volume\":\"0.001\",\"length\":\"50\",\"width\":\"50\",\"hight\":\"50\",\"remark\":\"测试\"}],\"productsReq\":{\"productCode\":\"ed-m-0001\"}}]";
      String timestamp = DATE_TIME_FORMATTER.format(LocalDateTime.now());
      String content = String.join("", new String[]{
        appSecret,
        "access_token", accessToken,
        "app_key", appKey,
        "method", path,
        "param_json", body,
        "timestamp", timestamp,
        "v", "2.0",
        appSecret
      });
      String sign = sign(algorithm, content.getBytes(UTF_8), appSecret.getBytes(UTF_8));
      String uri = baseUri + path;
      Map<String, String> query = new HashMap<>();
      query.put("LOP-DN", domain);
      query.put("access_token", accessToken);
      query.put("app_key", appKey);
      query.put("timestamp", timestamp);
      query.put("v", "2.0");
      query.put("sign", sign);
      query.put("algorithm", algorithm);
      URL url = new URL(uri + "?" + httpBuildQuery(query));
      int offset = OffsetTime.now().getOffset().getTotalSeconds() / 3600;
      Map<String, String> headers = new HashMap<>();
      // lop-tz代表时区，为接口调用当地的时区；删去后默认为东八区
      headers.put("lop-tz", String.valueOf(offset));
      // 用于开放平台识别客户调用API方式，客户无需修改
      headers.put("User-Agent", "lop-http/java");
      
      headers.put("content-type", "application/json;charset=utf-8");
      HttpURLConnection connection = null;
      try {
        connection = (HttpURLConnection) url.openConnection();
        connection.setRequestMethod(method);
        connection.setDoInput(true);
        connection.setDoOutput(true);
        for (Map.Entry<String, String> header : headers.entrySet()) {
          connection.setRequestProperty(header.getKey(), header.getValue());
        }
        try (OutputStream outputStream = connection.getOutputStream()) {
          outputStream.write(body.getBytes(UTF_8));
        }
        try (InputStream inputStream = connection.getInputStream()) {
          System.out.println(new String(readAllBytes(inputStream), UTF_8));
        } catch (IOException e) {
          try (InputStream errorStream = connection.getErrorStream()) {
            System.out.println(new String(readAllBytes(errorStream), UTF_8));
          }
        }
      } finally {
        if (connection != null) {
          connection.disconnect();
        }
      }
    }
    private static String sign(String algorithm, byte[] data, byte[] secret) throws GeneralSecurityException {
      if (Objects.equals(algorithm, "md5-salt")) {
        return bytesToHex(MessageDigest.getInstance("md5").digest(data));
      } else if (Objects.equals(algorithm, "HMacMD5")) {
        Mac mac = Mac.getInstance(algorithm);
        mac.init(new SecretKeySpec(secret, algorithm));
        return Base64.getEncoder().encodeToString(mac.doFinal(data));
      } else if (Objects.equals(algorithm, "HMacSHA1")) {
        Mac mac = Mac.getInstance(algorithm);
        mac.init(new SecretKeySpec(secret, algorithm));
        return Base64.getEncoder().encodeToString(mac.doFinal(data));
      } else if (Objects.equals(algorithm, "HMacSHA256")) {
        Mac mac = Mac.getInstance(algorithm);
        mac.init(new SecretKeySpec(secret, algorithm));
        return Base64.getEncoder().encodeToString(mac.doFinal(data));
      } else if (Objects.equals(algorithm, "HMacSHA512")) {
        Mac mac = Mac.getInstance(algorithm);
        mac.init(new SecretKeySpec(secret, algorithm));
        return Base64.getEncoder().encodeToString(mac.doFinal(data));
      }
      throw new GeneralSecurityException("Algorithm " + algorithm + " not supported yet");
    }
    public static String bytesToHex(byte[] bytes) {
      StringBuilder stringBuilder = new StringBuilder(bytes.length * 2);
      for (byte b : bytes) {
        stringBuilder.append(HEX_CHARACTERS.charAt((b >>> 4) & 0x0F));
        stringBuilder.append(HEX_CHARACTERS.charAt(b & 0x0F));
      }
      return stringBuilder.toString();
    }
    public static String httpBuildQuery(Map<String, String> query) throws UnsupportedEncodingException {
      StringBuilder stringBuilder = new StringBuilder();
      boolean first = true;
      for (Map.Entry<String, String> entry : query.entrySet()) {
        if (!first) {
          stringBuilder.append("&");
        } else {
          first = false;
        }
        stringBuilder.append(entry.getKey()).append("=").append(URLEncoder.encode(entry.getValue(), UTF_8.name()));
      }
      return stringBuilder.toString();
    }
    public static byte[] readAllBytes(InputStream inputStream) throws IOException {
      ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
      byte[] buffer = new byte[1024];
      int n;
      while ((n = inputStream.read(buffer)) > 0) {
        outputStream.write(buffer, 0, n);
      }
      return outputStream.toByteArray();
    }
}
```

- ### 1.2. 返回结果

- ``` java
  {
    "code": 0,
    "data": {
      "commonFeeInfoResponse": {
        "calWeight": 5,
        "currency": "CNY",
        "expDate": 1747707951086,
        "feeDetailInfoResponseList": [
          {
            "amount": 20,
            "costName": "快递运费",
            "costNo": "QIPSF",
            "currency": "CNY",
            "preAmount": 20,
            "productCode": "ed-m-0001",
            "productName": "京东标快"
          }
        ],
        "totalAmount": 20,
        "totalPreAmount": 20
      },
      "pickupSliceTimes": [
        {
          "dateKey": "2025-05-21",
          "dayCloseTime": "22:00:00",
          "dayEndTime": "22:00:00",
          "dayOpenTime": "09:00:00",
          "dayStartTime": "09:00:00",
          "pickupSliceTimes": [
            {
              "endTime": "10:00:00",
              "name": "09:00-10:00",
              "startTime": "09:00:00"
            },
            {
              "endTime": "11:00:00",
              "name": "10:00-11:00",
              "startTime": "10:00:00"
            },
            {
              "endTime": "12:00:00",
              "name": "11:00-12:00",
              "startTime": "11:00:00"
            },
            {
              "endTime": "13:00:00",
              "name": "12:00-13:00",
              "startTime": "12:00:00"
            },
            {
              "endTime": "14:00:00",
              "name": "13:00-14:00",
              "startTime": "13:00:00"
            },
            {
              "endTime": "15:00:00",
              "name": "14:00-15:00",
              "startTime": "14:00:00"
            },
            {
              "endTime": "16:00:00",
              "name": "15:00-16:00",
              "startTime": "15:00:00"
            },
            {
              "endTime": "17:00:00",
              "name": "16:00-17:00",
              "startTime": "16:00:00"
            },
            {
              "endTime": "18:00:00",
              "name": "17:00-18:00",
              "startTime": "17:00:00"
            },
            {
              "endTime": "19:00:00",
              "name": "18:00-19:00",
              "startTime": "18:00:00"
            },
            {
              "endTime": "20:00:00",
              "name": "19:00-20:00",
              "startTime": "19:00:00"
            },
            {
              "endTime": "21:00:00",
              "name": "20:00-21:00",
              "startTime": "20:00:00"
            },
            {
              "endTime": "22:00:00",
              "name": "21:00-22:00",
              "startTime": "21:00:00"
            }
          ],
          "timeInterval": 1
        },
        {
          "dateKey": "2025-05-20",
          "dayCloseTime": "22:00:00",
          "dayEndTime": "22:00:00",
          "dayOpenTime": "09:00:00",
          "dayStartTime": "10:24:51",
          "pickupSliceTimes": [
            {
              "endTime": "11:24:51",
              "name": "一小时内",
              "startTime": "10:24:51"
            },
            {
              "endTime": "12:00:00",
              "name": "11:00-12:00",
              "startTime": "11:00:00"
            },
            {
              "endTime": "13:00:00",
              "name": "12:00-13:00",
              "startTime": "12:00:00"
            },
            {
              "endTime": "14:00:00",
              "name": "13:00-14:00",
              "startTime": "13:00:00"
            },
            {
              "endTime": "15:00:00",
              "name": "14:00-15:00",
              "startTime": "14:00:00"
            },
            {
              "endTime": "16:00:00",
              "name": "15:00-16:00",
              "startTime": "15:00:00"
            },
            {
              "endTime": "17:00:00",
              "name": "16:00-17:00",
              "startTime": "16:00:00"
            },
            {
              "endTime": "18:00:00",
              "name": "17:00-18:00",
              "startTime": "17:00:00"
            },
            {
              "endTime": "19:00:00",
              "name": "18:00-19:00",
              "startTime": "18:00:00"
            },
            {
              "endTime": "20:00:00",
              "name": "19:00-20:00",
              "startTime": "19:00:00"
            },
            {
              "endTime": "21:00:00",
              "name": "20:00-21:00",
              "startTime": "20:00:00"
            },
            {
              "endTime": "22:00:00",
              "name": "21:00-22:00",
              "startTime": "21:00:00"
            }
          ],
          "timeInterval": 1
        },
        {
          "dateKey": "2025-05-22",
          "dayCloseTime": "22:00:00",
          "dayEndTime": "22:00:00",
          "dayOpenTime": "09:00:00",
          "dayStartTime": "09:00:00",
          "pickupSliceTimes": [
            {
              "endTime": "10:00:00",
              "name": "09:00-10:00",
              "startTime": "09:00:00"
            },
            {
              "endTime": "11:00:00",
              "name": "10:00-11:00",
              "startTime": "10:00:00"
            },
            {
              "endTime": "12:00:00",
              "name": "11:00-12:00",
              "startTime": "11:00:00"
            },
            {
              "endTime": "13:00:00",
              "name": "12:00-13:00",
              "startTime": "12:00:00"
            },
            {
              "endTime": "14:00:00",
              "name": "13:00-14:00",
              "startTime": "13:00:00"
            },
            {
              "endTime": "15:00:00",
              "name": "14:00-15:00",
              "startTime": "14:00:00"
            },
            {
              "endTime": "16:00:00",
              "name": "15:00-16:00",
              "startTime": "15:00:00"
            },
            {
              "endTime": "17:00:00",
              "name": "16:00-17:00",
              "startTime": "16:00:00"
            },
            {
              "endTime": "18:00:00",
              "name": "17:00-18:00",
              "startTime": "17:00:00"
            },
            {
              "endTime": "19:00:00",
              "name": "18:00-19:00",
              "startTime": "18:00:00"
            },
            {
              "endTime": "20:00:00",
              "name": "19:00-20:00",
              "startTime": "19:00:00"
            },
            {
              "endTime": "21:00:00",
              "name": "20:00-21:00",
              "startTime": "20:00:00"
            },
            {
              "endTime": "22:00:00",
              "name": "21:00-22:00",
              "startTime": "21:00:00"
            }
          ],
          "timeInterval": 1
        }
      ],
      "productInfos": [
        {
          "addedProducts": [
            {
              "extendProps": {},
              "mutexRelationList": [
                {
                  "mutexRelationType": 0,
                  "productName": "活物寄",
                  "productNo": "ed-a-0097",
                  "targetMutexRelationType": 0
                }
              ],
              "productAttrList": [
                {
                  "action": "2",
                  "attrName": "返款周期",
                  "attrNo": "codRefundCycle",
                  "attrType": 1,
                  "attrValueInfoList": [
                    {
                      "value": "0",
                      "valueName": "T+0"
                    },
                    {
                      "value": "1",
                      "valueName": "T+1"
                    },
                    {
                      "value": "2",
                      "valueName": "T+2"
                    },
                    {
                      "value": "3",
                      "valueName": "T+3"
                    },
                    {
                      "value": "5",
                      "valueName": "T+次周"
                    },
                    {
                      "value": "4",
                      "valueName": "不用"
                    },
                    {
                      "value": "6",
                      "valueName": "T+隔周"
                    }
                  ],
                  "extendProps": {
                    "hideTitle": "false",
                    "hidesource": "c2c、sjgzt、sjxcx"
                  },
                  "productConstrainValue": [
                    "3"
                  ],
                  "productDefaultValue": "3"
                },
                {
                  "action": "1",
                  "attrName": "代收金额",
                  "attrNo": "shouldPayMoney",
                  "attrType": 5,
                  "extendProps": {
                    "unit": "元",
                    "overMinMsg": "请输入${min}元以上代收款（含${min}）",
                    "hideTitle": "false",
                    "overMaxMsg": "请输入${max}元以下代收款（含${max}）",
                    "inputPlaceholder": "代收范围${min}-${max}（不包含2）"
                  },
                  "productConstrainValue": "(0,300000]"
                }
              ],
              "productCode": "ed-a-0009",
              "productInformation": {
                "productDesc": "京东物流按照寄件客户（卖方）与收件客户（买方）达成的交易协议，向收件客户收取货款，并按照约定时间将货款返至寄件客户指定账户的服务；收费标准：1.5%费率，最低2元/票。"
              },
              "productName": "代收货款-快递",
              "productShortName": "代收货款",
              "productTradeAttr": {
                "pickupTypeList": [
                  "1",
                  "2",
                  "5"
                ],
                "settlementTypeList": [
                  "3",
                  "4"
                ]
              }
            },
            {
              "extendProps": {},
              "mutexRelationList": [
                {
                  "mutexRelationType": 0,
                  "productName": "活物寄",
                  "productNo": "ed-a-0097",
                  "targetMutexRelationType": 0
                }
              ],
              "productAttrList": [
                {
                  "action": "1",
                  "attrName": "保价金额",
                  "attrNo": "guaranteeMoney",
                  "attrType": 5,
                  "extendProps": {
                    "unit": "元",
                    "hideTitle": "false",
                    "overMaxMsg": "请输入${max}以下保价（含${max}）",
                    "inputPlaceholder": "请输入1-${max}"
                  },
                  "productConstrainValue": "(0,300000]"
                },
                {
                  "action": "2",
                  "attrName": "保价签约模式",
                  "attrNo": "contractType",
                  "attrType": 1,
                  "attrValueInfoList": [
                    {
                      "value": "parcelInsurance",
                      "valueName": "普通保价"
                    },
                    {
                      "value": "annualInsurance",
                      "valueName": "年度统保"
                    },
                    {
                      "value": "scAnnualInsurance",
                      "valueName": "供应链年度统保"
                    }
                  ],
                  "extendProps": {
                    "hidesource": "qyjj、c2c"
                  },
                  "productConstrainValue": [
                    "parcelInsurance"
                  ]
                },
                {
                  "action": "2",
                  "attrName": "商家年度统保金额",
                  "attrNo": "customerAnnual",
                  "attrType": 16,
                  "attrValueInfoList": [
                    {
                      "value": "0",
                      "valueName": "单票年度统保金额"
                    }
                  ],
                  "extendProps": {
                    "hidesource": "sjgzt、qyjj、c2c"
                  },
                  "productConstrainValue": [
                    "0"
                  ]
                },
                {
                  "action": "2",
                  "attrName": "保价类型",
                  "attrNo": "insuranceType",
                  "attrType": 1,
                  "attrValueInfoList": [
                    {
                      "value": "1",
                      "valueName": "普通保价"
                    }
                  ],
                  "extendProps": {
                    "hidesource": "c2c、sjgzt、sjxcx、qyjj"
                  },
                  "productConstrainValue": [
                    "1"
                  ]
                },
                {
                  "action": "2",
                  "actionProductAttrList": [
                    {
                      "attrNo": "insuranceType",
                      "attrType": 1,
                      "attrValueInfoList": [
                        {
                          "value": "2"
                        }
                      ],
                      "extendProps": {},
                      "productConstrainValue": [
                        "2"
                      ]
                    }
                  ],
                  "attrName": "易损类型",
                  "attrNo": "vulnerableType",
                  "attrType": 1,
                  "attrValueInfoList": [
                    {
                      "value": "0",
                      "valueName": "无"
                    },
                    {
                      "value": "1",
                      "valueName": "普通易损"
                    },
                    {
                      "value": "2",
                      "valueName": "高易损"
                    }
                  ],
                  "extendProps": {
                    "hidesource": "c2c、sjgzt、sjxcx、qyjj"
                  },
                  "productConstrainValue": [
                    "0",
                    "1",
                    "2"
                  ]
                },
                {
                  "action": "2",
                  "actionProductAttrList": [
                    {
                      "attrNo": "insuranceType",
                      "attrType": 2,
                      "attrValueInfoList": [
                        {
                          "value": "3"
                        }
                      ],
                      "extendProps": {},
                      "productConstrainValue": [
                        "3"
                      ]
                    }
                  ],
                  "attrName": "定额保保价金额",
                  "attrNo": "blockGuaranteeMoney",
                  "attrType": 1,
                  "attrValueInfoList": [
                    {
                      "value": "200",
                      "valueName": "200"
                    },
                    {
                      "value": "500",
                      "valueName": "500"
                    },
                    {
                      "value": "1000",
                      "valueName": "1000"
                    },
                    {
                      "value": "2000",
                      "valueName": "2000"
                    },
                    {
                      "value": "5000",
                      "valueName": "5000"
                    },
                    {
                      "value": "10000",
                      "valueName": "10000"
                    },
                    {
                      "value": "15000",
                      "valueName": "15000"
                    },
                    {
                      "value": "20000",
                      "valueName": "20000"
                    },
                    {
                      "value": "25000",
                      "valueName": "25000"
                    },
                    {
                      "value": "30000",
                      "valueName": "30000"
                    },
                    {
                      "value": "35000",
                      "valueName": "35000"
                    },
                    {
                      "value": "40000",
                      "valueName": "40000"
                    },
                    {
                      "value": "45000",
                      "valueName": "45000"
                    },
                    {
                      "value": "50000",
                      "valueName": "50000"
                    }
                  ],
                  "extendProps": {
                    "unit": "元",
                    "hidesource": "sjgzt、sjxcx、qyjj"
                  },
                  "productConstrainValue": [
                    "200",
                    "500",
                    "1000",
                    "2000",
                    "5000",
                    "10000",
                    "15000",
                    "20000",
                    "25000",
                    "30000",
                    "35000",
                    "40000",
                    "45000",
                    "50000"
                  ]
                }
              ],
              "productCode": "ed-a-0002",
              "productInformation": {
                "productDesc": "客户寄送货物时向我司声明货物价值，并支付相应费用，若运送过程中由于京东责任造成损失，京东会按照货物实际价值或实际声明价值以及损失比例进行赔偿。"
              },
              "productName": "普通保价-快递",
              "productShortName": "保价",
              "productTradeAttr": {
                "pickupTypeList": [
                  "1",
                  "2",
                  "5",
                  "6"
                ],
                "settlementTypeList": [
                  "3",
                  "4"
                ]
              }
            },
            {
              "extendProps": {},
              "productAttrList": [
                {
                  "action": "2",
                  "actionProductAttrList": [
                    {
                      "attrNo": "reReceiveMode",
                      "attrType": 2,
                      "attrValueInfoList": [
                        {
                          "value": "written"
                        }
                      ],
                      "extendProps": {},
                      "productConstrainValue": [
                        "written"
                      ]
                    }
                  ],
                  "attrName": "原单位置",
                  "attrNo": "reReceiveDocPosition",
                  "attrType": 1,
                  "attrValueInfoList": [
                    {
                      "value": "inside",
                      "valueName": "箱内"
                    },
                    {
                      "value": "pasteOutside",
                      "valueName": "箱外粘贴"
                    },
                    {
                      "value": "perspectiveBag",
                      "valueName": "箱外透视袋"
                    }
                  ],
                  "extendProps": {
                    "hidesource": "sjgzt、sjxcx、qyjj"
                  },
                  "productConstrainValue": [
                    "inside",
                    "pasteOutside",
                    "perspectiveBag"
                  ]
                },
                {
                  "action": "2",
                  "attrName": "签单返还手机号",
                  "attrNo": "reReceiveMobile",
                  "attrType": 3,
                  "extendProps": {
                    "hidesource": "sjxcx、qyjj、sjgzt"
                  },
                  "productConstrainValue": "50"
                },
                {
                  "action": "2",
                  "attrName": "返单详细地址",
                  "attrNo": "reReceiveAddress",
                  "attrType": 3,
                  "extendProps": {
                    "hidesource": "sjxcx、qyjj、sjgzt"
                  },
                  "productConstrainValue": "100"
                },
                {
                  "action": "1",
                  "attrName": "签单返还模式",
                  "attrNo": "reReceiveMode",
                  "attrType": 2,
                  "attrValueInfoList": [
                    {
                      "value": "written",
                      "valueName": "纸质签单"
                    },
                    {
                      "value": "electronic",
                      "valueName": "电子签单"
                    },
                    {
                      "value": "signOnline",
                      "valueName": "链上签"
                    }
                  ],
                  "extendProps": {
                    "written_desc": "快递签收后，收取并回寄收件人签名盖章的单据",
                    "signOnline_desc": "电子文件线上签署",
                    "electronic_desc": "单据拍照实时可见"
                  },
                  "productConstrainValue": [
                    "written",
                    "electronic"
                  ]
                },
                {
                  "action": "2",
                  "attrName": "签返单张数",
                  "attrNo": "reReceiveQty",
                  "attrType": 4,
                  "extendProps": {
                    "hidesource": "sjxcx、qyjj、sjgzt"
                  },
                  "productConstrainValue": "(0,10]"
                },
                {
                  "action": "2",
                  "attrName": "返单特殊要求",
                  "attrNo": "reReceiveRequest",
                  "attrType": 3,
                  "extendProps": {
                    "hidesource": "sjgzt、sjxcx、qyjj"
                  },
                  "productConstrainValue": "1000"
                },
                {
                  "action": "2",
                  "actionProductAttrList": [
                    {
                      "attrNo": "reReceiveMode",
                      "attrType": 2,
                      "attrValueInfoList": [
                        {
                          "value": "signOnline"
                        }
                      ],
                      "extendProps": {},
                      "productConstrainValue": [
                        "signOnline"
                      ]
                    }
                  ],
                  "attrName": "链上签合同id",
                  "attrNo": "signOnlineContractID",
                  "attrType": 3,
                  "extendProps": {
                    "hidesource": "sjxcx、qyjj、sjgzt"
                  },
                  "productConstrainValue": "100"
                },
                {
                  "action": "2",
                  "actionProductAttrList": [
                    {
                      "attrNo": "reReceiveMode",
                      "attrType": 2,
                      "attrValueInfoList": [
                        {
                          "value": "electronic"
                        },
                        {
                          "value": "written"
                        }
                      ],
                      "extendProps": {},
                      "productConstrainValue": [
                        "electronic",
                        "written"
                      ]
                    }
                  ],
                  "attrName": "签单要求",
                  "attrNo": "reReceiveSignType",
                  "attrType": 2,
                  "attrValueInfoList": [
                    {
                      "value": "signName",
                      "valueName": "签名"
                    },
                    {
                      "value": "seal",
                      "valueName": "签章"
                    },
                    {
                      "value": "idNo",
                      "valueName": "身份证号"
                    },
                    {
                      "value": "signTime",
                      "valueName": "签收时间"
                    },
                    {
                      "value": "phoneNum",
                      "valueName": "手机号"
                    },
                    {
                      "value": "deliveryReceipt",
                      "valueName": "仓库收货回执单"
                    },
                    {
                      "value": "IDCardCopy",
                      "valueName": "身份证复印件"
                    }
                  ],
                  "extendProps": {
                    "hidesource": "sjgzt、sjxcx、qyjj"
                  },
                  "productConstrainValue": [
                    "signName",
                    "seal",
                    "idNo",
                    "signTime",
                    "phoneNum",
                    "deliveryReceipt",
                    "IDCardCopy"
                  ]
                },
                {
                  "action": "2",
                  "attrName": "模板编码",
                  "attrNo": "templateID",
                  "attrType": 3,
                  "extendProps": {
                    "hidesource": "sjxcx、qyjj、sjgzt"
                  },
                  "productConstrainValue": "50"
                },
                {
                  "action": "2",
                  "attrName": "返单收件人姓名",
                  "attrNo": "reReceiveName",
                  "attrType": 3,
                  "extendProps": {
                    "hidesource": "sjxcx、qyjj、sjgzt"
                  },
                  "productConstrainValue": "20"
                },
                {
                  "action": "2",
                  "attrName": "返单要求",
                  "attrNo": "reReceiveType",
                  "attrType": 2,
                  "attrValueInfoList": [
                    {
                      "value": "signBill",
                      "valueName": "收取签单"
                    },
                    {
                      "value": "idCardCopy",
                      "valueName": "收取身份证复印件"
                    },
                    {
                      "value": "electronicStubForm",
                      "valueName": "签收底联（电子）"
                    },
                    {
                      "value": "insuranceConfirm",
                      "valueName": "投保意向书"
                    }
                  ],
                  "extendProps": {
                    "hidesource": "sjgzt、sjxcx、qyjj"
                  },
                  "productConstrainValue": [
                    "signBill",
                    "idCardCopy",
                    "electronicStubForm",
                    "insuranceConfirm"
                  ]
                },
                {
                  "action": "2",
                  "attrName": "返单地址（姓名/手机/座机/地址） ",
                  "attrNo": "reReceiveContactInfo",
                  "attrType": 10,
                  "extendProps": {
                    "hidesource": "sjgzt、sjxcx、qyjj"
                  },
                  "productConstrainValue": "[sS]*"
                },
                {
                  "action": "2",
                  "attrName": "返单样例图片",
                  "attrNo": "reReceiveSamplePic",
                  "attrType": 11,
                  "extendProps": {
                    "hidesource": "sjgzt、sjxcx、qyjj"
                  },
                  "productConstrainValue": "[sS]*"
                },
                {
                  "action": "2",
                  "attrName": "模板名称",
                  "attrNo": "templateName",
                  "attrType": 3,
                  "extendProps": {
                    "hidesource": "sjxcx、qyjj、sjgzt"
                  },
                  "productConstrainValue": "50"
                },
                {
                  "action": "2",
                  "attrName": "签单返还座机",
                  "attrNo": "reReceivePhone",
                  "attrType": 3,
                  "extendProps": {
                    "hidesource": "sjxcx、qyjj、sjgzt"
                  },
                  "productConstrainValue": "50"
                }
              ],
              "productCode": "ed-a-0010",
              "productInformation": {
                "productDesc": "根据寄件方需求，将收件方签字或盖章的签收单据返还给寄件方的服务；收费标准：8元/票。"
              },
              "productName": "签单返还-快递",
              "productShortName": "签单返还",
              "productTradeAttr": {
                "pickupTypeList": [
                  "1",
                  "2"
                ],
                "settlementTypeList": [
                  "3",
                  "4"
                ]
              }
            },
            {
              "extendProps": {},
              "productCode": "ed-a-0037",
              "productInformation": {
                "productDesc": "为客户提供文件的黑白打印服务。"
              },
              "productName": "黑白打印",
              "productShortName": "黑白打印",
              "productTradeAttr": {
                "pickupTypeList": [
                  "1",
                  "2"
                ],
                "settlementTypeList": [
                  "3",
                  "4"
                ]
              }
            },
            {
              "extendProps": {},
              "productAttrList": [
                {
                  "action": "1",
                  "attrName": "验货方式",
                  "attrNo": "examineMethod",
                  "attrType": 1,
                  "attrValueInfoList": [
                    {
                      "value": "forbidUnpacking",
                      "valueName": "不开箱验货"
                    },
                    {
                      "value": "unpackWrap",
                      "valueName": "开物流包装"
                    },
                    {
                      "value": "unpackGoods",
                      "valueName": "开商品包装"
                    }
                  ],
                  "extendProps": {},
                  "productConstrainValue": [
                    "forbidUnpacking",
                    "unpackWrap",
                    "unpackGoods"
                  ]
                }
              ],
              "productCode": "ed-a-0044",
              "productInformation": {
                "productDesc": "配送时给消费者进行商品开箱验货，对商品基础功能进行检查验收，该服务将收取商家免费服务费用"
              },
              "productName": "开箱验货",
              "productShortName": "",
              "productTradeAttr": {
                "pickupTypeList": [
                  "1",
                  "2"
                ],
                "settlementTypeList": [
                  "3",
                  "4"
                ]
              }
            },
            {
              "extendProps": {},
              "mutexRelationList": [
                {
                  "mutexRelationType": 0,
                  "productName": "商品拍照",
                  "productNo": "ed-a-0019",
                  "targetMutexProductAttrs": [
                    {
                      "attrName": "揽收是否强制拍照",
                      "attrNo": "pkForcePhoto",
                      "attrType": 2,
                      "attrValueInfoList": [
                        {
                          "value": "1",
                          "valueName": "贴单+标准包装"
                        }
                      ],
                      "extendProps": {},
                      "productConstrainValue": [
                        "1"
                      ]
                    }
                  ],
                  "targetMutexRelationType": 1
                },
                {
                  "mutexProductAttrs": [
                    {
                      "attrName": "指定签收类型",
                      "attrNo": "assignSignType",
                      "attrType": 1,
                      "attrValueInfoList": [
                        {
                          "value": "smsSign",
                          "valueName": "短信验证签收"
                        }
                      ],
                      "extendProps": {},
                      "productConstrainValue": [
                        "smsSign"
                      ]
                    }
                  ],
                  "mutexRelationType": 1,
                  "productName": "指定签收",
                  "productNo": "ed-a-0026",
                  "targetMutexProductAttrs": [
                    {
                      "attrName": "是否短息验证",
                      "attrNo": "smsVerification",
                      "attrType": 1,
                      "attrValueInfoList": [
                        {
                          "value": "1",
                          "valueName": "贴单+标准包装"
                        }
                      ],
                      "extendProps": {},
                      "productConstrainValue": [
                        "1"
                      ]
                    }
                  ],
                  "targetMutexRelationType": 1
                },
                {
                  "mutexRelationType": 0,
                  "productName": "防撕码采集",
                  "productNo": "ed-a-0020",
                  "targetMutexProductAttrs": [
                    {
                      "attrName": "防撕码采集",
                      "attrNo": "pickTearCode",
                      "attrType": 1,
                      "attrValueInfoList": [
                        {
                          "value": "tearCodeBox",
                          "valueName": "取件防撕码采集"
                        },
                        {
                          "value": "pupTearCodeBox",
                          "valueName": "揽收防撕码采集"
                        }
                      ],
                      "extendProps": {},
                      "productConstrainValue": [
                        "tearCodeBox",
                        "pupTearCodeBox"
                      ]
                    }
                  ],
                  "targetMutexRelationType": 1
                },
                {
                  "mutexRelationType": 0,
                  "productName": "打包服务",
                  "productNo": "ed-a-0052",
                  "targetMutexRelationType": 0
                }
              ],
              "productAttrList": [
                {
                  "action": "2",
                  "attrName": "揽收是否强制拍照",
                  "attrNo": "pkForcePhoto",
                  "attrType": 1,
                  "attrValueInfoList": [
                    {
                      "value": "1",
                      "valueName": "是"
                    },
                    {
                      "value": "0",
                      "valueName": "否"
                    }
                  ],
                  "extendProps": {},
                  "productConstrainValue": [
                    "1",
                    "0"
                  ]
                },
                {
                  "action": "2",
                  "attrName": "是否妥投强制电联",
                  "attrNo": "forceContact",
                  "attrType": 1,
                  "attrValueInfoList": [
                    {
                      "value": "1",
                      "valueName": "是"
                    },
                    {
                      "value": "0",
                      "valueName": "否"
                    }
                  ],
                  "extendProps": {},
                  "productConstrainValue": [
                    "1",
                    "0"
                  ]
                },
                {
                  "action": "2",
                  "attrName": "是否短息验证",
                  "attrNo": "smsVerification",
                  "attrType": 1,
                  "attrValueInfoList": [
                    {
                      "value": "1",
                      "valueName": "是"
                    },
                    {
                      "value": "0",
                      "valueName": "否"
                    }
                  ],
                  "extendProps": {},
                  "productConstrainValue": [
                    "1",
                    "0"
                  ]
                },
                {
                  "action": "2",
                  "attrName": "保价金额-特安",
                  "attrNo": "guaranteeValueByParticular",
                  "attrType": 5,
                  "extendProps": {},
                  "productConstrainValue": "(20000,300000]"
                },
                {
                  "action": "2",
                  "attrName": "防撕码采集",
                  "attrNo": "pickTearCode",
                  "attrType": 1,
                  "attrValueInfoList": [
                    {
                      "value": "pupTearCodeBox",
                      "valueName": "揽收防撕码采集"
                    }
                  ],
                  "extendProps": {},
                  "productConstrainValue": [
                    "pupTearCodeBox"
                  ]
                },
                {
                  "action": "2",
                  "attrName": "是否妥投强制拍照",
                  "attrNo": "rcvForcePhoto",
                  "attrType": 1,
                  "attrValueInfoList": [
                    {
                      "value": "1",
                      "valueName": "是"
                    },
                    {
                      "value": "0",
                      "valueName": "否"
                    }
                  ],
                  "extendProps": {},
                  "productConstrainValue": [
                    "1",
                    "0"
                  ]
                }
              ],
              "productCode": "ed-a-0047",
              "productInformation": {
                "productDesc": "为客户提供双人揽派、验证签收、防撕码、托寄物拍照服务，保障用户的快件安全；收费标准： 0.5%费率，最低80元/票。当保价服务声明价值超过2万时，不收取特安服务费。"
              },
              "productName": "特安服务",
              "productShortName": "特安服务",
              "productTradeAttr": {
                "pickupTypeList": [
                  "1",
                  "2"
                ],
                "settlementTypeList": [
                  "3",
                  "4"
                ]
              }
            },
            {
              "extendProps": {},
              "mutexRelationList": [
                {
                  "mutexRelationType": 0,
                  "productName": "预约派送-快递",
                  "productNo": "ed-a-0053",
                  "targetMutexRelationType": 0
                }
              ],
              "productAttrList": [
                {
                  "action": "2",
                  "attrName": "进仓结束时间",
                  "attrNo": "enterHouseAppointmentEndTime",
                  "attrType": 6,
                  "extendProps": {
                    "hidesource": "sjgzt、c2c"
                  },
                  "productConstrainValue": "[sS]*"
                },
                {
                  "action": "2",
                  "attrName": "进仓单图片",
                  "attrNo": "warehouseReceiptPicture",
                  "attrType": 11,
                  "extendProps": {
                    "hidesource": "sjgzt、c2c、sjxcx、qyjj"
                  },
                  "productConstrainValue": "[sS]*"
                },
                {
                  "action": "2",
                  "attrName": "进仓开始时间",
                  "attrNo": "enterHouseAppointmentStartTime",
                  "attrType": 6,
                  "extendProps": {
                    "hidesource": "ldopBasic、sjgzt、c2c"
                  },
                  "productConstrainValue": "[sS]*"
                },
                {
                  "action": "2",
                  "attrName": "仓库类型",
                  "attrNo": "warehouseType",
                  "attrType": 1,
                  "attrValueInfoList": [
                    {
                      "value": "1",
                      "valueName": "基础"
                    },
                    {
                      "value": "2",
                      "valueName": "电商仓"
                    },
                    {
                      "value": "3",
                      "valueName": "医药仓"
                    },
                    {
                      "value": "4",
                      "valueName": "会展"
                    },
                    {
                      "value": "5",
                      "valueName": "海关仓"
                    },
                    {
                      "value": "6",
                      "valueName": "德邦单独"
                    },
                    {
                      "value": "7",
                      "valueName": "京东单独"
                    }
                  ],
                  "extendProps": {
                    "hidesource": "sjgzt、c2c、sjxcx、qyjj"
                  },
                  "productConstrainValue": [
                    "1",
                    "2",
                    "3",
                    "4",
                    "5",
                    "6",
                    "7"
                  ]
                },
                {
                  "action": "2",
                  "attrName": "进仓预约号",
                  "attrNo": "enterHouseAppointmentNo",
                  "attrType": 3,
                  "extendProps": {
                    "hideTitle": "false",
                    "hidesource": "ldopBasic",
                    "inputPlaceholder": "请输入预约号"
                  },
                  "productConstrainValue": "50"
                },
                {
                  "action": "2",
                  "attrName": "进仓备注",
                  "attrNo": "enterHouseAppointmentRemark",
                  "attrType": 3,
                  "extendProps": {
                    "hideTitle": "false",
                    "inputPlaceholder": "请输入备注内容50字以内"
                  },
                  "productConstrainValue": "50"
                },
                {
                  "attrName": "入仓时间",
                  "attrNo": "enterHouseAppointmentCalendar",
                  "attrType": 12,
                  "extendProps": {
                    "childAttr": "enterHouseAppointmentStartTime,enterHouseAppointmentEndTime",
                    "time": [
                      {
                        "dateStr": "2025-05-20 10:25:51",
                        "calendarTimeList": [
                          {
                            "enable": null,
                            "timeRange": "10:00-11:00",
                            "time": null
                          },
                          {
                            "enable": null,
                            "timeRange": "11:00-12:00",
                            "time": null
                          },
                          {
                            "enable": null,
                            "timeRange": "12:00-13:00",
                            "time": null
                          },
                          {
                            "enable": null,
                            "timeRange": "13:00-14:00",
                            "time": null
                          },
                          {
                            "enable": null,
                            "timeRange": "14:00-15:00",
                            "time": null
                          },
                          {
                            "enable": null,
                            "timeRange": "15:00-16:00",
                            "time": null
                          },
                          {
                            "enable": null,
                            "timeRange": "16:00-17:00",
                            "time": null
                          },
                          {
                            "enable": null,
                            "timeRange": "17:00-18:00",
                            "time": null
                          },
                          {
                            "enable": null,
                            "timeRange": "18:00-19:00",
                            "time": null
                          },
                          {
                            "enable": null,
                            "timeRange": "19:00-20:00",
                            "time": null
                          },
                          {
                            "enable": null,
                            "timeRange": "20:00-21:00",
                            "time": null
                          }
                        ]
                      },
                      {
                        "dateStr": "2025-05-21 09:25:51",
                        "calendarTimeList": [
                          {
                            "enable": null,
                            "timeRange": "9:00-10:00",
                            "time": null
                          },
                          {
                            "enable": null,
                            "timeRange": "10:00-11:00",
                            "time": null
                          },
                          {
                            "enable": null,
                            "timeRange": "11:00-12:00",
                            "time": null
                          },
                          {
                            "enable": null,
                            "timeRange": "12:00-13:00",
                            "time": null
                          },
                          {
                            "enable": null,
                            "timeRange": "13:00-14:00",
                            "time": null
                          },
                          {
                            "enable": null,
                            "timeRange": "14:00-15:00",
                            "time": null
                          },
                          {
                            "enable": null,
                            "timeRange": "15:00-16:00",
                            "time": null
                          },
                          {
                            "enable": null,
                            "timeRange": "16:00-17:00",
                            "time": null
                          },
                          {
                            "enable": null,
                            "timeRange": "17:00-18:00",
                            "time": null
                          },
                          {
                            "enable": null,
                            "timeRange": "18:00-19:00",
                            "time": null
                          },
                          {
                            "enable": null,
                            "timeRange": "19:00-20:00",
                            "time": null
                          },
                          {
                            "enable": null,
                            "timeRange": "20:00-21:00",
                            "time": null
                          }
                        ]
                      },
                      {
                        "dateStr": "2025-05-22 09:25:51",
                        "calendarTimeList": [
                          {
                            "enable": null,
                            "timeRange": "9:00-10:00",
                            "time": null
                          },
                          {
                            "enable": null,
                            "timeRange": "10:00-11:00",
                            "time": null
                          },
                          {
                            "enable": null,
                            "timeRange": "11:00-12:00",
                            "time": null
                          },
                          {
                            "enable": null,
                            "timeRange": "12:00-13:00",
                            "time": null
                          },
                          {
                            "enable": null,
                            "timeRange": "13:00-14:00",
                            "time": null
                          },
                          {
                            "enable": null,
                            "timeRange": "14:00-15:00",
                            "time": null
                          },
                          {
                            "enable": null,
                            "timeRange": "15:00-16:00",
                            "time": null
                          },
                          {
                            "enable": null,
                            "timeRange": "16:00-17:00",
                            "time": null
                          },
                          {
                            "enable": null,
                            "timeRange": "17:00-18:00",
                            "time": null
                          },
                          {
                            "enable": null,
                            "timeRange": "18:00-19:00",
                            "time": null
                          },
                          {
                            "enable": null,
                            "timeRange": "19:00-20:00",
                            "time": null
                          },
                          {
                            "enable": null,
                            "timeRange": "20:00-21:00",
                            "time": null
                          }
                        ]
                      }
                    ]
                  }
                }
              ],
              "productCode": "ed-a-0045",
              "productInformation": {
                "productDesc": "针对特殊区域（如码头、机场、仓库、保税区等），京东提供除收派件之外的额外服务（如排队等候、预约入仓）"
              },
              "productName": "送货入仓",
              "productShortName": "快递入仓",
              "productTradeAttr": {
                "pickupTypeList": [
                  "1",
                  "2"
                ],
                "settlementTypeList": [
                  "3",
                  "4"
                ]
              }
            },
            {
              "extendProps": {},
              "productAttrList": [
                {
                  "action": "2",
                  "attrName": "包装规格数量",
                  "attrNo": "packingSpecQty",
                  "attrType": 3,
                  "extendProps": {
                    "hidesource": "c2c、sjgzt、sjxcx、ldopBasic"
                  },
                  "productConstrainValue": "1000"
                },
                {
                  "action": "2",
                  "attrName": "木质包装合打说明",
                  "attrNo": "packageMaterialRemark",
                  "attrType": 3,
                  "extendProps": {
                    "hidesource": "sjgzt、sjxcx、ldopBasic、c2c"
                  },
                  "productConstrainValue": "2000"
                },
                {
                  "action": "2",
                  "attrName": "包装耗材",
                  "attrNo": "boxInfos",
                  "attrType": 3,
                  "extendProps": {
                    "diyComponentType": "pop",
                    "hidesource": "sjgzt、sjxcx、ldopBasic"
                  },
                  "productConstrainValue": "3000"
                }
              ],
              "productCode": "ed-a-0011",
              "productInformation": {
                "productDesc": "为您提供常规、定制化的包装收费服务，如您选择购买，因包装自身的实际重量或体积重量，运费也会相应增加；收费标准：见包装详情 。"
              },
              "productName": "包装服务-快递",
              "productShortName": "包装服务",
              "productTradeAttr": {
                "pickupTypeList": [
                  "1",
                  "2"
                ],
                "settlementTypeList": [
                  "3",
                  "4"
                ]
              }
            },
            {
              "extendProps": {},
              "mutexRelationList": [
                {
                  "mutexRelationType": 0,
                  "productName": "夜间揽收--快递",
                  "productNo": "ed-a-0085",
                  "targetMutexRelationType": 0
                },
                {
                  "mutexRelationType": 0,
                  "productName": "预约派送-快递",
                  "productNo": "ed-a-0053",
                  "targetMutexRelationType": 0
                }
              ],
              "productCode": "ed-a-0084",
              "productInformation": {
                "productDesc": "商家下单时无上门预约时间，支持商家自行联系站点揽收"
              },
              "productName": "自行联系-快递",
              "productShortName": "自行联系",
              "productTradeAttr": {
                "pickupTypeList": [
                  "1",
                  "2",
                  "3"
                ],
                "settlementTypeList": [
                  "3",
                  "4"
                ]
              }
            },
            {
              "extendProps": {},
              "mutexRelationList": [
                {
                  "mutexProductAttrs": [
                    {
                      "attrName": "揽收是否强制拍照",
                      "attrNo": "pkForcePhoto",
                      "attrType": 2,
                      "attrValueInfoList": [
                        {
                          "value": "1",
                          "valueName": "贴单+标准包装"
                        }
                      ],
                      "extendProps": {},
                      "productConstrainValue": [
                        "1"
                      ]
                    }
                  ],
                  "mutexRelationType": 1,
                  "productName": "特安服务",
                  "productNo": "ed-a-0047",
                  "targetMutexRelationType": 0
                }
              ],
              "productAttrList": [
                {
                  "action": "1",
                  "actionProductAttrList": [
                    {
                      "attrNo": "photographType",
                      "attrType": 1,
                      "attrValueInfoList": [
                        {
                          "value": "sample"
                        }
                      ],
                      "extendProps": {},
                      "productConstrainValue": [
                        "sample"
                      ]
                    }
                  ],
                  "attrName": "样例图片",
                  "attrNo": "picSample",
                  "attrType": 11,
                  "extendProps": {
                    "hidesource": "sjgzt、sjxcx"
                  },
                  "productConstrainValue": "[sS]*"
                },
                {
                  "action": "1",
                  "attrName": "拍照类型",
                  "attrNo": "photographType",
                  "attrType": 1,
                  "attrValueInfoList": [
                    {
                      "value": "normal",
                      "valueName": "常规拍照"
                    },
                    {
                      "value": "sample",
                      "valueName": "样例拍照"
                    }
                  ],
                  "extendProps": {
                    "hidesource": "sjgzt、sjxcx"
                  },
                  "productConstrainValue": [
                    "normal",
                    "sample"
                  ]
                },
                {
                  "action": "1",
                  "actionProductAttrList": [
                    {
                      "attrNo": "photographType",
                      "attrType": 1,
                      "attrValueInfoList": [
                        {
                          "value": "sample"
                        }
                      ],
                      "extendProps": {},
                      "productConstrainValue": [
                        "sample"
                      ]
                    }
                  ],
                  "attrName": "拍照图片名称",
                  "attrNo": "pictureName",
                  "attrType": 3,
                  "extendProps": {
                    "hidesource": "sjgzt、sjxcx"
                  },
                  "productConstrainValue": "50"
                },
                {
                  "action": "1",
                  "actionProductAttrList": [
                    {
                      "attrNo": "photographType",
                      "attrType": 1,
                      "attrValueInfoList": [
                        {
                          "value": "sample"
                        }
                      ],
                      "extendProps": {},
                      "productConstrainValue": [
                        "sample"
                      ]
                    }
                  ],
                  "attrName": "图片类型描述",
                  "attrNo": "picTypeDescription",
                  "attrType": 3,
                  "extendProps": {
                    "hidesource": "sjgzt、sjxcx"
                  },
                  "productConstrainValue": "110"
                }
              ],
              "productCode": "ed-a-0019",
              "productInformation": {
                "productDesc": "对商品按照要求进行拍照上传照片"
              },
              "productName": "商品拍照",
              "productShortName": "",
              "productTradeAttr": {
                "pickupTypeList": [
                  "1",
                  "2"
                ],
                "settlementTypeList": [
                  "3",
                  "4"
                ]
              }
            },
            {
              "extendProps": {},
              "productAttrList": [
                {
                  "action": "2",
                  "attrName": "揽收结束时间",
                  "attrNo": "collectingEndTime",
                  "attrType": 6,
                  "extendProps": {},
                  "productConstrainValue": "[sS]*"
                },
                {
                  "action": "2",
                  "attrName": "揽收开始时间",
                  "attrNo": "collectingStartTime",
                  "attrType": 6,
                  "extendProps": {},
                  "productConstrainValue": "[sS]*"
                },
                {
                  "action": "1",
                  "attrName": "揽收模式",
                  "attrNo": "receivingMode",
                  "attrType": 1,
                  "attrValueInfoList": [
                    {
                      "value": "preciseCollection",
                      "valueName": "一小时精准揽收"
                    },
                    {
                      "value": "scheduledCollection",
                      "valueName": "每日多次定时揽收"
                    },
                    {
                      "value": "fixedCollection",
                      "valueName": "下单后24/48小时揽收"
                    },
                    {
                      "value": "collectingOnDay",
                      "valueName": "日揽收"
                    }
                  ],
                  "extendProps": {},
                  "productConstrainValue": [
                    "preciseCollection",
                    "scheduledCollection",
                    "fixedCollection",
                    "collectingOnDay"
                  ]
                },
                {
                  "action": "2",
                  "actionProductAttrList": [
                    {
                      "attrNo": "receivingMode",
                      "attrType": 2,
                      "attrValueInfoList": [
                        {
                          "value": "scheduledCollection"
                        }
                      ],
                      "extendProps": {},
                      "productConstrainValue": [
                        "scheduledCollection"
                      ]
                    }
                  ],
                  "attrName": "定时揽收时间",
                  "attrNo": "timedCollectionTime",
                  "attrType": 18,
                  "extendProps": {},
                  "productConstrainValue": "200"
                }
              ],
              "productCode": "ed-a-0099",
              "productInformation": {
                "productDesc": "针对客户诉求，将揽收时效分层为：一小时精准揽收、每日多次定时揽收、当日揽收、下单后24/48小时揽收四种模式供客户选择，并在产品标准上实现揽收时效分层。"
              },
              "productName": "揽收时效模式",
              "productShortName": "揽收时效模式",
              "productTradeAttr": {}
            }
          ],
          "deliveryPromiseTime": 1747810800000,
          "extendProps": {
            "childRuleType": "",
            "cutoffTime": "20:00",
            "cutoffEndTime": "21:00",
            "pickUpDeadlineTime": "22:00",
            "agingDateTime": "2025-05-21 15:00:00",
            "operationModeName": "京东标快",
            "operationMode": "P1",
            "agingTime": "2D1500",
            "transportTypeName": "陆运",
            "ruleType": "",
            "realCutoffTime": "21:00",
            "transportType": "2",
            "networkType": "1"
          },
          "feeType": "QIPSF",
          "feeTypeName": "快递运费",
          "freightPre": 20,
          "freightStandard": 20,
          "productAgingInfo": {
            "agingTime": "2D1500",
            "cutoffEndTime": "21:00",
            "cutoffTime": "20:00",
            "pickUpDeadlineTime": "22:00",
            "ruleType": ""
          },
          "productCode": "ed-m-0001",
          "productInformation": {
            "productDesc": "客户下单后，京东物流依托目前中小件配送网络，通过现有标准陆运运输，送达收件客户。"
          },
          "productName": "京东标快",
          "productShortName": "京东标快",
          "productTradeAttr": {
            "cargoLimit": {
              "maxWeight": {
                "unit": "g",
                "weight": 99990000
              }
            },
            "pickupTypeList": [
              "1",
              "2",
              "5",
              "6"
            ],
            "settlementTypeList": [
              "3",
              "4"
            ]
          }
        }
      ],
      "shipmentInfo": {
        "endStationCode": "020Y006",
        "endStationName": "*广州康王营业部",
        "endStationNo": 31,
        "startStationCode": "020Y923",
        "startStationName": "*广州勒竹营业部",
        "startStationNo": 2032737
      },
      "totalFreightPre": 20,
      "totalFreightStandard": 20
    },
    "mills": 448,
    "msg": "成功",
    "requestId": "8bdc9554-11b8-4c65-9615-51c709b1a2f1",
    "success": true
  }
  ```

  

  ## 二、下单接口（这里使用沙箱环境）

  ### 1.1 Java代码

  ``` java
  public static void main(String[] args) {
          /**
           * 示例为调用京东快递下单前置校验接口
           * 这里使用京东的沙盒环境配置进行测试
           */
          try {
              //设置接口域名(有的对接方案同时支持生产和沙箱环境，有的仅支持生产，具体以对接方案中的【API文档-请求地址】为准)，生产域名：https://api.jdl.com 预发环境域名：https://uat-api.jdl.com
              //DefaultDomainApiClient对象全局只需要创建一次
              DefaultDomainApiClient client = new DefaultDomainApiClient("https://test-api.jdl.com", 500, 15000);
  
              //入参对象（请记得更换为自己要使用的接口入参对象）
              EcapV1OrdersCreateLopRequest request = new EcapV1OrdersCreateLopRequest();
  
              // 寄件人信息
              Contact senderContact = new Contact();
              senderContact.setName("董航");
              senderContact.setMobile("19292082784");
              senderContact.setCompany("盛捷（广州）物流供应链");
              senderContact.setFullAddress("广东省广州市黄埔区骏业路255号");
  
              // 收件人信息
              Contact receiverContact = new Contact();
              receiverContact.setName("杨犁");
              receiverContact.setMobile("15685585514");
              receiverContact.setFullAddress("河北省廊坊市广阳区万庄镇中心小学");
  
              // 货品信息
              List<CommonCargoInfo> cargoes = new ArrayList<>();
              CommonCargoInfo commonCargoInfo = new CommonCargoInfo();
              commonCargoInfo.setName("联想笔记本电脑");
              commonCargoInfo.setQuantity(1);
              commonCargoInfo.setWeight(new BigDecimal("0.5"));
              commonCargoInfo.setVolume(new BigDecimal("0.5"));
              commonCargoInfo.setLength(new BigDecimal("0.5"));
              commonCargoInfo.setWidth(new BigDecimal("0.5"));
              commonCargoInfo.setHight(new BigDecimal("0.5"));
              commonCargoInfo.setRemark("联想笔记本电脑");
              cargoes.add(commonCargoInfo);
              // 主产品信息
              CommonProductInfo commonProductInfo = new CommonProductInfo();
              commonProductInfo.setProductCode("ed-m-0001");
  
              // 请求参数
              CommonCreateOrderRequest commonCreateOrderRequest = new CommonCreateOrderRequest();
              // 货品信息
              commonCreateOrderRequest.setCargoes(cargoes);
              // 商家订单ID
              commonCreateOrderRequest.setOrderId("SJ202505201438");
              /**
               * 0	快递C2C	个人消费者寄快递服务，C端用户发给C端用户的快递服务
               * 1	快递B2C	电商平台的商家（即京东物流的签约商家）发给C端用户的快递服务，或者企业发C端、B端，但重量（泡重比）小于30kg的业务
               * 2	C2B	通常是指从C端揽收送往B端，一般简称C2B业务。例如：图书回收、洗护业务、电商平台客户退货发起的逆向业务等业务场景
               * 4	快运B2C	电商平台的商家（即京东物流的签约商家）发给C端用户的快运服务，或者企业发C端、B端，但重量（泡重比）大于30kg的业务
               * 5	快运C2C	个人消费者寄快运服务，C端用户发给C端用户的快运服务
               */
              commonCreateOrderRequest.setOrderOrigin(1);
              // 商家编码
              commonCreateOrderRequest.setCustomerCode("27K1234912");
              /**
               * 付款方式 1-寄付 2-到付 3-月结 5-多方收费，orderOrigin= 0或5时，枚举值：1-寄付；2-到付；orderOrigin= 1 或4时，枚举值：1-寄付；2-到付；3-月结；orderOrigin为2时，枚举值：
               * 5-多方收费，多方收费指下单费用由多个模块或主体来支付，逆向取件时运费、包装费以及保险费用可能由商家以及C消费者分别承担，具体参考c2bAddedSettleTypeInfo枚举传入
               */
              commonCreateOrderRequest.setSettleType(2);
  
              // 给寄件人信息赋值
              commonCreateOrderRequest.setSenderContact(senderContact);
              // 给收件人信息赋值
              commonCreateOrderRequest.setReceiverContact(receiverContact);
              // 给主产品信息赋值
              commonCreateOrderRequest.setProductsReq(commonProductInfo);
  
              request.setRequest(commonCreateOrderRequest);
  
              //设置插件，必须的操作，不同类型的应用入参不同，请看入参注释，公共参数按顺序分别为AppKey、AppSecret、AccessToken
              //使用开放平台ISV/自研商家应用调用接口
              LopPlugin lopPlugin = OAuth2PluginFactory.produceLopPlugin("62d07644754843cc882fca7c01476c4f", "0c2c8b6b7c10481ea639f6daa09ac02e", "78c246c0ab564e67add6296a9eaf04a1");
              request.addLopPlugin(lopPlugin);
  
              //使用开放平台合作伙伴应用调用接口
  //            LopPlugin lopPlugin = OAuth2PluginFactory.produceLopPlugin("bae34******************8fd", "661e4d**********************ec", "");
  //            request.addLopPlugin(lopPlugin);
  
              //使用JOS应用调用物流开放平台接口
  //            request.setUseJosAuth(true);
  //            LopPlugin lopPlugin = OAuth2PluginFactory.produceLopPlugin("DE79844E3***********43236CC", "7b01ff52c2********7b661448", "b89114***************d4e9da950m2u");
  //            request.addLopPlugin(lopPlugin);
              EcapV1OrdersCreateLopResponse response = client.execute(request);
              System.out.println(response.getMsg());
          } catch (LopException e) {
              e.printStackTrace();
          } catch (Exception e) {
              e.printStackTrace();
          }
  }
  ```

  ### 1.2 返回结果

  ``` java
  {
    "response": {
      "content": {
        "code": 0,
        "data": {
          "extendFields": {},
          "faceSheetResponse": {
            "faceSheetInfo": {
              "endSiteId": 39,
              "endSiteName": "*石景山营业部",
              "startSiteId": 39,
              "startSiteName": "*石景山营业部"
            }
          },
          "orderCode": "EO0020042846988",
          "presortResult": {
            "endAoiCode": "wangyingying93测试",
            "endDeliveryType": "0",
            "endRoadArea": "002",
            "endStationCode": "010Y100",
            "endStationName": "*石景山营业部",
            "endStationNo": "39",
            "endStationPresortResultType": "1",
            "endStationType": "4",
            "startAoiCode": "wangyingying93测试",
            "startDeliveryType": "0",
            "startRoadArea": "002",
            "startStationCode": "010Y100",
            "startStationName": "*石景山营业部",
            "startStationNo": "39",
            "startStationPresortResultType": "1",
            "startStationType": "4"
          },
          "productsResponse": {
            "addedProducts": [
              {
                "productAttrs": {
                  "guaranteeMoney": "10000",
                  "contractType": "parcelInsurance"
                },
                "productCode": "ed-a-0002",
                "productModifyFlag": 0
              },
              {
                "productAttrs": {
                  "pkForcePhoto": "1",
                  "forceContact": "1",
                  "smsVerification": "1",
                  "rcvForcePhoto": "1"
                },
                "productCode": "ed-a-0047",
                "productModifyFlag": 0
              },
              {
                "productAttrs": {
                  "rejectAuditType": "repeatedly",
                  "rejectAuditNumbers": "1"
                },
                "productCode": "ed-a-0005",
                "productModifyFlag": 0
              },
              {
                "productAttrs": {
                  "hiddenContent": [
                    "senderName",
                    "receiverName",
                    "receiverMobile",
                    "senderMobile"
                  ]
                },
                "productCode": "ed-a-0032",
                "productModifyFlag": 0
              }
            ],
            "productAttrs": {},
            "productCode": "ed-m-0001",
            "productModifyFlag": 0
          },
          "waybillCode": "JDVE00132449789"
        },
        "mills": 2887,
        "msg": "成功",
        "requestId": "2a396a47-c28a-4904-9d32-ba9d920b5081",
        "subCode": "0_0001",
        "subMsg": "商家订单号已被使用",
        "success": true
      },
      "code": 0
    }
  }
  ```

  

  ## 三、物流轨迹订阅（京东推送物流轨迹必须先进行订阅）

  ### 1.1 java代码

  ``` java
  package com.interfacetest.sdk.jd;
  
  import com.lop.open.api.sdk.DefaultDomainApiClient;
  import com.lop.open.api.sdk.LopException;
  import com.lop.open.api.sdk.domain.ECAP.CommonSubscribeTraceApi.commonSubscribeTraceV1.CommonSubscribeTraceRequest;
  import com.lop.open.api.sdk.plugin.LopPlugin;
  import com.lop.open.api.sdk.plugin.factory.OAuth2PluginFactory;
  import com.lop.open.api.sdk.request.ECAP.EcapV1OrdersTraceSubscribeLopRequest;
  import com.lop.open.api.sdk.response.ECAP.EcapV1OrdersTraceSubscribeLopResponse;
  
  /**
   * 物流轨迹订阅
   */
  public class TraceSubscribe {
      public static void main(String[] args) {
          /**
           * 这里使用京东的沙盒环境配置进行测试
           */
          try {
              //设置接口域名(有的对接方案同时支持生产和沙箱环境，有的仅支持生产，具体以对接方案中的【API文档-请求地址】为准)，生产域名：https://api.jdl.com 预发环境域名：https://uat-api.jdl.com
              //DefaultDomainApiClient对象全局只需要创建一次
              DefaultDomainApiClient client = new DefaultDomainApiClient("https://test-api.jdl.com", 500, 15000);
  
              //入参对象（请记得更换为自己要使用的接口入参对象）
              EcapV1OrdersTraceSubscribeLopRequest request = new EcapV1OrdersTraceSubscribeLopRequest();
  
              // 请求参数
              CommonSubscribeTraceRequest commonSubscribeTraceRequest = new CommonSubscribeTraceRequest();
              commonSubscribeTraceRequest.setWaybillCode("JDVE00132473532");
              commonSubscribeTraceRequest.setOrderCode("EO0020042856228");
              commonSubscribeTraceRequest.setMobile("5514");
              commonSubscribeTraceRequest.setOrderOrigin(1);
              commonSubscribeTraceRequest.setCustomerCode("27K1234912");
              commonSubscribeTraceRequest.setBusinessUnitCode("27K1234912");
  
              request.setRequest(commonSubscribeTraceRequest);
  
              //设置插件，必须的操作，不同类型的应用入参不同，请看入参注释，公共参数按顺序分别为AppKey、AppSecret、AccessToken
              //使用开放平台ISV/自研商家应用调用接口
              LopPlugin lopPlugin = OAuth2PluginFactory.produceLopPlugin("62d07644754843cc882fca7c01476c4f", "0c2c8b6b7c10481ea639f6daa09ac02e", "78c246c0ab564e67add6296a9eaf04a1");
              request.addLopPlugin(lopPlugin);
  
              //使用开放平台合作伙伴应用调用接口
  //            LopPlugin lopPlugin = OAuth2PluginFactory.produceLopPlugin("bae34******************8fd", "661e4d**********************ec", "");
  //            request.addLopPlugin(lopPlugin);
  
              //使用JOS应用调用物流开放平台接口
  //            request.setUseJosAuth(true);
  //            LopPlugin lopPlugin = OAuth2PluginFactory.produceLopPlugin("DE79844E3***********43236CC", "7b01ff52c2********7b661448", "b89114***************d4e9da950m2u");
  //            request.addLopPlugin(lopPlugin);
              EcapV1OrdersTraceSubscribeLopResponse response = client.execute(request);
              System.out.println(response.getMsg());
          } catch (LopException e) {
              e.printStackTrace();
          } catch (Exception e) {
              e.printStackTrace();
          }
      }
  }
  
  ```

  ### 1.2 返回结果

  ```json
  {
    "response": {
      "content": {
        "code": 0,
        "data": "订阅成功",
        "mills": 276,
        "msg": "成功",
        "requestId": "7b0cc063-b560-451a-842a-48fea87be77c",
        "success": true
      },
      "code": 0
    }
  }
  ```

## 四、物流轨迹推送

``` java
[0;39m[33m2025-05-20 17:16:06.933[0;39m [[31mhttp-nio-9009-exec-1[0;39m-[31m3513900[0;39m] [34mINFO [0;39m
                requestId=[1;36m[0;39m [32m[receivingLogisticsTrack,61][0;39m [35mc.i.c.j.OrdersTraceMsgPushController[0;39m -[36m{"routeProvinceName":"北京","operateSiteId":"11111111","orderId":"SJ202505201442","operationTitle":"揽收任务分配","routeDistrictName":"石景山区","categoryName":"揽收中","operationTime":"2023-08-08 09:00:00","routeAddress":"北京市石景山区八角街道璟公院10号楼(模拟数据)","routeCityName":"北京市","waybillCode":"JDVE00132473532","state":"200034","scanType":"-625","category":390,"operateSite":"石景山营业部","operationRemark":"揽收任务已分配给张三（联系电话：13818888888）。"}
[0;39m[33m2025-05-20 17:16:23.034[0;39m [[31mhttp-nio-9009-exec-2[0;39m-[31m3513900[0;39m] [34mINFO [0;39m
                requestId=[1;36m[0;39m [32m[receivingLogisticsTrack,61][0;39m [35mc.i.c.j.OrdersTraceMsgPushController[0;39m -[36m{"routeProvinceName":"北京","operateSiteId":"11111111","orderId":"SJ202505201442","operationTitle":"揽收","routeDistrictName":"石景山区","categoryName":"已揽收","operationTime":"2023-08-08 10:00:00","routeAddress":"北京市石景山区八角街道璟公院10号楼(模拟数据)","routeCityName":"北京市","waybillCode":"JDVE00132473532","state":"200001","scanType":"-640","category":420,"operateSite":"石景山营业部","operationRemark":"京东快递 已收取快件"}
[0;39m[33m2025-05-20 17:16:25.055[0;39m [[31mhttp-nio-9009-exec-4[0;39m-[31m3513900[0;39m] [34mINFO [0;39m
                requestId=[1;36m[0;39m [32m[receivingLogisticsTrack,61][0;39m [35mc.i.c.j.OrdersTraceMsgPushController[0;39m -[36m{"routeProvinceName":"北京","operateSiteId":"11111111","orderId":"SJ202505201442","operationTitle":"封车","routeDistrictName":"石景山区","categoryName":"运输中","operationTime":"2023-08-08 13:00:00","routeAddress":"北京市石景山区八角街道璟公院10号楼(模拟数据)","routeCityName":"北京市","waybillCode":"JDVE00132473532","state":"200076","scanType":"-450","category":430,"operateSite":"石景山营业部","operationRemark":"您的快件已发车"}
[0;39m[33m2025-05-20 17:16:26.573[0;39m [[31mhttp-nio-9009-exec-3[0;39m-[31m3513900[0;39m] [34mINFO [0;39m
                requestId=[1;36m[0;39m [32m[receivingLogisticsTrack,61][0;39m [35mc.i.c.j.OrdersTraceMsgPushController[0;39m -[36m{"routeProvinceName":"北京","operateSiteId":"11111111","orderId":"SJ202505201442","operationTitle":"分拣验收","routeDistrictName":"石景山区","categoryName":"运输中","operationTime":"2023-08-08 15:00:00","routeAddress":"北京市石景山区八角街道璟公院10号楼(模拟数据)","routeCityName":"北京市","waybillCode":"JDVE00132473532","state":"10032","scanType":"10","category":430,"operateSite":"分拣中心A","operationRemark":"您的快件已到达【分拣中心A】"}
[0;39m[33m2025-05-20 17:16:27.860[0;39m [[31mhttp-nio-9009-exec-5[0;39m-[31m3513900[0;39m] [34mINFO [0;39m
                requestId=[1;36m[0;39m [32m[receivingLogisticsTrack,61][0;39m [35mc.i.c.j.OrdersTraceMsgPushController[0;39m -[36m{"routeProvinceName":"北京","operateSiteId":"11111111","orderId":"SJ202505201442","operationTitle":"封车","routeDistrictName":"石景山区","categoryName":"运输中","operationTime":"2023-08-08 23:00:00","routeAddress":"北京市石景山区八角街道璟公院10号楼(模拟数据)","routeCityName":"北京市","waybillCode":"JDVE00132473532","state":"200076","scanType":"-450","category":430,"operateSite":"分拣中心B","operationRemark":"您的快件已发车"}
[0;39m[33m2025-05-20 17:16:29.383[0;39m [[31mhttp-nio-9009-exec-6[0;39m-[31m3513900[0;39m] [34mINFO [0;39m
                requestId=[1;36m[0;39m [32m[receivingLogisticsTrack,61][0;39m [35mc.i.c.j.OrdersTraceMsgPushController[0;39m -[36m{"routeProvinceName":"北京","operateSiteId":"11111111","orderId":"SJ202505201442","operationTitle":"站点收货","routeDistrictName":"石景山区","categoryName":"运输中","operationTime":"2023-08-09 01:00:00","routeAddress":"北京市石景山区八角街道璟公院10号楼(模拟数据)","routeCityName":"北京市","waybillCode":"JDVE00132473532","state":"200075","scanType":"60","category":430,"operateSite":"石景山营业部","operationRemark":"您的快件在【石景山营业部】收货完成"}
[0;39m[33m2025-05-20 17:16:31.508[0;39m [[31mhttp-nio-9009-exec-7[0;39m-[31m3513900[0;39m] [34mINFO [0;39m
                requestId=[1;36m[0;39m [32m[receivingLogisticsTrack,61][0;39m [35mc.i.c.j.OrdersTraceMsgPushController[0;39m -[36m{"routeProvinceName":"北京","operateSiteId":"11111111","orderId":"SJ202505201442","operationTitle":"派件","routeDistrictName":"石景山区","categoryName":"派送中","operationTime":"2023-08-09 08:00:00","routeAddress":"北京市石景山区八角街道璟公院10号楼(模拟数据)","routeCityName":"北京市","waybillCode":"JDVE00132473532","state":"11000","scanType":"110","category":440,"operateSite":"石景山营业部","operationRemark":"您的快件正在派送中，请您准备签收（快递员：卫十四，联系电话：13819999999）。"}
[0;39m[33m2025-05-20 17:16:42.646[0;39m [[31mhttp-nio-9009-exec-8[0;39m-[31m3513900[0;39m] [34mINFO [0;39m
                requestId=[1;36m[0;39m [32m[receivingLogisticsTrack,61][0;39m [35mc.i.c.j.OrdersTraceMsgPushController[0;39m -[36m{"routeProvinceName":"北京","operateSiteId":"11111111","orderId":"SJ202505201442","operationTitle":"妥投","routeDistrictName":"石景山区","categoryName":"妥投","operationTime":"2023-08-09 09:00:00","routeAddress":"北京市石景山区八角街道璟公院10号楼(模拟数据)","routeCityName":"北京市","waybillCode":"JDVE00132473532","state":"10034","scanType":"150","category":510,"operateSite":"石景山营业部","operationRemark":"您的快件已由【客户指定地点】代收，感谢您使用京东物流，期待再次为您服务。"}
```

## 五、获取面单明文数据

```json
{
 "code": 1000,
 "message": "成功",
 "printDatas": [
  {
   "packageCode": "JDVC30380993329-1-1-",
   "printData": {
    "addedServicesList": [
     "高"
    ],
    "businessOrderId": "SJ202505201442",
    "examineFlag": "已验视",
    "freshType": "",
    "jdInfo": "950616 www.jdl.com",
    "kA": "",
    "logoUrl": "http://ydy-download.jdl.com/common/download?sourcePath=deliveryImages/JD.jpg",
    "orderMark": "30001000010900030000000000000002000030000002003000002000010000000000001000000010000101000000100000000000000010000006000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
    "packageCode": "JDVC30380993329-1-1-",
    "packageCodeSuffix": "-1-1-",
    "packageCount": "1",
    "packageName": "联想笔记本电脑",
    "preSortSiteName": "廊坊科技谷营业部",
    "qrHint": "扫码领红包",
    "qrcodeUrl": "https://pro.m.jd.com/mall/active/2y9zpPoV1ozoGJ1DUSLtgQP4K5gG/index.html?packageCode=JDVC30380993329-1-1-",
    "receiverAddress": "河北省廊坊市广阳区万庄镇中心小学",
    "receiverMobile": "1^_^5514",
    "receiverName": "杨^_^",
    "remark": "联想笔记本电脑",
    "roadCode": "019",
    "senderAddress": "广东省广州市黄埔区骏业路255号",
    "senderCompany": "盛捷（广州）物流供应链",
    "senderMobile": "1^_^2784",
    "senderName": "董^_^",
    "settleType": "月结",
    "sourceCrossCode": "77A",
    "sourceSiteId": 2032737,
    "sourceSortCenterId": 662006,
    "sourceSortCenterName": "广州黄埔集货",
    "sourceTabletrolleyCode": "B(3)固石-3A",
    "specialMarks": [
     "隔",
     "包"
    ],
    "specialOperationIcon": [
     "http://ydy-download.jdl.com/common/download?sourcePath=deliveryImages/jing_pei/bao.jpg"
    ],
    "t": "",
    "targetCrossCode": "LF",
    "targetSiteId": 1293432,
    "targetSortCenterId": 3462325,
    "targetSortCenterName": "廊坊",
    "targetTabletrolleyCode": "F18",
    "transportMode": "京东标快",
    "transportType": "",
    "waterMark": "",
    "waybillCode": "JDVC30380993329",
    "waybillCodeFirst": "JDVC3038099",
    "waybillCodeLast": "3329",
    "weight": "0.5"
   },
   "waybillCode": "JDVC30380993329"
  }
 ]
}
```

## 六、获取图片或者PDF打印面单

```json
{
 "code": 1000,
 "msg": "请求成功",
 "result": [
  {
   "dataFormat": 1,
   "fileFormat": 1,
   "outputType": 1,
   "successPackageCodes": [
    "JDVC30380993329-1-1-"
   ],
   "traceId": "41311b1f-162b-4351-b95f-9aec4c5f190b",
   "url": "https://ydy-download.jdl.com/common/download?sourcePath=pdfs/render4Outer/20250520/17/render4Outer_jdkd76x105_66_20250520_6a0e5468c787459eb10ef4a44291df30.pdf&timestamp=1747734477316&id=1&sign=22C677323C109BD549F128074CBE3C33"
  }
 ]
}
```
