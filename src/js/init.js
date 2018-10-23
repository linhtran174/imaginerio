import { isNullOrUndefined } from "util";

const getInit = (components) => {
  const {
    eras,
    Map,
    Timeline,
    Filmstrip,
    Legend,
    Search,
    dispatch,
    translations,
  } = components;
  const Dispatch = dispatch;

  const Init = {};

  // let server = "http://localhost:8081/";
  let server = window.location.origin+"/";
  
  // http://images.vietbando.com/ImageLoader/GetImage.ashx?LayerIds=VBD&Level={z}&X={x}&Y={y}
  let tileserver = 'http://images.vietbando.com/ImageLoader/GetImage.ashx?LayerIds=VBD';
  let rasterserver = 'https://irio.axismaps.io/raster/';
  
  const thumbnaillUrl = 'https://mdxdv.artstor.org/thumb/imgstor/size1/sslps/c7731849/';
  const imageUrl = 'https://mdxdv.artstor.org/thumb/imgstor/size2/sslps/c7731849/';

  let imageMeta = {};
  $.getJSON(server + "imageMeta/-1", (d)=>{
    imageMeta.raw = d;

    imageMeta.byEra = {};
    let eraByYear = {};
    eras.forEach((e, index)=>{
      for(var i = e.dates[0]; i <= e.dates[1]; i++){
        eraByYear[i] = index;
      }
      imageMeta.byEra[index] = [];
    });

    imageMeta.raw.forEach((p, i)=>{
      
      p.id = p.imageId;
      p.date = p.year_est;
      p.creator = p.contributor;
      if(p.type == "image") p.layer = "viewsheds";
      // if(p.type == "image") p.layer = "viewsheds";

      if(p.perspective){
        p.perspective = JSON.parse(p.perspective);
      }
      else{
        p.perspective = [[0,0],[0,0]]
      }
      p.shot_lat = p.shot_lat - 0;
      p.shot_lon = p.shot_lon - 0;
      p.focus_lat = p.focus_lat - 0;
      p.focus_lon = p.focus_lon - 0;

      var cEra = eraByYear[p.year_est];
      if(cEra != undefined){
        imageMeta.byEra[cEra].push(p);
      }
    })
    
    imageMeta.byYear = function(year){
      return imageMeta.byEra[eraByYear[year]];
    }

    Init.plans = [];
    initialize()
    // loadPlans(initialize);
  });

  let years = [];
  let year;
  const minYear = 1858;
  let names;
  let nameData = {
    en: {"visualdocuments":"Visual Documents","creator":"Creator","occupant":"Occupant","year":"Mapped","builtenvironment":"Built Environment","firstowner":"First Owner","owner":"Owner","politicalboundaries":"Political Boundaries","architecture":"Architecture","boundaries":"Boundaries","plaza":"Plaza","topography":"Topography","civilengineering":"Civil Engineering","landscapearchitecture":"Landscape Architecture","naturalenvironment":"Natural Environment","water":"Water","buildingspoint":"Stops","tram stations":"Tram Stations","train stations":"Train Stations","metro stations":"Metro Stations","address":"Address","marshes":"Marshes","inlandwaterspoly":"Lagoons and Ponds","lagoons":"Lagoons","ponds":"Ponds","salty marshes":"Salty Marshes","neighborhoodspoly":"Areas","favelas":"Favelas","neighborhoods":"Neighborhoods","parishes":"Parishes","utilitiespoint":"UtilitiesPoint","urbanism/urbanismo":"Urbanism","iconography":"Iconography","utilitiespoly":"Water Storage and Distribution","viewfull":"View full map","fountains":"Fountains","reservoirs":"Reservoirs","highlight":"View","landline":"Land Features","beaches":"Beaches","landpoly":"Territory","publicspacespoly":"Public Spaces","cemeteries":"Cemeteries","gardens":"Gardens","parks":"Parks","plazas":"Plazas","squares":"Squares","roadsline":"Roads","alleys":"Alleys","avenues":"Avenues","expressways":"Expressways","overpasses":"Overpasses","passages":"Passages","slopes":"Slopes","streets":"Streets","trails":"Trails","agriculture":"Agriculture","forests":"Forests","mangroves":"Mangroves","riparian forests":"Riparian Forests","spit vegetation":"Spit Vegetation","clear":"Clear project","maps":"Maps","plans":"Plans","views":"Views","inlandwatersline":"Rivers and Streams","brooks":"Brooks","creeks":"Creeks","rivers":"Rivers","streams":"Streams","utilitiesline":"Water Canalization","aqueducts":"Aqueducts","canals":"Canals","ditches":"Ditches","sewage pipes":"Sewage Pipes","water pipes":"Water Pipes","buildingspoly":"Buildings","civil":"Civil","health":"Health","infrastructure":"Infrastructure","military":"Military","religious":"Religious","viewsheds":"Cones of Vision","piers":"Piers","plans/planos":"Urban Projects","groundcoverpoly":"Ground Cover","geography/geografia":"Landscape","farm":"Farm","mill":"Mill","built domain":"Built Domain"},
    vn: {"visualdocuments":"Visual Documents","creator":"Creator","occupant":"Occupant","year":"Mapped","builtenvironment":"Built Environment","firstowner":"First Owner","owner":"Owner","politicalboundaries":"Political Boundaries","architecture":"Architecture","boundaries":"Boundaries","plaza":"Plaza","topography":"Topography","civilengineering":"Civil Engineering","landscapearchitecture":"Landscape Architecture","naturalenvironment":"Natural Environment","water":"Water","buildingspoint":"Stops","tram stations":"Tram Stations","train stations":"Train Stations","metro stations":"Metro Stations","address":"Address","marshes":"Marshes","inlandwaterspoly":"Lagoons and Ponds","lagoons":"Lagoons","ponds":"Ponds","salty marshes":"Salty Marshes","neighborhoodspoly":"Areas","favelas":"Favelas","neighborhoods":"Neighborhoods","parishes":"Parishes","utilitiespoint":"UtilitiesPoint","urbanism/urbanismo":"Urbanism","iconography":"Iconography","utilitiespoly":"Water Storage and Distribution","viewfull":"View full map","fountains":"Fountains","reservoirs":"Reservoirs","highlight":"View","landline":"Land Features","beaches":"Beaches","landpoly":"Territory","publicspacespoly":"Public Spaces","cemeteries":"Cemeteries","gardens":"Gardens","parks":"Parks","plazas":"Plazas","squares":"Squares","roadsline":"Roads","alleys":"Alleys","avenues":"Avenues","expressways":"Expressways","overpasses":"Overpasses","passages":"Passages","slopes":"Slopes","streets":"Streets","trails":"Trails","agriculture":"Agriculture","forests":"Forests","mangroves":"Mangroves","riparian forests":"Riparian Forests","spit vegetation":"Spit Vegetation","clear":"Clear project","maps":"Maps","plans":"Plans","views":"Views","inlandwatersline":"Rivers and Streams","brooks":"Brooks","creeks":"Creeks","rivers":"Rivers","streams":"Streams","utilitiesline":"Water Canalization","aqueducts":"Aqueducts","canals":"Canals","ditches":"Ditches","sewage pipes":"Sewage Pipes","water pipes":"Water Pipes","buildingspoly":"Buildings","civil":"Civil","health":"Health","infrastructure":"Infrastructure","military":"Military","religious":"Religious","viewsheds":"Cones of Vision","piers":"Piers","plans/planos":"Urban Projects","groundcoverpoly":"Ground Cover","geography/geografia":"Landscape","farm":"Farm","mill":"Mill","built domain":"Built Domain"}
  }
  let language;
  let currentEra = eras[0];
  const darkBlue = 'rgb(1, 34, 95)';
  
  Init.mapProbing = false;
  
  
  const params = {};
  
  (function($){
    $.event.special.destroyed = {
      remove: function(o) {
        if (o.handler) {
          o.handler()
        }
      }
    }
  })(jQuery)
  
  // runtime stuff
  
  const mobile = window.innerWidth <= 700;
  const mobileLandscape = mobile && window.innerWidth >= 415;


  function loadPlans(callback) {
    Init.plans = [];
    // $.getJSON(`${server}plans/`, (plansList) => {
    //   Init.plans = plansList.map((d) => {
    //     const planCopy = Object.assign({}, d);
    //     planCopy.years = d.planyear.split('-').map(dd => parseInt(dd, 10));
    //     return planCopy;
    //   });
    //   if (callback !== undefined) callback();
    // });
  }

  checkHash();
  year = params.year || 1858; // a year that actually has something
  language = params.language || 'vn';

  let autoSwitchLang = setInterval(()=>{
    language = (language=='vn')?'en':'vn';
    setLanguageDropdown()
    updateLanguage();
    updateUILanguage();
  }, 4000)
  setTimeout(()=>{
    clearInterval(autoSwitchLang);
  }, 30000);
  if(params.language) clearInterval(autoSwitchLang);
  

  
  
  

  const preloadImages = () => {
    const img = new Image();
    img.src = 'img/pulse.gif';
  };

  preloadImages();
  
  $("#contribute-image-button").on("click",()=>{
    window.location.href = window.location.origin + "/imageCollector";
  })
  $("#contribute-map-button").on("click",()=>{
    window.location.href = window.location.origin + "/mapCollector";
  })

  function initialize() {
    // eras[eras.length - 1].dates[1] = new Date().getFullYear();
    
    Map.initialize('map').setYear(year);
    Timeline.initialize(eras, 'timeline').setYear(year);
    Filmstrip.initialize();
    
    Legend.initialize().setYear(year);
    Search.initialize('search').setYear(year);
    init_ui();
    updateEra();

  
    if (params.year) {
      Filmstrip.setYear(year);
      $('main').removeClass('eras');
    }
  
    if (params.zoom) {
      Map.setView(params.center, params.zoom);
    }
    if (params.layers) {
      let v = false;
      if (params.layers.indexOf('views') !== -1) {
        v = true;
        params.layers.splice(params.layers.indexOf('views'), 1);
        if (!params.layers.length) params.layers = ['all'];
      }
      Legend.layers(params.layers);

      if (v) {
        $('input[value="views"]').attr('checked', null);
        Legend.hasViews = false;
        Map.hideViews();
      }
    }
    if (params.raster) {
      Filmstrip.setRaster(params.raster);
    }
  }

  function setLanguageDropdown() {
    const languageOptions = {
      en: 'English Version',
      vn: 'Tiếng Việt',
    };


    const dropdownButton = $('.language-dropdown-button');
    const currentLanguage = $('.language-dropdown-current');
    const currentLanguageMobile = $('.language-dropdown-current--mobile');
    const optionsContainer = $('.language-dropdown-content');
    const otherLanguage = $('.language-dropdown-option');

    Object.keys(languageOptions).forEach((languageKey) => {
      $(`.language-dropdown-option[data-language="${languageKey}"]`)
        .text(languageOptions[languageKey]);
    });

    const openDropdown = () => {
      if (optionsContainer.hasClass('language-dropdown-content--on')) return;
      optionsContainer.addClass('language-dropdown-content--on');
    };

    const closeDropdown = () => {
      optionsContainer.removeClass('language-dropdown-content--on');
    };

    const closeDropdownMobile = (e) => {
      if (!$(e.target).hasClass('language-dropdown-option')) {
        e.stopPropagation();
      }

      optionsContainer.removeClass('language-dropdown-content--on');
      $('body').off('touchstart', closeDropdownMobile);
      
      // const target = $(e.target);
      // const isMenu = target.hasClass('language-dropdown-option') ||
      //   target.hasClass('language-dropdown-content') ||
      //   target.hasClass('language-dropdown-button');
      // if (isMenu) return;

      // if (!$(e.target).parent().hasClass('language-dropdown-button')) {
      //   optionsContainer.removeClass('language-dropdown-content--on');
      //   $('body').off('touchstart', closeDropdownMobile);
      // }
    };

    let closeDropdownTimer;

    const stopDropdownTimer = () => {
      if (closeDropdownTimer !== undefined) {
        clearTimeout(closeDropdownTimer);
      }
    };

    const setDropdownOptionVisibility = () => {
      const languageText = languageOptions[language];
      currentLanguage.text(languageText);
      currentLanguageMobile.text(languageText);

      $('.language-dropdown-option').each(function toggleVisibility() {
        const option = $(this);
        const optionLanguage = option.attr('data-language');
        const display = optionLanguage !== language;
        if (display) {
          option.removeClass('language-dropdown-option--hidden');
        } else {
          option.addClass('language-dropdown-option--hidden');
        }
      });
    };

    if (!mobile) {
      const menuCloseDelay = mobile ? 0 : 500;
      dropdownButton
        .on('mouseover', () => {
          clearInterval(autoSwitchLang);
          stopDropdownTimer();
          openDropdown();
        })
        .on('mouseout', () => {
          stopDropdownTimer();
          closeDropdownTimer = setTimeout(() => {
            closeDropdown();
          }, menuCloseDelay);
        });
  
      optionsContainer
        .on('mouseover', () => {
          stopDropdownTimer();
        })
        .on('mouseout', () => {
          stopDropdownTimer();
          closeDropdown();
        });
    } else {
      dropdownButton
        .on('touchstart', (e) => {
          if (optionsContainer.hasClass('language-dropdown-content--on')) {
            closeDropdownMobile(e);
            return;
          }
          openDropdown();
          e.stopPropagation();
          $('body')
            .on('touchstart', closeDropdownMobile);
        });
    }

    const eventType = mobile ? 'touchstart' : 'click';

    otherLanguage.on(eventType, function switchLanguage() {

      const newLanguage = $(this).attr('data-language');
      language = newLanguage;
      Init.language = language;
      
      // show/hide dropdown options
      setDropdownOptionVisibility();
      updateLanguage();
      updateUILanguage();
    });

    setDropdownOptionVisibility();
  }

  function updateLanguage() {
    console.log('update language');
    names = nameData[language];
    Dispatch.call('updatelanguage', this);
  }

  function updateUILanguage() {
    translations
      .filter(d => d.name !== '' && Object.prototype.hasOwnProperty.call(d, 'selector'))
      .forEach((d) => {
        $(d.selector).html(d[language]);
      });
    $('.search-input-container input')
      .attr('placeholder', translations.find(d => d.name === 'search-map-layers')[language]);
    setEraDropdownText();
  }

  function getEraDropdownItem(e) {
    return `${e[language]} (${e.dates.map(formatYear).join(' – ')})`;
  }

  function setEraDropdownText() {
    eras.forEach(e => $(`.era-dropdown-${e.id}`).text(getEraDropdownItem(e)));
  }

  function init_ui() {
    var switchLanguage = 
    setLanguageDropdown();
    updateUILanguage();
    // if mobile, go back to map.
    // if desktop, go back to legend
    $('.search-return-to-legend-text')
      .text(mobile ? 'Return to Map' : 'Return to Legend');
    $('.search-return-button, .search-return-to-legend-text')
      .click(() => {
        if ($('main').hasClass('eras')) {
          goToStart();
          return;
        } else if ($('#legend').hasClass('click-search') && mobile) {
          $('#legend').toggleClass('collapsed');
        }
        // Search.clear();
        Search.clearAndClose();
        $('header').removeClass('search');
      })
      .on('mouseover', () => {
        $('.search-return-button, .search-return-to-legend-text')
          .addClass('search-return-highlighted');
      })
      .on('mouseout', () => {
        $('.search-return-button, .search-return-to-legend-text')
          .removeClass('search-return-highlighted');
      });
    if (mobile) {
      $('.mobile-back-to-map-button').click(() => {
        $('#legend').toggleClass('collapsed');
      });
      
      $('#filmstrip').addClass('collapsed').insertBefore('#map');
    } else {
      $('.mobile').hide();
    }
    
  
    // $('#fixed-probe .icon-times').click(function onClick() {
    //   // show probe-hint???
    //   $('#fixed-probe').hide();
    //   Dispatch.call('removehighlight', this);
    //   Map.clearSelected();
    // });
  
    $('.lightbox').click(function onClick(e) {
      // close on background click
      if (e.target == this || $(e.target).hasClass('icon-times')) {
        $('.lightbox').hide();
        $('.lightbox').removeClass('register');
      }
    });

    eras.forEach((e, i) => {
      // console.log('e', e);
      // console.log('i', i);
      $('<option>')
        .attr('value', i)
        .addClass(`era-dropdown-${e.id}`)
        .appendTo('.era-dropdown select');
    });

    setEraDropdownText();

    $('.era-dropdown select').on('change', function change() {
      showEra($(this).val());
    });

    $('#era-stepper .icon-angle-left').click(function click() {
      if ($(this).hasClass('disabled')) return;
      showEra(+$('#intro').data('era') - 1);
    });

    $('#era-stepper .icon-angle-right').click(function click() {
      if ($(this).hasClass('disabled')) return;
      showEra(+$('#intro').data('era') + 1);
    });

    $('.go-button').on('click', goButtonClick);

    $('#eras-button').click(function click() {
      if ($('main').hasClass('eras')) {
        goToStart();
        return;
      }
      Dispatch.call('removeall', this);
      Dispatch.call('removeoverlay', this);
      $('main').addClass('eras');
      $('#legend').addClass('collapsed');
      showEra(eras.indexOf(currentEra), true);
    });

    $('#overlay-info').click(function click() {
      const { probes } = components;
      const { rasterProbe } = probes;
      rasterProbe($(this).data('p'));
    });

    $('.search-results .icon-times').click(() => {
      Search.clear();
    });

  }

  function goButtonClick() {
    clearInterval(autoSwitchLang);
    goToMap();
  }

  function goToStart() {
    $('main').addClass('start');
    // console.log('show dropdown');
    $('.language-dropdown').removeClass('language-dropdown--off');
    $('.title-container h1')
      .html(translations.find(d => d.name === 'h1')[language]);

    $('.go-button')
      .html(`<i class="icon-binoculars"></i> 
      <span class="explore-map-button-text">
        ${translations.find(d => d.name === 'explore-map-button-text')[language]}
      </span>`)
      .removeClass('era')
      .off('click')
      .on('click', goButtonClick);

    window.location.hash = language;
  }

  function goToMap() {
    Dispatch.call('setyear', this, year);
    $('main').removeClass('eras').removeClass('start');
    document.querySelector("#contribute-image-button").style.display = "";
    document.querySelector("#contribute-map-button").style.display = "";
    updateHash();
    updateEra();
  }

  function updateEra() {
    eras.forEach((e) => {
      if (year >= e.dates[0] && year <= e.dates[1]) {
        currentEra = e;
        $('#eras-button .back-to-page-text').html(e[language]);
      }
    });
  }

  function showEra(i, noTransition) {
    $('main').removeClass('start');
    $('#eras-button .back-to-page-text').html(translations.find(d => d.name === 'start')[language]);
    let e = eras[i];
    zoomToEra(e);
    console.log('e', e);
    Filmstrip.setYear(e.dates[0], e.dates[1]);
    Map.setYear(e.dates[0]);

    if (noTransition) {
      $('.era-intro .era-description-inner').remove();
      $('<div class="era-description-inner">')
        .append('<p class="era-description">' + e.description + '<p>')
        .appendTo('.era-description-container')
        .css('margin-left', '0%');
      $('.era-years').html(e.dates.map(formatYear).join(' – '))
        .css('margin-left', '0%');
      $('#intro h1').html(e[language])
        .css('margin-left', '0%');
    } else {
      let dur = 500;
      let endOld = i < $('#intro').data('era') ? '100%' : '-100%';
      let startNew = i < $('#intro').data('era') ? '-100%' : '0%';
      let newDesc = $('<div class="era-description-inner">')
         .append('<p class="era-description">' + e.description + '<p>')
         .css('margin-left', startNew);
      let newYear = $('<p class="era-years">')
         .html(e.dates.map(formatYear).join(' – '))
         .css('margin-left', startNew);
      let newTitle = $('<h1>' + e[language] + '</h1>')
        .css('margin-left', startNew);
      if (startNew == '-100%') {
        newDesc.prependTo('.era-description-container')
          .animate({
             'margin-left': '0%'
          }, dur, function () {
            $('.era-description-inner').last().remove();
          });
        newYear.prependTo('.era-years-container')
          .animate({
             'margin-left': '0%'
          }, dur, function () {
            $('.era-years').last().remove()
          });
        newTitle.prependTo('.title-container')
          .animate({
             'margin-left': '0%'
          }, dur, function () {
            $('.title-container h1').last().remove()
          });
      } else {
        $('.era-description-inner').last()
          .animate({
            'margin-left': endOld,
          }, dur, function () {
            $(this).remove();
          });
        $('.era-years').last()
          .animate({
            'margin-left': endOld,
          }, dur, function () {
            $(this).remove();
          });
        $('.title-container h1').last()
          .animate({
            'margin-left': endOld,
          }, dur, function () {
            $(this).remove();
          });
        newDesc.appendTo('.era-description-container');
        newYear.appendTo('.era-years-container');
        newTitle.appendTo('.title-container');
      }
    }
    
    $('.go-button')
      .html(`${translations.find(d => d.name === 'go-to-map')[language]} <i class="icon-right-big"></i>`)
      .toggleClass('era', !mobile)
      .off('click')
      .on('click', () => {
        goToEra(e);
      });
    $('#intro').data('era', i);
    $('#era-stepper .icon-angle-left').toggleClass('disabled', (i == 0));
    $('#era-stepper .icon-angle-right').toggleClass('disabled', (i == eras.length - 1));
  }
  
  function goToEra(e) {
    $('main').removeClass('eras');
    Dispatch.call('setyear', this, e.dates[0]);
    zoomToEra(e);
    updateHash();
  }

  function zoomToEra(e) {
    if (e.center !== '' && e.zoom !== '') {
      Map.setView(e.center, e.zoom);
    }
  }
  
  function formatYear(y) {
    if (y < 0) return - y + ' BC';
    return y;
  }
  
  function checkHash() {

    
    const hash = window.location.hash.replace( '#', '' ).replace(/\?.+$/, '').split( '/' );

    if (hash.length > 1) {
      console.log('hide dropdown');
      $('.language-dropdown').addClass('language-dropdown--off');
      document.querySelector("#contribute-image-button").style.display = "";
      document.querySelector("#contribute-map-button").style.display = "";
    }
    params.language = hash[0] ? hash[0] : '';
    params.year = hash[1] ? parseInt(hash[1], 10) : '';
    params.zoom = hash[2] ? parseInt(hash[2]) : '';
    params.center = hash[3] && hash[4] ? [parseFloat(hash[3]), parseFloat(hash[4]) ] : '';
    params.layers = hash[5] ? hash[5].split( '&' ) : [];
    params.raster = hash[6] ? hash[6] : '';
  }
  
  function updateHash() {
    // console.log('update hash');
    if ($('main').hasClass('eras')) {
      window.location.hash = language;
      return;
    }
    let layers = Legend.layers();
    if (!Legend.hasViews) {
      if (layers[0] === 'all') layers = ['views'];
      else layers.push('views');
    }
    layers = layers.join('&');
    const raster = $('#overlay-info').data('p') ? $('#overlay-info').data('p').data.id : '';
  
    const mapView = Map.getView();
  
    window.location.hash = language + "/" + year + "/" + mapView[1] + "/" + mapView[0].lat + "/" + mapView[0].lng + "/" + layers + "/" + raster;
  
    $('.twitter').attr('href', $('.twitter').attr('data-href') + 'text=imagineRio' + '&url=' + encodeURIComponent(window.location.href));
    $('.fb-share-btn').attr('href', $('.fb-share-btn').attr('data-href') + '&u=' + encodeURIComponent(window.location.href));
    // Update Social Media links
    // $( '.twitter-button a' ).attr( 'href', 'https://twitter.com/intent/tweet?url=' + encodeURIComponent( window.location.href ) );
  
    // $( '.facebook-button a' ).attr('href', 'http://www.facebook.com/sharer/sharer.php?u=imaginerio.org/' + encodeURIComponent( window.location.hash ) + '&title=Imagine Rio');
  }

  // function exportMap() {
  //   $('#export')
  //     .attr('class', 'icon-circle-notch animate-spin');
  //   const layers = Legend.layers().sort().join(',');
  //   const raster = $('#overlay-info').data('p') ? $('#overlay-info').data('p').data.file : 'null';
  //   const url = server + 'export/en/' + year + '/' + layers + '/' + raster + '/' + Map.getBounds().toBBoxString() + '/';
  //   console.log('raster', raster);
  //   console.log('export url', url);
  //   document.getElementById('download_iframe').src = url;
  //   window.setTimeout(() => { $('#export').attr('class', 'icon-download'); }, 2000);
  // }

  function setYear(newYear) {
    year = newYear;
  }

  return Object.assign(Init, {
    updateEra,
    formatYear,
    updateHash,
    mobile,
    mobileLandscape,
    server,
    tileserver,
    imageMeta,
    rasterserver,
    names,
    thumbnaillUrl,
    setYear,
    language,
    darkBlue,
  });
};

export default getInit;
