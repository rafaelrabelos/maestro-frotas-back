function dataTempoFormatada(dataTempo = ""){
  const data = new Date(dataTempo),
        dia  = data.getDate().toString(),
        diaF = (dia.length == 1) ? '0'+dia : dia,
        mes  = (data.getMonth()+1).toString(),
        mesF = (mes.length == 1) ? '0'+mes : mes,
        ano = data.getFullYear().toString(),
        anoF = data.getFullYear().toString(),
        hora = data.getHours().toString(),
        horaF = (hora.length == 1) ? '0'+hora : hora,
        min = data.getMinutes().toString(),
        minF = (min.length == 1) ? '0'+min : min,
        sec = data.getSeconds().toString();
        secF = (sec.length == 1) ? '0'+sec : sec;
  
  return `${diaF}/${mesF}/${anoF} ${horaF}:${minF}:${secF}`;
}

module.exports = { dataTempoFormatada };