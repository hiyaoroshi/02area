//****************************************************
// �ݑ��ÁE���w�W�\��
//   �w�W�l�Z�b�g��csv�t�@�C����ǂݍ��݁A�O���t�\������

// 
// �w�W�l�Z�b�g�t�@�C���̎d�l
//    �s0: �w�W�l�Z�b�g���A�w�W�� 
//      ��0:  �w�W�l�Z�b�g��
//      ��1-: �w�W���i�󔒗�ȍ~�́A�\���ΏۊO�������j
//
//    �s1-: �����̖��A�w�W�l
//      ��0:  �����̖�
//      ��1-: �w�W�l
//    
// �`���[�g�ݒ�v�f�́A
//    (1)�w�W�l�Z�b�g��
//    (2)�\����� 1�w�W�l�ɂ���r�A�܂��́A2�w�W�l�̎U�z�}�ɂ���r
//    (3)�ݑ��ÁE���w�W

// (1)�w�W�l�Z�b�g�̋L���Ɩ��O�Aparms.js�Őݒ肷��
//    ".csv"��t����ƁA�w�W�Z�b�g�t�@�C����
var idxSet = 01;
var idxSetName = "�n���x���Z���^�[�w�W";
var idxSetList = 
    {01:"�n���x���Z���^�[�w�W",
     02:"���퐶������w�W"
    }

// (2)�\����ʂ̋L���Ɩ��O�Aparms.js�Őݒ肷��
//   
var dispType = 01;
var dispTypeName = "1�w�W�l�ɂ���r";
var dispTypeList = 
    {01:"1�w�W�l�ɂ���r",
     02:"2�w�W�l�̎U�z�}�ɂ���r"
    };

// (3)�ݑ��ÁE���w�W�́A�ǂݍ��񂾎w�W�l�Z�b�g�t�@�C����
//    ��0�s���ݒ肷��

//****
// �O���[�o���ϐ�
//
// �w�W���A�w�W��2�̔z�� �w�W�Z�b�g�t�@�C�����ǂݍ���
var idx;
var idxName;
var idxList = [];

var idx2;
var idx2Name;

// �����̖��Ǝw�W�l�̔z�� �w�W�Z�b�g�t�@�C�����ǂݍ���
// �w�W�l�̔z��́A�����̖��̎w�W�l�̔z��̔z��
//
var lgName = [];
var idxVal = [];

// �n�C���C�g���鎩���̖̂��O
//
var lgNameH = "12219�s���s";

// ���������̊֐�************************
// �y�[�W���ǂݍ��܂ꂽ��A�������̐ݒ�l�Ń`���[�g�\��
$(window).load(function () {
  initSet();
});

//*********************************************
//�֐� initSet
// �����F �Ȃ�
// �Ăяo�����F window load���ɌĂяo�����
// ����F(1)�Œ�l�̑I�����j���[�̃I�v�V������ݒ肷��
//        (1-1)�w�W�l�Z�b�g���̃��j���[��ݒ肷��
//             �w�W�l�Z�b�g���Đݒ肳�ꂽ�C�x���g���N����
//             => �w�W�l�Z�b�g�t�@�C����ǂݍ��݁A�w�W�l�̃��j���[��ݒ肵�A
//                �w�W�l���Đݒ肳�ꂽ�C�x���g���N����
//                =>sDispChart���Ăяo���āA�����`���[�g�p�f�[�^��\������
//        (1-2)�\����ʂ̃��j���[��ݒ肷��
//
//        (1-3)�w�W2�̃Z���N�g�{�b�N�X���\���ɂ���

function initSet(){
  console.log("initSet called");
  
//(1)�Œ�l�̑I�����j���[�̃I�v�V������
//  (1-1)�w�W�l�Z�b�g���̃��j���[��ݒ肷��
  setIdxSet(idxSetList, idxSet);

//  (1-2)�\����ʃ��j���[��ݒ肷��
  setDispType(dispTypeList,dispType);


//  (1-3)�w�W2�̃Z���N�g�{�b�N�X���\���ɂ���
    $("#idx2").hide();
    $("label[for='idx2']").hide();
};

//***********************************************
// �I��v�f���đI�����ꂽ�Ƃ��̊֐� 
// (1)�w�W�Z�b�g�̏ꍇ�F �I��l��ێ����A�Ή�����w�W�Z�b�g�t�@�C����ǂݍ��݁A
//    �w�W�I�����j���[��ݒ肵�A�w�W�đI���C�x���g���N����
//
// (2)�\����ʂ̏ꍇ�F �I��l��ێ����AcChartDisp���Ăяo��
//
// (3)�w�W�̏ꍇ�F�I��l��ێ����AcChartDisp���Ăяo��

//(1)�w�W�Z�b�g�̍đI���F    
$('#idxSet').change(function(){  
  idxSetName = $('#idxSet option:selected').text();
  console.log("idxSet" + idxSetName);
  idxSet = $('#idxSet option:selected').val();
  console.log("idxSet" + idxSet);
  
  // fRead�֐��ɂ��A�w�W�Z�b�g�t�@�C����ǂݍ���
  var fName = idxSetName + ".csv";
  fRead(fName, idxSetChange2);
});

function idxSetChange2(lines_got){
  console.log("idxSetChange2 called:", idxSetName, lines_got.length);
  
  // ��0�s�́A�w�W�l��
  // ��1�v�f����A�󔒂łȂ��v�f�܂ł��c��
  idxList = lines_got[0].split(",");
  //console.log(idxList);
  
  // ��0�v�f����菜��
  idxList.shift();
  
  // �󔒗v�f�̈ʒu�ȍ~����菜��
  var bPosition = $.inArray("", idxList);
  // �󔒗v�f������ꍇ�̂�
  if(bPosition > 0) {
    console.log(bPosition, idxList.length);
    idxList.splice(bPosition, (idxList.length - bPosition))
  };
  
  // �w�W�̑I�����j���[��ݒ肷��
  //  �܂��A�I������������
  $('#idx option').remove();
  //  ���̂��ƁA�I������ǉ����Ă���
  for (var i=0; i<(idxList.length); i++){
    $(function(){
      var $option = '<option value ="' + i + '">' + idxList[i] + '</option>';
      console.log($option);
    $('#idx').append($option);
    });
  };
  
  // �w�W�̏����l��ݒ肷��
  idx = 0;
  idxName = idxList[0]
  
  // �w�W2�̑I�����j���[��ݒ肷��
  //  �܂��A�I������������
  $('#idx2 option').remove();
  //  ���̂��ƁA�I������ǉ����Ă���
  for (var i=0; i<(idxList.length); i++){
    $(function(){
      var $option = '<option value ="' + i + '">' + idxList[i] + '</option>';
      console.log($option);
    $('#idx2').append($option);
    });
  };
  idx2 = 1;
  idx2Name = idxList[1]
  
  // �����āA�����̖��Ǝw�W�l�̐ݒ�
  // �w�W2�̏����l��ݒ肷��
  
  // ��1-�s�́A�����̖��A�w�W�l
  lgName = [];
  idxVal = [];

  for (var i=1; i<lines_got.length; i++){
    var oneLine = lines_got[i].split(",");

    //console.log("oneLine", oneLine);

    // ��0�v�f�͎����̖�
    lgName[i-1] = oneLine[0];

    // ��1-�v�f�́AbPosition�܂ł��w�W�l
    oneLine.shift();
    
    // �󔒗v�f������΂����̂�
    if (bPosition > 0){
      oneLine.splice(bPosition, (oneLine.length - bPosition));
    }
    
    idxVal[i-1] = [];
    for (var j=0; j<oneLine.length; j++){
      idxVal[i-1][j] = oneLine[j];
    }
    
    console.log(lgName[i-1], idxVal[i-1][0], idxVal[i-1][oneLine.length - 1]);
  };
  
  // �w�W�l�Đݒ�̃C�x���g���N����
  $('#idx').val(idx);
  $('#idx').trigger('change');
};

// (2)�\����ʂ̍đI��
//    
$('#dispType').change(function(){
  dispTypeName = $('#dispType option:selected').text();
  console.log("dispTypeName" + dispTypeName);
  dispType = $('#dispType option:selected').val();
  console.log("dispType" + dispType);

  // �\����ʂɂ��A��2�w�W�̃Z���N�g�{�b�N�X��\���܂��͔�\���ɂ��A
  // �J�����`���[�g�܂���xy�`���[�g��\������
  if (dispType == 01){
    // ��2�w�W�̃Z���N�g�{�b�N�X���\���ɂ��A
    // ��1�w�W�Đݒ�̃C�x���g���N����

    $('#idx2').hide();
    $("label[for='idx2']").hide();
    $('#idx').val(0);
    $('#idx').trigger('change');
  } else {
    // ��2�w�W�̃Z���N�g�{�b�N�X��\���ɂ��A
    // ��2�w�W�Đݒ�̃C�x���g���N����

    $('#idx2').show();
    $("label[for='idx2']").show();
    $('#idx2').val(1);
    $('#idx2').trigger('change');
  }
});

// (3)�w�W�̍đI��
//    
$('#idx').change(function(){
  idxName = $('#idx option:selected').text();
  console.log("idxName" + idxName);
  idx = $('#idx option:selected').val();
  console.log("idx" + idx);

  // �\����ʂɂ��A�J�����`���[�g�܂���xy�`���[�g��\������
  if (dispType == 01){
    cChartDisp()
  } else {
    xyChartDisp()
  }
});

// (4)�w�W2�̍đI��
//    
$('#idx2').change(function(){
  idx2Name = $('#idx2 option:selected').text();
  console.log("idx2Name" + idx2Name);
  idx2 = $('#idx2 option:selected').val();
  console.log("idx2" + idx2);

  // �\����ʂɂ��A�J�����`���[�g�܂���xy�`���[�g��\������
  if (dispType == 01){
    cChartDisp()
  } else {
    xyChartDisp()
  }
});
