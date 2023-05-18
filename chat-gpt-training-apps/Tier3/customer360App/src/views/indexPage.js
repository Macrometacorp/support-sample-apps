import { header } from "./parts/header"
import { footer } from "./parts/footer"
import { sidebar } from "./parts/sidebar"
import { navBar } from "./parts/nav"


import { crateTable } from '../util'

export function index(note, user, data, value, offset, url, check) {
    return `
    ${header}
</head>
<body class="bg-light text-dark">
<main class="d-flex flex-nowrap">
    ${sidebar(url, "invisible")}
    <div class="container p-3">
    ${navBar(user)}
    <form action="/" method="post">
        <div class="input-group">
            <div class="row">
                <div class="col">

                    <label for="plan" class="form-label">Plan</label>
                    <select class="form-select" id="plan" name="plan" required>
                        <option value="all">ALL</option>
                        <option value="PLAYGROUND">PLAYGROUND</option>
                        <option value="SCALE">SCALE</option>
                        <option value="METERED">METERED</option>
                        <option value="ENTERPRISE">ENTERPRISE</option>
                    </select>
                    <div class="invalid-feedback">
                        Please select a valid plan.
                    </div>
                </div>
                <div class="col">

                    <label for="active" class="form-label">Active</label>
                    <select class="form-select" id="active" name="active" required>
                        <option value="all">ALL</option>
                        <option value="true">True</option>
                        <option value="false">False</option>
                    </select>
                    <div class="invalid-feedback">
                        Please select a valid plan.
                    </div>
                </div>
                <div class="col">
                <label for="user" class="form-label">User type</label>
                <select class="form-select" id="user" name="user" required>
                    <option value="all">ALL</option>
                    <option value="root">Root users</option>
              
                </select>
                <div class="invalid-feedback">
                    Please select a valid federation.
                </div>
            </div>
            </div>
        </div>
        <div class="input-group mb-3 py-3">
           
                    <span class="input-group-text" id="basic-addon1">Search: </span>
                    <input name="username" type="text" id="username" class="form-control" />
                    <button type="submit" class="btn btn-primary">Submit</button>
              
        </div>

    </form>
    <div class="row">
        <div class="col-12 justify-content-start">
            <div> ${note}
            </div>
            <div class="mb-4 text-muted"> 
            ${check == true ? "<em>Tenant owners are highlighted in purple</em>" : ""}
            </div>
            ${data.length === 0 ? "We're sorry, but there are no results, please try searching something else."
            :

            crateTable(data, url.origin, offset, true, check)}
        </div>
    </div>
    <nav class="${value.value || value.federation || value.plan || value.active ? 'd-none' : ''} ">
        <div class=" d-flex justify-content-center">
            <ul class="pagination justify-content-center">
                <li class="page-item ${offset == 0 || offset == null ? 'disabled' : ''}"><a class="page-link"
                        href="${url.origin + '/?offset=' + (parseInt(offset) - 15)}">Previous</a></li>

                <li class="page-item ${data.length === 0 ? 'disabled' : ''} "><a class="
                                    page-link" href="${url.origin + '/?offset=' + (parseInt(offset) + 15)}">Next</a>
                </li>
            </ul>
        </div>
    </nav>
</div>
${footer}
    `
}