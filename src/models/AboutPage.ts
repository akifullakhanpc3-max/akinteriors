import mongoose, { Schema, Document } from 'mongoose';

export interface IStatCard { icon: string; value: string; label: string; }
export interface IAchievement { title: string; description: string; icon: string; }
export interface ITimelineEvent { year: string; event: string; description: string; }

export interface IHighlight { icon: string; label: string; description: string; }

export interface IAboutPage extends Document {
  heading: string; subtitle: string; content: string;
  mission: string; vision: string; values: string[];
  image: string; stats: IStatCard[]; highlights: IHighlight[];
  achievements: IAchievement[]; timeline: ITimelineEvent[];
  valuesHeading: string; valuesSubtitle: string;
  timelineHeading: string; timelineSubtitle: string;
  layout: string; showTimeline: boolean; showValues: boolean;
}

const StatCardSchema = new Schema<IStatCard>({
  icon: String, value: String, label: String,
}, { _id: false });

const AchievementSchema = new Schema<IAchievement>({
  title: String, description: String, icon: String,
}, { _id: false });

const TimelineEventSchema = new Schema<ITimelineEvent>({
  year: String, event: String, description: String,
}, { _id: false });

const HighlightSchema = new Schema<IHighlight>({
  icon: String, label: String, description: String,
}, { _id: false });

const AboutPageSchema = new Schema<IAboutPage>({
  heading: { type: String, default: 'Crafting Dreams Into Reality' },
  subtitle: { type: String, default: 'Discover our story' },
  content: { type: String, default: '' },
  mission: { type: String, default: '' },
  vision: { type: String, default: '' },
  values: { type: [String], default: [] },
  image: { type: String, default: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=700&q=60' },
  stats: { type: [StatCardSchema], default: [
    { icon: 'Award', value: '500+', label: 'Projects Completed' },
    { icon: 'Users', value: '300+', label: 'Happy Clients' },
    { icon: 'Clock', value: '15+', label: 'Years Experience' },
    { icon: 'Star', value: '25+', label: 'Design Experts' },
  ]},
  highlights: { type: [HighlightSchema], default: [
    { icon: 'Award', label: 'Excellence', description: 'We strive for perfection in every project.' },
    { icon: 'Target', label: 'Innovation', description: 'We embrace new ideas and technologies.' },
    { icon: 'Users', label: 'Collaboration', description: 'We work closely with clients.' },
    { icon: 'Eye', label: 'Integrity', description: 'We maintain transparency and honesty.' },
  ]},
  achievements: { type: [AchievementSchema], default: [] },
  timeline: { type: [TimelineEventSchema], default: [
    { year: '2009', event: 'AkInteriors founded in Bangalore', description: '' },
    { year: '2012', event: 'Completed first 100 projects', description: '' },
    { year: '2015', event: 'Expanded to commercial interiors', description: '' },
    { year: '2018', event: 'Opened second studio in Mumbai', description: '' },
    { year: '2021', event: 'Recognized as top design firm', description: '' },
    { year: '2024', event: '500+ projects milestone achieved', description: '' },
  ]},
  valuesHeading: { type: String, default: 'Our Values' },
  valuesSubtitle: { type: String, default: 'What We Stand For' },
  timelineHeading: { type: String, default: 'Our Journey' },
  timelineSubtitle: { type: String, default: 'Milestones & Achievements' },
  layout: { type: String, default: 'default' },
  showTimeline: { type: Boolean, default: true },
  showValues: { type: Boolean, default: true },
}, { timestamps: true });

const AboutPage = mongoose.models.AboutPage || mongoose.model<IAboutPage>('AboutPage', AboutPageSchema);
export default AboutPage;

export async function findOrCreateAboutPage(): Promise<IAboutPage> {
  const doc = await AboutPage.findOne();
  if (doc) return doc;
  return AboutPage.create({});
}
