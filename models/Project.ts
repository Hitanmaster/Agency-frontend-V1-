import mongoose, { Document, Model } from 'mongoose';

export interface IProject extends Document {
  title: string;
  description: string;
  media_url: string;
  project_page_url: string;
}

const ProjectSchema = new mongoose.Schema<IProject>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  media_url: { type: String, required: true },
  project_page_url: { type: String, required: true },
});

export default mongoose.models.Project as Model<IProject> || mongoose.model<IProject>('Project', ProjectSchema);
