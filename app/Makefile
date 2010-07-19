
YUI=yuicompressor-2.4.2
YUI_BIN=lib/$(YUI).jar


all: demo


$(YUI_BIN):
	wget -O lib/$(YUI).zip http://yuilibrary.com/downloads/yuicompressor/$(YUI).zip
	unzip -j -d lib/ lib/$(YUI).zip $(YUI)/build/$(YUI).jar

demo/jsdot-min.js: $(YUI_BIN) core/*.js style/*.css
	((cd core; cat `cat jsdot-dev.js | awk '/var files = \[/{i=1;next}/\];/{if(i){exit}}{if(i){sub(/^"/,"",$$1);sub(/",?[ \t\n\f\r]*$$/," ",$$1);printf "%s",$$1}}'`)) | java -jar $(YUI_BIN) --type js -o $@
	cp style/main.css demo/

demo: demo/jsdot-min.js

doc:
	if [ ! -d doc ] ; then mkdir doc ; fi
	JSDOC_PATH=~/local/share/jsdoc-toolkit ; \
	java -jar $$JSDOC_PATH/jsrun.jar $$JSDOC_PATH/app/run.js -a -p -t=$$JSDOC_PATH/templates/jsdoc -d=doc -o=doc/doc.log core/
