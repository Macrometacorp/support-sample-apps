import { forFunc } from '../util'
import { header } from "./parts/header"
import { navBar } from "./parts/nav"
import { footer } from "./parts/footer"
import { sidebar } from "./parts/sidebar"

export function sendgrid(data, session, url, email) {
    return `
    ${header}
    </head>
<body class="bg-light text-dark">
<main class="d-flex flex-nowrap sendgrid-page">
    ${sidebar(url)}
    <div class="container text-right p-3">
        ${navBar(session)}
        <div>
            <div class="container py-2 px-0">
                <h6 class="mb-4 fw-normal">
                    <strong>Email:</strong> ${email}
                </h6>
            </div>
            </div>
            <div class="row">
                <div class="col-auto justify-content-center text-right">
                    <div class="card-header pb-3 text-bg ">
                        <h4 class="my-0 fw-normal">Sendgrid Emails:</h4>
                    </div>
                    ${data.result.length == 0 ? `There is no email for this user` :
            `<ul class="list-group"> ${forFunc(data.result)}
                    </ul>`}
                </div>
            </div>
        </div>
    </div>
    ${footer}
`
}