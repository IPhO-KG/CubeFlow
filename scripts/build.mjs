import {cp,mkdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
await mkdir(root+'dist',{recursive:true});
for(const name of ['index.html','assets','.nojekyll'])await cp(root+name,root+'dist/'+name,{recursive:true});
console.log('Built dist/ — static, no external runtime dependencies.');
