#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const TEMPLATES_DIR = path.join(__dirname, '..', 'templates');

function copyTemplate(templateName, targetPath) {
  const templatePath = path.join(TEMPLATES_DIR, templateName);
  const content = fs.readFileSync(templatePath, 'utf8');
  
  // Create directory if it doesn't exist
  const dir = path.dirname(targetPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.writeFileSync(targetPath, content);
  console.log(`✓ Created ${targetPath}`);
}

function init() {
  console.log('🚀 Initializing Agent Swarm Development structure...\n');
  
  const cwd = process.cwd();
  
  // Create directory structure
  const dirs = [
    'docs/domains',
    'docs/decisions',
    'docs/designs',
    'plans/active',
    'plans/completed',
    'plans/debt',
  ];
  
  dirs.forEach(dir => {
    const fullPath = path.join(cwd, dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
      console.log(`✓ Created directory: ${dir}/`);
    }
  });
  
  console.log('');
  
  // Copy templates
  const templates = [
    { src: 'AGENTS.md', dest: 'AGENTS.md' },
    { src: 'architecture.md', dest: 'docs/architecture.md' },
    { src: 'principles.md', dest: 'docs/principles.md' },
  ];
  
  templates.forEach(({ src, dest }) => {
    const targetPath = path.join(cwd, dest);
    if (!fs.existsSync(targetPath)) {
      copyTemplate(src, targetPath);
    } else {
      console.log(`⊘ Skipped ${dest} (already exists)`);
    }
  });
  
  // Create placeholder files
  const placeholders = [
    { path: 'docs/quality.md', content: '# Documentation Quality\n\nTODO: Add quality metrics\n' },
    { path: 'docs/api.md', content: '# API Documentation\n\nTODO: Document API endpoints\n' },
    { path: 'plans/active/.gitkeep', content: '' },
  ];
  
  console.log('');
  
  placeholders.forEach(({ path: filePath, content }) => {
    const fullPath = path.join(cwd, filePath);
    if (!fs.existsSync(fullPath)) {
      fs.writeFileSync(fullPath, content);
      console.log(`✓ Created ${filePath}`);
    }
  });
  
  console.log('\n✅ Agent Swarm Development structure initialized!\n');
  console.log('Next steps:');
  console.log('1. Edit docs/architecture.md to describe your system');
  console.log('2. Edit docs/principles.md to define your golden rules');
  console.log('3. Create your first execution plan in plans/active/');
  console.log('4. Spawn your first agent!\n');
  console.log('See AGENTS.md for agent role descriptions.\n');
}

// Run if called directly
if (require.main === module) {
  init();
}

module.exports = { init };
