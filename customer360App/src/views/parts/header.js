export const header = ` 
<!DOCTYPE html>
<html>
<head>

    <meta charset="utf-8">

    <meta content='width=device-width, initial-scale=1' name='viewport' />

    <title>Macrometa Support Tools</title>

    <link rel="icon" href="https://raw.githubusercontent.com/Macrometacorp/docs/master/static/img/favicon.ico">

    <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js"
        integrity="sha512-ElRFoEQdI5Ht6kZvyzXhYG9NqjtkmlkfYk0wr6wHxU9JEHakS7UJZNeml5ALk+8IKlU6jDgMabC3vkumRokgJA=="
        crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-gH2yIJqKdNHPEq0n4Mqa/HGKIhSkIHeL5AyhkYV8i59U5AR6csBvApHHNl/vI1Bx" crossorigin="anonymous">
    
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.2/font/bootstrap-icons.css">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4" crossorigin="anonymous"></script>

    <link rel="preconnect" href="https://fonts.macrometa.com" />
    <link rel="preload" href="https://fonts.macrometa.com/averta/subset-averta-cyrillic-light.woff2" as="font" type="font/woff2" crossOrigin="" />
    <link rel="preload" href="https://fonts.macrometa.com/averta/subset-averta-cyrillic-regular.woff2" as="font" type="font/woff2" crossOrigin="" />
    <link rel="preload" href="https://fonts.macrometa.com/averta/subset-averta-cyrillic-semibold.woff2" as="font" type="font/woff2" crossOrigin="" />
    <link rel="preload" href="https://fonts.macrometa.com/averta/subset-averta-cyrillic-bold.woff2" as="font" type="font/woff2" crossOrigin="" />

<style>

/* TYPOGRAPHY */

@font-face {font-family: 'AvertaCY'; src: url('https://fonts.macrometa.com/averta/subset-averta-cyrillic-light.woff2') format('woff2'), url('https://fonts.macrometa.com/averta/subset-averta-cyrillic-light.woff2') format('woff'); font-weight: 300; font-style: normal; font-display: swap;}
@font-face {font-family: 'AvertaCY'; src: url('https://fonts.macrometa.com/averta/subset-averta-cyrillic-light-italic.woff2') format('woff2'), url('https://fonts.macrometa.com/averta/subset-averta-cyrillic-light-italic.woff2') format('woff'); font-weight: 300; font-style: italic; font-display: swap;}
@font-face {font-family: 'AvertaCY'; src: url('https://fonts.macrometa.com/averta/subset-averta-cyrillic-regular.woff2') format('woff2'), url('https://fonts.macrometa.com/averta/subset-averta-cyrillic-regular.woff2') format('woff'); font-weight: 400; font-style: normal; font-display: swap;}
@font-face {font-family: 'AvertaCY'; src: url('https://fonts.macrometa.com/averta/subset-averta-cyrillic-regular-italic.woff2') format('woff2'), url('https://fonts.macrometa.com/averta/subset-averta-cyrillic-regular-italic.woff2') format('woff'); font-weight: 400; font-style: italic; font-display: swap;}
@font-face {font-family: 'AvertaCY'; src: url('https://fonts.macrometa.com/averta/subset-averta-cyrillic-semibold.woff2') format('woff2'), url('https://fonts.macrometa.com/averta/subset-averta-cyrillic-semibold.woff2') format('woff'); font-weight: 500; font-style: normal; font-display: swap;}
@font-face {font-family: 'AvertaCY'; src: url('https://fonts.macrometa.com/averta/subset-averta-cyrillic-semibold-italic.woff2') format('woff2'), url('https://fonts.macrometa.com/averta/subset-averta-cyrillic-semibold-italic.woff2') format('woff'); font-weight: 500; font-style: italic; font-display: swap;}
@font-face {font-family: 'AvertaCY'; src: url('https://fonts.macrometa.com/averta/subset-averta-cyrillic-bold.woff2') format('woff2'), url('https://fonts.macrometa.com/averta/subset-averta-cyrillic-bold.woff2') format('woff'); font-weight: 600; font-style: normal; font-display: swap;}
@font-face {font-family: 'AvertaCY'; src: url('https://fonts.macrometa.com/averta/subset-averta-cyrillic-bold-italic.woff2') format('woff2'), url('https://fonts.macrometa.com/averta/subset-averta-cyrillic-bold-italic.woff2') format('woff'); font-weight: 600; font-style: italic; font-display: swap;}

body,
.hubspot-page code {
    font-family: 'AvertaCY', sans-serif;
}

/* VARIABLES */

:root * {
    --bs-link-color: #6767E6;
    --bs-nav-pills-link-active-bg: #6767E6;
    --bs-pagination-color: #6767E6;
    --bs-pagination-hover-color: #6767E6;
    --bs-accordion-active-color:#4D4DAD;
    --bs-accordion-active-bg:#F0F0FD;
    --bs-accordion-btn-focus-box-shadow:0 0 0 0.25rem #8585EB40;
}

.btn-primary {
    --bs-btn-bg: #6767E6;
    --bs-btn-border-color: #6767E6;
    --bs-btn-hover-bg: #6767E6;
    --bs-btn-hover-border-color: #6767E6;
    --bs-btn-focus-shadow-rgb: #6767E6;
    --bs-btn-active-bg: #6767E6;
    --bs-btn-active-border-color: #6767E6;
    --bs-btn-disabled-bg: #6767E6;
    --bs-btn-disabled-border-color: #6767E6;
}

.btn-outline-primary {
    --bs-btn-color: #6767E6;
    --bs-btn-border-color: #6767E6;
    --bs-btn-hover-bg: #6767E6;
    --bs-btn-hover-border-color: #6767E6;
    --bs-btn-active-bg: #6767E6;
    --bs-btn-active-border-color: #6767E6;
    --bs-btn-disabled-color: #6767E6;
    --bs-btn-disabled-border-color: #6767E6;
}

/* APP */

body, 
main {
    max-width: 85vw;
    max-width: 100svw;
}

main .navbar + .container > .container {
    padding-left: 0;
}

.link-info {
    color: #6767E6 !important;
}

.tenant-page .card-header h6 {
    display: list-item;
    list-style: inside;
    margin-top: .25em !important;
}

.tenant-page .card-body strong {
    display: block;
}

.tenant-page .card-body li {
    margin-top: .5em !important;
}

.workers-page .card-body li {
    margin-bottom: .25em;
}

.workers-page .card-body.fw-bold {
    color: #6767E6;
}

.features-page li {
    overflow: hidden;
}

.features-page li:nth-of-type(even) {
    background-color: #f8f9fa;
}

.features-page b {
    float: right;
    font-weight: normal;
}

.features-page li b {
    font-size: 0;
}

.features-page li[data-value="true"] b:after {
    content: "✅";
    display: inline-block;
    font-size: 1rem;
    margin-left: 2em;
}

.features-page li[data-value="false"] b:after {
    content: "❌";
    display: inline-block;
    font-size: 1rem;
    margin-left: 2em;
}

.users-and-api-keys-page .list-group-item {
    margin-bottom: 1em;
}

.users-and-api-keys-page li .d-inline {
    display: block !important;
}

.usage-page .alert-light {
    --bs-alert-color: #4D4DAD;
    --bs-alert-bg: #F0F0FD;
    --bs-alert-border-color: C2C2F5;
}

.limits-page li {
    overflow: hidden;
}

.limits-page li:nth-of-type(even) {
    background-color: #f8f9fa;
}

.limits-page b {
    float: right;
    margin-left: 2rem;
}

.zendesk-page .card-body > div {
    padding: .25em 1.0em;
}

.zendesk-page tr:nth-of-type(even) {
    background-color: #f8f9fa;
}

.zendesk-page td div {
    padding: .25em 1.0em;
}

.zendesk-page td:first-child {
    font-weight: bold;
}

.stripe-page .card-body > div {
    padding: .25em 1.0em;
}

.stripe-page tr:nth-of-type(even) {
    background-color: #f8f9fa;
}

.stripe-page .list-group-item {
    margin-bottom: 1em;
}

.stripe-page li .d-inline {
    display: block !important;
}

.stripe-page td div {
    padding: .25em 1.0em;
}

.stripe-page td:first-child {
    font-weight: bold;
}


.sendgrid-page .list-group-item {
    margin-bottom: 1em;
}


.sendgrid-page li .d-inline {
    display: block !important;
}

.hubspot-page code {
    color: #000000;
    font-size: 1rem;
}

</style>

`
