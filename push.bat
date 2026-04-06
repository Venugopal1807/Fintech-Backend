@echo off
git init
git add package.json tsconfig.json .gitignore
git commit -m "chore: initial project configuration"
git add prisma/schema.prisma
git commit -m "feat: define database schema with Prisma"
git add src/lib/prisma.ts src/config/env.ts
git commit -m "feat: implement prisma singleton and env wrapper"
git add src/middlewares
git commit -m "feat: implement rbac and validation middlewares"
git add src/services src/routes
git commit -m "feat: implement auth and financial records logic"
git add .
git commit -m "docs: finalize readme and project polish"
git branch -M main
git remote add origin https://github.com/Venugopal1807/Zoyrvn_Assignment.git
git push -u origin main
