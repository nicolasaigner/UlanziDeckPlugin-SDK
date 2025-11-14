class UlanziUtils {

  	/**
   * Obtém o diretório raiz
   */
	getRootPath(){
		const currentFilePath = process.argv[1];
    let split_tag = '/'
    if(currentFilePath.indexOf('\\') > -1){
      split_tag = '\\'
    }
    const pathArr = currentFilePath.split(split_tag);
    const idx = pathArr.findIndex(f => f.endsWith('UlanziDeckSimulator'));
    const __folderpath = `${pathArr.slice(0, idx + 1).join("/")}`;
	
		return __folderpath;
	
	}

  time(){
    return new Date().toLocaleString('pt-BR', {hour12: false})
  }

  /**
   * Cria uma chave única (context)
  */
  encodeContext(jsn) {
    return jsn.uuid + '___' + jsn.key + '___' + jsn.actionid
  }

  /**
   * Desconstrói a chave única (context)
  */
  decodeContext(context) {
    const de_ctx = context.split('___')
    return {
      uuid: de_ctx[0],
      key: de_ctx[1],
      actionid: de_ctx[2]
    }
  }

  /**
	   * Otimização do JSON.parse
	 * parse json
	 * @param {string} jsonString
	 * @returns {object} json
	*/
	parseJson(jsonString) {
		if (typeof jsonString === 'object') return jsonString;
		try {
			const o = JSON.parse(jsonString);
			if (o && typeof o === 'object') {
				return o;
			}
		} catch (e) { }

		return false;
	}

}


const utils = new UlanziUtils();
export default utils;