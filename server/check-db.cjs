const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/al-profile-blog';

const workspaceSchema = new mongoose.Schema({
  id: String,
  name: String,
});
const projectSchema = new mongoose.Schema({
  id: String,
  status: String,
  value: Number,
});

const Workspace = mongoose.model('Workspace', workspaceSchema);
const Project = mongoose.model('Project', projectSchema);

mongoose.connect(MONGODB_URI)
  .then(async () => {
    const workspaces = await Workspace.find();
    const projects = await Project.find();
    console.log('Workspaces found:', workspaces.length);
    workspaces.forEach(ws => console.log(`- ${ws.name} (${ws.id})`));
    console.log('Projects found:', projects.length);
    projects.forEach(p => console.log(`- ${p.id}: ${p.status} (R$ ${p.value})`));
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
