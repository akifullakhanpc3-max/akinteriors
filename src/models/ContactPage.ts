import mongoose, { Schema, Document } from 'mongoose';

export interface IBranch {
  name: string; phone: string; whatsapp: string; email: string;
  address: string; city: string; state: string; zip: string;
  workingHours: string; mapEmbed: string; lat: number; lng: number;
  isPrimary: boolean;
}

export interface IContactPage extends Document {
  heading: string; subtitle: string; branches: IBranch[];
  formEnabled: boolean; mapEnabled: boolean;
}

const BranchSchema = new Schema<IBranch>({
  name: { type: String, required: true },
  phone: String, whatsapp: String, email: String,
  address: String, city: String, state: String, zip: String,
  workingHours: String, mapEmbed: String,
  lat: { type: Number, default: 0 }, lng: { type: Number, default: 0 },
  isPrimary: { type: Boolean, default: false },
}, { _id: false });

const ContactPageSchema = new Schema<IContactPage>({
  heading: { type: String, default: 'Get In Touch' },
  subtitle: { type: String, default: "Let's create something beautiful together" },
  branches: { type: [BranchSchema], default: [
    { name: 'Bangalore Office', phone: '+91 99999 99999', whatsapp: '919999999999',
      email: 'info@akinteriors.com', address: '123 Design Street',
      city: 'Bangalore', state: 'Karnataka', zip: '560001',
      workingHours: 'Mon-Sat: 10:00 AM - 7:00 PM', mapEmbed: '',
      lat: 12.9716, lng: 77.5946, isPrimary: true },
  ]},
  formEnabled: { type: Boolean, default: true },
  mapEnabled: { type: Boolean, default: true },
}, { timestamps: true });

const ContactPage = mongoose.models.ContactPage || mongoose.model<IContactPage>('ContactPage', ContactPageSchema);
export default ContactPage;

export async function findOrCreateContactPage(): Promise<IContactPage> {
  const doc = await ContactPage.findOne();
  if (doc) return doc;
  return ContactPage.create({});
}
