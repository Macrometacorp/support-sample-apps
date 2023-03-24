
import { z } from "zod";
import { createWebCryptSession } from "webcrypt-session";
import { Router } from 'itty-router'

import { readRequestBody, fixData } from './util'

import fetchData from "./fetchData";
import checkCred from "./checkCred";
import upcomingInvoices from "./stripeUpcoming"
import hubspotFetch from "./hubspot";

import { signInPage } from "./views/singInPage.js"
import { welComePage } from './views/welcomePage.js';
import { index } from './views/indexPage'
import { usage } from './views/usegaPage'
import { features } from './views/featuresPage'
import { limits } from './views/limitsPage'
import { tenant } from './views/tenantPage'
import { errorPage } from './views/404page'
import { hubspot } from "./views/hubspot";


import { users } from './views/usersAndAPIkeysPage';
import { zendesk } from "./views/zendeskPage"
import { sendgrid } from "./views/sendgridPage"
import { stripe } from "./views/stripePage"
import { workers } from "./views/workersPage";


const router = Router()

let webCryptSession = ""
let session = ""

const headers = {
  headers: {
    'content-type': 'text/html;charset=UTF-8'
  }
}

const sessionCheck = function () {
  if (session == null) {
    return new Response(welComePage, headers);
  }
}

async function cryptSession(request) {
  webCryptSession = await createWebCryptSession(
    sessionScheme,
    request,
    {
      password: PASSWORD,
    },
  );
  session = webCryptSession.username
}

const sessionScheme = z.object({
  username: z.string(),
});
const signInParamScheme = z.object({
  username: z.string(),
});

router.get('/', cryptSession, sessionCheck, async (request, url) => {
  const { searchParams } = url
  let value = searchParams.get('value')
  let offset = searchParams.get('offset')
  let federation = searchParams.get('federation')
  let plan = searchParams.get('plan')
  let active = searchParams.get('active')
  let user = searchParams.get('user')

  let query = { value, federation, plan, active, user }


  if (value || federation || plan || active) {
    const response = await (fetchData('searchST3', `{"value":"${value}","federation":"${federation}","plan":"${plan}","status":"${active}","user":"${user}"}`, IGDN_API_KEY, `api-igdn`))
    return new Response(index(`<div><strong><h5> Results for query: </strong> </h5><p class="text-monospace h6 pb-0">Value: <u>${value}</u>, Federation: <u>${federation}</u>, Plan: <u>${plan}</u>, Active: <u>${active}</u>, User: <u>${user}</u></p></div> `, session, response.result, query, 0, url, true), headers)

  }
  else {
    const response = await (fetchData('newTenants', `{"offset":${offset}}`, IGDN_API_KEY, `api-igdn`))
    return new Response(index(`<h4 class="pb-0"><strong>All tenants sorted by creation date:</strong></h4>`, session, response.result, query, offset === 0 || offset === null ? 0 : offset, url, false), headers)
  }
})

router.post('/', cryptSession, sessionCheck, async (request, url) => {
  const reqBody = await readRequestBody(request)

  return new Response(null, {
    status: 303,
    headers: {
      location: `${url.origin}?value=${reqBody.username}&federation=${reqBody.federation}&plan=${reqBody.plan}&active=${reqBody.active}&user=${reqBody.user}`
    },
  });
})

router.get('/signIn', () => {
  return new Response(signInPage(""), headers);
})

router.get('/:username/:federation', cryptSession, sessionCheck, async (request, url) => {

  const response = await (fetchData('STinfo', `{"email":"${request.params.username}"}`, FEDs_API_KEY[request.params.federation], `api-${request.params.federation}`))
  const html = tenant(response, session, request.params, url)

  return new Response(html, headers)
})

router.get('/:username/:federation/usage', sessionCheck, async (request, url) => {
  const response = await (fetchData('STusage', `{"email":"${request.params.username}"}`, FEDs_API_KEY[request.params.federation], `api-${request.params.federation}`))
  response.api = fixData(response.result[0]._usage, "values")
  response.storage = fixData(response.result[0]._usage, "DISKstorageinMB")
  response.index = fixData(response.result[0]._usage, "IDEXstorageinMB")
  response.queryTime = fixData(response.result[0]._usage, "QUERYexeTimeinSec")
  response.stream = fixData(response.result[0]._usage, "STREAMio")


  return new Response(usage(response, session, url), headers)
})
router.get('/:username/:federation/features', cryptSession, sessionCheck, async (request, url) => {
  const response = await (fetchData('STfeatures', `{"email":"${request.params.username}"}`, FEDs_API_KEY[request.params.federation], `api-${request.params.federation}`))
  return new Response(features(response, session, url), headers)
})

router.get('/:username/:federation/workers', cryptSession, sessionCheck, async (request, url) => {
  const response = await (fetchData('STworkers', `{"email":"${request.params.username}"}`, FEDs_API_KEY[request.params.federation], `api-${request.params.federation}`))
  return new Response(workers(response.result[0], session, url), headers)
})

router.get('/:username/:federation/limits', cryptSession, sessionCheck, async (request, url) => {
  const response = await (fetchData('STfeatures', `{"email":"${request.params.username}"}`, FEDs_API_KEY[request.params.federation], `api-${request.params.federation}`))
  return new Response(limits(response, session, url), headers)
})

router.get('/:username/:federation/users', cryptSession, sessionCheck, async (request, url) => {
  const response = await (fetchData('STusers', `{"email":"${request.params.username}"}`, FEDs_API_KEY[request.params.federation], `api-${request.params.federation}`))
  return new Response(users(response, session, url), headers)
})

router.get('/:username/:federation/zendesk', cryptSession, sessionCheck, async (request, url) => {
  const response = await (fetchData('ZendeskQuery', `{ "email": "${request.params.username}" }`, IGDN_API_KEY, "api-igdn"))
  return new Response(zendesk(response, session, url, request.params.username), headers)
})

router.get('/:username/:federation/sendgrid', cryptSession, sessionCheck, async (request, url) => {
  const response = await (fetchData('SendgridQuery', `{ "email": "${request.params.username}" }`, IGDN_API_KEY, "api-igdn"))
  return new Response(sendgrid(response, session, url, request.params.username), headers)
})

router.get('/:username/:federation/stripe', cryptSession, sessionCheck, async (request, url) => {
  const gdn = await (fetchData('STstripe', `{ "email": "${request.params.username}" }`, FEDs_API_KEY[request.params.federation], `api-${request.params.federation}`))
  console.log(gdn);
  const upInvoices = await (upcomingInvoices(gdn.result[0].stripeCustomerId, S_API_KEY))
  const response = await (fetchData('StripeQuery', JSON.stringify(gdn.result[0]), IGDN_API_KEY, "api-igdn"))
  return new Response(stripe(response, session, upInvoices, url), headers)
})

router.get('/:username/:federation/hubspot', cryptSession, sessionCheck, async (request, url) => {
  const responseContact = await (fetchData('HubspotContactQuery', `{ "email": "${request.params.username}" }`, IGDN_API_KEY, "api-igdn"))
  let responseHub
  let respnsePipline
  let associationsResponseConcats
  if (responseContact.result.length != 0) {
    try {
      associationsResponseConcats = await (hubspotFetch(responseContact.result[0]._key, HUBSPOT_API_KEY, "contacts", ["emails", "companies", "deals", "meetings"], "objects"))
    } catch (e) { console.log(e); }
    if (associationsResponseConcats?.associations != undefined) {

      let companyID = associationsResponseConcats.associations.companies?.results[0]?.id == undefined ? "" : associationsResponseConcats.associations.companies.results[0]?.id
      let emails = [...(associationsResponseConcats.associations.emails === undefined ? "" : associationsResponseConcats.associations.emails.results)]
      let deals = [...(associationsResponseConcats.associations.deals === undefined ? "" : associationsResponseConcats.associations.deals.results)]
      let meetings = [...(associationsResponseConcats.associations.meetings === undefined ? "" : associationsResponseConcats.associations.meetings.results)]

      const associationsResponseCompanies = await (hubspotFetch(companyID, HUBSPOT_API_KEY, "companies", ["emails", "deals", "meetings"], "objects"))
      if (associationsResponseCompanies.associations != undefined) {

        emails.push(...(associationsResponseCompanies.associations.emails === undefined ? "" : associationsResponseCompanies.associations.emails.results))
        deals.push(...(associationsResponseCompanies.associations.deals === undefined ? "" : associationsResponseCompanies.associations.deals.results))
        meetings.push(...(associationsResponseCompanies.associations.meetings === undefined ? "" : associationsResponseCompanies.associations.meetings.results))

      }
      responseHub = await (fetchData('HubspotQuery', `{ "companyID": "${companyID}","emails":${JSON.stringify(emails)},"deals":${JSON.stringify(deals)},"meetings":${JSON.stringify(meetings)} }`, IGDN_API_KEY, "api-igdn"))
      respnsePipline = await (hubspotFetch("", HUBSPOT_API_KEY, "deals", "", "pipelines"))


      if (responseHub.result[0].deals.length != 0) {
        for (i of respnsePipline.results) {
          for (c of i.stages) {
            if (c.id == responseHub.result[0].deals[0].dealstage) {
              responseHub.result[0].deals[0].dealstage = c.label
              responseHub.result[0].deals[0].pipeline = i.label
            }

          }


        }
      }
    }
  }
  return new Response(hubspot(responseHub, responseContact, session, url), headers)

})

router.post('/signOut', (request, url) => {
  return new Response(null, {
    status: 303,
    headers: {
      location: url.origin,
      "Set-Cookie": "session=delete; expires=Thu, 01 Jan 1970 00:00:00 GMT",
    },
  });
})

router.post('/signIn', cryptSession, async (request, url) => {
  try {
    const reqBody = await readRequestBody(request)
    let res = await checkCred(reqBody.username, reqBody.password)
    user = reqBody.username
    let domain = reqBody.username.split("@")[1]
    if (res.jwt && domain === "macrometa.com") {
      const signInParam = signInParamScheme.parse(reqBody);

      await webCryptSession.save({
        username: signInParam.username,
      });

      const session = webCryptSession.toHeaderValue();
      if (session == null) {
        throw new Error();
      }
      return new Response(null, {
        status: 303,
        headers: {
          location: url.origin,
          //"Set-Cookie": session
          "Set-Cookie": `${session}; Max - age=21600`,
        },
      });
    }
    else {
      return new Response(signInPage("The password or username is incorrect. Please try again."), headers);
    }
  } catch (e) {
    console.log(e);
    return new Response(null, {
      status: 400,
    });
  }
})

router.all('*', async (request, url) => {
  return new Response(errorPage(session, url), headers, { status: 404 })
})

addEventListener('fetch', async (event) => {
  const url = new URL(event.request.url);
  url.path = url.pathname.split("/")
  event.respondWith(router.handle(event.request, url))
})
