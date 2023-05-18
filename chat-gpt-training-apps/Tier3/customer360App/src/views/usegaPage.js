
import { chartScript } from "../chart"
import { header } from "./parts/header"
import { navBar } from "./parts/nav"
import { footer } from "./parts/footer"
import { sidebar } from "./parts/sidebar"
import { crateTable, jsonToCSv } from "../util"

export function usage(data, session, url) {
    let num = data.result[0]._usage.length - 1
    let databyWeek = []
    for (let i = 1; i <= 4; i++) {
        let apiCalls = 0
        let diskStorageinMB = 0
        let indeskStorageinMB = 0
        let queryTimeinSec = 0
        let streamIOinMB = 0

        for (let a = num; a > num - 7; a--) {
            apiCalls += (Math.round(Number.isInteger(data.result[0]._usage[a]?.values)) ? Math.round(data.result[0]._usage[a]?.values) : 0)
            diskStorageinMB += Number.isInteger(Math.round(data.result[0]._usage[a]?.DISKstorageinMB)) ? Math.round(data.result[0]._usage[a]?.DISKstorageinMB) : 0
            indeskStorageinMB += Number.isInteger(Math.round(data.result[0]._usage[a]?.IDEXstorageinMB)) ? Math.round(data.result[0]._usage[a]?.IDEXstorageinMB) : 0
            queryTimeinSec += Number.isInteger(Math.round(data.result[0]._usage[a]?.QUERYexeTimeinSec)) ? Math.round(data.result[0]._usage[a]?.QUERYexeTimeinSec) : 0
            streamIOinMB += Number.isInteger(Math.round(data.result[0]._usage[a]?.STREAMio)) ? Math.round(data.result[0]._usage[a]?.STREAMio) : 0
        }

        databyWeek.push({ apiCalls, diskStorageinMB, indeskStorageinMB, queryTimeinSec, streamIOinMB })
        num = num - 7
    }
    let csv = JSON.stringify(jsonToCSv(databyWeek))


    return `
    ${header}
    <script>
    function download() {

        let element = document.createElement("a");
        element.setAttribute(
          "href",
          "data:text/csv;charset=UTF-8," + encodeURIComponent(${csv})
        );
        element.setAttribute("download", "data.csv");

        element.style.display = "none";
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
      }
      </script>
</head>
<body class="bg-light text-dark">
<main class="d-flex flex-nowrap usage-page">
    ${sidebar(url)}
    <div class="container text-right p-3">
        ${navBar(session)}
        <div class="container py-2 px-0">
                <h4 class="fw-normal">
                    <strong>Tenant:</strong> ${data.result[0].tenantName}
                </h4>
                <h6 class="mb-4 fw-normal">
                    <strong>Email:</strong> ${data.result[0].email}
                </h6>

          <div class="alert alert-light alert-dismissible fade show" role="alert">
          The customer has ${data.api.labels.length} days of usage data available.
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>

       
        </div>
        <div class="alert alert-light" role="alert">
        Each row in the table is seven days of usage. The first row is the last seven days, and so on.
        </div>
        <div class="container p-2">
    ${crateTable(databyWeek)}
        </div>
            <div class="py-2 d-flex justify-content-end">
            <form class="px-3" onsubmit="download()">
            <input  class="btn btn-primary my-2 my-sm-0" type="submit" value="Download table as CSV" />
          </form>
        </div>

        <div class="row py-5">
        <div class="alert alert-light" role="alert">
        Graphs represent last ${data.api.labels.length} days of usage.
        </div>
            <div class="col ">
                <canvas id="myChart1" width="400" height="400"></canvas>
            </div>
            <div class="col">
                <canvas id="myChart2" width="400" height="400"></canvas>
            </div>

        </div>
        <div class="row py-5">
            <div class="col">
                <canvas id="myChart3" width="400" height="400"></canvas>
            </div>
            <div class="col">
                <canvas id="myChart4" width="400" height="400"></canvas>
            </div>

        </div>
        <div class="row py-5">
            <div class="col">
                <canvas id="myChart5" width="400" height="400"></canvas>
            </div>
            <div class="col">
                <canvas id="myChart6" width="400" height="400"></canvas>
            </div>


        </div>
    </div>    
    <script type="module">${chartScript(data)}</script>
    ${footer}


`
}