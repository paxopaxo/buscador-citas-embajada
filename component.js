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
    url,
    responseType: 'json'
  })
}

let arr_dates = []
const actual_date = getFirstDayOfWeek( new Date() )
while (true) {
  const sgte_semana = sumarDias(actual_date, 7) 
  if (sgte_semana.getFullYear() == 2025) { // Limita a que solo busque hasta el 2025, cambiar si es necesario
    break
  }
  arr_dates.push( format( sgte_semana ) )
}
arr_dates = arr_dates.map( date => url + '&' + date )
// console.log( arr_dates )

const main = async() => {
  try {
    const results = []
    const sin_fecha = []
    const responses = await Promise.all( arr_dates.map( date => apiCall(date)) )
    responses.forEach( (res) => {
  
      if (res.status == 200 ) {
        const index =  res.data.search('Try another week') // Mensaje que aparece cuando esta todo ocupado
        const date = res.request.path.slice(-10) 
        if ( index == -1 ) {
          results.push( date )
        } else {
          sin_fecha.push(date)
        }
      }
  
    })
  
    if (results.length !== 0) {
      results.forEach( (date) => {
        console.log('Se ha encontrado fecha para '+date);
      })
    } else {
      console.log('No se ha encontrado fecha alguna')
    }

  } catch (error) {
    console.log(error)
  }
}
main() 
