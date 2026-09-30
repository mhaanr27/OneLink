async function loadProfile() {
    const response = await fetch("/api/profile");

    if (!response.ok) {
        window.location.href = "/login.html";
        return;
    }

    const data = await response.json();

    document.getElementById("name").value = data.name || "";
    document.getElementById("bio").value = data.bio || "";

    const linksContainer = document.getElementById("links");

    linksContainer.innerHTML = "";

    data.links.forEach(link => {
        const div = document.createElement("div");

        div.innerHTML = `
            <p>
                <strong>${link.title}</strong>
                <br>
                ${link.url}
                <button onclick="deleteLink(${link.id})">
                    Delete
                </button>
            </p>
        `;

        linksContainer.appendChild(div);
    });
}


async function updateProfile() {

    const name = document.getElementById("name").value;
    const bio = document.getElementById("bio").value;

    const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: name,
            bio: bio
        })
    });

    const data = await response.json();

    alert(data.message);
}


async function addLink() {

    const title = document.getElementById("linkTitle").value;
    const url = document.getElementById("linkUrl").value;

    const response = await fetch("/api/profile/links", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title: title,
            url: url
        })
    });

    const data = await response.json();

    alert(data.message);

    loadProfile();
}


async function deleteLink(id) {

    const response = await fetch(`/api/profile/links/${id}`, {
        method: "DELETE"
    });

    const data = await response.json();

    alert(data.message);

    loadProfile();
}


async function logout() {

    await fetch("/api/auth/logout", {
        method: "POST"
    });

    window.location.href = "/login.html";
}


loadProfile();