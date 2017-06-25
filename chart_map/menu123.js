//****************************************************
// 人口動態時系列データ2017年版 付属DVD用 メニュー制御
//  2016.11.17 1.0 厚生労働統計協会
//
// l1,l2,l3メニューの初期設定、および再選択されたときの処理
//
// 関数 initMenu()**************************************
//  引数： 無し
//  動作： グローバル変数(*)を参照し、メニューファイルを読み込み、
//         L1L2L3メニューを初期化する
//  呼び出し元：初期化時、および、表示するICDバージョン変更時

// (*)参照・更新するグローバル変数
//    menuDir:    メニューファイルのディレクトリ
//    l1menuArea: l1メニューファイルを読み込むエリア
//    l2menuArea: l2メニューファイルを読み込むエリア
//    l3menuArea: l3メニューファイルを読み込むエリア
//
//    codWcode：  現在の死因作業コード
//    codName：   現在の死因分類名
//
//    l1menu:     l1メニューの要素ID（htmlで定義）
//    l1code：    現在のl1コード
//    l1name：    現在のl1名称
//    l1code0：   総数を示す作業コード
//
//    l2menu:     l2メニューの要素ID（htmlで定義）
//    l2code：    現在のl2コード
//    l2name：    現在のl2名称
//    l2code0：   章を示す作業コード
//
//    l3menu:     l3メニューの要素ID（htmlで定義）
//    l3code：    現在のl3コード
//    l3name：    現在のl3名称
//    l3code0：   中間分類コードを示す作業コード
//
//    dCountDir:  死亡数ファイルのディレクトリ
//    fChar：     読み込むデータのファイルコード
//    gender:     読み込むデータの性別
//    dCount:     読み込んだデータを格納する領域
//    fCharInit:  ファイルコードの初期値（01またはA）
function initMenu(){
// 死因分類ファイルを読み込み、階層1,2,3メニューを作成する
//   (1)l1menu.csvを読み込み、章メニューを設定する
// 20170224 2017DVD基本分類の場合、ICD版毎のディレクトリ

  console.log("initMenu called:");
  
// 死因コード等を初期化する

  fChar = fCharInit;
  codWCode = 0;
  codName ="";
  
  l1code = 0;
  l1name = "";
  l1code0 = 0;
  
  l2code = 0;
  l2name = "";
  l2code0 = 0;

  l3code = 0;
  l3name = "";
  l3code0 = 0;
  
  gender = "T";
  genderName = "合計";
  
  type = "0";
  typeName = "死亡数 総数";
  
// l2l3メニューを初期化する
// l1も」初期化（20170306）
  
  $('select#l1menu option').remove();
  $('select#l2menu option').remove();
  $('select#l3menu option').remove();
  
  
// メニューファイルを読み込む
  fName = menuDir + "l1menu.csv";
  fRead(fName,initMenu2);
};

function initMenu2(lines_got){
  var i,cols,key;
  console.log("initMenu2 called:"+lines_got.length);
//console.log(lines_got);
//

  for (var i=1; i<(lines_got.length); i++){
// 20170124
//  cols = lines_got[i].split(";");
    cols = lines_got[i].split(",");
    l1menuArea[i-1] = {"layer":cols[0],"text":cols[1],
                       "value":cols[2],"upLink":cols[3],
                       "fChar":cols[4]};
    console.log(l1menuArea[i-1]);
    
    // セレクトボックスを設定する
    // colsの内容は、メニュー階層、値、テキスト、上位メニュー作業コード、ファイル文字
    $(function(){
      var $option = '<option value ="' + cols[2] + '">' + cols[1] + '</option>';
//    console.log($option);
      $('#l1menu').append($option);
    });
  };
  l1code0 = l1menuArea[0]["value"];
  codWCode = l1menuArea[0]["value"];
  codName = l1menuArea[0]["text"];
  
//  (2)l2menu.csvを読み込み、内容をl2maenuAreaに保持する
// 20170124
  fName = menuDir + "l2menu.csv";
  fRead(fName,initMenu3);
}

function initMenu3(lines_got){
  var i,cols;
  console.log("initMenu3 called:"+lines_got.length);
  for (var i=1; i<(lines_got.length); i++){
// 20170124
//  cols = lines_got[i].split(";");
    cols = lines_got[i].split(",");
    l2menuArea[i-1] = {"layer":cols[0],"text":cols[1],
                       "value":cols[2],"upLink":cols[3],
                       "fChar":cols[4]};
//  console.log(l2menuArea[i-1]);
  };
// (2-3)l3menu.csvを読み込み、内容をl3maenuAreaに保持する
// 20170124
  fName = menuDir + "l3menu.csv";
  fRead(fName,initMenu4);
}

function initMenu4(lines_got){
  var i,cols;
  console.log("initMenu4 called:"+lines_got.length);
  for (var i=1; i<(lines_got.length); i++){
// 20170124
//  cols = lines_got[i].split(";");
    cols = lines_got[i].split(",");
    l3menuArea[i-1] = {"layer":cols[0],"text":cols[1],
                       "value":cols[2],"upLink":cols[3],
                       "fChar":cols[4]};
  };
//  (3)初期チャート用のデータを呼び出す
//      
  $('#l1menu').val(l1code0);
  var fName = dCountDir + fChar + gender + ".csv";
  fRead(fName, initMenu5);
};

function initMenu5(lines_got){
  var i,cols;
  dCount = [];
  console.log("initMenu5 called:"+lines_got.length);
  for (var i=1; i<(lines_got.length); i++){
    cols = lines_got[i].split(",");
    dCount[i-1] = cols;
  };
  sChartDisp();
};

// 選択要素が再選択されたときの関数 *******************************
//   
// (1)l1メニュー: 
//     共通：                       ・ l2menu、l3menuを初期化する
//                                  ・ 選択肢のファイルコードが現状値fCharと異なる場合、死亡統計ファイルを読み込む
//     総数行の場合（選択値=先頭行）・ sDispChartを呼び出す
//                                  
//     章の行の場合（選択値!=先頭行）・章に対応するl2menuを作成し、l2menu選択イベントを起こす
//
// (2)l2メニュー
//     共通：                         ・ l3menuを初期化する
//                                    ・ 選択肢のファイルコードが現状値fCharと異なる場合、死亡統計ファイルを読み込む
//     章の行の場合（選択値=先頭行）: ・  sDispChartを呼び出す
//
//     死因分類グループの行の場合（選択値!=先頭行）： 死亡分類グループに対応するl3menuを作成し、
//                                                    l3menu選択イベントを発生する
//
// (3)l3メニュー： sDispChartを呼び出す

//***
// 共通関数
function getFCharNew(code, area){
  console.log("getFCharNew called", fChar,code);
  for (var i = 0; i<area.length; i++){
    if (area[i].value == code){
      fCharNew = area[i].fChar;
      break;
    }
  }
  console.log("fCharNew", fCharNew)
  return(fCharNew)
};

//***
// (1)l1メニュー: 
//     共通：                       ・ l2menu、l3menuを初期化する
//                                  ・ 選択肢のファイルコードが現状値fCharと異なる場合、死亡統計ファイルを読み込む
//     総数行の場合（選択値=先頭行）・ sDispChartを呼び出す
//                                  
//     章の行の場合（選択値!=先頭行）・章に対応するl2menuを作成し、l2menu選択イベントを起こす
//
$('#l1menu').change(function(){
  console.log("l1menu changed called");
  
  // 選択されたコードを名前を保存する
  l1name = $('#l1menu  option:selected').text();
  console.log("l1name",l1name);
  l1code = $('#l1menu  option:selected').val();
  console.log("l1code",l1code);
  
  //l2menu、l3menuを初期化する
  $('select#l2menu option').remove();
  $('select#l3menu option').remove();
  
  // 章の行の場合、l2menuの先頭行の作業コードをl2code0に保持し、
  // 読み込み済みのl2メニュー行を一行ずつ調べ、l2メニューを再設定する
  if (l1code != l1code0){
    l2code0 = l1code;
    for (j=0; j<l2menuArea.length; j++){
      // upLinkがl1メニューで設定された作業コードなら、l2メニューに追加
      if (l2menuArea[j].upLink == l1code){
        $(function(){
        var $option = '<option value ="' + l2menuArea[j].value + '">' + l2menuArea[j].text + '</option>';
//      console.log($option);
        $('#l2menu').append($option);
        });
      };
    };
  };
  
  //死亡統計ファイルを読み込む必要があるか調べ、必要なら読み込む
  var fCharNew = getFCharNew(l1code, l1menuArea);
  if (fCharNew != fChar){
    fChar = fCharNew;
    var fName = dCountDir + fChar + gender + ".csv";
    fRead(fName,l1menu2);
  } else {
    l1menu3();
  }
});

// 読み込んだ総数データをdCountに設定する
function l1menu2(lines_got){
  var i;
  console.log("l1menu2 called:", l1name, fChar, gender, lines_got.length);
  dCount = [];
  for (i=1; i<lines_got.length; i++){
    dCount[i-1] = lines_got[i].split(",");
  }
  l1menu3();
}

// 読み込んだ総数データをdCountに設定し、sChartDispを呼び出すか（総数の場合）、
// またはl2menuイベントを発生させる（章の場合）

function l1menu3(){
  console.log("l1menu3 called:", l1name);
  // 総数行の場合
  if (l1code == l1code0){
     codName = l1name;
     codWCode = l1code;
     sChartDisp();
  // 章の行の場合、
  } else {
     $('#l2menu').val(l1code).change();
  }
}

//***
// (2)l2メニュー
//     共通：                       ・ l3menuを初期化する
//                                  ・ 選択肢のファイルコードが現状値fCharと異なる場合、死亡統計ファイルを読み込む
//     章の行の場合（l2code==l2code0）: ・ ファイル文字が異なる場合は、死亡統計ファイルを読み込む
//                                    ・ sDispChartを呼び出す
//                                    ・ l3menuを初期化する
//
//     死因分類グループの行の場合（l2code!=l2code0）： 死亡分類グループに対応するl3menuを作成し、
//                                                   l3menu選択イベントを発生する
//
$('#l2menu').change(function(){
  console.log("l2menu changed called");
  // 選択されたコードを名前を保存する
  l2name = $('#l2menu  option:selected').text();
  console.log("l2name",l2name);
  l2code = $('#l2menu  option:selected').val();
  console.log("l2code",l2code);
  
  //l3menuを初期化する
  $('select#l3menu option').remove();
  
  //死因の行の場合、読み込み済みのl3メニュー行を一行ずつ調べ、l3メニューを再設定する
  if (l2code != l2code0){
    for (j=0; j<l3menuArea.length; j++){
      if (l3menuArea[j].upLink == l2code) {
        $(function(){
          var $option = '<option value ="' + l3menuArea[j].value + '">' + l3menuArea[j].text + '</option>';
//        console.log($option);
          $('#l3menu').append($option);
        });
      
      }
    }
  }
  
  //死亡統計ファイルを読み込む必要があるか調べ、必要なら読み込む
  var fCharNew = getFCharNew(l2code, l2menuArea);
  if (fCharNew != fChar){
    fChar = fCharNew;
    var fName = dCountDir + fChar + gender + ".csv";
    fRead(fName,l2menu2);
  } else {
    l2menu3();
  }
});

// 読み込んだ死亡数統計データをdCountに設定する
function l2menu2(lines_got){
  console.log("l2menu2 called:", l2name,fChar, gender, lines_got.length);
  dCount = [];
  for (var i=1; i<lines_got.length; i++){
    dCount[i-1] = lines_got[i].split(",");
  }
  l2menu3();
}

// 直接または、l3menuイベント経由でチャートを表示する
function l2menu3(){
  console.log("l2menu3 called:", l2name);
  // 先頭行の場合
  if (l2code == l2code0){
     codName = l2name;
     codWCode = l2code;
     sChartDisp();
  // 2行以降の場合、
  } else {
     $('#l3menu').val(l2code).change();
  }
}

//***
// (3)死因が再選択されたら、
//    選択された死因名をcodName、作業コードをcodWCodeに設定し、sDispChartを呼び出す
$('#l3menu').change(function(){
  console.log("l3menu changed called");
  // 選択されたコードを名前を保存する
  l3name = $('#l3menu  option:selected').text();
  console.log("l3name",l3name);
  l3code = $('#l3menu  option:selected').val();
  console.log("l3code",l3code);

  //死亡統計ファイルを読み込む必要があるか調べ、必要なら読み込む
  var fCharNew = getFCharNew(l3code, l3menuArea);
  if (fCharNew != fChar){
    fChar = fCharNew;
    var fName = dCountDir + fChar + gender + ".csv";
    fRead(fName,l3menu2);
  } else {
    l3menu3();
  }
});

// 読み込んだ死亡数統計データをdCountに設定する
function l3menu2(lines_got){
  console.log("l3menu2 called:", l3name, fChar, gender, lines_got.length);
  dCount = [];
  for (var i=1; i<lines_got.length; i++){
    dCount[i-1] = lines_got[i].split(",");
  }
  l3menu3();
}

// チャートを表示する
function l3menu3(){
  console.log("l3menu3 called:", l3name);
  codWCode = l3code;
  codName = l3name;
  sChartDisp();
};

