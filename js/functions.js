
var PROXY_URL = "http://127.0.0.1:8080/applicationProxy/rest/ObtenerRespuesta";


var comenzarChat = function(){
    //JMC - Manejo de historial
    resetStore();

    setTimeout(function () {

        _abrirChat.className += " active";

        setTimeout(function () {
            _abrirChat.className += " inital-view";
            setTimeout(function () {
                _abrirChat.className = _abrirChat.className.replace("inital-view", "");
            }, 4000);
        }, 1000);

    }, 1000);

    //Manejo de historial
    if(sesion){
        var mensajesAnteriores = store.getConversation();
        if(mensajesAnteriores){
          _ventanaChat.innerHTML = '';
          //-->LC - Comentado para que funcione sin sesion
          mensajesAnteriores = (mensajesAnteriores) ? mensajesAnteriores : store.getConversation();
          //<--LC - Comentado para que funcione sin sesion
          var className = _body.className;
          className += ' display-chat';
          _body.className = className;

          if(mensajesAnteriores){
              renderearConversacion(mensajesAnteriores);

          }else{
              sesion = true;
              enviarMensaje(start_message);

          }
        }
    }

}


//Funciones de accion
var abrirChat = function(e){
    _ventanaChat.innerHTML = '';

    //Comentar la linea siguiente para que funcione sin sesion
    var mensajesAnteriores = (mensajesAnteriores) ? mensajesAnteriores : store.getConversation();

    var className = _body.className;
    className += ' display-chat';
    _body.className = className;

    if(mensajesAnteriores){
        renderearConversacion(mensajesAnteriores);


    }else{

        sesion = true;
        enviarMensaje(start_message);

    }
}

var cerrarChat = function(e){
    e.preventDefault();
	Contextoanterior = {};
	mostrarSatisfaccion();

}

var minimizarChat = function(event){
    event.preventDefault();
    pausarConversacion();
}

var esconderCerrarPopup = function(){
    _cerrarPopup.className = _cerrarPopup.className.replace("active", "");
}



var mostrarSatisfaccion = function(){

    reiniciarEstrellas();
    resetStore();

    _satisfaccion.className = _satisfaccion.className.replace("active", "");
    _satisfaccion.className+= " active";
}

var enviarSatisfaccion = function(event){
    event.preventDefault();
    if(_enviarSatisfaccion.className.indexOf('active')>-1 ) {

        _satisfaccion.className = _satisfaccion.className.replace("success", "");
        _satisfaccion.className+= " success";
    }
}

var enviarSatisfaccionNula= function(event){
    event.preventDefault();
    cerrarSatisfaccion();
}

var cerrarSatisfaccion = function(){
    _satisfaccion.className = _satisfaccion.className.replace("active", "");
    _satisfaccion.className = _satisfaccion.className.replace("success", "");
    _body.className = _body.className.replace("display-chat", "").trim();
}

var minimizarSatisfaccion = function(event){
    event.preventDefault();
    pausarConversacion();
}


var botonEnviar = function(e){
    e.preventDefault();
    if (_msjChat.value) {
        escribirEnviarMensaje(_msjChat.value);
    }
}


var documentSe = function(e){

    sesion = false;
    _msjChat.value = '';
    struct = document.createElement("div");
    struct.className = "message error";
    struct.innerHTML = '<div class="message-meta"></div><div class="message-block"><p>Tu sesión ha expirado.</p></div>';
    _ventanaChat.appendChild(struct);
    _ventanaChat.scrollTop = _ventanaChat.scrollHeight;
}

var chatWindowClick = function(e){
    if(e.target.className == "mostrarPreguntasPosibles"){
        mostrarPreguntasPosibles(e.target);
    }else{
        if(e.target.className == "borrarPreguntasPosibles"){
            borrarPreguntasPosibles(e.target);
        }
    }
}


//TO DELETE - Incluida dentro de abrirChat
//TO DELETE - Incluida dentro de abrirChat
//TO DELETE - Incluida dentro de abrirChat
//TO DELETE - Incluida dentro de abrirChat
// var iniciarConversacion = function(mensajesAnteriores){
//
//     _ventanaChat.innerHTML = '';
//
//     //Comentar la linea siguiente para que funcione sin sesion
//     mensajesAnteriores = (mensajesAnteriores) ? mensajesAnteriores : store.getConversation();
//     var className = _body.className;
//     className += ' display-chat';
//     _body.className = className;
//
//     if(mensajesAnteriores){
//         renderearConversacion(mensajesAnteriores);
//
//
//     }else{
//         sesion = true;
//         enviarMensaje(start_message);
//
//     }
// }

//
// //A BORRAR ???  NO ESTAR EN USO?
// var reiniciarConversacion = function(){
//
//     resetStore();
//
//     var className = _body.className;
//     className = className.replace("display-chat", "").trim();
//     _body.className = className;
// }




var pausarConversacion = function(){
    var className = _body.className;
    className = className.replace("display-chat", "").trim();
    _body.className = className;
}


var responder = function(data) {

    if(data){

        var mensaje_html = '';

        if(typeof(data.Datos.TextoConsulta) == "string"){
            mensaje_html+= 'Hubo un error. Por favor intenta más tarde.';
        }else{

            for (i = 0; i < data.Datos.Respuesta.texto.length; i++) {

                if(data.Datos.Respuesta.texto[i].substring(0,2) == '<p'){
                    mensaje_html+=data.Datos.Respuesta.texto[i];
                }else{
                    mensaje_html+="<p>"+data.Datos.Respuesta.texto[i]+"</p>";
                }


                if(data.Datos.Contexto.USR_03_options){
                    mensaje_html+='<ul class="answer-options">';
                    for (i = 0; i < data.Datos.Contexto.USR_03_options.length; i++) {
                        mensaje_html+='<li><a onclick="escribirEnviarMensaje(\''+data.Datos.Contexto.USR_04_options_questions[i]+'\');">'+data.Datos.Contexto.USR_03_options[i]+'</a></li>';
                    }
                    mensaje_html+='</ul>';
                }

                console.log(data.Datos.Contexto.USR_03_options);

            }
        }


        //sugerencias
        var temas_sugeridos_html = '';
        if(data.Datos.Contexto){
            if(data.Datos.Contexto.USR_02_suggestion_topics && data.Datos.Contexto.USR_02_suggestion_topics.length){
                temas_sugeridos_html+='<div class="header"><h2>Puedo sugerirte</h2></div>';
                temas_sugeridos_html+= '<ul>';
                for(var i in data.Datos.Contexto.USR_02_suggestion_topics){
                    temas_sugeridos_html+='<li><a onclick="escribirEnviarMensaje(\''+data.Datos.Contexto.USR_02_suggestion_topics[i]+'\');">'+data.Datos.Contexto.USR_02_suggestion_topics[i]+'</a></li>';
                }
                temas_sugeridos_html+= '</ul>';
            }
        }

        //alternativas
        var preguntas_posibles_html = '';
        // alert(data.Datos.Contexto.USR_01_alt_questions);
        if( data.Datos.Contexto.USR_01_alt_questions.length){
            preguntas_posibles_html+= '<ul class="answer-options">';
            for(var i = 0; i<data.Datos.Contexto.USR_01_alt_questions.length; i++){
                preguntas_posibles_html+='<li><a class="possibleQuestion" onclick="escribirEnviarMensaje(\''+data.Datos.Contexto.USR_01_alt_questions[i]+'\');">'+data.Datos.Contexto.USR_01_alt_questions[i]+'</a></li>';
            }
            preguntas_posibles_html+= '</ul>';
        }

        var mensaje_objeto = {
            'from': 'watson',
            'message': mensaje_html,
            'suggestion': temas_sugeridos_html,
            'possible_questions': preguntas_posibles_html,
            // 'confidence': confidence,
            'time': currentTime()
        };

        mensaje_objeto.context = data.Datos.Contexto;
        //LC - STORES
        store.saveMessage(mensaje_objeto);
        escribirRespuesta(mensaje_objeto);

    }
}

var escribirRespuesta = function(obj){
    esconderLoad();

    addGala();

    messageSuccess = document.createElement("div");
    messageSuccess.className = "message received";
    messageSuccess.innerHTML = '<div class="message-block">'+obj.message+'</div><div class="time">'+obj.time+'</div>';

    _ventanaChat.appendChild(messageSuccess);

    addMessageClear();

    var _height = messageSuccess.offsetHeight+20;

    if(obj.possible_questions){


        var possibleQuestions = document.getElementsByClassName('possible-questions');
        for(var i= 0; i<possibleQuestions.length; i++){
            _ventanaChat.removeChild(possibleQuestions[i]);
        }

        messagePossibleQuestions = document.createElement("div");
        messagePossibleQuestions.className = "possible-questions";
        messagePossibleQuestions.innerHTML = '<p>¿Esto responde a tu pregunta? <a class="borrarPreguntasPosibles" id="bad">Si</a> - <a class="mostrarPreguntasPosibles">No</a></p><div class="hidden-possible-questions"><p>A lo mejor quisiste preguntar por esto:</p>'+obj.possible_questions+'</div>';
        messagePossibleQuestions.innerHTML+= '<div class="clear"></div>';
        _ventanaChat.appendChild(messagePossibleQuestions);

        _height= _height + messagePossibleQuestions.offsetHeight+20
    }


    if(obj.suggestion){
        messageSuggestionTopics = document.createElement("div");
        messageSuggestionTopics.className = "suggestion-topics";
        messageSuggestionTopics.innerHTML = obj.suggestion;
        _ventanaChat.appendChild(messageSuggestionTopics);

        addMessageClear();

        _height= _height + messageSuggestionTopics.offsetHeight+20;
    }

    _ventanaChat.scrollTop = _ventanaChat.scrollHeight-_height-35;
}

var escribirEnviarMensaje = function(message){
    if(message == '') return;

    var formatted_message = message.replace(/(?:\r\n|\r|\n)/g, '<br />');

    var obj_msg = {
        'from': 'user',
        'message': formatted_message,
        'time': currentTime()
    };
    //LC - RESTORE
    store.saveMessage(obj_msg);
    escribirMensaje(obj_msg);
    if(sesion){
        enviarMensaje(message);
    }else{
        sesion = true;
        enviarMensaje(start_message);
    }
}

var escribirMensaje = function(obj){
    if(sesion){
        _msjChat.value = '';

        addYo();

        struct = document.createElement("div");
        struct.className = "message send";
        struct.innerHTML = '<div class="message-meta"></div><div class="message-block"><p>'+obj.message+'</p></div><div class="time">'+obj.time+'</div>';

        _ventanaChat.appendChild(struct);

        addMessageClear();
    }
}

//-->JMC - Manejo de historial
var renderearConversacion = function(mensajesAnteriores){

    mostrarLoad();

    //setear contexto global
    context = JSON.stringify(mensajesAnteriores.context);

    //borrar contexto de cada watson
    for(var i = 0; i<mensajesAnteriores.conversation.length; i++){
        if(mensajesAnteriores.conversation[i].from == 'watson'){
            mensajesAnteriores.conversation[i].context = {};
            if(i+1 < mensajesAnteriores.conversation.length){
                mensajesAnteriores.conversation[i].possible_questions = '';
            }
        }
    }

    //agregar contexto al ultimo watson
    for(var i = mensajesAnteriores.conversation.length-1; i>=0; i--){
        if(mensajesAnteriores.conversation[i].from == 'watson'){
            mensajesAnteriores.conversation[i].context = mensajesAnteriores.context;
            break;
        }
    }

    for(var i = 0; i<mensajesAnteriores.conversation.length; i++){
        var c = mensajesAnteriores.conversation[i];
        if(c.from == 'watson'){
            escribirMensaje(c);
        }else{
            escribirMensaje(c);
        }
    }

}

var enviarMensaje = function(message) {

    mostrarLoad();

    var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    var params =  {
        "BGBAHeader": {
            "Identificadores": {
                "IdMensaje": {
                    "-schemaId": "HJP",
                    "#text": "1"
                },
                "IdMensajeAnterior": {
                    "-schemaId": "HJP",
                    "#text": "1"
                },
                "IdOperacion": {
                    "-schemaId": "HJP",
                    "#text": "1"
                }
            },
            "ModuloAplicativo": {
                "IdGalicia": "App-203",
                "IdConsumidor": "nlnotes.exe",
                "IdProveedor": "ArqCorp"
            },
            "Equipo": {
                "-ip": "10.1.6.30",
                "-nombre": "GAL069018"
            },
            "Origen": {
                "ModuloAplicativo": {
                    "IdGalicia": "App-203",
                    "IdConsumidor": "nlnotes.exe",
                    "IdProveedor": "ArqCorp"
                },
                "Canal": "Mod-203",
                "OrganizacionInterna": {
                    "-tipo": "CC",
                    "-id": "1253"
                },
                "Equipo": {
                    "-ip": "10.1.6.30",
                    "-nombre": "GAL069018"
                },
                "Terminal": "PLA0800",
                "FechaHoraCreacion": "2009-05-31T13:20:00.000-03:00",
                "Operador": {
                    "-schemaId": "LEGAJO",
                    "#text": "L0151335"
                },
                "Supervision": "L0151319"
            }
        },
        "Datos": {
            "TextoConsulta":message,
            "Contexto": Contextoanterior

        }
    }

    xhr.open("POST", PROXY_URL);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function() {
        if(xhr.readyState == 4 && xhr.status == 200) {

            var json_data = JSON.parse(xhr.responseText);

            Contextoanterior=json_data.Datos.Contexto;

            //params.Datos.Contexto = Contextoanterior;
            params.Datos.Contexto.USR_03_options=[];

            responder(json_data);
            console.log(json_data);
        }



    };

    horario = (currentTime());
    params.Datos.Contexto.USR_10_current_time=horario;

    vMsg = JSON.stringify(params);

    console.log(params);

    xhr.send(vMsg);
    console.log(message);

    return xhr;
}


String.prototype.replaceAll = function(search, replacement) {

    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};




var mostrarPreguntasPosibles = function(target){
    var $parent = target.parentElement.parentElement;

    var mensaje_html = $parent.getElementsByClassName('hidden-possible-questions')[0].innerHTML;

    var obj_msg = {
        'from': 'watson',
        'message': mensaje_html,
        'confidence': '',
        'time': currentTime()
    };

    //JMC - Manejo d ehistorial
    //LC - STORE
    store.saveMessage(obj_msg);

    escribirMensaje(obj_msg);

    borrarPreguntasPosibles(target);
}

var borrarPreguntasPosibles = function(target){
    var $parent = target.parentElement.parentElement;
    _ventanaChat.removeChild($parent);
}

//Estrellas
var estrella_actual = 1;
var estrellaHoverIn = function(e){
    var star = parseInt(e.target.getAttribute('data-star'));
    for(var i=1; i<=star; i++){
        var selector = document.querySelectorAll('[data-star="'+i+'"]')[0];
        var className = selector.className;
        if(className.indexOf('active')<0) {
            selector.className+= ' active';
        }
    }
}

var estrellaHoverOut = function(){
    for(var i=0; i<_estrellas.length; i++){
        var selector = _estrellas[i];
        var className = selector.className;
        if(className.indexOf('hold')<0) {
            selector.className = '';
        }
    }
}

var estrellaClick = function(event){
    event.preventDefault();
    var star = parseInt(event.target.getAttribute('data-star'));
    estrella_actual = star;
    for(var i=1; i<_estrellas.length; i++){
        var selector = _estrellas[i];
        selector.className = '';
    }
    for(var i=1; i<=star; i++){
        var selector = document.querySelectorAll('[data-star="'+i+'"]')[0];
        selector.className= 'active hold';
    }

    _enviarSatisfaccion.className = _enviarSatisfaccion.className.replace("active", "");
    _enviarSatisfaccion.className+= " active";
    enviarSatisfaccion(event);
}

var reiniciarEstrellas = function(){
    estrella_actual = 1;
    for(var i=0; i<_estrellas.length; i++){
        var selector = _estrellas[i];
        selector.className = '';
    }
    _enviarSatisfaccion.className = _enviarSatisfaccion.className.replace("active", "");
}


//Mensajes

//Load
messageLoad = document.createElement("div");
messageLoad.id = "load-message";
messageLoad.className = "load";

messageLoad.innerHTML = '<div class="loadind2"><div class="loading2-dot"></div><div class="loading2-dot"></div><div class="loading2-dot"></div></div>';

var mostrarLoad = function(){

    esconderLoad();
    _ventanaChat.appendChild(messageLoad);

    addMessageClear('clear-load');

    _ventanaChat.scrollTop = _ventanaChat.scrollHeight;
}
var esconderLoad = function(){
    var itemNode = document.getElementById("load-message");
    if(itemNode){
        itemNode.parentNode.removeChild(itemNode);
    }
    var itemNode = document.getElementById("clear-load");
    if(itemNode){
        itemNode.parentNode.removeChild(itemNode);
    }
}





var addMessageClear = function(id){
    var messageClear = document.createElement("div");
    messageClear.className = "clear";
    if(typeof id != "undefined") messageClear.id = id;
    _ventanaChat.appendChild(messageClear);
}
var currentTime=function(){var d = new Date();var t=_z(d.getHours(),2)+":"+_z(d.getMinutes(),2);return t;}
var _z=function(n, p){return (''+(Math.pow(10,p)+n)).slice(1)};

//-->JMC - Manejo de historial
var resetStore = function(){
    if (store) store.stop();
    if (store) store.clearConversation();
    store = new Store(renderearConversacion);
}

var Store = function(callback){
    var _ = this;
    var w = 'w', wl = 'wl';
    var timer;
    _.length = 0;

    this.init = function(){
        _.supported = isSupported();
        started = false;
        if(_.supported){
            if(!get(w,1) && !get(wl)){
                _.clearConversation();
            }else{
                _.length = get(wl);
            }
            x = null;
        }
    }

    this.stop = function(){
        if (timer) clearInterval(timer);
    }

    this.saveContext = function(context){
        if (!_.supported) return;
        var tmp = get(w,1);
        if(tmp != undefined){
            tmp.contexto = contexto
            save(w,tmp,1);
        }
    }

    this.saveMessage = function(message){
        if (!_.supported) return;
        var tmp = get(w,1);
        if(typeof tmp=="object"){
            tmp.conversation.push(message);
            _.length = tmp.conversation.length;
            save(w,tmp,1);
            save(wl,_.length);
        }else{
            _.clearConversation();
        }
        setTimer();
    }

    this.getConversation = function(){
        var tmp = get(w,1);
        if(tmp == undefined) return;
        if(JSON.stringify(tmp.contexto) == '{}' && !tmp.conversation.length) return;
        setTimer();
        return tmp;
    }

    this.clearConversation = function(){
        if (!_.supported) return;
        save(w,{contexto:{},conversation:[]},1);
        save(wl,0);
        _.length = 0;
        sesion = true;
    }

    var isSupported = function(){
        try{
            localStorage.setItem('supported', 'supported');
            localStorage.removeItem('supported');
            return true
        }catch (error){
            return false;
        }
    }

    var save = function(var_name, var_value, r){
        if (!_.supported) return;
        var tmp = JSON.stringify(var_value);
        //if(r) tmp=_e(tmp,var_name);
        localStorage.setItem(var_name,tmp);
    }

    var get = function(var_name, r){
        if (!_.supported) return;
        var tmp = localStorage.getItem(var_name);
        if (!tmp) return;
        //if (r) tmp=_d(tmp,var_name);
        if (r && tmp==false) return
        tmp = JSON.parse(tmp);
        return tmp;
    }

    var remove = function(var_name){
        if (!_.supported) return;
        localStorage.removeItem(var_name);
    }

    var setTimer = function(){
        started = true;
        timer = (!timer) ? setInterval(checkLength, 2000) : timer;
    }

    var checkLength = function() {
        var tmp = parseInt(get(wl));
        var diff = Math.abs(_.length - tmp);
        if(diff){
            var tmp = _.getConversation();
            if(typeof tmp=="object"){
                var l = tmp.conversation.length;
                tmp.conversation.splice(0, _.length);
                _.length = l;
                save(wl,_.length);
                callback(tmp);
            }else{
                _.clearConversation();
            }
        }
    }

    this.init();
}

var _m = sesion_time;
var _p=function(i){var d=new Date();if(i)d.setMinutes(d.getMinutes()-_m);var t =6E4*_m, ht=3E4*_m,b=d.getTime()+ht,c=b%t,r=Math.round(new Date(ht>=c?b-c:b+t-c).getTime()/1E3).toString();return r}
var _ls=function(){var _lsT=0,_xL,_x,_t;for(_x in localStorage){_xL=((localStorage[_x].length+_x.length)*2);_lsT+=_xL;}_t=(_lsT/1024).toFixed(2)+" KB";return _t}

//<--JMC - Manejo de historial



//Gala
var addGala = function(id){
    var sendGala = document.createElement("div");
    sendGala.className = "gala";
    sendGala.innerHTML = '<div class="gala">Gala</div>';
    if(typeof id != "undefined") sendGala.id = id;
    _ventanaChat.appendChild(sendGala);
}


//usuario
var addYo = function(id){
    var sendYo = document.createElement("div");
    sendYo.className = "yo";
    sendYo.innerHTML = '<div class="yo">Yo</div>';
    if(typeof id != "undefined") sendYo.id = id;
    _ventanaChat.appendChild(sendYo);
}


//
var store;
var sesion = true;
var sesion_time = 1;
var start_message = "hola";

//var Contextoanterior={"USR_10_current_time":"22:00"};
var Contextoanterior={};

var horario;

var _body;
var _abrirChat;
var _cerrarChat;
var _minimizarChat;
var _msjChat;
var _ventanaChat;

var _visorImg;
var _botonEnviar;
var _messengerCuerpo;

var _cerrarPopup;

var _satisfaccion;
var _enviarSatisfaccion;
var _cerrarSatisfaccion;
var _minimizarSatisfaccion;
var _estrellas;

var value;
var context = '';

// ---


// On load
document.addEventListener('DOMContentLoaded', function(event) {

    _body = document.getElementsByTagName("BODY")[0];
    _abrirChat = document.getElementsByClassName('launcher')[0];
    _messengerCuerpo = document.getElementsByClassName('messenger')[0];
    _cerrarChat = document.getElementById('closeChat');
    _minimizarChat = document.getElementById('minimizeChat');
    _msjChat = document.getElementById('chatMessage');
    _ventanaChat = document.getElementById('chatWindow');

    _visorImg = document.getElementById("viewer");
    _botonEnviar = document.getElementById("send-button");

    _satisfaccion = document.getElementById("satisfaction");
    _enviarSatisfaccion = document.getElementById("sendSatisfaction");
    _cerrarSatisfaccion = document.getElementById("closeSatisfaction");
    _minimizarSatisfaccion = document.getElementById("minimizeSatisfaction");
    _estrellas = document.querySelectorAll('[data-star]');

    // Internet Explorer 6-11
    var isIE = /*@cc_on!@*/false || !!document.documentMode;
    // if(isIE){
    //     document.getElementById("load-message").style.: = "none";
    //
    // }

    _abrirChat.addEventListener("click", abrirChat, false);
    _cerrarChat.addEventListener("click", cerrarChat, false);
    _minimizarChat.addEventListener("click", minimizarChat, false);

    _cerrarSatisfaccion.addEventListener("click", enviarSatisfaccionNula, false);
    _minimizarSatisfaccion.addEventListener("click", minimizarSatisfaccion, false);
    _enviarSatisfaccion.addEventListener("click", enviarSatisfaccion, false);

    _ventanaChat.addEventListener("click", chatWindowClick, false);


    for(var i = 0; i<_estrellas.length; i++){
        _estrellas[i].addEventListener("click", estrellaClick, false);
        _estrellas[i].addEventListener("mouseover", estrellaHoverIn, false);
        _estrellas[i].addEventListener("mouseout", estrellaHoverOut, false);
    }

    _msjChat.onkeypress = function (e) {
        if (e.keyCode == 13 && !e.shiftKey) {
            escribirEnviarMensaje(_msjChat.value);
            return false;
        }
    };

    _botonEnviar.addEventListener("click", botonEnviar, false);


    var meQuedoEnLaPag = true;

    window.onbeforeunload = function(e) {
        var className = _body.className;
        if(meQuedoEnLaPag && className.indexOf('display-chat')>-1) {
            meQuedoEnLaPag = false;
            return true;
        }
    }

    comenzarChat();

});
