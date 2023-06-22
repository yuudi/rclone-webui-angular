# Using PWA build of this project

PWA build is suitable for managing multiple remote servers.

## Setting up server

1.  Install [rclone](https://rclone.org/) if you haven't

    ```bash
    curl https://rclone.org/install.sh | sudo bash
    ```

1.  Create a username and password, and start rclone

    ```bash
    rclone rcd --rc-user="<your username>" --rc-pass="<your password>" --rc-addr=127.0.0.1:5572
    ```

1.  Use reverse proxy and enable HTTPS (important, PWA doesn't allow insecure connection)

    - If you are using Nginx, you can add the following configuration to your Nginx server block

      ```nginx
      server {
          listen 443 ssl http2;
          server_name <your domain>;
          ssl_certificate <your certificate path>;
          ssl_certificate_key <your certificate key path>;
          location / {
              if ($request_method = OPTIONS ) {
                  return 200;
              }
              proxy_pass http://127.0.0.1:5572;
              proxy_hide_header Access-Control-Allow-Origin;
              proxy_hide_header Access-Control-Allow-Headers;
              add_header Access-Control-Allow-Origin https://yuudi.github.io;
              add_header Access-Control-Allow-Headers "Authorization, Content-type";
          }
      }
      ```

    - If you are using Caddy, you can add the following configuration to your Caddyfile (HTTPS is enabled automatically)

      ```Caddyfile
      <your domain> {
          @options method OPTIONS
          respond @options ""
          reverse_proxy 127.0.0.1:5572 {
              header_down -Access-Control-Allow-Origin
              header_down -Access-Control-Allow-Headers
          }
          header Access-Control-Allow-Origin https://yuudi.github.io
          header Access-Control-Allow-Headers "Authorization, Content-type"
      }
      ```

1.  After that, you can go to <https://yuudi.github.io/rclone-webui-angular> and enter your domain, username and password to access your rclone service
