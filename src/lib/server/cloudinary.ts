import { v2 as cloudinary } from 'cloudinary';
import { env } from '$env/dynamic/private';

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export interface UploadResult {
  url: string;
  publicId: string;
  secureUrl: string;
  width: number;
  height: number;
}

export async function uploadImage(
  file: File,
  folder: string = 'vouali'
): Promise<UploadResult> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const result = await new Promise<any>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (err, res) => { if (err) reject(err); else resolve(res); }
    );
    stream.end(buffer);
  });
  return {
    url: result.secure_url,
    publicId: result.public_id,
    secureUrl: result.secure_url,
    width: result.width,
    height: result.height,
  };
}

export async function uploadFromUrl(
  url: string,
  folder: string = 'vouali',
  publicId?: string
): Promise<UploadResult> {
  const options: any = { folder, resource_type: 'image' };
  if (publicId) options.public_id = publicId;
  const result = await cloudinary.uploader.upload(url, options);
  return {
    url: result.secure_url, publicId: result.public_id,
    secureUrl: result.secure_url, width: result.width, height: result.height,
  };
}

export async function deleteImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}

export { cloudinary };
