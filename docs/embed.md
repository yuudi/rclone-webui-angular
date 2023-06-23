# Using embed build of this project

Embed build is suitable for managing local instance.

If you want to manage multiple remote servers, please check [PWA build](./pwa.md)

## Setting up

1. Install [rclone](https://rclone.org/downloads/) if you haven't

1. Then run the following command

   ```bash
   rclone rcd --rc-web-gui --rc-web-fetch-url="https://api.github.com/repos/yuudi/rclone-webui-angular/releases/latest"
   ```

   If you have used [rclone-webui-react](https://github.com/rclone/rclone-webui-react) before, you need to force an update by appending `--rc-web-gui-force-update` to the command

1. Then the browser will open automatically, if not, follow the link in the terminal
