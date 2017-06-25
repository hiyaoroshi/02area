//****************************************************
// H27年度調査研究用 chart_map.js
//  2017.6.11 1.0 厚生労働統計協会
//
//  チャート、マップ表示の関数を収録する
//  cChartDisp、xyChartDisp

// (*)参照するグローバル変数
//    idxSetName： 	指標セット名（チャートタイトル）
//    idx:			選択された指標名のインデックス
//    idxName:		選択された指標名

//    idx2:			選択された第2指標名のインデックス
//    idx2Name:		選択された第2指標名

//    lgName：   	表示する自治体名の配列
//    idxVal:		表示する指標値の配列の配列
//                  自治体：lg、指標idxの値は、idxVal[lg][idx]
//    cChartdiv：  	カラムチャートまたはxyチャートを表示するdiv名（htmlで定義する）
//    lgNameH:		ハイライトする自治体の自治体名
//                  自治体コード（先頭の5文字）を比較する

// 参照するDOMオブジェクト
//    "cChartdiv"   チャートを表示するdiv

// カラーの定義 濃い青と、薄い青
var colorH = '#3182bd';
var colorL = '#9ecae1';

// 関数 cChartDisp**************************************
//  引数： なし
//  動作： グローバル変数に設定された指標データを
//         amChartsの仕様に沿ってchartArgを作成し、カラムチャートを表示する
//  呼び出し元：01 在宅医療・介護指標 自治体比較
//

function cChartDisp() {
  console.log("cChartDisp called");
  
  // dataPrividerを設定する
  var valSorted = [];
  var valOriginal = [];
  var lgNameSorted = [];
  
  // 各自治体の選択された指標の値を取り出す
  // ソート用とソート後に使うオリジナルと２つ保持する
  for (var i=0; i<lgName.length; i++){
    valOriginal.push(parseFloat(idxVal[i][idx]));
    valSorted.push(parseFloat(idxVal[i][idx]))
  };

  // 指標値により降順にソートする
  valSorted.sort(function(a,b){
        if( a > b ) return -1;
        if( a < b ) return 1;
        return 0;
  });

  //console.log(valSorted);
  //console.log(valOriginal);

  // ソートされた指標値に合わせて、自治体名を順に並べる
  for (var i=0; i<lgName.length; i++){

    //元の配列での添え字
    var hit = $.inArray(valSorted[i], valOriginal);
    lgNameSorted.push(lgName[hit]);

    //負数はないという前提で、二回以上ヒットしないようにする
    valOriginal[hit] = -1;
  }

  // 自治体の表示カラーを表示する
  //
  var lgColor = [];
  for (var i=0; i<lgName.length; i++){
    //console.log(lgNameH, lgName[i]);
    if (lgNameSorted[i].substring(0,5) == lgNameH.substring(0,5)){
      lgColor[i] = colorH
    } else {
      lgColor[i] = colorL
    }
  };
  //console.log(lgColorSorted);

  var dataProvider = [];
  for (var i = 0; i<lgName.length; i++){
    var p = {"lg":  lgNameSorted[i],
             "val": valSorted[i],
             "color": lgColor[i]
            };
    dataProvider.push(p);
    console.log(p);
  };

// 行数によりチャートを表示するdivの高さを設定
  if (lgName.length < 25){
     $('#cChartdiv').css('height', '600')
  } else {
     $('#cChartdiv').css('height', '1200')
  }

// チャートを定義し表示する
  var chart = AmCharts.makeChart( "cChartdiv", {
    "type": "serial",
    "theme": "light",
    "rotate": true,
  
    // チャートタイトルの定義
    "titles": [{
      "text": idxSetName,
      "size": 16
      },{ 
      "text": idxName,
      "size": 16
    }],
 
    // 注記
    "allLabels":	[{
      "x":	0,
      "y":	"!10",
      "text":	"",
      "size":	8
    }],

    "dataProvider": dataProvider,
    "valueAxes": [ {
      "gridColor": "#FFFFFF",
      "gridAlpha": 0.2,
      "dashLength": 0
    } ],
  
  // 値軸（縦軸）の定義 
  //
    "valueAxes": [{
      "color":"#000000",
      "gridColor":"#FFFFFF",
      "gridAlpha": 0.2,
      "dashLength": 0,
      "minHorizontalGap":100,
      "position": "right",
      "title": "",
      "titleRotation":0,
      "titleBold": false,
      "minimum"	: 0
     }], 
  
    "gridAboveGraphs": true,
  
    "graphs": [ {
      "balloonText": "[[lg]]: <b>[[val]]</b>",
      "fillAlphas": 0.8,
      "lineAlpha": 0.2,
      "type": "column",
      "valueField": "val",
      "colorField": "color"
    }],
  
    "chartCursor": {
      "categoryBalloonEnabled": false,
      "cursorAlpha": 0,
      "zoomable": false
    },
  
    "categoryField": "lg",
    "categoryAxis": {
      "gridPosition": "start",
      "gridAlpha": 0,
      "labelRotation":90,
      "fontSize":12,
      "labelFrequency":1,
//    "tickPosition": "start",
//    "tickLength": 20
    },
    
    "export": {
      "enabled": true,
      "menu":[{
        "format":	"JPG",
        "label":	"JPG"
      },{
        "format":	"csv",
        "label":	"CSV"
      }]
    }
  });
}

// 関数 xyChartDisp**************************************
//  引数： なし
//  動作： グローバル変数に設定された指標データを
//         amChartsの仕様に沿ってchartArgを作成し、xyチャートを表示する
//  呼び出し元：01 在宅医療・介護指標 自治体比較
//

function xyChartDisp() {
  console.log("xyChartDisp called");

  // 自治体の表示カラーを表示する
  //
  var lgColor = [];
  for (var i=0; i<lgName.length; i++){
    //console.log(lgNameH, lgName[i]);
    if (lgName[i].substring(0,5) == lgNameH.substring(0,5)){
      lgColor[i] = colorH
    } else {
      lgColor[i] = colorL
    }
  };
  //console.log(lgColorSorted);

  // dataProvider を設定する
  var dataProvider = [];
  for (var i = 0; i<lgName.length; i++){
    var p = {"lg":  lgName[i].substring(5,lgName[i].length),
             "x":   idxVal[i][idx2],
             "y":   idxVal[i][idx],
             "color": lgColor[i]
            };
    dataProvider.push(p);
    console.log(p);
  };

// チャートを表示するdivの高さを設定
  $('#cChartdiv').css('height', '600')

// チャートを定義し表示する
  var chart = AmCharts.makeChart( "cChartdiv", {
    "type": "xy",
    "theme": "light",
  
    // チャートタイトルの定義
    "titles": [{
      "text": idxSetName,
      "size": 16
      },{ 
      "text": "",
      "size": 16
    }],
 
    // 注記
    "allLabels":	[{
      "x":	0,
      "y":	"!10",
      "text":	"(*)この図は（一般財団法人）厚生労働統計協会が編集したものです。ウェルネス社のデータを一部使用しています。",
      "size":	8
    }],

    "dataProvider": dataProvider,

  // 値軸（xy軸）の定義 
  //
    "valueAxes": [ {
      "position": "bottom",
      "axisAlpha": 0,
      "title": idx2Name,
      "titleFontSize":16
      },{
      "axisAlpha": 0,
      "position": "left",
      "title": idxName,
      "titleFontSize":16
    }],
    
    "graphs": [ {
      "balloonText": idx2Name + ":<b>[[x]]</b><br>" + idxName + ":<b>[[y]]</b><br>自治体名:<b>[[lg]]</b>",
      "bullet": "circle",
      "bulletBorderAlpha": 0.2,
      "bulletAlpha": 0.8,
      "lineAlpha": 0,
      "fillAlphas": 0,
      "valueField": "lg",
      "colorField": "color",
      "xField": "x",
      "yField": "y",
      "maxBulletSize": 1,
      "labelText":	"[[lg]]",
    }],
  
    "chartCursor": {
      "categoryBalloonEnabled": false,
      "cursorAlpha": 0,
      "zoomable": false
    },
    
    "export": {
      "enabled": true,
      "menu":[{
        "format":	"JPG",
        "label":	"JPG"
      },{
        "format":	"csv",
        "label":	"CSV"
      }]
    }
  });
}
