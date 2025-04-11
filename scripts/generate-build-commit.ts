import fs from 'fs'
import path from 'path'

const commitSha = process.env.COMMIT_REF || '';

const envContent = `// This file is auto-generate at each build by scripts\\generate-build-commit.ts
export const GIT_COMMIT_SHA = "${commitSha}";
`;

fs.writeFileSync(path.join(__dirname, '../app/lib/git-commit.ts'), envContent, {
    encoding: 'utf8',
    flag: 'w',
});
console.log('Generated src/generated-env.ts with commit SHA.');