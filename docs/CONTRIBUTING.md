# Contribute

## Bug report

Bug reports are welcome, please open an [issue](https://github.com/yuudi/rclone-webui-angular/issues/new/choose) or [discuss](https://github.com/yuudi/rclone-webui-angular/discussions/new/choose)

## Code

For small bugfix, just open a [pull request](https://github.com/yuudi/rclone-webui-angular/pulls)

For new feature or big changes, please open an [issue](https://github.com/yuudi/rclone-webui-angular/issues/new/choose) first to discuss

### Development environment

Run backend: `rclone rcd --rc-user="<your username>" --rc-pass="<your password>" --rc-addr=127.0.0.1:5572`

Run frontend: `ng serve`

Api calling will be proxied to backed [config](../src/proxy.conf.mjs)

## Translation

### Application

If you want to help translate, first search the issue to see if there is already a translation in progress, if not, open an issue to tell others you are working on it

Please use translate tool like [Poedit](https://poedit.net/) to translate the [XLIFF file](../src/locale/messages.xlf), save as `messages.<language code>.xlf` and open a pull request

### Documentation

If you want to write documentation in your language, please create a folder named with your language code in [docs](../docs) and write the documents in it. Translating the "How to use" part is enough, other parts are not necessary. You can also organize the documents in your own way.
