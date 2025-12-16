import {
  S3Client,
  CreateBucketCommand,
  PutBucketPolicyCommand,
  HeadBucketCommand,
} from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  endpoint: process.env.MINIO_ENDPOINT || "http://localhost:9000",
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY || "minioadmin",
    secretAccessKey: process.env.MINIO_SECRET_KEY || "minioadmin123",
  },
  forcePathStyle: true,
});

const BUCKETS = [
  process.env.MINIO_BUCKET_GAME_IMAGES || "game-images",
  process.env.MINIO_BUCKET_SCENES_WEBGL || "game-scenes-webgl",
  process.env.MINIO_BUCKET_SCENE_FILES || "game-scene-files",
];

async function bucketExists(bucketName: string): Promise<boolean> {
  try {
    await s3Client.send(new HeadBucketCommand({ Bucket: bucketName }));
    return true;
  } catch {
    return false;
  }
}

async function createBucket(bucketName: string, isPublic = true) {
  const exists = await bucketExists(bucketName);
  if (exists) {
    console.log(`Bucket "${bucketName}" already exists`);
    return;
  }

  await s3Client.send(new CreateBucketCommand({ Bucket: bucketName }));
  console.log(`Created bucket: ${bucketName}`);

  if (isPublic) {
    const policy = {
      Version: "2012-10-17",
      Statement: [
        {
          Effect: "Allow",
          Principal: "*",
          Action: ["s3:GetObject"],
          Resource: [`arn:aws:s3:::${bucketName}/*`],
        },
      ],
    };

    await s3Client.send(
      new PutBucketPolicyCommand({
        Bucket: bucketName,
        Policy: JSON.stringify(policy),
      })
    );
    console.log(`Set public read policy for bucket: ${bucketName}`);
  }
}

async function main() {
  console.log("Initializing MinIO buckets...");
  console.log(`Endpoint: ${process.env.MINIO_ENDPOINT || "http://localhost:9000"}`);
  console.log("");

  for (const bucket of BUCKETS) {
    try {
      await createBucket(bucket, true);
    } catch (error) {
      console.error(`Failed to create bucket "${bucket}":`, error);
    }
  }

  console.log("");
  console.log("All buckets initialized!");
}

main().catch((err) => {
  console.error("Bucket initialization failed:", err);
  process.exit(1);
});
