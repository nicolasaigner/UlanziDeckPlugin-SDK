import fs from 'fs';
import path from 'path';
import EventEmitter from 'events';
import utils from './utils.js';

class PluginMenu extends EventEmitter {
  constructor(){
    super();

    this.plugins = {}
    this.getList()
  }

  getList(){
    
      try {

        this.plugins = {}
        // Define o caminho da pasta plugins
        const pluginsDir = utils.getRootPath()+'/plugins';

        // Lê sincronamente todas as subpastas da pasta plugins
        const files = fs.readdirSync(pluginsDir);

        // Itera por todas as subpastas
        files.forEach(file => {
            const filePath = path.join(pluginsDir, file);

            // Verifica sincronicamente se é uma pasta e se termina com 'ulanziPlugin'
            const stats = fs.statSync(filePath);
            if (stats.isDirectory() && file.endsWith('ulanziPlugin')) {
              // console.log('===file',file)
                // Constroi o caminho completo para o manifest.json
                const manifestPath = path.join(filePath, 'manifest.json');

                // Lê sincronamente o arquivo manifest.json
                const data = fs.readFileSync(manifestPath, 'utf8');

                // Analisa os dados JSON
                const manifest = JSON.parse(data);

                try{

                  const languages = ['en', 'zh_CN', 'ja_JP', 'de_DE','zh_HK']
                  languages.forEach(language => {
                    const data = this.getLocalization(filePath, language);
                    if(data) manifest[language+'_DATA'] = data;
                  })
                  
                }catch(err){
                  console.log('===get zh err',err)
                }

                this.plugins[file] = manifest;
            }
        });
        // console.log('===plugins',this.plugins)
        this.emit('listUpdated', this.plugins)
      } catch (err) {
        console.error('An error occurred:', err);
      }
  }


  getLocalization(filePath,language){
    try{
      const trPath = path.join(filePath, language + '.json');
      const trData = fs.readFileSync(trPath, 'utf8');
      return JSON.parse(trData);
      
    }catch(err){ 
      console.log(`===get ${language} err:${err}`)
      return null
    }
  }



}

const menu = new PluginMenu();
export default menu;