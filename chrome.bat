set root=C:\Program Files (x86)\Google\Chrome\Application

cd /D %root%
"chrome.exe" --user-data-dir="C:/Chrome dev session" --disable-web-security http://127.0.0.1:8080
echo THIS IS FOR LOCAL SERVER (WINDOWS) DON'T FORGET TO EXIT THOSE CMD FILES
exit
  
