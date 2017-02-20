#!/bin/sh

sudo env XDG_CONFIG_HOME=/home/pi/.config/ /usr/bin/terminator -f -b -e sudo -u pi env PATH=$PATH:/home/pi/.nvm/versions/node/v6.9.5/bin/ sh -c "kill `ps -ef | grep pm2 | grep -v grep | awk '{print $2;}'` ; cd /home/pi/fudeVeatNeo-angular/ && npm install && bower install ; pm2 start /home/pi/fudeVeatNeo-angular/app.js && pm2 monit"