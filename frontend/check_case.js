import fs from 'fs';
import path from 'path';

function checkImports(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== 'dist') {
        checkImports(fullPath);
      }
    } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const importRegex = /import\s+.*?from\s+['"]([^'"]+)['"]/g;
      let match;
      while ((match = importRegex.exec(content)) !== null) {
        const importPath = match[1];
        if (importPath.startsWith('.')) {
          let resolvedPath = path.resolve(dir, importPath);
          let basename = path.basename(resolvedPath);
          let parentDir = path.dirname(resolvedPath);
          
          try {
            if (fs.existsSync(parentDir)) {
               const actualFiles = fs.readdirSync(parentDir);
               // Check if the basename exists exactly
               const exactMatch = actualFiles.find(f => f === basename || f.replace(/\.(js|jsx|ts|tsx|css|svg|png|jpg|webp)$/, '') === basename.replace(/\.(js|jsx|ts|tsx|css|svg|png|jpg|webp)$/, ''));
               if (!exactMatch) {
                  // check case insensitive
                  const lowerMatch = actualFiles.find(f => f.toLowerCase() === basename.toLowerCase() || f.toLowerCase().replace(/\.(js|jsx|ts|tsx|css|svg|png|jpg|webp)$/, '') === basename.toLowerCase().replace(/\.(js|jsx|ts|tsx|css|svg|png|jpg|webp)$/, ''));
                  if (lowerMatch) {
                     console.log(`CASE SENSITIVITY ERROR in ${fullPath}: imports '${importPath}' but file is '${lowerMatch}'`);
                  }
               }
            }
          } catch (e) {
            // ignore
          }
        }
      }
    }
  }
}

checkImports(path.join(process.cwd(), 'src'));
console.log('Check complete.');
