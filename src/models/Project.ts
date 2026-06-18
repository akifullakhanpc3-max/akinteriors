import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  title: string;
  slug: string;
  description: string;
  content: string;
  categories: Array<'Residential' | 'Commercial' | 'Kitchen' | 'Living Room' | 'Bedroom' | 'Office'>;
  status: 'draft' | 'published';
  featured: boolean;
  coverImage: string;
  images: string[];
  location?: string;
  area?: string;
  duration?: string;
  clientName?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  tags: string[];
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    content: {
      type: String,
      default: '',
    },
    categories: {
      type: [String],
      required: [true, 'At least one category is required'],
      validate: {
        validator: function (v: string[]) {
          return v.length > 0;
        },
        message: 'At least one category is required',
      },
      enum: ['Residential', 'Commercial', 'Kitchen', 'Living Room', 'Bedroom', 'Office'],
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    coverImage: {
      type: String,
      default: '',
    },
    images: {
      type: [String],
      default: [],
    },
    location: {
      type: String,
      trim: true,
    },
    area: {
      type: String,
      trim: true,
    },
    duration: {
      type: String,
      trim: true,
    },
    clientName: {
      type: String,
      trim: true,
    },
    metaTitle: {
      type: String,
      maxlength: [70, 'Meta title should not exceed 70 characters'],
    },
    metaDescription: {
      type: String,
      maxlength: [160, 'Meta description should not exceed 160 characters'],
    },
    metaKeywords: {
      type: [String],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
    },
    publishedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);


ProjectSchema.index({ status: 1, featured: 1 });
ProjectSchema.index({ categories: 1 });
ProjectSchema.index({ createdAt: -1 });

ProjectSchema.pre<IProject>('save', function () {
  if (this.isModified('title') || !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 200);
  }
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
});

const Project = mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
export default Project;
