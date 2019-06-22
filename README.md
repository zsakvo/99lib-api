# 99lib-api

## 描述

[九九藏书网](https://www.99lib.net "九九藏书网")是一个专注于提供出版书籍阅读的网站，其提供的内容较为精良，但是因为官方并不提供 Android 客户端，亦没有相关的 Api 接口，所以自己使用 Nodejs 简单的实现了一个仅仅包含最基本功能的简陋 Api，来方便令其它 App 获取其内容。

## 准备

首先你的系统需要安装有 Node.js 以及 Git。

可以从官网获取相关安装包，亦可以通过仓库或者类似于[nvm](https://github.com/creationix/nvm "nvm")等脚本进行安装。

## 安装 / 更新 / 卸载

启动终端（Windows 为命令提示符或者 Powershell），执行命令

```
git clone https://github.com/zsakvo/99lib-api.git
# 亦可以直接下载源码包而后解压之
npm i
# yarn 同样是个不错的选择哦
```

至此，必要的模块安装成功。

## 配置

找到`config.js`，仅有的几个配置项均由此文件控制，按照内部注释自行修改相关值即可（改完别忘记保存）

## 使用

直接执行命令

```
node app.js
#亦可以使用 pm2 或者 forever 等守护进程。
```

## Api 说明

`以服务运行在 http://192.168.1.24:8009 上为例子`

搜索书籍：

> http://192.168.1.24:8009/book/search?keyword=%E7%99%BD%E5%A4%9C&page=0

书籍详情：

> http://192.168.1.24:8009/book/8558/index.htm

书籍内容：

> http://192.168.1.24:8009/book/8558/303252.htm

`简单点说就是把官网的搜索，详情，阅读时候的 host 替换为你自己服务的 host 即可 :)`

## 额外说明

如果你要把这个程序运行在 80 端口，可能会需要以 root 权限执行。

## ToDo

- [ ] 有空再说
