const axios = require('axios').default
const url = 'https://pasaporte-croata-vrh-santiago.youcanbook.me/service/jsps/cal.jsp?cal=b3e40558-9d9d-4225-a957-39737e19c10d&ini=1659554624485'

function getFirstDayOfWeek(d) {
  // clone date object, so we don't mutate it
  const date = new Date(d);
  const day = date.getDay(); 
  // day of month - day of week (-6 if Sunday), otherwise +1
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(date.setDate(diff));
}

function format(d) {
  const format_array = d.toLocaleDateString('en-US').split('/').reverse()
  format_array.forEach( (element, i) => {
    if (element.length == 1) {
      format_array[i] = '0'+element
    }
  })
  
  return format_array.join('-')
}
function sumarDias(fecha, dias){
  fecha.setDate(fecha.getDate() + dias);
  return fecha;
}

function apiCall(url) {
  return axios({
    method: 'get',
    url ,
    responseType: 'json'
  })
}

const arr_dates = []
const actual_date = getFirstDayOfWeek( new Date() )
while (true) {
  const sgte_semana = sumarDias(actual_date, 7) 
  if (sgte_semana.getFullYear() == 2025) { // Limita a que solo busque hasta el 2025, cambiar si es necesario
    break
  }
  arr_dates.push( format( sgte_semana ) )
}
// console.log( arr_dates )

const results = []
arr_dates.forEach( async(date) => {
  try {
    const actual_url = (url + '&' + date)
    const res = await axios({
      method: 'get',
      url: actual_url  ,
      responseType: 'json'
    })
    if (res.status == 200 ) {
      const index =  res.data.search('Try another week') // Mensaje que aparece cuando esta todo ocupado
      if ( index == -1 ) {
        results.push( date )
      }
    }

  } catch (error) {
    console.log(error)
  }
})

if (results.length !== 0) {
  results.forEach( (date) => {
    console.log('Se ha encontrado fecha para '+date);
  })
}