'use strict';

var pdfKitService = {

    generatePDFDocument:function(inServiceURL,inDocumentString,successCB,failureCB) {
        failureCB = failureCB || noOp;

        function openPDFWhenDone(inServiceURL, inData, successCB, failureCB) {
            if (inData.status == 0) {

                successCB(inServiceURL + '/' + inData.generatedFileID);
            }
            else if (inData.status == 2 && failureCB) {
                failureCB(inData);
            }
            else {
                window.setTimeout(function () {
                    $.get(inServiceURL + '/generationjobs/' + inData.jobID, function (data) {
                        openPDFWhenDone(inServiceURL, data, successCB, failureCB);
                    }).fail(failureCB);
                }, 1000);
            }
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
function noOp(){}
