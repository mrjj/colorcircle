COLORS=['red', 'green', 'blue'];
SAMPLES = [
    new Object({ 'id':'indigo', 'color': '#4B0082', 'colors':[0x4b, 0x00, 0x82], 'name':'индиго'}),
    new Object({ 'id':'darkolivegreen', 'color': '#556B2F', 'colors':[0x55, 0x6b, 0x2f], 'name':'оливковый'}),
    new Object({ 'id':'hotpink', 'color': '#FF69B4', 'colors':[0xff, 0x69, 0xb4], 'name': 'розовый'}),
    new Object({ 'id':'lightcyan', 'color': '#E0FFFF', 'colors':[0xe0, 0xff, 0xff], 'name':'светлый циан'})
];

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

function sel_clicked() {
    // switch border
    current_bordered = $(this).parent().find(".bordered")
    current_bordered.removeClass('bordered')
    $(this).addClass('bordered')

    // recolor circle
    wish = Array(0,0,0);
    for (c=0; c<COLORS.length; c++) {
        color = COLORS[c];

        r_selected = $('#' + color + '-selector').find(".bordered")[0]
        v = r_selected.id.replace(color, '')
        wish[c] = 25*v + 10;
    }

    wcolor = tocolor(wish[0], wish[1], wish[2]);
    $('#cc').css('background-color', wcolor);
    $('#cc').prop('title', wcolor);
}

function create_selectors() {
    for (c=0; c<COLORS.length; c++) {
        color = COLORS[c];
        div_html = ''

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

function create_samples() {
    for (i=0; i<SAMPLES.length; i++) {
        sample = SAMPLES[i];
        $('#'+sample.id).css('background-color', sample.color);
        $('#'+sample.id).prop('title', sample.name);
    }
}

function value_to_range(v) {
    if (v<10)
        ret = 0;
    else
        ret = Math.floor((v-10)/25);

    return ret;
}

function create_recipe(o) {
    recipe = '<div class="recipe_circle" style="background-color:#cc0000"><div class="recipe_symbol">' + value_to_range(o.colors[0]) + '</div></div>+'
    recipe += '<div class="recipe_circle" style="background-color:#00cc00"><div class="recipe_symbol">' + value_to_range(o.colors[1]) + '</div></div>+'
    recipe += '<div class="recipe_circle" style="background-color:#0000cc"><div class="recipe_symbol">' + value_to_range(o.colors[2]) + '</div></div>='
    recipe += '<div class="recipe_circle" style="background-color:' + o.color + '"><div class="recipe_symbol" style="color:' + o.color + '">:)</div></div>'

    return recipe; 
}

function sample_clicked() {
    var help_text = ''

    so = SAMPLES.find( item => {return item.id == this.id} )
    $('.help').show();

    if (so) {
        $('#help').html(create_recipe(so));
        var cw = $('.recipe_circle').width();
        $('.recipe_circle').css({'height':cw+'px'});
    }
}


$(document).ready(function() {
    create_selectors();
    create_samples();

    $('.selelem').click(sel_clicked);
    $('.sample_circle').click(sample_clicked);
    $('.help').click(function() { $(this).hide(); });
})
