
let elementCount = 0;
let zIndexCount = 0;
let breakTabLoop = false;

$(function() {

  // run the currently selected effect
  function runEffect(elementId, effect, duration) {
    // get effect type from
    // var selectedEffect = $( "#effectTypes" ).val();

    // Most effect types need no options passed by default
    var options = {};
    // some effects have required parameters
    if ( effect === "scale" ) {
      options = { percent: 50 };
    } else if ( effect === "transfer" ) {
      options = { to: "#button", className: "ui-effects-transfer" };
    } else if ( effect === "size" ) {
      options = { to: { width: 200, height: 60 } };
    }

    // Run the effect
    $(`img#${elementId}`).effect(effect, options, duration);
  };

  // Callback function to bring a hidden box back
  function callback() {
    setTimeout(function() {
      $( "#effect" ).removeAttr( "style" ).hide().fadeIn();
    }, 1000 );
  };

  // Set effect from select menu value
  $( "#button" ).on( "click", function() {
    runEffect();
    return false;
  });

    $.contextMenu({
      selector: '.ui-wrapper', 
      callback: function(key, options) {
          var m = 'clickedx: ' + key;
          window.console && console.log(m) || alert(m); 
      },
      items: {
          'bringtofront': {
              name: 'Bring to front',
              callback: function(itemKey, opt, e) {
                zIndexCount++;
                opt.$trigger[0].style.zIndex = zIndexCount;
            }
          },
          'bringback': {
              name: 'Bring back',
              callback: function(itemKey, opt, e) {
                zIndexCount--;
                opt.$trigger[0].style.zIndex = zIndexCount;
            }
          },
          "delete": {
            name: "Delete", 
            callback: function(itemKey, opt, e) {
              let element = opt.$trigger[0]; // Element
              let liElementId = element.children[0].id;
              $(`#${liElementId}`).remove();
              element.remove();
              elementCount--;
            }
          },
          'stopanimation': {
              name: 'Stop Animation',
              callback: function(itemKey, opt, e) {
                let elementId = opt.$trigger[0].children[0].id;
                let clearIntervalId = $(`img#${elementId}`).data('interval-id');
                clearInterval(clearIntervalId);
            }
          },
            "Effects": {
            "name": "Effects", 
            "items": {

              "fold2": {
                  "name": "jQueryUi Effects", 
                    'items': {
                      'pulse-1': {
                        name: "Select", 
                        type: 'select', 
                        options: {1: 'blind',2:'bounce',3:'clip',4:'drop',5:'explode',6:'fade',7:'fold',8:'highlight',9:'puff',10:'pulsate',11:'scale',12:'shake',13:'size',14:'slide',15:'transfer'}, 
                        selected: 1
                      },
                      "pulse-2": { 
                        name:'Loop',
                        type:'checkbox',
                        selected: false
                      },
                      "pulse-3": { 
                        name:'Tempo',
                        type:'text'
                      },
                      "pulse-4": { name: 'Run',
                        callback: function(itemKey, opt, e) {
                          let elementId = opt.$trigger[0].children[0].id;
                          let effect = opt.inputs['pulse-1'].$input.children(':selected').text()
                          let loop = opt.inputs['pulse-2'].$input.prop('checked');
                          let duration = opt.inputs['pulse-3'].$input.val();

                          if(loop) {
                            let setIntervalId = setInterval(function() {runEffect(elementId, effect, parseInt(duration));}, duration);
                            $(`img#${elementId}`).data('interval-id', setIntervalId);
                          }
                          else {
                            runEffect(elementId, effect, parseInt(duration));
                          }
                        }
                      },
                    }
              }
            }
          },
          'duplicate': {
            name: "Duplicate",
            callback: function(itemKey, opt, e) {
              elementCount++;
              let element = opt.$trigger[0];


              let $clone = $(element).removeClass('context-menu-active').clone();
              let $img = $clone.children().first().removeClass('ui-resizable');
              $img.attr('id', `drop-el-${elementCount}`).appendTo('#page-wrapper');
              $img.resizable({ containment: '#page-wrapper' });
              $('.ui-wrapper').last().css({position:'absolute', top:'',left:''}).draggable({ containment: '#page-wrapper' });
              $('#element-list').append(`<li id='drop-el-${elementCount}' class='element-list-item'>drop-el-${elementCount}</li>`);

            }
          },
      }
  });
});

let pageWrapper = 1;

$(document).on({'dragover dragenter': function(e) {
    e.preventDefault();
    e.stopPropagation();
},
'drop': function(e) {
  var dataTransfer =  e.originalEvent.dataTransfer;
  if( dataTransfer && dataTransfer.files.length) {
    var pageId = $(this).attr('id');
    elementCount++;
    e.preventDefault();
    e.stopPropagation();
    $.each(dataTransfer.files, function(i, file) {
      var reader = new FileReader();
      reader.onload = $.proxy(function(file, $fileList, event) {
        var img = file.type.match('image.*') ? `<img id='drop-el-${elementCount}' class='resize' src='${event.target.result}' />` : "";
        $fileList.append(img);
      }, this, file, $(`#${pageId}`));
      reader.readAsDataURL(file);
      reader.onloadend = () => setElementOptionsAfterDrop()
    });
  }
}
}, '.page-drag-handler');

function setElementOptionsAfterDrop() {

  $('#element-list').append(`<li id='drop-el-${elementCount}' class='element-list-item'>drop-el-${elementCount}</li>`);

  let activeTabId = $('#tab-buttons').find('button.active').attr('id').substring(0,1);

  let wrapper = $(`#page-wrapper-${activeTabId}`);
  let wrapperWidth = wrapper.width();
  let wrapperHeight = wrapper.height();

  let latestDroppedElement = wrapper.children().last();
  let latestWidth = latestDroppedElement.width();
  let latestHeight = latestDroppedElement.height();

  if (latestHeight > wrapperHeight) {
    let aspectRatio = calculateAspectRatioFit(latestWidth, latestHeight, wrapperWidth, wrapperHeight);
    latestDroppedElement.width(aspectRatio.width).height(aspectRatio.height);
  }

  // $(`img#drop-el-${elementCount}`).resizable({containment: `#page-wrapper-${activeTabId}` });
  $(`img#drop-el-${elementCount}`).resizable();

  let lastUiWrapper = $(`#page-wrapper-${activeTabId} .ui-wrapper`).last();
  // lastUiWrapper.css({position:'absolute', top:'',left:''}).draggable({ containment: `#page-wrapper-${activeTabId}` });
  lastUiWrapper.css({position:'absolute', top:'',left:''}).draggable();

  lastUiWrapper.rotatable({
    handleOffset: { top: 0, left: 0 }
  });
}

$(document).on('mouseenter', '.element-list-item', function() {
  $(`img#${this.id}`).css('border', 'solid');
});

$(document).on('mouseleave', '.element-list-item', function() {
  $(`img#${this.id}`).css('border', '');
});

$('input[type=radio][name=pageSize]').on('change', function() {
    var page = $('page');
    switch ($(this).val()) {
      case 'A5':
        page.attr('size', 'A5');
        break;
      case 'A4':
        page.attr('size', 'A4');
        break;
      case 'A3':
        page.attr('size', 'A3');
        break;
    }
  });

  $('input[type=radio][name=pageLayout]').on('change', function() {
    var page = $('page');
    switch ($(this).val()) {
      case 'portrait':
        page.attr('layout', 'portrait');
        break;
      case 'landscape':
        page.attr('layout', 'landscape');
        break;
    }
  });

  function darkModeOn() {
    return $('#darkmodeSwitch').prop('checked');
  }

  $('#addTabBtn').click(function() {
    let tabButtons = $('#tab-buttons');
    let tabBtnCount = tabButtons.children().length;
    tabBtnCount++;
    tabButtons.append(`<li class="nav-item"><button class="nav-link" id="${tabBtnCount}-tab" data-bs-toggle="tab" data-bs-target="#page-tab-${tabBtnCount}" type="button" tabindex="-1">${tabBtnCount}</button></li>`)
    $('#tabsWrapper').append(`<div class="tab-pane fade" id="page-tab-${tabBtnCount}" tabindex="0"><page id="page-wrapper-${tabBtnCount}" class="page-drag-handler ${darkModeOn() ? 'dark-page' : ''}" size="A4" layout="portrait"></page></div>`)
  });

  $('#startLoopBtn').click(function() {
    loop();
  });

  $('#stopLoopBtn').click(function() {
    breakTabLoop = true;
  });

  function loop() {
    totalTabsCount = $("#tab-buttons").length;
    for (let i = 1; i < 10; i++) {
      if(breakTabLoop) {
        break;
      }
      setTimeout(function timer() {
        if(i === 9) {
          loop();
        }
        $(`#${i}-tab`).trigger('click');
      }, i * 100);
    }
  }

  $('#darkmodeSwitch').change(function() {
    $('body').toggleClass('dark-body');

    if (darkModeOn()) {
      document.querySelectorAll('page').forEach(el=>el.classList.add('dark-page'));
    }
    else {
      document.querySelectorAll('page').forEach(el=>el.classList.remove('dark-page'));
    }
  });

  /**
  * Conserve aspect ratio of the original region. Useful when shrinking/enlarging
  * images to fit into a certain area.
  *
  * @param {Number} srcWidth width of source image
  * @param {Number} srcHeight height of source image
  * @param {Number} maxWidth maximum available width
  * @param {Number} maxHeight maximum available height
  * @return {Object} { width, height }
  */
function calculateAspectRatioFit(srcWidth, srcHeight, maxWidth, maxHeight) {
    var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
    return { width: srcWidth*ratio, height: srcHeight*ratio };
 }