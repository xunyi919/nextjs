# 数据库设置指南

本文档介绍了如何根据 `src/db/schema.ts` 文件中的定义来设置数据库表。

## 前提条件

1. 确保已设置 `DATABASE_URL` 环境变量
2. 确保数据库服务器正在运行并且可以从您的机器访问

## 数据库初始化步骤

### 1. 使用 Drizzle Kit 推送模式（推荐用于开发环境）

```bash
npm run db:push
```

此命令会直接将 `schema.ts` 中定义的表结构推送到数据库，适用于开发环境的快速设置。

如果遇到连接问题，请检查：
- 数据库 URL 是否正确
- 网络连接是否正常
- 防火墙是否阻止了连接

### 2. 使用迁移方式（推荐用于生产环境）

```bash
# 生成迁移文件
npm run db:generate

# 执行迁移
npm run db:migrate
```

此方式会生成迁移文件并按顺序执行，适用于生产环境，可以更好地跟踪数据库变更历史。

### 3. 使用自定义脚本

```bash
# 推送模式
npm run db:push-schema

# 初始化数据库（如果使用迁移方式）
npm run db:init
```

## schema.ts 中定义的表结构

根据 `src/db/schema.ts` 文件，数据库包含以下表：

1. **users** - 用户表
   - id: 整数，主键，自动生成
   - name: 字符串，非空
   - age: 整数，非空
   - email: 字符串，非空，唯一

2. **posts** - 文章表
   - id: 整数，主键，自动生成
   - title: 字符串，非空
   - slug: 字符串，非空，唯一
   - content: 文本，非空
   - tag: 文本
   - authorId: 整数，外键关联 users 表
   - published: 布尔值，默认 false
   - isPublic: 布尔值，默认 false
   - createdAt: 时间戳，默认当前时间
   - updatedAt: 时间戳，默认当前时间

3. **categories** - 分类表
   - id: 整数，主键，自动生成
   - name: 字符串，非空
   - slug: 字符串，非空，唯一
   - description: 文本

4. **post_categories** - 文章分类关联表
   - postId: 整数，外键关联 posts 表
   - categoryId: 整数，外键关联 categories 表

5. **tags** - 标签表
   - id: 整数，主键，自动生成
   - name: 字符串，非空
   - num: 整数，非空

## 故障排除

如果遇到连接问题：

1. 检查 `DATABASE_URL` 是否正确设置
2. 确认数据库服务器正在运行
3. 检查网络连接和防火墙设置
4. 验证数据库凭据是否正确

## 注意事项

1. 在生产环境中，建议使用迁移方式而不是直接推送模式
2. 确保在执行任何数据库操作之前备份重要数据
3. 环境变量 `DATABASE_URL` 必须正确设置才能连接到数据库