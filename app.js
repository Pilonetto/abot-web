function nullZero(value, number){
    if (value == 0 ){
        return ''
    } else {
        if (number){
            return Number(value).toFixed(2)
        } else {
            return value
        }
    }
}

function checkContent(value) {
    if (value == ' / ')
        return ''
    else 
        return value
}

function updateValues() {
    jQuery.get('http://192.168.0.106:4321/cotacoes', function (data) {
        var obj = JSON.parse(JSON.parse(data));
        console.log(obj);
        var size = (Object.values(obj).length);
        if (size > 0) {
			var itens = '';
			for (m = 0; m <= size; m++) {
                if (obj[m]) {
                    let class_profit = 'profit_red'
                    if (obj[m].profit > 0){
                       class_profit = 'profit_blue'     
                    }

                    let icon_compra = 'color_white'
                    let info_compra = `Valor atual R$ ${obj[m].vl_atual}, valor estipulado para compra R$ ${obj[m].al_comprar}`
                    let info_venda = `Valor atual R$ ${obj[m].vl_atual}, valor estipulado para venda R$ ${obj[m].al_vender}`
                    if (obj[m].al_comprar <= 0 ) {
                        icon_compra = 'color_white'                        
                    } 
                    else {
                        if (obj[m].vl_atual <= obj[m].al_comprar){
                            icon_compra = 'profit_blue' 
                        } else {
                            icon_compra = 'color_white' 
                        }
                    }
                    let icon_venda = 'color_white'
                    if (obj[m].al_vender <= 0 ) {
                        icon_venda = 'color_white'
                    }
                    else {
                        if (obj[m].vl_atual >= obj[m].al_vender){
                            icon_venda = 'profit_blue' 
                        } else {
                            icon_venda = 'color_white' 
                        }
                    }

                    total_profit = 0;
                    if (obj[m].qtde > 0){
                        total_profit = obj[m].profit * obj[m].qtde; 
                    }
                    profit_row = checkContent(nullZero(obj[m].profit|| 0,true) +' / '+nullZero(total_profit|| 0,true))

                    itens += `<tr>
                    <th>${obj[m].empresa}</th>
                    <td>${nullZero(obj[m].qtde, false)}</td>
                    <td>${nullZero(obj[m].vl_pago,true)}</td>
                    <td>${nullZero(obj[m].vl_atual,true)}</td>
                    <td class= ${class_profit}>${profit_row} </td>
                    <td class="text-center"><i class=" ${icon_compra} fa fa-circle" aria-hidden="true" data-toggle="tooltip" title="${info_compra}"></i></td>
                    <td class="text-center"><i class=" ${icon_venda} fa fa-circle" aria-hidden="true" data-toggle="tooltip" title="${info_venda}"></i></td>
                    <td>${nullZero(obj[m].mme5 || 0,true)}</td>
                    <td>${nullZero(obj[m].mme15 || 0,true)}</td>
                    <td>${nullZero(obj[m].mme30 || 0,true)}</td>                    
                    <td>${nullZero(obj[m].fxmin45 || 0,true)}</td>
                    <td>${nullZero(obj[m].fxmax45 || 0,true)}</td>
                    <td>${nullZero(obj[m].fxminrg || 0,true)}</td>                    
                    <td>${nullZero(obj[m].fxmaxrg || 0,true)}</td>
                  </tr>`
                }
                if (m == size) {					
                    $('#ativos tbody').html(itens);	
                    let dateObj = new Date()

                    let dateString = dateObj.toLocaleString('pt-BR', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute:'2-digit',
                        second:'2-digit'
                    }).replace(/\//g, '-')
                    $('#dtupdate').html('Atualizado as: ' + dateString);	
                    
				}				
            }
        }
    })

}

$(document).ready(function () {
    updateValues();
})

setInterval(() => {
    updateValues();  
}, 5000);