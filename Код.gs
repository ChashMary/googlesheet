//глобальные переменные
let FOLDER_ID = '1j8ShvDv_7HjGoaARQJ7reQKcv_DuZs6A';
let SHEET_ID = '1QjIVd1ivqv61Agnx3M5AaE67ciupddm-h1BiWEAZBVM';

//вместо инициализации
function onInstall() { }

//сервеер
function doGet(e) {
  //возвращает страницу
  return HtmlService.createHtmlOutputFromFile('index').addMetaTag('viewport', 'width=device-width, initial-scale=1').setSandboxMode(HtmlService.SandboxMode.IFRAME);
}

//обработчик вызова сервера
function uploadFiles(form) {

  //используем try для выявления ошибок
  try {
    //берем нашу папку
    let folder = DriveApp.getFolderById(FOLDER_ID);
    let res = [];

    //сортировка полей по имени
    let form_keys = Object.keys(form).sort();

    for (let i = 0; i < form_keys.length; i++) {
      let key = form_keys[i];
      if (form[key] && form[key].getBlob) {
        if (form[key].length && form[key].contents) {
          //берем контент 
          let blob = form[key];
          //создаем  на Диске
          let file = folder.createFile(blob);
          file.setDescription('Uploaded by ' + form['name'] + ' ' + form['number']);
        }
      }
    }
    //делаем запись в Таблице в первом найденном листе 
    SpreadsheetApp.openById(SHEET_ID).getSheets()[0].appendRow([new Date(), form['name'], form['number']].concat(res));
    //ответ сервера
    
    return 'Данные переданы';
  } catch (e) {
    //обработаем любую ошибку как ответ сервера
    return e.toString();
  }
}
