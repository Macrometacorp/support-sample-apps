import { hubspotFunc, forFunc } from '../util'
import { header } from "./parts/header"
import { navBar } from "./parts/nav"
import { footer } from "./parts/footer"
import { sidebar } from "./parts/sidebar"


export function hubspot(data, contact, session, url) {
    return `
    ${header}
    </head>
<body class="bg-light text-dark">
<main class="d-flex flex-nowrap hubspot-page">
    ${sidebar(url, "")}
    <div class="container text-right p-3">
        ${navBar(session)}
    
        <div class="container">
            <div class="row">
                <div class="col-sm card px-0 me-3 mb-3">
                    <div class="card-header py-3 text-bg ">
                        <h4 class="my-0 fw-normal">Hubspot Contact Info:</h4>
                    </div>
                    <div class="card-body">
                    ${contact.result.length == 0 ? `We dont have this user in HUBSPOT!` : ` <ul class="list-unstyled mt-3 mb-4">
            <li><strong>Firstname:</strong> ${contact.result[0].data.properties.firstname}</li>
            <li><strong>Lastname:</strong> ${contact.result[0].data.properties.lastname}</li>
            <li><strong>Email:</strong> ${contact.result[0].data.properties.email}</li>
            <li><strong>Created:</strong> ${contact.result[0].data.properties.createdate}</li>
            <li><strong>Last update:</strong> ${contact.result[0].data.properties.lastmodifieddate}</li>
            <li><strong>Link to Hubspot:</strong>
                <a href="https://app.hubspot.com/contacts/4559600/contact/${contact.result[0]._key}" target="_blank" class="link-info">
                    ${contact.result[0].data.properties.firstname}</a></li>

        </ul>

                    </div >
                    ${data == undefined ? `<strong>This user is not assosiated with any company,emails, meetings or deals</strong>` : `

                </div >
                <div class="col-sm card px-0 me-3 mb-3">
                    <div class="card-header py-3 text-bg ">
                        <h4 class="my-0 fw-normal">Hubspot Company Info:</h4>
                    </div>
                    <div class="card-body">
                        <ul class="list-unstyled mt-3 mb-4">
                       ${data.result[0].company.length == 0 ? `This user is not assosiated with any company` : `
                            <li><strong>Name:</strong> ${data.result[0].company[0].data.properties.name}</li>
                            <li><strong>Website:</strong> ${data.result[0].company[0].data.properties.website}</li>
                            <li><strong>Total Revenue:</strong> ${data.result[0].company[0].data.properties.total_revenue}</li>
                            <li><strong>Lead Status:</strong> ${data.result[0].company[0].data.properties.hs_lead_status}</li>

                            <li><strong>Created:</strong> ${data.result[0].company[0].data.properties.createdate}</li>
                            <li><strong>Last update:</strong> ${data.result[0].company[0].data.properties.hs_lastmodifieddate}</li>
                            <li><strong>Link to Hubspot:</strong> 
                                <a href="https://app.hubspot.com/contacts/4559600/company/${data.result[0].company[0]._key}" target="_blank" class="link-info">
                                ${data.result[0].company[0].data.properties.name}</a></li>
                                `}
                        </ul >
                    </div >
                </div >
    <div class="col-sm">
    </div>

        
            </div >
        </div >

    <div class="container">
        <div class="col-sm">
            <div class="card-header py-3 text-bg ">
                <h4 class="my-0 fw-normal">Hubspot Deals:</h4>
            </div>
            <div class="card-body">
                <ul class="list-unstyled mt-3 mb-4">
                ${data.result[0].deals.length == 0 ? `This user is not assosiated with any deals` : `

                    <li><strong>Name:</strong> ${data.result[0].deals[0].dealname}</li>
                    <li><strong>Created:</strong> ${data.result[0].deals[0].createdate}</li>
                    <li><strong>Deal Stage:</strong> ${data.result[0].deals[0].dealstage}</li>
                    <li><strong>Pipline:</strong> ${data.result[0].deals[0].pipeline}</li>

                    <li><strong>Updated:</strong> ${data.result[0].deals[0].hs_lastmodifieddate}</li>
                    <li><strong>Amount:</strong> ${data.result[0].deals[0].amount}</li>

                    <li><strong>Link to Hubspot:</strong>
                        <a href="https://app.hubspot.com/contacts/4559600/deal/${data.result[0].deals[0].hs_object_id}" target="_blank" class="link-info">
                            ${data.result[0].deals[0].dealname}</a></li>
`}
                </ul>
            </div>

        </div>
        <div class="col-sm">
        <div class="card-header py-3 text-bg ">
            <h4 class="my-0 fw-normal">Hubspot Meetings:</h4>
        </div>
        <div class="accordion" id="accordionPanelsStayOpenExample">
        ${data.result[0].meetings.length == 0 ? `This user is not assosiated with any meetings` : `
        ${hubspotFunc(data.result[0].meetings, "meetings")}
        `}
        </div>

    </div>
        <div class="col-sm">
            <div class="card-header py-3 text-bg ">
                <h4 class="my-0 fw-normal">Hubspot Emails:</h4>
            </div>
            <div class="accordion" id="accordionPanelsStayOpenExample">
            ${data.result[0].emails.length == 0 ? `This user is not assosiated with any emails` : `
            ${hubspotFunc(data.result[0].emails, "emails")}
            `}
            </div>

        </div>


    </div>

`}`}

    </div >
    ${footer}
`
}