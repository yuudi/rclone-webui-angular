# Using embed build of this project

Embed build is suitable for managing local instance.

If you want a native desktop application, please check [native build](./native.md)  
If you want to manage multiple remote servers, please check [PWA build](./pwa.md)

## Setting up

1. Install [rclone](https://rclone.org/downloads/) if you haven't

1. Then run the following command

   ```bash
   rclone rcd --rc-web-gui --rc-web-gui-update --rc-web-fetch-url="https://s3.yuudi.dev/rwa/embed/version.json"
   ```

   If you have used [rclone-webui-react](https://github.com/rclone/rclone-webui-react) before, you need to force an update by appending `--rc-web-gui-force-update` to the command

1. Then the browser will open automatically, if not, follow the link in the terminal
