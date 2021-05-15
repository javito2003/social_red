const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");

aws.config.update({
  secretAccessKey: 'eXigb8+Fs3gW8ghvagYWj7OYS0R+LdBu8GLbCzYC',
  accessKeyId: 'AKIASYM2FV2Q2M52QCGW',
});

const s3 = new aws.S3();

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "socialred",
    acl: "public-read",
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      cb(null, Date.now().toString());
    },
  }),
});

console.log(upload);

module.exports = upload;
