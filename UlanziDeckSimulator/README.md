# Simulador UlanziDeck

<p align="start">
   <strong>Português (BR)</strong> | <a href="README.en.md">English</a> | <a href="README.zh.md">简体中文</a> 
</p>


## Introdução
O Simulador UlanziDeck é usado para simular a comunicação entre o aplicativo UlanziDeck e plugins. Desenvolvedores podem testar funcionalidades de plugins neste simulador. Este simulador é voltado principalmente para facilitar desenvolvimento e depuração; para resultados finais, confira o software de desktop.

## Execução

```
npm install
npm start
```

## Instruções
 <ol>
  <li>Antes de começar a desenvolver plugins, visite <a href="https://github.com/UlanziTechnology/UlanziDeckPlugin-SDK" target="_blank">Plugin Development SDK</a> e <a href="https://cloud.tencent.com/developer/article/2461403" target="_blank">Do zero: Jornada de desenvolvimento de plugins UlanziDeck</a> para entender instruções e orientações.</li>
  <li>Para testar plugins, preencha o arquivo <code>manifest.json</code> conforme o protocolo e coloque-o no diretório <strong>UlanziDeckSimulator/plugins</strong>. O simulador irá analisar automaticamente o plugin e exibi-lo na lista à esquerda. Para atualizar um plugin, clique em <strong>Atualizar lista de plugins</strong> para recarregar o simulador.</li>
  <li>Nesta versão, o serviço principal precisa ser iniciado manualmente pelo desenvolvedor; siga as instruções para iniciar o serviço principal antes de prosseguir.</li>
  <li>Ordem de depuração: iniciar o simulador do computador host -> confirmar que o serviço principal do plugin está conectado -> arrastar o teclado e depurar a action.</li>
  <li>O simulador não suporta certos eventos especiais do host: <code>openview</code>, <code>selectdialog</code>. Se o plugin abrir uma janela ou selecionar uma pasta, teste no host real.</li>
  <li>O simulador atualmente não muda de página automaticamente e não envia <code>setactive</code> por conta própria; para testar esse evento, clique com o botão direito e envie manualmente.</li>
  <li>Por padrão, não carregamos actions automaticamente; isso permite que o desenvolvedor execute a página da action para depuração. Ativar o carregamento de actions pode causar conflito de websocket com a página da action aberta pelo desenvolvedor e afetar os testes.</li>
</ol>

## Funcionalidades

1. Simulador UlanziDeck, porta padrão 39069
2. Após iniciar com sucesso, abra http://127.0.0.1:39069 no navegador
3. Siga as instruções do simulador para testes

