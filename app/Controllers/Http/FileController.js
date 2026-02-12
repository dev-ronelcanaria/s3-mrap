'use strict'

const Env = use('Env')
const { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3')
const { SignatureV4a } = require('@aws-sdk/signature-v4a')
const { Sha256 } = require('@aws-crypto/sha256-js')
const fs = require('fs')

const bucket = Env.get('S3_BUCKET')
const isArn = bucket && bucket.startsWith('arn:aws:s3')
const region = isArn ? 'us-east-1' : Env.get('S3_REGION', 'us-east-1')
const useArnRegion = isArn ? true : String(Env.get('AWS_S3_USE_ARN_REGION', 'false')).toLowerCase() === 'true'

const credentials = {
  accessKeyId: Env.get('S3_KEY'),
  secretAccessKey: Env.get('S3_SECRET')
}

const s3 = new S3Client({
  region,
  credentials,
  useArnRegion,
  // signer: new SignatureV4a({
  //   credentials,
  //   region: '*',
  //   service: 's3',
  //   // sha256: Sha256
  // })
})

class FileController {

  async upload({ request, response }) {

    const file = request.file('file')

    const fileName = `${Date.now()}-${file.clientName}`

    if (!file || !file.tmpPath) {
      return response.status(400).send({ error: 'Invalid file upload' })
    }

    if (!fs.existsSync(file.tmpPath)) {
      return response.status(400).send({ error: 'Temporary upload file missing' })
    }

    console.log('Uploading file:', fileName)

    if (!bucket) {
      return response.status(500).send({ error: 'S3 bucket not configured' })
    }

    try {
      await s3.send(new PutObjectCommand({
        Bucket: bucket,
        Key: `uploads/${fileName}`,
        Body: fs.createReadStream(file.tmpPath)
      }))
      console.log('File uploaded successfully:', fileName)
    } catch (error) {
      console.log('Error uploading file:', error)
      return response.status(500).send({ error: error.message || 'Upload failed' })
    }

    return { fileName }
  }

  async update({ request, response }) {

    const file = request.file('file')
    const fileName = request.input('fileName')

    if (!file || !file.tmpPath) {
      return response.status(400).send({ error: 'Invalid file upload' })
    }

    if (!fs.existsSync(file.tmpPath)) {
      return response.status(400).send({ error: 'Temporary upload file missing' })
    }

    if (!bucket) {
      return response.status(500).send({ error: 'S3 bucket not configured' })
    }

    try {
      await s3.send(new PutObjectCommand({
        Bucket: bucket,
        Key: `uploads/${fileName}`,
        Body: fs.createReadStream(file.tmpPath)
      }))
    } catch (error) {
      return response.status(500).send({ error: error.message || 'Upload failed' })
    }

    return { updated: true }
  }

  async delete({ request, response }) {

    const fileName = request.input('fileName')

    if (!bucket) {
      return response.status(500).send({ error: 'S3 bucket not configured' })
    }

    try {
      await s3.send(new DeleteObjectCommand({
        Bucket: bucket,
        Key: `uploads/${fileName}`
      }))
    } catch (error) {
      return response.status(500).send({ error: error.message || 'Delete failed' })
    }

    return { deleted: true }
  }

  async download({ params, response }) {

    if (!bucket) {
      return response.status(500).send({ error: 'S3 bucket not configured' })
    }

    try {
      const result = await s3.send(new GetObjectCommand({
        Bucket: bucket,
        Key: `uploads/${params.file}`
      }))

      response.stream(result.Body)
    } catch (error) {
      return response.status(500).send({ error: error.message || 'Download failed' })
    }
  }
}

module.exports = FileController
