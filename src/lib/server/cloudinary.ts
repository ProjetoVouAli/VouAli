import { v2 as cloudinary } from 'cloudinary';
import { env } from '$env/dynamic/private';

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export interface CloudinaryResult {
  url: string;
  publicId: string;
}

export async function uploadImage(file: File, folder = 'vouali'): Promise<CloudinaryResult> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const result = await new Promise<any>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder, resource_type: 'image' }, (err, res) => {
      if (err) reject(err);
      else resolve(res);
    });
    stream.end(buffer);
  });
  return { url: result.secure_url, publicId: result.public_id };
}

export async function deleteImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}
