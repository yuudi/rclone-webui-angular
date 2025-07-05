# Contribute

## Bug report

Bug reports are welcome, please open an [issue](https://github.com/yuudi/rclone-webui-angular/issues/new/choose) or [discuss](https://github.com/yuudi/rclone-webui-angular/discussions/new/choose)

## Code

For small bugfix, just open a [pull request](https://github.com/yuudi/rclone-webui-angular/pulls)

For new feature or big changes, please open an [issue](https://github.com/yuudi/rclone-webui-angular/issues/new/choose) first to discuss

### Development environment

> Optional: This project ready for Dev-Container, try it out at [GitHub Codespace](https://codespaces.new/yuudi/rclone-webui-angular)

1.  install rclone if you didn't
1.  create some backend for test purpose

    ```sh
    TMP_DIR=$(mktemp -d)
    mkdir -p $TMP_DIR/pseudo-backend/{backend-a/{folder-1,folder-2},backend-b}
    touch $TMP_DIR/pseudo-backend/backend-a/{folder-1/{file-1.txt,file-2.jpg},file.txt}
    rclone config create pseudo-backend-a alias remote=$TMP_DIR/pseudo-backend/backend-a
    rclone config create pseudo-backend-b alias remote=$TMP_DIR/pseudo-backend/backend-b
    # rm -r $TMP_DIR # when you want to delete them
    ```

1.  start project

    ```sh
    npm start # it will start rclone and angular at same time, API calling will be properly proxied to backed
    ```

## Translation

### Application

If you want to help translate, first search the issue to see if there is already a translation in progress, if not, open an issue to tell others you are working on it

Please use translate tool like [Poedit](https://poedit.net/) to translate the [XLIFF file](../src/locale/messages.xlf), save as `messages.<language code>.xlf` and open a pull request

### Documentation

If you want to write documentation in your language, please create a folder named with your language code in [docs](../docs) and write the documents in it. Translating the "How to use" part is enough, other parts are not necessary. You can also organize the documents in your own way.
