set root=C:\Program Files (x86)\Google\Chrome\Application

cd /D %root%
"chrome.exe" --user-data-dir="C:/Chrome dev session" --disable-web-security
call exit
