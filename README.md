# StaticFS
  This is a tool that is used to provides static service on browser. You can use phone to browse the files in PC.

## Install(Windows)

* Insatll Node.js;
* Donwload this source to any directory.

## Run

* Open the file "config.js" with notpad. input the root file path in the "roots" property.Such as:
```
	"roots": ["c:\\files", "d:\\files"]
```
  And saves this file in UTF-8. 
  
* Run cmd.exe, and input:
```
  > cd <your directory>
  > npm install
  > node app.js
```

* And then the console output:
```
  UAV Static Files Service is listening at port 8000!
```
  OK!

* Supposes the IP of your PC is "192.168.1.100", then Open the browser in your phone, and input: http://192.168.1.100:8000, and the results in present in browser. 

## Final
I hope you enjoy it.

