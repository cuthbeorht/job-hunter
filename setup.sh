#!/bin/bash

set -e

echo "🚀 Creating project structure..."

# Root folders
mkdir -p backend/src/{controllers,routes,middleware,services,db,types}

cd backend

echo "📦 Initializing npm..."
npm init -y

echo "📥 Installing dependencies..."
npm install express bcrypt jsonwebtoken pg cors dotenv

echo "📥 Installing dev dependencies..."
npm install -D typescript ts-node-dev @types/node @types/express @types/jsonwebtoken @types/bcrypt

echo "⚙️ Initializing TypeScript..."
npx tsc --init

echo "🛠 Updating tsconfig.json..."

cat > tsconfig.json <<EOL
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "rootDir": "./src",
    "outDir": "./dist",
    "esModuleInterop": true,
    "strict": true
  }
}
EOL

echo "🔐 Creating .env file..."

cat > .env <<EOL
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/jobtrackr
JWT_SECRET=supersecret
EOL

echo "🧾 Creating .gitignore..."

cat > .gitignore <<EOL
node_modules
dist
.env
EOL

echo "📄 Creating basic app.ts..."

cat > src/app.ts <<EOL
import 'dotenv/config';
import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
  res.send('API is running');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});
EOL

echo "📜 Updating package.json scripts..."

node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json'));
pkg.scripts = {
  dev: 'ts-node-dev --respawn --transpile-only src/app.ts'
};
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
"

echo "✅ Setup complete!"
echo "👉 Run: cd backend && npm run dev"