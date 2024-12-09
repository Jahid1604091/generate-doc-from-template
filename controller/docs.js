const asyncHandler = require("../middleware/async");
const ErrorResponse = require('../utils/errorResponse');

const Docxtemplater = require("docxtemplater");
const PizZip = require("pizzip");
const docxConverter = require('docx-pdf');
const fs = require("fs");
const path = require("path");

exports.extractDataFromTemplate = asyncHandler(async (req, res, next) => {
    try {
        // Extract user data from request body
        const { users, fileExportType } = req.body;

        // Read the Word template
        const content = fs.readFileSync(
            path.resolve(__dirname, '..', 'docs', 'input.docx'), "binary"
        );

        // Load the template into PizZip and Docxtemplater
        const zip = new PizZip(content);
        const doc = new Docxtemplater(zip, {
            paragraphLoop: true,
            linebreaks: true
        });

        // Replace placeholders with data
        doc.render({ users });

        // Generate the updated document as a buffer
        const docxBuf = doc.getZip().generate({
            type: "nodebuffer",
            compression: "DEFLATE"
        });

        //convert to pdf
        if (fileExportType === 'pdf') {
           
            try {
        
                // Define paths for input and output
                const inputDocxPath = path.resolve(__dirname, '..', 'docs', 'temp.docx');
                const outputPdfPath = path.resolve(__dirname, '..', 'docs', 'output.pdf');
                
                docxConverter(inputDocxPath, outputPdfPath,  function(err, result) {
                    if (err) {
                        console.error("Error converting docx to pdf:", err);
                        return res.status(500).json({ error: "Failed to convert to PDF." });
                    }
                    else{
                        res.download(outputPdfPath, () => { });
                    }
        
                    // Read the converted PDF
                    const pdfBuffer =  fs.readFile(outputPdfPath);
        
                    // Set response headers for PDF
                    res.set({
                        "Content-Type": "application/pdf",
                        "Content-Disposition": "attachment; filename=output.pdf",
                    });
        
                    // Send the PDF file as response
                    res.send(pdfBuffer);
        
                    // Optional Cleanup
                    //  fs.unlink(inputDocxPath);
                    //  fs.unlink(outputPdfPath);
                });
            } catch (err) {
                console.error("Unexpected error during conversion:", err);
                return res.status(500).json({ error: "Unexpected error occurred." });
            }
        }

        // Set response headers for a file preview/download
        res.set({
            "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "Content-Disposition": "inline; filename=preview.docx", // Or "attachment" for download
        });

        // Send the buffer as a response
        res.send(docxBuf);
    } catch (error) {
        console.error("Error generating preview:", error);
        res.status(500).json({ error: "Failed to generate preview." });
    }
});

