'use strict';

var pdfKitService = {

    generatePDFDocument:function(inServiceURL,inDocumentString,successCB,failureCB) {
        failureCB = failureCB || noOp;

        function openPDFWhenDone(inServiceURL, inData, successCB, failureCB) {
            var file = b64toBlob(inData,'application/pdf');
            var fileURL = URL.createObjectURL(file);
            successCB(fileURL);
            //window.open(fileURL);
        }
        $.ajax({
            type: 'POST',
            url: inServiceURL + '/generationjobs',
            contentType: 'application/json; charset=utf-8',
            data: inDocumentString,
            error: function (jqXHR, textStatus, errorThrown) {
                failureCB({jqXHR: jqXHR, textStatus: textStatus, errorThrown: errorThrown});
            }
        }).done(function (data) {
            openPDFWhenDone(inServiceURL, data, successCB, failureCB);
        });

    }
}

function b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, {type: contentType});
    return blob;
}
function noOp(){}
