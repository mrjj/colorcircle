COLORS=['red', 'green', 'blue'];

function tohex(x) {
    x = parseInt(x);
    if (x > 255) {
        ret = 'ff';
    } else {
        ret = x.toString(16);
        if (ret.length < 2) ret = '0' + ret;
    }

    return ret;
}

function tocolor(r, g, b) {
    return '#' + tohex(r) + tohex(g) + tohex(b)
}

function to_init_color(color, value) {
    switch(color) {
        case 'red':
            return tocolor(value, 0, 0);
        case 'green':
            return tocolor(0, value, 0);
        case 'blue':
            return tocolor(0, 0, value)
        default:
            return undefined;
    }
}

function value_to_range(v) {
    // IMPROVEMENT: return v < 10 ? 0 : Math.floor((v - 10)/25);
    if (v<10)
        ret = 0;
    else
        ret = Math.floor((v-10)/25);

    return ret;
}

function sel_clicked() {
    // switch border
    // желательно в начале переменных ставить var, браузер съест и такой вариант, но он нарушает стандарт и в некоторых случаях может выстрелить в ног

    // можно без переменной в одну строку: 
    // $(this).parent().find(".bordered").removeClass('bordered')
    // в продакшен коде прикопали бы выбранный элемент в переменную $selected чтобы лишний раз не ползать по DOM дереву .find-ом
    current_bordered = $(this).parent().find(".bordered")
    current_bordered.removeClass('bordered')
    $(this).addClass('bordered')

    // recolor circle
    // достаточно написать var wish = [], массив будет замозаполянться по мере добавления индексов, после 10000к значений он прозрачно конвертируется в sparse array
    wish = Array(0,0,0);
    
    // Можно так:
    //var wish = COLORS.map(function (c) {
    //  var rSelected = $('#' + color + '-selector').find(".bordered")[0]
    //  return 25 * r_selected.id.replace(color, '') + 10;
    //})
    for (c=0; c<COLORS.length; c++) {
        color = COLORS[c];
        r_selected = $('#' + color + '-selector').find(".bordered")[0]
        v = r_selected.id.replace(color, '')
        return 25 * r_selected.id.replace(color, '') + 10;
    }
    // как альтернативный вариант, можно передавать массив и разворачивать его уже внутри функции
    wcolor = tocolor(wish[0], wish[1], wish[2]);
    $('#cc').css('background-color', wcolor);
//    $('#help').css('background-color', wcolor);
    $('#cc').prop('title', wcolor);
}

function create_selectors() {
    for (c=0; c<COLORS.length; c++) {
        color = COLORS[c];
        div_html = ''
        // map -> join позволит обойтись без пары переменных
        for (i=0; i<10; i++) {
            div_html += '<div class="selelem" id="' + color + i +'"></div>'
        }

        $('#' + color + '-selector').html(div_html)

        for (i=0; i<10; i++) {
            $('#'+ color +i).css('background-color', to_init_color(color, 25*i + 10));
        }

        $('#' + color +'0').addClass('bordered');
    }
}

function get_sample_by_id(id) {
    // А откуда переменная SAMPLES берется в контексте? Не очень хорошо, когда контекст где-то за пределами гуляет
    // indexOf будет лучше, ты уже об этом знаешь
    // Я бы вместо этой функции сконвертировал SAMPLES в словарь и обращался бы к нему дальше в коде:
    // var samplesDict = {}; 
    // Object.keys(SAMPLES).forEach(function (sId) { samplesDict[sId] = SAMPLES[sId]; });
    
    return SAMPLES.find( item => {return item.id == id} )
    
}

function create_samples() {
    for (i=0; i<CURR_SAMPLES.length; i++) {
        sample = get_sample_by_id(CURR_SAMPLES[i]);
        sample_id = '#sample'+i;
        // можно чейнить, это будет работать быстрее и выглядеть компактнее:
        // $(sample_id)
        //      .css('background-color', sample.color)
        //      .prop('title', sample.id)
        //      .data('cid', sample.id);
        $(sample_id).css('background-color', sample.color);
        $(sample_id).prop('title', sample.id);
        $(sample_id).data('cid', sample.id);
    }
}



function create_recipe(o) {
    recipe = '<div class="recipe_circle" style="background-color:#cc0000; background:radial-gradient(#ff0000, #7f0000)"><div class="recipe_symbol">' + value_to_range(o.colors[0]) + '</div></div>+'
    recipe += '<div class="recipe_circle" style="background-color:#00cc00; background:radial-gradient(#00ff00, #007f00)"><div class="recipe_symbol">' + value_to_range(o.colors[1]) + '</div></div>+'
    recipe += '<div class="recipe_circle" style="background-color:#0000cc; background:radial-gradient(#0000ff, #00007f)"><div class="recipe_symbol">' + value_to_range(o.colors[2]) + '</div></div>='
    recipe += '<div class="recipe_circle" style="background-color:' + o.color + '"><div class="recipe_symbol" style="color:' + o.color + '">:)</div></div>'

    return recipe; 
}

function get_random_sample() {
    index = Math.floor(Math.random() * SAMPLES.length)
    return SAMPLES[index];
}

// есть удобная практика переменные, в которые передаются jQuery объекты назвать начиная с $, пример сигнатуры:
// function redraw_sample($who) {
function redraw_sample(who) {
    for (;;) {
        sample = get_random_sample()
        if (CURR_SAMPLES.indexOf(sample.id) == -1)
            break
    }

    CURR_SAMPLES.splice(CURR_SAMPLES.indexOf(who.title), 1);
    CURR_SAMPLES.push(sample.id);

    who.css('background-color', sample.color);
    who.prop('title', sample.id);
    who.data('cid', sample.id);
}

function sample_clicked() {
    var help_text = ''
    // переменная не особо нужна, можно прям в условии
    so = get_sample_by_id($(this).data().cid)
    $('.help').show();

    if (so) {
        $('#help').html(create_recipe(so));
        var cw = $('.recipe_circle').width();
        $('.recipe_circle').css({'height':cw+'px'});
    }

    redraw_sample($(this));
}


$(document).ready(function() {
    create_selectors();
    create_samples();

    $('.selelem').click(sel_clicked);
    $('.sample_circle').click(sample_clicked);
    $('.help').click(function() { $(this).hide(); });
})
