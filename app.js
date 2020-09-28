var linkApi = 'http://192.168.1.75:4321';

// begin chart
var lbl = [];
var dados15 = [];
var dados45 = [];
var dados70 = [];
var lineChartData = {
  labels: lbl,
  datasets: [
    {
      label: 'Média Móvel 15',
      borderColor: '#51f542',
      backgroundColor: '#51f542',
      fill: false,
      data: [],
      //   yAxisID: 'y',
    },
    {
      label: 'Média Móvel 45',
      borderColor: '#f5ad42',
      backgroundColor: '#f5ad42',
      fill: false,
      data: [],
      //   yAxisID: 'y1',
    },
    {
      label: 'Média Móvel 70',
      borderColor: '#f55442',
      backgroundColor: '#f55442',
      fill: false,
      data: [],
      //   yAxisID: 'y2',
    },
  ],
};

var ctx = document.getElementById('canvas').getContext('2d');
window.myLine = new Chart(ctx, {
  type: 'line',
  data: lineChartData,
  options: {
    responsive: true,
    hoverMode: 'index',
    stacked: false,
    title: {
      display: true,
      text: 'Análise da média móvel',
    },
    tooltips: {
      mode: 'index',
      intersect: false,
    },
    hover: {
      mode: 'nearest',
      intersect: true,
    },
    scales: {
      xAxes: [
        {
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Data da movimentação',
          },
        },
      ],
      yAxes: [
        {
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Valor de fechamento(R$)',
          },
        },
      ],
    },
    // scales: {
    //   y: {
    //     type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
    //     display: true,
    //     position: 'left',
    //   },
    //   y1: {
    //     type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
    //     display: true,
    //     position: 'left',
    //   },
    //   y2: {
    //     type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
    //     display: true,
    //     position: 'right',

    //     // grid line settings
    //     gridLines: {
    //       drawOnChartArea: false, // only want the grid lines for one axis to show up
    //     },
    //   },
    // },
  },
});

// end chart
function nullZero(value, number) {
  if (value == 0) {
    return '';
  } else {
    if (number) {
      return Number(value).toFixed(2);
    } else {
      return value;
    }
  }
}

function toolTipCompra(acao, pa, al) {
  let titulo = 'Não comprar';
  let sub = acao + ' Acima do preço de compra';
  let texto = `O preço de compra está estipulado em R$ ${al}, e o preço atual é ${pa}`;
  if (al <= pa) {
    titulo = 'Comprar';
    sub = acao + ' Atingiu o preço de compra';
  }

  let text = `<div class='card' style='width: 18rem;'>
                    <div class='card-body'>
                    <h5 class='card-title'>${titulo}</h5>
                    <h6 class='card-subtitle mb-2 text-muted'>${sub}</h6>
                    <p class='card-text'>${texto}.</p>
                    </div>
                </div>`;

  return text;
}

function clickmme(value) {
  jQuery.get(linkApi + '/mediamovel/' + value, function (data) {
    var obj = JSON.parse(JSON.parse(data));

    var size = Object.values(obj).length - 1;
    if (size > 0) {
      lbl = [];
      dados15 = [];
      dados45 = [];
      dados70 = [];
      for (m = 0; m <= size; m++) {
        console.log(obj[m]);
        if (obj[m]) {
          lbl.push(obj[m].Date);
          dados15.push(obj[m].mme15);
          dados45.push(obj[m].mme45);
          dados70.push(obj[m].mme70);
        }
        if (m == size) {
          lbl = lbl.reverse();
          dados15 = dados15.reverse();
          dados45 = dados45.reverse();
          dados70 = dados70.reverse();

          lineChartData.labels = lbl;
          lineChartData.datasets[0].data = dados15;
          lineChartData.datasets[1].data = dados45;
          lineChartData.datasets[2].data = dados70;
          window.myLine.update();

          $('#modalMMe').modal();
        }
      }
    }
  });
}

function checkContent(value) {
  if (value == ' / ') return '';
  else return value;
}

function updateValues() {
  jQuery.get(linkApi + '/cotacoes', function (data) {
    var obj = JSON.parse(JSON.parse(data));

    var size = Object.values(obj).length;
    if (size > 0) {
      var itens = '';
      for (m = 0; m <= size; m++) {
        if (obj[m]) {
          let class_profit = 'profit_red';
          if (obj[m].profit > 0) {
            class_profit = 'profit_blue';
          }

          let icon_compra = 'color_white';
          let info_compra = `Valor atual R$ ${obj[m].vl_atual}, valor estipulado para compra R$ ${obj[m].al_comprar}`;
          let info_venda = `Valor atual R$ ${obj[m].vl_atual}, valor estipulado para venda R$ ${obj[m].al_vender}`;
          if (obj[m].al_comprar <= 0) {
            icon_compra = 'color_white';
          } else {
            if (obj[m].vl_atual <= obj[m].al_comprar) {
              icon_compra = 'profit_blue';
            } else {
              icon_compra = 'color_white';
            }
          }
          let icon_venda = 'color_white';
          if (obj[m].al_vender <= 0) {
            icon_venda = 'color_white';
          } else {
            if (obj[m].vl_atual >= obj[m].al_vender) {
              icon_venda = 'profit_blue';
            } else {
              icon_venda = 'color_white';
            }
          }

          let txtmme = 'Média móvel mostra um padrão neutro!';
          let classmme = 'color_white';

          let iconmme = 'color_white';
          if (obj[m].stsmme == 0) {
            txtmme = 'Média móvel mostra um padrão de queda!';
            classmme = 'profit_red';
            iconmme = 'fa-arrow-circle-down';
          }
          if (obj[m].stsmme == 1) {
            txtmme = 'Média móvel mostra um padrão neutro!';
            classmme = 'color_white';
            iconmme = 'fa-arrow-circle-right';
          }
          if (obj[m].stsmme == 2) {
            txtmme = 'Média móvel mostra um padrão de alta!';
            classmme = 'profit_blue';
            iconmme = 'fa-arrow-circle-up';
          }
          //let tooltipalcompra = toolTipCompra(obj[m].empresa, obj[m].vl_atual, obj[m].al_comprar);

          total_profit = 0;
          if (obj[m].qtde > 0) {
            total_profit = obj[m].profit * obj[m].qtde;
          }
          profit_row = checkContent(nullZero(obj[m].profit || 0, true) + ' / ' + nullZero(total_profit || 0, true));
          itens += `<tr>
                    <th>${obj[m].empresa}</th>
                    <td>${nullZero(obj[m].qtde, false)}</td>
                    <td>${nullZero(obj[m].vl_pago, true)}</td>
                    <td>${nullZero(obj[m].vl_atual, true)}</td>
                    <td class= ${class_profit}>${profit_row} </td>
                    <td class="text-center"><i class=" ${icon_compra} fa fa-circle" aria-hidden="true" data-toggle="tooltip" title='${info_compra}'></i></td>
                    <td class="text-center"><i class=" ${icon_venda} fa fa-circle" aria-hidden="true" data-toggle="tooltip" title="${info_venda}"></i></td>
                    <td class="text-center" onclick='clickmme("${
                      obj[m].empresa
                    }");'><i class="fa ${iconmme} ${classmme}"  data-toggle="tooltip" title='${txtmme}'></i> </td>                 
                    <td>${nullZero(obj[m].fxmin45 || 0, true)}</td>
                    <td>${nullZero(obj[m].fxmax45 || 0, true)}</td>
                    <td>${nullZero(obj[m].fxminrg || 0, true)}</td>                    
                    <td>${nullZero(obj[m].fxmaxrg || 0, true)}</td>
                  </tr>`;

          //   itens += `<tr>
          //             <th>${obj[m].empresa}</th>
          //             <td>${nullZero(obj[m].qtde, false)}</td>
          //             <td>${nullZero(obj[m].vl_pago, true)}</td>
          //             <td>${nullZero(obj[m].vl_atual, true)}</td>
          //             <td class= ${class_profit}>${profit_row} </td>
          //             <td class="text-center"><i class=" ${icon_compra} fa fa-circle" aria-hidden="true" data-toggle="tooltip" title='${info_compra}'></i></td>
          //             <td class="text-center"><i class=" ${icon_venda} fa fa-circle" aria-hidden="true" data-toggle="tooltip" title="${info_venda}"></i></td>
          //             <td onclick='clickmme("${obj[m].empresa}");'>${nullZero(obj[m].mme5 || 0, true)}</td>
          //             <td>${nullZero(obj[m].mme15 || 0, true)}</td>
          //             <td>${nullZero(obj[m].mme30 || 0, true)}</td>
          //             <td>${nullZero(obj[m].fxmin45 || 0, true)}</td>
          //             <td>${nullZero(obj[m].fxmax45 || 0, true)}</td>
          //             <td>${nullZero(obj[m].fxminrg || 0, true)}</td>
          //             <td>${nullZero(obj[m].fxmaxrg || 0, true)}</td>
          //           </tr>`;
        }
        if (m == size) {
          $('#ativos tbody').html(itens);
          let dateObj = new Date();

          let dateString = dateObj
            .toLocaleString('pt-BR', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            })
            .replace(/\//g, '-');
          $('#dtupdate').html('Atualizado as: ' + dateString);
        }
      }
    }
  });
}

$(document).ready(function () {
  updateValues();
});

setInterval(() => {
  updateValues();
}, 5000);
