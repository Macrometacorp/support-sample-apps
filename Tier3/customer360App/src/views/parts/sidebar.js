export function sidebar(url, visibility) {
  const userUrl = url.origin + "/" + url.path[1] + "/" + url.path[2]
  return `

  <div class="d-flex flex-column  flex-shrink-0 py-2 px-5 bg-light" style="width: 320px;">
    <a class="navbar-brand py-3" href="/">
        <img src="https://www.macrometa.com/logo.svg"
            width="224" height="45" alt="">
    </a>
    <ul class="nav nav-pills flex-column mb-auto pt-3">
      <li class="nav-item">
          <a href="${url.origin}" class="nav-link ${url.path.length === 2 ? 'active' : 'link-dark'}">
        <i class="bi bi-search pe-3" ></i >
            Search
          </a >
      </li >
      <hr>
      <li >
      <a href="${userUrl}" class="${visibility} nav-link ${url.path.length === 3 ? 'active' : 'link-dark'}">
      <i class="bi bi-house  pe-3"></i>
              Tenant Basic Info
          </a>
      </li>
      <li>
        <a href="${userUrl + '/usage'}" class="${visibility} nav-link ${url.path.length === 4 && url.path[3] === "usage" ? 'active' : 'link-dark'} ">
            <i class="bi bi-activity  pe-3" ></i >
            User Usage
        </a >
      </li >
      <li>
      <a href="${userUrl + '/workers'}" class="${visibility} nav-link ${url.path.length === 4 && url.path[3] === "workers" ? 'active' : 'link-dark'} ">
          <i class="bi bi-graph-up  pe-3" ></i >
          Coll and Workers
      </a >
    </li >
    <li>
        <a href="${userUrl + '/features'}" class="${visibility} nav-link ${url.path.length === 4 && url.path[3] === "features" ? 'active' : 'link-dark'}">
        <i class="bi bi-card-checklist  pe-3"></i>
        Features
    </a>
      </li >
      </li >
    <li>
        <a href="${userUrl + '/users'}" class="${visibility} nav-link ${url.path.length === 4 && url.path[3] === "users" ? 'active' : 'link-dark'} ">
            <i class="bi bi-people  pe-3" ></i >
            Users and API keys
    </a >
      </li >
    <li>
        <a href="${userUrl + '/limits'}" class="${visibility} nav-link ${url.path.length === 4 && url.path[3] === "limits" ? 'active' : 'link-dark'} ">
            <i class="bi bi-123  pe-3" ></i >
            Limits
        </a >
    </li >
    <li>
        <a href="${userUrl + '/zendesk'}" class="${visibility} nav-link ${url.path.length === 4 && url.path[3] === "zendesk" ? 'active' : 'link-dark'}">
        <i class="bi bi-book  pe-3"></i>
        Zendesk
    </a>
      </li >

    <li>
        <a href="${userUrl + '/stripe'}" class="${visibility} nav-link ${url.path.length === 4 && url.path[3] === "stripe" ? 'active' : 'link-dark'}">
    <i class="bi bi-currency-dollar  pe-3" ></i >
      Stripe
    </a >
      </li >
    <li>
      <a href="${userUrl + '/sendgrid'}" class="${visibility} nav-link ${url.path.length === 4 && url.path[3] === "sendgrid" ? 'active' : 'link-dark'}">
      <i class="bi bi-envelope-at  pe-3"></i>
      Sendgrid
    </a>
      </li >
    <li>
      <a href="${userUrl + '/hubspot'}" class="${visibility}  nav-link ${url.path.length === 4 && url.path[3] === "" ? 'active' : 'link-dark'}">
      <i class="bi bi-person-rolodex  pe-3"></i>
      Hubspot
    </a>
      </li >
  </ul >

</div >
    `
}