# S3 MRAP (AdonisJS)

Minimal AdonisJS 4.1 service for uploading, updating, deleting, and downloading files from Amazon S3 (including Multi-Region Access Points).

## Features

- Upload files to S3
- Replace existing files
- Delete files
- Stream downloads from S3
- Supports S3 bucket names and MRAP ARNs

## Requirements

- Node.js 14+
- AWS credentials with S3 permissions

## Setup

Install dependencies:

```bash
npm install
```

Create a .env file (or set environment variables) with the following values:

```bash
HOST=127.0.0.1
PORT=3333
APP_URL=http://127.0.0.1:3333

S3_BUCKET=your-bucket-name-or-mrap-arn
S3_REGION=us-east-1
AWS_S3_USE_ARN_REGION=false
S3_KEY=your-access-key-id
S3_SECRET=your-secret-access-key
```

Start the server:

```bash
npm start
```

## API

All objects are stored under the uploads/ prefix in your S3 bucket.

### Upload

POST /files/upload

Form-data:
- file: file upload

Response:
{ "fileName": "<stored-name>" }

### Update (replace)

PUT /files/update

Form-data:
- file: file upload
- fileName: existing stored name

Response:
{ "updated": true }

### Delete

DELETE /files/delete

Body (JSON or form-encoded):
- fileName: existing stored name

Response:
{ "deleted": true }

### Download

GET /files/:file

Streams the file from S3.

## Notes

- For MRAP ARNs, set S3_BUCKET to the ARN and optionally set AWS_S3_USE_ARN_REGION=true.
- Ensure your IAM user/role has s3:PutObject, s3:GetObject, and s3:DeleteObject for the target bucket or MRAP.
