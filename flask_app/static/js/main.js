var g_map = null;
var teresina = {lat: -5.092011, lng: -42.80376};
var mks_obj = [];
var mk_to_add = null;
var to_add = [];
var geocoder = null;

// var infowindow = new google.maps.InfoWindow({
  // size: new google.maps.Size(150, 50)
// });


function codeAddress() {
  var address = $('#input_busca').val();
  geocoder.geocode({
    'address': address
  }, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      g_map.setCenter(results[0].geometry.location);
     
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}

function LimparTabela(){
    $('#table tbody tr').each(function(){
        $(this).remove();
    });
}

function goSave(){
    $("#save_btn").text('');
    $("#save_btn").append('<img src="https://media.giphy.com/media/10kTz4r3ishQwU/giphy.gif" class="spinner"/>');
    $("input").attr('disabled', 'disabled');
    $("button").attr('disabled', 'disabled');
    // for (var i = to_add.length - 1; i >= 0; i--) {
    save_recursive();
    // }
}

function save_recursive(){
    var mk = to_add[to_add.length - 1];
    var lati = mk.position.lat();
    var longi = mk.position.lng();
    mk.setMap(null);
    geocoder.geocode({
        'location': {lat:lati, lng:longi}
    }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            var endereco = results[0].formatted_address;
        } else {
            var endereco = 'Address';
        }
        toDataURL(lati, longi, function(data_url){
            to_bd(lati, longi, endereco, data_url);
        });
    });
}

function to_bd(lt, lg, end, b64){
    $.ajax({
        url: 'save_location/',
        type: 'POST',
        data: {lat: lt, lng: lg, address:end, base64:b64},
        success: function(data, textStatus, jqXHR){
            to_add.pop();
            if(to_add.length>0){
                return save_recursive();
            }else{
                $("input").removeAttr('disabled');
                $("button").removeAttr('disabled');
                $("#save_btn").text('Salvar');
                calcelAdd();
            }
        },
        error: function(jqXHR, textStatus, errorThrown){
            //var errResponse = JSON.parse(jqXHR.responseText);
            console.log('erro');
        }
    });
}

function toDataURL(lat, long, callback) {
    var url = "https://maps.googleapis.com/maps/api/streetview?size=400x400&location="+lat+
    ","+long+"&fov=90&heading=235&pitch=10&key="+ksv;
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
        var reader = new FileReader();
        reader.onloadend = function() {
            callback(reader.result);
        }
        reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
}

function toAdd(){
    $("#busca").show();
    $("#add_btn").text('Cancelar');
    $("#add_btn").attr('onclick', 'calcelAdd();');

    for (var i = to_add.length - 1; i >= 0; i--) {
        to_add[i].setMap(null);
        to_add.pop();
    }

    for (var i = mks_obj.length - 1; i >= 0; i--) {
        mks_obj[i].setMap(null);
        mks_obj.pop();
    }

    to_add = [];
    mks_obj = [];

    g_map.addListener('click', function(event) {
        add_marker_draggable(event.latLng);
    });
}

function calcelAdd(){
    $("#busca").hide();
    $("#add_btn").text('Adicionar');
    $("#add_btn").attr('onclick', 'toAdd();');

    google.maps.event.clearListeners(g_map, 'click');

    for (var i = to_add.length - 1; i >= 0; i--) {
        to_add[i].setMap(null);
        to_add.pop(i);
    }

    mk_to_add = null;
    load_markers();
}

function add_marker_draggable(location) {
    mk_to_add = new google.maps.Marker({
        position: location,
        map: g_map,
        draggable:true,
        title:"Arraste!"
    });

    to_add.push(mk_to_add);
    // markers.push(marker);
    mk_to_add = null;
}

function see_img(elem){
    var src = $(elem).attr('src');
    var txt = $(elem).attr('alt');
    $('#image_modal').attr('src', src);
    $('#viewImageModalLabel').text(txt);
    $("#viewImageModal").modal('show');
}

function add_marker_to_list(data){
    $('#id_marcadores').append(
        '<li class="row my-li" style="margin:10px;padding-right: 0px;padding-left: 0px;">'+
            '<div class="col-md-12" style="padding-left: 0px;padding-right: 0px;">'+
            '<div class="col-md-3">'+
                '<img src="'+data['base64']+'" alt="'+data['address']+'"'+
                'class="img-thumbnail" width="76" height="59" onclick="see_img(this);">'+

            '</div>'+
            '<div class="col-md-5" style=padding-right: 0px;padding-left: 0px;>'+
                '<center><p style=font-size:12px;">'+data['address']+'</p></center>'+
            '</div>'+
            '<div class="col-md-2" style="padding-right: 0px;">'+
                    // '<p style="font-size: 10px;">'+data['address']+'</p>'+
                    '<button '+
                    'onclick="set_center('+data['lt']+','+data['lg']+');" '+
                    'class="btn btn-primary pull-right">'+
                    '<i class="glyphicon glyphicon-eye-open"></i></button>'+
                '</div>'+    
            '<div class="col-md-2">'+
                    // '<p style="font-size: 10px;">'+data['address']+'</p>'+
                    '<button '+
                    'onclick="delete_mk('+data['id']+');" '+
                    'class="btn btn-danger pull-right">'+
                    '<i class="glyphicon fui-cross"></i></button>'+
                '</div>'+
            '</div>'+

        "</li>"
    );

    mk = new google.maps.Marker({
        position: {lat: parseFloat(data['lt']), lng: parseFloat(data['lg'])},
        map: g_map,
        title:data['address']
    });

    mks_obj.push(mk);
}

function set_center(lt, lg){
    g_map.setCenter({lat: parseFloat(lt), lng: parseFloat(lg)});
}

function clear_info(){
    $('#id_marcadores li').each(function(){
        $(this).remove();
    });
    if(mks_obj.length<1){return;}
    for (var i = mks_obj.length - 1; i >= 0; i--) {
        mks_obj[i].setMap(null);
        mks_obj.pop();
    }
}

function load_markers(){
    clear_info();
    $.ajax({
        url: 'get_location/',
        type: 'POST',
        success: function(data, textStatus, jqXHR){
            for (var i = data['markers'].length - 1; i >= 0; i--) {
                add_marker_to_list(data['markers'][i]);
            }
        },
        error: function(jqXHR, textStatus, errorThrown){
            //var errResponse = JSON.parse(jqXHR.responseText);
            console.log('erro');
        }
    });
}

function delete_mk(id){
    $.ajax({
        url: 'delete_location/',
        type: 'POST',
        data: {id:id},
        success: function(data, textStatus, jqXHR){
            load_markers();
        },
        error: function(jqXHR, textStatus, errorThrown){
            //var errResponse = JSON.parse(jqXHR.responseText);
            console.log('erro');
        }
    });    
}


$(window).load(function(){
    g_map = new google.maps.Map(document.getElementById('map'), {
                zoom: 12,
                center: teresina
        });
    geocoder = new google.maps.Geocoder();

    load_markers();

    $("#input_busca").on('keypress', function(event){
        if(event.which == 13){
            codeAddress();
        }
    });

});