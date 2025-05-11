import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/mongodb';
import Project, { IProject } from '../../models/Project';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IProject[]>
) {
  await dbConnect();

  const projects = await Project.find({});
  res.status(200).json(projects);
}
