#!/bin/bash

echo "                                                                                                                                     "
echo "   /$$$$$$            /$$$$$$$  /$$                             /$$$$$$$$ /$$                                                        "
echo "  /$$__  $$          | $$__  $$| $$                            | $$_____/|__/                                                        "
echo " | $$  \__/  /$$$$$$ | $$  \ $$| $$  /$$$$$$  /$$$$$$$         | $$       /$$ /$$$$$$$   /$$$$$$  /$$$$$$$   /$$$$$$$  /$$$$$$       "
echo " | $$ /$$$$ /$$__  $$| $$$$$$$/| $$ |____  $$| $$__  $$ /$$$$$$| $$$$$   | $$| $$__  $$ |____  $$| $$__  $$ /$$_____/ /$$__  $$      "
echo " | $$|_  $$| $$  \ $$| $$____/ | $$  /$$$$$$$| $$  \ $$|______/| $$__/   | $$| $$  \ $$  /$$$$$$$| $$  \ $$| $$      | $$$$$$$$      "
echo " | $$  \ $$| $$  | $$| $$      | $$ /$$__  $$| $$  | $$        | $$      | $$| $$  | $$ /$$__  $$| $$  | $$| $$      | $$_____/      "
echo " |  $$$$$$/|  $$$$$$/| $$      | $$|  $$$$$$$| $$  | $$        | $$      | $$| $$  | $$|  $$$$$$$| $$  | $$|  $$$$$$$|  $$$$$$$      "
echo "  \______/  \______/ |__/      |__/ \_______/|__/  |__/        |__/      |__/|__/  |__/ \_______/|__/  |__/ \_______/ \_______/      "
echo "                                                                                                                                     "



upSeconds="$(/usr/bin/cut -d. -f1 /proc/uptime)"
secs=$((${upSeconds}%60))
mins=$((${upSeconds}/60%60))
hours=$((${upSeconds}/3600%24))
days=$((${upSeconds}/86400))
UPTIME=`printf "%d days, %02dh%02dm%02ds" "$days" "$hours" "$mins" "$secs"`

# get the load averages
read one five fifteen rest < /proc/loadavg

echo "
   .~~.   .~~.    `date +"%A, %e %B %Y, %r"`
  '. \ ' ' / .'   `uname -srmo`
   .~ .~~~..~.    NODE VERSION.........: ${NODE_VERSION}
  : .~.'~'.~. :
 ~ (   ) (   ) ~  Uptime.............: ${UPTIME}
( : '~'.~.'~' : ) Memory.............: `cat /proc/meminfo | grep MemFree | awk {'print $2'}`kB (Free) / `cat /proc/meminfo | grep MemTotal | awk {'print $2'}`kB (Total)
 ~ .~ (   ) ~. ~  Load Averages......: ${one}, ${five}, ${fifteen} (1, 5, 15 min)
  (  : '~' :  )   Running Processes..: `ps ax | wc -l | tr -d " "`
   '~ .~~~. ~'
       '~'        IP Addresses.......: `ip a | grep glo | awk '{print $2}' | head -1 | cut -f1 -d/` and `wget -q -O - https://icanhazip.com/ | tail`

                  HOSTNAME............: ${HOSTNAME}

                  Git Commit..........: `cat /var/www/validator/.git/HEAD`
"

