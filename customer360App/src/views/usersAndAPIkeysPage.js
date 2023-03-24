import { forFunc } from '../util'
import { header } from "./parts/header"
import { navBar } from "./parts/nav"
import { footer } from "./parts/footer"
import { sidebar } from './parts/sidebar'

export function users(data, session, url) {
    return `
    ${header}
    </head>
<body class="bg-light text-dark">
<main class="d-flex flex-nowrap users-and-api-keys-page">
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



            <div>
                <div class="row">

                    <div class="col-auto justify-content-center text-right">
                        <div class="card-header pb-3 text-bg ">
                            <h4 class="my-0 fw-normal">Users and APi keys:</h4>
                        </div>
                        <ul class="list-group">
                            ${forFunc(data.result[0]._users)}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
    ${footer}

`
}