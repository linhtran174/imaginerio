function rasterProbe (p) {
  Dispatch.call('removeall', this);
  $('#fixed-probe .content').empty();
  $('#fixed-probe').show();
  $('<p>').attr('class', 'fixed-probe-title').html(p.data.description).appendTo('#fixed-probe .content');
  let size = p.getScaled([400, 300]);
  let img = p.getImage([400, 300], true)
    .attr('class', 'fixed-image')
    .css('width', size[0] + 'px')
    .css('height', size[1] + 'px')
    .appendTo('#fixed-probe .content')
    .click(function () {
      Dispatch.call('removeall', this);
      $('.lightbox').show();
      $('.lightbox .content > div').remove();
      let div = $('<div>').appendTo('.lightbox .content');
      let w = $('.lightbox .content').width();
      let h = window.innerHeight  - 300;
      let size = p.getScaled([w, h], true);
      p.getImage([w, h])
        .attr('class', 'lightbox-image')
        .css('width', size[0] + 'px')
        .css('height', size[1] + 'px')
        .appendTo(div);
      $('<a>')
        .attr('class', 'image blue-button')
        .attr('href', 'http://www.sscommons.org/openlibrary/' + p.href + '&fs=true')
        .attr('target', 'blank')
        .html('View image on SharedShelf Commons')
        .appendTo(div);
      $('<p>')
        .html(p.data.description)
        .appendTo(div);
    });
  if (p.data.layer != 'viewsheds') {
    let slider = Slider('#fixed-probe .content').css('width', '100%').on('sliderchange', function(e, d){ 
      Dispatch.call('setopacity', this, d);
    });
    $('<div>')
      .attr('class', 'button red')
      .html('Remove Overlay')
      .appendTo('#fixed-probe .content')
      .click(function () {
      Dispatch.call('removeoverlay', this);
    });
  } else {
    Map.zoomToView(p.data);
  }
  $('<div>').attr('class', 'blue-button').html('More...').appendTo('#fixed-probe .content').click(function () {
    img.click();
  });
}

function filmstripProbe (photo) {
  let offset = $(this).offset();
  $('#filmstrip-probe .content')
    .empty()
    .html('<p><strong>' + photo.data.description + '</strong></p><p>' + photo.data.date + '</p><p><em>Click to view on map</em></p>')
  $('#filmstrip-probe')
    .show()
    .css({
      top: offset.top - 10 - $('#filmstrip-probe').height() + 'px',
      left: offset.left + 65 - $('#filmstrip-probe').width()/2 + 'px'
    });
}

function mapProbe (event, content) {
  let probe = $('#map-probe').show();
  $('#map-probe .content').empty().html(content);
  let x = event.originalEvent.pageX;
  if (x > window.innerWidth / 2) x -= probe.outerWidth() + 10;
  else x += 10;
  let y = event.originalEvent.pageY;
  if (y > window.innerHeight / 2) y -= probe.outerHeight() + 10;
  else y += 10;
  probe.css({
    top: y + 'px',
    left: x + 'px'
  });
}

function detailsProbe (name, content) {
  $('#fixed-probe .content').empty();
  $('#fixed-probe').show();
  $('<p>').attr('class', 'fixed-probe-title').html(name).appendTo('#fixed-probe .content');
  if (content) $('#fixed-probe .content').append(content);
}