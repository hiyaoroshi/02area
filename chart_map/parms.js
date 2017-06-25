//****************************************************
// 在宅医療・介護指標用 parms.js
//  2017.6.11 1.0 厚生労働統計協会
//
//  ファイル読み込み関数
//    fRead(fName, fun)
//  セレクトボックス初期化関数
//    指標セット名： setIdxSet(idxSetList, idxSet)
//    表示種別： setDispType(dispTypeList,dispType)

//関数 fRead*************************************************
//  引数： ファイル名、コールバック関数
//  コールバック関数へ渡す引数： 正常終了時読み込みデータ
//  （csvファイルを読み込み、1行ずつ分けて、配列として渡す）
function fRead(fName,fun) {
  console.log("fRead called fName: ",fName);
  var readLines = [];
  $('#msg').text('ファイル読み込み中');
  $.ajax(fName,
    { 
       dataType: 'text',
    })
      .done(function(data) {
        readLines = data.split("\n");
//      console.log(data);
// 最終行が空白行の場合、取り除く20170125
        if (readLines[readLines.length-1]==""){
          readLines.pop();
        }
        $('#msg').text('');
        fun(readLines);
        })
      .fail(function(status, error) {
        console.log("ajax.fail", status.statusText, error);
        window.alert('ファイル読み込みエラーです。動作環境等を確認し、再度実行してください。');
      });
};

//*****************************************
//***
// 1.表示種別のセレクトボックスの定義
//   html側のセレクトボックスのID：dispType
//   dispType, dispTypeName, dispTypeListは、呼び出し側で定義する

function setDispType(dispTypeList, initdispType){
  for (key in dispTypeList){
    $(function(){
     var $option = '<option value ="' + key + '">' + dispTypeList[key] + '</option>';
     console.log($option);
     $('#dispType').append($option);
    });
  };
  $('#dispType').val(initdispType);
}

//***
// 2.指標セット名のセレクトボックスの定義
//   html側のセレクトボックスのID：idxSet
//   idxSet, idxSetNameName, idxSetListは、呼び出し側で定義する

function setIdxSet(idxSetList,initIdxSet){
  for (key in idxSetList){
    $(function(){
     var $option = '<option value ="' + key + '">' + idxSetList[key] + '</option>';
     console.log($option);
     $('#idxSet').append($option);
    });
  };
  $('#idxSet').val(initIdxSet);
  $('#idxSet').trigger('change');
}
