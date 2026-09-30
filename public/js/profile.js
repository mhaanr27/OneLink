const username =
    window.location.pathname
        .split("/")
        .pop();


async function loadPublicProfile() {

    const response =
        await fetch(
            `/api/public/${username}`
        );

    if (!response.ok) {

        document.body.innerHTML =
            "<h1>Profile not found</h1>";

        return;
    }

    const data =
        await response.json();

    document.getElementById("name")
        .textContent =
        data.user.name;

    document.getElementById("bio")
        .textContent =
        data.user.bio;

    if (data.user.profile_photo) {

        document.getElementById("profilePhoto")
            .src =
            data.user.profile_photo;

    }


    const links =
        document.getElementById("links");

    data.links.forEach(link => {

        const a =
            document.createElement("a");

        a.href = link.url;

        a.textContent = link.title;

        a.target = "_blank";

        a.className = "public-link";

        links.appendChild(a);

    });

}


loadPublicProfile();