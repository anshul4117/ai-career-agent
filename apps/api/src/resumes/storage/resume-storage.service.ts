import { Injectable, Logger } from "@nestjs/common";
import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";

export interface StoredFileResult {
  fileUrl: string;
  storageKey: string;
  originalFileName: string;
  fileSize: number;
}

@Injectable()
export class ResumeStorageService {
  private readonly logger = new Logger(ResumeStorageService.name);
  private readonly uploadBaseDir: string;
  private readonly isCloudinaryConfigured: boolean;

  constructor() {
    this.uploadBaseDir = path.resolve(process.cwd(), "uploads", "resumes");
    this.ensureUploadDir();

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (cloudName && apiKey && apiSecret) {
      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
        secure: true,
      });
      this.isCloudinaryConfigured = true;
      this.logger.log("Cloudinary storage provider initialized successfully");
    } else if (process.env.CLOUDINARY_URL) {
      cloudinary.config({
        secure: true,
      });
      this.isCloudinaryConfigured = true;
      this.logger.log(
        "Cloudinary storage provider initialized via CLOUDINARY_URL",
      );
    } else {
      this.isCloudinaryConfigured = false;
      this.logger.warn(
        "Cloudinary environment variables not set. Using local disk storage fallback. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in .env for production Cloudinary uploads.",
      );
    }
  }

  private ensureUploadDir(): void {
    try {
      if (!fs.existsSync(this.uploadBaseDir)) {
        fs.mkdirSync(this.uploadBaseDir, { recursive: true });
      }
    } catch (err) {
      this.logger.error("Failed to initialize resumes upload directory", err);
    }
  }

  /**
   * Store uploaded buffer to Cloudinary (or local fallback).
   */
  async saveFile(
    userId: string,
    file: Express.Multer.File,
  ): Promise<StoredFileResult> {
    if (this.isCloudinaryConfigured) {
      return this.uploadToCloudinary(userId, file);
    }
    return this.saveToLocal(userId, file);
  }

  private async uploadToCloudinary(
    userId: string,
    file: Express.Multer.File,
  ): Promise<StoredFileResult> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "auto",
          folder: `ai-career-agent/resumes/${userId}`,
          use_filename: true,
          unique_filename: true,
        },
        (error, result: UploadApiResponse | undefined) => {
          if (error || !result) {
            this.logger.error(
              "Cloudinary upload failed, falling back to local disk",
              error,
            );
            return this.saveToLocal(userId, file).then(resolve).catch(reject);
          }

          resolve({
            fileUrl: result.secure_url,
            storageKey: result.public_id,
            originalFileName: file.originalname,
            fileSize: result.bytes || file.size,
          });
        },
      );

      uploadStream.end(file.buffer);
    });
  }

  private async saveToLocal(
    userId: string,
    file: Express.Multer.File,
  ): Promise<StoredFileResult> {
    const userDir = path.join(this.uploadBaseDir, userId);
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }

    const ext = path.extname(file.originalname).toLowerCase() || ".pdf";
    const uniqueKey = `${crypto.randomUUID()}${ext}`;
    const destinationPath = path.join(userDir, uniqueKey);

    await fs.promises.writeFile(destinationPath, file.buffer);

    const storageKey = path.join(userId, uniqueKey);
    const fileUrl = `/api/v1/resumes/files/${storageKey}`;

    return {
      fileUrl,
      storageKey,
      originalFileName: file.originalname,
      fileSize: file.size,
    };
  }

  /**
   * Retrieve file path and check existence (for local files).
   */
  getFilePath(storageKey: string): string | null {
    const safeKey = path.normalize(storageKey).replace(/^(\.\.(\/|\\|$))+/, "");
    const absolutePath = path.join(this.uploadBaseDir, safeKey);

    if (!absolutePath.startsWith(this.uploadBaseDir)) {
      return null;
    }

    if (!fs.existsSync(absolutePath)) {
      return null;
    }

    return absolutePath;
  }

  /**
   * Delete a stored file from Cloudinary or local storage.
   */
  async deleteFile(storageKey: string): Promise<void> {
    if (
      this.isCloudinaryConfigured &&
      (storageKey.includes("/") || !storageKey.includes("."))
    ) {
      try {
        await cloudinary.uploader.destroy(storageKey, { resource_type: "raw" });
        return;
      } catch (err) {
        this.logger.warn(
          `Failed to delete Cloudinary asset ${storageKey}`,
          err,
        );
      }
    }

    const filePath = this.getFilePath(storageKey);
    if (filePath && fs.existsSync(filePath)) {
      try {
        await fs.promises.unlink(filePath);
      } catch (err) {
        this.logger.warn(`Failed to delete physical file ${storageKey}`, err);
      }
    }
  }
}
