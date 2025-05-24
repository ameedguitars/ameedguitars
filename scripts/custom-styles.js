let tabbar = document.getElementById('tabbar');
let tabs = document.querySelectorAll('#tabbar li');

//tabs[0].classList.add("active");


tabbar.addEventListener("click", function (e) {
    if (e.target.tagName === 'LI') {
        let index = Array.from(tabs).indexOf(e.target);
        index
        tabs.forEach((tab, i) => {
            tab.classList.toggle('active', i === index);
            tab.classList.toggle('text-light-emphasis', i !== index);

        });
        // Show content for the clicked tab
        let contentDivs = document.querySelectorAll('.content');
        contentDivs.forEach(div => div.style.display = 'none');
        contentDivs[index].style.display = 'block';
    }
});

