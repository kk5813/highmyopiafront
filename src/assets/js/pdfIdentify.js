// var mime = require('mime');
// let fs = require('fs'), PDFParser = require("pdf2json");
// const fs = window.require("fs");
const pdf = require("pdf-extraction");


function pdfIdentify (file) {
    // let pdfParser = new PDFParser();
    // pdfParser.loadPDF(filepath);
    // pdfParser.on("pdfParser_dataError", errData =>
    //     console.error(errData.parserError)
    // )
    // data = []
    // if(data.length === 0){
    //     pdfParser.on("pdfParser_dataReady", pdfData => {
    //         //console.log(pdfData)
    //         data = pdfParser.getRawTextContent()
    //         console.log(data);
    //     });
    // }
    // let dataBuffer = fs.readFile(filepath);
    pdf(dataBuffer).then(function (data) {
        // number of pages
        console.log(data.numpages);
        // number of rendered pages
        console.log(data.numrender);
        // PDF info
        console.log(data.info);
        // PDF metadata
        console.log(data.metadata);
        // PDF.js version
        // check https://mozilla.github.io/pdf.js/getting_started/
        console.log(data.version);
        // PDF text
        console.log(data.text);
    });
}

export {
    pdfIdentify
}