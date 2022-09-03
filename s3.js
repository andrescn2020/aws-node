import { S3Client, PutObjectCommand, ListObjectsCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { AWS_BUCKET_NAME, AWS_BUCKET_REGION, AWS_PUBLIC_KEY, AWS_SECRET_KEY } from "./config.js";
import fs from "fs";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const client = new S3Client({
    region: AWS_BUCKET_REGION,
    credentials: {
        accessKeyId: AWS_PUBLIC_KEY,
        secretAccessKey: AWS_SECRET_KEY
    }
});

export const uploadFile = async (file) =>{
    const stream = fs.createReadStream(file.tempFilePath);
    const uploadParams = {
        Bucket: AWS_BUCKET_NAME,
        Key: file.name,
        Body: stream
    };
    const command = new PutObjectCommand(uploadParams);
    return await client.send(command);
};

export const getFiles = async () =>{
    const command = new ListObjectsCommand({
        Bucket: AWS_BUCKET_NAME
    });
    return await client.send(command);
};

export const getFile = async (key) =>{
    const command = new GetObjectCommand({
        Bucket: AWS_BUCKET_NAME,
        Key: key
    });
    return await client.send(command);
};

export const downloadFile = async (filename) =>{
    const command = new GetObjectCommand({
        Bucket: AWS_BUCKET_NAME,
        Key: filename
    });
    const result = await client.send(command);
    console.log(result);
    result.Body.pipe(fs.createWriteStream(`./images/${filename}`))
};

export const getFileURL = async (filename) =>{
    const command = new GetObjectCommand({
        Bucket: AWS_BUCKET_NAME,
        Key: filename
    });
    return await getSignedUrl(client, command, { expiresIn: 3600 })
};
