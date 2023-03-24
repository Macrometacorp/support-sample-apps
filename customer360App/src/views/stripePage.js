import { forFunc } from '../util'
import { header } from "./parts/header"
import { navBar } from "./parts/nav"
import { footer } from "./parts/footer"
import { sidebar } from "./parts/sidebar"




export function stripe(data, session, upcoming, url) {
    return `
    ${header}
    </head>
<body class="bg-light text-dark">
<main class="d-flex flex-nowrap stripe-page">
    ${sidebar(url)}
    <div class="container text-right p-3">
        ${navBar(session)}
        ${data.result[0].StripeCustomer[0] == null ?
            `<div class="container">
                <div>
                    <strong>We don't have this user in Stripe</strong>
                </div>
            </div>`
            :
            `<div class="container">
                <div class="card d-inline-block">
                    <div class="card-header py-3 text-bg ">
                        <h4 class="my-0 fw-normal">Stripe info:</h4>
                    </div>
                    <div class="card-body px-0"><table><tbody>
                        <tr>
                            <td><div>User Name:</div></td>
                            <td><div>${data.result[0].StripeCustomer[0].name}</div></td>
                        </tr>
                        <tr>
                            <td><div>Stripe ID:</div></td>
                            <td><div>${data.result[0].StripeCustomer[0].id}</div></td>
                        </tr>
                        <tr>
                            <td><div>Stripe Paymethod ID:</div></td>
                            <td><div>${data.result[0].StripePaymethod[0].id}</div></td>
                        </tr>
                        <tr>
                            <td><div>Stripe Subscription ID:</div></td>
                            <td><div>${data.result[0]?.StripeSubscriptions[0]?.id}</div></td>
                        </tr>
                        <tr>
                            <td><div>Stripe Subscription collection_method:</div></td>
                            <td><div>${data.result[0]?.StripeSubscriptions[0]?.collection_method}</div></td>
                        </tr>
                        <tr>
                            <td><div>Stripe Subscription status:</td>
                            <td><div>${data.result[0]?.StripeSubscriptions[0]?.status}</div></td>
                        </tr>
                        <tr>
                            <td><div>Sub created:</td>
                            <td><div>${new Date(data.result[0]?.StripeSubscriptions[0]?.created *
                            1000).toUTCString()}</div></td>
                        </tr>
                        <tr>
                            <td><div>Sub period start:</div></td>
                            <td><div>${data.result[0]?.StripeSubscriptions[0] != undefined ? new
                            Date(data.result[0]?.StripeSubscriptions[0]?.current_period_start * 1000).toUTCString() : undefined}</div></td>
                        </tr>
                        <tr>
                            <td><div>Sub period end:</div></td>
                            <td><div>${data.result[0].StripeSubscriptions[0] != undefined ? new
                            Date(data.result[0].StripeSubscriptions[0].current_period_end * 1000).toUTCString() : undefined}</div></td>
                        </tr>
                        <tr>
                            <td><div>Stripe Paymethod brand:</div></td>
                            <td><div>${data.result[0].StripePaymethod[0].cardBrand}</div></td>
                        </tr>
                        <tr>
                            <td><div>Stripe Paymethod last4:</div></td>
                            <td><div>${data.result[0].StripePaymethod[0].last4}</div></td>
                        </tr>
                        <tr>
                            <td><div>Stripe Paymethod expire year:</div></td>
                            <td><div>${data.result[0].StripePaymethod[0].exp_year}</div></td>
                        </tr>
                        <tr>
                            <td><div>Stripe Paymethod expire month:</div></td>
                            <td><div>${data.result[0].StripePaymethod[0].exp_month}</td></div></strong>
                        </tr>
                    </tbody></table></div>
                </div>


                <div class="card-header py-3 text-bg ">
                    <h4 class="my-0 fw-normal">Stripe upcoming invoices:</h4>
                </div>
                <div>
                    <div class="alert alert-warning">
                        <div><strong>Start Period:</strong> ${new Date(upcoming.period_start * 1000).toUTCString()}</div>
                        <div><strong>End Period:</strong> ${new Date(upcoming.period_end * 1000).toUTCString()}</div>
                        <div><strong>Current total</strong>: $${upcoming.amount_due / 100}</div>
                    </div>
                </div>
                <div>
                    <div class="col-12 justify-content-center text-right">
                        <div class="card-header py-3 text-bg ">
                            <h4 class="my-0 fw-normal">Stripe Invoices:</h4>
                        </div> ${data.result[0].StripeInvoices[0] == null ? `Still dont have invoices
                        `: `<ul class="list-group "> ${forFunc(data.result[0].StripeInvoices)}
                        </ul>`}

                    </div>
                </div>
            </div>`}
    </div>
    ${footer}
`
}