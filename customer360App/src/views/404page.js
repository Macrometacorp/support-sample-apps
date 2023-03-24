import { header } from "./parts/header"
import { navBar } from "./parts/nav"
import { footer } from "./parts/footer"
import { sidebar } from "./parts/sidebar"

export function errorPage(session, url) {
    return `

    ${header}
    </head>
<body class="bg-light text-dark">
<main class="d-flex flex-nowrap">
    ${sidebar(url)}
    <div class="container text-right">
    ${navBar(session)}
    <div class="d-flex align-items-center justify-content-center vh-70">
            <div class="text-center">
                <h1 class="display-1 fw-bold">404</h1>
                <p class="fs-3"> <span class="text-danger">Opps!</span> Page not found.</p>
                <p class="lead">
                    The page you're looking for doesn't exist.
                  </p>
                <a href="${url.origin}" class="btn btn-primary">Go Home</a>
            </div>
        </div>
        </div>
        ${footer}
    `

}