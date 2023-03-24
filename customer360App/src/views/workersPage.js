import { workersFunc, sumNum } from '../util'
import { header } from "./parts/header"
import { navBar } from "./parts/nav"
import { footer } from "./parts/footer"
import { sidebar } from "./parts/sidebar"


export function workers(data, session, url) {

    return `
    ${header}
    </head>
<body class="bg-light text-dark">
<main class="d-flex flex-nowrap workers-page">
    ${sidebar(url, "")}
    <div class="container text-right p-3">
    ${navBar(session)}
    <div class="container py-2 px-0">
        <h4 class="fw-normal">
            <strong>Tenant:</strong> ${data.tenant}
        </h4>
        <h6 class="mb-4 fw-normal">
            <strong>Email:</strong> ${data.email}
        </h6>

        <div class="col">
            <div class="row row-cols-1 row-cols-md-4">
                <div class="card px-0 me-3 mb-3">
                    <div class="card-header">Fabrics</div>
                    <div class="card-body fs-4 fw-bold">${data.gf.length}</div>
                </div>
                <div class="card px-0 me-3 mb-3">
                    <div class="card-header">Query Workers</div>
                    <div class="card-body fs-4 fw-bold">${data.queries.length}</div>
                </div>
                <div class="card px-0 me-3 mb-3">
                    <div class="card-header">Stream Workers</div>
                    <div class="card-body fs-4 fw-bold">${data.streamApps.length}</div>
                </div>
                <div class="card px-0 me-3 mb-3">
                    <div class="card-header">Active Stream Workers</div>
                    <div class="card-body fs-4 fw-bold">${sumNum(data.streamApps, "isActive")}</div>
                </div>
                <div class="card px-0 me-3 mb-3">
                    <div class="card-header">Collections</div>
                    <div class="card-body fs-4 fw-bold">${sumNum(data.statistic, "collectionCount")}</div>
                </div>
                <div class="card px-0 me-3 mb-3">
                    <div class="card-header">Spot Collections</div>
                    <div class="card-body fs-4 fw-bold">${sumNum(data.statistic, "spotCollectionCount")}</div>
                </div>
                <div class="card px-0 me-3 mb-3">
                    <div class="card-header">Edge Collections</div>
                    <div class="card-body fs-4 fw-bold">${sumNum(data.statistic, "edgeCollectionCount")}</div>
                </div>
                <div class="card px-0 me-3 mb-3">
                    <div class="card-header">Local Streams</div>
                    <div class="card-body fs-4 fw-bold">${sumNum(data.streams, "localStreamCount")}</div>
                </div>
                <div class="card px-0 me-3 mb-3">
                    <div class="card-header">Global Streams</div>
                    <div class="card-body fs-4 fw-bold">${sumNum(data.streams, "globalStreamCount")}</div>
                </div>
            </div>
        </div>
        <div class="container">
            <div class="card-header py-3 text-bg ">
                <h4 class="my-0 fw-normal">Query Workers:</h4>
            </div>
            <div class="accordion" id="accordionPanelsStayOpenExample">
                ${workersFunc(data.queries, "query")}
            </div>
        </div>
        <div class="container">
            <div class="card-header py-3 text-bg ">
                <h4 class="my-0 fw-normal">Stream Workers:</h4>
            </div>
            <div class="accordion" id="accordionPanelsStayOpenExample">
                ${workersFunc(data.streamApps, "stream")}
            </div>
        </div>

    </div>
</div>
    ${footer}
`
}