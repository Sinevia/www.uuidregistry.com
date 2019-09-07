/* START: Configuration */
$$.config({
    rootUrl: 'http://uuidregistry.com/',
    apiUrl: 'http://sinevia.azurewebsites.net/uuidregistry/api/v3/index.php',
    required: [
        '//maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css',
        '//maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap.min.css',
        '//maxcdn.bootstrapcdn.com/bootswatch/3.3.0/darkly/bootstrap.min.css',
        'shared/main.css',
        '//maxcdn.bootstrapcdn.com/bootstrap/3.3.1/js/bootstrap.min.js',
        'shared/js/WebService.js',
        'shared/vegas/jquery.vegas.css',
        'shared/vegas/jquery.vegas.js',
    ]
});
$$.initialize();
/* END: Configuration */

/* START: Initialize */
$$.user = function (user) {
    if (typeof user !== 'undefined') {
        this.registry().set('CurrentUser', user);
        return true;
    }
    return this.registry().get('CurrentUser');
};
$$.api = function () {
    return new WebService(this.config().apiUrl);
};
$$.apiToken = function (token) {
    if (typeof token !== 'undefined') {
        this.registry().set('CurrentToken', token);
        return true;
    }
    return this.registry().get('CurrentToken');
};
/* END: Initialize */
console.log('Initialized');

$(function () {
    function shuffle(o) { //v1.0
        for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
    }
    
    var vegasOverlays = ['01.png', '02.png', '03.png', '04.png', '05.png', '06.png', '07.png', '08.png', '09.png', '10.png', '11.png', '12.png', '13.png'];
    var vegasBackgrounds = [
        'ceco_cvete.jpg',
        'ceco_harvatska.jpg',
        'ceco_harvatska_vodopad_1.jpg',        
        'ceco_harvatska_vodopad_2.jpg',        
        'ceco_malko_spano_more.jpg',
        'ceco_malko_zalezno.jpg',
        'ceco_pirin_bilo.jpg',
        'ceco_pirin_magla.jpg',
        'ceco_pirin_magla_2.jpg',
        'ceco_pirin_na_lunna_svetlina.jpg',
        'ceco_pirin_vrah_todorka_po_palnolunie.jpg',
        'ceco_tatrite.jpg',
        'ceco_vihren.jpg'
        //'expl0126.jpg',
        //'expl0404.jpg',
        //'nssl0010.jpg',
        //'expl0405.jpg',
        //'expl0411.jpg'
    ];
    setInterval(function () {
        var rand = vegasOverlays[Math.floor(Math.random() * vegasOverlays.length)];
        $.vegas('overlay', {
            src: $$.config().rootUrl + 'shared/vegas/overlays/' + rand
        });
    }, 10000);
    
    for (var i = 0; i < vegasOverlays.length; i++) {
        var img = new Image();
        img.src = $$.config().rootUrl + 'shared/vegas/overlays/' + vegasOverlays[i];
    }
    
    var vegasBackgroundsArray = [];
    vegasBackgrounds = shuffle(vegasBackgrounds);
    for (var i = 0; i < vegasBackgrounds.length; i++) {
        vegasBackgroundsArray.push({src: $$.config().rootUrl + 'shared/vegas/images/' + vegasBackgrounds[i], fade: 2000});
    }
    $.vegas('slideshow', {
        delay: 10000,
        backgrounds: vegasBackgroundsArray
    });
    $.vegas('overlay', {
        src: $$.config().rootUrl + 'shared/vegas/overlays/02.png'
    });
});