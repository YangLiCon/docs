<template>
  <div class="data-structure-table">
    <el-table
      :data="tableData"
      style="width: 100%"
      row-key="name"
      border
      default-expand-all
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column prop="name" label="字段名称" width="200" />
      <el-table-column prop="type" label="类型" width="120" />
      <el-table-column prop="maxLength" label="最大长度" width="100" />
      <el-table-column prop="required" label="是否必须" width="100">
        <template #default="{ row }">
          <el-tag
            :type="row.required === '是' ? 'danger' : 'success'"
            size="small"
          >
            {{ row.required }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="example" label="示例值" width="150" />
      <el-table-column prop="description" label="描述" />
    </el-table>
  </div>
</template>

<script setup>
const tableData = [
  {
    name: "printerId",
    type: "string",
    maxLength: "",
    required: "否",
    example: "",
    description:
      "打印机名称（PC端普通打印机必传），获取方式：电脑控制面板-设备与打印机界面选中打印机右键选择打印机属性，打印机名称内会展示",
    children: [],
  },
  {
    name: "deviceId",
    type: "string",
    maxLength: "",
    required: "否",
    example: "8C:EC:4B:1B:D0:52",
    description: "设备id（设备id或二维码id二者必传其一）",
    children: [],
  },
  {
    name: "qrcodeId",
    type: "string",
    maxLength: "",
    required: "否",
    example: "xpe33k5v",
    description: "二维码id（设备id或二维码id二者必传其一）",
    children: [],
  },
  {
    name: "printChannel",
    type: "string",
    maxLength: "",
    required: "是",
    example: "ZOP",
    description: "打印渠道(填写：ZOP)",
    children: [],
  },
  {
    name: "printInfos",
    type: "Object[]",
    maxLength: "",
    required: "是",
    example: "",
    description: "打印数据",
    children: [
      {
        name: "partnerCode",
        type: "string",
        maxLength: "",
        required: "是",
        example: "200420036914037103",
        description: "订单号",
        children: [],
      },
      {
        name: "printParam",
        type: "Object",
        maxLength: "",
        required: "是",
        example: "",
        description: "打印参数",
        children: [
          {
            name: "paramType",
            type: "string",
            maxLength: "",
            required: "是",
            example: "ELEC_MARK",
            description:
              "ELEC_MARK：指定电子面单和指定大头笔信息 ELEC_NOMARK：指定电子面单和不指定大头笔信息 NOELEC_MARK：不指定电子面单和指定大头笔信息（需传电子面单账号密码获取运单号） NOELEC_NOMARK：不指定电子面单和不指定大头笔信息（需传电子面单账号密码获取运单号） DEFAULT_PRINT：采用默认电子面单账号",
          },
          {
            name: "mailNo",
            type: "string",
            maxLength: "",
            required: "否",
            example: "73111338944567",
            description:
              "运单号(paramType：ELEC_MARK必传；ELEC_NOMARK必传；即指定电子面单必传）",
          },
          {
            name: "elecAccount",
            type: "string",
            maxLength: "",
            required: "否",
            example: "",
            description:
              "电子面单账号（paramType：NOELEC_MARK必传；NOELEC_NOMARK必传；即不指定电子面单必传）",
          },
          {
            name: "elecPwd",
            type: "string",
            maxLength: "",
            required: "否",
            example: "",
            description:
              "电子面单密码（paramType：NOELEC_MARK必传；NOELEC_NOMARK必传；即不指定电子面单必传）",
          },
          {
            name: "printMark",
            type: "string",
            maxLength: "",
            required: "否",
            example: "300- C-09 011",
            description:
              "大头笔(paramType：ELEC_MARK必传；NOELEC_MARK必传；即指定大头笔必传）",
          },
          {
            name: "printBagaddr",
            type: "string",
            maxLength: "",
            required: "否",
            example: "沪西",
            description:
              "集包地 (paramType：ELEC_MARK必传；NOELEC_MARK必传；即指定大头笔必传）",
          },
          {
            name: "paiMan",
            type: "string",
            maxLength: "",
            required: "否",
            example: "015",
            description: "派件业务员编号",
          },
          {
            name: "fourCode",
            type: "string",
            maxLength: "",
            required: "否",
            example: "县医院",
            description: "四段码",
          },
        ],
      },
      {
        name: "sender",
        type: "Object",
        maxLength: "",
        required: "是",
        example: "",
        description: "寄件人信息",
        children: [
          {
            name: "name",
            type: "string",
            maxLength: "",
            required: "是",
            example: "李冰",
            description: "寄件姓名",
          },
          {
            name: "mobile",
            type: "string",
            maxLength: "",
            required: "是",
            example: "15026692250",
            description: "寄件手机号，手机号和电话二选一",
          },
          {
            name: "prov",
            type: "string",
            maxLength: "",
            required: "是",
            example: "陕西省",
            description: "寄件省",
          },
          {
            name: "city",
            type: "string",
            maxLength: "",
            required: "是",
            example: "西安市",
            description: "寄件市",
          },
          {
            name: "county",
            type: "string",
            maxLength: "",
            required: "是",
            example: "未央区",
            description: "寄件区",
          },
          {
            name: "address",
            type: "string",
            maxLength: "",
            required: "是",
            example: "雨润农产品物流",
            description: "寄件详细地址",
          },
        ],
      },
      {
        name: "receiver",
        type: "Object",
        maxLength: "",
        required: "是",
        example: "",
        description: "收件人信息",
        children: [
          {
            name: "name",
            type: "string",
            maxLength: "",
            required: "是",
            example: "巴拉巴拉",
            description: "收件姓名",
          },
          {
            name: "mobile",
            type: "string",
            maxLength: "",
            required: "是",
            example: "15026692256",
            description: "收件手机，手机和电话二者必传其一",
          },
          {
            name: "prov",
            type: "string",
            maxLength: "",
            required: "是",
            example: "上海",
            description: "收件省",
          },
          {
            name: "city",
            type: "string",
            maxLength: "",
            required: "是",
            example: "上海市",
            description: "收件市",
          },
          {
            name: "county",
            type: "string",
            maxLength: "",
            required: "是",
            example: "闵行区",
            description: "收件区",
          },
          {
            name: "address",
            type: "string",
            maxLength: "",
            required: "是",
            example: "申贵路1500号",
            description: "收件详细地址",
          },
        ],
      },
      {
        name: "goods",
        type: "Object",
        maxLength: "",
        required: "否",
        example: "",
        description: "物品信息",
        children: [
          {
            name: "goodsName",
            type: "string",
            maxLength: "",
            required: "否",
            example: "",
            description: "物品名称",
          },
          {
            name: "weight",
            type: "long",
            maxLength: "",
            required: "否",
            example: "1000",
            description: "物品重量（单位：克）",
          },
          {
            name: "freight",
            type: "long",
            maxLength: "",
            required: "否",
            example: "",
            description: "运费金额（单位：分）",
          },
          {
            name: "remark",
            type: "string",
            maxLength: "",
            required: "否",
            example: "",
            description: "订单备注",
          },
        ],
      },
      {
        name: "appreciationDTOS",
        type: "Object[]",
        maxLength: "",
        required: "否",
        example: "",
        description: "增值服务消息列表",
        children: [
          {
            name: "type",
            type: "integer",
            maxLength: "",
            required: "否",
            example: "",
            description:
              "增值服务类型（代收货款：2；到付：1；保价：18；中通标快：6；中通好快：29）；隐私服务：16",
          },
          {
            name: "amount",
            type: "integer",
            maxLength: "",
            required: "否",
            example: "",
            description: "增值服务金额(代收金额，保价金额，到付金额)",
          },
          {
            name: "backBillCode",
            type: "string",
            maxLength: "",
            required: "否",
            example: "",
            description: "回单号(签单返还时填写)",
          },
        ],
      },
      {
        name: "repetition",
        type: "boolean",
        maxLength: "",
        required: "否",
        example: "false",
        description: "重复打单模式(true 重复打单)",
        children: [],
      },
      {
        name: "checked",
        type: "boolean",
        maxLength: "",
        required: "否",
        example: "true",
        description: "是否验视 默认：true",
        children: [],
      },
      {
        name: "staffCode",
        type: "string",
        maxLength: "",
        required: "否",
        example: "",
        description: "业务员编号",
        children: [],
      },
      {
        name: "payType",
        type: "string",
        maxLength: "",
        required: "否",
        example: "CASH",
        description: "付款方式（到付：COSTD；现付：CASH；月结：MS）",
        children: [],
      },
      {
        name: "sheetMode",
        type: "string",
        maxLength: "",
        required: "否",
        example: "PRINT_SHEET",
        description:
          "打印模板（一联单（76*130）； 普通联：PRINT_SHEET； 寄件联：PRINT_SENDPAGE； 普通联+寄件联：PRINT_SHEET_SENDPAGE； 二联单(100*180)：TWO_NORMAL_100_180 三联单(100*180)：THREE_NORMAL_100_180 三联单(76*203)：THREE_NORMAL_76_203）",
        children: [],
      },
      {
        name: "takingEmpCode",
        type: "string",
        maxLength: "",
        required: "否",
        example: "",
        description: "揽件业务员code",
        children: [],
      },
      {
        name: "tenantName",
        type: "string",
        maxLength: "",
        required: "否",
        example: "",
        description: "商户名称",
        children: [],
      },
      {
        name: "partnerId",
        type: "string",
        maxLength: "",
        required: "否",
        example: "",
        description: "订单类型(星联订单标记：包含 starunion )",
        children: [],
      },
      {
        name: "realName",
        type: "int",
        maxLength: "",
        required: "否",
        example: "0",
        description: "是否实名(默认：0；1：未实名；2；已实名)",
        children: [],
      },
    ],
  },
];
</script>

<style scoped>
.data-structure-table {
  padding: 20px;
  background: #fff;
}

.el-table {
  font-size: 14px;
}

.el-table :deep(.el-table__cell) {
  padding: 8px 0;
}

.el-tag {
  margin: 2px;
}
</style>
