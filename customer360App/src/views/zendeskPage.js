import { forFunc } from '../util'
import { header } from "./parts/header"
import { navBar } from "./parts/nav"
import { footer } from "./parts/footer"
import { sidebar } from "./parts/sidebar"




export function zendesk(data, session, url, email) {

    return `
    ${header}
    </head>
    <body class="bg-light text-dark">
    <main class="d-flex flex-nowrap zendesk-page">
    ${sidebar(url)}
    
    <div class="container text-right p-3">
        ${navBar(session)}
        ${data.result[0].id == null ?
            `<div class="container">
                <div>
                    <strong>We don't have this user in Stripe</strong>
                </div>
            </div>`
            :
            `
        <div>
            <div class="container px-0">
                <div class="card d-inline-block">
                    <div class="card-header py-3 text-bg ">
                        <h4 class="my-0 fw-normal">Zendesk Info:</h4>
                    </div>
                    <div class="card-body px-0"><table><tbody>
                        <tr>
                            <td><div><strong>Zendesk user email:</strong></div></td>
                            <td><div>${email}</div></td>
                        </tr>
                        <tr>
                            <td><div><strong>Zendesk user id:</strong></div></td>
                            <td><div>${data.result[0].id}</div></td>
                        </tr>
                        <tr>
                            <td><div><strong>Zendesk user fullname:</strong></div></td>
                            <td><div>${data.result[0].fullname}</div></td>
            
                        </tr>
                        <tr>
                            <td><div><strong>Zendesk user creation data:</strong></div></td>
                            <td><div>${data.result[0].date_created}</div></td>
                        </tr>
                        <tr>
                            <td><div><strong>Number of tickets:</strong></div></td>
                            <td><div>${data.result[0].ticket_count}</div></td>
                        </tr>
                        </tbody></table>
                            <div class="justify-content-right text-right">
                                <div class="mb-1"><strong> Organization:</strong></div>
                                ${data.result[0].org_info == null ? `Doesn't have an organization
                                `: `<ul class="list-group "> ${forFunc(data.result[0].org_info)}
                                </ul>`}
            
                            </div>
                    </div>
                </div>
            </div>
            <div class="container mt-3">
                <div class="row">
                    ${data.result[0].ticket_count == 0 ? 
                    `<h4 class="fw-normal">Zendesk Tickets:</h4>
                    <strong>This user did not raise any ticket in Zendesk</strong>` 
                    : 
                    `
                    <div class="card-header py-3 text-bg ">
                        <h4 class="my-0 fw-normal">Zendesk Statistic:</h4>
                    </div>
                    <div class="pb-3 px-0">
                        <strong>Last updated ticket:</strong> 
                        <a href="${data.result[0].latest_ticket_update.url}">${data.result[0].latest_ticket_update.ticket_id}</a> 
                        Date:${data.result[0].latest_ticket_update.date_updated}
                    </div>
                    <div class="container px-0">
                        <div class="row">
                            <div class="col">
                                <strong> Tickets Fields Count:</strong>
                                <ul class="list-group ">
                                    ${forFunc(data.result[0].ticket_issue_count)}
                                </ul>
                            </div>
                            <div class="col">
                                <strong> Tickets Staus Count:</strong>
                                <ul class="list-group">
                                    ${forFunc(data.result[0].status)}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="card-header py-3 text-bg ">
                        <h4 class="my-0 fw-normal">Zendesk Tickets:</h4>
                    </div>
                    <div class="px-0">
                        ${(d => {
                            html = "<ul class='list-group'>"
                            div = ""
                            for (const i in d) {
                                div += `<li class="list-group-item mb-2">
                                            <div>
                                                <b>Ticket number:</b>
                                                <a href=${d[i].url}> ${d[i].ticket_id}</a>
                                            </div>
                                            <div>
                                                <b>Status:</b> ${d[i].status}
                                            </div>
                                            <div>
                                                <b>Subject:</b> ${d[i].subject}
                                            </div>
                                            <div>
                                                <b>Last update:</b> ${d[i].date_updated}
                                            </div>
                                        </li>`
                                }
                                html = html + div + "</ul>"
                                return html
                            })(data.result[0].tickets)
                        }
                    `}
                    </div>
                </div>
            </div>
        </div>
        `}
    </div>
    ${footer}
`
}