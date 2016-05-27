# zedBot scraper
##Usage
Add bookmark

see https://crawler.zed.ee/zedbot/scraper/
##Build
install nodejs

browserify -t browserify-css -t html-browserify src/scraper.js -o scraper.js

## Schemas
see *specs* folder for predefined schemas

## Example wrappers
sample wrappers are in *wrappers* folder

these are automatically used if navigated to appropriate site and specyifing aviable dataset.

For example navigate to photopoint.ee, click bookmark, set dataset name to "product" and click "go"
