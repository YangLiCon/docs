# 智桥建表提示词

```
根据以上字段设计Mysql建表语句,公共字段原封不动，不需要你帮我修改,主键为ID，类型为varchar(20),以下为公共字段:
`enable_flag` varchar(255) NOT NULL DEFAULT 'enable' COMMENT '启用状态',
  `delete_flag` varchar(255) NULL DEFAULT 'not_delete' COMMENT '删除标志(未删除:not_delete,已删除:DELETED)',
  `tenant_id` varchar(20) NULL COMMENT '租户号',
  `ext_json` text NULL COMMENT '扩展信息',
  `remark` text NULL COMMENT '备注',
  `revision` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '乐观锁',
  `create_user` varchar(20) NULL COMMENT '创建人',
  `create_time` datetime(0) NULL COMMENT '创建时间',
  `update_user` varchar(20) NULL COMMENT '更新人',
  `update_time` datetime(0) NULL COMMENT '更新时间',
```
