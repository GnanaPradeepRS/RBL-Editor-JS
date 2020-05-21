


function editorTheme(){
    theme = document.getElementById("themes").value;
    let theming = "ace/theme/"+theme;
    editor.setTheme(theming);
}

let count = 1;

function darkMode(){
    count +=1;
    if(count%2==0){
        document.getElementById('body').setAttribute("style", "background-color : #1a1a1a");
        editor.setTheme('ace/theme/tomorrow_night_bright');
    }else
    {
        document.getElementById('body').setAttribute("style", "background-color : white");
        editor.setTheme('ace/theme/dreamweaver');
    }
}

function execCmd(command){
//    document.getElementById('ace_scroller').innerHTML.execCommand(command , false, null);
swal("Feature under development","this feature will be available in future updates" , "info")
}

function execCmdWithArg(command , arg){
    editor.document.execCommand(command , false, arg);
}

function APIValidation(){
    //validate if BR and BR Type is populated
    let BRType = document.getElementById('file-type').value;
    // let BRRaw = document.getElementById('editor').innerText;
    let BRRaw = document.getElementsByClassName("ace_scroller")[0].innerText;

    if(BRType == 'none' ){
        // alert('Select Type Of Business Rule');
        swal('','Select Type Of Business Rule','info')
    }
    if(BRRaw == '' || BRRaw==null){
        // alert('There is noo Business Rule to Validate please enter the Business Rule before checking');
        swal('','There is noo Business Rule to Validate please enter the Business Rule before checking','info')
    }

    if(BRType!= 'none' && BRRaw !=''){
        let BR = convertToInline((BRRaw));
        ValidateBRFunction(BRType,BR);
    }
}

function ValidateBRFunction(BRType,BR,element){

    // let URL = "http://manage.rdpdseu10.riversand-dataplatform.com:9095/brownthomasds/api/modelgovernservice/validate";

    let URL ="http://manage.rdpdsna07.riversand-dataplatform.com:9095/academyds/api/modelgovernservice/validate"

    readTextFile("ValidateBRData.json" , function(text){
    postData = JSON.parse(text);
    postData.entityModel.data.attributes.ruleType.values[0].value = BRType;
    postData.entityModel.data.attributes.definition.values[0].value = BR;
    makeCorsRequest(URL, JSON.stringify(postData), displayResponse, element);
    });
}


function readTextFile(file, callback) {
    let rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

function displayResponse(response, element) {

    response = JSON.parse(response);
    let messageElement =  element;
    
    if(!element)
    {
        messageElement = document.getElementById("status");
    }
    
    if(!validResponse(response))
    {
        messageElement.setAttribute("style", "color: red");

        if (has(response, 'response')) {
            messageElement.innerHTML = JSON.stringify(response.response);
        } else {
            messageElement.innerHTML = JSON.stringify(response);
        }

        return;
    }

    let attributes = response.response.entityModels[0].data.attributes;
    let message = '';
    if (has(attributes, 'ruleType')) {
        message = attributes.ruleType.properties.messages[0]
    }
    else if (has(attributes, 'definition')) {
        message = attributes.definition.properties.messages[0]
    } else {
        messageElement.setAttribute("style", "color: red");
        messageElement.innerHTML = JSON.stringify(response);

        return;
    }
     
    if (message.messageType == 'success') {
            swal(message.messageCode, "Success", "success");
    }
    else {
        //document.getElementById('response-block').setAttribute("style", "display:contents");
        //document.getElementById('response-block').setAttribute("style" , "background-color : #ff6666");
       // messageElement.innerHTML = '&nbsp;&nbsp;&nbsp; Error :' + message.messageCode + ': ' + message.message;
       swal( message.messageCode, message.message , "error");
       
    }
}

function validResponse(response){
    if (!has(response, 'response')){
        return false;
    }

    if (!has(response.response, 'entityModels')){
        return false;
    }

    if (!has(response.response.entityModels[0], 'data')){
        return false;
    }

    if (!has(response.response.entityModels[0].data, 'attributes')){
        return false;
    }

    return true;
}

function has(object, key) {
    return object ? hasOwnProperty.call(object, key) : false;
}

// Create the XHR object.
function createCORSRequest(method, url, callback) {
    let xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {
        // XHR for Chrome/Firefox/Opera/Safari.
        xhr.open(method, url, true);
    } else if (typeof XDomainRequest != "undefined") {
        // XDomainRequest for IE.
        xhr = new XDomainRequest();
        xhr.open(method, url);
    } else {
        // CORS not supported.
        xhr = null;
    }
    return xhr;
}

// // Helper method to parse the title tag from the response.
// function getTitle(text) {
//     return text.match('<title>(.*)?</title>')[1];
// }

// Make the actual CORS request.
function makeCorsRequest(url, data, callback, element) {
    // This is a sample server that supports CORS.

    let xhr = createCORSRequest('POST', url);
    if (!xhr) {
        alert('CORS not supported');
        return;
    }

    xhr.onreadystatechange = function () {//Call a function when the state changes.
        if (xhr.readyState == 4 && xhr.status == 200) {
           callback(xhr.responseText, element);
         
        }
    }

    xhr.onerror = function () {
        //document.getElementById('status').innerHTML = 'Woops, there was an error making the request. Might be a browser issue.';
       
            swal("Woops, there was an error making the request. Might be a browser issue.", '' , "warning");
           
            
        //document.getElementById('readme').innerHTML = '&nbsp;&nbsp;&nbsp; <a style="font-weight:bold;" href="readme.html" target="_blank">Browser issues ?</a>';
    };

    xhr.send(data);
}

function wordFormat(){
    let BRRaw = document.getElementsByClassName("ace_scroller")[0].innerText;
    let store = BRRaw
    let InlineBR = convertToInline(BRRaw);
    document.getElementsByClassName("ace_scroller")[0].innerText = InlineBR;
    document.getElementsByClassName("ace_gutter-cell")[0].innerText="1";
    document.getElementById('editor').setAttribute("contentEditable",true);
    return store;
}

// function wordFormat(){
//     let BRRaw = document.getElementById('editor').innerText;
//     console.log(BRRaw);
//     let store = BRRaw
//     console.log(store)
//     let InlineBR = convertToInline(BRRaw);
//     console.log(InlineBR)
//     document.getElementById('editor').innerText = InlineBR;
//     document.getElementById('editor').setAttribute("contentEditable",true);
//     return store;
// }

function  inlineFormat(){
    execCmd('asdf');
    // let store = wordFormat();
    // document.getElementById('editor') = store;
}


function convertToInline(BRRaw) {
    let BR=  BRRaw.replace(/(\r\n|\n|\r)/gm, "").replace(/\s+/g, " ").replace(/[ \t\r]+/g, " ");
    
    return BR;
}

let lineCountFlag = 0;
function lineNumbering(){
    let lines = document.getElementsByClassName('ace_gutter-cell').length;
    lineCountFlag+=1;

    for(i=1;i<=lines;i++){
        if(lineCountFlag%2==1){
            document.getElementsByClassName("ace_gutter-cell")[i-1].setAttribute("style","display:none");
        }
        if(lineCountFlag%2==0 && lineCountFlag!=0){
            let t = document.createElement('div');
            t.innerHTML = i

            document.getElementsByClassName("ace_gutter-cell")[i-1].appendChild(t);
        }
    }
}

function clearEditor(){
   location.reload();
}

function copy(){
    document.execCommand("copy");

}
