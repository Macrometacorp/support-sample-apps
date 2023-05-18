import { header } from "./parts/header"
import { footer } from "./parts/footer"
import { sidebar } from "./parts/sidebar"
import { navBar } from "./parts/nav"
import { forReg } from "../util"
export function tenant(data, session, reqBody, url) {
    let name = `<div><strong>Name: </strong>${data.result[0]._account[0].Firstname} ${data.result[0]._account[0].Lastname}</div></li> <li><div> <strong>Country: </strong> ${data.result[0]._account[0].Country}</div>`
    if (data.result[0]._account[0].Lastname === 'Name') {
        name = '<div>We dont have name or country of this tenant</div>'
    }
    return `
    ${header}
    </head>
<body class="bg-light text-dark">
<main class="d-flex flex-nowrap tenant-page">
    ${sidebar(url)}

    <div class="container text-left p-3">
    
    ${navBar(session)}
    

        <div class="justify-content-right row row-cols-3 row-cols-md-3 mb-3 text-left">

            <div class="col px-0 card text-dark">
                    <div class="card-header py-3 text-bg bg-white">
                        <h4 class="my-0">${reqBody.federation.toUpperCase()} federation</h4>

                    </div>

    <div class="card-body bg-white">
        ${forReg(data.result[0].regions)}
        <ul class="list-unstyled mt-3 mb-0">
            <li><strong>Tenant:</strong> ${data.result[0].tenantName}</li>
            <li><strong>Display Name:</strong> ${data.result[0]._tenants[0].displayName}</li>
            <li>${name}</li>
            <li><strong>Plan:</strong> ${data.result[0]._tenants[0].Plan}</li>
            <li><strong>Status:</strong> ${data.result[0].Status === true ? "Active" : "Suspended"}</li>
            <li><strong>Created:</strong> ${data.result[0]._tenants[0].Created}</li>
        </ul>
    </div>
            </div >
        </div >


    ${footer}


`
}