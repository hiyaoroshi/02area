//****************************************************
// 在宅医療・介護指標表示
//   指標値セットのcsvファイルを読み込み、グラフ表示する

// 
// 指標値セットファイルの仕様
//    行0: 指標値セット名、指標名 
//      列0:  指標値セット名
//      列1-: 指標名（空白列以降は、表示対象外を示す）
//
//    行1-: 自治体名、指標値
//      列0:  自治体名
//      列1-: 指標値
//    
// チャート設定要素は、
//    (1)指標値セット名
//    (2)表示種別 1指標値による比較、または、2指標値の散布図による比較
//    (3)在宅医療・介護指標

// (1)指標値セットの記号と名前、parms.jsで設定する
//    ".csv"を付けると、指標セットファイル名
var idxSet = 01;
var idxSetName = "地域包括支援センター指標";
var idxSetList = 
    {01:"地域包括支援センター指標",
     02:"日常生活圏域指標"
    }

// (2)表示種別の記号と名前、parms.jsで設定する
//   
var dispType = 01;
var dispTypeName = "1指標値による比較";
var dispTypeList = 
    {01:"1指標値による比較",
     02:"2指標値の散布図による比較"
    };

// (3)在宅医療・介護指標は、読み込んだ指標値セットファイルの
//    第0行より設定する

//****
// グローバル変数
//
// 指標名、指標名2の配列 指標セットファイルより読み込む
var idx;
var idxName;
var idxList = [];

var idx2;
var idx2Name;

// 自治体名と指標値の配列 指標セットファイルより読み込む
// 指標値の配列は、自治体毎の指標値の配列の配列
//
var lgName = [];
var idxVal = [];

// ハイライトする自治体の名前
//
var lgNameH = "12219市原市";

// 初期化時の関数************************
// ページが読み込まれたら、初期化の設定値でチャート表示
$(window).load(function () {
  initSet();
});

//*********************************************
//関数 initSet
// 引数： なし
// 呼び出し元： window load時に呼び出される
// 動作：(1)固定値の選択メニューのオプションを設定する
//        (1-1)指標値セット名のメニューを設定する
//             指標値セットが再設定されたイベントを起こす
//             => 指標値セットファイルを読み込み、指標値のメニューを設定し、
//                指標値が再設定されたイベントを起こす
//                =>sDispChartを呼び出して、初期チャート用データを表示する
//        (1-2)表示種別のメニューを設定する
//
//        (1-3)指標2のセレクトボックスを非表示にする

function initSet(){
  console.log("initSet called");
  
//(1)固定値の選択メニューのオプションを
//  (1-1)指標値セット名のメニューを設定する
  setIdxSet(idxSetList, idxSet);

//  (1-2)表示種別メニューを設定する
  setDispType(dispTypeList,dispType);


//  (1-3)指標2のセレクトボックスを非表示にする
    $("#idx2").hide();
    $("label[for='idx2']").hide();
};

//***********************************************
// 選択要素が再選択されたときの関数 
// (1)指標セットの場合： 選択値を保持し、対応する指標セットファイルを読み込み、
//    指標選択メニューを設定し、指標再選択イベントを起こす
//
// (2)表示種別の場合： 選択値を保持し、cChartDispを呼び出す
//
// (3)指標の場合：選択値を保持し、cChartDispを呼び出す

//(1)指標セットの再選択：    
$('#idxSet').change(function(){  
  idxSetName = $('#idxSet option:selected').text();
  console.log("idxSet" + idxSetName);
  idxSet = $('#idxSet option:selected').val();
  console.log("idxSet" + idxSet);
  
  // fRead関数により、指標セットファイルを読み込む
  var fName = idxSetName + ".csv";
  fRead(fName, idxSetChange2);
});

function idxSetChange2(lines_got){
  console.log("idxSetChange2 called:", idxSetName, lines_got.length);
  
  // 第0行は、指標値名
  // 第1要素から、空白でない要素までを残す
  idxList = lines_got[0].split(",");
  //console.log(idxList);
  
  // 第0要素を取り除く
  idxList.shift();
  
  // 空白要素の位置以降を取り除く
  var bPosition = $.inArray("", idxList);
  // 空白要素がある場合のみ
  if(bPosition > 0) {
    console.log(bPosition, idxList.length);
    idxList.splice(bPosition, (idxList.length - bPosition))
  };
  
  // 指標の選択メニューを設定する
  //  まず、選択肢を初期化
  $('#idx option').remove();
  //  そのあと、選択肢を追加していく
  for (var i=0; i<(idxList.length); i++){
    $(function(){
      var $option = '<option value ="' + i + '">' + idxList[i] + '</option>';
      console.log($option);
    $('#idx').append($option);
    });
  };
  
  // 指標の初期値を設定する
  idx = 0;
  idxName = idxList[0]
  
  // 指標2の選択メニューを設定する
  //  まず、選択肢を初期化
  $('#idx2 option').remove();
  //  そのあと、選択肢を追加していく
  for (var i=0; i<(idxList.length); i++){
    $(function(){
      var $option = '<option value ="' + i + '">' + idxList[i] + '</option>';
      console.log($option);
    $('#idx2').append($option);
    });
  };
  idx2 = 1;
  idx2Name = idxList[1]
  
  // 続いて、自治体名と指標値の設定
  // 指標2の初期値を設定する
  
  // 第1-行は、自治体名、指標値
  lgName = [];
  idxVal = [];

  for (var i=1; i<lines_got.length; i++){
    var oneLine = lines_got[i].split(",");

    //console.log("oneLine", oneLine);

    // 第0要素は自治体名
    lgName[i-1] = oneLine[0];

    // 第1-要素は、bPositionまでが指標値
    oneLine.shift();
    
    // 空白要素があるばあいのみ
    if (bPosition > 0){
      oneLine.splice(bPosition, (oneLine.length - bPosition));
    }
    
    idxVal[i-1] = [];
    for (var j=0; j<oneLine.length; j++){
      idxVal[i-1][j] = oneLine[j];
    }
    
    console.log(lgName[i-1], idxVal[i-1][0], idxVal[i-1][oneLine.length - 1]);
  };
  
  // 指標値再設定のイベントを起こす
  $('#idx').val(idx);
  $('#idx').trigger('change');
};

// (2)表示種別の再選択
//    
$('#dispType').change(function(){
  dispTypeName = $('#dispType option:selected').text();
  console.log("dispTypeName" + dispTypeName);
  dispType = $('#dispType option:selected').val();
  console.log("dispType" + dispType);

  // 表示種別により、第2指標のセレクトボックスを表示または非表示にし、
  // カラムチャートまたはxyチャートを表示する
  if (dispType == 01){
    // 第2指標のセレクトボックスを非表示にし、
    // 第1指標再設定のイベントを起こす

    $('#idx2').hide();
    $("label[for='idx2']").hide();
    $('#idx').val(0);
    $('#idx').trigger('change');
  } else {
    // 第2指標のセレクトボックスを表示にし、
    // 第2指標再設定のイベントを起こす

    $('#idx2').show();
    $("label[for='idx2']").show();
    $('#idx2').val(1);
    $('#idx2').trigger('change');
  }
});

// (3)指標の再選択
//    
$('#idx').change(function(){
  idxName = $('#idx option:selected').text();
  console.log("idxName" + idxName);
  idx = $('#idx option:selected').val();
  console.log("idx" + idx);

  // 表示種別により、カラムチャートまたはxyチャートを表示する
  if (dispType == 01){
    cChartDisp()
  } else {
    xyChartDisp()
  }
});

// (4)指標2の再選択
//    
$('#idx2').change(function(){
  idx2Name = $('#idx2 option:selected').text();
  console.log("idx2Name" + idx2Name);
  idx2 = $('#idx2 option:selected').val();
  console.log("idx2" + idx2);

  // 表示種別により、カラムチャートまたはxyチャートを表示する
  if (dispType == 01){
    cChartDisp()
  } else {
    xyChartDisp()
  }
});
