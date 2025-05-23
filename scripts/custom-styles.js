let tabbar = document.getElementById('tabbar');
let tabs = document.querySelectorAll('#tabbar li');

tabbar.addEventListener("click", function (e) {
    if (e.target.tagName === 'LI') {
        let index = Array.from(tabs).indexOf(e.target);
        index
        tabs.forEach((tab, i) => {
            tab.classList.toggle('active', i === index);
        });

        // Show content for the clicked tab
        let contentDivs = document.querySelectorAll('.content');
        contentDivs.forEach(div => div.style.display = 'none');
        contentDivs[index].style.display = 'block';
    }
});

