import { forFunc, flattenObject } from '../util'
import { header } from "./parts/header"
import { navBar } from "./parts/nav"
import { footer } from "./parts/footer"
import { sidebar } from "./parts/sidebar"


export function limits(data, session, url) {

    return `
    ${header}
    </head>
<body class="bg-light text-dark">
<main class="d-flex flex-nowrap limits-page">
    ${sidebar(url)}
    <div class="container text-right p-3">
    ${navBar(session)}
    <div>
        <div class="container py-2 px-0">
            <h4 class="fw-normal">
                <strong>Tenant:</strong> ${data.result[0].tenantName}
            </h4>
            <h6 class="mb-4 fw-normal">
                <strong>Email:</strong> ${data.result[0].email}
            </h6>
        </div>

        <div class="row">
            <div class="col-auto justify-content-center text-right">
                <div class="card-header pb-3 text-bg ">
                    <h4 class="my-0 fw-normal">Limits:</h4>
                </div>
                <ul class="list-group list-group"> ${forFunc(flattenObject(data.result[0].tenants[0].Limits))}
                </ul>
            </div>
        </div>
    </div>
</div>

    ${footer}
`
}