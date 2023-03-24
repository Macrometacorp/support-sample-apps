import { header } from "./parts/header"
import { footer } from "./parts/footer"
import { navBar } from "./parts/nav"


export function signInPage(note) {
    return ` 
    ${header}
    </head>
<body class="bg-light text-dark">
<main class="d-flex flex-nowrap">
    <div class="container text-center p-3">
        ${navBar("", "invisible")}
        <div class="justify-content-center row row-cols-3 row-cols-md-3 mb-3 text-center">
            <form action="signIn" method="POST">
                <img class="mb-4 rounded"
                    src="https://pbs.twimg.com/profile_images/1577380796456910850/4i-8KJoh_400x400.jpg
                    "
                    width="75" height="75" alt="">
                <h1 class="h3 mb-3 fw-normal">Please log in</h1>

                <input name="username" type="text" id="username" required class="form-control mb-3" placeholder="Email" />

                <input name="password" type="password" id="password" required class="form-control mb-3"
                    placeholder="Password" />

                <button class="w-100 btn btn-lg btn-primary mb-3" type="submit">Log in</button>
            </form>
        </div>
        <div>
            ${note}
        </div>
    </div>
    ${footer}

`}

