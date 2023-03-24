//navbar for CHECK pages
export function navBar(session, visibility) {
    return `
    <nav class="navbar mb-5 me-auto navbar-light bg-light justify-content-left border-bottom">
        <h2 class="pb-2" style="color:#6767E6;">Support tool</h2>
        <div class="d-flex">

            <form class="${visibility}"action="/signOut" method="POST">
                ${session}
                <button class="btn btn-outline-primary my-2 my-sm-0 ms-2" type="submit">Sign Out</button>
            </form>
        </div>
    </nav>
`
}