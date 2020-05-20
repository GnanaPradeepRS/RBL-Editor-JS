// function enableEditMode(){
//     editor.document.designMode='On';
//     editor.document.body.setAttribute("spellcheck","false");
// } //edit mode for iframe editor

function execCmd(command){
   document.getElementById('editor').innerHTML.execCommand(command , false, null);
}

function execCmdWithArg(command , arg){
    editor.document.execCommand(command , false, arg);
}

function APIValidation(){
    //validate if BR and BR Type is populated
    let BRType = document.getElementById('file-type').value;
    let BRRaw = document.getElementById('editor').innerText;

    console.log(BRRaw)

    if(BRType == 'none' ){
        alert('Select Type Of Business Rule');
    }
    if(BRRaw == ''){
        alert('There is noo Business Rule to Validate please enter the Business Rule before checking');
    }

    if(BRType!= 'none' && BRRaw !=''){
        resetstatus();
        let BR = convertToInline((BRRaw));
        ValidateBRFunction(BRType,BR);
    }
}

function resetstatus(){
    document.getElementById('status').innerHTML = '';
}

function ValidateBRFunction(BRType,BR,element){

    let URL = "http://manage.rdpdseu10.riversand-dataplatform.com:9095/brownthomasds/api/modelgovernservice/validate";

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
      
        messageElement.innerHTML = '&nbsp;&nbsp;&nbsp; Success :' + message.messageCode;
        document.getElementById('response-block').setAttribute("style" , "background-color : #BDFF9E");
    }
    else {
        document.getElementById('response-block').setAttribute("style" , "background-color : #ff6666");
        messageElement.innerHTML = '&nbsp;&nbsp;&nbsp; Error :' + message.messageCode + ': ' + message.message;
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
        document.getElementById('status').innerHTML = 'Woops, there was an error making the request. Might be a browser issue.';
        document.getElementById('readme').innerHTML = '&nbsp;&nbsp;&nbsp; <a style="font-weight:bold;" href="readme.html" target="_blank">Browser issues ?</a>';
    };

    xhr.send(data);
}

function wordFormat(){
    let BRRaw = document.getElementById('editor').innerText;
    console.log(BRRaw);
    let store = BRRaw
    console.log(store)
    let InlineBR = convertToInline(BRRaw);
    console.log(InlineBR)
    document.getElementById('editor').innerText = InlineBR;
    document.getElementById('editor').setAttribute("contentEditable",true);
    return store;
}

function  inlineFormat(){
    let store = wordFormat();
    document.getElementById('editor') = store;
}


function convertToInline(BRRaw) {
    let BR=  BRRaw.replace(/(\r\n|\n|\r)/gm, "").replace(/\s+/g, " ").replace(/[ \t\r]+/g, " ");
    
    return BR;
}