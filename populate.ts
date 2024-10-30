// we need to add sites to matches in manifest.json
import sites from './source/sites.json';
import manifest from  './source/manifest.json';
import fs from 'fs';

interface contentScript{
    matches: string[],
    css: string[],
    run_at: string
    js: string[]
}

(()=>{
    let newMatches: contentScript[] = []
    sites.sites.forEach(element => {
        const fileExists = fs.existsSync(`source/sites/${element.url}/style.css`);
        const styles = ['global.css']
        if (fileExists ) styles.push(`sites/${element.url}/style.css`)
        newMatches.push({
            matches:[`*://*.${element.url}/*`],
            css: styles,
            run_at: "document_end",
            js: ["script.js"]
        })
    });
    const newManifest = manifest
    newManifest.content_scripts = newMatches
    fs.writeFile('source/manifest.json', JSON.stringify(newManifest), (err) => {
        if (err) {
            console.log('Error writing file:', err);
        } else {
            console.log('Successfully wrote file');
        }
    });
})()