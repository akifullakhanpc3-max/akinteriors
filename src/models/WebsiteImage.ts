import mongoose, { Schema, Document } from 'mongoose';

export interface IWebsiteImage extends Document {
  title: string;
  slug: string;
  category: string;
  section: string;
  altText: string;
  imageUrl: string;
  thumbnailUrl?: string;
  imageType: string;
  fileSize?: number;
  dimensions?: { width: number; height: number };
  displayOrder: number;
  isActive: boolean;
  isBranding: boolean;
  uploadedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const WebsiteImageSchema = new Schema<IWebsiteImage>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'hero', 'about', 'services', 'projects',
        'testimonials', 'team', 'blog', 'contact',
        'footer', 'branding',
      ],
    },
    section: {
      type: String,
      required: [true, 'Section is required'],
      trim: true,
    },
    altText: {
      type: String,
      default: '',
      maxlength: [300, 'Alt text cannot exceed 300 characters'],
    },
    imageUrl: {
      type: String,
      required: [true, 'Image URL is required'],
    },
    thumbnailUrl: {
      type: String,
    },
    imageType: {
      type: String,
      enum: ['webp', 'png', 'jpg', 'jpeg', 'svg', 'gif'],
      default: 'webp',
    },
    fileSize: {
      type: Number,
    },
    dimensions: {
      width: { type: Number },
      height: { type: Number },
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isBranding: {
      type: Boolean,
      default: false,
    },
    uploadedBy: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

WebsiteImageSchema.index({ category: 1, section: 1 });
WebsiteImageSchema.index({ isActive: 1, displayOrder: 1 });
WebsiteImageSchema.index({ isBranding: 1 });

WebsiteImageSchema.pre<IWebsiteImage>('save', function () {
  if (!this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 200);
  }
});

const WebsiteImage = mongoose.models.WebsiteImage || mongoose.model<IWebsiteImage>('WebsiteImage', WebsiteImageSchema);
export default WebsiteImage;
