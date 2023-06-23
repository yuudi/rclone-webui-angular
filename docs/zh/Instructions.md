# 使用方法

请根据需要选择[本地使用](#本地)或[远程服务器使用](#远程服务器)

## 本地

首先安装 [rclone](https://rclone.org/downloads/)

然后运行以下命令获取图形界面（需要魔法）

```bash
rclone rcd --rc-web-gui --rc-web-fetch-url="https://api.github.com/repos/yuudi/rclone-webui-angular/releases/latest" --rc-web-gui-force-update
```

之后就不再需要魔法，可以直接运行以下命令

```bash
rclone rcd --rc-web-gui
```

如果需要更新，请重新运行第一个的命令

## 远程服务器

安装 rclone

```bash
curl https://rclone.org/install.sh | sudo bash
```

创建一个用户名和密码，并启动 rclone

```bash
rclone rcd --rc-user=用户名 --rc-pass=密码 --rc-addr=127.0.0.1:5572
```

使用反向代理并启用 HTTPS（重要，如不设置你的所有数据将暴露给任何人，而且 PWA 不允许使用不安全的连接）

如果你使用 Nginx，你可以使用下面的配置

```nginx
server {
    listen 443 ssl http2;
    server_name 你的域名;
    ssl_certificate 你的证书路径;
    ssl_certificate_key 你的证书密钥路径;

    location / {
        proxy_pass http://127.0.0.1:5572;

        # 如果你使用服务器管理面板，以上的配置可以由面板自动设置，你只需要添加以下内容

        if ($request_method = OPTIONS ) {
            return 200;
        }
        proxy_hide_header Access-Control-Allow-Origin;
        proxy_hide_header Access-Control-Allow-Headers;
        add_header Access-Control-Allow-Origin https://yuudi.github.io;
        add_header Access-Control-Allow-Headers "Authorization, Content-type";
    }
}
```

完成后，你可以前往 <https://yuudi.github.io/rclone-webui-angular/zh-CN/> 输入你的域名、用户名和密码来访问你的 rclone 服务

这个页面使用 PWA 技术，只有首次访问需要魔法，之后不再需要，即使断网也可以使用
