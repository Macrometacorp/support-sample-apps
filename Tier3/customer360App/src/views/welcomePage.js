import { header } from "./parts/header"
import { footer } from "./parts/footer"
import { navBar } from "./parts/nav"

export const welComePage = ` 
    ${header}
    </head>
<body class="bg-light text-dark">
<main class="d-flex flex-nowrap">
    <div class="container text-center p-3">
        ${navBar("", "invisible")}
       
        <h5 style="color:#6767E6;">For Support, by Support</h5>

        <form action="/signIn" method="GET">

            <div class="mb-3 ">
                <p>Please Login first.</p>
                <button class="btn btn-primary">Login</button>
            </div>

        </form>

    </div>
    ${footer}
`