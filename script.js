const toggleBtn = document.getElementById("theme-toggle");
		const body = document.body;

        if (localStorage.getItem("theme") === "dark") { 
            body.classList.add("dark-mode");
            toggleBtn.textContent = "Light Mode";
        }

		toggleBtn.addEventListener("click", ()=> {
			body.classList.toggle("dark-mode");

            const mode = body.classList.contains("dark-mode") ? "dark" : "light";
            localStorage.setItem("theme", mode);

			toggleBtn.textContent = theme === "dark" ? "Light Mode" : "Dark Mode"
		});