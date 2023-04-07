//This function is used to flatten nested objects 
//and is used primarily on the GDN limits page.
export function flattenObject(ob) {
  const toReturn = {}

  for (const i in ob) {
    if (!ob.hasOwnProperty(i)) continue

    if ((typeof ob[i]) === 'object' && ob[i] !== null) {
      const flatObject = flattenObject(ob[i])
      for (const x in flatObject) {
        if (!flatObject.hasOwnProperty(x)) continue

        toReturn[i + '.' + x] = flatObject[x]
      }
    } else {
      toReturn[i] = ob[i]
    }
  }
  return toReturn
}
//This function is used to create HTML list elements from arrays and objects.
export function forFunc(d) {
  if (Object.keys(d).length === 0) {
    return '<li class="list-group-item">Tenant has default limits, check link <a target="_blank" href="https://macrometa.com/docs/references/quotas">Limits</a></li>'
  } else {
    let div = ''
    for (const i in d) {
      let email = ""
      if (Array.isArray(d)) {
        for (let a in d[i]) {
          if (a === "PeriodEnd" || a === "PeriodStart" || a === "Created") {
            email += `<div class="d-inline"> <b>${a}:</b> ${new Date(d[i][a] * 1000).toUTCString()}  </div>`

          }
          else {
            email += `<div class="d-inline"> <b>${a}:</b> ${d[i][a]}  </div> `
          }
        }
        div += `<li class="list-group-item"> ${email} </li> `
      }
      else {
        div += `<li class="list-group-item" data-value="${JSON.stringify(d[i])}"> ${i} <b>${JSON.stringify(d[i])}</b>  </li> `
      }
    }
    return div
    // }
  }

}
export function crateTable(data, baseUrl, offset, condition, check) {

  const keys = Object.keys(data[0])
  let th = ' <th scope="col"></th>'
  for (i of keys) {

    th = th + ` <th scope="col">${i}</th>`
  }
  let table = ""
  let num = offset != null ? parseInt(offset) + 1 : 1
  for (i of data) {
    let td
    if (condition) {
      if ((i.User == "root") && check) {
        td = `<tr style="background:#F0F0FE" role="button" onclick="document.location='${i.Email === undefined ? baseUrl + "/" + i.Tenant + "/" + i.Federation?.toLowerCase() : baseUrl + "/" + i.Email + "/" + i.Federation.toLowerCase()}'"> `
      }
      else {
        td = `<tr role="button" onclick="document.location='${i.Email === undefined ? baseUrl + "/" + i.Tenant + "/" + i.Federation?.toLowerCase() : baseUrl + "/" + i.Email + "/" + i.Federation.toLowerCase()}'"> `

      }
    }
    else {
      td = `<tr>`
    }
    td = td + `<th scope="row">${num}</th>`
    for (a in i) {
      td = td + ` <td>${i[a]}</td>`
    }
    td = td + "</tr>"
    table = table + td
    num++
  }
  return `
  <table class="table table-hover">
  <thead>
    <tr>
     ${th}
    </tr>
  </thead>
  <tbody>
    ${table}
  </tbody>
</table>
  `
}

//This function is used to read requsetBody and return it in the correct format
export async function readRequestBody(request) {
  const { headers } = request
  const contentType = headers.get('content-type')
  if (contentType.includes('application/json')) {

    const body = await request.json()
    return JSON.stringify(body)
  } else if (contentType.includes('application/text')) {

    const body = await request.text()
    return body
  } else if (contentType.includes('text/html')) {
    const body = await request.text()
    return body
  } else if (contentType.includes('form')) {

    const formData = await request.formData()
    const body = {}
    for (const entry of formData.entries()) {
      body[entry[0]] = entry[1]
    }
    return body
  } else {
    const myBlob = await request.blob()
    const objectURL = URL.createObjectURL(myBlob)
    return objectURL
  }
}
//This function is used to prepare data for the Chart script that is used in the User usage page.
export function fixData(data, v) {
  length = data.length;
  let labels = [];
  let values = [];
  for (let i = 0; i < length; i++) {
    labels.push(data[i].labels);
    values.push(Math.round(data[i][v]));


  }

  return { labels: labels, values: values }
}



export function workersFunc(data, num) {
  let html = ""
  if (data.length !== 0) {
    for (i of data) {
      let div = `
    <div class="accordion-item">
    <h2 class="accordion-header" id="panels${num}">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-${num}" aria-expanded="false" aria-controls="panelsStayOpen-${num}">
        <div>
          <div><strong>Name: </strong> ${i.Name}</div>
          ${i.Type !== undefined ? '  <div><strong> Type: </strong> ' + i.Type + '</div>' : ''}
          <div><strong> Fabric: </strong> ${i.Fabric}</div>
          <div><strong>User: </strong>${i.User}</div>
          ${i.isActive !== undefined ? '<div><strong>IsActive: </strong>' + i.isActive + '</div>' : ''}
          ${i.Regions !== undefined ? '<div><strong>Regions: </strong>' + i.Regions + '</div>' : ''}
        </div >
      </button >
    </h2 >
    <div id="panelsStayOpen-${num}" class="accordion-collapse collapse" aria-labelledby="panelsStayOpen-${num}">
      <div class="accordion-body">
        <pre>${i.Query}</pre>
      </div>
    </div>
  </div >
    `
      num = num + 1
      html = html + div

    }
    return html
  }
  else {
    return `<div><strong>User doesn't have any ${num} worker</strong></div>`
  }
}

export function sumNum(data, field) {
  const initialValue = 0;
  const sumWithInitial = data.reduce(
    (accumulator, object) => accumulator + object[field], initialValue);
  return sumWithInitial
}

export function hubspotFunc(data, num) {
  let html = ""
  for (i of data) {
    let div = `
    <div class="accordion-item">
    <h2 class="accordion-header" id="panels${num}">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-${num}" aria-expanded="false" aria-controls="panelsStayOpen-${num}">
       <div>`
    for (c in i) {
      if (c !== "Body")
        div = div + `    <div><strong>${c}: </strong> ${i[c]}</div>
      `
    }

    div = div + `</div>
      </button >
    </h2 >
    <div id="panelsStayOpen-${num}" class="accordion-collapse collapse" aria-labelledby="panelsStayOpen-${num}">
      <div class="accordion-body">
        <code>${i.Body}</code>
      </div>
    </div>
  </div >
    `
    num = num + 1
    html = html + div

  }
  return html

}

export function jsonToCSv(json) {
  var fields = Object.keys(json[0])
  var replacer = function (key, value) { return value === null ? '' : value }
  var csv = json.map(function (row) {
    return fields.map(function (fieldName) {
      return JSON.stringify(row[fieldName], replacer)
    }).join(',')
  })
  csv.unshift(fields.join(',')) // add header column
  csv = csv.join('\r\n');
  return csv
}

export function forReg(array) {
  let div = "<b>Regions:</b>"
  for (i of array) {
    let a = `<h6 class="my-0 mb-1 fw-normal fs-6">${i._key}</h6>
    `
    div = div + a
  }
  return div
}