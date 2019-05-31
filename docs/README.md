 
# 设计文档

## 加入

> https://my.lsong.org/join

### 输入参数

1. 邀请码
2. 邮箱
3. 手机号

以上3种形式最终都会转换成 [1], 具体方法是：

1. 用户输入邀请码后直接跳转，无需验证，因为注册页面会验证有效性。
2. 邮箱，确认后发送确认邮件到邮箱，内容包含邀请码，点击邀请链接直接跳转注册。
3. 用户需要先发送短信到指定号码(+8618888888888)我们的短信网关收到短信后将创建邀请码到数据库，等待用户输入手机号码，确认后会查询数据库中是否存在该信息，如果存在则取出邀请码跳转注册。

### 数据库表结构

- source 邀请来源，邮件/手机号/运营创建/其他用户邀请
- code 邀请码

## 注册

> https://my.lsong.org/signup?code=xxx

### 输入参数

- code 邀请码/验证码， 用于限制用户注册，避免滥用。当然也可以随时调整策略，不使用邀请码
- username 用户名，唯一，用于标识用户
- password 密码

### 数据库表结构

- id
- username
- password
- salt

## 授权管理

创建用户授权 token 凭证，用于用户登录，或者第三方应用接入
用户登录后可以对已经创建的授权进行 revoke 操作

### 输入参数

- name 授权名称, 例如 Chrome/110.73.143.88 或者 MyApp
- username 用户名
- password 密码

### 数据库表结构

- name
- token
- userId


## 用户信息

> https://my.lsong.org/**username**

- 用户信息 https://my.lsong.org/song940.json
- 用户头像 https://my.lsong.org/song940.jpg
- 用户资料 https://my.lsong.org/song940/profile
- 用户设置 https://my.lsong.org/song940/settings

## 授权

USER ->  3rd Party -> MyCenter ->

https://my.lsong.org/authorize?client_id=xxx&redirect_uri=xxx&scope=xx,xx,xx

client_id
user
code

[x] r
[x] w
[x] x

--


https://my.lsong.org/access_token?client_id=xxx&client_secret=xxx&code=xxx&grant_type=authorization_code
