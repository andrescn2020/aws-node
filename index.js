import express from "express";
import fileUpload from "express-fileupload";
import { uploadFile, getFiles, getFile, downloadFile, getFileURL } from "./s3.js";

const app = express();

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "./uploads"
}));

app.get("/files", async (req, res) => {
    const result = await getFiles();
    res.json(result.Contents);
});

app.get("/files/:fileName", async (req, res) => {
    const file = req.params.fileName;
    const result = await getFileURL(file);
    res.send({
        url: result
    });
});

app.get("/downloadfile/:fileName", async (req, res) => {
    const file = req.params.fileName;
    await downloadFile(file);
    res.send({message: "File Downloaded"});
});


app.post("/files", async (req, res) => {
    const result = await uploadFile(req.files.file);
    res.json({ result });
});

app.use(express.static("images"));

app.listen(3000);
console.log(`Server on port ${3000}`);